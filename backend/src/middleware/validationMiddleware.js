const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array(),
        });
    }
    next();
};

// User registration validation
const validateRegistration = [
    body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    handleValidationErrors,
];

// Login validation
const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Password is required'),
    handleValidationErrors,
];

// Mission creation validation
const validateMission = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('steps')
        .isArray({ min: 1 })
        .withMessage('Mission must have at least one step'),
    handleValidationErrors,
];

// Event tracking validation
const validateEvent = [
    body('type')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Event type is required'),
    body('metadata')
        .optional()
        .isObject()
        .withMessage('Metadata must be an object'),
    handleValidationErrors,
];

// Generic sanitization
const sanitizeInput = (req, res, next) => {
    // Remove any HTML tags from all string inputs
    const sanitize = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].replace(/<[^>]*>/g, '');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateMission,
    validateEvent,
    sanitizeInput,
    handleValidationErrors,
};
