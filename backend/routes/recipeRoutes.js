// In backend/routes/recipeRoutes.js
const express = require('express');
const { getRecipesByIngredients } = require('../controllers/recipeController');
const router = express.Router();

router.post('/', getRecipesByIngredients);

module.exports = router;
    