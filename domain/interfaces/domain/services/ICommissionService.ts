import { CommissionResponse } from '@/domain/interfaces/infrastructure/controllers/responses/commissions/CommissionResponse';
import { UpsertCommissionRequest } from '@/domain/interfaces/infrastructure/controllers/requests/commissions/UpsertCommissionRequest';

export type CommissionType = 'PERCENTAGE' | 'FIXED' | 'FIXEDUNIT';

export interface ICommissionService {
  getCommissions(
    tenantId: string,
    filters?: {
      type?: CommissionType;
      assetCurrencyId?: number;
      fiatCurrencyId?: number;
      assetCode?: string;
      fiatCode?: string;
      transactionTypeCode?: string;
    }
  ): Promise<CommissionResponse[]>;

  upsertPercentageCommission(
    tenantId: string,
    data: UpsertCommissionRequest
  ): Promise<CommissionResponse>;

  upsertFixedCommission(
    tenantId: string,
    data: UpsertCommissionRequest
  ): Promise<CommissionResponse>;
}
