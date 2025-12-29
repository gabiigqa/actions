import { ValidationChain, body } from 'express-validator';

// Validation rules for login request

export const SendDepositTransactionRequestValidations: ValidationChain[] = [
  body('amount')
    .exists({ checkFalsy: true })
    .withMessage('Amount is required')
    .bail()
    .isNumeric()
    .withMessage('Amount must be a number'),
  body('toId')
    .exists({ checkFalsy: true })
    .withMessage('To ID is required')
    .bail()
    .isString()
    .withMessage('To ID must be a string'),
  body('idempotencyKey')
    .exists({ checkFalsy: true })
    .withMessage('Idempotency Key is required')
    .bail()
    .isString()
    .withMessage('Idempotency Key must be a string'),
];

