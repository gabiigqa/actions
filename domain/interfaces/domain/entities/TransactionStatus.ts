export interface TransactionStatus {
  id: number;
  description: string;
  code: string;
}

export interface CreateTransactionStatusData {
  description: string;
  code: string;
}