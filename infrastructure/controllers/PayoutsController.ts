import { CreateTransactionData } from '@/domain/interfaces/domain/entities/Transaction';
import { CreateExternalIntegrationData } from '@/domain/interfaces/domain/entities/ExternalIntegrations';
import { IATCPayoutService } from '@/domain/interfaces/domain/services/IATCPayoutService';
import { ITenantDatabaseService } from '@/domain/interfaces/domain/services/ITenantDatabaseService';
import { IBusinessService } from '@/domain/interfaces/domain/services/IBusinessService';
import { IExchangeRateService } from '@/domain/interfaces/domain/services/IExchangeRateService';
import { IFeeService } from '@/domain/interfaces/domain/services/IFeeService';
import { IPartnerService } from '@/domain/interfaces/domain/services/IPartnerService';
import { ITransactionStatusService } from '@/domain/interfaces/domain/services/ITransactionStatusService';
import { ITransactionTypeService } from '@/domain/interfaces/domain/services/ITransactionTypeService';
import { ICurrencyService } from '@/domain/interfaces/domain/services/ICurrencyService';
import { IAssetService } from '@/domain/interfaces/domain/services/IAssetService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { ITransactionRepository } from '@/domain/interfaces/infrastructure/repositories/ITransactionRepository';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { BaseController } from '@/infrastructure/controllers/BaseController';
import { requireAuth } from '@/infrastructure/middleware/AuthMiddleware';
import validateRequest from '@/infrastructure/middleware/ValidateRequestMiddleware';
import { QRExtractionError } from '@/infrastructure/third-party/atc-red-enlace/errors/qr-extraction.errors';
import { PagarQRRequest } from '@/infrastructure/third-party/atc-red-enlace/entitites/pagar.qr.request';
import { extractQRFromBase64 } from '@/infrastructure/third-party/atc-red-enlace/utils/qr-reader.util';
import { ConfirmPaymentRequestValidations } from '@/infrastructure/validators/atc-payout/confirmPaymentRequestValidation';
import { QRReadTransactionRequestValidations } from '@/infrastructure/validators/transactions/QRReadTransactionRequestValidations';
import { PayoutDetailsRequestValidations } from '@/infrastructure/validators/transactions/PayoutDetailsRequestValidations';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';

/**
 * Controller for Payout operations
 *
 * Endpoints:
 * - POST /api/transactions/payouts - Read/scan QR code for payout
 * - GET /api/transactions/payouts - List payouts (not implemented yet)
 * - POST /api/transactions/payouts/confirm - Confirm and execute payout
 * - POST /api/transactions/payouts/details - Get payout details (not implemented yet)
 */
@controller('/api/transactions/payouts')
export class PayoutsController extends BaseController {
    constructor(
        @inject(TYPES.ILoggerService) loggerService: ILoggerService,
        @inject(TYPES.IATCPayoutService) private atcPayoutService: IATCPayoutService,
        @inject(TYPES.ITransactionTypeService) private transactionTypeService: ITransactionTypeService,
        @inject(TYPES.ITransactionStatusService) private transactionStatusService: ITransactionStatusService,
        @inject(TYPES.IPartnerService) private partnerService: IPartnerService,
        @inject(TYPES.ITransactionRepository) private transactionRepository: ITransactionRepository,
        @inject(TYPES.IBusinessService) private businessService: IBusinessService,
        @inject(TYPES.IExchangeRateService) private exchangeRateService: IExchangeRateService,
        @inject(TYPES.IFeeService) private feeService: IFeeService,
        @inject(TYPES.ITenantDatabaseService) private tenantDatabaseService: ITenantDatabaseService,
        @inject(TYPES.ICurrencyService) private currencyService: ICurrencyService,
        @inject(TYPES.IAssetService) private assetService: IAssetService
    ) {
        super(loggerService);
    }

