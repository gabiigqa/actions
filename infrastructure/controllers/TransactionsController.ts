import { DepositExpressTransactionRequest, DepositExternalExpressTransactionRequest, DepositWalletTransactionRequest, ITransactionService, SendFiatWalletTransactionRequest, SendTransactionRequest } from "@/domain/interfaces/domain/services/ITransacctionService";
import { IATCPayoutService } from "@/domain/interfaces/domain/services/IATCPayoutService";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { TYPES } from "@/infrastructure/config/inversify/types";
import { BaseController } from "@/infrastructure/controllers/BaseController";
import { requireAuthApiKey } from "@/infrastructure/middleware/AuthApiKeyMiddleware";
import { requireAuth } from "@/infrastructure/middleware/AuthMiddleware";
import validateRequest from "@/infrastructure/middleware/ValidateRequestMiddleware";
import { QRExtractionError } from "@/infrastructure/third-party/atc-red-enlace/errors/qr-extraction.errors";
import { extractQRFromBase64 } from "@/infrastructure/third-party/atc-red-enlace/utils/qr-reader.util";
import { DepositExpressTransactionRequestValidations } from "@/infrastructure/validators/transactions/DepositExpressTransactionRequestValidations";
import { DepositExternalExpressTransactionRequestValidations } from "@/infrastructure/validators/transactions/DepositExternalExpressTransactionRequestValidations";
import { DepositWalletTransactionRequestValidations } from "@/infrastructure/validators/transactions/DepositWalletTransactionRequestValidations";
import { QRReadTransactionRequestValidations } from "@/infrastructure/validators/transactions/QRReadTransactionRequestValidations";
import { SendDepositTransactionRequestValidations } from "@/infrastructure/validators/transactions/SendDepositTransactionRequestValidations";
import { SendFiatWalletTransactionRequestValidations } from "@/infrastructure/validators/transactions/SendFiatWalletTransactionRequestValidations";
import { SendWithdrawalTransactionRequestValidations } from "@/infrastructure/validators/transactions/SendWithdrawalTransactionRequestValidations";
import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from 'inversify-express-utils';

@controller('/api/transactions')
export class TransactionsController extends BaseController {

    constructor(
        @inject(TYPES.ILoggerService) loggerService: ILoggerService,
        @inject(TYPES.ITransactionService) private transactionService: ITransactionService,
        @inject(TYPES.IATCPayoutService) private atcPayoutService: IATCPayoutService
    ) {
        super(loggerService);
    }

    @httpPost('/deposit', requireAuth, validateRequest(SendDepositTransactionRequestValidations))
    async createDepositTransaction(req: Request, res: Response): Promise<void> {
        const { session } = req;

        const data: SendTransactionRequest = {
            amount: req.body.amount,
            fromId: session.id, // Deposit from the authenticated user's client ID
            toId: req.body.toId,
            idempotencyKey: req.body.idempotencyKey
        };

        const result = await this.transactionService.createDepositTransaction(data);
        if (result) {
            res.status(201).json(result);
        } else {
            res.status(400).json({ error: 'Transaction creation failed' });
        }
    }

    @httpPost('/withdrawal', requireAuth, validateRequest(SendWithdrawalTransactionRequestValidations))
    async createWithdrawalTransaction(req: Request, res: Response): Promise<void> {
        const { session } = req;

        const data: SendTransactionRequest = {
            amount: req.body.amount,
            fromId: req.body.fromId,
            toId: session.id, // Withdrawal to the authenticated user's client ID
            idempotencyKey: req.body.idempotencyKey
        };

        const result = await this.transactionService.createWithdrawalTransaction(data);
        if (result) {
            res.status(201).json(result);
        } else {
            res.status(400).json({ error: 'Transaction creation failed' });
        }
    }

    @httpPost('/deposits/express/assets', requireAuth, validateRequest(DepositExpressTransactionRequestValidations))
    async createExpressDepositTransaction(req: Request, res: Response): Promise<void> {
        const { session, body } = req;

        const data: DepositExpressTransactionRequest = {
            clientId: body.clientId,
            accountId: body.accountId,
            walletId: body.walletId,
            cryptoAmount: body.cryptoAmount,
            asset: body.asset,
            referenceId: body.referenceId,
            country: body.country,
            fiatCurrency: body.fiatCurrency
        };

        const result = await this.transactionService.createExpressDepositTransaction(data);
        if (result) {
            this.sendResponse(res, 201, 'Express deposit transaction created successfully', result);
        } else {
            this.sendResponse(res, 400, 'Transaction creation failed');
        }
    }

