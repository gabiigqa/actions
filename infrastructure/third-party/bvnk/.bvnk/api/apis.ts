export * from './cryptoChannelsApi';
import { CryptoChannelsApi } from './cryptoChannelsApi';
export * from './cryptoPaymentsApi';
import { CryptoPaymentsApi } from './cryptoPaymentsApi';
export * from './currenciesApi';
import { CurrenciesApi } from './currenciesApi';
export * from './customersApi';
import { CustomersApi } from './customersApi';
export * from './fiatPaymentsApi';
import { FiatPaymentsApi } from './fiatPaymentsApi';
export * from './merchantIDsApi';
import { MerchantIDsApi } from './merchantIDsApi';
export * from './onboardingApi';
import { OnboardingApi } from './onboardingApi';
export * from './tradingAndConversionsApi';
import { TradingAndConversionsApi } from './tradingAndConversionsApi';
export * from './walletsApi';
import { WalletsApi } from './walletsApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [CryptoChannelsApi, CryptoPaymentsApi, CurrenciesApi, CustomersApi, FiatPaymentsApi, MerchantIDsApi, OnboardingApi, TradingAndConversionsApi, WalletsApi];
