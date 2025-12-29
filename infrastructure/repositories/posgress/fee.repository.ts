import { CreateFeeData, Fee } from '@domain/interfaces/domain/entities/Fee';
import { ILoggerService } from '@domain/interfaces/infrastructure/logger/ILoggerService';
import { IFeeRepository } from '@domain/interfaces/infrastructure/repositories/IFeeRepository';
import { IPostgreSQLConnection } from '@domain/interfaces/infrastructure/repositories/IPostgreSQLConnection';
import { AppConfig } from '@infrastructure/config';
import { TYPES } from '@infrastructure/config/inversify/types';
import { BaseRepository } from '@infrastructure/repositories/posgress/base.repository';
import { inject, injectable } from 'inversify';

@injectable()
export class FeeRepository extends BaseRepository implements IFeeRepository {
  constructor(
    @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
    @inject(TYPES.AppConfig) appConfig: AppConfig,
    @inject(TYPES.ILoggerService) loggerService: ILoggerService
  ) {
    super(loggerService, appConfig, postgreSQLConnection);
  }

  async save(feeData: CreateFeeData): Promise<Fee> {
    const query = `
      INSERT INTO integration.fees (
        transaction_type, 
        asset_currency_id, 
        fiat_currency_id, 
        fee_amount, 
        fee_type
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, transaction_type, asset_currency_id, fiat_currency_id, 
                fee_amount, fee_type, created_at
    `;

    const values = [
      feeData.transaction_type,
      feeData.asset_currency_id,
      feeData.fiat_currency_id,
      feeData.fee_amount,
      feeData.fee_type
    ];

    try {
      this.loggerService.info(`Creating fee for transaction type: ${feeData.transaction_type}`);
      await this.postgreSQLConnection.initialize();
      const result = await this.postgreSQLConnection.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Failed to create fee - no rows returned');
      }

      const fee = result.rows[0] as Fee;
      this.loggerService.info(`Fee created successfully with ID: ${fee.id}`);
      return fee;
    } catch (error) {
      this.loggerService.error('Error creating fee in database', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Fee | null> {
    const query = `
      SELECT id, transaction_type, asset_currency_id, fiat_currency_id, 
             fee_amount, fee_type, created_at
      FROM integration.fees 
      WHERE id = $1
    `;

    try {
      const result = await this.postgreSQLConnection.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      this.loggerService.error(`Error getting fee by ID: ${id}`, error);
      throw error;
    }
  }

  async findByTransactionTypeAndCurrencies(
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<Fee | null> {
    const query = `
      SELECT f.id, f.business_id, f.transaction_type, f.asset_currency_id, f.fiat_currency_id,
             f.fee_amount, f.fee_type, f.created_at, ft.code as fee_type_code
      FROM integration.fees f
      inner join integration.fee_types ft on ft.id = f.fee_type
      WHERE f.transaction_type = $1 AND f.asset_currency_id = $2 AND f.fiat_currency_id = $3
    `;

    try {
      const result = await this.postgreSQLConnection.query(query, [transactionType, assetCurrencyId, fiatCurrencyId]);
      if(result.rows.length === 0) {
        this.loggerService.info(`No fee found for transaction type: ${transactionType}, asset currency ID: ${assetCurrencyId}, fiat currency ID: ${fiatCurrencyId}`);
        return null;
      }

      let fee:Fee = {
        id: result.rows[0].id,
        business_id: result.rows[0].business_id,
        transaction_type: result.rows[0].transaction_type,
        asset_currency_id: result.rows[0].asset_currency_id,
        fiat_currency_id: result.rows[0].fiat_currency_id,
        fee_amount: result.rows[0].fee_amount,
        fee_type: result.rows[0].fee_type,
        created_at: result.rows[0].created_at,
        feeTypeCode: result.rows[0].fee_type_code
      };

      return fee;
    } catch (error) {
      this.loggerService.error(`Error getting fee by transaction type and currencies`, error);
      throw error;
    }
  }

  async findByBusinessAndTransactionType(
    businessId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<Fee | null> {
    const query = `
      SELECT f.id, f.business_id, f.transaction_type, f.asset_currency_id, f.fiat_currency_id,
             f.fee_amount, f.fee_type, f.created_at, ft.code as fee_type_code
      FROM integration.fees f
      INNER JOIN integration.fee_types ft ON ft.id = f.fee_type
      WHERE f.business_id = $1
        AND f.transaction_type = $2
        AND f.asset_currency_id = $3
        AND f.fiat_currency_id = $4
    `;

    try {
      const result = await this.postgreSQLConnection.query(query, [businessId, transactionType, assetCurrencyId, fiatCurrencyId]);

      if (result.rows.length === 0) {
        this.loggerService.info(`No fee found for business: ${businessId}, transaction type: ${transactionType}, asset currency ID: ${assetCurrencyId}, fiat currency ID: ${fiatCurrencyId}`);
        return null;
      }

      const fee: Fee = {
        id: result.rows[0].id,
        business_id: result.rows[0].business_id,
        transaction_type: result.rows[0].transaction_type,
        asset_currency_id: result.rows[0].asset_currency_id,
        fiat_currency_id: result.rows[0].fiat_currency_id,
        fee_amount: result.rows[0].fee_amount,
        fee_type: result.rows[0].fee_type,
        created_at: result.rows[0].created_at,
        feeTypeCode: result.rows[0].fee_type_code
      };

      return fee;
    } catch (error) {
      this.loggerService.error(`Error getting fee by business and transaction type`, error);
      throw error;
    }
  }
}