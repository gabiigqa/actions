import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { BaseController } from '@/infrastructure/controllers/BaseController';
import { requireAuth } from '@/infrastructure/middleware/AuthMiddleware';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { ICommissionService } from '@/domain/interfaces/domain/services/ICommissionService';
import { UpsertCommissionRequest } from '@/domain/interfaces/infrastructure/controllers/requests/commissions/UpsertCommissionRequest';

@controller('/api/commissions', requireAuth)
export class CommissionsController extends BaseController {
  constructor(
    @inject(TYPES.ILoggerService) loggerService: ILoggerService,
    @inject(TYPES.ICommissionService) private commissionService: ICommissionService
  ) {
    super(loggerService);
  }

  private truncateDecimals(value: any): any {
    if (typeof value === 'number') {
      const truncated = Math.floor(value * 100) / 100;
      return truncated.toFixed(2);
    }
    if (typeof value === 'string' && !isNaN(Number(value))) {
      const truncated = Math.floor(Number(value) * 100) / 100;
      return truncated.toFixed(2);
    }
    if (Array.isArray(value)) {
      return value.map(item => this.truncateDecimals(item));
    }
    if (typeof value === 'object' && value !== null) {
      const truncated: any = {};
      for (const key in value) {
        truncated[key] = this.truncateDecimals(value[key]);
      }
      return truncated;
    }
    return value;
  }

  @httpGet('/')
  async getAllCommissions(req: Request, res: Response): Promise<void> {
    try {
      const session = req.session;

      if (!session || !session.businessId) {
        this.sendResponse(res, 401, 'Business ID not found in session. Please login again.');
        return;
      }

      const tenantId = session.businessId as string;
      const { pair, fiat, transaction_type } = req.query;

      const filters: any = {};

      if (pair) {
        const validAssets = ['USDC', 'USDT'];
        if (!validAssets.includes((pair as string).toUpperCase())) {
          this.sendResponse(res, 400, `Invalid pair. Must be one of: ${validAssets.join(', ')}`);
          return;
        }
        filters.assetCode = pair as string;
      }

      if (fiat) {
        if ((fiat as string).toUpperCase() !== 'BOB') {
          this.sendResponse(res, 400, `Invalid fiat currency. Only BOB is supported.`);
          return;
        }
        filters.fiatCode = fiat as string;
      }

      if (transaction_type) {
        const validTransactionTypes = ['deposit', 'withdrawal'];
        if (!validTransactionTypes.includes((transaction_type as string).toLowerCase())) {
          this.sendResponse(res, 400, `Invalid transaction type. Must be one of: ${validTransactionTypes.join(', ')}`);
          return;
        }
        filters.transactionTypeCode = (transaction_type as string).toLowerCase();
      }

      this.loggerService.info(`Getting all commissions for tenant: ${tenantId}, filters: ${JSON.stringify(filters)}`);

      const commissions = await this.commissionService.getCommissions(tenantId, filters);

      const truncatedData = this.truncateDecimals(commissions);
      this.sendResponse(res, 200, 'Commissions retrieved successfully', truncatedData);
    } catch (error: Error | any) {
      this.loggerService.error('Error getting commissions', error);
      this.sendResponse(res, 500, 'Failed to get commissions', error);
    }
  }

  @httpGet('/percentage')
  async getPercentageCommissions(req: Request, res: Response): Promise<void> {
    try {
      const session = req.session;

      if (!session || !session.businessId) {
        this.sendResponse(res, 401, 'Business ID not found in session. Please login again.');
        return;
      }

      const tenantId = session.businessId as string;
      const { pair, fiat, transaction_type } = req.query;

      const filters: any = { type: 'PERCENTAGE' };

      if (pair) {
        const validAssets = ['USDC', 'USDT'];
        if (!validAssets.includes((pair as string).toUpperCase())) {
          this.sendResponse(res, 400, `Invalid pair. Must be one of: ${validAssets.join(', ')}`);
          return;
        }
        filters.assetCode = pair as string;
      }

      if (fiat) {
        if ((fiat as string).toUpperCase() !== 'BOB') {
          this.sendResponse(res, 400, `Invalid fiat currency. Only BOB is supported.`);
          return;
        }
        filters.fiatCode = fiat as string;
      }

      if (transaction_type) {
        const validTransactionTypes = ['deposit', 'withdrawal'];
        if (!validTransactionTypes.includes((transaction_type as string).toLowerCase())) {
          this.sendResponse(res, 400, `Invalid transaction type. Must be one of: ${validTransactionTypes.join(', ')}`);
          return;
        }
        filters.transactionTypeCode = (transaction_type as string).toLowerCase();
      }

      this.loggerService.info(`Getting percentage commissions for tenant: ${tenantId}, filters: ${JSON.stringify(filters)}`);

      const commissions = await this.commissionService.getCommissions(tenantId, filters);

      const truncatedData = this.truncateDecimals(commissions);
      this.sendResponse(res, 200, 'Percentage commissions retrieved successfully', truncatedData);
    } catch (error: Error | any) {
      this.loggerService.error('Error getting percentage commissions', error);
      this.sendResponse(res, 500, 'Failed to get percentage commissions', error);
    }
  }

