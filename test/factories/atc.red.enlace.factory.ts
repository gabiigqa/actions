import { ATCRedEnlaceConnector } from "@/infrastructure/third-party/atc-red-enlace/atc.red.enlace.connector";
import { GenerarQRResponse } from "@/infrastructure/third-party/atc-red-enlace/entitites/generar.qr.response";
import { ConsultarQRResponse } from "@/infrastructure/third-party/atc-red-enlace/entitites/consultar.qr.response";

// Tipo para el mock
export type MockATCRedEnlaceConnector = jest.Mocked<ATCRedEnlaceConnector>;

export const createATCRedEnlaceMock = (): MockATCRedEnlaceConnector => {
    const mock = {
        generarQR: jest.fn(),
        consultarQR: jest.fn(),
    } as unknown as MockATCRedEnlaceConnector;

    // --- Helpers ---

    // Exito al generar QR
    (mock as any).givenGenerarQRSucceeds = (idTransaccionString = 'trans-123', qrImage = 'base64-image-data') => {
        const response: GenerarQRResponse = {
            codigoRespuesta: '0', // 0 suele ser éxito
            mensajeRespuesta: 'Procesado correctamente',
            idTransaccionString: idTransaccionString,
            imagenQr: qrImage,
            fechaProceso: new Date().toISOString()
        } as any; // Cast as any si faltan propiedades opcionales

        mock.generarQR.mockResolvedValue(response);
        return mock;
    };

    // Error al generar QR
    (mock as any).givenGenerarQRFails = (errorCode = '101', errorMessage = 'Error en validación') => {
         // Si tu implementación lanza excepción en error de fetch
        mock.generarQR.mockRejectedValue(new Error(`ATC Red Enlace API call failed: ${errorMessage}`));
        return mock;
    };

    // Exito al consultar QR
    (mock as any).givenConsultarQRSucceeds = (estado = 'PAGADO', idTransaccion = 'trans-123') => {
        const response: ConsultarQRResponse = {
            codigoRespuesta: '0',
            mensajeRespuesta: 'Consulta Exitosa',
            estadoTransaccion: estado,
            idTransaccion: idTransaccion,
            monto: 100
        } as any;

        mock.consultarQR.mockResolvedValue(response);
        return mock;
    };

     // Error al consultar
     (mock as any).givenConsultarQRThrows = () => {
        mock.consultarQR.mockRejectedValue(new Error('Network Error'));
        return mock;
    };

    return mock;
};