import { CreateExchangeRateData, ExchangeRate } from '@/domain/interfaces/domain/entities/ExchangeRate';

export interface IExchangeRateRepository {
  getExchangeRateById(id: string): Promise<ExchangeRate | null>;
  getExchangeRateByCompositeKey(transactionType: number, assetCurrencyId: number, fiatCurrencyId: number): Promise<ExchangeRate | null>;
  createExchangeRate(exchangeRateData: CreateExchangeRateData): Promise<ExchangeRate>;
  getAllExchangeRates(): Promise<ExchangeRate[]>;
  getExchangeRatesByTransactionType(transactionType: number): Promise<ExchangeRate[]>;
  getExchangeRatesByAssetCurrency(assetCurrencyId: number): Promise<ExchangeRate[]>;
  getExchangeRatesByFiatCurrency(fiatCurrencyId: number): Promise<ExchangeRate[]>;
}