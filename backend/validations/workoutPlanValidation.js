const { check } = require('express-validator');

exports.validateWorkoutPlan = [
    check('title')
        .notEmpty().withMessage('Title is required')
        .trim(),

    check('userId')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID format'),

    check('exercises')
        .isArray().withMessage('Exercises must be an array')
        .notEmpty().withMessage('At least one exercise is required'),

    check('exercises.*.name')
        .notEmpty().withMessage('Exercise name is required'),

    check('exercises.*.sets')
        .notEmpty().withMessage('Number of sets is required')
        .isNumeric().withMessage('Sets must be a number'),

    check('exercises.*.reps')
        .notEmpty().withMessage('Reps information is required'),

    check('exercises.*.day')
        .notEmpty().withMessage('Day assignment is required')
        .isNumeric().withMessage('Day must be a number')
];
