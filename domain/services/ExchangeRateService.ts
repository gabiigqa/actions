import { CalculatedExchangeRateResponse, ExchangeRate } from '@/domain/interfaces/domain/entities/ExchangeRate';
import { IExchangeRateService } from '@/domain/interfaces/domain/services/IExchangeRateService';
import { IFeeService } from '@/domain/interfaces/domain/services/IFeeService';
import { ITenantFeeService } from '@/domain/interfaces/domain/services/ITenantFeeService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { ICryptoCurrencyRepository } from '@/domain/interfaces/infrastructure/repositories/ICryptoCurrencyRepository';
import { IExchangeRateRepository } from '@/domain/interfaces/infrastructure/repositories/IExchangeRateRepository';
import { IFiatCurrencyRepository } from '@/domain/interfaces/infrastructure/repositories/IFiatCurrencyRepository';
import { ITransactionTypeRepository } from '@/domain/interfaces/infrastructure/repositories/ITransactionTypeRepository';
import { ExchangeRateResponse } from '@/domain/interfaces/infrastructure/controllers/responses/quotes/ExchangeRateResponse';
import { CurrentQuotesResponse, CurrentQuoteItem } from '@/domain/interfaces/infrastructure/controllers/responses/quotes/CurrentQuotesResponse';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class ExchangeRateService implements IExchangeRateService {
    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.IExchangeRateRepository) private exchangeRateRepository: IExchangeRateRepository,
        @inject(TYPES.ITransactionTypeRepository) private transactionTypeRepository: ITransactionTypeRepository,
        @inject(TYPES.ICryptoCurrencyRepository) private cryptoCurrencyRepository: ICryptoCurrencyRepository,
        @inject(TYPES.IFiatCurrencyRepository) private fiatCurrencyRepository: IFiatCurrencyRepository,
        @inject(TYPES.IFeeService) private feeService: IFeeService,
        @inject(TYPES.ITenantFeeService) private tenantFeeService: ITenantFeeService,
    ) { }

    async getExchangeRateByCompositeKeyCodes(transactionTypeCode: string, cryptoCurrencyCode: string, fiatCurrencyCode: string): Promise<ExchangeRate | null> {
        try {
            let transactionType = await this.transactionTypeRepository.getTransactionTypeByCode(transactionTypeCode);
            if (!transactionType) {
                this.loggerService.error(`Transaction type not found for code: ${transactionTypeCode}`);
                throw new Error(`Transaction type not found for code: ${transactionTypeCode}`);
            }

            let cryptoCurrency = await this.cryptoCurrencyRepository.getCryptoCurrencyByCode(cryptoCurrencyCode);
            if (!cryptoCurrency) {
                this.loggerService.error(`Crypto currency not found for code: ${cryptoCurrencyCode}`);
                throw new Error(`Crypto currency not found for code: ${cryptoCurrencyCode}`);
            }

            let fiatCurrency = await this.fiatCurrencyRepository.getFiatCurrencyByCode(fiatCurrencyCode);
            if (!fiatCurrency) {
                this.loggerService.error(`Fiat currency not found for code: ${fiatCurrencyCode}`);
                throw new Error(`Fiat currency not found for code: ${fiatCurrencyCode}`);
            }

            let resultado = await this.exchangeRateRepository.getExchangeRateByCompositeKey(transactionType.id, cryptoCurrency.id, fiatCurrency.id);
            return resultado;
        } catch (error: Error | any) {
            this.loggerService.error(`Error getting exchange rate by composite key transaction_type_code: ${transactionTypeCode}, asset_currency_code: ${cryptoCurrencyCode}, fiat_currency_code: ${fiatCurrencyCode}`, error);
            return null;
        }
    }

    async getExchangeRateByCompositeKey(transactionTypeId: number, cryptoCurrencyId: number, fiatCurrencyId: number): Promise<ExchangeRate | null> {
        try {
            let transactionType = await this.transactionTypeRepository.getTransactionTypeById(transactionTypeId);
            if (!transactionType) {
                this.loggerService.error(`Transaction type not found for id: ${transactionTypeId}`);
                throw new Error(`Transaction type not found for id: ${transactionTypeId}`);
            }

            let cryptoCurrency = await this.cryptoCurrencyRepository.getCryptoCurrencyById(cryptoCurrencyId);
            if (!cryptoCurrency) {
                this.loggerService.error(`Crypto currency not found for id: ${cryptoCurrencyId}`);
                throw new Error(`Crypto currency not found for id: ${cryptoCurrencyId}`);
            }

            let fiatCurrency = await this.fiatCurrencyRepository.getFiatCurrencyById(fiatCurrencyId);
            if (!fiatCurrency) {
                this.loggerService.error(`Fiat currency not found for id: ${fiatCurrencyId}`);
                throw new Error(`Fiat currency not found for id: ${fiatCurrencyId}`);
            }

            let resultado = await this.exchangeRateRepository.getExchangeRateByCompositeKey(transactionType.id, cryptoCurrency.id, fiatCurrency.id);
            return resultado;
        } catch (error: Error | any) {
            this.loggerService.error(`Error getting exchange rate by composite key transaction_type_id: ${transactionTypeId}, asset_currency_id: ${cryptoCurrencyId}, fiat_currency_id: ${fiatCurrencyId}`, error);
            return null;
        }
    }

    async calculateExchangeAmount(transactionTypeCode: string, cryptoCurrencyCode: string, fiatCurrencyCode: string, amount: number, direction: 'asset' | 'fiat'): Promise<CalculatedExchangeRateResponse | null> {
        try {
            let exchangeRate = await this.getExchangeRateByCompositeKeyCodes(transactionTypeCode, cryptoCurrencyCode, fiatCurrencyCode);
            if (!exchangeRate) {
                this.loggerService.error(`Exchange rate not found for transaction_type_code: ${transactionTypeCode}, asset_currency_code: ${cryptoCurrencyCode}, fiat_currency_code: ${fiatCurrencyCode}`);
                throw new Error(`Exchange rate not found for transaction_type_code: ${transactionTypeCode}, asset_currency_code: ${cryptoCurrencyCode}, fiat_currency_code: ${fiatCurrencyCode}`);
            }
            let exchangedAmount = direction === 'asset' ? amount * exchangeRate.rate : amount / exchangeRate.rate;
            return {
                transaction_type_id: exchangeRate.transaction_type_id,
                transaction_type_code: exchangeRate.transaction_type_code,
                asset_currency_id: exchangeRate.asset_currency_id,
                asset_currency_code: exchangeRate.asset_currency_code,
                fiat_currency_id: exchangeRate.fiat_currency_id,
                fiat_currency_code: exchangeRate.fiat_currency_code,
                fiat_amount: direction === 'fiat' ? amount : exchangedAmount,
                asset_amount: direction === 'asset' ? amount : exchangedAmount,
                rate: exchangeRate.rate
            };
        } catch (error: Error | any) {
            this.loggerService.error(`Error calculating exchange amount for transaction_type_code: ${transactionTypeCode}, asset_currency_code: ${cryptoCurrencyCode}, fiat_currency_code: ${fiatCurrencyCode}, amount: ${amount}`, error);
            return null;
        }
    }

    async getExchangeRateById(id: number): Promise<ExchangeRate | null> {
        return await this.exchangeRateRepository.getExchangeRateById(id.toString());
    }

    async getAllExchangeRates(): Promise<ExchangeRate[]> {
        return await this.exchangeRateRepository.getAllExchangeRates();
    }

    async getWithdrawalExchangeRate(
        cryptoCurrencyCode: string,
        fiatCurrencyCode: string,
        businessId: string
    ): Promise<ExchangeRateResponse | null> {
        return this.getExchangeRateByTransactionType(
            cryptoCurrencyCode,
            fiatCurrencyCode,
            'withdrawal',
            businessId
        );
    }

    async getExchangeRateByTransactionType(
        cryptoCurrencyCode: string,
        fiatCurrencyCode: string,
        transactionTypeCode: string,
        businessId: string
    ): Promise<ExchangeRateResponse | null> {
        try {
            this.loggerService.info(`Getting ${transactionTypeCode} exchange rate for ${cryptoCurrencyCode}/${fiatCurrencyCode} for business ${businessId}`);

            const exchangeRate = await this.getExchangeRateByCompositeKeyCodes(
                transactionTypeCode,
                cryptoCurrencyCode,
                fiatCurrencyCode
            );

            if (!exchangeRate) {
                this.loggerService.error(`Exchange rate not found for ${transactionTypeCode} ${cryptoCurrencyCode}/${fiatCurrencyCode}`);
                return null;
            }

            const cryptoCurrency = await this.cryptoCurrencyRepository.getCryptoCurrencyByCode(cryptoCurrencyCode);
            if (!cryptoCurrency) {
                this.loggerService.error(`Crypto currency not found for code: ${cryptoCurrencyCode}`);
                return null;
            }

            const fiatCurrency = await this.fiatCurrencyRepository.getFiatCurrencyByCode(fiatCurrencyCode);
            if (!fiatCurrency) {
                this.loggerService.error(`Fiat currency not found for code: ${fiatCurrencyCode}`);
                return null;
            }

            const mesaDePagosFee = await this.feeService.getFeeByBusinessAndTransactionType(
                businessId,
                exchangeRate.transaction_type_id,
                cryptoCurrency.id,
                fiatCurrency.id
            );

            let serviceRate = exchangeRate.rate;
            let percentageFee = 0;
            let fixedFee = 0;

            if (mesaDePagosFee) {
                this.loggerService.info(`Mesa de Pagos fee found for business ${businessId}: ${mesaDePagosFee.fee_amount} (fee_type: ${mesaDePagosFee.fee_type})`);

                if (mesaDePagosFee.fee_type === 2) {  // PERCENTAGE
                    percentageFee = mesaDePagosFee.fee_amount;
                } else if (mesaDePagosFee.fee_type === 1 || mesaDePagosFee.fee_type === 3) {  // FIXED or FIXEDUNIT
                    fixedFee = mesaDePagosFee.fee_amount;
                }
            } else {
                this.loggerService.info(`No Mesa de Pagos fee found for business ${businessId}, using base rate`);
            }

            // Primero aplicar comisión porcentual, luego sumar la fija
            if (percentageFee > 0) {
                serviceRate = exchangeRate.rate * (1 + percentageFee / 100);
            }
            if (fixedFee > 0) {
                serviceRate = serviceRate + fixedFee;
            }

            const tenantFee = await this.tenantFeeService.getTenantFeeByTenantAndTransactionType(
                businessId,
                exchangeRate.transaction_type_id,
                cryptoCurrency.id,
                fiatCurrency.id
            );

            let partnerRate = serviceRate;
            if (tenantFee && tenantFee.fee_type === 2) {  // PERCENTAGE
                this.loggerService.info(`Tenant fee found for business ${businessId}: ${tenantFee.fee_amount}% (type: PERCENTAGE)`);
                partnerRate = serviceRate * (1 + tenantFee.fee_amount / 100);
            } else {
                this.loggerService.info(`No percentage tenant fee found for business ${businessId}, using service rate`);
            }

            return {
                pair: cryptoCurrencyCode,
                fiatCurrency: fiatCurrencyCode,
                serviceExchangeRate: serviceRate,
                partnerExchangeRate: partnerRate,
                timestamp: new Date().toISOString()
            };
        } catch (error: Error | any) {
            this.loggerService.error(`Error getting ${transactionTypeCode} exchange rate for ${cryptoCurrencyCode}/${fiatCurrencyCode}`, error);
            return null;
        }
    }
    async getCurrentExchangeRates(
        fiatCurrencyCode: string,
        businessId: string
    ): Promise<CurrentQuotesResponse> {
        const fiat = fiatCurrencyCode.toUpperCase();
        const supportedPairs = ['USDC', 'USDT']; 

        const quotes: CurrentQuoteItem[] = [];

        for (const pair of supportedPairs) {
            try {
                this.loggerService.info(`Getting current quote for ${pair}/${fiat} for business ${businessId}`);

                const exchangeRate = await this.getExchangeRateByCompositeKeyCodes(
                    'withdrawal',
                    pair,
                    fiat
                );

                if (!exchangeRate) {
                    this.loggerService.warn(`Base exchange rate not found for withdrawal ${pair}/${fiat}`);
                    continue;
                }

                const baseRate = exchangeRate.rate; 

                const cryptoCurrency = await this.cryptoCurrencyRepository.getCryptoCurrencyByCode(pair);
                if (!cryptoCurrency) {
                    this.loggerService.error(`Crypto currency not found for code: ${pair}`);
                    continue;
                }

                const fiatCurrency = await this.fiatCurrencyRepository.getFiatCurrencyByCode(fiat);
                if (!fiatCurrency) {
                    this.loggerService.error(`Fiat currency not found for code: ${fiat}`);
                    continue;
                }

                const mesaDePagosFee = await this.feeService.getFeeByBusinessAndTransactionType(
                    businessId,
                    exchangeRate.transaction_type_id,
                    cryptoCurrency.id,
                    fiatCurrency.id
                );

                let serviceRate = baseRate;

                if (mesaDePagosFee) {
                    this.loggerService.info(
                        `Mesa de Pagos fee found for business ${businessId}: ${mesaDePagosFee.fee_amount} (fee_type: ${mesaDePagosFee.fee_type})`
                    );

                    if (mesaDePagosFee.fee_type === 2) {  // PERCENTAGE
                        serviceRate = baseRate * (1 + mesaDePagosFee.fee_amount / 100);
                    } else if (mesaDePagosFee.fee_type === 1 || mesaDePagosFee.fee_type === 3) {  // FIXED or FIXEDUNIT
                        serviceRate = baseRate + mesaDePagosFee.fee_amount;
                    }
                } else {
                    this.loggerService.info(
                        `No Mesa de Pagos fee found for business ${businessId}, using base rate`
                    );
                }

                const tenantFee = await this.tenantFeeService.getTenantFeeByTenantAndTransactionType(
                    businessId,
                    exchangeRate.transaction_type_id,
                    cryptoCurrency.id,
                    fiatCurrency.id
                );

                let partnerRate = serviceRate;

                if (tenantFee && tenantFee.fee_type === 2) {  // PERCENTAGE
                    this.loggerService.info(
                        `Tenant fee found for business ${businessId}: ${tenantFee.fee_amount}% (type: PERCENTAGE)`
                    );
                    partnerRate = serviceRate * (1 + tenantFee.fee_amount / 100);
                } else {
                    this.loggerService.info(
                        `No percentage tenant fee found for business ${businessId}, using service rate`
                    );
                }

                const totalExternalFeeBOB = partnerRate - serviceRate;

                const totalExternalFeeAsset =
                    partnerRate > 0 ? totalExternalFeeBOB / partnerRate : 0;

                const quote: CurrentQuoteItem = {
                    pair,
                    serviceExchangeRate: serviceRate,
                    partnerExchangeRate: partnerRate,
                    totalExternalFeeBOB,
                    totalExternalFeeAsset
                };

                quotes.push(quote);
            } catch (err) {
                this.loggerService.error(
                    `Error building current quote for ${pair}/${fiat} for business ${businessId}`,
                    err
                );
                continue;
            }
        }
        return {
            fiatCurrency: fiat,
            quotes,
            timestamp: new Date().toISOString()
        };
    }
}