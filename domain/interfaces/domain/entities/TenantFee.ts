export interface TenantFee {
  id: string;
  tenant_id: string;
  transaction_type: number;
  asset_currency_id: number;
  fiat_currency_id: number;
  fee_amount: number;
  fee_type: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTenantFeeData {
  tenant_id: string;
  transaction_type: number;
  asset_currency_id: number;
  fiat_currency_id: number;
  fee_amount: number;
  fee_type: number;
}
