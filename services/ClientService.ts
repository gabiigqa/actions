import { ClientData, CreateClientData, IClientService } from "@/domain/interfaces/domain/services/IClientService";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IClientRepository } from "@/domain/interfaces/infrastructure/repositories/IClientRepository";
import { TYPES } from "@/infrastructure/config/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class ClientService implements IClientService {
    constructor(
        @inject(TYPES.IClientRepository) private clientRepository: IClientRepository,
        @inject(TYPES.ILoggerService) private logger: ILoggerService,

    ) { }

    getClientById(id: string): Promise<ClientData | null> {
        return this.clientRepository.getClientById(id);
    }

    getClientByEmail(email: string): Promise<ClientData | null> {
        return this.clientRepository.getClientByEmail(email);
    }

    getClientByUserId(userId: string): Promise<ClientData | null> {
        return this.clientRepository.getClientByUserId(userId);
    }

    async createClient(clientData: CreateClientData): Promise<ClientData> {
        try {
            this.logger.info(`Creating new client with email: ${clientData.email}, type: ${clientData.type}`);
            const client = await this.clientRepository.createClient(clientData);
            this.logger.info(`Client created successfully with ID: ${client.id}`);
            return client;
        } catch (error) {
            this.logger.error('Error creating client', error);
            throw error;
        }
    }

}