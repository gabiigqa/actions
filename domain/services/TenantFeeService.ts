import { CreateTenantFeeData, TenantFee } from '@domain/interfaces/domain/entities/TenantFee';
import { ITenantFeeService } from '@domain/interfaces/domain/services/ITenantFeeService';
import { ILoggerService } from '@domain/interfaces/infrastructure/logger/ILoggerService';
import { ITenantFeeRepository } from '@domain/interfaces/infrastructure/repositories/ITenantFeeRepository';
import { TYPES } from '@infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class TenantFeeService implements ITenantFeeService {
  constructor(
    @inject(TYPES.ILoggerService) private logger: ILoggerService,
    @inject(TYPES.ITenantFeeRepository) private tenantFeeRepository: ITenantFeeRepository
  ) {}

  async createTenantFee(tenantFeeData: CreateTenantFeeData): Promise<TenantFee> {
    this.logger.info(`Creating new tenant fee for tenant: ${tenantFeeData.tenant_id}, transaction type: ${tenantFeeData.transaction_type}`);
    return await this.tenantFeeRepository.save(tenantFeeData);
  }

  async getTenantFeeById(id: string): Promise<TenantFee | null> {
    this.logger.info(`Getting tenant fee by ID: ${id}`);
    return await this.tenantFeeRepository.findById(id);
  }

  async getTenantFeeByTenantAndTransactionType(
    tenantId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<TenantFee | null> {
    this.logger.info(`Getting tenant fee by tenant and transaction type - Tenant: ${tenantId}, Type: ${transactionType}, Asset: ${assetCurrencyId}, Fiat: ${fiatCurrencyId}`);
    return await this.tenantFeeRepository.findByTenantAndTransactionType(tenantId, transactionType, assetCurrencyId, fiatCurrencyId);
  }
}
