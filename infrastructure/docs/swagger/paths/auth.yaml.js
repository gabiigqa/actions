/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User authentication
 *     description: |
 *       Authenticate a user with email and password credentials. 
 *       Returns a JWT token that must be included in subsequent API requests.
 *       
 *       **How to use the returned token:**
 *       1. Send POST request with valid email/password
 *       2. Copy the 'token' value from the 200 response (without quotes)
 *       3. Click the 'Authorize' button (🔒) at the top of this page
 *       4. Paste the token in the 'Value' field (do NOT include 'Bearer' prefix)
 *       5. Click 'Authorize' to apply authentication to all protected endpoints
 *       
 *       **Example token usage:**
 *       - Response token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       - Enter in Authorize dialog: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "user@mesa-pago.com"
 *             password: "SecurePassword123!"
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               message: "Login successful"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiZW1haWwiOiJ1c2VyQG1lc2EtcGFnby5jb20iLCJpYXQiOjE2MzQyNzgwMDB9.abc123"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               error: "Validation Error"
 *               message: "Invalid input data"
 *               details:
 *                 email: "Invalid email format"
 *                 password: "Password must be at least 8 characters"
 *       401:
 *         description: Authentication failed - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Authentication Failed"
 *               message: "Invalid email or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Internal Server Error"
 *               message: "Unknown error occurred during login"
 */
