import { TransactionType } from '@/domain/interfaces/domain/entities/TransactionType';

export interface ITransactionTypeService {
  getTransactionTypeById(id: number): Promise<TransactionType | null>;
  getTransactionTypeByCode(code: string): Promise<TransactionType | null>;
  getAllTransactionTypes(): Promise<TransactionType[]>;
}