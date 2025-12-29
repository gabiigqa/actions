import { IClientService } from '@/domain/interfaces/domain/services/IClientService';
import { IPingPongService } from '@/domain/interfaces/domain/services/IPingoService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { AppConfig } from '@infrastructure/config/AppConfig';
import { TYPES } from '@infrastructure/config/inversify/types';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';

@controller('/api/test')
export class TestController {
  constructor(
    @inject(TYPES.IPingPongService) private pingPongService: IPingPongService,
    @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
    @inject(TYPES.IClientService) private clientService: IClientService,
    @inject(TYPES.AppConfig) protected appConfig: AppConfig
  ) { }

  @httpGet('/ping')
  async ping(req: Request, res: Response): Promise<void> {
    try {
      const response = this.pingPongService.getPong();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  @httpGet('/health')
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'api-partner',
      environment: this.appConfig.getEnvironment(),
      version: '1.0.0'
    });
  }

  @httpPost('/encrypt')
  async encrypt(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body
      const saltRounds = this.appConfig.getSaltRounds();
      const hashMessasge = bcrypt.hashSync(message, saltRounds);

      res.status(200).json({
        original: message,
        encrypted: hashMessasge
      });
    } catch (error) {
      this.loggerService.error('Error in encrypt endpoint:', error);

      res.status(500).json({
        code: 500,
        message: error instanceof Error ? error.message : 'Internal Server Error'
      });
    }
  }


  @httpPost('/client')
  async createTestClient(req: Request, res: Response): Promise<void> {
    try {
      const clientData = {
        business_id: req.body.business_id || '0e31d1d2-5ada-484f-9c82-0eaf2ca66709',
        name: req.body.name || 'Test Client',
        email: req.body.email || 'test@example.com',
        status: req.body.status || 'E',
        type: req.body.type || 'individual'
      };

      const client = await this.clientService.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
