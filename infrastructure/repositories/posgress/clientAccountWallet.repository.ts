import { ClientAccountWallet, CreateClientAccountWalletData } from "@/domain/interfaces/domain/entities/ClientAccountWallet";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IClientAccountWalletRepository } from "@/domain/interfaces/infrastructure/repositories/IClientAccountWalletRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class ClientAccountWalletRepository extends BaseRepository implements IClientAccountWalletRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getClientAccountWalletById(id: string): Promise<ClientAccountWallet | null> {
        const query = `
                    SELECT  caw.id, caw.client_account_id, caw.wallet_address, caw.asset_currency_id, 
                            caw.network, caw.memo, caw.status, caw.created_at
                    FROM integration.client_account_wallets caw
                    WHERE caw.id = $1 AND caw.status = 'E'`;

        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting client account wallet by ID: ${id}`, error);
            return null;
        }
    }

    async getClientAccountWalletsByClientAccountId(clientAccountId: string): Promise<ClientAccountWallet[] | null> {
        const query = `
                    SELECT  caw.id, caw.client_account_id, caw.wallet_address, caw.asset_currency_id, 
                            caw.network, caw.memo, caw.status, caw.created_at
                    FROM integration.client_account_wallets caw
                        inner join integration.client_accounts ca on ca.id = caw.client_account_id
                    WHERE caw.client_account_id = $1 AND caw.status = 'E' and ca.status = 'E'
                    ORDER BY caw.created_at DESC`;

        try {
            const result = await this.postgreSQLConnection.query(query, [clientAccountId]);
            return result.rows;
        } catch (error) {
            this.loggerService.error(`Error getting client account wallets for client account ID: ${clientAccountId}`, error);
            return null;
        }
    }

    async getClientAccountWalletByClientId(clientId: string): Promise<ClientAccountWallet[] | null> {
        const query = `
                    SELECT  caw.id, caw.client_account_id, caw.wallet_address, caw.asset_currency_id, 
                            caw.network, caw.memo, caw.status, caw.created_at
                    FROM integration.client_account_wallets caw
                        inner join integration.client_accounts ca on ca.id = caw.client_account_id
                        inner join integration.clients c on c.id = ca.client_id
                    WHERE c.id = $1 AND caw.status = 'E' and ca.status = 'E' and c.status = 'E'
                    ORDER BY caw.created_at DESC`;

        try {
            const result = await this.postgreSQLConnection.query(query, [clientId]);
            return result.rows;
        } catch (error) {
            this.loggerService.error(`Error getting client account wallet by client ID: ${clientId}`, error);
            return null;
        }
    }

    async createClientAccountWallet(walletData: CreateClientAccountWalletData): Promise<ClientAccountWallet> {
        const query = `
            INSERT INTO integration.client_account_wallets (client_account_id, wallet_address, asset_currency_id, network, memo, status)
            VALUES ($1, $2, $3, $4, $5, 'E')
            RETURNING id, client_account_id, wallet_address, asset_currency_id, network, memo, status, created_at
        `;

        const values = [
            walletData.client_account_id,
            walletData.wallet_address,
            walletData.asset_currency_id,
            walletData.network,
            walletData.memo || null
        ];

        try {
            this.loggerService.info(`Creating client account wallet for client account: ${walletData.client_account_id}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create client account wallet - no rows returned');
            }

            const wallet = result.rows[0] as ClientAccountWallet;
            this.loggerService.info(`Client account wallet created successfully with ID: ${wallet.id}`);
            return wallet;
        } catch (error) {
            this.loggerService.error('Error creating client account wallet in database', error);
            throw error;
        }
    }

    async deleteClientAccountWallet(id: string): Promise<boolean> {
        const query = `UPDATE integration.client_account_wallets SET status = 'D' WHERE id = $1`;

        try {
            this.loggerService.info(`Deleting client account wallet with ID: ${id}`);
            const result = await this.postgreSQLConnection.query(query, [id]);

            const deleted: boolean = result.rowCount > 0;
            if (deleted) {
                this.loggerService.info(`Client account wallet deleted successfully: ${id}`);
            } else {
                this.loggerService.warn(`Client account wallet not found for deletion: ${id}`);
            }

            return deleted;
        } catch (error) {
            this.loggerService.error(`Error deleting client account wallet: ${id}`, error);
            throw error;
        }
    }
}