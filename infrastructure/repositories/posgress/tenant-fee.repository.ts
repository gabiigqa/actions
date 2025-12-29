import { CreateTenantFeeData, TenantFee } from '@domain/interfaces/domain/entities/TenantFee';
import { ILoggerService } from '@domain/interfaces/infrastructure/logger/ILoggerService';
import { ITenantFeeRepository } from '@domain/interfaces/infrastructure/repositories/ITenantFeeRepository';
import { IPostgreSQLConnection } from '@domain/interfaces/infrastructure/repositories/IPostgreSQLConnection';
import { AppConfig } from '@infrastructure/config';
import { TYPES } from '@infrastructure/config/inversify/types';
import { BaseRepository } from '@infrastructure/repositories/posgress/base.repository';
import { inject, injectable } from 'inversify';

@injectable()
export class TenantFeeRepository extends BaseRepository implements ITenantFeeRepository {
  constructor(
    @inject(TYPES.IPostgreSQLConnection) postgreSQLConnection: IPostgreSQLConnection,
    @inject(TYPES.AppConfig) appConfig: AppConfig,
    @inject(TYPES.ILoggerService) loggerService: ILoggerService
  ) {
    super(loggerService, appConfig, postgreSQLConnection);
  }

  async save(tenantFeeData: CreateTenantFeeData): Promise<TenantFee> {
    const query = `
      INSERT INTO integration.tenant_fees (
        tenant_id,
        transaction_type,
        asset_currency_id,
        fiat_currency_id,
        fee_amount,
        fee_type
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, tenant_id, transaction_type, asset_currency_id, fiat_currency_id,
                fee_amount, fee_type, created_at, updated_at
    `;

    const values = [
      tenantFeeData.tenant_id,
      tenantFeeData.transaction_type,
      tenantFeeData.asset_currency_id,
      tenantFeeData.fiat_currency_id,
      tenantFeeData.fee_amount,
      tenantFeeData.fee_type
    ];

    try {
      this.loggerService.info(`Creating tenant fee for tenant: ${tenantFeeData.tenant_id}, transaction type: ${tenantFeeData.transaction_type}`);
      await this.postgreSQLConnection.initialize();
      const result = await this.postgreSQLConnection.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Failed to create tenant fee - no rows returned');
      }

      const tenantFee = result.rows[0] as TenantFee;
      this.loggerService.info(`Tenant fee created successfully with ID: ${tenantFee.id}`);
      return tenantFee;
    } catch (error) {
      this.loggerService.error('Error creating tenant fee in database', error);
      throw error;
    }
  }

  async findById(id: string): Promise<TenantFee | null> {
    const query = `
      SELECT id, tenant_id, transaction_type, asset_currency_id, fiat_currency_id,
             fee_amount, fee_type, created_at, updated_at
      FROM integration.tenant_fees
      WHERE id = $1
    `;

    try {
      const result = await this.postgreSQLConnection.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      this.loggerService.error(`Error getting tenant fee by ID: ${id}`, error);
      throw error;
    }
  }

  async findByTenantAndTransactionType(
    tenantId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<TenantFee | null> {
    const query = `
      SELECT tf.id, tf.tenant_id, tf.transaction_type, tf.asset_currency_id, tf.fiat_currency_id,
             tf.fee_amount, tf.fee_type, tf.created_at, tf.updated_at
      FROM integration.tenant_fees tf
      WHERE tf.tenant_id = $1
        AND tf.transaction_type = $2
        AND tf.asset_currency_id = $3
        AND tf.fiat_currency_id = $4
    `;

    try {
      const result = await this.postgreSQLConnection.query(query, [tenantId, transactionType, assetCurrencyId, fiatCurrencyId]);

      if (result.rows.length === 0) {
        this.loggerService.info(`No tenant fee found for tenant: ${tenantId}, transaction type: ${transactionType}, asset currency ID: ${assetCurrencyId}, fiat currency ID: ${fiatCurrencyId}`);
        return null;
      }

      const tenantFee: TenantFee = {
        id: result.rows[0].id,
        tenant_id: result.rows[0].tenant_id,
        transaction_type: result.rows[0].transaction_type,
        asset_currency_id: result.rows[0].asset_currency_id,
        fiat_currency_id: result.rows[0].fiat_currency_id,
        fee_amount: result.rows[0].fee_amount,
        fee_type: result.rows[0].fee_type,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at
      };

      return tenantFee;
    } catch (error) {
      this.loggerService.error(`Error getting tenant fee by tenant and transaction type`, error);
      throw error;
    }
  }

  async findByTenantWithFilters(
    tenantId: string,
    filters?: {
      feeTypeCode?: string;
      assetCurrencyId?: number;
      fiatCurrencyId?: number;
      transactionTypeId?: number;
    }
  ): Promise<TenantFee[]> {
    let query = `
      SELECT tf.id, tf.tenant_id, tf.transaction_type, tf.asset_currency_id, tf.fiat_currency_id,
             tf.fee_amount, tf.fee_type, tf.created_at, tf.updated_at
      FROM integration.tenant_fees tf
      WHERE tf.tenant_id = $1
    `;

    const values: any[] = [tenantId];
    let idx = 2;

    if (filters?.feeTypeCode) {
      // Map feeTypeCode string to fee_type number
      const feeTypeMap: { [key: string]: number } = {
        'FIXED': 1,
        'PERCENTAGE': 2,
        'FIXEDUNIT': 3
      };
      const feeTypeId = feeTypeMap[filters.feeTypeCode.toUpperCase()];
      if (feeTypeId) {
        query += ` AND tf.fee_type = $${idx++}`;
        values.push(feeTypeId);
      }
    }

    if (filters?.assetCurrencyId) {
      query += ` AND tf.asset_currency_id = $${idx++}`;
      values.push(filters.assetCurrencyId);
    }

    if (filters?.fiatCurrencyId) {
      query += ` AND tf.fiat_currency_id = $${idx++}`;
      values.push(filters.fiatCurrencyId);
    }

    if (filters?.transactionTypeId) {
      query += ` AND tf.transaction_type = $${idx++}`;
      values.push(filters.transactionTypeId);
    }

    try {
      const result = await this.postgreSQLConnection.query(query, values);
      return result.rows.map((row: any) => ({
        id: row.id,
        tenant_id: row.tenant_id,
        transaction_type: row.transaction_type,
        asset_currency_id: row.asset_currency_id,
        fiat_currency_id: row.fiat_currency_id,
        fee_amount: row.fee_amount,
        fee_type: row.fee_type,
        created_at: row.created_at,
        updated_at: row.updated_at
      })) as TenantFee[];
    } catch (error) {
      this.loggerService.error(`Error getting tenant fees by filters`, error);
      throw error;
    }
  }

  async upsertTenantFee(
    tenantId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number,
    feeAmount: number,
    feeTypeCode: string
  ): Promise<TenantFee> {
    const feeTypeQuery = `
      SELECT id FROM integration.fee_types WHERE code = $1
    `;
    await this.postgreSQLConnection.initialize();
    const feeTypeResult = await this.postgreSQLConnection.query(feeTypeQuery, [feeTypeCode]);

    if (feeTypeResult.rows.length === 0) {
      throw new Error(`Fee type not found for code: ${feeTypeCode}`);
    }

    const feeTypeId = feeTypeResult.rows[0].id;

    const query = `
      INSERT INTO integration.tenant_fees (
        tenant_id,
        transaction_type,
        asset_currency_id,
        fiat_currency_id,
        fee_amount,
        fee_type
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (tenant_id, transaction_type, asset_currency_id, fiat_currency_id, fee_type)
      DO UPDATE SET
        fee_amount = EXCLUDED.fee_amount,
        updated_at = NOW()
      RETURNING id, tenant_id, transaction_type, asset_currency_id, fiat_currency_id,
                fee_amount, fee_type, created_at, updated_at
    `;

    const values = [
      tenantId,
      transactionType,
      assetCurrencyId,
      fiatCurrencyId,
      feeAmount,
      feeTypeId
    ];

    try {
      const result = await this.postgreSQLConnection.query(query, values);
      const row = result.rows[0];

      const feeTypeCodeQuery = `SELECT code FROM integration.fee_types WHERE id = $1`;
      const feeTypeCodeResult = await this.postgreSQLConnection.query(feeTypeCodeQuery, [row.fee_type]);

      return {
        id: row.id,
        tenant_id: row.tenant_id,
        transaction_type: row.transaction_type,
        asset_currency_id: row.asset_currency_id,
        fiat_currency_id: row.fiat_currency_id,
        fee_amount: row.fee_amount,
        fee_type: row.fee_type,
        created_at: row.created_at,
        updated_at: row.updated_at,
        feeTypeCode: feeTypeCodeResult.rows[0].code
      } as TenantFee;
    } catch (error) {
      this.loggerService.error('Error upserting tenant fee', error);
      throw error;
    }
  }
}
