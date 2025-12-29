import { ClientService } from '@/domain/services/ClientService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IClientRepository } from '@/domain/interfaces/infrastructure/repositories/IClientRepository';
import { ClientData, CreateClientData } from '@domain/interfaces/domain/services/IClientService';

const MOCK_DATA = {
    client: {
        id: '1',
        business_id: '1',
        name: 'Client',
        email: 'client@client.com',
        status: 'ACTIVE',
        type: 'CLIENT',
    } as ClientData,
    noBusinessClient: {
        business_id: '1',
        name: 'Client',
        email: 'client@client.com',
        status: 'ACTIVE',
        type: 'CLIENT',
    } as CreateClientData,
}

describe('ClientService', () => {
    let clientRepository: jest.Mocked<IClientRepository>;
    let logger: jest.Mocked<ILoggerService>;
    let clientService: ClientService;

    beforeEach(() => {
        clientRepository = {
            createClient: jest.fn(),
            getClientById: jest.fn(),
            getClientByEmail: jest.fn(),
            getClientByUserId: jest.fn(),
        } as unknown as jest.Mocked<IClientRepository>;

        logger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        } as unknown as jest.Mocked<ILoggerService>;

        clientService = new ClientService(clientRepository, logger);
    });

    describe('createClient', () => {
        it('should create a client successfully', async () => {
            clientRepository.createClient.mockResolvedValue(MOCK_DATA.client);

            const result = await clientService.createClient(MOCK_DATA.noBusinessClient);

            expect(result).toEqual(MOCK_DATA.client);
            expect(clientRepository.createClient).toHaveBeenCalledWith(MOCK_DATA.noBusinessClient);
        });
        it('should throw an error if createClient fails', async () => {
            const error = new Error('Database error');
            clientRepository.createClient.mockRejectedValue(error);

            await expect(clientService.createClient(MOCK_DATA.noBusinessClient)).rejects.toThrow('Database error');
        });

    });
});