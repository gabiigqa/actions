import { ConsultarQRResponse } from '@infrastructure/third-party/atc-red-enlace/entitites/consultar.qr.response';
import { GenerarQRRequest } from '@infrastructure/third-party/atc-red-enlace/entitites/generar.qr.request';
import { GenerarQRResponse } from '@infrastructure/third-party/atc-red-enlace/entitites/generar.qr.response';

/**
 * Interface for ATC Red Enlace connector service.
 * Defines the contract for interacting with ATC Red Enlace API for QR code generation and consultation.
 */
export interface IATCRedEnlaceConnector {
    /**
     * Generates a QR code for payment processing.
     * @param data - The request data containing payment information
     * @returns Promise with the QR generation response including base64 image
     */
    generarQR(data: GenerarQRRequest): Promise<GenerarQRResponse>;

    /**
     * Consults the status and details of a QR code by reference number.
     * @param numeroReferencia - The reference number of the QR code to consult
     * @returns Promise with the QR consultation response including transaction details
     */
    consultarQR(numeroReferencia: string): Promise<ConsultarQRResponse>;
}