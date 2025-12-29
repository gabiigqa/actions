/**
 * Response al leer (escanear) imagen QR
 * Contiene la información del destinatario antes de realizar el pago
 */
export interface LeerQRResponse {
    titularDestino: string;      // Nombre del destinatario de la transacción
    cuentaDestino: string;       // Número de cuenta del destinatario
    moneda: string;              // Código de la moneda ("BOB")
    monto: number;               // Monto de la transacción (puede ser 0)
    glosa?: string;              // Campo opcional para comentarios
    numeroReferencia: string;    // Identificador único generado por ATC
}
