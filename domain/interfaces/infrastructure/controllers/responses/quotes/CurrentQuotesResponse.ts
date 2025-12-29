export interface CurrentQuoteItem {
  pair: string;
  serviceExchangeRate: number;
  partnerExchangeRate: number;
  totalExternalFeeBOB: number;
  totalExternalFeeAsset: number;
}

export interface CurrentQuotesResponse {
  fiatCurrency: string;
  quotes: CurrentQuoteItem[];
  timestamp: string;
}