import { CreateFeeData, Fee } from '../entities/Fee';

export interface IFeeService {
  createFee(feeData: CreateFeeData): Promise<Fee>;
  getFeeById(id: string): Promise<Fee | null>;
  getFeeByTransactionTypeAndCurrencies(
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<Fee | null>;
  getFeeByBusinessAndTransactionType(
    businessId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<Fee | null>;
}