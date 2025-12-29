import { CreateTenantFeeData, TenantFee } from '../../domain/entities/TenantFee';

export interface ITenantFeeRepository {
  save(tenantFee: CreateTenantFeeData): Promise<TenantFee>;
  findById(id: string): Promise<TenantFee | null>;
  findByTenantAndTransactionType(
    tenantId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<TenantFee | null>;

  findByTenantWithFilters(
    tenantId: string,
    filters?: {
      feeTypeCode?: string;       // 'PERCENTAGE' | 'FIXED' | 'FIXEDUNIT'
      assetCurrencyId?: number;
      fiatCurrencyId?: number;
      transactionTypeId?: number;
    }
  ): Promise<TenantFee[]>;

  upsertTenantFee(
    tenantId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number,
    feeAmount: number,
    feeTypeCode: string           // 'PERCENTAGE' | 'FIXED' | 'FIXEDUNIT'
  ): Promise<TenantFee>;
}
