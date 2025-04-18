// controllers/cartController.js
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Get current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res, next) => {
  // Find cart for current user
  let cart = await Cart.findOne({ user: req.user.id })
    .populate({
      path: 'items.product',
      select: 'name price images stock'
    });

  // If no cart exists, create one
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!productId || !quantity || quantity <= 0) {
    return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS || "Product ID and quantity are required", 400));
  }

  // Check if product exists and has enough stock
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND || "Product not found", 404));
  }

  if (product.stock < quantity) {
    return next(new ErrorResponse(errorMessages.INSUFFICIENT_STOCK || "Not enough items in stock", 400));
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity if product already in cart
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    // Check if new quantity exceeds stock
    if (newQuantity > product.stock) {
      return next(new ErrorResponse(errorMessages.INSUFFICIENT_STOCK || "Not enough items in stock", 400));
    }

    cart.items[existingItemIndex].quantity = newQuantity;
    cart.items[existingItemIndex].price = product.price;
  } else {
    // Add new item to cart
    cart.items.push({
      product: productId,
      quantity: quantity,
      price: product.price
    });
  }

  await cart.save();

  // Populate the cart with product details for response
  cart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name price images stock'
  });

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart
  });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!productId || !quantity) {
    return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS || "Product ID and quantity are required", 400));
  }

  if (quantity <= 0) {
    return next(new ErrorResponse("Quantity must be greater than 0", 400));
  }

  // Find cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse(errorMessages.CART_NOT_FOUND || "Cart not found", 404));
  }

  // Find product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND || "Product not found", 404));
  }

  // Check stock
  if (product.stock < quantity) {
    return next(new ErrorResponse(errorMessages.INSUFFICIENT_STOCK || "Not enough items in stock", 400));
  }

  // Find item in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingItemIndex === -1) {
    return next(new ErrorResponse("Item not in cart", 404));
  }

  // Update quantity
  cart.items[existingItemIndex].quantity = quantity;
  cart.items[existingItemIndex].price = product.price;

  await cart.save();

  // Populate the cart with product details for response
  cart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name price images stock'
  });

  res.status(200).json({
    success: true,
    message: 'Cart item updated',
    data: cart
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
const removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  // Find cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse(errorMessages.CART_NOT_FOUND || "Cart not found", 404));
  }

  // Find item in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingItemIndex === -1) {
    return next(new ErrorResponse("Item not in cart", 404));
  }

  // Remove item
  cart.items.splice(existingItemIndex, 1);

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: cart
  });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = asyncHandler(async (req, res, next) => {
  // Find user's cart
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse(errorMessages.CART_NOT_FOUND || "Cart not found", 404));
  }

  // Clear cart items
  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: cart
  });
});

/**
 * @desc    Get cart summary (item count & total price)
 * @route   GET /api/cart/summary
 * @access  Private
 */
const getCartSummary = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(200).json({
      success: true,
      data: { count: 0, totalPrice: 0 }
    });
  }

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  res.status(200).json({
    success: true,
    data: {
      count: itemCount,
      totalPrice: cart.totalPrice
    }
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartSummary
};