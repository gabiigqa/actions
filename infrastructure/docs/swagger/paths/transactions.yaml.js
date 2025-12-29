/**
 * @swagger
 * /transactions/deposit:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a deposit transaction
 *     description: |
 *       Create a new deposit transaction. The authenticated user's account will be used as the source (fromId).
 *       
 *       **Authentication Required:** This endpoint requires a valid JWT token in the Authorization header.
 *       
 *       **Process:**
 *       1. User must be authenticated with valid JWT token
 *       2. Provide destination account ID and amount
 *       3. Include unique idempotency key to prevent duplicate transactions
 *       4. Transaction will be processed and status returned
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepositTransactionRequest'
 *           example:
 *             amount: 100.50
 *             toId: "550e8400-e29b-41d4-a716-446655440001"
 *             idempotencyKey: "deposit-key-12345"
 *     responses:
 *       201:
 *         description: Deposit transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440003"
 *               amount: 100.50
 *               fromId: "authenticated-user-id"
 *               toId: "550e8400-e29b-41d4-a716-446655440001"
 *               status: "pending"
 *               type: "deposit"
 *               timestamp: "2025-09-11T10:30:00Z"
 *       400:
 *         description: Invalid request data or transaction creation failed
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   error: "Validation Error"
 *                   message: "Invalid input data"
 *                   details:
 *                     amount: "Amount must be greater than 0"
 *                     toId: "Destination account ID is required"
 *               transaction_failed:
 *                 summary: Transaction creation failed
 *                 value:
 *                   error: "Transaction creation failed"
 *                   message: "Unable to process deposit transaction"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Authentication Required"
 *               message: "Valid JWT token required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Internal Server Error"
 *               message: "Transaction processing error"
 * 
 * /transactions/withdrawal:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a withdrawal transaction
 *     description: |
 *       Create a new withdrawal transaction. The authenticated user's account will be used as the destination (toId).
 *       
 *       **Authentication Required:** This endpoint requires a valid JWT token in the Authorization header.
 *       
 *       **Process:**
 *       1. User must be authenticated with valid JWT token
 *       2. Provide source account ID and amount
 *       3. Include unique idempotency key to prevent duplicate transactions
 *       4. Transaction will be processed and status returned
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WithdrawalTransactionRequest'
 *           example:
 *             amount: 50.25
 *             fromId: "550e8400-e29b-41d4-a716-446655440002"
 *             idempotencyKey: "withdrawal-key-67890"
 *     responses:
 *       201:
 *         description: Withdrawal transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440004"
 *               amount: 50.25
 *               fromId: "550e8400-e29b-41d4-a716-446655440002"
 *               toId: "authenticated-user-id"
 *               status: "pending"
 *               type: "withdrawal"
 *               timestamp: "2025-09-11T10:35:00Z"
 *       400:
 *         description: Invalid request data or transaction creation failed
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   error: "Validation Error"
 *                   message: "Invalid input data"
 *                   details:
 *                     amount: "Amount must be greater than 0"
 *                     fromId: "Source account ID is required"
 *               transaction_failed:
 *                 summary: Transaction creation failed
 *                 value:
 *                   error: "Transaction creation failed"
 *                   message: "Unable to process withdrawal transaction"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Authentication Required"
 *               message: "Valid JWT token required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Internal Server Error"
 *               message: "Transaction processing error"
 */
