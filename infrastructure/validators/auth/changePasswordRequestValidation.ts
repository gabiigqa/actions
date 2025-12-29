import { ValidationChain, body } from 'express-validator';

// Validation rules for change password request

export const ChangePasswordRequestValidations: ValidationChain[] = [
  body('currentPassword')
    .exists({ checkFalsy: true })
    .withMessage('Current password is required')
    .bail()
    .isString()
    .withMessage('Current password must be a string'),
  body('newPassword')
    .exists({ checkFalsy: true })
    .withMessage('New password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
];
