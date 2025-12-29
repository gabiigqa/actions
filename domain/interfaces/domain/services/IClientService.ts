export interface ClientData {
    id: string;
    business_id: string;
    email: string;
    name: string;
    status: string;
    type: string;
    created_at?: Date;
}

export interface CreateClientData {
    business_id: string;
    email: string;
    name: string;
    status: string;
    type: string;
}

export interface IClientService {
  getClientById(id: string): Promise<ClientData | null>;
  getClientByEmail(email: string): Promise<ClientData | null>;
  getClientByUserId(userId: string): Promise<ClientData | null>;
  createClient(clientData: CreateClientData): Promise<ClientData>;
}