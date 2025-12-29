import { IATCPayoutService } from '@/domain/interfaces/domain/services/IATCPayoutService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { TYPES } from '@/infrastructure/config/inversify';
import { BaseController } from '@/infrastructure/controllers/BaseController';
import { requireAuth } from '@/infrastructure/middleware/AuthMiddleware';
import validateRequest from '@/infrastructure/middleware/ValidateRequestMiddleware';
import { LeerQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/leer.qr.request';
import { PagarQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/pagar.qr.request';
import { ConfirmPaymentRequestValidations } from '@/infrastructure/validators/atc-payout/confirmPaymentRequestValidation';
import { ScanQRRequestValidations } from '@/infrastructure/validators/atc-payout/scanQRRequestValidation';
import { ExtractQRRequestValidations } from '@/infrastructure/validators/atc-payout/extractQRRequestValidation';
import { extractQRFromBase64 } from '@/infrastructure/third-party/atc-red-enlace/utils/qr-reader.util';
import { QRExtractionError } from '@/infrastructure/third-party/atc-red-enlace/errors/qr-extraction.errors';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';

/**
 * Controller para operaciones de ATC Payout QR
 *
 * Endpoints:
 * - POST /api/atc/payout/scan - Escanear QR para ver información del destinatario
 * - POST /api/atc/payout/confirm - Confirmar y ejecutar el pago
 */
@controller('/api/atc/payout')
export class ATCPayoutController extends BaseController {
    constructor(
        @inject(TYPES.ILoggerService) loggerService: ILoggerService,
        @inject(TYPES.IATCPayoutService) private atcPayoutService: IATCPayoutService
    ) {
        super(loggerService);
    }

    /**
     * Escanea (lee) un código QR para obtener información del beneficiario
     *
     * @route POST /api/atc/payout/scan
     * @auth Requiere autenticación JWT
     * @body { imagen: string } - Datos del QR escaneado
     * @returns Información del beneficiario (nombre, cuenta, monto, etc.)
     */
    @httpPost('/scan', requireAuth, validateRequest(ScanQRRequestValidations))
    async scanQR(req: Request, res: Response): Promise<void> {
        try {
            const { imagen } = req.body as LeerQRRequest;

            this.loggerService.info('Processing QR scan request');

            const result = await this.atcPayoutService.scanQR({ imagen });

            this.sendResponse(res, 200, 'QR scanned successfully', {
                beneficiary: result.titularDestino,
                account: result.cuentaDestino,
                currency: result.moneda,
                amount: result.monto,
                description: result.glosa,
                reference: result.numeroReferencia
            });
        } catch (error) {
            this.loggerService.error('Error scanning QR:', error);

            // Map ATC errors to generic errors to hide third-party service
            const mappedError = this.mapATCError(error);

            this.sendResponse(
                res,
                mappedError.statusCode,
                'Failed to scan QR code',
                {
                    code: mappedError.code,
                    message: mappedError.message
                }
            );
        }
    }

    /**
     * Confirma y ejecuta el pago de un QR previamente escaneado
     *
     * @route POST /api/atc/payout/confirm
     * @auth Requiere autenticación JWT
     * @body { numeroReferencia, origenNumeroReferencia, monto, glosa? } - Datos de confirmación
     * @returns Comprobante de la transacción ejecutada
     */
    @httpPost('/confirm', requireAuth, validateRequest(ConfirmPaymentRequestValidations))
    async confirmPayment(req: Request, res: Response): Promise<void> {
        try {
            const { numeroReferencia, origenNumeroReferencia, monto, glosa } = req.body as PagarQRRequest;

            this.loggerService.info(`Processing payment confirmation for reference: ${numeroReferencia}`);

            const paymentRequest: PagarQRRequest = {
                numeroReferencia,
                origenNumeroReferencia,
                monto,
                ...(glosa && { glosa })  // Solo incluir glosa si existe
            };

            const result = await this.atcPayoutService.processPayment(paymentRequest);

            this.sendResponse(res, 200, 'Payment processed successfully', {
                transactionReference: result.numeroReferencia,
                originReference: result.origenNumeroReferencia,
                transactionDate: result.fechaTransaccion,
                originAccount: result.cuentaOrigen,
                originAccountHolder: result.titularOrigen,
                destinationAccount: result.cuentaDestino,
                destinationAccountHolder: result.titularDestino,
                amount: result.monto,
                currency: result.moneda,
                description: result.glosa
            });
        } catch (error) {
            this.loggerService.error('Error processing payment:', error);

            // Map ATC errors to generic errors to hide third-party service
            const mappedError = this.mapATCError(error);

            this.sendResponse(
                res,
                mappedError.statusCode,
                'Failed to process payment',
                {
                    code: mappedError.code,
                    message: mappedError.message
                }
            );
        }
    }

    /**
     * Map ATC error codes to custom error responses
     * This prevents exposing third-party service errors directly to clients
     */
    private mapATCError(error: any): { statusCode: number; code: string; message: string } {
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Parse error code from error message
        // Format: "[CODE] Message text"
        const errorCodeMatch = errorMessage.match(/\[([A-Z]+-\d+)\]/);
        const errorCode = errorCodeMatch ? errorCodeMatch[1] : null;

        this.loggerService.info('Mapping ATC error', { errorCode, originalError: errorMessage });

        // Map known error codes to custom responses
        switch (errorCode) {
            // Payment/Transaction errors
            case 'PQ-00005':
                return {
                    statusCode: 400,
                    code: 'INSUFFICIENT_FUNDS',
                    message: 'Insufficient balance to complete this transaction. Please ensure you have enough funds in your account.'
                };

            case 'TR-00007':
                return {
                    statusCode: 400,
                    code: 'TRANSACTION_ALREADY_PROCESSED',
                    message: 'This transaction has already been processed and cannot be confirmed again.'
                };

            case 'TR-00001':
                return {
                    statusCode: 404,
                    code: 'TRANSACTION_NOT_FOUND',
                    message: 'The transaction reference was not found. Please verify the reference number.'
                };

            case 'TR-00002':
                return {
                    statusCode: 400,
                    code: 'TRANSACTION_EXPIRED',
                    message: 'The transaction has expired and can no longer be processed.'
                };

            case 'PQ-00001':
                return {
                    statusCode: 400,
                    code: 'INVALID_PAYMENT_DATA',
                    message: 'Invalid payment data provided. Please verify all required fields.'
                };

            case 'PQ-00003':
                return {
                    statusCode: 400,
                    code: 'INVALID_ACCOUNT',
                    message: 'The destination account is invalid or does not exist.'
                };

            // QR Code errors
            case 'QR-00001':
                return {
                    statusCode: 400,
                    code: 'INVALID_QR_CODE',
                    message: 'The QR code is invalid or cannot be processed.'
                };

            case 'QR-00002':
                return {
                    statusCode: 400,
                    code: 'QR_EXPIRED',
                    message: 'The QR code has expired. Please generate a new one.'
                };

            case 'QR-00003':
                return {
                    statusCode: 400,
                    code: 'QR_ALREADY_USED',
                    message: 'This QR code has already been used and cannot be processed again.'
                };

            // Account errors
            case 'AC-00001':
                return {
                    statusCode: 400,
                    code: 'INVALID_ACCOUNT',
                    message: 'The destination account is invalid or does not exist.'
                };

            // System errors
            case 'SY-00001':
                return {
                    statusCode: 500,
                    code: 'SYSTEM_ERROR',
                    message: 'A system error occurred while processing your request. Please try again later.'
                };

            default:
                // Generic error for unmapped codes
                return {
                    statusCode: 500,
                    code: 'PAYMENT_PROCESSING_ERROR',
                    message: 'An error occurred while processing the payment. Please try again later or contact support.'
                };
        }
    }

    /**
     * Extrae el texto de un código QR desde una imagen en Base64
     *
     * @route POST /api/atc/payout/extract-qr
     * @auth Requiere autenticación JWT
     * @body { image: string } - Imagen en Base64
     * @returns Texto extraído del QR
     */
    @httpPost('/extract-qr', requireAuth, validateRequest(ExtractQRRequestValidations))
    async extractQR(req: Request, res: Response): Promise<void> {
        try {
            const { image } = req.body;

            this.loggerService.info('Processing QR extraction request');

            const qrText = await extractQRFromBase64(image);

            this.loggerService.info(`QR extracted successfully, text length: ${qrText.length}`);

            this.sendResponse(res, 200, 'QR code extracted successfully', {
                qrText: qrText,
                length: qrText.length
            });
        } catch (error) {
            this.loggerService.error('Error extracting QR code:', error);

            if (error instanceof QRExtractionError) {
                this.sendResponse(
                    res,
                    error.statusCode,
                    error.message,
                    {
                        code: error.code,
                        message: error.message
                    }
                );
            } else {
                this.sendResponse(
                    res,
                    500,
                    'Failed to extract QR code',
                    {
                        code: 'INTERNAL_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error'
                    }
                );
            }
        }
    }
}
