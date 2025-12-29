/**
 * Response al pagar imagen QR
 * Contiene el comprobante de la transacción aprobada
 */
export interface PagarQRResponse {
    numeroReferencia: string;           // Identificador único generado por ATC
    origenNumeroReferencia: string;     // Identificador único generado por el comercio
    fechaTransaccion: string;           // Fecha y hora de la transacción (formato: "27/08/2025 14:17:35")
    cuentaOrigen: string;               // Cuenta de origen de la transacción
    titularOrigen?: string;             // Titular de la cuenta de origen (opcional)
    cuentaDestino: string;              // Cuenta destino de la transacción
    titularDestino: string;             // Titular de la cuenta destino
    monto: number;                      // Monto de la transacción
    moneda: string;                     // Código de la moneda ("BOB")
    glosa: string;                      // Comentario de la transacción
}
