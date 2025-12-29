import { ValidationChain, body } from 'express-validator';

// Validation rules for callback request
export const CallbackRequestValidations: ValidationChain[] = [
    body('typeOperation')
        .exists({ checkFalsy: true })
        .withMessage('Type operation is required')
        .bail()
        .isString()
        .withMessage('Type operation must be a string'),

    body('idTransaction')
        .exists({ checkFalsy: true })
        .withMessage('Transaction ID is required')
        .bail()
        .isString()
        .withMessage('Transaction ID must be a string')
        .isLength({ min: 1 })
        .withMessage('Transaction ID cannot be empty'),

    body('data')
        .optional()
        .isObject()
        .withMessage('Data must be an object')
];
