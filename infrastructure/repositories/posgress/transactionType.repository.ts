import { CreateTransactionTypeData, TransactionType } from "@/domain/interfaces/domain/entities/TransactionType";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { ITransactionTypeRepository } from "@/domain/interfaces/infrastructure/repositories/ITransactionTypeRepository";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class TransactionTypeRepository extends BaseRepository implements ITransactionTypeRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getTransactionTypeById(id: number): Promise<TransactionType | null> {
        const query = `SELECT id, description, code
                      FROM integration.transaction_types WHERE id = $1`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting transaction type by ID: ${id}`, error);
            throw error;
        }
    }

    async getTransactionTypeByCode(code: string): Promise<TransactionType | null> {
        const query = `SELECT id, description, code
                      FROM integration.transaction_types WHERE UPPER(code) = UPPER($1)`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [code]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting transaction type by code: ${code}`, error);
            throw error;
        }
    }

    async createTransactionType(transactionTypeData: CreateTransactionTypeData): Promise<TransactionType> {
        const query = `
            INSERT INTO integration.transaction_types (description, code)
            VALUES ($1, $2)
            RETURNING id, description, code
        `;

        const values = [
            transactionTypeData.description,
            transactionTypeData.code.toUpperCase()
        ];

        try {
            this.loggerService.info(`Creating transaction type: ${transactionTypeData.code}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create transaction type - no rows returned');
            }

            const transactionType = result.rows[0] as TransactionType;
            this.loggerService.info(`Transaction type created successfully with ID: ${transactionType.id}`);
            return transactionType;
        } catch (error) {
            this.loggerService.error('Error creating transaction type in database', error);
            throw error;
        }
    }

    async getAllTransactionTypes(): Promise<TransactionType[]> {
        const query = `SELECT id, description, code
                      FROM integration.transaction_types 
                      ORDER BY code ASC`;

        try {
            const result = await this.postgreSQLConnection.query(query);
            return result.rows;
        } catch (error) {
            this.loggerService.error('Error getting all transaction types', error);
            throw error;
        }
    }
}