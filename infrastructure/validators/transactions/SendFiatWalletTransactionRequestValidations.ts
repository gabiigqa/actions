import { ValidationChain, body } from 'express-validator';

// Validation rules for send fiat wallet transaction request
export const SendFiatWalletTransactionRequestValidations: ValidationChain[] = [
  body('clientId')
    .exists({ checkFalsy: true })
    .withMessage('Client ID is required')
    .bail()
    .isUUID()
    .withMessage('Client ID must be a valid UUID'),

  body('walletId')
    .exists({ checkFalsy: true })
    .withMessage('Wallet ID is required')
    .bail()
    .isUUID()
    .withMessage('Wallet ID must be a valid UUID'),

  body('accountId')
    .exists({ checkFalsy: true })
    .withMessage('Account ID is required')
    .bail()
    .isUUID()
    .withMessage('Account ID must be a valid UUID'),

  body('fiatAmount')
    .exists({ checkFalsy: true })
    .withMessage('Fiat amount is required')
    .bail()
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

  // Beneficiary bank data validations
  body('beneficiaryBankData')
    .exists({ checkFalsy: true })
    .withMessage('Beneficiary bank data is required')
    .bail()
    .isObject()
    .withMessage('Beneficiary bank data must be an object'),

  body('beneficiaryBankData.bankCode')
    .exists({ checkFalsy: true })
    .withMessage('Bank code is required')
    .bail()
    .isString()
    .withMessage('Bank code must be a string')
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage('Bank code must be between 2 and 10 characters')
    .bail()
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Bank code must contain only uppercase letters and numbers'),

  body('beneficiaryBankData.accountNumber')
    .exists({ checkFalsy: true })
    .withMessage('Account number is required')
    .bail()
    .isString()
    .withMessage('Account number must be a string')
    .bail()
    .isLength({ min: 8, max: 20 })
    .withMessage('Account number must be between 8 and 20 characters')
    .bail()
    .matches(/^[0-9]+$/)
    .withMessage('Account number must contain only numbers'),

  body('beneficiaryBankData.accountType')
    .exists({ checkFalsy: true })
    .withMessage('Account type is required')
    .bail()
    .isString()
    .withMessage('Account type must be a string')
    .bail()
    .isIn(['savings', 'checking', 'current', 'deposit'])
    .withMessage('Account type must be one of: savings, checking, current, deposit'),

  body('beneficiaryBankData.accountHolderName')
    .exists({ checkFalsy: true })
    .withMessage('Account holder name is required')
    .bail()
    .isString()
    .withMessage('Account holder name must be a string')
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage('Account holder name must be between 2 and 100 characters')
    .bail()
    .matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/)
    .withMessage('Account holder name must contain only letters and spaces'),

  body('beneficiaryBankData.accountHolderCI')
    .exists({ checkFalsy: true })
    .withMessage('Account holder CI is required')
    .bail()
    .isString()
    .withMessage('Account holder CI must be a string')
    .bail()
    .isLength({ min: 5, max: 15 })
    .withMessage('Account holder CI must be between 5 and 15 characters')
    .bail()
    .matches(/^[0-9]+$/)
    .withMessage('Account holder CI must contain only numbers'),

  body('beneficiaryBankData.accountHolderPhone')
    .exists({ checkFalsy: true })
    .withMessage('Account holder phone is required')
    .bail()
    .isString()
    .withMessage('Account holder phone must be a string')
    .bail()
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Account holder phone must be a valid international phone number format (+country code + number)'),

  body('beneficiaryBankData.accountHolderEmail')
    .exists({ checkFalsy: true })
    .withMessage('Account holder email is required')
    .bail()
    .isEmail()
    .withMessage('Account holder email must be a valid email address')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Account holder email must be at most 100 characters'),
];