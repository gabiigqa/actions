import { Country } from '../entities/Country';

export interface ICountryService {
  getCountryById(id: number): Promise<Country | null>;
  getCountryByIsoAlpha2(code: string): Promise<Country | null>;
  getCountryByIsoAlpha3(code: string): Promise<Country | null>;
  getCountryByIsoNumeric(code: number): Promise<Country | null>;
  getAllCountries(): Promise<Country[]>;
}