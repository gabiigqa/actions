import { AgreementSigningSessionCreateRequest } from '@/domain/interfaces/bvnk/request';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { BvnkServices } from '@/domain/services/third-party/bvnk.services';
import { requireAuth } from '@/infrastructure/middleware/AuthMiddleware';
import validateRequest from '@/infrastructure/middleware/ValidateRequestMiddleware';
import { CreateToSRequestValidations } from '@/infrastructure/validators/bvnk/createToSRequestValidation';
import { TYPES } from '@infrastructure/config/inversify/types';
import { Request, Response } from "express";
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';

@controller('/api/bvnk', requireAuth)
export class BvnkTestController {
  constructor(
    @inject(TYPES.BvnkServices) private bvnkServices: BvnkServices,
    @inject(TYPES.ILoggerService) private logger: ILoggerService
  ) { }

  @httpGet('/customers')
  async listCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      const nameFilter = name as string | "";
      const customers = await this.bvnkServices.listCustomers(nameFilter);

      res.status(200).json(customers);
    } catch (error) {
      this.logger.error('Error fetching customers:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  @httpPost('/create-tos', validateRequest(CreateToSRequestValidations))
  async createTos(req: Request, res: Response): Promise<void> {
    try {
      const { type, useCase, country } = req.body;

      let tosRequest: AgreementSigningSessionCreateRequest = {
        addressCountryCode: country,
        type,
        useCase
      }
      const tosResponse = await this.bvnkServices.createToS(tosRequest);

      res.status(200).json(tosResponse);
    } catch (error) {
      this.logger.error('Error creating Terms of Service:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
