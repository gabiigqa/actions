import { CustomerType } from '@/domain/interfaces/bvnk/enums';
import { mapAgreementSigningSessionCreateRequest, mapCustomerCompanyToCreateCustomerRequest, mapCustomerIndividualToCreateCustomerRequest } from '@/domain/interfaces/bvnk/mappers/request.mapper';
import { mapCurrencyCryptoListResponse } from '@/domain/interfaces/bvnk/mappers/response.mapper';
import { AgreementSigningSessionCreateRequest, CustomerCompanyCreateRequest } from '@/domain/interfaces/bvnk/request';
import { CurrencyCryptoListResponse } from '@/domain/interfaces/bvnk/response/currency.crypto.list.response';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { BvnkConfiguration } from '@/infrastructure/third-party/bvnk/configuration.bvnk';
import { CreateAgreementSession200Response, CreateCustomerRequest, CurrenciesApi, CustomersApi, HttpError } from '@bvnk/api';
import { CustomerIndividualCreateRequest } from '@domain/interfaces/bvnk/request/customer.individual.create.request';
import { IncomingMessage } from 'http';
import { inject, injectable } from 'inversify';

@injectable()
export class BvnkServiceConnector {

    public constructor(
        @inject(TYPES.BvnkConfiguration) private bvnkConfig: BvnkConfiguration
    ) { }

    public async listCryptoCurrencies(allowDeposits: boolean = false): Promise<CurrencyCryptoListResponse[]> {
        let currencies: CurrencyCryptoListResponse[] = [];
        let hasMore = true;
        let offset = 0;
        let maxResults = 10; // Adjust based on API limits
        try {
            this.bvnkConfig.setConfiguration('/api/currency/crypto', 'GET', false);
            let currenciesApi = this.bvnkConfig.factoryApiClient(CurrenciesApi);
            do {
                let resultado = await currenciesApi.listCurrenciesCrypto(offset, maxResults, allowDeposits);
                if (this.isValidResponse(resultado.response)) {
                    if (resultado.body.length > 0) {
                        let mapped = mapCurrencyCryptoListResponse(resultado.body);
                        currencies.push(...mapped);
                    }

                    offset += maxResults; // Increment offset for pagination
                    hasMore = resultado.body.length > 0; // Example condition to continue fetching
                }
            } while (hasMore);
        } catch (error: Error | any) {
            this.catchError(error);
            currencies = [];
        }
        return currencies;
    }

    public async createAgreementSigningSession(data: AgreementSigningSessionCreateRequest): Promise<CreateAgreementSession200Response | null> {

        try {
            this.bvnkConfig.setConfiguration('/platform/v1/customers/agreement/sessions', 'POST', true);
            let agreementsApi = this.bvnkConfig.factoryApiClient(CustomersApi);
            let createAgreementSessionRequest = mapAgreementSigningSessionCreateRequest(data);
            let resultado = await agreementsApi.createAgreementSession(createAgreementSessionRequest);
            if (this.isValidResponse(resultado.response)) {
                return resultado.body;
            }
        } catch (error: Error | any) {
            this.catchError(error);
        }
        return null;
    }

    public async createIndividualCustomer(dataRequest: CustomerIndividualCreateRequest, idempotencyKey: string): Promise<any> {

        try {
            this.bvnkConfig.setConfiguration('/platform/v1/customers', 'POST', true);
            let customersApi = this.bvnkConfig.factoryApiClient(CustomersApi);

            if (dataRequest.type !== CustomerType.Individual || dataRequest.individual === undefined || dataRequest.individual === null) {
                throw new Error('Customer type must be individual');
            }

            let createCustomerRequest: CreateCustomerRequest = mapCustomerIndividualToCreateCustomerRequest(dataRequest)
            let resultado = await customersApi.createCustomer(idempotencyKey, createCustomerRequest);
            if (this.isValidResponse(resultado.response)) {
                return resultado.body;
            }
        } catch (error: Error | any) {
            this.catchError(error);
        }
        return null;
    }

    public async createCompanyCustomer(dataRequest: CustomerCompanyCreateRequest, idempotencyKey: string): Promise<any> {
        try {
            this.bvnkConfig.setConfiguration('/platform/v1/customers', 'POST', true);
            let customersApi = this.bvnkConfig.factoryApiClient(CustomersApi);

            if (dataRequest.type !== CustomerType.Company || dataRequest.company === undefined || dataRequest.company === null) {
                throw new Error('Customer type must be company');
            }
            let createCustomerRequest: CreateCustomerRequest = mapCustomerCompanyToCreateCustomerRequest(dataRequest)
            let resultado = await customersApi.createCustomer(idempotencyKey, createCustomerRequest);
            if (this.isValidResponse(resultado.response)) {
                return resultado.body;
            }
        } catch (error: Error | any) {
            this.catchError(error);
        }
        return null;
    }

    public async getCustomers(name: string = ""): Promise<any[]> {
        let customers: any[] = [];
        try {
            let size = 10;
            let page = 0;
            let hasMore = false;

            this.bvnkConfig.setConfiguration('/platform/v1/customers', 'GET', true);
            let customersApi = this.bvnkConfig.factoryApiClient(CustomersApi);

            do {
                let resultado;

                if (name && name.length > 0) {
                    resultado = await customersApi.listAccountCustomers(page, size, name);
                } else {
                    resultado = await customersApi.listAccountCustomers(page, size);
                }

                if (this.isValidResponse(resultado.response)) {
                    let results = resultado.body;
                    customers.push(...results.content);
                    hasMore = results.page.number < results.page.totalPages;
                } else {
                    throw new Error('Invalid response while fetching customers');
                }
            } while (hasMore)
        } catch (error: Error | any) {
            this.catchError(error);
            customers = [];
        }
        return customers;
    }


    private isValidResponse(response: IncomingMessage): boolean {
        const validCodes = [200, 201, 202];
        if (!response.statusCode || !validCodes.includes(response.statusCode)) {
            throw new Error(`Invalid response status code: ${response.statusCode}, message ${response.statusMessage}`); // Handle invalid response
        }
        return true;
    }

    private catchError(error: Error | any) {
        if (error instanceof HttpError) {
            if (error.response instanceof IncomingMessage) {
                console.error(`HTTP error occurred while: ${error.message}`, {
                    statusCode: error.statusCode,
                    message: error.message,
                    body: error.body
                });
            }
        } else if (error instanceof Error) {
            console.error(`Error creating agreement signing session: ${error.message}`, error);
        } else {
            console.error(`Unknown error occurred while creating agreement signing session`, error);
        }
    }
}