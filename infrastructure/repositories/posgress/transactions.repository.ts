import { ExternalIntegration } from "@/domain/interfaces/domain/entities/ExternalIntegrations";
import { CreateTransactionData, Transaction, TransactionCallbackResponse } from "@/domain/interfaces/domain/entities/Transaction";
import { GetTransactionStatusResponse } from "@/domain/interfaces/infrastructure/controllers/responses/transactions/get.transaction.status";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { ITransactionRepository } from "@/domain/interfaces/infrastructure/repositories/ITransactionRepository";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { inject, injectable } from "inversify";

@injectable()
export class TransactionRepository extends BaseRepository implements ITransactionRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    public async getTransactionById(id: string): Promise<Transaction | null> {
        try {
            const query = `SELECT 	id, business_id, client_id, transaction_type, transaction_status,
                                account_id, wallet_id, external_reference
                        FROM integration.transactions WHERE id = $1`;
            const result = await this.postgreSQLConnection.query(query, [id]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Transaction not found for id: ${id}`);
                return null;
            }

            const transaction: Transaction = {
                id: result.rows[0].id,
                businessId: result.rows[0].business_id,
                clientId: result.rows[0].client_id,
                transactionType: result.rows[0].transaction_type,
                transactionStatus: result.rows[0].transaction_status,
                accountId: result.rows[0].account_id,
                walletId: result.rows[0].wallet_id,
                externalReference: result.rows[0].external_reference
            };
            return transaction;
        } catch (error) {
            this.loggerService.error('Error getting transaction by ID:', {
                transactionId: id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return null;
        }
    }

    public async getTransactionByPartnerReference(partenerReference: string): Promise<Transaction | null> {
        try {
            const query = `SELECT 	id, partner_id, transaction_id, internal_reference, partner_reference, response_code, 
		                        response_message, details, status, created_at
                        FROM integration.external_integrations WHERE partner_reference = $1 and status = 'E'`;
            const result = await this.postgreSQLConnection.query(query, [partenerReference]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Transaction not found or disabled for partner reference: ${partenerReference}`);
                return null;
            }

