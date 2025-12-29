export interface ClientAccountWallet {
  id: string;
  client_account_id: string;
  wallet_address: string;
  asset_currency_id: number;
  network: string;
  memo?: string;
  status: string;
  created_at?: Date;
}

export interface CreateClientAccountWalletData {
  client_account_id: string;
  wallet_address: string;
  asset_currency_id: number;
  network: string;
  memo?: string;
}
