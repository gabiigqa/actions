/**
 * @swagger
 * /partners/callback/atc:
 *   post:
 *     tags:
 *       - ATC Callbacks
 *     summary: Process ATC callback
 *     description: |
 *       Procesa callbacks del sistema ATC (Automated Clearing House) para transacciones bancarias.
 *       
 *       Este endpoint recibe notificaciones del sistema ATC sobre el estado de transacciones
 *       bancarias procesadas. El sistema ATC envía información detallada sobre:
 *       - Estado de la transacción (APROBADA, EXPIRADA, INVALIDO)
 *       - Datos del cliente involucrado
 *       - Información del banco origen
 *       - Detalles de la transacción (monto, moneda, fecha/hora)
 *       
 *       **Autenticación:**
 *       Este endpoint requiere autenticación mediante API Key. El sistema ATC debe incluir
 *       la clave API en el header `X-API-KEY` de cada solicitud.
 *       
 *       **Procesamiento:**
 *       1. Valida la API Key del sistema ATC
 *       2. Valida el formato y contenido de la solicitud
 *       3. Procesa el callback y registra la transacción
 *       4. Retorna confirmación de recepción
 *       
 *       **Estados de Transacción:**
 *       - **00 (APROBADA)**: La transacción fue aprobada exitosamente
 *       - **03 (EXPIRADA)**: La transacción expiró antes de ser procesada
 *       - **05 (INVALIDO)**: La transacción contiene información inválida
 *       
 *       **Códigos de Respuesta:**
 *       - **00 (ACEPTADA)**: El callback fue recibido y procesado correctamente
 *       - **05 (RECHAZADA)**: El callback fue rechazado por errores en el procesamiento
 *       
 *       **Auditoría:**
 *       Todos los callbacks ATC son registrados para auditoría y trazabilidad de transacciones.
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ATCCallbackRequest'
 *           examples:
 *             aprobada_example:
 *               summary: Transacción aprobada
 *               description: Ejemplo de callback para una transacción ATC aprobada exitosamente
 *               value:
 *                 numeroReferencia: "REF-ATC-20251006-001"
 *                 estado: "00"
 *                 transacciones:
 *                   monto: "1500.50"
 *                   moneda: "BOB"
 *                   fechaHoraTransaccion: "2025-10-06T15:30:00Z"
 *                   cliente:
 *                     nombreCliente: "Juan Pérez"
 *                     ciCliente: "12345678"
 *                     numeroCuenta: "1234567890"
 *                   numeroAch: "ACH123456789"
 *                   banco:
 *                     descripcion: "Banco Nacional de Bolivia"
 *                     sigla: "BNB"
 *                     codigoParticipante: "001"
 *             expirada_example:
 *               summary: Transacción expirada
 *               description: Ejemplo de callback para una transacción ATC que expiró
 *               value:
 *                 numeroReferencia: "REF-ATC-20251006-002"
 *                 estado: "03"
 *                 transacciones:
 *                   monto: "750.00"
 *                   moneda: "BOB"
 *                   fechaHoraTransaccion: "2025-10-06T10:00:00Z"
 *                   cliente:
 *                     nombreCliente: "María García"
 *                     ciCliente: "87654321"
 *                     numeroCuenta: "0987654321"
 *                   numeroAch: "ACH987654321"
 *                   banco:
 *                     descripcion: "Banco Mercantil Santa Cruz"
 *                     sigla: "BMSC"
 *                     codigoParticipante: "002"
 *             invalido_example:
 *               summary: Transacción inválida
 *               description: Ejemplo de callback para una transacción ATC con datos inválidos
 *               value:
 *                 numeroReferencia: "REF-ATC-20251006-003"
 *                 estado: "05"
 *                 transacciones:
 *                   monto: "2000.00"
 *                   moneda: "BOB"
 *                   fechaHoraTransaccion: "2025-10-06T12:15:00Z"
 *                   cliente:
 *                     nombreCliente: "Carlos López"
 *                     ciCliente: "11223344"
 *                     numeroCuenta: "4455667788"
 *                   numeroAch: "ACH112233445"
 *                   banco:
 *                     descripcion: "Banco de Crédito"
 *                     sigla: "BCP"
 *                     codigoParticipante: "003"
 *     responses:
 *       200:
 *         description: Callback ATC procesado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ATCCallbackResponse'
 *             examples:
 *               success_response:
 *                 summary: Procesamiento exitoso
 *                 description: El callback fue recibido y procesado correctamente
 *                 value:
 *                   numeroReferencia: "REF-ATC-20251006-001"
 *                   codigoRespuesta: "00"
 *                   detalleRespuesta: null
 *       400:
 *         description: Datos de solicitud inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               missing_fields:
 *                 summary: Campos requeridos faltantes
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "numeroReferencia"
 *                       message: "Numero de referencia es requerido"
 *                     - field: "estado"
 *                       message: "Codigo de estado es requerido"
 *                     - field: "transacciones"
 *                       message: "Transacciones es requerido"
 *               invalid_estado:
 *                 summary: Código de estado inválido
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "estado"
 *                       message: "Codigo de estado debe tener exactamente 2 caracteres"
 *               invalid_transacciones:
 *                 summary: Formato de transacciones inválido
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "transacciones"
 *                       message: "Transacciones debe ser un objeto"
 *       401:
 *         description: Autenticación fallida - API Key inválida o faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_api_key:
 *                 summary: API Key faltante
 *                 value:
 *                   success: false
 *                   message: "API Key is required"
 *               invalid_api_key:
 *                 summary: API Key inválida
 *                 value:
 *                   success: false
 *                   message: "Invalid API Key"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ATCCallbackResponse'
 *             examples:
 *               server_error:
 *                 summary: Error durante el procesamiento
 *                 value:
 *                   numeroReferencia: "REF-ATC-20251006-001"
 *                   codigoRespuesta: "05"
 *                   detalleRespuesta: "Error occurred while processing ATC callback"
 */
