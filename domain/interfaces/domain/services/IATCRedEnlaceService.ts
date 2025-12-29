import { ATCCallbackRequest } from '@/domain/interfaces/infrastructure/controllers/requests/Callbacks/ATCCallbackRequest';
import { ConsultarQRResponse } from '@infrastructure/third-party/atc-red-enlace/entitites/consultar.qr.response';
import { GenerarQRRequest } from '@infrastructure/third-party/atc-red-enlace/entitites/generar.qr.request';
import { GenerarQRResponse } from '@infrastructure/third-party/atc-red-enlace/entitites/generar.qr.response';

/**
 * Interface for ATC Red Enlace service.
 * Defines the contract for business logic operations related to ATC Red Enlace integration.
 */
export interface IATCRedEnlaceService {
    /**
     * Generates a QR code for payment processing through ATC Red Enlace.
     * @param data - The request data containing payment information
     * @returns Promise with the QR generation response including base64 image
     */
    generateQR(data: GenerarQRRequest): Promise<GenerarQRResponse>;

    /**
     * Consults the status and details of a QR code by reference number.
     * @param numeroReferencia - The reference number of the QR code to consult
     * @returns Promise with the QR consultation response including transaction details
     */
    consultaQRByReferenceNumber(numeroReferencia: string): Promise<ConsultarQRResponse>;

    /**
     * Updates the callback data received from ATC Red Enlace.
     * @param data - The callback request data from ATC Red Enlace
     * @param xApiKey - The API key from the request header for authentication
     * @returns Promise that resolves when the update is complete
     */
    updateCallbackData(data: ATCCallbackRequest, xApiKey: string): Promise<void>
}