import { CreateExchangeRateData, ExchangeRate } from "@/domain/interfaces/domain/entities/ExchangeRate";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IExchangeRateRepository } from "@/domain/interfaces/infrastructure/repositories/IExchangeRateRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class ExchangeRateRepository extends BaseRepository implements IExchangeRateRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    async getExchangeRateById(id: string): Promise<ExchangeRate | null> {
        const query = `
                        SELECT 	er.id exchange_rate_id, er.transaction_type transaction_type_id, tt.code transaction_type_code, 
                        		er.asset_currency_id, acc.code asset_currency_code,	er.fiat_currency_id, fc.code fiat_currency_code, er.rate
                        FROM integration.exchange_rates er
                            inner join integration.transaction_types tt on tt.id = er.transaction_type 
                            inner join integration.asset_crypto_currencies acc on acc.id = er.asset_currency_id 
                            inner join integration.fiat_currencies fc on fc.id = er.fiat_currency_id
                        WHERE er.id = $1`;

        try {
            const result = await this.postgreSQLConnection.query(query, [id]);
            if (!result.rows || result.rows.length === 0) {
                this.loggerService.warn(`No exchange rate found with ID: ${id}`);
            }

            let resultado : ExchangeRate | null = null;
            if (result.rows && result.rows.length > 0) {
                resultado = {
                    id: result.rows[0].exchange_rate_id,
                    transaction_type_id: result.rows[0].transaction_type_id,
                    transaction_type_code: result.rows[0].transaction_type_code,
                    asset_currency_id: result.rows[0].asset_currency_id,
                    asset_currency_code: result.rows[0].asset_currency_code,
                    fiat_currency_id: result.rows[0].fiat_currency_id,
                    fiat_currency_code: result.rows[0].fiat_currency_code,
                    rate: result.rows[0].rate,
                    created_at: result.rows[0].created_at
                };
            }
            return resultado;
        } catch (error) {
            this.loggerService.error(`Error getting exchange rate by ID: ${id}`, error);
            throw error;
        }
    }

    async getExchangeRateByCompositeKey(transactionType: number, assetCurrencyId: number, fiatCurrencyId: number): Promise<ExchangeRate | null> {
        const query = `
                        SELECT 	er.id exchange_rate_id, er.transaction_type transaction_type_id, tt.code transaction_type_code, 
                        		er.asset_currency_id, acc.code asset_currency_code,	er.fiat_currency_id, fc.code fiat_currency_code, er.rate
                        FROM integration.exchange_rates er
                            inner join integration.transaction_types tt on tt.id = er.transaction_type 
                            inner join integration.asset_crypto_currencies acc on acc.id = er.asset_currency_id 
                            inner join integration.fiat_currencies fc on fc.id = er.fiat_currency_id
                        WHERE er.transaction_type = $1 AND er.asset_currency_id = $2 AND er.fiat_currency_id = $3`;

        try {
            const result = await this.postgreSQLConnection.query(query, [transactionType, assetCurrencyId, fiatCurrencyId]);

            if (!result.rows || result.rows.length === 0) {
                this.loggerService.warn(`No exchange rate found for composite key: ${transactionType}, ${assetCurrencyId}, ${fiatCurrencyId}`);
            }

            let resultado : ExchangeRate | null = null;
            if (result.rows && result.rows.length > 0) {
                resultado = {
                    id: result.rows[0].exchange_rate_id,
                    transaction_type_id: result.rows[0].transaction_type_id,
                    transaction_type_code: result.rows[0].transaction_type_code,
                    asset_currency_id: result.rows[0].asset_currency_id,
                    asset_currency_code: result.rows[0].asset_currency_code,
                    fiat_currency_id: result.rows[0].fiat_currency_id,
                    fiat_currency_code: result.rows[0].fiat_currency_code,
                    rate: result.rows[0].rate,
                    created_at: result.rows[0].created_at
                };
            }
            return resultado;
        } catch (error) {
            this.loggerService.error(`Error getting exchange rate by composite key: ${transactionType}, ${assetCurrencyId}, ${fiatCurrencyId}`, error);
            throw error;
        }
    }

    async getAllExchangeRates(): Promise<ExchangeRate[]> {
        const query = `
                        SELECT 	er.id exchange_rate_id, er.transaction_type transaction_type_id, tt.code transaction_type_code, 
                        		er.asset_currency_id, acc.code asset_currency_code,	er.fiat_currency_id, fc.code fiat_currency_code, er.rate
                        FROM integration.exchange_rates er
                            inner join integration.transaction_types tt on tt.id = er.transaction_type 
                            inner join integration.asset_crypto_currencies acc on acc.id = er.asset_currency_id 
                            inner join integration.fiat_currencies fc on fc.id = er.fiat_currency_id
                        ORDER BY er.created_at DESC`;

        try {
            const result = await this.postgreSQLConnection.query(query);
            if (!result.rows) {
                this.loggerService.warn(`No exchange rates found in the database`);
            }
            let resultados: ExchangeRate[] = [];

            if (result.rows) {
                for (const row of result.rows) {
                    this.loggerService.info(`Found exchange rate: ID=${row.id}, Rate=${row.rate}`);
                    resultados.push({
                        id: row.id,
                        transaction_type_id: row.transaction_type,
                        transaction_type_code: row.transaction_type_code,
                        asset_currency_id: row.asset_currency_id,
                        asset_currency_code: row.asset_currency_code,
                        fiat_currency_id: row.fiat_currency_id,
                        fiat_currency_code: row.fiat_currency_code,
                        rate: row.rate,
                        created_at: row.created_at
                    });
                }
            }

            return resultados;
        } catch (error) {
            this.loggerService.error('Error getting all exchange rates', error);
            throw error;
        }
    }

    async getExchangeRatesByTransactionType(transactionType: number): Promise<ExchangeRate[]> {
        const query = `
                        SELECT 	er.id exchange_rate_id, er.transaction_type transaction_type_id, tt.code transaction_type_code, 
                        		er.asset_currency_id, acc.code asset_currency_code,	er.fiat_currency_id, fc.code fiat_currency_code, er.rate
                        FROM integration.exchange_rates er
                            inner join integration.transaction_types tt on tt.id = er.transaction_type 
                            inner join integration.asset_crypto_currencies acc on acc.id = er.asset_currency_id 
                            inner join integration.fiat_currencies fc on fc.id = er.fiat_currency_id 
                        WHERE er.transaction_type = $1
                        ORDER BY er.created_at DESC`;

        try {
            const result = await this.postgreSQLConnection.query(query, [transactionType]);
            if (!result.rows) {
                this.loggerService.warn(`No exchange rates found for transaction type: ${transactionType}`);
            }
            let resultados: ExchangeRate[] = [];
            if (result.rows) {
                for (const row of result.rows) {
                    this.loggerService.info(`Found exchange rate: ID=${row.exchange_rate_id}, Rate=${row.rate}`);
                    resultados.push({
                        id: row.exchange_rate_id,
                        transaction_type_id: row.transaction_type_id,
                        transaction_type_code: row.transaction_type_code,
                        asset_currency_id: row.asset_currency_id,
                        asset_currency_code: row.asset_currency_code,
                        fiat_currency_id: row.fiat_currency_id,
                        fiat_currency_code: row.fiat_currency_code,
                        rate: row.rate,
                        created_at: row.created_at
                    });
                }
            }

            return resultados;
        } catch (error) {
            this.loggerService.error(`Error getting exchange rates by transaction type: ${transactionType}`, error);
            throw error;
        }
    }

    async getExchangeRatesByAssetCurrency(assetCurrencyId: number): Promise<ExchangeRate[]> {
        const query = `
                        SELECT 	er.id exchange_rate_id, er.transaction_type transaction_type_id, tt.code transaction_type_code, 
                        		er.asset_currency_id, acc.code asset_currency_code,	er.fiat_currency_id, fc.code fiat_currency_code, er.rate
                        FROM integration.exchange_rates er
                            inner join integration.transaction_types tt on tt.id = er.transaction_type 
                            inner join integration.asset_crypto_currencies acc on acc.id = er.asset_currency_id 
                            inner join integration.fiat_currencies fc on fc.id = er.fiat_currency_id 
                        WHERE er.asset_currency_id = $1
                        ORDER BY er.created_at DESC`;

        try {
            const result = await this.postgreSQLConnection.query(query, [assetCurrencyId]);
            if (!result.rows) {
                this.loggerService.warn(`No exchange rates found for asset currency ID: ${assetCurrencyId}`);
            }
            let resultados: ExchangeRate[] = [];
            if (result.rows) {
                for (const row of result.rows) {
                    this.loggerService.info(`Found exchange rate: ID=${row.exchange_rate_id}, Rate=${row.rate}`);
                    resultados.push({
                        id: row.exchange_rate_id,
                        transaction_type_id: row.transaction_type_id,
                        transaction_type_code: row.transaction_type_code,
                        asset_currency_id: row.asset_currency_id,
                        asset_currency_code: row.asset_currency_code,
                        fiat_currency_id: row.fiat_currency_id,
                        fiat_currency_code: row.fiat_currency_code,
                        rate: row.rate,
                        created_at: row.created_at
                    });
                }
            }
            return resultados;
        } catch (error) {
            this.loggerService.error(`Error getting exchange rates by asset currency: ${assetCurrencyId}`, error);
            throw error;
        }
    }

    async getExchangeRatesByFiatCurrency(fiatCurrencyId: number): Promise<ExchangeRate[]> {
        const query = `
                        SELECT 	er.id exchange_rate_id, er.transaction_type transaction_type_id, tt.code transaction_type_code, 
                        		er.asset_currency_id, acc.code asset_currency_code,	er.fiat_currency_id, fc.code fiat_currency_code, er.rate
                        FROM integration.exchange_rates er
                            inner join integration.transaction_types tt on tt.id = er.transaction_type 
                            inner join integration.asset_crypto_currencies acc on acc.id = er.asset_currency_id 
                            inner join integration.fiat_currencies fc on fc.id = er.fiat_currency_id 
                        WHERE er.fiat_currency_id = $1
                        ORDER BY er.created_at DESC`;

        try {
            const result = await this.postgreSQLConnection.query(query, [fiatCurrencyId]);
            if (!result.rows) {
                this.loggerService.warn(`No exchange rates found for fiat currency ID: ${fiatCurrencyId}`);
            }

            let resultados: ExchangeRate[] = [];

            if (result.rows) {
                for (const row of result.rows) {
                    this.loggerService.info(`Found exchange rate: ID=${row.exchange_rate_id}, Rate=${row.rate}`);
                    resultados.push({
                        id: row.exchange_rate_id,
                        transaction_type_id: row.transaction_type_id,
                        transaction_type_code: row.transaction_type_code,
                        asset_currency_id: row.asset_currency_id,
                        asset_currency_code: row.asset_currency_code,
                        fiat_currency_id: row.fiat_currency_id,
                        fiat_currency_code: row.fiat_currency_code,
                        rate: row.rate,
                        created_at: row.created_at
                    });
                }
            }

            return resultados;
        } catch (error) {
            this.loggerService.error(`Error getting exchange rates by fiat currency: ${fiatCurrencyId}`, error);
            throw error;
        }
    }

    async createExchangeRate(exchangeRateData: CreateExchangeRateData): Promise<ExchangeRate> {
        const query = `
            INSERT INTO integration.exchange_rates (transaction_type, asset_currency_id, fiat_currency_id, rate)
            VALUES ($1, $2, $3, $4)
            RETURNING id, transaction_type, asset_currency_id, fiat_currency_id, rate, created_at
        `;

        const values = [
            exchangeRateData.transaction_type_id,
            exchangeRateData.asset_currency_id,
            exchangeRateData.fiat_currency_id,
            exchangeRateData.rate
        ];

        try {
            this.loggerService.info(`Creating exchange rate: ${exchangeRateData.transaction_type_id}, ${exchangeRateData.asset_currency_id}, ${exchangeRateData.fiat_currency_id}`);
            await this.postgreSQLConnection.initialize();
            const result = await this.postgreSQLConnection.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Failed to create exchange rate - no rows returned');
            }

            const exchangeRate = result.rows[0] as ExchangeRate;
            this.loggerService.info(`Exchange rate created successfully with ID: ${exchangeRate.id}`);
            return exchangeRate;
        } catch (error) {
            this.loggerService.error('Error creating exchange rate in database', error);
            throw error;
        }
    }
}