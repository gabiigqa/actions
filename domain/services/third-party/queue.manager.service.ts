import { CallbackNotificationData, IQueueManagerService, MailNotificationData } from "@/domain/interfaces/domain/services/third-party/queue.manager.service.interface";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IQueueManager } from "@/domain/interfaces/infrastructure/third-party/redis-connector/queue.manager.interface";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { QueueManager } from "@/infrastructure/third-party/redis-connector/queue.manager";
import { inject, injectable } from "inversify";

@injectable()
export class QueueManagerService implements IQueueManagerService {
    constructor(
        @inject(TYPES.AppConfig) private appConfig: AppConfig,
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
        @inject(TYPES.IQueueManager) private queueManager: IQueueManager,
    ){}
    
    async setCallbackNotificationToQueue(callbackData: CallbackNotificationData): Promise<boolean> {
        try {
            this.logger.info('Adding callback notification to webhooks queue', {
                transactionId: callbackData.transactionId,
                businessId: callbackData.businessId,
                eventType: callbackData.eventType
            });

            await this.queueManager.createJob(
                'webhooks',
                'callback-notification',
                callbackData
            );

            this.logger.info('Callback notification successfully added to webhooks queue', {
                transactionId: callbackData.transactionId
            });

            return true;
        } catch (error) {
            this.logger.error('Failed to add callback notification to webhooks queue', {
                transactionId: callbackData.transactionId,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            return false;
        }
    }

    async setMailNotificationToQueue(mailData: MailNotificationData): Promise<boolean> {
        try {
            this.logger.info('Adding mail notification to email queue', {
                recipient: mailData.to,
                subject: mailData.subject,
                hasAttachments: mailData.attachments ? mailData.attachments.length > 0 : false
            });

            await this.queueManager.createJob(
                'email-notifications',
                'mail-notification',
                mailData
            );

            this.logger.info('Mail notification successfully added to email queue', {
                recipient: mailData.to
            });

            return true;
        } catch (error) {
            this.logger.error('Failed to add mail notification to email queue', {
                recipient: mailData.to,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            return false;
        }
    }
}