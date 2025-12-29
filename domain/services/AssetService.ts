import { CryptoCurrency } from '@/domain/interfaces/domain';
import { IAssetService } from '@/domain/interfaces/domain/services/IAssetService';
import { ICryptoCurrencyRepository } from '@/domain/interfaces/infrastructure/repositories/ICryptoCurrencyRepository';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class AssetService implements IAssetService {
    constructor(
        @inject(TYPES.ICryptoCurrencyRepository) private cryptoCurrencyRepository: ICryptoCurrencyRepository
    ) {}

    async getAssetById(id: number): Promise<CryptoCurrency | null> {
        return await this.cryptoCurrencyRepository.getCryptoCurrencyById(id);
    }

    async getAssetByCode(code: string): Promise<CryptoCurrency | null> {
        return await this.cryptoCurrencyRepository.getCryptoCurrencyByCode(code);
    }

    async getAllAssets(): Promise<CryptoCurrency[]> {
        return await this.cryptoCurrencyRepository.getAllCryptoCurrencies();
    }
}