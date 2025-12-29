import { IQueueManagerService } from "@/domain/interfaces/domain/services/third-party/queue.manager.service.interface";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { CallbackNotificationResponse, TransactionCallbackData } from "@/domain/interfaces/infrastructure/third-party/callbacks/send.callback.notification.request";
import { TYPES } from "@/infrastructure/config/inversify";
import { inject, injectable } from "inversify";

@injectable()
export class CallbackConnector {
    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.IQueueManagerService) private queueManagerService: IQueueManagerService
    ) { }

    protected getDetailsSummary(details: any, partnerCode: string): any {
        switch (partnerCode) {
            case 'ATC':
                return {
                    numeroAch: details.updateQRstatus.transacciones.numeroAch,
                    fechaHoraTransaccion: details.updateQRstatus.transacciones.fechaHoraTransaccion,
                    bankName: details.updateQRstatus.transacciones.banco.descripcion,
                    bankCode: details.updateQRstatus.transacciones.banco.sigla,
                    documentClient: details.updateQRstatus.transacciones.cliente.ciCliente,
                    nameClient: details.updateQRstatus.transacciones.cliente.nombreCliente,
                    status: details.updateQRstatus.status,
                    amount: details.updateQRstatus.transacciones.monto,
                    currency: details.updateQRstatus.transacciones.moneda
                }
            default:
                return details;
        }
    }

    protected containsEvent(events: string[] | undefined, eventToCheck: string): boolean {
        if (!events) return false;
        return events.includes(eventToCheck);
    }

    public async sendCallbackNotification(transactionCallbackData: TransactionCallbackData | any): Promise<CallbackNotificationResponse | null> {
        try {
            this.loggerService.info(`callback processed`, transactionCallbackData);
            if (transactionCallbackData as TransactionCallbackData) {
                return this.sendCallbackTransactionNotification(transactionCallbackData);
            } else {
                this.loggerService.warn(`Unknown callback data type`, transactionCallbackData);
                throw new Error(`Unknown callback data type`);
            }
        } catch (error) {
            this.loggerService.error(`Error processing callback`, error);
            return null;
        }
    }

    protected async sendCallbackTransactionNotification(transactionCallbackData: TransactionCallbackData): Promise<CallbackNotificationResponse> {
        let existEventNotification: boolean = false;
        let responseAt: Date | null = null;
        let requestAt: Date | null = null;
        let payload: any = null;
        try {
            this.loggerService.info(`callback processed`, transactionCallbackData);
            existEventNotification = this.containsEvent(transactionCallbackData.events.transactions, transactionCallbackData.transactionStatusCode);
            if (!existEventNotification) {
                this.loggerService.info(`Event ${transactionCallbackData.transactionStatusCode} not found in callback events. Skipping notification.`);
                return {
                    existEventNotification: existEventNotification,
                    businessId: transactionCallbackData.businessId,
                    businessWebhookId: transactionCallbackData.businessWebhookId,
                    eventType: transactionCallbackData.transactionStatusCode,
                    callbackUrl: transactionCallbackData.callbackUrl,
                    httpMethod: transactionCallbackData.httpMethod,
                    xApiKey: transactionCallbackData.xApiKey,
                    requestAt: null,
                    isResponseOk: false,
                    responseCode: 0,
                    responseMessage: 'Event not found in callback events. Notification skipped.',
                    responseAt: null,
                };
            }
            const detailData = this.getDetailsSummary(transactionCallbackData.details, transactionCallbackData.partnerCode);
            payload = {
                transactionId: transactionCallbackData.transactionId,
                externalReference: transactionCallbackData.externalReference,
                transactionStatus: transactionCallbackData.transactionStatusCode,
                transactionType: transactionCallbackData.transactionTypeCode,
                details: detailData,
            }
            requestAt = new Date();

            this.queueManagerService.setCallbackNotificationToQueue({
                transactionId: transactionCallbackData.transactionId,
                externalReference: transactionCallbackData.externalReference,
                transactionStatus: transactionCallbackData.transactionStatusCode,
                transactionType: transactionCallbackData.transactionTypeCode,
                details: detailData,
                webhookUrl: transactionCallbackData.callbackUrl,
                businessId: transactionCallbackData.businessId,
                businessWebhookId: transactionCallbackData.businessWebhookId,
                eventType: transactionCallbackData.transactionStatusCode,
                callbackUrl: transactionCallbackData.callbackUrl,
                httpMethod: transactionCallbackData.httpMethod,
                xApiKey: transactionCallbackData.xApiKey,
                payload: payload
            });

            responseAt = new Date();

            return {
                existEventNotification: existEventNotification,
                businessId: transactionCallbackData.businessId,
                businessWebhookId: transactionCallbackData.businessWebhookId,
                eventType: transactionCallbackData.transactionStatusCode,
                callbackUrl: transactionCallbackData.callbackUrl,
                httpMethod: transactionCallbackData.httpMethod,
                xApiKey: transactionCallbackData.xApiKey,
                requestAt: requestAt,
                isResponseOk: true,
                responseCode: 200,
                responseMessage: 'Notification sent successfully',
                responseAt: responseAt,
                payload: payload
            };
        } catch (error: Error | any) {
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            this.loggerService.error(`Error processing callback`, error);
            return {
                existEventNotification: existEventNotification,
                businessId: transactionCallbackData.businessId,
                businessWebhookId: transactionCallbackData.businessWebhookId,
                eventType: transactionCallbackData.transactionStatusCode,
                callbackUrl: transactionCallbackData.callbackUrl,
                httpMethod: transactionCallbackData.httpMethod,
                xApiKey: transactionCallbackData.xApiKey,
                requestAt: requestAt,
                isResponseOk: false,
                responseCode: 500,
                responseMessage: errorMessage,
                responseAt: responseAt,
                payload: payload
            };
        }
    }
}