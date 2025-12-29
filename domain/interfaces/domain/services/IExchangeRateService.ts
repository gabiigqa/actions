import { CalculatedExchangeRateResponse, ExchangeRate } from '@/domain/interfaces/domain/entities/ExchangeRate';
import { ExchangeRateResponse } from '@/domain/interfaces/infrastructure/controllers/responses/quotes/ExchangeRateResponse';
import { CurrentQuotesResponse } from '@/domain/interfaces/infrastructure/controllers/responses/quotes/CurrentQuotesResponse';

export interface IExchangeRateService {
  getExchangeRateByCompositeKeyCodes(transactionTypeCode: string, cryptoCurrencyCode: string, fiatCurrencyCode: string): Promise<ExchangeRate | null>;
  getExchangeRateByCompositeKey(transactionTypeId: number, cryptoCurrencyId: number, fiatCurrencyId: number): Promise<ExchangeRate | null>;
  getExchangeRateById(id: number): Promise<ExchangeRate | null>;
  getAllExchangeRates(): Promise<ExchangeRate[]>;
  calculateExchangeAmount(transactionTypeCode: string, cryptoCurrencyCode: string, fiatCurrencyCode: string, amount: number, direction: 'asset' | 'fiat'): Promise<CalculatedExchangeRateResponse | null>;
  getWithdrawalExchangeRate(cryptoCurrencyCode: string, fiatCurrencyCode: string, businessId: string): Promise<ExchangeRateResponse | null>;
  getExchangeRateByTransactionType(cryptoCurrencyCode: string, fiatCurrencyCode: string, transactionTypeCode: string, businessId: string): Promise<ExchangeRateResponse | null>;
  getCurrentExchangeRates(fiatCurrencyCode: string, businessId: string): Promise<CurrentQuotesResponse>;
}