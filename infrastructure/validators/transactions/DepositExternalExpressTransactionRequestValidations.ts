import { ValidationChain, body } from 'express-validator';

// Validation rules for deposit external express transaction request
export const DepositExternalExpressTransactionRequestValidations: ValidationChain[] = [
   body('cryptoAmount')
    .exists({ checkFalsy: true })
    .withMessage('Crypto amount is required')
    .bail()
    .isNumeric()
    .withMessage('Crypto amount must be a number')
    .bail()
    .custom((value) => {
      const numValue = parseFloat(value);
      if (numValue <= 0) {
        throw new Error('Crypto amount must be greater than 0');
      }
      return true;
    }),

  body('asset')
    .exists({ checkFalsy: true })
    .withMessage('Asset is required')
    .bail()
    .isString()
    .withMessage('Asset must be a string')
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage('Asset must be between 2 and 10 characters')
    .bail()
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Asset must contain only uppercase letters and numbers'),

  body('fiatCurrency')
    .exists({ checkFalsy: true })
    .withMessage('Fiat currency is required')
    .bail()
    .isString()
    .withMessage('Fiat currency must be a string')
    .bail()
    .isLength({ min: 3, max: 3 })
    .withMessage('Fiat currency must be a 3-character currency code')
    .bail()
    .matches(/^[A-Z]{3}$/)
    .withMessage('Fiat currency must be a valid 3-letter uppercase currency code'),

  body('referenceId')
    .exists({ checkFalsy: true })
    .withMessage('Reference ID is required')
    .bail()
    .isString()
    .withMessage('Reference ID must be a string')
    .bail()
    .isLength({ min: 1, max: 100 })
    .withMessage('Reference ID must be between 1 and 100 characters'),

  body('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required')
    .bail()
    .isString()
    .withMessage('Country must be a string')
    .bail()
    .isLength({ min: 2, max: 2 })
    .withMessage('Country must be a 2-character country code')
    .bail()
    .matches(/^[A-Z]{2}$/)
    .withMessage('Country must be a valid 2-letter uppercase country code'),
];