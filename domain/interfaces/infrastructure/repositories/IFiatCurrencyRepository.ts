import { CreateFiatCurrencyData, FiatCurrency } from '@/domain/interfaces/domain/entities/FiatCurrency';

export interface IFiatCurrencyRepository {
  getFiatCurrencyById(id: number): Promise<FiatCurrency | null>;
  getFiatCurrencyByCode(code: string): Promise<FiatCurrency | null>;
  getFiatCurrencyBySymbol(symbol: string): Promise<FiatCurrency | null>;
  createFiatCurrency(fiatCurrencyData: CreateFiatCurrencyData): Promise<FiatCurrency>;
  getAllFiatCurrencies(): Promise<FiatCurrency[]>;
}