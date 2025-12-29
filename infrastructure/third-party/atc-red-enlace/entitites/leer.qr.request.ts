/**
 * Request para leer (escanear) imagen QR
 * Endpoint: POST /api/v1/payout/qr/scan
 */
export interface LeerQRRequest {
    imagen: string;  // Cadena de texto obtenida al escanear el código QR
}
