export interface ConsultaQREstado {
    estado: string;
    fechaHora: string;
}

export interface ConsultaQRCliente {
    nombreCliente: string;
    ciCliente: string;
    numeroCuenta: string;
}

export interface ConsultaQRBanco {
    descripcion: string;
    sigla: string;
    codigoParticipante: string;
}

export interface ConsultaQRTransaccion {
    monto: number;
    moneda: string;
    fechaHoraTransaccion: string;
    cliente: ConsultaQRCliente;
    numeroAch: string;
    banco: ConsultaQRBanco;
}

export interface ConsultarQRResponse {
    codigoRespuesta: string;
    detalleRespuesta: string;
    estados: ConsultaQREstado[];
    transacciones: ConsultaQRTransaccion[];
}