import { ClientData, CreateClientData } from '@/domain/interfaces/domain/services/IClientService';
import { IClientRepository } from '@/domain/interfaces/infrastructure/repositories/IClientRepository';
import { injectable } from 'inversify';
import clientJson from '../../../data/clients.json';

@injectable()
export class InMemoryClientRepository implements IClientRepository {
  private clients: Map<string, ClientData> = new Map();

  constructor() {
    // Initialize the in-memory client repository with data from the JSON file
    clientJson.forEach(client => {
      this.clients.set(client.id, client as ClientData);
    });
  }

  async getClientById(id: string): Promise<ClientData | null> {
    return Promise.resolve(this.clients.get(id) || null);
  }

  async getClientByEmail(email: string): Promise<ClientData | null> {
    return Promise.resolve(
      Array.from(this.clients.values()).find(client => client.email === email) || null
    );
  }

  async getClientByUserId(userId: string): Promise<ClientData | null> {
    // Note: The new ClientData interface doesn't have userId, but business_id
    // This method may need to be updated based on business requirements
    return Promise.resolve(null);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async createClient(clientData: CreateClientData): Promise<ClientData> {
    const client: ClientData = {
      id: this.generateUUID(),
      ...clientData,
      created_at: new Date()
    };

    this.clients.set(client.id, client);
    return Promise.resolve(client);
  }
}
