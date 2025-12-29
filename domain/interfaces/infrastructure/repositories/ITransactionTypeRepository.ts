import { CreateTransactionTypeData, TransactionType } from '@/domain/interfaces/domain/entities/TransactionType';

export interface ITransactionTypeRepository {
  getTransactionTypeById(id: number): Promise<TransactionType | null>;
  getTransactionTypeByCode(code: string): Promise<TransactionType | null>;
  createTransactionType(transactionTypeData: CreateTransactionTypeData): Promise<TransactionType>;
  getAllTransactionTypes(): Promise<TransactionType[]>;
}