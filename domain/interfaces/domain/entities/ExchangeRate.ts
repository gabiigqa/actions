export interface ExchangeRate {
  id: string;
  transaction_type_id: number;
  transaction_type_code?: string;
  asset_currency_id: number;
  asset_currency_code?: string;
  fiat_currency_id: number;
  fiat_currency_code?: string;
  rate: number;
  created_at: Date;
}

export interface CalculatedExchangeRateResponse {
  transaction_type_id: number;
  transaction_type_code?: string;
  asset_currency_id: number;
  asset_currency_code?: string;
  asset_amount: number;
  fiat_currency_id: number;
  fiat_currency_code?: string;
  fiat_amount: number;
  rate: number;
}

export interface CreateExchangeRateData {
  transaction_type_id: number;
  asset_currency_id: number;
  fiat_currency_id: number;
  rate: number;
}

export interface UpdateExchangeRateData {
  transaction_type_id?: number;
  asset_currency_id?: number;
  fiat_currency_id?: number;
  rate?: number;
}