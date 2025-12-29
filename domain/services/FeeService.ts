import { CreateFeeData, Fee } from '@domain/interfaces/domain/entities/Fee';
import { IFeeService } from '@domain/interfaces/domain/services/IFeeService';
import { ILoggerService } from '@domain/interfaces/infrastructure/logger/ILoggerService';
import { IFeeRepository } from '@domain/interfaces/infrastructure/repositories/IFeeRepository';
import { TYPES } from '@infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class FeeService implements IFeeService {
  constructor(
    @inject(TYPES.ILoggerService) private logger: ILoggerService,
    @inject(TYPES.IFeeRepository) private feeRepository: IFeeRepository
  ) {}

  async createFee(feeData: CreateFeeData): Promise<Fee> {
    this.logger.info(`Creating new fee for transaction type: ${feeData.transaction_type}`);
    return await this.feeRepository.save(feeData);
  }

  async getFeeById(id: string): Promise<Fee | null> {
    this.logger.info(`Getting fee by ID: ${id}`);
    return await this.feeRepository.findById(id);
  }

  async getFeeByTransactionTypeAndCurrencies(
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<Fee | null> {
    this.logger.info(`Getting fee by transaction type and currencies - Type: ${transactionType}, Asset: ${assetCurrencyId}, Fiat: ${fiatCurrencyId}`);
    return await this.feeRepository.findByTransactionTypeAndCurrencies(transactionType, assetCurrencyId, fiatCurrencyId);
  }

  async getFeeByBusinessAndTransactionType(
    businessId: string,
    transactionType: number,
    assetCurrencyId: number,
    fiatCurrencyId: number
  ): Promise<Fee | null> {
    this.logger.info(`Getting fee by business and transaction type - Business: ${businessId}, Type: ${transactionType}, Asset: ${assetCurrencyId}, Fiat: ${fiatCurrencyId}`);
    return await this.feeRepository.findByBusinessAndTransactionType(businessId, transactionType, assetCurrencyId, fiatCurrencyId);
  }
}