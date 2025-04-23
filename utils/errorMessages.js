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
    
    // Role related errors
    INVALID_ROLE: "Invalid role"
};

module.exports = errorMessages;
