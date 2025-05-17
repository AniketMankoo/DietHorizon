const { check } = require('express-validator');

exports.validateDietPlan = [
    check('title')
        .notEmpty().withMessage('Title is required')
        .trim(),

    check('userId')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID format'),

    check('meals')
        .isArray().withMessage('Meals must be an array')
        .notEmpty().withMessage('At least one meal is required'),

    check('meals.*.name')
        .notEmpty().withMessage('Meal name is required'),

    check('meals.*.time')
        .notEmpty().withMessage('Meal time is required'),

    check('meals.*.description')
        .notEmpty().withMessage('Meal description is required'),

    check('meals.*.calories')
        .notEmpty().withMessage('Calories are required')
        .isNumeric().withMessage('Calories must be a number')
];
