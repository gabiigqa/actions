import { ValidationChain, body } from 'express-validator';

// Allowed webhook events for validation
const ALLOWED_WEBHOOK_EVENTS = [
  'transaction.deposit.completed',
  'transaction.withdrawal.completed',
  'transaction.deposit.failed',
  'transaction.withdrawal.failed',
  'compliance.verification.completed',
  'compliance.verification.failed',
  'wallet.created',
  'wallet.updated',
  'wallet.suspended',
  'account.created',
  'account.updated',
  'account.suspended'
];

// Validation rules for create webhook request
export const ValidateCreateWebhookRequest: ValidationChain[] = [
  body('url')
    .exists({ checkFalsy: true })
    .withMessage('URL is required')
    .bail()
    .isString()
    .withMessage('URL must be a string')
    .bail()
    .isURL({ 
      protocols: ['http', 'https'], 
      require_protocol: true,
      require_host: true,
      require_valid_protocol: true 
    })
    .withMessage('URL must be a valid HTTP or HTTPS URL')
    .bail()
    .isLength({ max: 2048 })
    .withMessage('URL must not exceed 2048 characters'),

  body('apiKey')
    .exists({ checkFalsy: true })
    .withMessage('API key is required')
    .bail()
    .isString()
    .withMessage('API key must be a string')
    .bail()
    .isLength({ min: 10, max: 500 })
    .withMessage('API key must be between 10 and 500 characters')
    .bail()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('API key contains invalid characters. Only allowed: letters (a-z, A-Z) and numbers (0-9)'),

  body('method')
    .exists({ checkFalsy: true })
    .withMessage('HTTP method is required')
    .bail()
    .isString()
    .withMessage('HTTP method must be a string')
    .bail()
    .isIn(['POST', 'PUT', 'PATCH'])
    .withMessage('HTTP method must be POST, PUT, or PATCH'),

  body('events')
    .exists({ checkFalsy: true })
    .withMessage('Events object is required')
    .bail()
    .isObject()
    .withMessage('Events must be an object')
    .bail()
    .custom((events: Record<string, string[]>) => {
      const allowedCategories = ['transactions', 'compliances', 'wallets'];
      const categories = Object.keys(events);
      
      if (categories.length === 0) {
        throw new Error('Events object must contain at least one category');
      }
      
      // Check if all categories are allowed
      for (const category of categories) {
        if (!allowedCategories.includes(category)) {
          throw new Error(`Invalid event category: ${category}. Allowed categories: ${allowedCategories.join(', ')}`);
        }
      }
      
      let totalEventCount = 0;
      const allEvents: string[] = [];
      
      // Validate each category and its events
      for (const [category, categoryEvents] of Object.entries(events)) {
        if (!Array.isArray(categoryEvents)) {
          throw new Error(`Events for category '${category}' must be an array`);
        }
        
        if (categoryEvents.length === 0) {
          throw new Error(`Category '${category}' must contain at least one event`);
        }
        
        // Validate each event in the category
        for (const event of categoryEvents) {
          if (typeof event !== 'string') {
            throw new Error(`All events in category '${category}' must be strings`);
          }
          
          if (event.trim().length === 0) {
            throw new Error(`Empty events are not allowed in category '${category}'`);
          }
          
          allEvents.push(event);
        }
        
        totalEventCount += categoryEvents.length;
      }
      
      // Check total event count limit
      if (totalEventCount > 50) {
        throw new Error('Maximum 50 events allowed across all categories');
      }
      
      // Check for duplicate events across all categories
      const uniqueEvents = new Set(allEvents);
      if (uniqueEvents.size !== allEvents.length) {
        throw new Error('Duplicate events are not allowed across categories');
      }
      
      return true;
    }),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .bail()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
    .bail()
    .trim()
    .escape(),

  // Optional fields for additional webhook configuration
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),

  body('retryAttempts')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Retry attempts must be an integer between 0 and 10'),

  body('timeoutMs')
    .optional()
    .isInt({ min: 1000, max: 60000 })
    .withMessage('Timeout must be between 1000ms (1s) and 60000ms (60s)'),

  body('headers')
    .optional()
    .isObject()
    .withMessage('Headers must be an object')
    .bail()
    .custom((headers: Record<string, string>) => {
      const headerCount = Object.keys(headers).length;
      if (headerCount > 20) {
        throw new Error('Maximum 20 custom headers allowed');
      }
      
      for (const [key, value] of Object.entries(headers)) {
        if (typeof key !== 'string' || typeof value !== 'string') {
          throw new Error('All header keys and values must be strings');
        }
        
        if (key.length > 100 || value.length > 500) {
          throw new Error('Header keys must not exceed 100 characters and values must not exceed 500 characters');
        }
        
        // Prevent overriding critical headers
        const lowercaseKey = key.toLowerCase();
        if (['content-type', 'authorization', 'user-agent', 'host'].includes(lowercaseKey)) {
          throw new Error(`Cannot override system header: ${key}`);
        }
      }
      
      return true;
    })
];