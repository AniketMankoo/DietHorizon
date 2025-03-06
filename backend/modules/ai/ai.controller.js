const axios = require("axios");

// External API Configuration
const RECIPE_API_URL = "https://api.spoonacular.com/recipes/findByIngredients";
const NUTRITION_API_URL = "https://api.spoonacular.com/recipes/{id}/nutritionWidget.json";
const API_KEY = process.env.SPOONACULAR_API_KEY; // Store API Key in .env

// In-memory storage for favorite recipes (Replace with DB later)
const favoriteRecipes = new Map();

// Healthier Ingredient Alternatives Map
const alternatives = {
    "sugar": "honey or stevia",
    "butter": "olive oil or avocado",
    "white rice": "brown rice or quinoa",
    "milk": "almond milk or oat milk",
    "salt": "low-sodium salt or herbs like basil",
    "flour": "whole wheat flour or almond flour",
    "potatoes": "sweet potatoes or cauliflower mash",
    "pasta": "zucchini noodles or whole wheat pasta",
    "cream": "Greek yogurt or coconut cream",
    "mayonnaise": "mashed avocado or Greek yogurt",
    "bread": "whole grain bread or lettuce wraps",
    "cheese": "nutritional yeast or low-fat cheese",
    "chocolate": "dark chocolate (70%+ cocoa) or cacao nibs",
    "fried food": "baked or air-fried alternatives",
    "soda": "sparkling water with lemon or kombucha",
    "ice cream": "banana nice cream or Greek yogurt with honey",
    "oil for frying": "baking or steaming instead",
    "white pasta": "chickpea pasta or lentil pasta",
    "processed meat": "lean meats like chicken or tofu",
    "corn syrup": "maple syrup or agave nectar",
    "soy sauce": "coconut aminos or tamari",
    "ketchup": "homemade tomato puree with herbs",
    "canned beans": "cooked dried beans (less sodium)"
};

/**
 * Generate Recipe Based on Ingredients (With Healthier Alternatives)
 */
exports.generateRecipe = async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: "Ingredients are required and must be an array." });
        }

        // Suggest healthier alternatives where possible
        const modifiedIngredients = ingredients.map(ing => alternatives[ing.toLowerCase()] || ing);

        const response = await axios.get(RECIPE_API_URL, {
            params: {
                ingredients: modifiedIngredients.join(","), // Convert array to comma-separated string
                number: 5, // Fetch 5 recipes
                apiKey: API_KEY,
            },
        });

        const recipes = response.data;

        if (!recipes.length) {
            return res.status(404).json({ error: "No recipes found for the given ingredients." });
        }

        res.json({ recipes, modifiedIngredients });

    } catch (error) {
        console.error("Error fetching recipes:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get Nutritional Information for a Recipe (Total Macronutrients)
 */
exports.getRecipeNutrition = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const response = await axios.get(NUTRITION_API_URL.replace("{id}", recipeId), {
            params: { apiKey: API_KEY },
        });

        const nutritionData = response.data;
        const totalNutrition = {
            calories: nutritionData.calories,
            protein: nutritionData.protein,
            carbs: nutritionData.carbs,
            fat: nutritionData.fat,
        };

        res.json({ totalNutrition });

    } catch (error) {
        console.error("Error fetching nutrition info:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Suggest Healthier Ingredient Alternatives (Standalone API)
 */
exports.suggestAlternatives = (req, res) => {
    const { ingredient } = req.body;
    const suggestion = alternatives[ingredient.toLowerCase()] || "No alternative found.";
    res.json({ ingredient, alternative: suggestion });
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
