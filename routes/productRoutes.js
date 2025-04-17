const express = require("express");
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protectMiddleware, authorizeRoles("admin"), createProduct);
router.put("/:id", protectMiddleware, authorizeRoles("admin"), updateProduct);
router.delete("/:id", protectMiddleware, authorizeRoles("admin"), deleteProduct);

module.exports = router;
