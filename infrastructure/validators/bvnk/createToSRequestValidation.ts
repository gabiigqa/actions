import { ValidationChain, body } from 'express-validator';

export const CreateToSRequestValidations: ValidationChain[] = [
    body('type')
        .exists({ checkFalsy: true })
        .withMessage('Type is required')
        .bail(),
    body('useCase')
        .exists({ checkFalsy: true })
        .withMessage('Use case is required')
        .bail(),
    body('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required')
        .bail()
        .isLength({ min: 2, max: 2 })
        .withMessage('Country must be a valid ISO 3166-1 alpha-2 country code')
];