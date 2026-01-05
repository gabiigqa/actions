import { AccountService } from '@/domain/services/AccountService';
import { ClientAccount } from '@/domain/interfaces/domain/entities/ClientAccount';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IClientAccountRepository } from '@/domain/interfaces/infrastructure/repositories/IClientAccountRepository';

const MOCK_DATA = {
    account: {
        id: '1',
        client_id: '1',
        name: 'Account 1',
        currency_id: 1,
        created_at: new Date(),
    } as ClientAccount,
    noClientIdAccount: {
        client_id: '1',
        name: 'Account 1',
        currency_id: 1,
    } as Partial<ClientAccount>,
}

describe('AccountService', () => {
    let service: AccountService;
    let loggerMock: jest.Mocked<ILoggerService>;
    let accountRepositoryMock: jest.Mocked<IClientAccountRepository>;

    beforeEach(() => {
        // Inicializamos mocks limpios
        loggerMock = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        } as unknown as jest.Mocked<ILoggerService>;

        accountRepositoryMock = {
            getClientAccountById: jest.fn(),
            getClientAccountsByClientId: jest.fn(),
            createClientAccount: jest.fn(),
            updateClientAccount: jest.fn(),
        } as unknown as jest.Mocked<IClientAccountRepository>;

        // Inyectamos
        service = new AccountService(loggerMock, accountRepositoryMock);
    });

    describe('getAccountById', () => {
        test('retorna cuenta cuando existe', async () => {
            // GIVEN
            accountRepositoryMock.getClientAccountById.mockResolvedValue(MOCK_DATA.account);

            // WHEN
            const result = await service.getAccountById(MOCK_DATA.account.id);

            // THEN
            expect(result).toEqual(MOCK_DATA.account);
            expect(accountRepositoryMock.getClientAccountById).toHaveBeenCalledWith(MOCK_DATA.account.id);
        });

        test('retorna null cuando la cuenta no existe', async () => {
            // GIVEN
            accountRepositoryMock.getClientAccountById.mockResolvedValue(null);

            // WHEN
            const result = await service.getAccountById('non-existent-id');

            // THEN
            expect(result).toBeNull();
            expect(accountRepositoryMock.getClientAccountById).toHaveBeenCalledWith('non-existent-id');
        });
    });

    describe('getAccountByClientId', () => {
        test('retorna lista de cuentas cuando el cliente tiene cuentas', async () => {
            // GIVEN
            accountRepositoryMock.getClientAccountsByClientId.mockResolvedValue([MOCK_DATA.account]);

            // WHEN
            const result = await service.getAccountByClientId(MOCK_DATA.account.client_id);

            // THEN
            expect(result).toEqual([MOCK_DATA.account]);
            expect(accountRepositoryMock.getClientAccountsByClientId).toHaveBeenCalledWith(MOCK_DATA.account.client_id);
        });

        test('retorna array vacío cuando el cliente no tiene cuentas', async () => {
            // GIVEN
            accountRepositoryMock.getClientAccountsByClientId.mockResolvedValue([]);

            // WHEN
            const result = await service.getAccountByClientId('non-existent-client-id');

            // THEN
            expect(result).toEqual([]);
            expect(accountRepositoryMock.getClientAccountsByClientId).toHaveBeenCalledWith('non-existent-client-id');
        });
    });
});