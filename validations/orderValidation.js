const { check } = require("express-validator");

exports.validateOrder = [
    check("user")
        .notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid user ID format"),

    check("items")
        .notEmpty().withMessage("Order must have at least one item")
        .isArray({ min: 1 }).withMessage("Order must contain at least one item"),

    check("items.*.product")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID format"),

    check("items.*.quantity")
        .notEmpty().withMessage("Quantity is required")
        .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

    check("totalAmount")
        .notEmpty().withMessage("Total amount is required")
        .isFloat({ min: 0.01 }).withMessage("Total amount must be a positive number"),

    check("status")
        .optional()
        .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
        .withMessage("Invalid status. Must be 'Pending', 'Processing', 'Shipped', 'Delivered', or 'Cancelled'"),
];

exports.validateOrderStatus = [
    check("status")
        .notEmpty().withMessage("Order status is required")
        .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
        .withMessage("Invalid status. Must be 'Pending', 'Processing', 'Shipped', 'Delivered', or 'Cancelled'"),
];
