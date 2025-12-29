export interface ClientAccount {
  id: string;
  client_id: string;
  name: string;
  currency_id: number;
  created_at?: Date;
}

export interface CreateClientAccountData {
  client_id: string;
  name: string;
  currency_id: number;
}

export interface UpdateClientAccountData {
  name?: string;
  currency_id?: number;
}