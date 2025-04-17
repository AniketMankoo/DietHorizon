const express = require("express");
const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { validateProduct } = require("../validations/productValidation");
const { validateOrderStatus } = require("../validations/orderValidation");
const { validateUserRole } = require("../validations/userValidation");

const {
    getAllUsers, deleteUser, assignUserRole,
    createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus, cancelOrder
} = require("../controllers/adminController");

const router = express.Router();

router.use(protectMiddleware);
router.use(authorizeRoles("Admin"));

router.get("/users", getAllUsers);
router.put("/users/:id/role", validateUserRole, validate, assignUserRole);
router.delete("/users/:id", deleteUser);

router.post("/products", validateProduct, validate, createProduct);
router.put("/products/:id", validateProduct, validate, updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getAllOrders);
router.put("/orders/:id", validateOrderStatus, validate, updateOrderStatus);
router.delete("/orders/:id", cancelOrder);

module.exports = router;
