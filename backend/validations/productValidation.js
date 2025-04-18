const { check } = require("express-validator");

exports.validateProduct = [
    check("name")
        .notEmpty().withMessage("Product name is required")
        .isLength({ min: 3, max: 50 }).withMessage("Product name must be between 3 and 50 characters")
        .trim()
        .escape(),

    check("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ min: 0.01 }).withMessage("Price must be a positive number"),

    check("stock")
        .notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    check("description")
        .optional()
        .isLength({ min: 5, max: 500 }).withMessage("Description must be between 5 and 500 characters")
        .trim()
        .escape(),

    check("category")
        .notEmpty().withMessage("Category is required")
        .isMongoId().withMessage("Invalid category ID format"),

    check("images")
        .optional()
        .isArray({ min: 1 }).withMessage("At least one image is required")
        .custom((value) => {
            if (!value.every(url => typeof url === 'string' && url.trim().length > 0)) {
                throw new Error("Each image must be a valid URL or file path");
            }
            return true;
        }),

    check("brand")
        .optional()
        .isString().withMessage("Brand must be a valid string")
        .isLength({ min: 2, max: 50 }).withMessage("Brand must be between 2 and 50 characters")
        .trim()
        .escape(),
    
    check("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean value"),
    
    check("featured")
        .optional()
        .isBoolean().withMessage("Featured must be a boolean value"),
    
    check("discount")
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage("Discount must be between 0 and 100 percent")
];

// Product update validation - all fields optional
exports.validateProductUpdate = [
    check("name")
        .optional()
        .isLength({ min: 3, max: 50 }).withMessage("Product name must be between 3 and 50 characters")
        .trim()
        .escape(),

    check("price")
        .optional()
        .isFloat({ min: 0.01 }).withMessage("Price must be a positive number"),

    check("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    check("description")
        .optional()
        .isLength({ min: 5, max: 500 }).withMessage("Description must be between 5 and 500 characters")
        .trim()
        .escape(),

    check("category")
        .optional()
        .isMongoId().withMessage("Invalid category ID format"),

    check("images")
        .optional()
        .isArray().withMessage("Images must be an array")
        .custom((value) => {
            if (!value.every(url => typeof url === 'string' && url.trim().length > 0)) {
                throw new Error("Each image must be a valid URL or file path");
            }
            return true;
        }),

    check("brand")
        .optional()
        .isString().withMessage("Brand must be a valid string")
        .isLength({ min: 2, max: 50 }).withMessage("Brand must be between 2 and 50 characters")
        .trim()
        .escape(),
    
    check("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean value"),
    
    check("featured")
        .optional()
        .isBoolean().withMessage("Featured must be a boolean value"),
    
    check("discount")
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage("Discount must be between 0 and 100 percent")
];
