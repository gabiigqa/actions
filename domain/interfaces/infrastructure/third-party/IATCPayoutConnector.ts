import { LeerQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/leer.qr.request';
import { LeerQRResponse } from '@/infrastructure/third-party/atc-red-enlace/entitites/leer.qr.response';
import { PagarQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/pagar.qr.request';
import { PagarQRResponse } from '@/infrastructure/third-party/atc-red-enlace/entitites/pagar.qr.response';

/**
 * Interface para el conector de ATC Payout QR
 * Define el contrato para interactuar con la API de ATC Payout
 */
export interface IATCPayoutConnector {
    /**
     * Escanea (lee) una imagen QR para obtener información del destinatario
     * @param request - Datos del QR escaneado
     * @returns Información del destinatario y transacción
     */
    scanQR(request: LeerQRRequest): Promise<LeerQRResponse>;

    /**
     * Confirma y ejecuta el pago de un QR previamente escaneado
     * @param request - Datos de confirmación del pago
     * @returns Comprobante de la transacción ejecutada
     */
    confirmPayment(request: PagarQRRequest): Promise<PagarQRResponse>;
}
