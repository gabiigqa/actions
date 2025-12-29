/**
 * @swagger
 * /partners/callback:
 *   post:
 *     tags:
 *       - Partners
 *     summary: Process partner callback
 *     description: |
 *       Processes callbacks from partner systems for various operations.
 *       
 *       This endpoint accepts callbacks from external partners and processes them based on the operation type.
 *       Each operation type is handled by a specific strategy implementation:
 *       - **DEPOSIT**: Handles incoming money deposits
 *       - **WITHDRAWAL**: Handles outgoing money withdrawals
 *       
 *       **Authentication:**
 *       This endpoint requires JWT authentication. Follow these steps:
 *       1. First, authenticate using POST /auth/login with valid credentials
 *       2. Copy the 'token' value from the login response
 *       3. Click the 'Authorize' button (🔒) at the top of this page
 *       4. Paste the token (without 'Bearer' prefix) and click 'Authorize'
 *       5. Now you can execute this endpoint successfully
 *       
 *       **Processing:**
 *       1. Validates the JWT token
 *       2. Validates the operation type
 *       3. Executes the appropriate strategy for the operation
 *       4. Records the callback for audit purposes
 *       5. Returns the processing result
 *       
 *       **Audit Trail:**
 *       All callbacks (successful and failed) are stored for audit and monitoring purposes.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CallbackRequest'
 *           examples:
 *             deposit_example:
 *               summary: Deposit callback example
 *               description: Example of a deposit operation callback
 *               value:
 *                 typeOperation: "DEPOSIT"
 *                 idTransaction: "TXN-DEP-12345"
 *                 data:
 *                   amount: 250.75
 *                   currency: "USD"
 *                   accountId: "ACC-98765"
 *                   status: "completed"
 *                   bankReference: "REF-BANK-456"
 *             withdrawal_example:
 *               summary: Withdrawal callback example
 *               description: Example of a withdrawal operation callback
 *               value:
 *                 typeOperation: "WITHDRAWAL"
 *                 idTransaction: "TXN-WTH-67890"
 *                 data:
 *                   amount: 150.00
 *                   currency: "USD"
 *                   accountId: "ACC-12345"
 *                   status: "processed"
 *                   feeAmount: 2.50
 *     responses:
 *       200:
 *         description: Callback processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CallbackResponse'
 *             examples:
 *               success_response:
 *                 summary: Successful processing
 *                 value:
 *                   success: true
 *                   message: "Deposit operation processed successfully for transaction TXN-DEP-12345"
 *                   callbackId: "1634278000000-abc123def"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   message: "Missing required fields: token, typeOperation, and idTransaction are required"
 *               invalid_operation:
 *                 summary: Invalid operation type
 *                 value:
 *                   success: false
 *                   message: "Invalid operation type. Valid types are: DEPOSIT, WITHDRAWAL"
 *       401:
 *         description: Authentication failed - invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Invalid or expired token"
 *       422:
 *         description: Callback processing failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CallbackResponse'
 *             example:
 *               success: false
 *               message: "Failed to process deposit operation: Insufficient funds"
 *               callbackId: "1634278000000-xyz789abc"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Unknown error occurred while processing callback"
 */
