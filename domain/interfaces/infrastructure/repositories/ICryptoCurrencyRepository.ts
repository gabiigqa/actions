import { CreateCryptoCurrencyData, CryptoCurrency } from '@/domain/interfaces/domain/entities/CryptoCurrency';

export interface ICryptoCurrencyRepository {
  getCryptoCurrencyById(id: number): Promise<CryptoCurrency | null>;
  getCryptoCurrencyByCode(code: string): Promise<CryptoCurrency | null>;
  getCryptoCurrencyBySymbol(symbol: string): Promise<CryptoCurrency | null>;
  createCryptoCurrency(cryptoCurrencyData: CreateCryptoCurrencyData): Promise<CryptoCurrency>;
  getAllCryptoCurrencies(): Promise<CryptoCurrency[]>;
}