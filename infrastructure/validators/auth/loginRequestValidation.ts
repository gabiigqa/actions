import { ValidationChain, body } from 'express-validator';

// Validation rules for login request

export const LoginRequestValidations: ValidationChain[] = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required')
    .bail()
    // Minimum length is a reasonable assumption; adjust if project requires different policy
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];
