import { ClientData, CreateClientData } from '@/domain/interfaces/domain/services/IClientService';

export interface IClientRepository {
  getClientById(id: string): Promise<ClientData | null>;
  getClientByEmail(email: string): Promise<ClientData | null>;
  getClientByUserId(userId: string): Promise<ClientData | null>;
  createClient(clientData: CreateClientData): Promise<ClientData>;
}