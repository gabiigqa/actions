import { FiatCurrency } from '@/domain/interfaces/domain/entities/FiatCurrency';
import { ICurrencyService } from '@/domain/interfaces/domain/services/ICurrencyService';
import { IFiatCurrencyRepository } from '@/domain/interfaces/infrastructure/repositories/IFiatCurrencyRepository';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class CurrencyService implements ICurrencyService {
    constructor(
        @inject(TYPES.IFiatCurrencyRepository) private fiatCurrencyRepository: IFiatCurrencyRepository
    ) {}

    async getCurrencyById(id: number): Promise<FiatCurrency | null> {
        return await this.fiatCurrencyRepository.getFiatCurrencyById(id);
    }

    async getCurrencyByCode(code: string): Promise<FiatCurrency | null> {
        return await this.fiatCurrencyRepository.getFiatCurrencyByCode(code);
    }

    async getAllCurrencies(): Promise<FiatCurrency[]> {
        return await this.fiatCurrencyRepository.getAllFiatCurrencies();
    }
}