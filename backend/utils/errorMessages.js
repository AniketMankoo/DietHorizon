// utils/errorMessages.js
const errorMessages = {
    // User related errors
    USER_NOT_FOUND: "User not found",
    EMAIL_IN_USE: "Email is already in use",
    INVALID_CREDENTIALS: "Invalid credentials",
    EMAIL_EXISTS: "Email already exists",
    REQUIRED_FIELDS: "Please provide all required fields",

    // Authentication errors
    UNAUTHORIZED: "Unauthorized access",
    INVALID_TOKEN: "Invalid token",
    ACCESS_DENIED: "Access denied",
    FORBIDDEN: "Forbidden action",

    // Product related errors
    PRODUCT_NOT_FOUND: "Product not found",
    INSUFFICIENT_STOCK: "Insufficient stock",

    // Order related errors
    ORDER_NOT_FOUND: "Order not found",
    INVALID_STATUS: "Invalid order status",
    INVALID_PAYMENT_STATUS: "Invalid payment status",
    CANNOT_CANCEL_DELIVERED: "Cannot cancel a delivered order",
    CANNOT_CANCEL_ORDER: "Order cannot be cancelled in its current state",

    // Category related errors
    CATEGORY_NOT_FOUND: "Category not found",
    CATEGORY_EXISTS: "Category with this name already exists",

    // Cart related errors
    CART_NOT_FOUND: "Cart not found",

    // Role related errors
    INVALID_ROLE: "Invalid role",

    // Token related errors
    TOKEN_EXPIRED: "Token has expired"
};

module.exports = errorMessages;