import { ClientAccountWallet, CreateClientAccountWalletData } from '@/domain/interfaces/domain/entities/ClientAccountWallet';

export interface IClientAccountWalletRepository {
    getClientAccountWalletById(id: string): Promise<ClientAccountWallet | null>;
    getClientAccountWalletsByClientAccountId(clientAccountId: string): Promise<ClientAccountWallet[] | null>;
    getClientAccountWalletByClientId(clientId: string): Promise<ClientAccountWallet[] | null>
    createClientAccountWallet(walletData: CreateClientAccountWalletData): Promise<ClientAccountWallet>;
    deleteClientAccountWallet(id: string): Promise<boolean>;
}