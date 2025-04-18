const express = require("express");
const { 
  getCategories, 
  getCategoryById,
  createCategory, 
  updateCategory,
  deleteCategory 
} = require("../controllers/categoryController");
const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { validateCategory, validateCategoryUpdate } = require("../validations/categoryValidation");

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin-only routes
router.post(
  "/", 
  protectMiddleware, 
  authorizeRoles("admin"), 
  validateCategory, 
  validate, 
  createCategory
);

router.put(
  "/:id", 
  protectMiddleware, 
  authorizeRoles("admin"), 
  validateCategoryUpdate, 
  validate, 
  updateCategory
);

router.delete(
  "/:id", 
  protectMiddleware, 
  authorizeRoles("admin"), 
  deleteCategory
);

module.exports = router;
