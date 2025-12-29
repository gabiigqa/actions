import { ExchangeRate } from "@/domain/interfaces/domain/entities/ExchangeRate";
import { CreateExternalIntegrationData } from "@/domain/interfaces/domain/entities/ExternalIntegrations";
import { Fee } from "@/domain/interfaces/domain/entities/Fee";
import { CreateTransactionData, TransactionCallbackResponse } from "@/domain/interfaces/domain/entities/Transaction";
import { IAssetService } from "@/domain/interfaces/domain/services/IAssetService";
import { IATCRedEnlaceService } from "@/domain/interfaces/domain/services/IATCRedEnlaceService";
import { IBusinessService } from "@/domain/interfaces/domain/services/IBusinessService";
import { IClientService } from "@/domain/interfaces/domain/services/IClientService";
import { ICountryService } from "@/domain/interfaces/domain/services/ICountryService";
import { ICurrencyService } from "@/domain/interfaces/domain/services/ICurrencyService";
import { IExchangeRateService } from "@/domain/interfaces/domain/services/IExchangeRateService";
import { IFeeService } from "@/domain/interfaces/domain/services/IFeeService";
import { IPartnerService } from "@/domain/interfaces/domain/services/IPartnerService";
import { DepositExpressTransactionRequest, DepositExpressTransactionResponse, DepositExternalExpressTransactionRequest, DepositExternalExpressTransactionResponse, DepositWalletTransactionRequest, DepositWalletTransactionResponse, ExchangeTransactionData, ITransactionService, SendFiatWalletTransactionRequest, SendFiatWalletTransactionResponse, SendTransactionRequest, SendTransactionResponse } from "@/domain/interfaces/domain/services/ITransacctionService";
import { ITransactionStatusService } from "@/domain/interfaces/domain/services/ITransactionStatusService";
import { ITransactionTypeService } from "@/domain/interfaces/domain/services/ITransactionTypeService";
import { IUserService } from "@/domain/interfaces/domain/services/IUserService";
import { IWalletService } from "@/domain/interfaces/domain/services/IWalletService";
import { GetTransactionStatusResponse } from "@/domain/interfaces/infrastructure/controllers/responses/transactions/get.transaction.status";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IAccountRepository } from "@/domain/interfaces/infrastructure/repositories/IAccountRepository";
import { ITransactionRepository } from "@/domain/interfaces/infrastructure/repositories/ITransactionRepository";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify/types";
import { GenerarQRRequest } from "@/infrastructure/third-party/atc-red-enlace/entitites/generar.qr.request";
import { FakePartnerConnector } from "@/infrastructure/third-party/fake-partner/fake.partner";
import { randomInt } from "crypto";
import { inject, injectable } from "inversify";
import uuid4 from "uuid4";

@injectable()
export class TransactionService implements ITransactionService {

