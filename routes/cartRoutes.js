const express = require("express");
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart,
  getCartSummary
} = require("../controllers/cartController");
const { protectMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// All cart routes require authentication
router.use(protectMiddleware);

// Get current user's cart
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/items", updateCartItem);

// Remove item from cart
router.delete("/:productId", removeCartItem);

// Clear entire cart
router.delete("/", clearCart);

// Get cart summary (count and total price)
router.get("/summary", getCartSummary);

module.exports = router;
