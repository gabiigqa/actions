import { FiatCurrency } from '@/domain/interfaces/domain/entities/FiatCurrency';

export interface ICurrencyService {
  getCurrencyById(id: number): Promise<FiatCurrency | null>;
  getCurrencyByCode(code: string): Promise<FiatCurrency | null>;
  getAllCurrencies(): Promise<FiatCurrency[]>;
}