import { ClientData, CreateClientData } from "@/domain/interfaces/domain/services/IClientService";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IClientRepository } from "@/domain/interfaces/infrastructure/repositories/IClientRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class ClientsRepository extends BaseRepository implements IClientRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getClientById(id: string): Promise<ClientData | null> {
        const query = `SELECT   id, business_id, "name", email, status, "type", created_at
                                FROM integration.clients WHERE id = $1`;
        const result = await this.postgreSQLConnection.query(query, [id]);
        return result.rows[0] || null;
    }

    async getClientByEmail(email: string): Promise<ClientData | null> {
        const query = `SELECT   id, business_id, "name", email, status, "type", created_at
                                FROM integration.clients WHERE email = $1`;
        const result = await this.postgreSQLConnection.query(query, [email]);
        return result.rows[0] || null;
    }

    async getClientByUserId(userId: string): Promise<ClientData | null> {
        // This method needs to be implemented based on your business logic
        // For now, returning null as there's no direct user_id field in the clients table
        this.loggerService.warn(`getClientByUserId not implemented. UserId: ${userId}`);
        return null;
    }

    async createClient(clientData: CreateClientData): Promise<ClientData> {
        const query = `
            INSERT INTO integration.clients (business_id, name, email, status, type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, business_id, name, email, status, type, created_at
        `;

        const values = [
            clientData.business_id,
            clientData.name,
            clientData.email,
            clientData.status,
            clientData.type
        ];

        try {
            this.loggerService.info(`Creating client in database: ${clientData.email}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create client - no rows returned');
            }

            const client = result.rows[0] as ClientData;
            this.loggerService.info(`Client created successfully with ID: ${client.id}`);
            return client;
        } catch (error) {
            this.loggerService.error('Error creating client in database', error);
            throw error;
        }
    }
}