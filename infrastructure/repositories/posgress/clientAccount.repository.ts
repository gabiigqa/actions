import { ClientAccount, CreateClientAccountData } from "@/domain/interfaces/domain/entities/ClientAccount";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IClientAccountRepository } from "@/domain/interfaces/infrastructure/repositories/IClientAccountRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class ClientAccountRepository extends BaseRepository implements IClientAccountRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getClientAccountById(id: string): Promise<ClientAccount | null> {
        const query = ` SELECT id, client_id, name, currency_id, status
                        FROM integration.client_accounts 
                        WHERE id = $1 and status = 'E'`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting client account by ID: ${id}`, error);
            throw error;
        }
    }

    async getClientAccountsByClientId(clientId: string): Promise<ClientAccount[]> {
        const query = ` SELECT ca.id, ca.client_id, ca.name, ca.currency_id, ca.status
                        FROM integration.client_accounts ca
                        inner join integration.clients c on c.id = ca.client_id
                        WHERE ca.client_id = $1 and ca.status = 'E' and c.status = 'E'
                        ORDER BY ca.created_at DESC`;

        try {
            const result = await this.postgreSQLConnection.query(query, [clientId]);
            return result.rows;
        } catch (error) {
            this.loggerService.error(`Error getting client accounts for client ID: ${clientId}`, error);
            throw error;
        }
    }

    async createClientAccount(clientAccountData: CreateClientAccountData): Promise<ClientAccount> {
        const query = `
            INSERT INTO integration.client_accounts (client_id, name, currency_id)
            VALUES ($1, $2, $3)
            RETURNING id, client_id, name, currency_id
        `;

        const values = [
            clientAccountData.client_id,
            clientAccountData.name,
            clientAccountData.currency_id
        ];

        try {
            this.loggerService.info(`Creating client account for client: ${clientAccountData.client_id}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create client account - no rows returned');
            }

            const clientAccount = result.rows[0] as ClientAccount;
            this.loggerService.info(`Client account created successfully with ID: ${clientAccount.id}`);
            return clientAccount;
        } catch (error) {
            this.loggerService.error('Error creating client account in database', error);
            throw error;
        }
    }

    async deleteClientAccount(id: string): Promise<boolean> {
        const query = `UPDATE integration.client_accounts SET status = 'D' WHERE id = $1`;

        try {
            this.loggerService.info(`Deleting client account with ID: ${id}`);
            const result = await this.postgreSQLConnection.query(query, [id]);

            const deleted: boolean = result.rowCount > 0;
            if (deleted) {
                this.loggerService.info(`Client account deleted successfully: ${id}`);
            } else {
                this.loggerService.warn(`Client account not found for deletion: ${id}`);
            }
            
            return deleted;
        } catch (error) {
            this.loggerService.error(`Error deleting client account: ${id}`, error);
            throw error;
        }
    }
}