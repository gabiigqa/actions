import { LeerQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/leer.qr.request';
import { LeerQRResponse } from '@/infrastructure/third-party/atc-red-enlace/entitites/leer.qr.response';
import { PagarQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/pagar.qr.request';
import { PagarQRResponse } from '@/infrastructure/third-party/atc-red-enlace/entitites/pagar.qr.response';

/**
 * Interface para el servicio de negocio de ATC Payout QR
 * Contiene la lógica de negocio para operaciones de payout con QR
 */
export interface IATCPayoutService {
    /**
     * Escanea (lee) una imagen QR y retorna información del destinatario
     * @param request - Datos del QR escaneado
     * @returns Información del destinatario validada
     */
    scanQR(request: LeerQRRequest): Promise<LeerQRResponse>;

    /**
     * Procesa el pago de un QR previamente escaneado
     * Incluye validaciones de negocio antes de ejecutar el pago
     * @param request - Datos de confirmación del pago
     * @returns Comprobante de la transacción aprobada
     */
    processPayment(request: PagarQRRequest): Promise<PagarQRResponse>;
}
