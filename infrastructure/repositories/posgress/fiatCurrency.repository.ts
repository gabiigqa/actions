import { CreateFiatCurrencyData, FiatCurrency } from "@/domain/interfaces/domain/entities/FiatCurrency";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IFiatCurrencyRepository } from "@/domain/interfaces/infrastructure/repositories/IFiatCurrencyRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class FiatCurrencyRepository extends BaseRepository implements IFiatCurrencyRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getFiatCurrencyById(id: number): Promise<FiatCurrency | null> {
        const query = `SELECT id, name, symbol, code
                      FROM integration.fiat_currencies WHERE id = $1`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting fiat currency by ID: ${id}`, error);
            throw error;
        }
    }

    async getFiatCurrencyByCode(code: string): Promise<FiatCurrency | null> {
        const query = `SELECT id, name, symbol, code
                      FROM integration.fiat_currencies WHERE UPPER(code) = UPPER($1)`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [code]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting fiat currency by code: ${code}`, error);
            throw error;
        }
    }

    async getFiatCurrencyBySymbol(symbol: string): Promise<FiatCurrency | null> {
        const query = `SELECT id, name, symbol, code
                      FROM integration.fiat_currencies WHERE symbol = $1`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [symbol]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting fiat currency by symbol: ${symbol}`, error);
            throw error;
        }
    }

    async createFiatCurrency(fiatCurrencyData: CreateFiatCurrencyData): Promise<FiatCurrency> {
        const query = `
            INSERT INTO integration.fiat_currencies (name, symbol, code)
            VALUES ($1, $2, $3)
            RETURNING id, name, symbol, code
        `;

        const values = [
            fiatCurrencyData.name,
            fiatCurrencyData.symbol,
            fiatCurrencyData.code.toUpperCase()
        ];

        try {
            this.loggerService.info(`Creating fiat currency: ${fiatCurrencyData.code}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create fiat currency - no rows returned');
            }

            const fiatCurrency = result.rows[0] as FiatCurrency;
            this.loggerService.info(`Fiat currency created successfully with ID: ${fiatCurrency.id}`);
            return fiatCurrency;
        } catch (error) {
            this.loggerService.error('Error creating fiat currency in database', error);
            throw error;
        }
    }

    async getAllFiatCurrencies(): Promise<FiatCurrency[]> {
        const query = `SELECT id, name, symbol, code
                      FROM integration.fiat_currencies 
                      ORDER BY code ASC`;

        try {
            const result = await this.postgreSQLConnection.query(query);
            return result.rows;
        } catch (error) {
            this.loggerService.error('Error getting all fiat currencies', error);
            throw error;
        }
    }
}