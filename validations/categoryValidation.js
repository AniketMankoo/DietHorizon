const { check } = require("express-validator");

// ✅ Create/Update category validation
exports.validateCategory = [
    check("name")
        .notEmpty().withMessage("Category name is required")
        .isLength({ min: 3, max: 50 }).withMessage("Category name must be between 3 and 50 characters")
        .trim()
        .escape(),

    check("description")
        .notEmpty().withMessage("Category description is required")
        .isLength({ min: 5, max: 500 }).withMessage("Description must be between 5 and 500 characters")
        .trim()
        .escape(),

    check("parentCategory")
        .optional()
        .isMongoId().withMessage("Invalid parent category ID format"),
        
    check("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean value")
];

// For situations where only some fields need to be validated (like partial updates)
exports.validateCategoryUpdate = [
    check("name")
        .optional()
        .isLength({ min: 3, max: 50 }).withMessage("Category name must be between 3 and 50 characters")
        .trim()
        .escape(),

    check("description")
        .optional()
        .isLength({ min: 5, max: 500 }).withMessage("Description must be between 5 and 500 characters")
        .trim()
        .escape(),

    check("parentCategory")
        .optional()
        .isMongoId().withMessage("Invalid parent category ID format"),
        
    check("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean value")
];
