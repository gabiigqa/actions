import { body, ValidationChain } from 'express-validator';

/**
 * Validaciones para el endpoint de leer QR desde imagen
 * POST /api/transactions/payouts
 */
export const QRReadTransactionRequestValidations: ValidationChain[] = [
    body('image')
        .exists({ checkFalsy: true })
        .withMessage('image is required')
        .bail()
        .isString()
        .withMessage('image must be a Base64 string')
        .trim()
        .custom((value) => {
            // Validar que sea un Base64 válido (con o sin prefijo data:image)
            const base64Pattern = /^(data:image\/\w+;base64,)?[A-Za-z0-9+/=]+$/;

            if (!base64Pattern.test(value)) {
                throw new Error('image must be a valid Base64 string');
            }

            // Validar longitud mínima (imagen muy pequeña probablemente no es válida)
            const base64Data = value.replace(/^data:image\/\w+;base64,/, '');
            if (base64Data.length < 100) {
                throw new Error('Image appears to be too small or invalid');
            }

            return true;
        }),

    body('funding_source')
        .exists({ checkFalsy: true })
        .withMessage('funding_source is required')
        .bail()
        .isString()
        .withMessage('funding_source must be a string')
        .isIn(['balance', 'conversion'])
        .withMessage('funding_source must be either "balance" or "conversion"')
];
