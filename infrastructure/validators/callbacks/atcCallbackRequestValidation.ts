import { ValidationChain, body } from 'express-validator';

// Validation rules for ATC callback request
export const ATCCallbackRequestValidations: ValidationChain[] = [
    body('numeroReferencia')
        .exists({ checkFalsy: true })
        .withMessage('Numero de referencia es requerido')
        .bail()
        .isNumeric()
        .withMessage('Numero de referencia debe ser un numero'),
    body('estado')
        .exists({ checkFalsy: true })
        .withMessage('Codigo de estado es requerido')
        .bail()
        .isString()
        .withMessage('Codigo de estado debe ser un string')
        .isLength({ min: 2, max: 2 })
        .withMessage('Codigo de estado no puede estar vacio'),

    body('transacciones')
        .exists({ checkFalsy: true })
        .withMessage('Transacciones es requerido')
        .bail()
        .isObject()
        .withMessage('Transacciones debe ser un objeto'),
];
