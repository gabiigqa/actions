import { body, ValidationChain } from 'express-validator';

/**
 * Validaciones para el endpoint de obtener detalles de payout
 * POST /api/transactions/payouts/details
 */
export const PayoutDetailsRequestValidations: ValidationChain[] = [
    body('payout_id')
        .exists({ checkFalsy: true })
        .withMessage('payout_id is required')
        .bail()
        .isString()
        .withMessage('payout_id must be a string')
        .trim()
];