            const externalIntegration: ExternalIntegration = {
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

            let transaction = await this.getTransactionById(externalIntegration.transactionId);

            if (!transaction) {
                this.loggerService.info(`Transaction not found for partner reference: ${partenerReference}`);
                throw new Error('Transaction linked to external integration not found');
            }

            transaction.externalIntegration = externalIntegration;
            return transaction;
        } catch (error) {
            this.loggerService.error('Error getting transaction by partner reference:', {
                partnerReference: partenerReference,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return null;
        }
    }

    public async insertTransaction(transactionData: CreateTransactionData): Promise<Transaction | null> {
        let client;
        try {
            // Begin database transaction
            client = await this.postgreSQLConnection.beginTransaction();

            // Insert into transactions table
            const transactionQuery = `
                INSERT INTO integration.transactions 
                (business_id, client_id, account_id, wallet_id, transaction_type, transaction_status, external_reference)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, business_id, client_id, account_id, wallet_id, transaction_type, transaction_status, external_reference
            `;

            const transactionValues = [
                transactionData.businessId,
                transactionData.clientId,
                transactionData.accountId,
                transactionData.walletId,
                transactionData.transactionType,
                transactionData.transactionStatus,
                transactionData.externalReference
            ];

            const transactionResult = await client.query(transactionQuery, transactionValues);

            if (transactionResult.rows.length === 0) {
                this.loggerService.error('Failed to insert transaction - no rows returned');
                await this.postgreSQLConnection.rollbackTransaction(client);
                return null;
            }

            const transactionId = transactionResult.rows[0].id;

            // Insert into transaction_details table
            const detailsQuery = `
                INSERT INTO integration.transaction_details 
                (transaction_id, amount, asset_currency_id, fiat_currency_id, exchange_rate, 
                 fees, fiat_amount, asset_amount, total_fiat_amount, total_asset_amount, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id, transaction_id, amount, asset_currency_id, fiat_currency_id, 
                         exchange_rate, fees, fiat_amount, asset_amount, total_fiat_amount, 
                         total_asset_amount, status, created_at
            `;

            const detailsValues = [
                transactionId,
                transactionData.details.amount,
                transactionData.details.assetCurrencyId,
                transactionData.details.fiatCurrencyId,
                transactionData.details.exchangeRate,
                transactionData.details.fees,
                transactionData.details.fiatAmount,
                transactionData.details.assetAmount,
                transactionData.details.totalFiatAmount,
                transactionData.details.totalAssetAmount,
                transactionData.details.status
            ];

            const detailsResult = await client.query(detailsQuery, detailsValues);

            if (detailsResult.rows.length === 0) {
                this.loggerService.error('Failed to insert transaction details - no rows returned');
                await this.postgreSQLConnection.rollbackTransaction(client);
                return null;
            }

            // Commit the transaction
            await this.postgreSQLConnection.commitTransaction(client);

            // Construct the complete transaction object
            const insertedTransaction: Transaction = {
                id: transactionResult.rows[0].id,
                businessId: transactionResult.rows[0].business_id,
                clientId: transactionResult.rows[0].client_id,
                accountId: transactionResult.rows[0].account_id,
                walletId: transactionResult.rows[0].wallet_id,
                transactionType: transactionResult.rows[0].transaction_type,
                transactionStatus: transactionResult.rows[0].transaction_status,
                externalReference: transactionResult.rows[0].external_reference,
                details: {
                    id: detailsResult.rows[0].id,
                    transactionId: detailsResult.rows[0].transaction_id,
                    amount: parseFloat(detailsResult.rows[0].amount),
                    assetCurrencyId: detailsResult.rows[0].asset_currency_id,
                    fiatCurrencyId: detailsResult.rows[0].fiat_currency_id,
                    exchangeRate: parseFloat(detailsResult.rows[0].exchange_rate),
                    fees: parseFloat(detailsResult.rows[0].fees),
                    fiatAmount: parseFloat(detailsResult.rows[0].fiat_amount),
                    assetAmount: parseFloat(detailsResult.rows[0].asset_amount),
                    totalFiatAmount: parseFloat(detailsResult.rows[0].total_fiat_amount),
                    totalAssetAmount: parseFloat(detailsResult.rows[0].total_asset_amount),
                    status: detailsResult.rows[0].status,
                    createdAt: new Date(detailsResult.rows[0].created_at)
                }
            };

            this.loggerService.info(`Transaction inserted successfully with ID: ${insertedTransaction.id} for client: ${insertedTransaction.clientId}`);

            return insertedTransaction;
        } catch (error) {
            // Rollback transaction on error
            if (client) {
                try {
                    await this.postgreSQLConnection.rollbackTransaction(client);
                    this.loggerService.info('Transaction rolled back due to error');
                } catch (rollbackError) {
                    this.loggerService.error('Error during rollback:', {
                        originalError: error instanceof Error ? error.message : 'Unknown error',
                        rollbackError: rollbackError instanceof Error ? rollbackError.message : 'Unknown rollback error'
                    });
                }
            }

            this.loggerService.error(`Error inserting transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
        }
    }

    public async updateTransactionStatus(transactionId: string, transactionStatus: number): Promise<boolean> {
        try {
            this.loggerService.info(`Updating transaction status, transactionId: ${transactionId}, transactionStatus: ${transactionStatus}`);
            const query = `UPDATE integration.transactions SET transaction_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;
            const result = await this.postgreSQLConnection.query(query, [transactionStatus, transactionId]);
            this.loggerService.info(`Transaction status updated successfully, transactionId: ${transactionId}, transactionStatus: ${transactionStatus}`);

            return result.rowCount > 0;
        } catch (error: Error | any) {
            this.loggerService.error(`Error updating transaction status, transactionId: ${transactionId}:`, error);
            return false;
        }
    }

    public async getTransactionForCallback(partenerReference: string): Promise<TransactionCallbackResponse | null> {
        try {
            this.loggerService.info(`Getting transaction for callback, partenerReference: ${partenerReference}`);
            const query = `
            select  ei.id external_integration_id, ei.transaction_id, ei.details, t.account_id, 
                    t.business_id, t.client_id,t.wallet_id, t.external_reference, p.id partner_id, 
                    p.code partner_code, t.transaction_status transaction_status_id, 
                    ts.code transaction_status_code, t.transaction_type transaction_type_id, 
                    tt.code transaction_type_code, bw.callback_url, bw.http_method, bw.x_api_key, 
                    bw.events, b."name" business_name, bw.id business_webhook_id
            from integration.external_integrations ei 
            inner join integration.transactions t on t.id = ei.transaction_id 
            inner join integration.business_webhooks bw on bw.business_id = t.business_id 
            inner join integration.business b on b.id = bw.business_id 
            inner join integration.transaction_statuses ts on ts.id = t.transaction_status
            inner JOIN integration.transaction_types tt on tt.id = t.transaction_type
            inner join integration.partners p on p.id = ei.partner_id 
            where b.status = 'E' and bw.status = 'E' and ei.status = 'E' and p.status = 'E'
                  AND ei.partner_reference = $1`;
            const result = await this.postgreSQLConnection.query(query, [partenerReference]);

            if (result.rowCount === 0) {
                this.loggerService.info(`No transaction found for partenerReference: ${partenerReference}`);
                return null;
            }

            this.loggerService.info(`Transaction found for partenerReference: ${partenerReference}`);
            let transactionCallbackResponse: TransactionCallbackResponse = {
                externalIntegrationId: result.rows[0].external_integration_id,
                transactionId: result.rows[0].transaction_id,
                businessId: result.rows[0].business_id,
                businessWebhookId: result.rows[0].business_webhook_id,
                partnerId: result.rows[0].partner_id,
                partnerCode: result.rows[0].partner_code,
                clientId: result.rows[0].client_id,
                accountId: result.rows[0].account_id,
                walletId: result.rows[0].wallet_id,
                externalReference: result.rows[0].external_reference,
                transactionStatusId: result.rows[0].transaction_status_id,
                transactionStatusCode: result.rows[0].transaction_status_code,
                transactionTypeId: result.rows[0].transaction_type_id,
                transactionTypeCode: result.rows[0].transaction_type_code,
                details: result.rows[0].details,
                callbackUrl: result.rows[0].callback_url,
                httpMethod: result.rows[0].http_method,
                xApiKey: result.rows[0].x_api_key,
                events: result.rows[0].events,
                businessName: result.rows[0].business_name
            }
            return transactionCallbackResponse;
        } catch (error: Error | any) {
            this.loggerService.error(`Error getting transaction for callback, partenerReference: ${partenerReference}:`, error);
            return null;
        }
    }
    public async getTransacctionById(transactionId: string): Promise<GetTransactionStatusResponse | null> {
        try {
            this.loggerService.info(`Getting transaction by ID, transactionId: ${transactionId}`);
            const query = `
            select 	t.id transaction_id, ts.id transaction_status_id, ts.code transaction_status_code,
                    tt.id transaction_type_id, tt.code transaction_type_code,
                    ei.id external_transaction_id, ei.partner_id, ei.partner_reference,
                    t.client_id, t.business_id, t.account_id, t.wallet_id, t.external_reference,
                    td.id transaction_detail_id, td.amount, td.exchange_rate, td.fees,
                    td.fiat_currency_id, fc.code fiat_currency_code, td.fiat_amount, td.total_fiat_amount,
                    td.asset_currency_id, acc.code asset_currency_code, td.asset_amount, td.total_asset_amount
            from 	integration.transactions t
            inner join integration.transaction_statuses ts on ts.id = t.transaction_status
            inner join integration.transaction_types tt on tt.id = t.transaction_type
            inner join integration.transaction_details td on td.transaction_id = t.id
            inner join integration.fiat_currencies fc on fc.id = td.fiat_currency_id
            inner join integration.asset_crypto_currencies acc on acc.id = td.asset_currency_id
            left join integration.external_integrations ei on ei.transaction_id = t.id
            where   t.id = $1;`;
            const result = await this.postgreSQLConnection.query(query, [transactionId]);
            if (result.rowCount === 0) {
                this.loggerService.info(`No transaction found for transactionId: ${transactionId}`);
                return null;
            }
            this.loggerService.info(`Transaction found for transactionId: ${transactionId}`);
            let getTransactionStatusResponse: GetTransactionStatusResponse = {
                transaction_id: result.rows[0].transaction_id,
                transaction_status_id: result.rows[0].transaction_status_id,
                transaction_status_code: result.rows[0].transaction_status_code,
                transaction_type_id: result.rows[0].transaction_type_id,
                transaction_type_code: result.rows[0].transaction_type_code,
                external_transaction_id: result.rows[0].external_transaction_id,
                partner_id: result.rows[0].partner_id,
                partner_reference: result.rows[0].partner_reference,
                client_id: result.rows[0].client_id,
                business_id: result.rows[0].business_id,
                account_id: result.rows[0].account_id,
                wallet_id: result.rows[0].wallet_id,
                external_reference: result.rows[0].external_reference,
                transaction_detail_id: result.rows[0].transaction_detail_id,
                amount: parseFloat(result.rows[0].amount),
                exchange_rate: parseFloat(result.rows[0].exchange_rate),
                fees: parseFloat(result.rows[0].fees),
                fiat_currency_id: result.rows[0].fiat_currency_id,
                fiat_currency_code: result.rows[0].fiat_currency_code,
                fiat_amount: parseFloat(result.rows[0].fiat_amount),
                total_fiat_amount: parseFloat(result.rows[0].total_fiat_amount),
                asset_currency_id: result.rows[0].asset_currency_id,
                asset_currency_code: result.rows[0].asset_currency_code,
                asset_amount: parseFloat(result.rows[0].asset_amount),
                total_asset_amount: parseFloat(result.rows[0].total_asset_amount),
                detailsPartner: null
            }
            return getTransactionStatusResponse;
        } catch (error: Error | any) {
            this.loggerService.error(`Error getting transaction by ID, transactionId: ${transactionId}:`, error);
            return null;
        }

    }

    public async updateTransactionExternalReference(transactionId: string, externalReference: string): Promise<boolean> {
        try {
            this.loggerService.info(`Updating transaction external reference, transactionId: ${transactionId}, externalReference: ${externalReference}`);
            const query = `UPDATE integration.transactions SET external_reference = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;
            const result = await this.postgreSQLConnection.query(query, [externalReference, transactionId]);
            this.loggerService.info(`Transaction external reference updated successfully, transactionId: ${transactionId}`);

            return result.rowCount > 0;
        } catch (error: Error | any) {
            this.loggerService.error(`Error updating transaction external reference, transactionId: ${transactionId}:`, error);
            return false;
        }
    }

    public async updateTransactionDetails(transactionId: string, amount: number, fiatAmount: number, totalFiatAmount: number): Promise<boolean> {
        try {
            this.loggerService.info(`Updating transaction details, transactionId: ${transactionId}, amount: ${amount}, fiatAmount: ${fiatAmount}, totalFiatAmount: ${totalFiatAmount}`);
            const query = `
                UPDATE integration.transaction_details
                SET amount = $1, fiat_amount = $2, total_fiat_amount = $3
                WHERE transaction_id = $4
            `;
            const result = await this.postgreSQLConnection.query(query, [amount, fiatAmount, totalFiatAmount, transactionId]);
            this.loggerService.info(`Transaction details updated successfully, transactionId: ${transactionId}`);

            return result.rowCount > 0;
        } catch (error: Error | any) {
            this.loggerService.error(`Error updating transaction details, transactionId: ${transactionId}:`, error);
            return false;
        }
    }

    public async getPayouts(businessId: string, status?: string, page: number = 1, limit: number = 20): Promise<any> {
        try {
            this.loggerService.info(`Getting payouts for business: ${businessId}, status: ${status}, page: ${page}, limit: ${limit}`);

            const offset = (page - 1) * limit;

            // Build the WHERE clause
            let whereClause = `WHERE t.business_id = $1 AND t.transaction_type = 10`;
            const queryParams: any[] = [businessId];
            let paramIndex = 2;

            if (status) {
                whereClause += ` AND ts.code = $${paramIndex}`;
                queryParams.push(status);
                paramIndex++;
            }

            // Count query
            const countQuery = `
                SELECT COUNT(*) as total
                FROM integration.transactions t
                INNER JOIN integration.transaction_statuses ts ON ts.id = t.transaction_status
                ${whereClause}
            `;

            const countResult = await this.postgreSQLConnection.query(countQuery, queryParams);
            const total = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(total / limit);

            // Add limit and offset to query params
            queryParams.push(limit, offset);

            // Data query
            const dataQuery = `
                SELECT
                    t.id as payout_id,
                    ei.partner_reference as reference,
                    ts.code as status,
                    td.fiat_amount as amount,
                    fc.code as currency,
                    ei.details as beneficiary_details,
                    t.created_at
                FROM integration.transactions t
                INNER JOIN integration.transaction_statuses ts ON ts.id = t.transaction_status
                INNER JOIN integration.transaction_details td ON td.transaction_id = t.id
                INNER JOIN integration.fiat_currencies fc ON fc.id = td.fiat_currency_id
                LEFT JOIN integration.external_integrations ei ON ei.transaction_id = t.id
                ${whereClause}
                ORDER BY t.created_at DESC
                LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
            `;

            const dataResult = await this.postgreSQLConnection.query(dataQuery, queryParams);

            const payouts = dataResult.rows.map((row: any) => ({
                payout_id: row.payout_id,
                reference: row.reference || '',
                status: row.status,
                amount: parseFloat(row.amount),
                currency: row.currency,
                beneficiary: row.beneficiary_details || {},
                created_at: row.created_at
            }));

            return {
                payouts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            };
        } catch (error: Error | any) {
            this.loggerService.error(`Error getting payouts for business: ${businessId}:`, error);
            throw error;
        }
    }

    public async getPayoutDetails(payoutId: string, businessId: string): Promise<any> {
        try {
            this.loggerService.info(`Getting payout details for payout: ${payoutId}, business: ${businessId}`);

            const query = `
                SELECT
                    t.id as payout_id,
                    ei.partner_reference as reference,
                    ts.code as status,
                    'balance' as funding_source,
                    ei.details as beneficiary_details,
                    td.fiat_amount as amount,
                    t.created_at,
                    t.updated_at as completed_at
                FROM integration.transactions t
                INNER JOIN integration.transaction_statuses ts ON ts.id = t.transaction_status
                INNER JOIN integration.transaction_details td ON td.transaction_id = t.id
                LEFT JOIN integration.external_integrations ei ON ei.transaction_id = t.id
                WHERE t.id = $1 AND t.business_id = $2 AND t.transaction_type = 10
                LIMIT 1
            `;

            const result = await this.postgreSQLConnection.query(query, [payoutId, businessId]);

            if (result.rows.length === 0) {
                this.loggerService.info(`Payout not found: ${payoutId}`);
                return null;
            }

            const row = result.rows[0];
            const beneficiaryDetails = row.beneficiary_details || {};

            return {
                payout_id: row.payout_id,
                reference: row.reference || '',
                status: row.status,
                funding_source: row.funding_source,
                beneficiary: beneficiaryDetails.beneficiary ? {
                    name: beneficiaryDetails.beneficiary,
                    account: beneficiaryDetails.account,
                    currency: beneficiaryDetails.currency
                } : {},
                amount: parseFloat(row.amount),
                description: beneficiaryDetails.description || '',
                created_at: row.created_at,
                completed_at: row.completed_at
            };
        } catch (error: Error | any) {
            this.loggerService.error(`Error getting payout details for payout: ${payoutId}:`, error);
            throw error;
        }
    }
}
