import { Country } from '@/domain/interfaces/domain/entities/Country';
import { ICountryService } from '@/domain/interfaces/domain/services/ICountryService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { ICountryRepository } from '@/domain/interfaces/infrastructure/repositories/ICountryRepository';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class CountryService implements ICountryService {
    constructor(
        @inject(TYPES.ICountryRepository) private countryRepository: ICountryRepository,
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService
    ) {}

    async getCountryById(id: number): Promise<Country | null> {
        try {
            return await this.countryRepository.getCountryById(id);
        } catch (error) {
            this.loggerService.error(`Error in CountryService.getCountryById: ${id}`, error);
            throw error;
        }
    }

    async getCountryByIsoAlpha2(code: string): Promise<Country | null> {
        try {
            return await this.countryRepository.getCountryByIsoAlpha2(code);
        } catch (error) {
            this.loggerService.error(`Error in CountryService.getCountryByIsoAlpha2: ${code}`, error);
            throw error;
        }
    }

    async getCountryByIsoAlpha3(code: string): Promise<Country | null> {
        try {
            return await this.countryRepository.getCountryByIsoAlpha3(code);
        } catch (error) {
            this.loggerService.error(`Error in CountryService.getCountryByIsoAlpha3: ${code}`, error);
            throw error;
        }
    }

    async getCountryByIsoNumeric(code: number): Promise<Country | null> {
        try {
            return await this.countryRepository.getCountryByIsoNumeric(code);
        } catch (error) {
            this.loggerService.error(`Error in CountryService.getCountryByIsoNumeric: ${code}`, error);
            throw error;
        }
    }

    async getAllCountries(): Promise<Country[]> {
        try {
            return await this.countryRepository.getAllCountries();
        } catch (error) {
            this.loggerService.error('Error in CountryService.getAllCountries', error);
            throw error;
        }
    }
}