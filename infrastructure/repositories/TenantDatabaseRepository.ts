import { Pool } from 'pg';
import { injectable, inject } from 'inversify';
import { ITenantDatabaseRepository, UpdateTenantTransactionData, UpdateTenantPayoutDetailsData } from '@/domain/interfaces/infrastructure/repositories/ITenantDatabaseRepository';
import { TenantDatabaseCredentials, TenantTransactionData, TenantPayoutDetailsData } from '@/domain/interfaces/domain/services/ITenantDatabaseService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IPostgreSQLConnection } from '@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection';
import { TYPES } from '@/infrastructure/config/inversify/types';

@injectable()
export class TenantDatabaseRepository implements ITenantDatabaseRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection) private postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService
    ) {}

    async getTenantCredentials(businessId: string): Promise<TenantDatabaseCredentials | null> {
        const query = `
            SELECT db_host, db_port, db_name, db_user, db_password
            FROM integration.partner_database_credentials
            WHERE id_business = $1
            LIMIT 1
        `;

        try {
            const result = await this.postgreSQLConnection.query(query, [businessId]);

            if (result.rows.length === 0) {
                return null;
            }

            return {
                host: result.rows[0].db_host,
                port: result.rows[0].db_port,
                database: result.rows[0].db_name,
                username: result.rows[0].db_user,
                password: result.rows[0].db_password
            };
        } catch (error) {
            this.loggerService.error('Error getting tenant credentials', { businessId, error });
            throw error;
        }
    }

    async insertTenantTransaction(pool: Pool, transactionData: TenantTransactionData): Promise<string> {
        const query = `
            INSERT INTO transactions (
                transaction_id, business_id, external_reference, transaction_type, transaction_status,
                asset_code, fiat_currency_code, crypto_amount, fiat_amount, fee_amount,
                exchange_rate, error_code, error_message, is_active
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id
        `;

        try {
            const result = await pool.query(query, [
                transactionData.transactionId,
                transactionData.businessId,
                transactionData.externalReference,
                transactionData.transactionType,
                transactionData.transactionStatus,
                transactionData.assetCode,
                transactionData.fiatCurrencyCode,
                transactionData.cryptoAmount,
                transactionData.fiatAmount,
                transactionData.feeAmount,
                transactionData.exchangeRate,
                transactionData.errorCode,
                transactionData.errorMessage,
                transactionData.isActive
            ]);
            return result.rows[0].id;
        } catch (error) {
            this.loggerService.error('Error inserting tenant transaction', { transactionId: transactionData.transactionId, error });
            throw error;
        }
    }

    async insertTenantPayoutDetails(pool: Pool, payoutDetails: TenantPayoutDetailsData): Promise<void> {
        const query = `
            INSERT INTO payout_details (
                transaction_id,
                numero_referencia,
                cuenta_destino,
                titular_destino,
                monto,
                moneda,
                glosa
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        try {
            await pool.query(query, [
                payoutDetails.transactionId,
                payoutDetails.numeroReferencia,
                payoutDetails.cuentaDestino,
                payoutDetails.titularDestino,
                payoutDetails.monto,
                payoutDetails.moneda,
                payoutDetails.glosa
            ]);
        } catch (error) {
            this.loggerService.error('Error inserting tenant payout details', { transactionId: payoutDetails.transactionId, error });
            throw error;
        }
    }

    async updateTenantTransaction(pool: Pool, updateData: UpdateTenantTransactionData): Promise<void> {
        const query = `
            UPDATE transactions
            SET external_reference = $1,
                transaction_status = $2,
                crypto_amount = $3,
                fiat_amount = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE transaction_id = $5
        `;

        try {
            await pool.query(query, [
                updateData.externalReference,
                updateData.transactionStatus,
                updateData.cryptoAmount,
                updateData.totalFiatAmount,
                updateData.transactionId
            ]);
            this.loggerService.info(`Tenant transaction updated successfully for transaction: ${updateData.transactionId}`);
        } catch (error) {
            this.loggerService.error('Error updating tenant transaction', { transactionId: updateData.transactionId, error });
            throw error;
        }
    }

    async updateTenantPayoutDetails(pool: Pool, updateData: UpdateTenantPayoutDetailsData): Promise<void> {
        const query = `
            UPDATE payout_details
            SET origen_numero_referencia = $1,
                fecha_transaccion = $2,
                cuenta_origen = $3,
                titular_origen = $4
            WHERE transaction_id = (SELECT id FROM transactions WHERE transaction_id = $5)
        `;

        try {
            await pool.query(query, [
                updateData.origenNumeroReferencia,
                updateData.fechaTransaccion,
                updateData.cuentaOrigen,
                updateData.titularOrigen,
                updateData.transactionId
            ]);
            this.loggerService.info(`Tenant payout details updated successfully for transaction: ${updateData.transactionId}`);
        } catch (error) {
            this.loggerService.error('Error updating tenant payout details', { transactionId: updateData.transactionId, error });
            throw error;
        }
    }
}
