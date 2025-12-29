import { CryptoCurrency } from '@/domain/interfaces/domain/entities/CryptoCurrency';
import { CreateExternalIntegrationData, ExternalIntegration } from '@/domain/interfaces/domain/entities/ExternalIntegrations';
import { FiatCurrency } from '@/domain/interfaces/domain/entities/FiatCurrency';
import { Partner } from '@/domain/interfaces/domain/entities/Partner';
import { IPartnerService } from '@/domain/interfaces/domain/services/IPartnerService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IPartnerRepository } from '@/domain/interfaces/infrastructure/repositories/IPartnerRepository';
import { TYPES } from '@infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class PartnerService implements IPartnerService {
  constructor(
    @inject(TYPES.ILoggerService) private logger: ILoggerService,
    @inject(TYPES.IPartnerRepository) private partnerRepository: IPartnerRepository
  ) { }

  async getPartnerIdByApiKeyCallback(apiKeyCallback: string): Promise<string | null> {
    this.logger.info(`Getting partner by API key callback: ${apiKeyCallback}`);
    try {
      const partnerId = await this.partnerRepository.getPartnerIdByApiKeyCallback(apiKeyCallback);
      if (partnerId) {
        this.logger.info(`Partner found with ID: ${partnerId}`);
      } else {
        this.logger.warn(`No partner found for API key callback: ${apiKeyCallback}`);
      }
      return partnerId;
    } catch (error) {
      this.logger.error(`Error getting partner by API key callback: ${error}`);
      throw error;
    }
  }

  async getPartnerById(partnerId: string): Promise<Partner | null> {
    this.logger.info(`Getting partner by ID: ${partnerId}`);
    try {
      const partner = await this.partnerRepository.getPartnerById(partnerId);
      if (partner) {
        this.logger.info(`Partner found: ${partner.name}`);
      } else {
        this.logger.warn(`No partner found with ID: ${partnerId}`);
      }
      return partner;
    } catch (error) {
      this.logger.error(`Error getting partner by ID: ${error}`);
      throw error;
    }
  }

  async getPartnerByCode(partnerCode: string): Promise<Partner | null> {
    this.logger.info(`Getting partner by code: ${partnerCode}`);
    try {
      const partner = await this.partnerRepository.getPartnerByCode(partnerCode);
      if (partner) {
        this.logger.info(`Partner found: ${partner.name}`);
      } else {
        this.logger.warn(`No partner found with code: ${partnerCode}`);
      }
      return partner;
    } catch (error) {
      this.logger.error(`Error getting partner by code: ${error}`);
      throw error;
    }
  }

  async getPartnersByCountry(countryCode: string): Promise<Partner[]> {
    this.logger.info(`Getting partners by country code: ${countryCode}`);
    try {
      const partners = await this.partnerRepository.getPartnersByCountry(countryCode);
      this.logger.info(`Found ${partners.length} partners for country code: ${countryCode}`);
      return partners;
    } catch (error) {
      this.logger.error(`Error getting partners by country: ${error}`);
      throw error;
    }
  }

  async getPartnerEnabledCountries(partnerId: string): Promise<number[]> {
    this.logger.info(`Getting enabled countries for partner: ${partnerId}`);
    try {
      const countries = await this.partnerRepository.getPartnerEnabledCountries(partnerId);
      this.logger.info(`Found ${countries.length} enabled countries for partner: ${partnerId}`);
      return countries;
    } catch (error) {
      this.logger.error(`Error getting partner enabled countries: ${error}`);
      throw error;
    }
  }

  async getPartnerEnabledFiatCurrencies(partnerId: string, countryCode: number): Promise<FiatCurrency[]> {
    this.logger.info(`Getting enabled fiat currencies for partner: ${partnerId}, country: ${countryCode}`);
    try {
      const currencies = await this.partnerRepository.getPartnerEnabledFiatCurrencies(partnerId, countryCode);
      this.logger.info(`Found ${currencies.length} enabled fiat currencies for partner: ${partnerId}`);
      return currencies;
    } catch (error) {
      this.logger.error(`Error getting partner enabled fiat currencies: ${error}`);
      throw error;
    }
  }

  async getPartnerEnabledAssets(partnerId: string, countryCode: number): Promise<CryptoCurrency[]> {
    this.logger.info(`Getting enabled assets for partner: ${partnerId}, country: ${countryCode}`);
    try {
      const assets = await this.partnerRepository.getPartnerEnabledAssets(partnerId, countryCode);
      this.logger.info(`Found ${assets.length} enabled assets for partner: ${partnerId}`);
      return assets;
    } catch (error) {
      this.logger.error(`Error getting partner enabled assets: ${error}`);
      throw error;
    }
  }

  async getPartnerEnabledFiatCurrencyById(partnerId: string, countryCode: number, fiatCurrencyId: number): Promise<FiatCurrency | null> {
    this.logger.info(`Getting enabled fiat currency by ID for partner: ${partnerId}, country: ${countryCode}, currency: ${fiatCurrencyId}`);
    try {
      const currency = await this.partnerRepository.getPartnerEnabledFiatCurrencyById(partnerId, countryCode, fiatCurrencyId);
      if (currency) {
        this.logger.info(`Enabled fiat currency found: ${currency.name}`);
      } else {
        this.logger.warn(`No enabled fiat currency found for partner: ${partnerId}, country: ${countryCode}, currency: ${fiatCurrencyId}`);
      }
      return currency;
    } catch (error) {
      this.logger.error(`Error getting partner enabled fiat currency by ID: ${error}`);
      throw error;
    }
  }

  async getPartnerEnabledAssetById(partnerId: string, countryCode: number, assetCurrencyId: number): Promise<CryptoCurrency | null> {
    this.logger.info(`Getting enabled asset by ID for partner: ${partnerId}, country: ${countryCode}, asset: ${assetCurrencyId}`);
    try {
      const asset = await this.partnerRepository.getPartnerEnabledAssetById(partnerId, countryCode, assetCurrencyId);
      if (asset) {
        this.logger.info(`Enabled asset found: ${asset.name}`);
      } else {
        this.logger.warn(`No enabled asset found for partner: ${partnerId}, country: ${countryCode}, asset: ${assetCurrencyId}`);
      }
      return asset;
    } catch (error) {
      this.logger.error(`Error getting partner enabled asset by ID: ${error}`);
      throw error;
    }
  }

  async insertExternalIntegration(externalIntegrationData: CreateExternalIntegrationData): Promise<ExternalIntegration | null> {
    this.logger.info(`Inserting external integration for transaction: ${externalIntegrationData.transactionId}`);
    try {
      const externalIntegration = await this.partnerRepository.insertExternalIntegration(externalIntegrationData);
      if (externalIntegration) {
        this.logger.info(`External integration inserted successfully with ID: ${externalIntegration.id} for transaction: ${externalIntegration.transactionId}`);
      } else {
        this.logger.warn(`Failed to insert external integration for transaction: ${externalIntegrationData.transactionId}`);
      }
      return externalIntegration;
    } catch (error) {
      this.logger.error(`Error inserting external integration: ${error}`);
      throw error;
    }
  }

  async updateDataCallbackData(partnerReference: string, data: any, apiKeyCallback: string): Promise<void> {
    this.logger.info(`Updating callback data for partner reference: ${partnerReference}`);
    try {
      await this.partnerRepository.updateDataCallbackData(partnerReference, data, apiKeyCallback);
      this.logger.info(`Callback data updated successfully for partner reference: ${partnerReference}`);
    } catch (error) {
      this.logger.error(`Error updating callback data: ${error}`);
      throw error;
    }
  }

  async countPartnerTransactions(partnerId: string): Promise<number> {
    this.logger.info(`Counting transactions for partner: ${partnerId}`);
    try {
      const count = await this.partnerRepository.countPartnerTransactions(partnerId);
      this.logger.info(`Partner: ${partnerId} has ${count} transactions`);
      return count;
    } catch (error) {
      this.logger.error(`Error counting partner transactions: ${error}`);
      throw error;
    }
  }
}