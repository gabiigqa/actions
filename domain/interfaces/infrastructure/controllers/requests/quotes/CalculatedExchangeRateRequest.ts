export interface CalculatedExchangeRateRequest {
    transactionType: string;
    cryptoAsset: string;
    fiatCurrency: string;
    fiatAmount?: number;
    cryptoAmount?: number;
}