// controllers/adminController.js
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const ErrorResponse = require("../utils/errorResponse");
const errorMessages = require("../utils/errorMessages");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select("-password");
    
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }
    
    await user.deleteOne();
    
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: {}
    });
});

/**
 * @desc    Assign role to a user
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
const assignUserRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    // Update this line to include 'trainer' role
    if (!role || !["user", "admin", "trainer"].includes(role.toLowerCase())) {
        return next(new ErrorResponse(errorMessages.INVALID_ROLE || "Invalid role", 400));
    }

    user.role = role.toLowerCase();
    await user.save();

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: user
    });
});


/**
 * @desc    Create a new product
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res, next) => {
    const { name, price } = req.body;
    
    if (!name || !price) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS || "Name and price are required", 400));
    }
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
});

/**
 * @desc    Update a product
 * @route   PUT /api/admin/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND, 404));
    }
    
    product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/admin/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND, 404));
    }
    
    await product.deleteOne();
    
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: {}
    });
});

/**
 * @desc    Get all orders
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find()
        .populate({
            path: "user",
            select: "name email"
        })
        .populate({
            path: "cart",
            populate: {
                path: "items.product",
                model: "Product"
            }
        })
        .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

/**
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));
    }
    
    // Validate status if provided
    if (status) {
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return next(new ErrorResponse(errorMessages.INVALID_STATUS || "Invalid status value", 400));
        }
        order.status = status;
    }
    
    // Validate payment status if provided
    if (paymentStatus) {
        const validPaymentStatuses = ["Pending", "Paid", "Failed", "Refunded", "Cancelled"];
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return next(new ErrorResponse(errorMessages.INVALID_PAYMENT_STATUS || "Invalid payment status value", 400));
        }
        order.paymentStatus = paymentStatus;
    }
    
    await order.save();
    
    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order
    });
});

/**
 * @desc    Cancel an order
 * @route   PUT /api/admin/orders/:id/cancel
 * @access  Private/Admin
 */
const cancelOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));
    }
    
    // Check if order can be cancelled (e.g., not already delivered)
    if (order.status === "Delivered") {
        return next(new ErrorResponse(errorMessages.CANNOT_CANCEL_DELIVERED || "Cannot cancel a delivered order", 400));
    }
    
    order.status = "Cancelled";
    await order.save();
    
    res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order
    });
});

module.exports = {
    getAllUsers,
    deleteUser,
    assignUserRole,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};
