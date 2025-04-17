const { check } = require("express-validator");

exports.validateUserRegistration = [
    check("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3, max: 25 }).withMessage("Name must be between 3 and 25 characters")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces")
        .trim()
        .escape(),

    check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail()
        .trim(),

    check("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/\d/).withMessage("Password must contain at least one digit")
        .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character (!@#$%^&*)")
        .trim(),

    check("role")
        .optional()
        .isIn(["Customer", "Admin"]).withMessage("Invalid role. Must be 'Customer' or 'Admin'"),

    check("countryCode")
        .notEmpty().withMessage("Country Code is required")
        .matches(/^\+\d{1,3}$/).withMessage("Invalid Country Code format")
        .trim(),

    check("phone")
        .notEmpty().withMessage("Phone number is required")
        .customSanitizer(value => value.replace(/\D/g, ""))
        .matches(/^\d{10}$/).withMessage("Invalid phone number. Must be a 10-digit number")
        .trim(),

    check("address.street")
        .optional()
        .isString().withMessage("Street must be a string")
        .trim()
        .escape(),

    check("address.city")
        .optional()
        .isString().withMessage("City must be a string")
        .trim()
        .escape(),

    check("address.state")
        .optional()
        .isString().withMessage("State must be a string")
        .trim()
        .escape(),

    check("address.country")
        .optional()
        .isString().withMessage("Country must be a string")
        .trim()
        .escape(),

    check("address.postalCode")
        .optional()
        .matches(/^\d{6}$/).withMessage("Invalid postal code. Must be a 6-digit PIN code")
        .trim(),
];

exports.validateUserProfileUpdate = [
    check("name")
        .optional()
        .isLength({ min: 3, max: 25 }).withMessage("Name must be between 3 and 25 characters")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces")
        .trim()
        .escape(),

    check("email")
        .optional()
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail()
        .trim(),

    check("password")
        .optional()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/\d/).withMessage("Password must contain at least one digit")
        .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character (!@#$%^&*)")
        .trim(),

    check("phone")
        .optional()
        .customSanitizer(value => value.replace(/\D/g, ""))
        .matches(/^\d{10}$/).withMessage("Invalid phone number. Must be a 10-digit number")
        .trim(),

    check("address.street")
        .optional()
        .isString().withMessage("Street must be a string")
        .trim()
        .escape(),

    check("address.city")
        .optional()
        .isString().withMessage("City must be a string")
        .trim()
        .escape(),

    check("address.state")
        .optional()
        .isString().withMessage("State must be a string")
        .trim()
        .escape(),

    check("address.country")
        .optional()
        .isString().withMessage("Country must be a string")
        .trim()
        .escape(),

    check("address.postalCode")
        .optional()
        .matches(/^\d{6}$/).withMessage("Invalid postal code. Must be a 6-digit PIN code")
        .trim(),
];

exports.validateUserLogin = [
    check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail()
        .trim(),

    check("password")
        .notEmpty().withMessage("Password is required")
        .trim(),
];

exports.validateUserRole = [
    check("role")
        .notEmpty().withMessage("Role is required")
        .isIn(["Customer", "Admin"]).withMessage("Invalid role. Must be 'Customer' or 'Admin'"),
];