    constructor(
        @inject(TYPES.AppConfig) private appConfig: AppConfig,
        @inject(TYPES.IClientService) private clientService: IClientService,
        @inject(TYPES.IUserService) private userService: IUserService,
        @inject(TYPES.IAccountService) private accountService: IAccountRepository,
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.ITransactionTypeService) private transactionTypeService: ITransactionTypeService,
        @inject(TYPES.ITransactionStatusService) private transactionStatusService: ITransactionStatusService,
        @inject(TYPES.IWalletService) private walletService: IWalletService,
        @inject(TYPES.ICountryService) private countryService: ICountryService,
        @inject(TYPES.IAssetService) private assetService: IAssetService,
        @inject(TYPES.ICurrencyService) private currencyService: ICurrencyService,
        @inject(TYPES.IExchangeRateService) private exchangeRateService: IExchangeRateService,
        @inject(TYPES.IFeeService) private feeService: IFeeService,
        @inject(TYPES.IPartnerService) private partnerService: IPartnerService,
        @inject(TYPES.ITransactionRepository) private transactionRepository: ITransactionRepository,
        @inject(TYPES.IATCRedEnlaceService) private atcRedEnlaceService: IATCRedEnlaceService,
        @inject(TYPES.FakePartnerConnector) private fakePartnerConnector: FakePartnerConnector,
        @inject(TYPES.IBusinessService) private businessService: IBusinessService
    ) { }

    async createDepositTransaction(data: SendTransactionRequest): Promise<SendTransactionResponse | null> {
        try {
            let clientfrom = await this.clientService.getClientByUserId(data.fromId);
            let userfrom = await this.userService.getUserById(data.fromId);
            let clientto = await this.clientService.getClientById(data.toId);

            if (!clientfrom || !clientto) {
                this.loggerService.error('Client not found');
                return null;
            }
            if (!userfrom) {
                this.loggerService.error('User not found');
                return null;
            }

            // Here you would typically interact with the account repository to create the transaction

            // For this example, we'll just simulate a successful transaction creation
            let transaction: SendTransactionResponse = {
                id: uuid4(),
                amount: data.amount,
                fromId: data.fromId,
                toId: data.toId,
                type: 'deposit',
                status: 'created',
                idempotencyKey: data.idempotencyKey
            };

            // Simulate async completion after X seconds
            await new Promise(resolve => setTimeout(resolve, randomInt(500, 10000)));

            return Promise.resolve(transaction);
        } catch (error) {
            this.loggerService.error('Error creating transaction', error);
            return Promise.resolve(null);
        }
    }
    async createWithdrawalTransaction(data: SendTransactionRequest): Promise<SendTransactionResponse | null> {
        try {
            let clientfrom = await this.clientService.getClientById(data.fromId);
            let clientto = await this.clientService.getClientByUserId(data.toId);
            let userfrom = await this.userService.getUserById(data.toId);

            if (!clientfrom || !clientto) {
                this.loggerService.error('Client not found');
                return null;
            }
            if (!userfrom) {
                this.loggerService.error('User not found');
                return null;
            }

            // Here you would typically interact with the account repository to create the transaction

            // For this example, we'll just simulate a successful transaction creation
            let transaction: SendTransactionResponse = {
                id: uuid4(),
                amount: data.amount,
                fromId: data.fromId,
                toId: data.toId,
                type: 'withdrawal',
                status: 'created',
                idempotencyKey: data.idempotencyKey
            };

            // Simulate async completion after X seconds
            await new Promise(resolve => setTimeout(resolve, randomInt(500, 10000)));

            return Promise.resolve(transaction);
        } catch (error) {
            this.loggerService.error('Error creating transaction', error);
            return Promise.resolve(null);
        }
    }

    async createExpressDepositTransaction(data: DepositExpressTransactionRequest): Promise<DepositExpressTransactionResponse | null> {
        try {
            const transactionType = await this.transactionTypeService.getTransactionTypeByCode('deposit_express');
            const transactionStatus = await this.transactionStatusService.getTransactionStatusByCode('created_transaction_express_deposit');
            const country = await this.countryService.getCountryByIsoAlpha2(data.country);

            if (!country) {
                this.loggerService.error('Country not found', { country: data.country });
                throw new Error('Country not found');
            }
            if (!transactionType) {
                this.loggerService.error('Transaction type not found for express_deposit');
                throw new Error('Transaction type not found');
            }
            if (!transactionStatus) {
                this.loggerService.error('Transaction status not found for created_transaction_express_deposit');
                throw new Error('Transaction status not found');
            }

            let partners = await this.partnerService.getPartnersByCountry(country.code_iso_alpha_2);
            const asset = await this.assetService.getAssetByCode(data.asset);
            const fiatCurrency = await this.currencyService.getCurrencyByCode(data.fiatCurrency);

            if (!asset) {
                this.loggerService.error('Asset not found', { asset: data.asset });
                throw new Error('Asset not found');
            }

            if (!fiatCurrency) {
                this.loggerService.error('Fiat currency not found', { fiatCurrency: data.fiatCurrency });
                throw new Error('Fiat currency not found');
            }

            let partnerFound = null;

            for (const partner of partners) {
                const partnerEnabledFiatCurrency = await this.partnerService.getPartnerEnabledFiatCurrencyById(partner.id, country.code, fiatCurrency.id);

                if (partnerEnabledFiatCurrency) {
                    partnerFound = partner;
                    break;
                }
            }

            if (!partnerFound) {
                this.loggerService.error('No partner found supporting the requested fiat currency in the specified country', { country: data.country, fiatCurrency: data.fiatCurrency });
                throw new Error('No partner found for the requested fiat currency in the specified country');
            }

            const exchangeRate = await this.exchangeRateService.getExchangeRateByCompositeKey(transactionType.id, asset.id, fiatCurrency.id);

            const fee = await this.feeService.getFeeByTransactionTypeAndCurrencies(transactionType.id, asset.id, fiatCurrency.id);

            if (!exchangeRate) {
                this.loggerService.error('Exchange rate not found', { transactionTypeId: transactionType.id, assetId: asset.id, fiatCurrencyId: fiatCurrency.id });
                throw new Error('Exchange rate not found');
            }

            if (!fee) {
                this.loggerService.error('Fee not found', { transactionTypeId: transactionType.id, assetId: asset.id, fiatCurrencyId: fiatCurrency.id });
                throw new Error('Fee not found');
            }

            let calculatedFiatAmount = this.calculateFiatAmount(exchangeRate, {
                amount: data.cryptoAmount,
                asset: data.asset,
                fiatCurrency: data.fiatCurrency
            }, fee);

            let calculatedFiatFeeAmount = this.calculateFiatFeeAmount(exchangeRate, {
                amount: data.cryptoAmount,
                asset: data.asset,
                fiatCurrency: data.fiatCurrency
            }, fee);

            const client = await this.clientService.getClientById(data.clientId);
            const account = await this.accountService.getAccountById(data.accountId);
            const wallet = await this.walletService.getWalletById(data.walletId);

            if (!client) {
                this.loggerService.error('Client not found', { clientId: data.clientId });
                throw new Error('Client not found');
            }
            if (!account) {
                this.loggerService.error('Account not found', { accountId: data.accountId });
                throw new Error('Account not found');
            }
            if (!wallet) {
                this.loggerService.error('Wallet not found', { walletId: data.walletId });
                throw new Error('Wallet not found');
            }

            let transactionData: CreateTransactionData = {
                businessId: client.business_id,
                clientId: client.id,
                accountId: account.id,
                walletId: wallet.id,
                transactionType: transactionType.id,
                transactionStatus: transactionStatus.id,
                externalReference: data.referenceId,
                details: {
                    amount: data.cryptoAmount,
                    assetCurrencyId: asset.id,
                    fiatCurrencyId: fiatCurrency.id,
                    exchangeRate: exchangeRate.rate,
                    fees: calculatedFiatFeeAmount,
                    fiatAmount: 0, // Deprecated field
                    assetAmount: data.cryptoAmount,
                    totalFiatAmount: calculatedFiatAmount,
                    totalAssetAmount: data.cryptoAmount,
                    status: 'E'
                }
            }
            let transaction = await this.transactionRepository.insertTransaction(transactionData);

            if (!transaction) {
                this.loggerService.error('Failed to create transaction record for express deposit');
                throw new Error('Failed to create transaction record');
            }

            this.loggerService.info(`Express deposit transaction created successfully with ID: ${transaction.id} for client: ${client.id}`);

            const numeroReferencia = await this.partnerService.countPartnerTransactions(partnerFound.id) + 1;

            let cod_sucursal = this.appConfig.getAtcCodSucursal();
            let nom_sucursal = this.appConfig.getAtcNomSucursal();
            let rubro_comercio = this.appConfig.getAtcRubroComercio();
            let qr_expiry = this.appConfig.getAtcQrExpiry();

            let glosa = `${cod_sucursal}|${nom_sucursal}|${rubro_comercio}|${transaction.id}`;

            let generarQRRequest: GenerarQRRequest = {
                numeroReferencia: numeroReferencia,
                monto: parseFloat(calculatedFiatAmount.toFixed(2)),
                moneda: fiatCurrency.code,
                canal: 'WEB',
                glosa: glosa,
                tiempoQr: qr_expiry,
                campoExtra: transaction.id
            }

            const qrResponse = await this.atcRedEnlaceService.generateQR(generarQRRequest);

            let createExternalIntegrationData: CreateExternalIntegrationData = {
                partnerId: partnerFound.id,
                transactionId: transaction.id,
                internalReference: numeroReferencia.toString(),
                partnerReference: qrResponse.numeroReferencia,
                responseCode: qrResponse.codigoRespuesta,
                responseMessage: qrResponse.detalleRespuesta,
                details: {
                    createQRResponse: qrResponse
                },
                status: 'E'
            }

            let externalIntegration = await this.partnerService.insertExternalIntegration(createExternalIntegrationData);

            if (!externalIntegration) {
                this.loggerService.error('Failed to create external integration record for express deposit transaction', { transactionId: transaction.id });
                throw new Error('Failed to create external integration record');
            }

            let updateTransactionStatus = await this.transactionRepository.updateTransactionStatus(transaction.id, 1);

            if (!updateTransactionStatus) {
                this.loggerService.error('Failed to update transaction status to pending for express deposit transaction', { transactionId: transaction.id });
                throw new Error('Failed to update transaction status');
            }

            this.loggerService.info(`External integration record created successfully with ID: ${externalIntegration.id} for transaction: ${transaction.id}`);

            let result: DepositExpressTransactionResponse = {
                transactionId: transaction.id,
                type: transactionType.code,
                status: transactionStatus.code,
                clientId: client.id,
                accountId: account.id,
                walletId: wallet.id,
                referenceId: transaction.externalReference,
                country: country.code_iso_alpha_2,
                countryName: country.name,
                requestedCryptoAmount: (transaction.details ? transaction.details.assetAmount : 0).toFixed(8),
                asset: asset.code,
                calculatedFiatAmount: calculatedFiatAmount.toFixed(2),
                fiatCurrency: fiatCurrency.code,
                exchangeRate: exchangeRate.rate.toString() || 'N/A',
                qrCodeBase64: qrResponse.imagen
            };
            return result;
        } catch (error) {
            this.loggerService.error('Error creating express deposit transaction', error);
            return null;
        }
    }

    async createExternalExpressDepositTransaction(data: DepositExternalExpressTransactionRequest): Promise<DepositExternalExpressTransactionResponse | null> {
        try {
            const business = await this.businessService.getBusinessByEmail(data.email);
            if (!business) {
                this.loggerService.error('Business not found', { email: data.email });
                throw new Error('Business not found');
            }
            data.businessId = business.id;
            const transactionType = await this.transactionTypeService.getTransactionTypeByCode('deposit_express');
            const transactionStatus = await this.transactionStatusService.getTransactionStatusByCode('created_transaction_express_deposit');
            const country = await this.countryService.getCountryByIsoAlpha2(data.country);

            if (!country) {
                this.loggerService.error('Country not found', { country: data.country });
                throw new Error('Country not found');
            }
            if (!transactionType) {
                this.loggerService.error('Transaction type not found for express_deposit');
                throw new Error('Transaction type not found');
            }
            if (!transactionStatus) {
                this.loggerService.error('Transaction status not found for created_transaction_express_deposit');
                throw new Error('Transaction status not found');
            }

            let partners = await this.partnerService.getPartnersByCountry(country.code_iso_alpha_2);
            const asset = await this.assetService.getAssetByCode(data.asset);
            const fiatCurrency = await this.currencyService.getCurrencyByCode(data.fiatCurrency);

            if (!asset) {
                this.loggerService.error('Asset not found', { asset: data.asset });
                throw new Error('Asset not found');
            }

            if (!fiatCurrency) {
                this.loggerService.error('Fiat currency not found', { fiatCurrency: data.fiatCurrency });
                throw new Error('Fiat currency not found');
            }

            let partnerFound = null;

            for (const partner of partners) {
                const partnerEnabledFiatCurrency = await this.partnerService.getPartnerEnabledFiatCurrencyById(partner.id, country.code, fiatCurrency.id);

                if (partnerEnabledFiatCurrency) {
                    partnerFound = partner;
                    break;
                }
            }

            if (!partnerFound) {
                this.loggerService.error('No partner found supporting the requested fiat currency in the specified country', { country: data.country, fiatCurrency: data.fiatCurrency });
                throw new Error('No partner found for the requested fiat currency in the specified country');
            }

            const exchangeRate = await this.exchangeRateService.getExchangeRateByCompositeKey(transactionType.id, asset.id, fiatCurrency.id);

            const fee = await this.feeService.getFeeByTransactionTypeAndCurrencies(transactionType.id, asset.id, fiatCurrency.id);

            if (!exchangeRate) {
                this.loggerService.error('Exchange rate not found', { transactionTypeId: transactionType.id, assetId: asset.id, fiatCurrencyId: fiatCurrency.id });
                throw new Error('Exchange rate not found');
            }

            if (!fee) {
                this.loggerService.error('Fee not found', { transactionTypeId: transactionType.id, assetId: asset.id, fiatCurrencyId: fiatCurrency.id });
                throw new Error('Fee not found');
            }

            let calculatedFiatAmount = this.calculateFiatAmount(exchangeRate, {
                amount: data.cryptoAmount,
                asset: data.asset,
                fiatCurrency: data.fiatCurrency
            }, fee);

            let calculatedFiatFeeAmount = this.calculateFiatFeeAmount(exchangeRate, {
                amount: data.cryptoAmount,
                asset: data.asset,
                fiatCurrency: data.fiatCurrency
            }, fee);

            let transactionData: CreateTransactionData = {
                businessId: business.id,
                transactionType: transactionType.id,
                transactionStatus: transactionStatus.id,
                externalReference: data.referenceId,
                details: {
                    amount: data.cryptoAmount,
                    assetCurrencyId: asset.id,
                    fiatCurrencyId: fiatCurrency.id,
                    exchangeRate: exchangeRate.rate,
                    fees: calculatedFiatFeeAmount,
                    fiatAmount: 0, // Deprecated field
                    assetAmount: data.cryptoAmount,
                    totalFiatAmount: calculatedFiatAmount,
                    totalAssetAmount: data.cryptoAmount,
                    status: 'E'
                }
            }
            let transaction = await this.transactionRepository.insertTransaction(transactionData);

            if (!transaction) {
                this.loggerService.error('Failed to create transaction record for express deposit');
                throw new Error('Failed to create transaction record');
            }

            this.loggerService.info(`Express deposit transaction created successfully with ID: ${transaction.id} for external client with reference ID: ${data.referenceId}`);

            const numeroReferencia = await this.partnerService.countPartnerTransactions(partnerFound.id) + 1;

            let cod_sucursal = this.appConfig.getAtcCodSucursal();
            let nom_sucursal = this.appConfig.getAtcNomSucursal();
            let rubro_comercio = this.appConfig.getAtcRubroComercio();
            let qr_expiry = this.appConfig.getAtcQrExpiry();

            let glosa = `${cod_sucursal}|${nom_sucursal}|${rubro_comercio}|${transaction.id}`;

            let generarQRRequest: GenerarQRRequest = {
                numeroReferencia: numeroReferencia,
                monto: parseFloat(calculatedFiatAmount.toFixed(2)),
                moneda: fiatCurrency.code,
                canal: 'WEB',
                glosa: glosa,
                tiempoQr: qr_expiry,
                campoExtra: transaction.id
            }

            const qrResponse = await this.atcRedEnlaceService.generateQR(generarQRRequest);

            let createExternalIntegrationData: CreateExternalIntegrationData = {
                partnerId: partnerFound.id,
                transactionId: transaction.id,
                internalReference: numeroReferencia.toString(),
                partnerReference: qrResponse.numeroReferencia,
                responseCode: qrResponse.codigoRespuesta,
                responseMessage: qrResponse.detalleRespuesta,
                details: {
                    createQRResponse: qrResponse
                },
                status: 'E'
            }

            let externalIntegration = await this.partnerService.insertExternalIntegration(createExternalIntegrationData);

            if (!externalIntegration) {
                this.loggerService.error('Failed to create external integration record for express deposit transaction', { transactionId: transaction.id });
                throw new Error('Failed to create external integration record');
            }

            this.loggerService.info(`External integration record created successfully with ID: ${externalIntegration.id} for transaction: ${transaction.id}`);

            let result: DepositExternalExpressTransactionResponse = {
                transactionId: transaction.id,
                type: transactionType.code,
                status: transactionStatus.code,
                referenceId: transaction.externalReference,
                country: country.code_iso_alpha_2,
                countryName: country.name,
                requestedCryptoAmount: (transaction.details ? transaction.details.assetAmount : 0).toFixed(8),
                asset: asset.code,
                calculatedFiatAmount: calculatedFiatAmount.toFixed(2),
                fiatCurrency: fiatCurrency.code,
                exchangeRate: exchangeRate.rate.toString() || 'N/A',
                qrCodeBase64: qrResponse.imagen
            };
            return result;
        } catch (error) {
            this.loggerService.error('Error creating express deposit transaction', error);
            return null;
        }
    }

    async createDepositToWalletAssets(data: DepositWalletTransactionRequest): Promise<DepositWalletTransactionResponse | null> {
        try {
            const transactionType = await this.transactionTypeService.getTransactionTypeByCode('deposit');
            const transactionStatus = await this.transactionStatusService.getTransactionStatusByCode('created_transaction_wallet_deposit');
            const country = await this.countryService.getCountryByIsoAlpha2(data.country);

            if (!country) {
                this.loggerService.error('Country not found', { country: data.country });
                throw new Error('Country not found');
            }
            if (!transactionType) {
                this.loggerService.error('Transaction type not found for wallet_deposit');
                throw new Error('Transaction type not found');
            }
            if (!transactionStatus) {
                this.loggerService.error('Transaction status not found for created_transaction_wallet_deposit');
                throw new Error('Transaction status not found');
            }

            let partners = await this.partnerService.getPartnersByCountry(country.code_iso_alpha_2);
            const asset = await this.assetService.getAssetByCode(data.asset);
            const fiatCurrency = await this.currencyService.getCurrencyByCode(data.fiatCurrency);

            if (!asset) {
                this.loggerService.error('Asset not found', { asset: data.asset });
                throw new Error('Asset not found');
            }

            if (!fiatCurrency) {
                this.loggerService.error('Fiat currency not found', { fiatCurrency: data.fiatCurrency });
                throw new Error('Fiat currency not found');
            }

            let partnerFound = null;

            for (const partner of partners) {
                const partnerEnabledFiatCurrency = await this.partnerService.getPartnerEnabledFiatCurrencyById(partner.id, country.code, fiatCurrency.id);

                if (partnerEnabledFiatCurrency) {
                    partnerFound = partner;
                    break;
                }
            }

            if (!partnerFound) {
                this.loggerService.error('No partner found supporting the requested fiat currency in the specified country', { country: data.country, fiatCurrency: data.fiatCurrency });
                throw new Error('No partner found for the requested fiat currency in the specified country');
            }

            const exchangeRate = await this.exchangeRateService.getExchangeRateByCompositeKey(transactionType.id, asset.id, fiatCurrency.id);

            const fee = await this.feeService.getFeeByTransactionTypeAndCurrencies(transactionType.id, asset.id, fiatCurrency.id);

            if (!exchangeRate) {
                this.loggerService.error('Exchange rate not found', { transactionTypeId: transactionType.id, assetId: asset.id, fiatCurrencyId: fiatCurrency.id });
                throw new Error('Exchange rate not found');
            }

            if (!fee) {
                this.loggerService.error('Fee not found', { transactionTypeId: transactionType.id, assetId: asset.id, fiatCurrencyId: fiatCurrency.id });
                throw new Error('Fee not found');
            }

            let calculatedFiatAmount = this.calculateFiatAmount(exchangeRate, {
                amount: data.cryptoAmount,
                asset: data.asset,
                fiatCurrency: data.fiatCurrency
            }, fee);

            let calculatedFiatFeeAmount = this.calculateFiatFeeAmount(exchangeRate, {
                amount: data.cryptoAmount,
                asset: data.asset,
                fiatCurrency: data.fiatCurrency
            }, fee);

            const client = await this.clientService.getClientById(data.clientId);
            const account = await this.accountService.getAccountById(data.accountId);
            const wallet = await this.walletService.getWalletById(data.walletId);

            if (!client) {
                this.loggerService.error('Client not found', { clientId: data.clientId });
                throw new Error('Client not found');
            }
            if (!account) {
                this.loggerService.error('Account not found', { accountId: data.accountId });
                throw new Error('Account not found');
            }
            if (!wallet) {
                this.loggerService.error('Wallet not found', { walletId: data.walletId });
                throw new Error('Wallet not found');
            }

            let transactionData: CreateTransactionData = {
                businessId: client.business_id,
                clientId: client.id,
                accountId: account.id,
                walletId: wallet.id,
                transactionType: transactionType.id,
                transactionStatus: transactionStatus.id,
                externalReference: data.referenceId,
                details: {
                    amount: data.cryptoAmount,
                    assetCurrencyId: asset.id,
                    fiatCurrencyId: fiatCurrency.id,
                    exchangeRate: exchangeRate.rate,
                    fees: calculatedFiatFeeAmount,
                    fiatAmount: 0, // Deprecated field
                    assetAmount: data.cryptoAmount,
                    totalFiatAmount: calculatedFiatAmount,
                    totalAssetAmount: data.cryptoAmount,
                    status: 'E'
                }
            }
            let transaction = await this.transactionRepository.insertTransaction(transactionData);

            if (!transaction) {
                this.loggerService.error('Failed to create transaction record for deposit wallet');
                throw new Error('Failed to create transaction record');
            }

            this.loggerService.info(`Deposit wallet transaction created successfully with ID: ${transaction.id} for client: ${client.id}`);

            const fakePartnerResponse = await this.fakePartnerConnector.createTransaction({
                transactionId: transaction.id,
                cryptoAmount: data.cryptoAmount,
                asset: asset.code,
                fiatCurrency: fiatCurrency.code,
                referenceId: data.referenceId,
                country: country.code_iso_alpha_2,
                clientId: client.id,
                accountId: account.id,
                walletId: wallet.id
            });

            let result: DepositWalletTransactionResponse = {
                transactionId: transaction.id,
                type: transactionType.code,
                status: transactionStatus.code,
                clientId: client.id,
                accountId: account.id,
                walletId: wallet.id,
                referenceId: transaction.externalReference,
                country: country.code_iso_alpha_2,
                countryName: country.name,
                requestedCryptoAmount: (transaction.details ? transaction.details.assetAmount : 0).toFixed(8),
                asset: asset.code,
                calculatedFiatAmount: calculatedFiatAmount.toFixed(2),
                fiatCurrency: fiatCurrency.code,
                exchangeRate: exchangeRate.rate.toString() || 'N/A',
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
                depositInstructions: `Realiza una transferencia bancaria por exactamente ${calculatedFiatAmount.toFixed(2)} ${fiatCurrency.code} a la cuenta de ${country.name} indicada incluyendo el código de referencia '${fakePartnerResponse.bankAccountDetails.reference}'. Una vez confirmado el depósito, enviaremos exactamente ${transaction.details?.assetAmount.toFixed(8)} ${asset.code} a tu wallet especificada.`,
                bankAccountDetails: fakePartnerResponse.bankAccountDetails,
                walletDetails: {
                    walletId: wallet.id,
                    asset: asset.code,
                    network: wallet.network,
                    address: wallet.wallet_address,
                    label: account.name,
                    purpose: ''

                }
            };
            return result;
        } catch (error) {
            this.loggerService.error('Error creating deposit wallet transaction', error);
            return null;
        }
    }

    protected calculateFiatAmount(exchangeRate: ExchangeRate, data: ExchangeTransactionData, fee: Fee | null): number {
        let exchangeRateWithCommission = Number(exchangeRate.rate);
        if(fee && fee.feeTypeCode === 'FIXEDUNIT'){
            exchangeRateWithCommission = Number(exchangeRate.rate) + Number(fee.fee_amount);
            let amountInFiat = data.amount * exchangeRateWithCommission;
            this.loggerService.info(`[COMMISSION CALC] FIXEDUNIT: Exchange rate ${exchangeRate.rate} + fee ${fee.fee_amount} = ${exchangeRateWithCommission}, Amount: ${data.amount} * ${exchangeRateWithCommission} = ${amountInFiat}`);
            return amountInFiat;
        }
        let amountInFiat = data.amount * Number(exchangeRate.rate);
        
        const feeAmount = this.calculateFiatFeeAmount(exchangeRate, data, fee);
        amountInFiat += feeAmount;
        this.loggerService.info(`[COMMISSION CALC] Final fiat amount after fee: ${amountInFiat} (fee added: ${feeAmount})`);
        return amountInFiat;
    }

    protected calculateFiatFeeAmount(exchangeRate: ExchangeRate, data: ExchangeTransactionData, fee: Fee | null): number {
        if (!fee) {
            this.loggerService.info(`[COMMISSION CALC] No fee found, returning 0`);
            return 0;
        }

        this.loggerService.info(`[COMMISSION CALC] Fee type: ${fee.feeTypeCode}, Fee amount: ${fee.fee_amount}, Exchange rate: ${exchangeRate.rate}`);

        let feeAmountInFiat = 0;

        switch (fee.feeTypeCode) {
            case 'PERCENTAGE':
                let amountInFiat = data.amount * Number(exchangeRate.rate);
                feeAmountInFiat = (amountInFiat * Number(fee.fee_amount)) / 100;
                this.loggerService.info(`[COMMISSION CALC] PERCENTAGE: ${fee.fee_amount}% of ${amountInFiat} = ${feeAmountInFiat}`);
                break;
            case 'FIXED':
                feeAmountInFiat = Number(fee.fee_amount);
                this.loggerService.info(`[COMMISSION CALC] FIXED: ${feeAmountInFiat}`);
                break;
            case 'FIXEDUNIT':
                // Para FIXEDUNIT, la comisión es: cantidad * fee_amount
                feeAmountInFiat = data.amount * Number(fee.fee_amount);
                this.loggerService.info(`[COMMISSION CALC] FIXEDUNIT fee only: ${data.amount} * ${fee.fee_amount} = ${feeAmountInFiat}`);
                break;

            default:
                this.loggerService.error('Unsupported fee type for fiat fee amount calculation', { feeType: fee.feeTypeCode });
                throw new Error('Unsupported fee type for fiat fee amount calculation');
        }
        return feeAmountInFiat;
    }

    protected calculateAssetAmount(exchangeRate: ExchangeRate, data: ExchangeTransactionData, fee: Fee | null): number {
        let amountInAsset = data.amount / exchangeRate.rate;
        amountInAsset += this.calculateAssetFeeAmount(exchangeRate, data, fee);
        return amountInAsset;
    }

    protected calculateAssetFeeAmount(exchangeRate: ExchangeRate, data: ExchangeTransactionData, fee: Fee | null): number {
        if (!fee) {
            return 0;
        }
        let feeAmountInAsset = 0;

        switch (fee.feeTypeCode) {
            case 'PERCENTAGE':
                let amountInAsset = data.amount / exchangeRate.rate;
                feeAmountInAsset = (amountInAsset * fee.fee_amount) / 100;
                break;
            case 'FIXED':
                feeAmountInAsset = fee.fee_amount / exchangeRate.rate;
                break;

            default:
                this.loggerService.error('Unsupported fee type for asset fee amount calculation', { feeType: fee.feeTypeCode });
                throw new Error('Unsupported fee type for asset fee amount calculation');
        }
        return feeAmountInAsset;
    }

    async sendFiatWalletTransaction(data: SendFiatWalletTransactionRequest): Promise<SendFiatWalletTransactionResponse | null> {
        try {
            const transactionType = await this.transactionTypeService.getTransactionTypeByCode('withdrawal');
            const transactionStatus = await this.transactionStatusService.getTransactionStatusByCode('created_transaction_wallet_withdrawal');
            const country = await this.countryService.getCountryByIsoAlpha2(data.country);

            if (!country) {
                this.loggerService.error('Country not found', { country: data.country });
                throw new Error('Country not found');
            }
            if (!transactionType) {
                this.loggerService.error('Transaction type not found for wallet_deposit');
                throw new Error('Transaction type not found');
            }
            if (!transactionStatus) {
                this.loggerService.error('Transaction status not found for created_transaction_wallet_deposit');
                throw new Error('Transaction status not found');
            }

            const client = await this.clientService.getClientById(data.clientId);
            const account = await this.accountService.getAccountById(data.accountId);
            const wallet = await this.walletService.getWalletById(data.walletId);

            if (!client) {
                this.loggerService.error('Client not found', { clientId: data.clientId });
                throw new Error('Client not found');
            }
            if (!account) {
                this.loggerService.error('Account not found', { accountId: data.accountId });
                throw new Error('Account not found');
            }
            if (!wallet) {
                this.loggerService.error('Wallet not found', { walletId: data.walletId });
                throw new Error('Wallet not found');
            }

            const asset = await this.assetService.getAssetById(wallet.asset_currency_id);
            const fiatCurrency = await this.currencyService.getCurrencyByCode(data.fiatCurrency);

            if (!asset) {
                this.loggerService.error('Asset not found', { assetId: wallet.asset_currency_id });
                throw new Error('Asset not found');
            }

            if (!fiatCurrency) {
                this.loggerService.error('Fiat currency not found', { fiatCurrency: data.fiatCurrency });
                throw new Error('Fiat currency not found');
            }

            const exchangeRate = await this.exchangeRateService.getExchangeRateByCompositeKey(transactionType.id, asset.id, fiatCurrency.id);

            const fee = await this.feeService.getFeeByTransactionTypeAndCurrencies(transactionType.id, asset.id, fiatCurrency.id);

            if (!exchangeRate) {
                this.loggerService.error('Exchange rate not found', { transactionTypeId: transactionType.id, assetId: asset.id, fiatCurrencyId: fiatCurrency.id });
                throw new Error('Exchange rate not found');
            }

            if (!fee) {
                this.loggerService.error('Fee not found', { transactionTypeId: transactionType.id, assetId: asset.id, fiatCurrencyId: fiatCurrency.id });
                throw new Error('Fee not found');
            }

            let calculatedAssetAmount = this.calculateAssetAmount(exchangeRate, {
                amount: data.fiatAmount,
                asset: asset.code,
                fiatCurrency: data.fiatCurrency
            }, fee);

            let calculatedAssetFeeAmount = this.calculateAssetFeeAmount(exchangeRate, {
                amount: data.fiatAmount,
                asset: asset.code,
                fiatCurrency: data.fiatCurrency
            }, fee);

            let transactionData: CreateTransactionData = {
                businessId: client.business_id,
                clientId: client.id,
                accountId: account.id,
                walletId: wallet.id,
                transactionType: transactionType.id,
                transactionStatus: transactionStatus.id,
                externalReference: '',
                details: {
                    amount: data.fiatAmount,
                    assetCurrencyId: asset.id,
                    fiatCurrencyId: fiatCurrency.id,
                    exchangeRate: exchangeRate.rate,
                    fees: data.fiatAmount,
                    fiatAmount: data.fiatAmount, // Deprecated field
                    assetAmount: calculatedAssetAmount,
                    totalFiatAmount: data.fiatAmount,
                    totalAssetAmount: calculatedAssetAmount,
                    status: 'E'
                }
            }
            let transaction = await this.transactionRepository.insertTransaction(transactionData);

            if (!transaction) {
                this.loggerService.error('Failed to create transaction record for deposit wallet');
                throw new Error('Failed to create transaction record');
            }
            const transferReference = `TRX-WALLET-${transaction.id}`;
            const transactionHash = `0x${uuid4().replace(/-/g, '')}`;
            this.loggerService.info(`Deposit wallet transaction created successfully with ID: ${transaction.id} for client: ${client.id}`);
            let result: SendFiatWalletTransactionResponse = {
                transactionId: transaction.id,
                type: transactionType.code,
                status: transactionStatus.code,
                clientId: client.id,
                accountId: account.id,
                walletId: wallet.id,
                exchangeRate: exchangeRate.rate.toString() || 'N/A',
                cryptoWithdrawal: {
                    cryptoAsset: asset.code,
                    cryptoNetwork: wallet.network,
                    withdrawnAmount: calculatedAssetAmount,
                    walletAddress: wallet.wallet_address,
                    transactionHash: transactionHash,
                    withdrawalFee: calculatedAssetFeeAmount
                },
                fiatTransfer: {
                    beneficiaryBankData: data.beneficiaryBankData,
                    country: country.code_iso_alpha_2,
                    countryName: country.name,
                    fiatCurrency: fiatCurrency.code,
                    sentAmount: data.fiatAmount,
                    transferReference: transferReference
                }
            };
            return result;
        } catch (error) {
            this.loggerService.error('Error creating deposit wallet transaction', error);
            return null;
        }
    }

    async updateTransactionStatus(transactionId: string, transactionStatus: number): Promise<boolean> {
        try {
            this.loggerService.info(`Updating transaction status, transactionId: ${transactionId}, transactionStatus: ${transactionStatus}`);
            return this.transactionRepository.updateTransactionStatus(transactionId, transactionStatus);
        } catch (error: Error | any) {
            this.loggerService.error(`Error updating transaction status, transactionId: ${transactionId}:`, error);
            return false;
        }
    }

    async getTransactionForCallback(partenerReference: string): Promise<TransactionCallbackResponse | null> {
        try {
            this.loggerService.info(`Getting transaction for callback, partenerReference: ${partenerReference}`);
            return this.transactionRepository.getTransactionForCallback(partenerReference);
        } catch (error: Error | any) {
            this.loggerService.error(`Error getting transaction for callback, partenerReference: ${partenerReference}:`, error);
            return null;
        }
    }

    async getTransacctionById(transactionId: string): Promise<GetTransactionStatusResponse | null> {
        try {
            this.loggerService.info(`Getting transaction by id, transactionId: ${transactionId}`);
            let transaction  = await this.transactionRepository.getTransacctionById(transactionId);

            if(!transaction){
                this.loggerService.info(`No transaction found for transactionId: ${transactionId}`);
                return null;
            }

            if(transaction.partner_id !== null && transaction.partner_id !== undefined){
                if(transaction.transaction_type_code === 'deposit_express' && transaction.partner_reference !== null && transaction.partner_reference !== undefined){
                    let resultadoPartner = await this.atcRedEnlaceService.consultaQRByReferenceNumber(transaction.partner_reference);
                    this.loggerService.info(`Partner response for transactionId: ${transactionId}`, resultadoPartner);

                    transaction.detailsPartner = resultadoPartner;
                }
            }

            return transaction;

        }
        catch (error: Error | any) {
            this.loggerService.error(`Error getting transaction by id, transactionId: ${transactionId}:`, error);
            return null;
        }
    }
}