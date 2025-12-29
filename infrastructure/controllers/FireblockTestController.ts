import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { FireblocksServices } from "@/domain/services/third-party/fireblocks.services";
import { TYPES } from "@/infrastructure/config/inversify/types";
import { BaseController } from '@/infrastructure/controllers/BaseController';
import { requireAuth } from "@/infrastructure/middleware/AuthMiddleware";
import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";

@controller('/api/fireblocks', requireAuth)
export class FireblockController extends BaseController {
  constructor(
    @inject(TYPES.ILoggerService) loggerService: ILoggerService,
    @inject(TYPES.FireblocksConnector) private fireblocksConnector: FireblocksServices
  ) {
    super(loggerService);
  }

  @httpPost('/create/account')
  public async createVaultAccount(req: Request, res: Response) {
    const { name, customerId } = req.body;
    try {
      const vault = await this.fireblocksConnector.createVaultAccount(name, customerId);
      if (!vault) {
        this.loggerService.error('Failed to create vault account');
        return res.status(500).json({ error: 'Failed to create vault account' });
      }
      this.loggerService.info(`Successfully created vault account: ${vault.id}`);
      res.status(201).json(vault);
    } catch (error) {
      this.loggerService.error(`Failed to create vault account`, error as Error);
      res.status(500).json({ error: 'Failed to create vault account' });
    }
  }

  @httpGet('/gas/station/settings')
  public async getGasStationSettings(req: Request, res: Response) {

    try {

      const { assetId } = req.query;

      const settings = await this.fireblocksConnector.getGasStationSettings(assetId as string | undefined);

      if (!settings) {
        this.loggerService.error('Failed to get gas station settings');
        throw new Error('Failed to get gas station settings');
      }
      this.loggerService.info(`Successfully fetched gas station settings`);
      this.sendResponse(res, 200, 'Success', settings)
    }
    catch (error) {
      this.loggerService.error('Error fetching gas station settings', error);
      this.sendResponse(res, 500, 'Failed to get gas station settings', null);
    }

  }
}