    @httpPost('/deposits/external/express/assets', requireAuth, validateRequest(DepositExternalExpressTransactionRequestValidations))
    async createExternalExpressDepositTransaction(req: Request, res: Response): Promise<void> {
        const { session, body } = req;

        const data: DepositExternalExpressTransactionRequest = {
            email: session.email,
            businessId: '',
            cryptoAmount: body.cryptoAmount,
            asset: body.asset,
            referenceId: body.referenceId,
            country: body.country,
            fiatCurrency: body.fiatCurrency
        };

        const result = await this.transactionService.createExternalExpressDepositTransaction(data);
        if (result) {
            this.sendResponse(res, 201, 'External express deposit transaction created successfully', result);
        } else {
            this.sendResponse(res, 400, 'Transaction creation failed');
        }
    }

    @httpPost('/deposit/wallet/assets', requireAuth, validateRequest(DepositWalletTransactionRequestValidations))
    async depositToWalletAssets(req: Request, res: Response): Promise<void> {
        const { session, body } = req;
        const data: DepositWalletTransactionRequest = {
            clientId: body.clientId,
            walletId: body.walletId,
            accountId: body.accountId,
            cryptoAmount: body.cryptoAmount,
            asset: body.asset,
            fiatCurrency: body.fiatCurrency,
            referenceId: body.referenceId,
            country: body.country
        }
        const result = await this.transactionService.createDepositToWalletAssets(data);

        if (result) {
            this.sendResponse(res, 200, 'Deposit to wallet assets successful', result);
        } else {
            this.sendResponse(res, 400, 'Deposit to wallet assets failed');
        }
    }

    @httpPost('/send/currency/fiat', requireAuth, validateRequest(SendFiatWalletTransactionRequestValidations))
    async sendFiatWalletTransaction(req: Request, res: Response): Promise<void> {
        const { session, body } = req;
        const data: SendFiatWalletTransactionRequest = {
            clientId: body.clientId,
            walletId: body.walletId,
            accountId: body.accountId,
            fiatAmount: body.fiatAmount,
            fiatCurrency: body.fiatCurrency,
            country: body.country,
            beneficiaryBankData: body.beneficiaryBankData
        };

        const result = await this.transactionService.sendFiatWalletTransaction(data);
        if (result) {
            this.sendResponse(res, 201, 'Fiat wallet transaction sent successfully', result);
        }
        else {
            this.sendResponse(res, 400, 'Fiat wallet transaction failed');
        }
    }

    @httpGet('/deposit/status/:referenceId', requireAuthApiKey)
    async getDepositStatus(req: Request, res: Response): Promise<void> {
        try {
            const { referenceId } = req.params;

            if (!referenceId || referenceId.trim() === '') {
                this.sendResponse(res, 400, 'Reference ID is required');
                return;
            }
            // Call the service to get the deposit status
            let transaction = await this.transactionService.getTransacctionById(referenceId);
            if (!transaction) {
                this.sendResponse(res, 404, 'Transaction not found');
                return;
            }

            this.sendResponse(res, 200, 'Deposit status retrieved successfully', { transaction });
        } catch (error) {
            this.loggerService.error('Error retrieving deposit status', error);
            this.sendResponse(res, 500, 'Internal server error while retrieving deposit status');
        }
    }

    @httpPost('/qr/read', requireAuth, validateRequest(QRReadTransactionRequestValidations))
    async readQR(req: Request, res: Response): Promise<void> {
        try {
            const { image } = req.body;

            this.loggerService.info('Processing QR read request (extract + scan)');

            // Step 1: Extract QR text from Base64 image
            this.loggerService.info('Step 1: Extracting QR text from image');
            const qrText = await extractQRFromBase64(image);
            this.loggerService.info(`QR extracted successfully, text length: ${qrText.length}`);

            // Step 2: Scan the QR with ATC service
            this.loggerService.info('Step 2: Scanning QR with ATC service');
            const result = await this.atcPayoutService.scanQR({ imagen: qrText });
            this.loggerService.info(`QR scanned successfully - Beneficiary: ${result.titularDestino}`);

            // Step 3: Return combined response
            this.sendResponse(res, 200, 'QR extracted and scanned successfully', {
                beneficiary: result.titularDestino,
                account: result.cuentaDestino,
                currency: result.moneda,
                amount: result.monto,
                description: result.glosa,
                reference: result.numeroReferencia
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
                // Handle ATC service errors or other errors
                // Preserve original status code from ATC if available
                const statusCode = (error as any).statusCode || 500;
                this.sendResponse(
                    res,
                    statusCode,
                    'Failed to process QR',
                    {
                        code: 'QR_PROCESSING_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error'
                    }
                );
            }
        }
    }
}