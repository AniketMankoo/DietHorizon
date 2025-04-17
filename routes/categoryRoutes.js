const express = require("express");
const { getCategories, createCategory, deleteCategory } = require("../controllers/categoryController");
const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getCategories);

router.post("/", protectMiddleware, authorizeRoles("admin"), createCategory);
router.delete("/:id", protectMiddleware, authorizeRoles("admin"), deleteCategory);

module.exports = router;
