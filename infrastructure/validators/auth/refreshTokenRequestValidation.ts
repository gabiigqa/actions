import { ValidationChain, body } from 'express-validator';

// Validation rules for refresh token request

export const RefreshTokenRequestValidations: ValidationChain[] = [
  body('refreshToken')
    .exists({ checkFalsy: true })
    .withMessage('Refresh token is required')
    .bail()
    .isString()
    .withMessage('Refresh token must be a string')
];
