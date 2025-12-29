import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { TYPES } from "@/infrastructure/config/inversify/types";
import { FireblocksConnector } from "@/infrastructure/third-party/fireblocks/fireblocks.connector";
import { inject, injectable } from "inversify";

@injectable()
export class FireblocksServices {
  public constructor(
    @inject(TYPES.FireblocksServices) private fireblocksServices: FireblocksConnector,
    @inject(TYPES.ILoggerService) private loggerService: ILoggerService
  ) { }

  public async createVaultAccount(name: string, customerId: string): Promise<any> {
    {
      try {
        const vault = await this.fireblocksServices.createVaultAccount(name, customerId);
        if (!vault) {
          this.loggerService.error('Failed to create vault account');
          return false;
        }
        const activatedAssets = await this.fireblocksServices.activateVaultAssets(vault.id);
        if (!activatedAssets) {
          this.loggerService.error('Failed to activate vault assets');
          return false;
        }
        this.loggerService.info(`Successfully created vault account: ${vault.id}`);

        return { vault, activatedAssets };
      } catch (error) {
        this.loggerService.error(`Error in createVaultAccount`, error);
        return false;
      }

    }
  }

  public async activateVaultAssets(vaultId: string): Promise<any> {
    try {
      const assets = await this.fireblocksServices.activateVaultAssets(vaultId);
      if (!assets) {
        this.loggerService.error('Failed to activate vault assets');
        return false;
      }
      this.loggerService.info(`Successfully activated vault assets for account: ${vaultId}`);
      return assets;
    }
    catch (error) {
      this.loggerService.error(`Error in activateVaultAssets`, error as Error);
      return false;
    }
  }

  public async getGasStationSettings(assetId?: string): Promise<any> {
    try {
      const settings = await this.fireblocksServices.getGasStationSettings(assetId);
      if (!settings) {
        this.loggerService.error('Failed to get gas station settings');
        return false;
      }
      this.loggerService.info(`Successfully fetched gas station settings`);

      this.loggerService.info(`Gas Station Settings:`, settings);
      return settings;
    }
    catch (error) {
      this.loggerService.error(`Error in getGasStationSettings`, error);
      return false;
    }
  }
}