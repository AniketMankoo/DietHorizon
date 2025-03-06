const axios = require("axios");

// External API Configuration
const RECIPE_API_URL = "https://api.spoonacular.com/recipes/findByIngredients";
const RECIPE_DETAILS_API_URL = "https://api.spoonacular.com/recipes/{id}/information";
const NUTRITION_API_URL = "https://api.spoonacular.com/recipes/{id}/nutritionWidget.json";
const API_KEY = process.env.SPOONACULAR_API_KEY; // Store API Key in .env

// In-memory storage for favorite recipes (Replace with DB later)
const favoriteRecipes = new Map();

/**
 * Generate Recipe Based on Ingredients (Includes cooking time, instructions, and nutrition)
 */
exports.generateRecipe = async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: "Ingredients are required and must be an array." });
        }

        const response = await axios.get(RECIPE_API_URL, {
            params: {
                ingredients: ingredients.join(","),
                number: 5,
                apiKey: API_KEY,
            },
        });

        let recipes = response.data;

        if (!recipes.length) {
            return res.status(404).json({ error: "No recipes found for the given ingredients." });
        }

        // Fetch additional details for each recipe
        const detailedRecipes = await Promise.all(
            recipes.map(async (recipe) => {
                const details = await axios.get(RECIPE_DETAILS_API_URL.replace("{id}", recipe.id), {
                    params: { apiKey: API_KEY },
                });
                return {
                    ...recipe,
                    cookingTime: details.data.readyInMinutes,
                    instructions: details.data.instructions,
                    nutrition: details.data.nutrition,
                };
            })
        );

        res.json({ recipes: detailedRecipes });

    } catch (error) {
        console.error("Error fetching recipes:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get Nutritional Information for a Recipe
 */
exports.getNutritionalInfo = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const response = await axios.get(NUTRITION_API_URL.replace("{id}", recipeId), {
            params: { apiKey: API_KEY },
        });

        res.json({ nutrition: response.data });

    } catch (error) {
        console.error("Error fetching nutrition info:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Suggest Healthier Ingredient Alternatives
 */
exports.suggestAlternatives = (req, res) => {
    const { ingredient } = req.body;

    const alternatives = {
        "sugar": "honey",
        "butter": "olive oil",
        "white rice": "brown rice",
        "milk": "almond milk",
        "salt": "low-sodium salt",
    };

    const suggestion = alternatives[ingredient.toLowerCase()] || "No alternative found.";

    res.json({ ingredient, alternative: suggestion });
};

/**
 * Calorie Counter - Calculate Total Calories from Ingredients
 */
exports.calculateCalories = async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: "Ingredients are required." });
        }

        let totalCalories = 0;

        for (const ingredient of ingredients) {
            const response = await axios.get("https://api.spoonacular.com/food/ingredients/search", {
                params: { query: ingredient, apiKey: API_KEY },
            });

            const data = response.data.results[0];
            if (data) {
                totalCalories += data.calories || 0;
            }
        }

        res.json({ ingredients, totalCalories });

    } catch (error) {
        console.error("Error calculating calories:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Save Recipe to Favorites
 */
exports.saveFavoriteRecipe = (req, res) => {
    const { userId, recipe } = req.body;

    if (!userId || !recipe) {
        return res.status(400).json({ error: "User ID and recipe are required." });
    }

    if (!favoriteRecipes.has(userId)) {
        favoriteRecipes.set(userId, []);
    }

    favoriteRecipes.get(userId).push(recipe);
    res.json({ message: "Recipe added to favorites!", favoriteRecipes: favoriteRecipes.get(userId) });
};

/**
 * Get Favorite Recipes
 */
exports.getFavoriteRecipes = (req, res) => {
    const { userId } = req.params;

    if (!favoriteRecipes.has(userId)) {
        return res.status(404).json({ error: "No favorite recipes found." });
    }

    res.json({ favoriteRecipes: favoriteRecipes.get(userId) });
};