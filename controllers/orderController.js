// controllers/orderController.js
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.placeOrder = asyncHandler(async (req, res, next) => {
  const { cartId, paymentMethod, shippingAddress } = req.body;
  
  if (!cartId || !paymentMethod || !shippingAddress) {
    return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
  }

  // Find the cart and verify it belongs to the user
  const cart = await Cart.findById(cartId).populate("items.product");
  
  if (!cart) {
    return next(new ErrorResponse(errorMessages.CART_NOT_FOUND || "Cart not found", 404));
  }
  
  if (cart.user.toString() !== req.user.id) {
    return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 403));
  }

  // Check if cart is empty
  if (cart.items.length === 0) {
    return next(new ErrorResponse(errorMessages.CART_EMPTY || "Cannot place order with empty cart", 400));
  }

  // Check product availability
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    
    if (!product) {
      return next(new ErrorResponse(`Product ${item.product.name} no longer exists`, 400));
    }
    
    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
    }
    
    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  // Create new order
  const order = await Order.create({
    user: req.user.id,
    cart: cart._id,
    totalAmount: cart.totalPrice,
    paymentMethod,
    shippingAddress,
    status: "Pending",
    paymentStatus: "Pending",
    orderDate: Date.now()
  });

  // Clear the cart or mark it as processed
  cart.isActive = false;
  await cart.save();

  // Return the created order
  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate({
      path: "cart",
      populate: {
        path: "items.product",
        model: "Product",
        select: "name price images"
      }
    });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: populatedOrder
  });
});

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders
 * @access  Private
 */
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate({
      path: "cart",
      populate: {
        path: "items.product",
        model: "Product",
        select: "name price images"
      }
    })
    .sort({ orderDate: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "cart",
      populate: {
        path: "items.product",
        model: "Product",
        select: "name price images"
      }
    });

  if (!order) {
    return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));
  }

  // Users can only access their own orders
  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Cancel an order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));
  }

  // Users can only cancel their own orders
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 403));
  }

  // Only allow cancellation if the order is in Pending or Processing state
  if (!["Pending", "Processing"].includes(order.status)) {
    return next(new ErrorResponse(errorMessages.CANNOT_CANCEL_ORDER || "Order cannot be cancelled in its current state", 400));
  }

  order.status = "Cancelled";
  
  // If the order was paid, set payment status to Refunded
  if (order.paymentStatus === "Paid") {
    order.paymentStatus = "Refunded";
  } else {
    order.paymentStatus = "Cancelled";
  }

  await order.save();

  // Return stock to inventory
  const cart = await Cart.findById(order.cart).populate("items.product");
  
  if (cart && cart.items.length > 0) {
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  // Populate the order with necessary information for the response
  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate({
      path: "cart",
      populate: {
        path: "items.product",
        model: "Product",
        select: "name price images"
      }
    });

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: populatedOrder
  });
});

/**
 * @desc    Get all orders (admin only)
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate({
      path: "cart",
      populate: {
        path: "items.product",
        model: "Product",
        select: "name price images"
      }
    })
    .sort({ orderDate: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

/**
 * @desc    Update order status (admin only)
 * @route   PUT /api/admin/orders/:id
 * @access  Private/Admin
 */
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  if (!status && !paymentStatus) {
    return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS || "Please provide at least status or paymentStatus", 400));
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));
  }

  // Validate status if provided
  if (status) {
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse(errorMessages.INVALID_STATUS, 400));
    }
    order.status = status;
  }

  // Validate payment status if provided
  if (paymentStatus) {
    const validPaymentStatuses = ["Pending", "Paid", "Failed", "Refunded", "Cancelled"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return next(new ErrorResponse(errorMessages.INVALID_PAYMENT_STATUS, 400));
    }
    order.paymentStatus = paymentStatus;
  }

  await order.save();

  // Handle stock updates if order is cancelled and items should be returned to inventory
  if (status === "Cancelled" && order.status !== "Cancelled") {
    const cart = await Cart.findById(order.cart).populate("items.product");
    
    if (cart && cart.items.length > 0) {
      for (const item of cart.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
  }

  // Populate the order with necessary information for the response
  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate({
      path: "cart",
      populate: {
        path: "items.product",
        model: "Product",
        select: "name price images"
      }
    });

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: populatedOrder
  });
});

module.exports = {
  placeOrder: exports.placeOrder,
  getMyOrders: exports.getMyOrders,
  getOrderById: exports.getOrderById,
  cancelOrder: exports.cancelOrder,
  getAllOrders: exports.getAllOrders,
  updateOrderStatus: exports.updateOrderStatus
};
