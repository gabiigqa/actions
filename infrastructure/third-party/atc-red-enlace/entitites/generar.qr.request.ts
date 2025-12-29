export interface GenerarQRRequest {
    numeroReferencia: number; // mínimo 1 digit, máximo 10 digits 
    monto: number; // formato: 0.00, bigdecimal(10,2)
    moneda: string; // formato: USD|BOB
    glosa: string; // formato: =codSucursal|nombreSucursal|rubroComercio|glosa del cliente 
    canal: string; // formato: =WEB|MOVIL|DESKTOP
    tiempoQr: string; // formato: en horas HH:MM:SS, máximo 8760 horas
    campoExtra?: string; // opcional
}