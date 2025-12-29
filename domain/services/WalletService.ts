import { ClientAccountWallet } from '@/domain/interfaces/domain/entities/ClientAccountWallet';
import { IWalletService } from '@/domain/interfaces/domain/services/IWalletService';
import { IClientAccountWalletRepository } from '@/domain/interfaces/infrastructure/repositories/IClientAccountWalletRepository';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class WalletService implements IWalletService {
    constructor(
        @inject(TYPES.IClientAccountWalletRepository) private walletRepository: IClientAccountWalletRepository
    ) {}

    async getWalletById(id: string): Promise<ClientAccountWallet | null> {
        return await this.walletRepository.getClientAccountWalletById(id);
    }

    async getWalletsByAccountId(accountId: string): Promise<ClientAccountWallet[]> {
        const wallets = await this.walletRepository.getClientAccountWalletsByClientAccountId(accountId);
        return wallets || [];
    }
}