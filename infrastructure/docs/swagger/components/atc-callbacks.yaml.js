/**
 * @swagger
 * components:
 *   schemas:
 *     ATCClientRequest:
 *       type: object
 *       required:
 *         - nombreCliente
 *         - ciCliente
 *         - numeroCuenta
 *       properties:
 *         nombreCliente:
 *           type: string
 *           description: Nombre del cliente
 *           example: "Juan Pérez"
 *         ciCliente:
 *           type: string
 *           description: Cédula de identidad del cliente
 *           example: "12345678"
 *         numeroCuenta:
 *           type: string
 *           description: Número de cuenta del cliente
 *           example: "1234567890"
 *     
 *     ATCBankRequest:
 *       type: object
 *       required:
 *         - descripcion
 *         - sigla
 *         - codigoParticipante
 *       properties:
 *         descripcion:
 *           type: string
 *           description: Descripción del banco
 *           example: "Banco Nacional de Bolivia"
 *         sigla:
 *           type: string
 *           description: Sigla del banco
 *           example: "BNB"
 *         codigoParticipante:
 *           type: string
 *           description: Código de participante del banco
 *           example: "001"
 *     
 *     ATCTransactionRequest:
 *       type: object
 *       required:
 *         - monto
 *         - moneda
 *         - fechaHoraTransaccion
 *         - cliente
 *         - numeroAch
 *         - banco
 *       properties:
 *         monto:
 *           type: string
 *           description: Monto de la transacción
 *           example: "1500.50"
 *         moneda:
 *           type: string
 *           description: Código de moneda
 *           example: "BOB"
 *         fechaHoraTransaccion:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la transacción
 *           example: "2025-10-06T15:30:00Z"
 *         cliente:
 *           $ref: '#/components/schemas/ATCClientRequest'
 *         numeroAch:
 *           type: string
 *           description: Número ACH de la transacción
 *           example: "ACH123456789"
 *         banco:
 *           $ref: '#/components/schemas/ATCBankRequest'
 *     
 *     ATCCallbackRequest:
 *       type: object
 *       required:
 *         - numeroReferencia
 *         - estado
 *         - transacciones
 *       properties:
 *         numeroReferencia:
 *           type: string
 *           description: Número de referencia único de la transacción
 *           minLength: 1
 *           example: "REF-ATC-20251006-001"
 *         estado:
 *           type: string
 *           description: |
 *             Estado de la transacción ATC
 *             - **00**: APROBADA - Transacción aprobada exitosamente
 *             - **03**: EXPIRADA - Transacción expirada
 *             - **05**: INVALIDO - Transacción inválida
 *           enum:
 *             - "00"
 *             - "03"
 *             - "05"
 *           minLength: 2
 *           maxLength: 2
 *           example: "00"
 *         transacciones:
 *           $ref: '#/components/schemas/ATCTransactionRequest'
 *     
 *     ATCCallbackResponse:
 *       type: object
 *       required:
 *         - numeroReferencia
 *         - codigoRespuesta
 *       properties:
 *         numeroReferencia:
 *           type: string
 *           description: Número de referencia de la transacción procesada
 *           example: "REF-ATC-20251006-001"
 *         codigoRespuesta:
 *           type: string
 *           description: |
 *             Código de respuesta del procesamiento
 *             - **00**: ACEPTADA - Callback procesado exitosamente
 *             - **05**: RECHAZADA - Callback rechazado por error
 *           enum:
 *             - "00"
 *             - "05"
 *           example: "00"
 *         detalleRespuesta:
 *           type: string
 *           nullable: true
 *           description: Detalle adicional de la respuesta (presente en caso de error)
 *           example: null
 *   
 *   securitySchemes:
 *     apiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-KEY
 *       description: |
 *         API Key authentication for ATC callbacks.
 *         Provide the API key in the X-API-KEY header.
 */
