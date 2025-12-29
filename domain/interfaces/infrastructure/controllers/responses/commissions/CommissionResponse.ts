export interface CommissionResponse {
  asset: string;
  fiatCurrency: string;
  transactionType: string;
  fee: {
    amount: number;
    type: string;
  };
}
