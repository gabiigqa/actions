import { BusinessWebhook } from "@/domain/interfaces/domain/entities/BusinessWebhook";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IBusinessWebhookRepository } from "@/domain/interfaces/infrastructure/repositories/IBusinessWebhookRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class BusinessWebhookRepository extends BaseRepository implements IBusinessWebhookRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getWebhookById(id: string): Promise<BusinessWebhook | null> {
        try {
            this.loggerService.info(`Getting business webhook by ID: ${id}`);

            const query = `
                SELECT id, business_id, description, callback_url, http_method, 
                       x_api_key, events, status, created_at, updated_at
                FROM integration.business_webhooks 
                WHERE id = $1
            `;

            const result = await this.postgreSQLConnection.query(query, [id]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Business webhook not found for ID: ${id}`);
                return null;
            }

            const row = result.rows[0];
            const webhook: BusinessWebhook = {
                id: row.id,
                businessId: row.business_id,
                description: row.description,
                callbackUrl: row.callback_url,
                httpMethod: row.http_method,
                xApiKey: row.x_api_key,
                events: row.events,
                status: row.status,
                createdAt: new Date(row.created_at),
                updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
            };

            this.loggerService.info(`Business webhook found: ${webhook.description} (ID: ${webhook.id})`);
            return webhook;
        } catch (error) {
            this.loggerService.error('Error getting business webhook by ID:', {
                id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get business webhook by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getWebhooksByBusinessId(businessId: string): Promise<BusinessWebhook[]> {
        try {
            this.loggerService.info(`Getting business webhooks for business ID: ${businessId}`);

            const query = `
                SELECT id, business_id, description, callback_url, http_method, 
                       x_api_key, events, status, created_at, updated_at
                FROM integration.business_webhooks 
                WHERE business_id = $1
                ORDER BY created_at DESC
            `;

            const result = await this.postgreSQLConnection.query(query, [businessId]);

            const webhooks: BusinessWebhook[] = result.rows.map((row: any) => ({
                id: row.id,
                businessId: row.business_id,
                description: row.description,
                callbackUrl: row.callback_url,
                httpMethod: row.http_method,
                xApiKey: row.x_api_key,
                events: row.events,
                status: row.status,
                createdAt: new Date(row.created_at),
                updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
            }));

            this.loggerService.info(`Found ${webhooks.length} webhooks for business ID: ${businessId}`);
            return webhooks;
        } catch (error) {
            this.loggerService.error('Error getting business webhooks by business ID:', {
                businessId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get business webhooks by business ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getActiveWebhooksByBusinessId(businessId: string): Promise<BusinessWebhook[]> {
        try {
            this.loggerService.info(`Getting active business webhooks for business ID: ${businessId}`);

            const query = `
                SELECT id, business_id, description, callback_url, http_method, 
                       x_api_key, events, status, created_at, updated_at
                FROM integration.business_webhooks 
                WHERE business_id = $1 AND status = 'E'
                ORDER BY created_at DESC
            `;

            const result = await this.postgreSQLConnection.query(query, [businessId]);

            const webhooks: BusinessWebhook[] = result.rows.map((row: any) => ({
                id: row.id,
                businessId: row.business_id,
                description: row.description,
                callbackUrl: row.callback_url,
                httpMethod: row.http_method,
                xApiKey: row.x_api_key,
                events: row.events,
                status: row.status,
                createdAt: new Date(row.created_at),
                updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
            }));

            this.loggerService.info(`Found ${webhooks.length} active webhooks for business ID: ${businessId}`);
            return webhooks;
        } catch (error) {
            this.loggerService.error('Error getting active business webhooks by business ID:', {
                businessId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get active business webhooks by business ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getWebhooksByBusinessIdAndEvent(businessId: string, event: string): Promise<BusinessWebhook[]> {
        try {
            this.loggerService.info(`Getting webhooks for business ID: ${businessId} and event: ${event}`);

            const query = `
                SELECT id, business_id, description, callback_url, http_method, 
                       x_api_key, events, status, created_at, updated_at
                FROM integration.business_webhooks 
                WHERE business_id = $1 
                  AND status = 'E'
                  AND events ? $2
                ORDER BY created_at DESC
            `;

            const result = await this.postgreSQLConnection.query(query, [businessId, event]);

            const webhooks: BusinessWebhook[] = result.rows.map((row: any) => ({
                id: row.id,
                businessId: row.business_id,
                description: row.description,
                callbackUrl: row.callback_url,
                httpMethod: row.http_method,
                xApiKey: row.x_api_key,
                events: row.events,
                status: row.status,
                createdAt: new Date(row.created_at),
                updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
            }));

            this.loggerService.info(`Found ${webhooks.length} webhooks for business ID: ${businessId} and event: ${event}`);
            return webhooks;
        } catch (error) {
            this.loggerService.error('Error getting webhooks by business ID and event:', {
                businessId,
                event,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get webhooks by business ID and event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async createWebhook(webhook: Omit<BusinessWebhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessWebhook> {
        try {
            this.loggerService.info(`Creating business webhook for business ID: ${webhook.businessId}`);

            const query = `
                INSERT INTO integration.business_webhooks 
                (business_id, description, callback_url, http_method, x_api_key, events, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, business_id, description, callback_url, http_method, 
                          x_api_key, events, status, created_at, updated_at
            `;

            const values = [
                webhook.businessId,
                webhook.description,
                webhook.callbackUrl,
                webhook.httpMethod,
                webhook.xApiKey,
                JSON.stringify(webhook.events),
                webhook.status
            ];

            const result = await this.postgreSQLConnection.query(query, values);
            const row = result.rows[0];

            const createdWebhook: BusinessWebhook = {
                id: row.id,
                businessId: row.business_id,
                description: row.description,
                callbackUrl: row.callback_url,
                httpMethod: row.http_method,
                xApiKey: row.x_api_key,
                events: row.events,
                status: row.status,
                createdAt: new Date(row.created_at),
                updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
            };

            this.loggerService.info(`Business webhook created successfully: ${createdWebhook.id}`);
            return createdWebhook;
        } catch (error) {
            this.loggerService.error('Error creating business webhook:', {
                businessId: webhook.businessId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to create business webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async updateWebhook(id: string, updates: Partial<Omit<BusinessWebhook, 'id' | 'businessId' | 'createdAt'>>): Promise<BusinessWebhook | null> {
        try {
            this.loggerService.info(`Updating business webhook: ${id}`);

            // Build dynamic query based on provided updates
            const updateFields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (updates.description !== undefined) {
                updateFields.push(`description = $${paramIndex++}`);
                values.push(updates.description);
            }

            if (updates.callbackUrl !== undefined) {
                updateFields.push(`callback_url = $${paramIndex++}`);
                values.push(updates.callbackUrl);
            }

            if (updates.httpMethod !== undefined) {
                updateFields.push(`http_method = $${paramIndex++}`);
                values.push(updates.httpMethod);
            }

            if (updates.xApiKey !== undefined) {
                updateFields.push(`x_api_key = $${paramIndex++}`);
                values.push(updates.xApiKey);
            }

            if (updates.events !== undefined) {
                updateFields.push(`events = $${paramIndex++}`);
                values.push(JSON.stringify(updates.events));
            }

            if (updates.status !== undefined) {
                updateFields.push(`status = $${paramIndex++}`);
                values.push(updates.status);
            }

            if (updateFields.length === 0) {
                this.loggerService.info(`No fields to update for webhook: ${id}`);
                return this.getWebhookById(id);
            }

            // Always update the updated_at field
            updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(id);

            const query = `
                UPDATE integration.business_webhooks 
                SET ${updateFields.join(', ')}
                WHERE id = $${paramIndex}
                RETURNING id, business_id, description, callback_url, http_method, 
                          x_api_key, events, status, created_at, updated_at
            `;

            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                this.loggerService.info(`Business webhook not found for update: ${id}`);
                return null;
            }

            const row = result.rows[0];
            const updatedWebhook: BusinessWebhook = {
                id: row.id,
                businessId: row.business_id,
                description: row.description,
                callbackUrl: row.callback_url,
                httpMethod: row.http_method,
                xApiKey: row.x_api_key,
                events: row.events,
                status: row.status,
                createdAt: new Date(row.created_at),
                updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
            };

            this.loggerService.info(`Business webhook updated successfully: ${updatedWebhook.id}`);
            return updatedWebhook;
        } catch (error) {
            this.loggerService.error('Error updating business webhook:', {
                id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to update business webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async deleteWebhook(id: string): Promise<boolean> {
        try {
            this.loggerService.info(`Deleting business webhook: ${id}`);

            const query = `
                DELETE FROM integration.business_webhooks 
                WHERE id = $1
            `;

            const result = await this.postgreSQLConnection.query(query, [id]);
            const deleted = result.rowCount > 0;

            if (deleted) {
                this.loggerService.info(`Business webhook deleted successfully: ${id}`);
            } else {
                this.loggerService.info(`Business webhook not found for deletion: ${id}`);
            }

            return deleted;
        } catch (error) {
            this.loggerService.error('Error deleting business webhook:', {
                id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to delete business webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async updateWebhookStatus(id: string, status: string): Promise<boolean> {
        try {
            this.loggerService.info(`Updating business webhook status: ${id} to ${status}`);

            const query = `
                UPDATE integration.business_webhooks 
                SET status = $1, updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
            `;

            const result = await this.postgreSQLConnection.query(query, [status, id]);
            const updated = result.rowCount > 0;

            if (updated) {
                this.loggerService.info(`Business webhook status updated successfully: ${id} -> ${status}`);
            } else {
                this.loggerService.info(`Business webhook not found for status update: ${id}`);
            }

            return updated;
        } catch (error) {
            this.loggerService.error('Error updating business webhook status:', {
                id,
                status,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to update business webhook status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}