export interface CryptoCurrency {
  id: number;
  name: string;
  symbol: string;
  code: string;
}

export interface CreateCryptoCurrencyData {
  name: string;
  symbol: string;
  code: string;
}

export interface UpdateCryptoCurrencyData {
  name?: string;
  symbol?: string;
  code?: string;
}