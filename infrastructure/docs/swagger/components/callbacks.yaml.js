/**
 * @swagger
 * components:
 *   schemas:
 *     CallbackRequest:
 *       type: object
 *       properties:
 *         typeOperation:
 *           type: string
 *           enum: [DEPOSIT, WITHDRAWAL]
 *           description: Type of operation being processed
 *           example: 'DEPOSIT'
 *         idTransaction:
 *           type: string
 *           description: Unique transaction identifier
 *           example: 'TXN-12345-67890'
 *         data:
 *           type: object
 *           additionalProperties: true
 *           description: Additional data specific to the operation
 *           example:
 *             amount: 100.50
 *             currency: 'USD'
 *             accountId: 'ACC-98765'
 *             status: 'completed'
 *       required: [token, typeOperation, idTransaction]
 *     
 *     CallbackResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the callback was processed successfully
 *           example: true
 *         message:
 *           type: string
 *           description: Human-readable message describing the result
 *           example: 'Deposit operation processed successfully for transaction TXN-12345-67890'
 *         callbackId:
 *           type: string
 *           description: Unique identifier for the callback record
 *           example: '1634278000000-abc123def'
 *       required: [success, message]
 *     
 *     OperationType:
 *       type: string
 *       enum: [DEPOSIT, WITHDRAWAL]
 *       description: |
 *         Available operation types for partner callbacks:
 *         - **DEPOSIT**: Incoming money deposit operations
 *         - **WITHDRAWAL**: Outgoing money withdrawal operations  
 *       example: 'DEPOSIT'
 */
