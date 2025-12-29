import { CreateCryptoCurrencyData, CryptoCurrency } from "@/domain/interfaces/domain/entities/CryptoCurrency";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { ICryptoCurrencyRepository } from "@/domain/interfaces/infrastructure/repositories/ICryptoCurrencyRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class CryptoCurrencyRepository extends BaseRepository implements ICryptoCurrencyRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getCryptoCurrencyById(id: number): Promise<CryptoCurrency | null> {
        const query = `SELECT id, name, symbol, code
                      FROM integration.asset_crypto_currencies WHERE id = $1`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting crypto currency by ID: ${id}`, error);
            throw error;
        }
    }

    async getCryptoCurrencyByCode(code: string): Promise<CryptoCurrency | null> {
        const query = `SELECT id, name, symbol, code
                      FROM integration.asset_crypto_currencies WHERE UPPER(code) = UPPER($1)`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [code]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting crypto currency by code: ${code}`, error);
            throw error;
        }
    }

    async getCryptoCurrencyBySymbol(symbol: string): Promise<CryptoCurrency | null> {
        const query = `SELECT id, name, symbol, code
                      FROM integration.asset_crypto_currencies WHERE symbol = $1`;
        
        try {
            const result = await this.postgreSQLConnection.query(query, [symbol]);
            return result.rows[0] || null;
        } catch (error) {
            this.loggerService.error(`Error getting crypto currency by symbol: ${symbol}`, error);
            throw error;
        }
    }

    async createCryptoCurrency(cryptoCurrencyData: CreateCryptoCurrencyData): Promise<CryptoCurrency> {
        const query = `
            INSERT INTO integration.asset_crypto_currencies (name, symbol, code)
            VALUES ($1, $2, $3)
            RETURNING id, name, symbol, code
        `;

        const values = [
            cryptoCurrencyData.name,
            cryptoCurrencyData.symbol,
            cryptoCurrencyData.code.toUpperCase()
        ];

        try {
            this.loggerService.info(`Creating crypto currency: ${cryptoCurrencyData.code}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create crypto currency - no rows returned');
            }

            const cryptoCurrency = result.rows[0] as CryptoCurrency;
            this.loggerService.info(`Crypto currency created successfully with ID: ${cryptoCurrency.id}`);
            return cryptoCurrency;
        } catch (error) {
            this.loggerService.error('Error creating crypto currency in database', error);
            throw error;
        }
    }

    async getAllCryptoCurrencies(): Promise<CryptoCurrency[]> {
        const query = `SELECT id, name, symbol, code
                      FROM integration.asset_crypto_currencies 
                      ORDER BY code ASC`;

        try {
            const result = await this.postgreSQLConnection.query(query);
            return result.rows;
        } catch (error) {
            this.loggerService.error('Error getting all crypto currencies', error);
            throw error;
        }
    }
}