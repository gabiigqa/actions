/**
 * Swagger Documentation Index
 * 
 * This file serves as an index for all Swagger documentation files.
 * Each file is imported to ensure they are scanned by swagger-jsdoc.
 * 
 * Structure:
 * - paths/: API endpoint documentation
 * - components/: Reusable schemas and components
 */

// Import all path documentation
import './paths/atc-callbacks.yaml.js';
import './paths/auth.yaml.js';
import './paths/callbacks.yaml.js';
import './paths/transactions.yaml.js';

// Import all component schemas  
import './components/atc-callbacks.yaml.js';
import './components/auth.yaml.js';
import './components/callbacks.yaml.js';
import './components/errors.yaml.js';
import './components/transactions.yaml.js';

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and session management
 *   - name: Transactions
 *     description: Financial transaction operations (deposits and withdrawals)
 *   - name: Partners
 *     description: Partner callback processing and integration
 *   - name: ATC Callbacks
 *     description: Automated Clearing House (ATC) callback processing for bank transactions
 */

export { };

