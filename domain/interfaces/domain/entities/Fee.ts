export interface Fee {
  id: string;
  business_id: string;
  transaction_type: number;
  asset_currency_id: number;
  fiat_currency_id: number;
  fee_amount: number;
  fee_type: number;
  created_at: Date;

  feeTypeCode?: string;
}

export interface CreateFeeData {
  transaction_type: number;
  asset_currency_id: number;
  fiat_currency_id: number;
  fee_amount: number;
  fee_type: number;
}

export interface UpdateFeeData {
  transaction_type?: number;
  asset_currency_id?: number;
  fiat_currency_id?: number;
  fee_amount?: number;
  fee_type?: number;
}