import { body } from 'express-validator';

/**
 * Validaciones para el endpoint de confirmar pago de QR
 * POST /api/atc/payout/confirm
 */
export const ConfirmPaymentRequestValidations = [
    body('numeroReferencia')
        .notEmpty()
        .withMessage('Transaction reference number is required')
        .isString()
        .withMessage('Transaction reference number must be a string')
        .trim(),

    body('origenNumeroReferencia')
        .notEmpty()
        .withMessage('Origin reference number is required')
        .isString()
        .withMessage('Origin reference number must be a string')
        .trim()
        .isLength({ max: 32 })
        .withMessage('Origin reference number must not exceed 32 characters'),

    body('monto')
        .notEmpty()
        .withMessage('Amount is required')
        .isString()
        .withMessage('Amount must be a string')
        .matches(/^\d+(\.\d{1,2})?$/)
        .withMessage('Amount must be in format "0.00"')
        .custom((value) => {
            const num = parseFloat(value);
            if (num < 0) {
                throw new Error('Amount cannot be negative');
            }
            return true;
        }),

    body('glosa')
        .optional()
        .isString()
        .withMessage('Glosa must be a string')
        .trim()
];
