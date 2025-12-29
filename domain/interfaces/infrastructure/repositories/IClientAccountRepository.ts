import { ClientAccount, CreateClientAccountData } from '@/domain/interfaces/domain/entities/ClientAccount';

export interface IClientAccountRepository {
  getClientAccountById(id: string): Promise<ClientAccount | null>;
  getClientAccountsByClientId(clientId: string): Promise<ClientAccount[]>;
  createClientAccount(clientAccountData: CreateClientAccountData): Promise<ClientAccount>;
  deleteClientAccount(id: string): Promise<boolean>;
}