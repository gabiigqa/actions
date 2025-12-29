import { CreateTenantFeeData, TenantFee } from '../entities/TenantFee';

export interface ITenantFeeService {
  createTenantFee(tenantFeeData: CreateTenantFeeData): Promise<TenantFee>;
  getTenantFeeById(id: string): Promise<TenantFee | null>;
  getTenantFeeByTenantAndTransactionType(
    tenantId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<TenantFee | null>;
}
