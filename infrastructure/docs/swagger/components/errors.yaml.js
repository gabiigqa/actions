/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error type or category
 *           example: 'Validation Error'
 *         message:
 *           type: string
 *           description: Human-readable error description
 *           example: 'Invalid email format'
 *         details:
 *           type: object
 *           description: Additional error details (optional)
 *           additionalProperties: true
 *       required: [error, message]
 *     
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: 'Validation Error'
 *         message:
 *           type: string
 *           example: 'Invalid input data'
 *         details:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           example:
 *             email: 'Invalid email format'
 *             password: 'Password must be at least 8 characters'
 *       required: [error, message]
 */
