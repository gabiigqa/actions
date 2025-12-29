import { CryptoCurrency } from "@/domain/interfaces/domain/entities/CryptoCurrency";
import { CreateExternalIntegrationData, ExternalIntegration } from "@/domain/interfaces/domain/entities/ExternalIntegrations";
import { FiatCurrency } from "@/domain/interfaces/domain/entities/FiatCurrency";
import { Partner } from "@/domain/interfaces/domain/entities/Partner";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IPartnerRepository } from "@/domain/interfaces/infrastructure/repositories/IPartnerRepository";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class PartnersRepository extends BaseRepository implements IPartnerRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    public async getPartnerIdByApiKeyCallback(apiKeyCallback: string): Promise<string | null> {
        const query = `SELECT cp.partner_id 
                       FROM integration.configuration_partners cp
                       inner join integration.partners p on cp.partner_id = p.id
                       WHERE cp.api_key_callback = $1 and p.status = 'E' and cp.status = 'E'`;
        const result = await this.postgreSQLConnection.query(query, [apiKeyCallback]);
        if (result.rows.length > 0) {
            return result.rows[0].partner_id;
        } else {
            return null;
        }
    }

    public async insertExternalIntegration(externalIntegrationData: CreateExternalIntegrationData): Promise<ExternalIntegration | null> {
        let client;
        try {
            // Begin database transaction
            client = await this.postgreSQLConnection.beginTransaction();

            const query = `INSERT INTO integration.external_integrations 
                          (partner_id, transaction_id, internal_reference, partner_reference, response_code, response_message, details, status) 
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                          RETURNING id, partner_id, transaction_id, internal_reference, partner_reference, response_code, response_message, details, status, created_at`;

            const values = [
                externalIntegrationData.partnerId,
                externalIntegrationData.transactionId,
                externalIntegrationData.internalReference,
                externalIntegrationData.partnerReference,
                externalIntegrationData.responseCode,
                externalIntegrationData.responseMessage,
                JSON.stringify(externalIntegrationData.details),
                externalIntegrationData.status
            ];

            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                this.loggerService.error('Failed to insert external integration record - no rows returned');
                await this.postgreSQLConnection.rollbackTransaction(client);
                return null;
            }

            // Commit the transaction
            await this.postgreSQLConnection.commitTransaction(client);

            // Construct the complete external integration object
            const insertedExternalIntegration: ExternalIntegration = {
                id: result.rows[0].id,
                partnerId: result.rows[0].partner_id,
                transactionId: result.rows[0].transaction_id,
                internalReference: result.rows[0].internal_reference,
                partnerReference: result.rows[0].partner_reference,
                responseCode: result.rows[0].response_code,
                responseMessage: result.rows[0].response_message,
                details: result.rows[0].details,
                status: result.rows[0].status,
                createdAt: new Date(result.rows[0].created_at)
            };

            this.loggerService.info(`External integration record inserted successfully with ID: ${insertedExternalIntegration.id} for transaction: ${insertedExternalIntegration.transactionId}`);

            return insertedExternalIntegration;

        } catch (error) {
            // Rollback transaction on error
            if (client) {
                try {
                    await this.postgreSQLConnection.rollbackTransaction(client);
                    this.loggerService.info('External integration transaction rolled back due to error');
                } catch (rollbackError) {
                    this.loggerService.error('Error during rollback:', {
                        originalError: error instanceof Error ? error.message : 'Unknown error',
                        rollbackError: rollbackError instanceof Error ? rollbackError.message : 'Unknown rollback error'
                    });
                }
            }

            this.loggerService.error(`Error inserting external integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
        }
    }

    public async updateDataCallbackData(partnerReference: string, data: any, apiKeyCallback: string): Promise<void> {
        let client;
        try {
            const partnerId = await this.getPartnerIdByApiKeyCallback(apiKeyCallback);
            if (!partnerId) {
                this.loggerService.error('Invalid API Key Callback. Cannot update data.');
                return;
            }

            // Begin database transaction
            client = await this.postgreSQLConnection.beginTransaction();

            const selectQuery = `SELECT details, transaction_id
                               FROM integration.external_integrations
                               WHERE partner_reference = $1 AND partner_id = $2`;
            const result = await client.query(selectQuery, [partnerReference, partnerId]);
            if (result.rows.length === 0) {
                this.loggerService.error('No external integration record found for the given partner reference and partner ID.');
                await this.postgreSQLConnection.rollbackTransaction(client);
                return;
            }

            const existingDetails = result.rows[0].details || {};
            const transactionId = result.rows[0].transaction_id;

            const updatedDetails = { ...existingDetails, updateQRstatus: data };
            const updateQuery = `UPDATE integration.external_integrations
                                 SET details = $1,
                                     response_code = $2
                                 WHERE partner_reference = $3 AND partner_id = $4`;

            const values = [JSON.stringify(updatedDetails), data.status, partnerReference, partnerId];
            await client.query(updateQuery, values);

            const updateTransactionStatusQuery = `UPDATE integration.transactions
                                                  SET transaction_status = $1
                                                  WHERE id = $2`;
            const valuesTransactionStatus = [data.transactionStatusId, transactionId];
            await client.query(updateTransactionStatusQuery, valuesTransactionStatus);

            // Commit the transaction
            await this.postgreSQLConnection.commitTransaction(client);

            this.loggerService.info('Data callback status updated successfully.');

        } catch (error) {
            // Rollback transaction on error
            if (client) {
                try {
                    await this.postgreSQLConnection.rollbackTransaction(client);
                    this.loggerService.info('Data callback update transaction rolled back due to error');
                } catch (rollbackError) {
                    this.loggerService.error('Error during rollback:', {
                        originalError: error instanceof Error ? error.message : 'Unknown error',
                        rollbackError: rollbackError instanceof Error ? rollbackError.message : 'Unknown rollback error'
                    });
                }
            }

            this.loggerService.error('Error updating data callback status:', error);
            throw error;
        }
    }

    public async getPartnerById(partnerId: string): Promise<Partner | null> {
        try {
            const query = `SELECT 
                            id, 
                            name, 
                            email, 
                            phone_contact, 
                            status, 
                            code,
                            created_at 
                           FROM integration.partners 
                           WHERE id = $1`;
            const result = await this.postgreSQLConnection.query(query, [partnerId]);

            if (result.rows.length > 0) {
                const row = result.rows[0];
                return {
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    phoneContact: row.phone_contact,
                    status: row.status,
                    code: row.code,
                    createdAt: row.created_at
                };
            }
            return null;
        } catch (error) {
            this.loggerService.error('Error getting partner by ID:', error);
            throw error;
        }
    }

    public async getPartnerByCode(partnerCode: string): Promise<Partner | null> {
        try {
            const query = `SELECT 
                            id, 
                            name, 
                            email, 
                            phone_contact, 
                            status, 
                            code,
                            created_at 
                           FROM integration.partners 
                           WHERE code = $1`;
            const result = await this.postgreSQLConnection.query(query, [partnerCode]);

            if (result.rows.length > 0) {
                const row = result.rows[0];
                return {
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    phoneContact: row.phone_contact,
                    status: row.status,
                    code: row.code,
                    createdAt: row.created_at
                };
            }
            return null;
        } catch (error) {
            this.loggerService.error('Error getting partner by ID:', error);
            throw error;
        }
    }

    public async getPartnersByCountry(countryCode: string): Promise<Partner[]> {
        try {
            const query = `SELECT 
                            p.id, 
                            p.name, 
                            p.email, 
                            p.phone_contact, 
                            p.status, 
                            p.created_at 
                           FROM integration.partners p
                           INNER JOIN integration.partner_enabled_countries pec 
                               ON p.id = pec.partner_id
                            INNER JOIN integration.countries c ON pec.country_code = c.code
                           WHERE c.code_iso_alpha_2 = $1
                               AND p.status = 'E'
                           ORDER BY p.name`;
            const result = await this.postgreSQLConnection.query(query, [countryCode]);

            return result.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                email: row.email,
                phoneContact: row.phone_contact,
                status: row.status,
                createdAt: row.created_at
            }));
        } catch (error) {
            this.loggerService.error('Error getting partners by country:', error);
            throw error;
        }
    }

    public async getPartnerEnabledCountries(partnerId: string): Promise<number[]> {
        try {
            const query = `SELECT pec.country_code 
                           FROM integration.partner_enabled_countries pec
                           INNER JOIN integration.partners p ON pec.partner_id = p.id
                           WHERE pec.partner_id = $1 AND p.status = 'E'
                           ORDER BY pec.country_code`;
            const result = await this.postgreSQLConnection.query(query, [partnerId]);

            return result.rows.map((row: any) => row.country_code);
        } catch (error) {
            this.loggerService.error('Error getting partner enabled countries:', error);
            throw error;
        }
    }

    public async getPartnerEnabledFiatCurrencies(partnerId: string, countryCode: number): Promise<FiatCurrency[]> {
        try {
            const query = `SELECT 
                            fc.id, 
                            fc.name, 
                            fc.symbol, 
                            fc.code 
                           FROM integration.partners_supported_fiat_currencies psfc
                           INNER JOIN integration.partners p ON psfc.partner_id = p.id
                           INNER JOIN integration.fiat_currencies fc ON psfc.fiat_currency_id = fc.id
                           WHERE psfc.partner_id = $1 
                               AND psfc.country_code = $2 
                               AND p.status = 'E' 
                               AND psfc.status = 'E'
                           ORDER BY fc.name`;
            const result = await this.postgreSQLConnection.query(query, [partnerId, countryCode]);

            return result.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                symbol: row.symbol,
                code: row.code
            }));
        } catch (error) {
            this.loggerService.error('Error getting partner enabled fiat currencies:', error);
            throw error;
        }
    }

    public async getPartnerEnabledAssets(partnerId: string, countryCode: number): Promise<CryptoCurrency[]> {
        try {
            const query = `SELECT 
                            acc.id, 
                            acc.name, 
                            acc.symbol, 
                            acc.code 
                           FROM integration.partners_supported_asset_currencies psac
                           INNER JOIN integration.partners p ON psac.partner_id = p.id
                           INNER JOIN integration.asset_crypto_currencies acc ON psac.asset_currency_id = acc.id
                           WHERE psac.partner_id = $1 
                               AND psac.country_code = $2 
                               AND p.status = 'E' 
                               AND psac.status = 'E'
                           ORDER BY acc.name`;
            const result = await this.postgreSQLConnection.query(query, [partnerId, countryCode]);

            return result.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                symbol: row.symbol,
                code: row.code
            }));
        } catch (error) {
            this.loggerService.error('Error getting partner enabled assets:', error);
            throw error;
        }
    }

    public async getPartnerEnabledFiatCurrencyById(partnerId: string, countryCode: number, fiatCurrencyId: number): Promise<FiatCurrency | null> {
        try {
            const query = `SELECT 
                            fc.id, 
                            fc.name, 
                            fc.symbol, 
                            fc.code 
                           FROM integration.partners_supported_fiat_currencies psfc
                           INNER JOIN integration.partners p ON psfc.partner_id = p.id
                           INNER JOIN integration.fiat_currencies fc ON psfc.fiat_currency_id = fc.id
                           WHERE psfc.partner_id = $1 
                               AND psfc.country_code = $2 
                               AND psfc.fiat_currency_id = $3
                               AND p.status = 'E' 
                               AND psfc.status = 'E'`;
            const result = await this.postgreSQLConnection.query(query, [partnerId, countryCode, fiatCurrencyId]);

            if (result.rows.length > 0) {
                const row = result.rows[0];
                return {
                    id: row.id,
                    name: row.name,
                    symbol: row.symbol,
                    code: row.code
                };
            }
            return null;
        } catch (error) {
            this.loggerService.error('Error getting partner enabled fiat currency by ID:', error);
            throw error;
        }
    }

    public async getPartnerEnabledAssetById(partnerId: string, countryCode: number, assetCurrencyId: number): Promise<CryptoCurrency | null> {
        try {
            const query = `SELECT 
                            acc.id, 
                            acc.name, 
                            acc.symbol, 
                            acc.code 
                           FROM integration.partners_supported_asset_currencies psac
                           INNER JOIN integration.partners p ON psac.partner_id = p.id
                           INNER JOIN integration.asset_crypto_currencies acc ON psac.asset_currency_id = acc.id
                           WHERE psac.partner_id = $1 
                               AND psac.country_code = $2 
                               AND psac.asset_currency_id = $3
                               AND p.status = 'E' 
                               AND psac.status = 'E'`;
            const result = await this.postgreSQLConnection.query(query, [partnerId, countryCode, assetCurrencyId]);

            if (result.rows.length > 0) {
                const row = result.rows[0];
                return {
                    id: row.id,
                    name: row.name,
                    symbol: row.symbol,
                    code: row.code
                };
            }
            return null;
        } catch (error) {
            this.loggerService.error('Error getting partner enabled asset by ID:', error);
            throw error;
        }
    }

    public async countPartnerTransactions(partnerId: string): Promise<number> {
        try {
            const query = `SELECT COUNT(*) AS transaction_count
                           FROM integration.external_integrations
                           WHERE partner_id = $1`;
            const result = await this.postgreSQLConnection.query(query, [partnerId]);
            return parseInt(result.rows[0].transaction_count, 10);
        } catch (error) {
            this.loggerService.error('Error counting partner transactions:', error);
            throw error;
        }
    }
}
