import { FireblocksServices } from '@/infrastructure/third-party/fireblocks/fireblocks.services';

// Definimos el tipo del Mock para tener autocompletado de Jest
export type MockFireblocksService = jest.Mocked<FireblocksServices>;

export const createFireblocksMock = (): MockFireblocksService => {
    const mock = {
        createVaultAccount: jest.fn(),
        activateVaultAssets: jest.fn(),
        getBalance: jest.fn(),
        createExternalTransaction: jest.fn(),
        createInternalTransaction: jest.fn(),
        createExternalTransactionWithCommission: jest.fn(),
        // Mock de propiedades privadas o getters si fuera necesario
    } as unknown as MockFireblocksService;

    // --- Helpers para configurar escenarios comunes ---

    // Escenario: Crear Vault Exitoso
    (mock as any).givenCreateVaultAccountSucceeds = (vaultId = '1', customerRefId = 'cust1') => {
        mock.createVaultAccount.mockResolvedValue({
            id: vaultId,
            name: `Vault ${vaultId}`,
            customerRefId: customerRefId,
            assets: []
        });
        return mock; // Retornamos el mock para encadenar llamadas
    };

    // Escenario: Fallo al crear Vault
    (mock as any).givenCreateVaultAccountFails = () => {
        mock.createVaultAccount.mockResolvedValue(false); // Tu servicio retorna false en error
        return mock;
    };

    // Escenario: Obtener Balance Exitoso
    (mock as any).givenGetBalanceReturns = (amount = '100.00', available = '90.00') => {
        mock.getBalance.mockResolvedValue({
            total: amount,
            available: available,
            pending: '0',
            frozen: '0'
        });
        return mock;
    };

    // Escenario: Error general (Timeout o Excepción)
    (mock as any).givenExternalTransactionThrows = (errorMessage = 'Timeout') => {
        mock.createExternalTransaction.mockRejectedValue(new Error(errorMessage));
        return mock;
    };

    return mock;
};