import { body } from 'express-validator';

/**
 * Validaciones para el endpoint de extraer QR de imagen
 * POST /api/atc/payout/extract-qr
 */
export const ExtractQRRequestValidations = [
    body('image')
        .notEmpty()
        .withMessage('Image is required')
        .isString()
        .withMessage('Image must be a Base64 string')
        .trim()
        .custom((value) => {
            // Validar que sea un Base64 válido
            const base64Pattern = /^(data:image\/\w+;base64,)?[A-Za-z0-9+/=]+$/;

            if (!base64Pattern.test(value)) {
                throw new Error('Image must be a valid Base64 string');
            }

            // Validar longitud mínima (imagen muy pequeña probablemente no es válida)
            const base64Data = value.replace(/^data:image\/\w+;base64,/, '');
            if (base64Data.length < 100) {
                throw new Error('Image appears to be too small or invalid');
            }

            return true;
        })
];
