export interface ATCClientRequest {
    nombreCliente: string;
    ciCliente: string;
    numeroCuenta: string;
}

export interface ATCBankRequest {
    descripcion: string;
    sigla: string;
    codigoParticipante: string;
}

export interface ATCTransationRequest {
    monto: string;
    moneda: string;
    fechaHoraTransaccion: string;
    cliente: ATCClientRequest;
    numeroAch: string;
    banco: ATCBankRequest;
}

export enum ATCStatus {
    APROBADA = '00',
    EXPIRADA = '03',
    INVALIDO = '05',
}

export interface ATCCallbackRequest {
    numeroReferencia: string;
    estado: ATCStatus;
    transacciones: ATCTransationRequest
}