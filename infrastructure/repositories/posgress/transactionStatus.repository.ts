import { CreateTransactionStatusData, TransactionStatus } from "@/domain/interfaces/domain/entities/TransactionStatus";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { ITransactionStatusRepository } from "@/domain/interfaces/infrastructure/repositories/ITransactionStatusRepository";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class TransactionStatusRepository extends BaseRepository implements ITransactionStatusRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getTransactionStatusById(id: number): Promise<TransactionStatus | null> {
        const query = `SELECT id, description, code
                      FROM integration.transaction_statuses WHERE id = $1`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting transaction status by ID: ${id}`, error);
            throw error;
        }
    }

    async getTransactionStatusByCode(code: string): Promise<TransactionStatus | null> {
        const query = `SELECT id, description, code
                      FROM integration.transaction_statuses WHERE UPPER(code) = UPPER($1)`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [code]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting transaction status by code: ${code}`, error);
            throw error;
        }
    }

    async createTransactionStatus(transactionStatusData: CreateTransactionStatusData): Promise<TransactionStatus> {
        const query = `
            INSERT INTO integration.transaction_statuses (description, code)
            VALUES ($1, $2)
            RETURNING id, description, code
        `;

        const values = [
            transactionStatusData.description,
            transactionStatusData.code.toUpperCase()
        ];

        try {
            this.loggerService.info(`Creating transaction status: ${transactionStatusData.code}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create transaction status - no rows returned');
            }

            const transactionStatus = result.rows[0] as TransactionStatus;
            this.loggerService.info(`Transaction status created successfully with ID: ${transactionStatus.id}`);
            return transactionStatus;
        } catch (error) {
            this.loggerService.error('Error creating transaction status in database', error);
            throw error;
        }
    }

    async getAllTransactionStatuses(): Promise<TransactionStatus[]> {
        const query = `SELECT id, description, code
                      FROM integration.transaction_statuses 
                      ORDER BY code ASC`;

        try {
            const result = await this.postgreSQLConnection.query(query);
            return result.rows;
        } catch (error) {
            this.loggerService.error('Error getting all transaction statuses', error);
            throw error;
        }
    }
}