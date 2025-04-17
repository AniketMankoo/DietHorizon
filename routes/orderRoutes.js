const express = require("express");
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protectMiddleware, placeOrder);
router.get("/my-orders", protectMiddleware, getMyOrders);
router.get("/", protectMiddleware, authorizeRoles("admin"), getAllOrders);
router.put("/:id/status", protectMiddleware, authorizeRoles("admin"), updateOrderStatus);

module.exports = router;
