// In backend/controllers/recipeController.js
const axios = require('axios');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Get recipes by ingredients
 * @route   POST /api/recipes
 * @access  Public
 */
const getRecipesByIngredients = asyncHandler(async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients) {
        return res.status(400).json({
            success: false,
            message: 'Please provide ingredients'
        });
    }

    const apiKey = process.env.SPOONACULAR_API_KEY; // Store this in your .env file

    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
            params: {
                ingredients: ingredients,
                number: 10,
                apiKey: apiKey,
                ranking: 1,
                ignorePantry: true
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Spoonacular API Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching recipes from external API'
        });
    }
});

module.exports = { getRecipesByIngredients };
