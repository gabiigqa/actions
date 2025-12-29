export enum ATCStatusResponse {
    ACEPTADA = '00',
    RECHAZADA = '05',
}

export interface ATCCallbackResponse {
    numeroReferencia: string;
    codigoRespuesta: ATCStatusResponse;
    detalleRespuesta: string | null;
}