import { ValidationChain, body } from 'express-validator';

// Validation rules for calculated exchange rate request
export const CalculatedExchangeRateRequestValidator: ValidationChain[] = [
  body('transactionType')
    .exists({ checkFalsy: true })
    .withMessage('Transaction type is required')
    .bail()
    .isString()
    .withMessage('Transaction type must be a string')
    .bail()
    .isLength({ min: 1, max: 50 })
    .withMessage('Transaction type must be between 1 and 50 characters'),

  body('cryptoAsset')
    .exists({ checkFalsy: true })
    .withMessage('Crypto asset is required')
    .bail()
    .isString()
    .withMessage('Crypto asset must be a string')
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage('Crypto asset must be between 2 and 10 characters')
    .bail()
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Crypto asset must contain only uppercase letters and numbers'),

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

  body('fiatAmount')
    .optional()
    .isNumeric()
    .withMessage('Fiat amount must be a number')
    .bail()
    .custom((value) => {
      const numValue = parseFloat(value);
      if (numValue <= 0) {
        throw new Error('Fiat amount must be greater than 0');
      }
      return true;
    }),

  body('cryptoAmount')
    .optional()
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

  // Custom validation to ensure at least one amount is provided
  body()
    .custom((value, { req }) => {
      const { fiatAmount, cryptoAmount } = req.body;
      
      if (!fiatAmount && !cryptoAmount) {
        throw new Error('Either fiatAmount or cryptoAmount must be provided');
      }
      
      if (fiatAmount && cryptoAmount) {
        throw new Error('Only one of fiatAmount or cryptoAmount should be provided, not both');
      }
      
      return true;
    })
];