    /**
     * Read and scan QR code for payout
     *
     * @route POST /api/transactions/payouts
     * @auth Requires JWT authentication
     * @body { image: string, funding_source: 'balance' | 'conversion' } - Base64 encoded QR image and funding source
     * @returns Payout information with status pending_confirmation
     */
    @httpPost('/', requireAuth, validateRequest(QRReadTransactionRequestValidations))
    async readQR(req: Request, res: Response): Promise<void> {
        try {
            const { image, funding_source } = req.body;

            this.loggerService.info('Processing QR read request (extract + scan)', { funding_source });

            // Step 0: Check funding_source
            if (funding_source === 'conversion') {
                this.loggerService.warn('Conversion funding source not authorized');
                this.sendResponse(res, 403, 'Conversion funding source is not authorized', {
                    code: 'CONVERSION_NOT_AUTHORIZED',
                    message: 'You are not authorized to use conversion funding source. Please use balance instead.'
                });
                return;
            }

            // Step 1: Extract QR text from Base64 image
            this.loggerService.info('Step 1: Extracting QR text from image');
            const qrText = await extractQRFromBase64(image);
            this.loggerService.info(`QR extracted successfully, text length: ${qrText.length}`);

            // Step 2: Scan the QR with ATC service
            this.loggerService.info('Step 2: Scanning QR with ATC service');
            const result = await this.atcPayoutService.scanQR({ imagen: qrText });
            this.loggerService.info(`QR scanned successfully - Beneficiary: ${result.titularDestino}`);

            // Step 3: Get business from authenticated session
            const { session } = req;
            const business = await this.businessService.getBusinessByEmail(session.email);

            if (!business) {
                this.loggerService.error('Business not found for authenticated user', { email: session.email });
                this.sendResponse(res, 400, 'Business not found for authenticated user');
                return;
            }

            // Step 4: Get transaction type (ID 10)
            const transactionType = await this.transactionTypeService.getTransactionTypeById(10);
            if (!transactionType) {
                this.loggerService.error('Transaction type with ID 10 not found');
                this.sendResponse(res, 500, 'Transaction type configuration error');
                return;
            }

            // Step 5: Get transaction status (created_transaction)
            const transactionStatus = await this.transactionStatusService.getTransactionStatusByCode('created_transaction');
            if (!transactionStatus) {
                this.loggerService.error('Transaction status "created_transaction" not found');
                this.sendResponse(res, 500, 'Transaction status configuration error');
                return;
            }

            // Step 6: Get ATC partner
            const partner = await this.partnerService.getPartnerByCode('ATC');
            if (!partner) {
                this.loggerService.error('ATC partner not found');
                this.sendResponse(res, 500, 'Partner configuration error');
                return;
            }

            // Step 7: Get exchange rate
            const exchangeRate = await this.exchangeRateService.getExchangeRateByCompositeKey(10, 6, 1);
            if (!exchangeRate) {
                this.loggerService.error('Exchange rate not found for payout', { transactionTypeId: 10, assetCurrencyId: 6, fiatCurrencyId: 1 });
                this.sendResponse(res, 500, 'Exchange rate configuration error');
                return;
            }

            // Step 8: Get fees (optional, default to 0 if not found)
            const fee = await this.feeService.getFeeByTransactionTypeAndCurrencies(10, 6, 1);
            const feeAmount = fee ? fee.fee_amount : 0;

            this.loggerService.info(`Exchange rate: ${exchangeRate.rate}, Fee amount: ${feeAmount}`);

            // Step 9: Prepare transaction data
            const transactionData: CreateTransactionData = {
                businessId: business.id,
                transactionType: transactionType.id,
                transactionStatus: transactionStatus.id,
                externalReference: '',
                details: {
                    amount: result.monto,
                    assetCurrencyId: 6,
                    fiatCurrencyId: 1,
                    exchangeRate: exchangeRate.rate,
                    fees: feeAmount,
                    fiatAmount: 0,
                    assetAmount: 0,
                    totalFiatAmount: 0,
                    totalAssetAmount: 0,
                    status: 'E'
                }
            };

            // Step 10: Insert transaction
            const transaction = await this.transactionRepository.insertTransaction(transactionData);
            if (!transaction) {
                this.loggerService.error('Failed to create transaction record for payout');
                this.sendResponse(res, 500, 'Failed to create transaction record');
                return;
            }

            this.loggerService.info(`Payout transaction created successfully with ID: ${transaction.id}`);

            // Step 11: Get internal reference number
            const internalReference = await this.partnerService.countPartnerTransactions(partner.id) + 1;

            // Step 12: Prepare external integration data
            const externalIntegrationData: CreateExternalIntegrationData = {
                partnerId: partner.id,
                transactionId: transaction.id,
                internalReference: internalReference.toString(),
                partnerReference: result.numeroReferencia,
                responseCode: '',
                responseMessage: 'QR scanned successfully',
                details: {
                    beneficiary: result.titularDestino,
                    account: result.cuentaDestino,
                    currency: result.moneda,
                    amount: result.monto,
                    description: result.glosa,
                    reference: result.numeroReferencia
                },
                status: 'E'
            };

            // Step 13: Insert external integration
            const externalIntegration = await this.partnerService.insertExternalIntegration(externalIntegrationData);
            if (!externalIntegration) {
                this.loggerService.error('Failed to create external integration record', { transactionId: transaction.id });
                this.sendResponse(res, 500, 'Failed to create external integration record');
                return;
            }

            this.loggerService.info(`External integration created successfully with ID: ${externalIntegration.id} for transaction: ${transaction.id}`);

            // Step 14: Get currency codes for tenant database
            const assetCurrency = await this.assetService.getAssetById(6);
            if (!assetCurrency) {
                this.loggerService.error('Asset currency with ID 6 not found');
                this.sendResponse(res, 500, 'Asset currency configuration error');
                return;
            }

            const fiatCurrency = await this.currencyService.getCurrencyById(1);
            if (!fiatCurrency) {
                this.loggerService.error('Fiat currency with ID 1 not found');
                this.sendResponse(res, 500, 'Fiat currency configuration error');
                return;
            }

            // Step 15: Get tenant database credentials
            this.loggerService.info(`Retrieving tenant database credentials for business: ${business.id}`);
            const tenantCredentials = await this.tenantDatabaseService.getTenantCredentials(business.id);

            if (!tenantCredentials) {
                this.loggerService.error('Tenant database credentials not found', { businessId: business.id });
                this.sendResponse(res, 500, 'Tenant database configuration error');
                return;
            }

            this.loggerService.info('Tenant credentials retrieved successfully');

            // Step 16: Save to tenant database (using single pool for both operations)
            try {
                this.loggerService.info('Saving transaction and payout details to tenant database');

                // Save both transaction and payout_details in the same pool/connection
                await this.tenantDatabaseService.saveTransactionAndPayoutDetails(
                    tenantCredentials,
                    {
                        transactionId: transaction.id,
                        businessId: business.id,
                        externalReference: '',
                        transactionType: transactionType.code,
                        transactionStatus: transactionStatus.code,
                        assetCode: assetCurrency.code,
                        fiatCurrencyCode: fiatCurrency.code,
                        cryptoAmount: 0,
                        fiatAmount: result.monto,
                        feeAmount: feeAmount,
                        exchangeRate: exchangeRate.rate,
                        errorCode: null,
                        errorMessage: null,
                        isActive: true
                    },
                    {
                        transactionId: transaction.id,
                        numeroReferencia: result.numeroReferencia,
                        cuentaDestino: result.cuentaDestino,
                        titularDestino: result.titularDestino,
                        monto: result.monto,
                        moneda: result.moneda,
                        glosa: result.glosa ?? null
                    }
                );

                this.loggerService.info(`Transaction and payout details saved successfully to tenant database for transaction: ${transaction.id}`);
            } catch (tenantError) {
                this.loggerService.error('Failed to save to tenant database, updating transaction status to 13', {
                    transactionId: transaction.id,
                    error: tenantError
                });

                // Step 17: Update transaction status to 13 if tenant save fails
                const failedStatus = await this.transactionStatusService.getTransactionStatusById(13);
                if (failedStatus) {
                    await this.transactionRepository.updateTransactionStatus(transaction.id, failedStatus.id);
                }

                this.sendResponse(res, 500, 'Failed to save transaction to tenant database');
                return;
            }

            // Step 18: Return combined response following OpenAPI documentation format
            this.sendResponse(res, 200, 'QR extracted and scanned successfully', {
                payout_id: transaction.id,
                reference: result.numeroReferencia,
                status: 'created_transaction',
                beneficiary: {
                    name: result.titularDestino,
                    account: result.cuentaDestino,
                    currency: result.moneda
                },
                amount: result.monto,
                description: result.glosa ?? '',
                created_at: new Date().toISOString()
            });
        } catch (error) {
            this.loggerService.error('Error in QR read operation:', error);

            // Handle QR extraction errors with specific status codes
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
                // Handle ATC service errors - Map to generic errors to hide third-party service
                const mappedError = this.mapPaymentError(error);

                this.sendResponse(
                    res,
                    mappedError.statusCode,
                    'Failed to process QR',
                    {
                        code: mappedError.code,
                        message: mappedError.message
                    }
                );
            }
        }
    }

    /**
     * Get list of payouts
     *
     * @route GET /api/transactions/payouts
     * @auth Requires JWT authentication
     * @query status - Filter by status (optional)
     * @query page - Page number (optional, default: 1)
     * @query limit - Results per page (optional, default: 20, max: 100)
     * @returns List of payouts with pagination
     */
    @httpGet('/', requireAuth)
    async getPayouts(req: Request, res: Response): Promise<void> {
        try {
            const { session } = req;
            const { status, page, limit } = req.query;

            // Get business from authenticated session
            const business = await this.businessService.getBusinessByEmail(session.email);
            if (!business) {
                this.loggerService.error('Business not found for authenticated user', { email: session.email });
                this.sendResponse(res, 400, 'Business not found for authenticated user');
                return;
            }

            // Parse and validate query parameters
            const pageNum = page ? Math.max(1, parseInt(page as string)) : 1;
            const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit as string))) : 20;
            const statusFilter = status as string | undefined;

            // Validate status if provided
            if (statusFilter) {
                const validStatuses = ['created_transaction', 'pending_transaction', 'reject_transaction', 'completed_transaction'];
                if (!validStatuses.includes(statusFilter)) {
                    this.sendResponse(res, 400, 'Invalid status parameter', {
                        code: 'INVALID_STATUS',
                        message: 'Status must be one of: created_transaction, pending_transaction, reject_transaction, completed_transaction'
                    });
                    return;
                }
            }

            this.loggerService.info('Getting payouts list', {
                businessId: business.id,
                status: statusFilter,
                page: pageNum,
                limit: limitNum
            });

            const result = await this.transactionRepository.getPayouts(
                business.id,
                statusFilter,
                pageNum,
                limitNum
            );

            this.sendResponse(res, 200, 'Payouts retrieved successfully', result);
        } catch (error) {
            this.loggerService.error('Error getting payouts:', error);
            this.sendResponse(
                res,
                500,
                'Failed to retrieve payouts',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    /**
     * Map external service error codes to custom error responses
     * This prevents exposing third-party service errors directly to clients
     */
    private mapPaymentError(error: any): { statusCode: number; code: string; message: string } {
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Parse error code from error message
        // Format: "[CODE] Message text"
        const errorCodeMatch = errorMessage.match(/\[([A-Z]+-\d+)\]/);
        const errorCode = errorCodeMatch ? errorCodeMatch[1] : null;

        this.loggerService.info('Mapping payment error', { errorCode, originalError: errorMessage });

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
     * Confirm and execute a payout payment
     *
     * @route POST /api/transactions/payouts/confirm
     * @auth Requires JWT authentication
     * @body { numeroReferencia, origenNumeroReferencia, monto, glosa? } - Payment confirmation data
     * @returns Transaction receipt
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
                ...(glosa && { glosa })
            };

            // Step 1: Process payment with external service
            const result = await this.atcPayoutService.processPayment(paymentRequest);
            this.loggerService.info(`Payment processed successfully: ${result.numeroReferencia}`);

            // Step 2: Get transaction by partner reference
            const transaction = await this.transactionRepository.getTransactionByPartnerReference(numeroReferencia);
            if (!transaction) {
                this.loggerService.error('Transaction not found for partner reference', { numeroReferencia });
                this.sendResponse(res, 404, 'Transaction not found', {
                    code: 'TRANSACTION_NOT_FOUND',
                    message: 'No transaction found with the provided reference number.'
                });
                return;
            }

            this.loggerService.info(`Transaction found: ${transaction.id}`);

            // Step 3: Get transaction status for "completed" (status 14)
            const completedStatus = await this.transactionStatusService.getTransactionStatusById(14);
            if (!completedStatus) {
                this.loggerService.error('Transaction status 14 (completed) not found');
                this.sendResponse(res, 500, 'Transaction status configuration error');
                return;
            }

            // Step 4: Update main database - transactions table
            await this.transactionRepository.updateTransactionExternalReference(
                transaction.id,
                result.origenNumeroReferencia
            );
            await this.transactionRepository.updateTransactionStatus(
                transaction.id,
                completedStatus.id
            );

            // Step 5: Update main database - transaction_details table
            await this.transactionRepository.updateTransactionDetails(
                transaction.id,
                result.monto,
                result.monto,
                result.monto
            );

            this.loggerService.info(`Main database updated successfully for transaction: ${transaction.id}`);

            // Step 6: Get business from transaction
            const business = await this.businessService.getBusinessById(transaction.businessId);
            if (!business) {
                this.loggerService.error('Business not found for transaction', { businessId: transaction.businessId });
                this.sendResponse(res, 500, 'Business configuration error');
                return;
            }

            // Step 7: Get tenant database credentials
            const tenantCredentials = await this.tenantDatabaseService.getTenantCredentials(business.id);
            if (!tenantCredentials) {
                this.loggerService.error('Tenant database credentials not found', { businessId: business.id });
                this.sendResponse(res, 500, 'Tenant database configuration error');
                return;
            }

            // Step 8: Update tenant database
            try {
                this.loggerService.info('Updating tenant database');

                await this.tenantDatabaseService.updateTransactionAndPayoutDetails(
                    tenantCredentials,
                    {
                        transactionId: transaction.id,
                        externalReference: result.origenNumeroReferencia,
                        transactionStatus: completedStatus.code,
                        cryptoAmount: 0,
                        fiatAmount: result.monto,
                        totalFiatAmount: result.monto
                    },
                    {
                        transactionId: transaction.id,
                        origenNumeroReferencia: result.origenNumeroReferencia,
                        fechaTransaccion: result.fechaTransaccion,
                        cuentaOrigen: result.cuentaOrigen,
                        titularOrigen: result.titularOrigen ?? ''
                    }
                );

                this.loggerService.info(`Tenant database updated successfully for transaction: ${transaction.id}`);
            } catch (tenantError) {
                this.loggerService.error('Failed to update tenant database', {
                    transactionId: transaction.id,
                    error: tenantError
                });
                // Continue - main database is already updated
            }

            // Step 9: Return successful response
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

            // Map external service errors to custom error responses
            const mappedError = this.mapPaymentError(error);

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
     * Get payout details
     *
     * @route POST /api/transactions/payouts/details
     * @auth Requires JWT authentication
     * @body { payout_id: string } - Payout ID to retrieve details
     * @returns Payout details
     */
    @httpPost('/details', requireAuth, validateRequest(PayoutDetailsRequestValidations))
    async getPayoutDetails(req: Request, res: Response): Promise<void> {
        try {
            const { session } = req;
            const { payout_id } = req.body;

            // Get business from authenticated session
            const business = await this.businessService.getBusinessByEmail(session.email);
            if (!business) {
                this.loggerService.error('Business not found for authenticated user', { email: session.email });
                this.sendResponse(res, 400, 'Business not found for authenticated user');
                return;
            }

            this.loggerService.info('Getting payout details', {
                businessId: business.id,
                payoutId: payout_id
            });

            const payoutDetails = await this.transactionRepository.getPayoutDetails(
                payout_id,
                business.id
            );

            if (!payoutDetails) {
                this.loggerService.warn('Payout not found', { payoutId: payout_id, businessId: business.id });
                this.sendResponse(res, 404, 'Payout not found', {
                    code: 'PAYOUT_NOT_FOUND',
                    message: 'No payout found with the provided ID'
                });
                return;
            }

            this.sendResponse(res, 200, 'Payout details retrieved successfully', payoutDetails);
        } catch (error) {
            this.loggerService.error('Error getting payout details:', error);
            this.sendResponse(
                res,
                500,
                'Failed to retrieve payout details',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }
}