  @httpPost('/percentage')
  async upsertPercentageCommission(req: Request, res: Response): Promise<void> {
    try {
      const session = req.session;

      if (!session || !session.businessId) {
        this.sendResponse(res, 401, 'Business ID not found in session. Please login again.');
        return;
      }

      const tenantId = session.businessId as string;
      const body = req.body as UpsertCommissionRequest;

      if (body.amount === undefined || body.amount === null) {
        this.sendResponse(res, 400, 'amount is required');
        return;
      }

      if (body.amount < 0 || body.amount > 100) {
        this.sendResponse(res, 400, 'Percentage must be between 0 and 100');
        return;
      }

      if (!body.asset) {
        this.sendResponse(res, 400, 'asset is required');
        return;
      }

      const validAssets = ['USDC', 'USDT'];
      if (!validAssets.includes(body.asset.toUpperCase())) {
        this.sendResponse(res, 400, `Invalid asset. Must be one of: ${validAssets.join(', ')}`);
        return;
      }

      if (!body.transaction_type) {
        this.sendResponse(res, 400, 'transaction_type is required');
        return;
      }

      const validTransactionTypes = ['deposit', 'withdrawal'];
      if (!validTransactionTypes.includes(body.transaction_type.toLowerCase())) {
        this.sendResponse(res, 400, `Invalid transaction type. Must be one of: ${validTransactionTypes.join(', ')}`);
        return;
      }

      this.loggerService.info(`Upserting percentage commission for tenant: ${tenantId}, asset: ${body.asset}, amount: ${body.amount}%, transaction_type: ${body.transaction_type}`);

      const commission = await this.commissionService.upsertPercentageCommission(tenantId, body);

      const truncatedData = this.truncateDecimals(commission);
      this.sendResponse(res, 200, 'Percentage commission upserted successfully', truncatedData);
    } catch (error: Error | any) {
      this.loggerService.error('Error upserting percentage commission', error);
      this.sendResponse(res, 500, 'Failed to upsert percentage commission', error);
    }
  }

  @httpGet('/fixed')
  async getFixedCommissions(req: Request, res: Response): Promise<void> {
    try {
      const session = req.session;

      if (!session || !session.businessId) {
        this.sendResponse(res, 401, 'Business ID not found in session. Please login again.');
        return;
      }

      const tenantId = session.businessId as string;
      const { pair, fiat, transaction_type } = req.query;

      const filters: any = { type: 'FIXED' };

      if (pair) {
        const validAssets = ['USDC', 'USDT'];
        if (!validAssets.includes((pair as string).toUpperCase())) {
          this.sendResponse(res, 400, `Invalid pair. Must be one of: ${validAssets.join(', ')}`);
          return;
        }
        filters.assetCode = pair as string;
      }

      if (fiat) {
        if ((fiat as string).toUpperCase() !== 'BOB') {
          this.sendResponse(res, 400, `Invalid fiat currency. Only BOB is supported.`);
          return;
        }
        filters.fiatCode = fiat as string;
      }

      if (transaction_type) {
        const validTransactionTypes = ['deposit', 'withdrawal'];
        if (!validTransactionTypes.includes((transaction_type as string).toLowerCase())) {
          this.sendResponse(res, 400, `Invalid transaction type. Must be one of: ${validTransactionTypes.join(', ')}`);
          return;
        }
        filters.transactionTypeCode = (transaction_type as string).toLowerCase();
      }

      this.loggerService.info(`Getting fixed commissions for tenant: ${tenantId}, filters: ${JSON.stringify(filters)}`);

      const commissions = await this.commissionService.getCommissions(tenantId, filters);

      const truncatedData = this.truncateDecimals(commissions);
      this.sendResponse(res, 200, 'Fixed commissions retrieved successfully', truncatedData);
    } catch (error: Error | any) {
      this.loggerService.error('Error getting fixed commissions', error);
      this.sendResponse(res, 500, 'Failed to get fixed commissions', error);
    }
  }

  @httpPost('/fixed')
  async upsertFixedCommission(req: Request, res: Response): Promise<void> {
    try {
      const session = req.session;

      if (!session || !session.businessId) {
        this.sendResponse(res, 401, 'Business ID not found in session. Please login again.');
        return;
      }

      const tenantId = session.businessId as string;
      const body = req.body as UpsertCommissionRequest;

      if (body.amount === undefined || body.amount === null) {
        this.sendResponse(res, 400, 'amount is required');
        return;
      }

      if (body.amount < 0) {
        this.sendResponse(res, 400, 'Amount must be greater than or equal to 0');
        return;
      }

      if (!body.asset) {
        this.sendResponse(res, 400, 'asset is required');
        return;
      }

      const validAssets = ['USDC', 'USDT'];
      if (!validAssets.includes(body.asset.toUpperCase())) {
        this.sendResponse(res, 400, `Invalid asset. Must be one of: ${validAssets.join(', ')}`);
        return;
      }

      if (!body.transaction_type) {
        this.sendResponse(res, 400, 'transaction_type is required');
        return;
      }

      const validTransactionTypes = ['deposit', 'withdrawal'];
      if (!validTransactionTypes.includes(body.transaction_type.toLowerCase())) {
        this.sendResponse(res, 400, `Invalid transaction type. Must be one of: ${validTransactionTypes.join(', ')}`);
        return;
      }

      this.loggerService.info(`Upserting fixed commission for tenant: ${tenantId}, asset: ${body.asset}, amount: ${body.amount}, transaction_type: ${body.transaction_type}`);

      const commission = await this.commissionService.upsertFixedCommission(tenantId, body);

      const truncatedData = this.truncateDecimals(commission);
      this.sendResponse(res, 200, 'Fixed commission upserted successfully', truncatedData);
    } catch (error: Error | any) {
      this.loggerService.error('Error upserting fixed commission', error);
      this.sendResponse(res, 500, 'Failed to upsert fixed commission', error);
    }
  }
}
