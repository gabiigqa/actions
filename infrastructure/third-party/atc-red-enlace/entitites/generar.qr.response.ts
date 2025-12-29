export interface GenerarQRResponse {
    moneda: string; // formato: USD|BOB
    monto: number; // formato: 0.00, bigdecimal(10,2)
    origenNumeroReferencia: string;
    numeroReferencia: string; 
    codigoRespuesta: string;
    detalleRespuesta: string;
    imagen:string; // formato: base64
}