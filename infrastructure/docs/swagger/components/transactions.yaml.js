/**
 * @swagger
 * components:
 *   schemas:
 *     # Deposit-specific request schema
 *     DepositTransactionRequest:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Amount to deposit
 *           example: 100.50
 *         toId:
 *           type: string
 *           description: Destination account ID
 *           example: '550e8400-e29b-41d4-a716-446655440001'
 *         idempotencyKey:
 *           type: string
 *           description: Unique key to prevent duplicate transactions
 *           example: 'deposit-key-12345'
 *       required: [amount, toId, idempotencyKey]
 *     
 *     # Withdrawal-specific request schema
 *     WithdrawalTransactionRequest:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Amount to withdraw
 *           example: 50.25
 *         fromId:
 *           type: string
 *           description: Source account ID to withdraw from
 *           example: '550e8400-e29b-41d4-a716-446655440002'
 *         idempotencyKey:
 *           type: string
 *           description: Unique key to prevent duplicate transactions
 *           example: 'withdrawal-key-67890'
 *       required: [amount, fromId, idempotencyKey]
 *     
 *     # Generic transaction request schema (if needed for other endpoints)
 *     TransactionRequest:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Transaction amount
 *           example: 100.50
 *         toId:
 *           type: string
 *           description: Destination account ID (for deposits)
 *           example: '550e8400-e29b-41d4-a716-446655440001'
 *         fromId:
 *           type: string
 *           description: Source account ID (for withdrawals)
 *           example: '550e8400-e29b-41d4-a716-446655440002'
 *         idempotencyKey:
 *           type: string
 *           description: Unique key to prevent duplicate transactions
 *           example: 'unique-key-12345'
 *       required: [amount, idempotencyKey]
 *     
 *     # Transaction response schema
 *     TransactionResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Transaction ID
 *           example: '550e8400-e29b-41d4-a716-446655440003'
 *         amount:
 *           type: number
 *           example: 100.50
 *         fromId:
 *           type: string
 *           example: '550e8400-e29b-41d4-a716-446655440002'
 *         toId:
 *           type: string
 *           example: '550e8400-e29b-41d4-a716-446655440001'
 *         status:
 *           type: string
 *           enum: [pending, completed, failed]
 *           example: 'pending'
 *         type:
 *           type: string
 *           enum: [deposit, withdrawal]
 *           example: 'deposit'
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: '2025-09-11T10:30:00Z'
 *       required: [id, amount, status, type, timestamp]
 */
