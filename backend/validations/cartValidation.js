// validations/cartValidation.js
const { check } = require("express-validator");

/**
 * Validation rules for adding item to cart
 */
exports.validateAddToCart = [
    check("productId")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID format"),

    check("quantity")
        .notEmpty().withMessage("Quantity is required")
        .isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),

    check()
        .custom(async (_, { req }) => {
            const { productId, quantity } = req.body;

            // This will be checked in controller as it requires DB access
            // We're just defining the validation structure here
            return true;
        })
];

/**
 * Validation rules for updating cart item quantity
 */
exports.validateUpdateCartItem = [
    check("productId")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID format"),

    check("quantity")
        .notEmpty().withMessage("Quantity is required")
        .isInt({ min: 1 }).withMessage("Quantity must be a positive integer")
];

/**
 * Validation for retrieving a cart by ID
 */
exports.validateCartId = [
    check("cartId")
        .notEmpty().withMessage("Cart ID is required")
        .isMongoId().withMessage("Invalid cart ID format")
];

/**
 * Validation for cart checkout
 */
exports.validateCartCheckout = [
    check("cartId")
        .notEmpty().withMessage("Cart ID is required")
        .isMongoId().withMessage("Invalid cart ID format"),

    check("paymentMethod")
        .notEmpty().withMessage("Payment method is required")
        .isIn(["COD", "Credit Card", "Debit Card", "UPI", "Net Banking"])
        .withMessage("Invalid payment method"),

    check("shippingAddress")
        .notEmpty().withMessage("Shipping address is required")
        .isMongoId().withMessage("Invalid shipping address ID"),

    check()
        .custom((_, { req }) => {
            // Check that cart belongs to user will be done in controller
            return true;
        })
];

/**
 * Validation for bulk cart operations
 */
exports.validateBulkAddToCart = [
    check("items")
        .isArray({ min: 1 }).withMessage("Items array is required and cannot be empty"),

    check("items.*.productId")
        .notEmpty().withMessage("Product ID is required for all items")
        .isMongoId().withMessage("Invalid product ID format"),

    check("items.*.quantity")
        .notEmpty().withMessage("Quantity is required for all items")
        .isInt({ min: 1 }).withMessage("Quantity must be a positive integer")
];

/**
 * Validation for cart item removal
 */
exports.validateRemoveCartItem = [
    check("productId")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID format")
];

/**
 * Cart validation as part of the order process
 */
exports.validateCartForOrder = [
    // These will be done in controller but defined here for documentation
    check()
        .custom(async (_, { req }) => {
            // Cart existence check
            // Cart ownership check
            // Cart items validity check
            // Stock availability check
            return true;
        })
];