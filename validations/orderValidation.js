const { check } = require("express-validator");

// ✅ Place order validation
exports.validatePlaceOrder = [
    check("cartId")
        .notEmpty().withMessage("Cart ID is required")
        .isMongoId().withMessage("Invalid cart ID format"),

    check("paymentMethod")
        .notEmpty().withMessage("Payment method is required")
        .isIn(["CreditCard", "DebitCard", "PayPal", "Cash"]).withMessage("Invalid payment method"),

    check("shippingAddress")
        .notEmpty().withMessage("Shipping address is required")
        .isMongoId().withMessage("Invalid shipping address ID format")
];

// ✅ Order status update validation
exports.validateOrderStatus = [
    check("status")
        .optional()
        .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
        .withMessage("Invalid status. Must be 'Pending', 'Processing', 'Shipped', 'Delivered', or 'Cancelled'"),

    check("paymentStatus")
        .optional()
        .isIn(["Pending", "Paid", "Failed", "Refunded", "Cancelled"])
        .withMessage("Invalid payment status. Must be 'Pending', 'Paid', 'Failed', 'Refunded', or 'Cancelled'")
];

// ✅ Ensure at least one field is provided for update
exports.validateOrderStatusUpdate = [
    ...exports.validateOrderStatus,
    check()
        .custom((value, { req }) => {
            if (!req.body.status && !req.body.paymentStatus) {
                throw new Error("Please provide at least status or paymentStatus");
            }
            return true;
        })
];
