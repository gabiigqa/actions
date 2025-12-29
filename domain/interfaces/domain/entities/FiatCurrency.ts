export interface FiatCurrency {
  id: number;
  name: string;
  symbol: string;
  code: string;
}

export interface CreateFiatCurrencyData {
  name: string;
  symbol: string;
  code: string;
}

export interface UpdateFiatCurrencyData {
  name?: string;
  symbol?: string;
  code?: string;
}