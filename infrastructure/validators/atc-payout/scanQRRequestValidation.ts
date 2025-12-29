import { body } from 'express-validator';

/**
 * Validaciones para el endpoint de escanear QR
 * POST /api/atc/payout/scan
 */
export const ScanQRRequestValidations = [
    body('imagen')
        .notEmpty()
        .withMessage('QR image data is required')
        .isString()
        .withMessage('QR image data must be a string')
        .trim()
        .isLength({ min: 10 })
        .withMessage('QR image data appears to be invalid (too short)')
];
