import { ValidationChain, body } from 'express-validator';

// Validation rules for update webhook request
export const ValidateUpdateWebhookRequest: ValidationChain[] = [
  // Global validation: At least one field must be present
  body()
    .custom((value, { req }) => {
      const allowedFields = ['url', 'apiKey', 'method', 'events', 'description', 'isActive', 'retryAttempts', 'timeoutMs', 'headers'];
      const bodyKeys = Object.keys(req.body || {});
      
      // Check if body is empty or null
      if (!req.body || bodyKeys.length === 0) {
        throw new Error('Request body cannot be empty. At least one field must be provided for update.');
      }
      
      // Check if at least one allowed field is present
      const hasValidField = bodyKeys.some(key => allowedFields.includes(key));
      if (!hasValidField) {
        throw new Error(`At least one valid field must be provided. Allowed fields: ${allowedFields.join(', ')}`);
      }
      
      return true;
    }),

  body('url')
    .optional()
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
    .optional()
    .isString()
    .withMessage('API key must be a string')
    .bail()
    .isLength({ min: 10, max: 500 })
    .withMessage('API key must be between 10 and 500 characters')
    .bail()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('API key contains invalid characters. Only allowed: letters (a-z, A-Z) and numbers (0-9)'),

  body('method')
    .optional()
    .isString()
    .withMessage('HTTP method must be a string')
    .bail()
    .isIn(['POST', 'PUT', 'PATCH'])
    .withMessage('HTTP method must be POST, PUT, or PATCH'),

  body('events')
    .optional()
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