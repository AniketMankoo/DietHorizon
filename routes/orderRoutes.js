const express = require("express");
const { 
  placeOrder, 
  getMyOrders, 
  getOrderById,
  cancelOrder, 
  updateOrderStatus 
} = require("../controllers/orderController");
const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { validatePlaceOrder, validateOrderStatusUpdate } = require("../validations/orderValidation");

const router = express.Router();

// User routes
router.post("/", protectMiddleware, validatePlaceOrder, validate, placeOrder);
router.get("/", protectMiddleware, getMyOrders);
router.get("/:id", protectMiddleware, getOrderById);
router.put("/:id/cancel", protectMiddleware, cancelOrder);

// Admin routes
router.put("/:id/status", protectMiddleware, authorizeRoles("admin"), validateOrderStatusUpdate, validate, updateOrderStatus);

module.exports = router;
