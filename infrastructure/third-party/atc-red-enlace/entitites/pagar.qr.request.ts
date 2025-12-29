/**
 * Request para pagar imagen QR previamente leída
 * Endpoint: POST /api/v1/payout/qr/confirm
 */
export interface PagarQRRequest {
    numeroReferencia: string;           // Identificador único generado por ATC (del scan)
    origenNumeroReferencia: string;     // Identificador único generado por el comercio (max 32 chars)
    monto: string;                      // Monto de la transacción (formato: "10.00")
    glosa?: string;                     // Comentario de la transacción (opcional)
}

/**
 * Nota sobre los campos:
 *
 * - monto: Debe ser mayor a cero cuando al leer la imagen QR el valor obtenido sea 0.
 *          En caso contrario, se debe enviar "0.00".
 *
 * - glosa: Debe enviarse siempre que al leer la imagen QR el campo glosa
 *          no exista o esté vacío. En caso contrario, no se debe incluir.
 */
