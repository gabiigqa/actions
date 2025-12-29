export interface ExchangeRateResponse {
  pair: string;
  fiatCurrency: string;
  serviceExchangeRate: number;
  partnerExchangeRate: number;
  timestamp: string;
}
