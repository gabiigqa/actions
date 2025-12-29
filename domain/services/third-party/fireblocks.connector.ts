import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { TYPES } from "@/infrastructure/config/inversify/types";
import { FireblocksServices } from "@/infrastructure/third-party/fireblocks/fireblocks.services";
import { inject, injectable } from "inversify";

@injectable()
export class FireblocksConnector {
    public constructor(
        @inject(TYPES.FireblocksServices) private fireblocksServices: FireblocksServices,
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
                this.loggerService.error(`Error in createVaultAccount`, error as Error);
                return false;
            }

        }
    }
}