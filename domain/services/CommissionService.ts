import { injectable, inject } from 'inversify';
import { ICommissionService, CommissionType } from '@/domain/interfaces/domain/services/ICommissionService';
import { ITenantFeeRepository } from '@domain/interfaces/infrastructure/repositories/ITenantFeeRepository';
import { ICryptoCurrencyRepository } from '@domain/interfaces/infrastructure/repositories/ICryptoCurrencyRepository';
import { IFiatCurrencyRepository } from '@domain/interfaces/infrastructure/repositories/IFiatCurrencyRepository';
import { ITransactionTypeRepository } from '@domain/interfaces/infrastructure/repositories/ITransactionTypeRepository';
import { ILoggerService } from '@domain/interfaces/infrastructure/logger/ILoggerService';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { CommissionResponse } from '@/domain/interfaces/infrastructure/controllers/responses/commissions/CommissionResponse';
import { UpsertCommissionRequest } from '@/domain/interfaces/infrastructure/controllers/requests/commissions/UpsertCommissionRequest';
import { TenantFee } from '@domain/interfaces/domain/entities/TenantFee';

@injectable()
export class CommissionService implements ICommissionService {
  constructor(
    @inject(TYPES.ILoggerService) private logger: ILoggerService,
    @inject(TYPES.ITenantFeeRepository) private tenantFeeRepository: ITenantFeeRepository,
    @inject(TYPES.ICryptoCurrencyRepository) private cryptoCurrencyRepository: ICryptoCurrencyRepository,
    @inject(TYPES.IFiatCurrencyRepository) private fiatCurrencyRepository: IFiatCurrencyRepository,
    @inject(TYPES.ITransactionTypeRepository) private transactionTypeRepository: ITransactionTypeRepository
  ) {}

  private getFeeTypeName(feeTypeId: number): string {
    const feeTypeMap: { [key: number]: string } = {
      1: 'FIXED',
      2: 'PERCENTAGE',
      3: 'FIXEDUNIT'
    };
    return feeTypeMap[feeTypeId] || 'UNKNOWN';
  }

  private async mapTenantFeeToResponse(tenantFee: TenantFee): Promise<CommissionResponse> {
    const cryptoCurrency = await this.cryptoCurrencyRepository.getCryptoCurrencyById(tenantFee.asset_currency_id);
    const fiatCurrency = await this.fiatCurrencyRepository.getFiatCurrencyById(tenantFee.fiat_currency_id);
    const transactionType = await this.transactionTypeRepository.getTransactionTypeById(tenantFee.transaction_type);

    return {
      asset: cryptoCurrency?.name ?? 'Unknown',
      fiatCurrency: fiatCurrency?.code ?? 'Unknown',
      transactionType: transactionType?.code ?? 'Unknown',
      fee: {
        amount: tenantFee.fee_amount,
        type: this.getFeeTypeName(tenantFee.fee_type)
      }
    };
  }

  async getCommissions(
    tenantId: string,
    filters?: {
      type?: CommissionType;
      assetCurrencyId?: number;
      fiatCurrencyId?: number;
      assetCode?: string;
      fiatCode?: string;
      transactionTypeCode?: string;
    }
  ): Promise<CommissionResponse[]> {
    const repoFilters: any = {};

    if (filters?.type) {
      repoFilters.feeTypeCode = filters.type;
    }

    if (filters?.assetCode) {
      const cryptoCurrency = await this.cryptoCurrencyRepository.getCryptoCurrencyByCode(filters.assetCode.toUpperCase());
      if (cryptoCurrency) {
        repoFilters.assetCurrencyId = cryptoCurrency.id;
      }
    } else if (filters?.assetCurrencyId) {
      repoFilters.assetCurrencyId = filters.assetCurrencyId;
    }

    if (filters?.fiatCode) {
      const fiatCurrency = await this.fiatCurrencyRepository.getFiatCurrencyByCode(filters.fiatCode.toUpperCase());
      if (fiatCurrency) {
        repoFilters.fiatCurrencyId = fiatCurrency.id;
      }
    } else if (filters?.fiatCurrencyId) {
      repoFilters.fiatCurrencyId = filters.fiatCurrencyId;
    }

    if (filters?.transactionTypeCode) {
      const transactionType = await this.transactionTypeRepository.getTransactionTypeByCode(filters.transactionTypeCode);
      if (transactionType) {
        repoFilters.transactionTypeId = transactionType.id;
      }
    }

    const tenantFees = await this.tenantFeeRepository.findByTenantWithFilters(
      tenantId,
      repoFilters
    );

    const responses = await Promise.all(
      tenantFees.map(tf => this.mapTenantFeeToResponse(tf))
    );

    return responses;
  }

  async upsertPercentageCommission(
    tenantId: string,
    data: UpsertCommissionRequest
  ): Promise<CommissionResponse> {
    const transactionTypeCode = data.transaction_type.toLowerCase();
    const fiatCurrencyId = 1;

    const transactionType = await this.transactionTypeRepository.getTransactionTypeByCode(transactionTypeCode);
    if (!transactionType) {
      throw new Error(`Transaction type not found for code: ${transactionTypeCode}`);
    }

    const cryptoCurrency = await this.cryptoCurrencyRepository.getCryptoCurrencyByCode(data.asset.toUpperCase());
    if (!cryptoCurrency) {
      throw new Error(`Crypto currency not found for code: ${data.asset}`);
    }

    const tenantFee = await this.tenantFeeRepository.upsertTenantFee(
      tenantId,
      transactionType.id,
      cryptoCurrency.id,
      fiatCurrencyId,
      data.amount,
      'PERCENTAGE'
    );

    return await this.mapTenantFeeToResponse(tenantFee);
  }

  async upsertFixedCommission(
    tenantId: string,
    data: UpsertCommissionRequest
  ): Promise<CommissionResponse> {
    const transactionTypeCode = data.transaction_type.toLowerCase();
    const fiatCurrencyId = 1;

    const transactionType = await this.transactionTypeRepository.getTransactionTypeByCode(transactionTypeCode);
    if (!transactionType) {
      throw new Error(`Transaction type not found for code: ${transactionTypeCode}`);
    }

    const cryptoCurrency = await this.cryptoCurrencyRepository.getCryptoCurrencyByCode(data.asset.toUpperCase());
    if (!cryptoCurrency) {
      throw new Error(`Crypto currency not found for code: ${data.asset}`);
    }

    const tenantFee = await this.tenantFeeRepository.upsertTenantFee(
      tenantId,
      transactionType.id,
      cryptoCurrency.id,
      fiatCurrencyId,
      data.amount,
      'FIXED'
    );

    return await this.mapTenantFeeToResponse(tenantFee);
  }
}
