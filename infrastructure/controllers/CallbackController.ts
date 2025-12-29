import { Partner } from '@/domain/interfaces/domain';
import { TransactionCallbackResponse } from '@/domain/interfaces/domain/entities/Transaction';
import { IATCRedEnlaceService } from '@/domain/interfaces/domain/services/IATCRedEnlaceService';
import { IAuthService } from '@/domain/interfaces/domain/services/IAuthService';
import { ICallbackService } from '@/domain/interfaces/domain/services/ICallbackService';
import { IPartnerService } from '@/domain/interfaces/domain/services/IPartnerService';
import { ITransactionService } from '@/domain/interfaces/domain/services/ITransacctionService';
import { ATCCallbackRequest, ATCStatus as ATCStatusEnum } from '@/domain/interfaces/infrastructure/controllers/requests/Callbacks/ATCCallbackRequest';
import { CallbackRequest, TransactionStatusEnum } from '@/domain/interfaces/infrastructure/controllers/requests/Callbacks/callback.request';
import { ATCCallbackResponse, ATCStatusResponse } from '@/domain/interfaces/infrastructure/controllers/responses/Callbacks/ATCCallbacksResponse';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { EnvironmentConfig } from '@/infrastructure/config';
import { BaseController } from '@/infrastructure/controllers/BaseController';
import { requireAuthApiKeyATC } from '@/infrastructure/middleware/AuthApiKeyATCMiddleware';
import { requireAuthApiKey } from '@/infrastructure/middleware/AuthApiKeyMiddleware';
import validateRequest from '@/infrastructure/middleware/ValidateRequestMiddleware';
import { ATCCallbackRequestValidations } from '@/infrastructure/validators/callbacks/atcCallbackRequestValidation';
import { TYPES } from '@infrastructure/config/inversify/types';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';

@controller('/api/partners/callbacks')
export class CallbackController extends BaseController {
    constructor(
        @inject(TYPES.ILoggerService) loggerService: ILoggerService,
        @inject(TYPES.ICallbackService) private callbackService: ICallbackService,
        @inject(TYPES.IAuthService) private authService: IAuthService,
        @inject(TYPES.IATCRedEnlaceService) private atcRedEnlaceService: IATCRedEnlaceService,
        @inject(TYPES.IPartnerService) private partnerService: IPartnerService,
        @inject(TYPES.ITransactionService) private transactionService: ITransactionService,
        @inject(TYPES.EnvironmentConfig) private environmentConfig: EnvironmentConfig
    ) {
        super(loggerService);
    }

    @httpPost('/process', requireAuthApiKey)
    async processCallback(req: Request, res: Response): Promise<void> {
        try {
            const xApiKey = req.headers['x-api-key'] as string;
            const callbackRequest: CallbackRequest = req.body;

            if (!callbackRequest.partnerCode) {
                this.loggerService.warn('Partner code is missing in the callback request');
                this.sendResponse(res, 400, 'Partner code is required');
                return;
            }

            const partner = await this.partnerService.getPartnerByCode(callbackRequest.partnerCode);
            if (!partner) {
                this.loggerService.warn(`No partner found with code: ${callbackRequest.partnerCode}`);
                this.sendResponse(res, 404, 'Partner not found ');
                return;
            }

            const response = await this.callPartnerService(partner, callbackRequest, xApiKey);

            const transactionDataCallback: TransactionCallbackResponse | null = await this.transactionService.getTransactionForCallback(callbackRequest.referenceNumber);

            if (!transactionDataCallback) {
                this.loggerService.warn(`No transaction callback found for partenerReference: ${callbackRequest.referenceNumber}`);
            } else {
                this.loggerService.info(`Transaction callback data: `, transactionDataCallback);
                await this.callbackService.sendCallbackNotification(transactionDataCallback);
            }


            this.sendResponse(res, 200, 'Callback processed successfully', response);
        } catch (error) {
            this.loggerService.error('Error processing callback V2', error);
            this.sendResponse(res, 500, 'Internal Server Error');
        }
    }

    @httpPost('/atc', requireAuthApiKeyATC, validateRequest(ATCCallbackRequestValidations))
    async processATCCallback(req: Request, res: Response): Promise<void> {
        const callbackRequest: ATCCallbackRequest = req.body;
        const xApiKey = req.headers['x-api-key'] as string;
        res.status(200).json({
            numeroReferencia: callbackRequest.numeroReferencia,
            codigoRespuesta: ATCStatusResponse.ACEPTADA,
            detalleRespuesta: null
        } as ATCCallbackResponse);

        setImmediate(() => {
            void (async () => {
                try {
                    this.loggerService.info('Received ATC callback:');
                    this.loggerService.info(JSON.stringify(callbackRequest));

                    await this.atcRedEnlaceService.updateCallbackData(callbackRequest, xApiKey);

                    const transactionDataCallback: TransactionCallbackResponse | null = await this.transactionService.getTransactionForCallback(callbackRequest.numeroReferencia);

                    if (!transactionDataCallback) {
                        this.loggerService.warn(`No transaction callback found for partenerReference: ${callbackRequest.numeroReferencia}`);
                    } else {
                        this.loggerService.info(`Transaction callback data: `, transactionDataCallback);
                        await this.callbackService.sendCallbackNotification(transactionDataCallback);
                    }

                    this.loggerService.info('ATC callback processed successfully');
                    return
                } catch (error: Error | any) {
                    this.loggerService.error('Error occurred while processing ATC callback', error);
                    return
                }
            })()
        })
    }

    protected async callPartnerService(partner: Partner, data: CallbackRequest, xApiKey: string): Promise<any> {
        try {
            switch (partner.code) {
                case 'ATC':
                    await this.atcRedEnlaceService.updateCallbackData({
                        numeroReferencia: data.referenceNumber,
                        estado: this.getResponseCodeATC(data.transactionStatus),
                        transacciones: data.transaction
                    }, xApiKey);
                    return {
                        numeroReferencia: data.referenceNumber,
                        codigoRespuesta: ATCStatusResponse.ACEPTADA,
                        detalleRespuesta: null
                    } as ATCCallbackResponse;
                default:
                    this.loggerService.warn(`No service available for partner code: ${partner.code}`);
                    throw new Error(`No service available for partner code: ${partner.code}`);
            }
        } catch (error: Error | any) {
            this.loggerService.error('Error calling partner service', error);
        }
    }

    protected getResponseCodeATC(status: TransactionStatusEnum): ATCStatusEnum {
        switch (status) {
            case TransactionStatusEnum.SUCCESS:
                return ATCStatusEnum.APROBADA;
            case TransactionStatusEnum.FAILED:
                return ATCStatusEnum.EXPIRADA;
            default:
                return ATCStatusEnum.EXPIRADA;
        }
    }
}
