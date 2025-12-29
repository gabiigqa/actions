import { CreateFeeTypeData, FeeType } from "@/domain/interfaces/domain/entities/FeeType";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IFeeTypeRepository } from "@/domain/interfaces/infrastructure/repositories/IFeeTypeRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class FeeTypeRepository extends BaseRepository implements IFeeTypeRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getFeeTypeById(id: number): Promise<FeeType | null> {
        const query = `SELECT id, description, code
                      FROM integration.fee_types WHERE id = $1`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting fee type by ID: ${id}`, error);
            throw error;
        }
    }

    async getFeeTypeByCode(code: string): Promise<FeeType | null> {
        const query = `SELECT id, description, code
                      FROM integration.fee_types WHERE UPPER(code) = UPPER($1)`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [code]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting fee type by code: ${code}`, error);
            throw error;
        }
    }

    async createFeeType(feeTypeData: CreateFeeTypeData): Promise<FeeType> {
        const query = `
            INSERT INTO integration.fee_types (description, code)
            VALUES ($1, $2)
            RETURNING id, description, code
        `;

        const values = [
            feeTypeData.description,
            feeTypeData.code.toUpperCase()
        ];

        try {
            this.loggerService.info(`Creating fee type: ${feeTypeData.code}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create fee type - no rows returned');
            }

            const feeType = result.rows[0] as FeeType;
            this.loggerService.info(`Fee type created successfully with ID: ${feeType.id}`);
            return feeType;
        } catch (error) {
            this.loggerService.error('Error creating fee type in database', error);
            throw error;
        }
    }

    async getAllFeeTypes(): Promise<FeeType[]> {
        const query = `SELECT id, description, code
                      FROM integration.fee_types 
                      ORDER BY code ASC`;

        try {
            const result = await this.postgreSQLConnection.query(query);
            return result.rows;
        } catch (error) {
            this.loggerService.error('Error getting all fee types', error);
            throw error;
        }
    }
}