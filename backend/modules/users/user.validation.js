const { body, validationResult } = require('express-validator');

const validateUser = [
    body('name').isString().withMessage('Name must be a string'),
    body('email').isEmail().withMessage('Invalid email'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateUser };
