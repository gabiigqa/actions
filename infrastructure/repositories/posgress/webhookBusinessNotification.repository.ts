import { WebhookBusinessNotification } from "@/domain/interfaces/domain/entities/WebhookBusinessNotification";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { IWebhookBusinessNotificationRepository } from "@/domain/interfaces/infrastructure/repositories/IWebhookBusinessNotificationRepository";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class WebhookBusinessNotificationRepository extends BaseRepository implements IWebhookBusinessNotificationRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async create(notification: Omit<WebhookBusinessNotification, 'id' | 'requestAt' | 'responseAt'>): Promise<WebhookBusinessNotification> {
        try {
            this.loggerService.info('Creating webhook business notification', { 
                businessId: notification.businessId,
                businessWebhookId: notification.businessWebhookId,
                eventType: notification.eventType 
            });

            const query = `
                INSERT INTO integration.webhook_business_notifications (
                    business_id, 
                    business_webhook_id, 
                    event_type, 
                    callback_url, 
                    http_method, 
                    x_api_key, 
                    payload, 
                    code_status_response, 
                    message_response
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, business_id, business_webhook_id, event_type, callback_url, 
                         http_method, x_api_key, request_at, payload, code_status_response, 
                         message_response, response_at
            `;

            const values = [
                notification.businessId,
                notification.businessWebhookId,
                notification.eventType,
                notification.callbackUrl,
                notification.httpMethod,
                notification.xApiKey,
                JSON.stringify(notification.payload),
                notification.codeStatusResponse,
                JSON.stringify(notification.messageResponse)
            ];

            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create webhook business notification');
            }

            const row = result.rows[0];
            const createdNotification: WebhookBusinessNotification = {
                id: row.id,
                businessId: row.business_id,
                businessWebhookId: row.business_webhook_id,
                eventType: row.event_type,
                callbackUrl: row.callback_url,
                httpMethod: row.http_method,
                xApiKey: row.x_api_key,
                requestAt: new Date(row.request_at),
                payload: row.payload,
                codeStatusResponse: row.code_status_response,
                messageResponse: row.message_response,
                responseAt: new Date(row.response_at)
            };

            this.loggerService.info('Webhook business notification created successfully', { 
                id: createdNotification.id 
            });

            return createdNotification;

        } catch (error) {
            this.loggerService.error('Error creating webhook business notification', { 
                error: error instanceof Error ? error.message : 'Unknown error',
                businessId: notification.businessId,
                businessWebhookId: notification.businessWebhookId 
            });
            throw error;
        }
    }
}