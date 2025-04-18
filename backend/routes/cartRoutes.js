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
const validate = require("../middlewares/validateMiddleware");
const {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveCartItem
} = require("../validations/cartValidation");

const router = express.Router();

// All cart routes require authentication
router.use(protectMiddleware);

// Get current user's cart
router.get("/", getCart);

// Add item to cart - now with validation
router.post("/add", validateAddToCart, validate, addToCart);

// Update cart item quantity - now with validation
router.put("/items", validateUpdateCartItem, validate, updateCartItem);

// Remove item from cart - using productId param instead of validation
router.delete("/:productId", removeCartItem);

// Clear entire cart
router.delete("/", clearCart);

// Get cart summary (count and total price)
router.get("/summary", getCartSummary);

module.exports = router;