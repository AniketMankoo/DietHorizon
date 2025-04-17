const { check } = require("express-validator");

// ✅ Registration validation
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
        .isIn(["user", "trainer", "admin"]).withMessage("Invalid role. Must be 'user', 'trainer' or 'admin'")
];

// ✅ Profile update validation
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
        .trim()
];

// ✅ Login validation
exports.validateUserLogin = [
    check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail()
        .trim(),

    check("password")
        .notEmpty().withMessage("Password is required")
        .trim()
];

// ✅ Change password validation
exports.validateChangePassword = [
    check("currentPassword")
        .notEmpty().withMessage("Current password is required")
        .trim(),

    check("newPassword")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
        .matches(/\d/).withMessage("New password must contain at least one digit")
        .matches(/[!@#$%^&*]/).withMessage("New password must contain at least one special character (!@#$%^&*)")
        .trim()
];

// ✅ Role validation
exports.validateUserRole = [
    check("role")
        .notEmpty().withMessage("Role is required")
        .isIn(["user", "trainer", "admin"]).withMessage("Invalid role. Must be 'user', 'trainer' or 'admin'")
];

// ✅ Alias for validateUserRole
exports.validateAssignRole = exports.validateUserRole;

// ✅ Forgot password validation
exports.validateForgotPassword = [
    check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail()
        .trim()
];

// ✅ Reset password validation
exports.validateResetPassword = [
    check("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/\d/).withMessage("Password must contain at least one digit")
        .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character (!@#$%^&*)")
        .trim()
];
