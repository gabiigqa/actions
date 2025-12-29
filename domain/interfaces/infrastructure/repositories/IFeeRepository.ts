import { CreateFeeData, Fee } from '../../domain/entities/Fee';

export interface IFeeRepository {
  save(fee: CreateFeeData): Promise<Fee>;
  findById(id: string): Promise<Fee | null>;
  findByTransactionTypeAndCurrencies(
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<Fee | null>;
  findByBusinessAndTransactionType(
    businessId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<Fee | null>;
}