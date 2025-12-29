import { Country, CreateCountryData, UpdateCountryData } from '../../domain/entities/Country';

export interface ICountryRepository {
  getCountryById(id: number): Promise<Country | null>;
  getCountryByIsoAlpha2(code: string): Promise<Country | null>;
  getCountryByIsoAlpha3(code: string): Promise<Country | null>;
  getCountryByIsoNumeric(code: number): Promise<Country | null>;
  getAllCountries(): Promise<Country[]>;
  createCountry(data: CreateCountryData): Promise<Country>;
  updateCountry(id: number, data: UpdateCountryData): Promise<Country | null>;
  deleteCountry(id: number): Promise<boolean>;
}