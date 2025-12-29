import { TransactionStatus } from '@/domain/interfaces/domain/entities/TransactionStatus';

export interface ITransactionStatusService {
  getTransactionStatusById(id: number): Promise<TransactionStatus | null>;
  getTransactionStatusByCode(code: string): Promise<TransactionStatus | null>;
  getAllTransactionStatuses(): Promise<TransactionStatus[]>;
}