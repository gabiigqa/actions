export interface TransactionType {
  id: number;
  description: string;
  code: string;
}

export interface CreateTransactionTypeData {
  description: string;
  code: string;
}