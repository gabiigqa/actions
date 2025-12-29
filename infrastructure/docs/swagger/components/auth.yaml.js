/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: 'user@mesa-pago.com'
 *         password:
 *           type: string
 *           minLength: 8
 *           description: User password
 *           example: 'SecurePassword123!'
 *       required: [email, password]
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: 'Login successful'
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: '550e8400-e29b-41d4-a716-446655440000'
 *             email:
 *               type: string
 *               example: 'user@mesa-pago.com'
 *             name:
 *               type: string
 *               example: 'John Doe'
 *       required: [success, message]
 */
