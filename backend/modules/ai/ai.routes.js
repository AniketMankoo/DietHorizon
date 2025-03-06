const express = require("express");
const router = express.Router();
const { generateRecipe } = require("./ai.controller");

router.post("/recipe", generateRecipe);

module.exports = router;