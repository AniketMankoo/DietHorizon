const express = require("express");
const { dietSeeAll, dietSeeOne, dietCreate, dietUpdate, dietDelete } = require("./diet.controller");
const { validateDiet } = require("./diet.validation");

const router = express.Router();

router.get("/", dietSeeAll);          
router.get("/:id", dietSeeOne);      
router.post("/", validateDiet, dietCreate); 
router.put("/:id", validateDiet, dietUpdate);  
router.delete("/:id", dietDelete);    

module.exports = router;
