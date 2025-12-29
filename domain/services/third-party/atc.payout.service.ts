import { IATCPayoutService } from '@/domain/interfaces/domain/services/IATCPayoutService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IATCPayoutConnector } from '@/domain/interfaces/infrastructure/third-party/IATCPayoutConnector';
import { TYPES } from '@/infrastructure/config/inversify';
import { LeerQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/leer.qr.request';
import { LeerQRResponse } from '@/infrastructure/third-party/atc-red-enlace/entitites/leer.qr.response';
import { PagarQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/pagar.qr.request';
import { PagarQRResponse } from '@/infrastructure/third-party/atc-red-enlace/entitites/pagar.qr.response';
import { inject, injectable } from 'inversify';

@injectable()
export class ATCPayoutService implements IATCPayoutService {
    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.IATCPayoutConnector) private atcPayoutConnector: IATCPayoutConnector
    ) {}

    /**
     * Escanea (lee) una imagen QR para obtener información del destinatario
     * Incluye validaciones de negocio antes de proceder
     */
    async scanQR(request: LeerQRRequest): Promise<LeerQRResponse> {
        try {
            this.loggerService.info('Processing QR scan request');

            // Validaciones de negocio (si es necesario)
            if (!request.imagen || request.imagen.trim().length === 0) {
                throw new Error('QR image data is required');
            }

            // Llamar al connector para escanear QR
            const response = await this.atcPayoutConnector.scanQR(request);

            this.loggerService.info(`QR scanned successfully - Beneficiary: ${response.titularDestino}, Amount: ${response.monto} ${response.moneda}`);

            return response;
        } catch (error) {
            this.loggerService.error('Error scanning QR:', error);
            throw error;
        }
    }

    /**
     * Procesa el pago de un QR previamente escaneado
     * Incluye validaciones de negocio antes de ejecutar el pago
     */
    async processPayment(request: PagarQRRequest): Promise<PagarQRResponse> {
        try {
            this.loggerService.info(`Processing payment for reference: ${request.numeroReferencia}`);

            // Validaciones de negocio
            if (!request.numeroReferencia || request.numeroReferencia.trim().length === 0) {
                throw new Error('Transaction reference number is required');
            }

            if (!request.origenNumeroReferencia || request.origenNumeroReferencia.trim().length === 0) {
                throw new Error('Origin reference number is required');
            }

            if (request.origenNumeroReferencia.length > 32) {
                throw new Error('Origin reference number must not exceed 32 characters');
            }

            // Validar formato de monto
            const montoNum = parseFloat(request.monto);
            if (isNaN(montoNum) || montoNum < 0) {
                throw new Error('Invalid amount format');
            }

            // Llamar al connector para confirmar pago
            const response = await this.atcPayoutConnector.confirmPayment(request);

            this.loggerService.info(`Payment processed successfully - Reference: ${response.numeroReferencia}, Amount: ${response.monto} ${response.moneda}`);

            return response;
        } catch (error) {
            this.loggerService.error('Error processing payment:', error);
            throw error;
        }
    }
}
