import { ValidationChain, body } from 'express-validator';

// Validation rules for login request

export const SendWithdrawalTransactionRequestValidations: ValidationChain[] = [
  body('amount')
    .exists({ checkFalsy: true })
    .withMessage('Amount is required')
    .bail()
    .isNumeric()
    .withMessage('Amount must be a number'),
  body('fromId')
    .exists({ checkFalsy: true })
    .withMessage('From ID is required')
    .bail()
    .isString()
    .withMessage('From ID must be a string'),
  body('idempotencyKey')
    .exists({ checkFalsy: true })
    .withMessage('Idempotency Key is required')
    .bail()
    .isString()
    .withMessage('Idempotency Key must be a string'),
];

