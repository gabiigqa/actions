import { CryptoCurrency } from '../../domain/entities/CryptoCurrency';
import { CreateExternalIntegrationData, ExternalIntegration } from '../../domain/entities/ExternalIntegrations';
import { FiatCurrency } from '../../domain/entities/FiatCurrency';
import { Partner } from '../../domain/entities/Partner';

export interface IPartnerRepository {
  getPartnerIdByApiKeyCallback(apiKeyCallback: string): Promise<string | null>;
  getPartnerById(partnerId: string): Promise<Partner | null>;
  getPartnerByCode(partnerCode: string): Promise<Partner | null>;
  getPartnersByCountry(countryCode: string): Promise<Partner[]>;
  getPartnerEnabledCountries(partnerId: string): Promise<number[]>;
  getPartnerEnabledFiatCurrencies(partnerId: string, countryCode: number): Promise<FiatCurrency[]>;
  getPartnerEnabledAssets(partnerId: string, countryCode: number): Promise<CryptoCurrency[]>;
  getPartnerEnabledFiatCurrencyById(partnerId: string, countryCode: number, fiatCurrencyId: number): Promise<FiatCurrency | null>;
  getPartnerEnabledAssetById(partnerId: string, countryCode: number, assetCurrencyId: number): Promise<CryptoCurrency | null>;
  insertExternalIntegration(externalIntegrationData: CreateExternalIntegrationData): Promise<ExternalIntegration | null>;
  updateDataCallbackData(partnerReference: string, data: any, apiKeyCallback: string): Promise<void>;
  countPartnerTransactions(partnerId: string): Promise<number>
}