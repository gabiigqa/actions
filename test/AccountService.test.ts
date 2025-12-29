import { AccountService } from '@/domain/services/AccountService';
import { ClientAccount, CreateClientAccountData } from '@/domain/interfaces/domain/entities/ClientAccount';
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
    } as CreateClientAccountData,
}

describe('AccountService', () => {
    let service: AccountService;
    let logger: jest.Mocked<ILoggerService>;
    let accountRepository: jest.Mocked<IClientAccountRepository>;

    beforeEach(() => {
        logger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        } as unknown as jest.Mocked<ILoggerService>;

        accountRepository = {
            getClientAccountById: jest.fn(),
            getClientAccountsByClientId: jest.fn(),
        } as unknown as jest.Mocked<IClientAccountRepository>;

        service = new AccountService(logger, accountRepository);
    });

    describe('getAccountById', () => {
        test('retorna cuenta cuando existe', async () => {
            accountRepository.getClientAccountById.mockResolvedValue(MOCK_DATA.account);

            const result = await service.getAccountById(MOCK_DATA.account.id);

            expect(result).toEqual(MOCK_DATA.account);
            expect(accountRepository.getClientAccountById).toHaveBeenCalledWith(MOCK_DATA.account.id);
        });

        test('retorna null cuando la cuenta no existe', async () => {
            accountRepository.getClientAccountById.mockResolvedValue(null);

            const result = await service.getAccountById('non-existent-id');

            expect(result).toBeNull();
            expect(accountRepository.getClientAccountById).toHaveBeenCalledWith('non-existent-id');
        });
    });

    describe('getAccountByClientId', () => {
        test('retorna lista de cuentas cuando el cliente tiene cuentas', async () => {
            accountRepository.getClientAccountsByClientId.mockResolvedValue([MOCK_DATA.account]);

            const result = await service.getAccountByClientId(MOCK_DATA.account.client_id);

            expect(result).toEqual([MOCK_DATA.account]);
            expect(accountRepository.getClientAccountsByClientId).toHaveBeenCalledWith(MOCK_DATA.account.client_id);
        });

        test('retorna array vacío cuando el cliente no tiene cuentas', async () => {
            accountRepository.getClientAccountsByClientId.mockResolvedValue([]);

            const result = await service.getAccountByClientId('non-existent-client-id');

            expect(result).toEqual([]);
            expect(accountRepository.getClientAccountsByClientId).toHaveBeenCalledWith('non-existent-client-id');
        });
    });
});