const { check } = require("express-validator");

exports.validateCategory = [
    check("name")
        .notEmpty().withMessage("Category name is required")
        .isLength({ min: 3, max: 50 }).withMessage("Category name must be between 3 and 50 characters")
        .matches(/^[a-zA-Z0-9\s-]+$/).withMessage("Category name can only contain letters, numbers, spaces, and hyphens")
        .trim()
        .escape(),

    check("description")
        .optional()
        .isLength({ min: 5, max: 250 }).withMessage("Description must be between 5 and 250 characters")
        .trim()
        .escape(),

    check("parentCategory")
        .optional()
        .isMongoId().withMessage("Invalid parent category ID format"),
];
