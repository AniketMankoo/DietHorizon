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

    check("category")
        .notEmpty().withMessage("Category ID is required")
        .isMongoId().withMessage("Invalid category ID format"),

    check("stock")
        .notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    check("description")
        .optional()
        .isLength({ min: 5, max: 500 }).withMessage("Description must be between 5 and 500 characters")
        .trim()
        .escape(),

    check("images")
        .optional()
        .isArray({ min: 1 }).withMessage("At least one image is required")
        .custom((value) => {
            if (!value.every(url => typeof url === "string" && url.startsWith("http"))) {
                throw new Error("Each image must be a valid URL");
            }
            return true;
        }),

    check("brand")
        .optional()
        .isString().withMessage("Brand must be a valid string")
        .isLength({ min: 2, max: 50 }).withMessage("Brand must be between 2 and 50 characters")
        .trim()
        .escape(),
];
