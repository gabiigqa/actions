import { CreateTransactionStatusData, TransactionStatus } from '@/domain/interfaces/domain/entities/TransactionStatus';

export interface ITransactionStatusRepository {
  getTransactionStatusById(id: number): Promise<TransactionStatus | null>;
  getTransactionStatusByCode(code: string): Promise<TransactionStatus | null>;
  createTransactionStatus(transactionStatusData: CreateTransactionStatusData): Promise<TransactionStatus>;
  getAllTransactionStatuses(): Promise<TransactionStatus[]>;
}