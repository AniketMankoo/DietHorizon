const express = require("express");
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getRelatedProducts
} = require("../controllers/productController");
const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

// Admin-only routes
router.post("/", protectMiddleware, authorizeRoles("admin"), createProduct);
router.put("/:id", protectMiddleware, authorizeRoles("admin"), updateProduct);
router.delete("/:id", protectMiddleware, authorizeRoles("admin"), deleteProduct);

module.exports = router;
