import { Business } from "@/domain/interfaces/domain/entities/Business";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IBusinessRepository } from "@/domain/interfaces/infrastructure/repositories/IBusinessRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class BusinessRepository extends BaseRepository implements IBusinessRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getBusinessById(businessId: string): Promise<Business | null> {
        try {
            this.loggerService.info(`Getting business by ID: ${businessId}`);

            const query = `
                SELECT id, name, email, phone_contact, status, created_at 
                FROM integration.business 
                WHERE id = $1 AND status = 'E'
            `;

            const result = await this.postgreSQLConnection.query(query, [businessId]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Business not found or disabled for ID: ${businessId}`);
                return null;
            }

            const row = result.rows[0];
            const business: Business = {
                id: row.id,
                name: row.name,
                email: row.email,
                phoneContact: row.phone_contact,
                status: row.status,
                createdAt: new Date(row.created_at)
            };

            this.loggerService.info(`Business found: ${business.name} (${business.email})`);
            return business;
        } catch (error) {
            this.loggerService.error('Error getting business by ID:', {
                businessId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get business by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getBusinessByEmail(email: string): Promise<Business | null> {
        try {
            this.loggerService.info(`Getting business by email: ${email}`);

            const query = `
                SELECT id, name, email, phone_contact, status, created_at 
                FROM integration.business 
                WHERE email = $1 AND status = 'E'
            `;

            const result = await this.postgreSQLConnection.query(query, [email]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Business not found or disabled for email: ${email}`);
                return null;
            }

            const row = result.rows[0];
            const business: Business = {
                id: row.id,
                name: row.name,
                email: row.email,
                phoneContact: row.phone_contact,
                status: row.status,
                createdAt: new Date(row.created_at)
            };

            this.loggerService.info(`Business found: ${business.name} (ID: ${business.id})`);
            return business;
        } catch (error) {
            this.loggerService.error('Error getting business by email:', {
                email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get business by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getBusinessWithUserByUsername(username: string): Promise<Business | null> {
        try {
            this.loggerService.info(`Getting business with user data by username: ${username}`);

            const query = `
                SELECT 
                    b.id as business_id, 
                    b.name as business_name, 
                    b.email as business_email, 
                    b.phone_contact as business_phone_contact, 
                    b.status as business_status, 
                    b.created_at as business_created_at,
                    u.id as user_id,
                    u.business_id as user_business_id,
                    u.username,
                    u.password_hash,
                    u.status as user_status,
                    u.created_at as user_created_at
                FROM integration.business b
                INNER JOIN integration.users u ON b.id = u.business_id
                WHERE u.username = $1 AND b.status = 'E' AND u.status = 'E'
            `;

            const result = await this.postgreSQLConnection.query(query, [username]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Business with user not found or disabled for username: ${username}`);
                return null;
            }

            const row = result.rows[0];

            const business: Business = {
                id: row.business_id,
                name: row.business_name,
                email: row.business_email,
                phoneContact: row.business_phone_contact,
                status: row.business_status,
                createdAt: new Date(row.business_created_at),
                userData: {
                    id: row.user_id,
                    businessId: row.user_business_id,
                    username: row.username,
                    passwordHash: row.password_hash,
                    status: row.user_status,
                    createdAt: new Date(row.user_created_at)
                }
            };

            this.loggerService.info(`Business with user found: ${business.name} (Business ID: ${business.id}, User: ${username})`);
            return business;
        } catch (error) {
            this.loggerService.error('Error getting business with user by username:', {
                username,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get business with user by username: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}