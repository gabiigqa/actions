import { ExternalIntegration } from "@/domain/interfaces/domain/entities/ExternalIntegrations";

export interface TransactionDetails {
    id: string;
    transactionId: string;
    amount: number;
    assetCurrencyId: number;
    fiatCurrencyId: number;
    exchangeRate: number;
    fees: number;
    fiatAmount: number;
    assetAmount: number;
    totalFiatAmount: number;
    totalAssetAmount: number;
    status: string;
    createdAt: Date;
}

export interface Transaction {
    id: string;
    businessId: string;
    clientId: string;
    transactionType: string;
    transactionStatus: string;
    accountId: string;
    walletId: string;
    externalReference: string;

    externalIntegration?: ExternalIntegration;
    details?: TransactionDetails;
}

export interface CreateTransactionDetailsData {
    amount: number;
    assetCurrencyId: number;
    fiatCurrencyId: number;
    exchangeRate: number;
    fees: number;
    fiatAmount: number;
    assetAmount: number;
    totalFiatAmount: number;
    totalAssetAmount: number;
    status: string;
}

export interface CreateTransactionData {
    businessId: string;
    clientId?: string;
    accountId?: string;
    walletId?: string;
    transactionType: number;
    transactionStatus: number;
    externalReference: string;
    details: CreateTransactionDetailsData;
}

export interface TransactionCallbackResponse {
    externalIntegrationId: string;
    transactionId: string;
    businessId: string;
    businessWebhookId: string;
    partnerId: string;
    partnerCode: string;
    details: any;
    accountId?: string;
    walletId?: string;
    clientId?: string;
    externalReference: string;
    transactionStatusId: number;
    transactionStatusCode: string;
    transactionTypeId: number;
    transactionTypeCode: string;
    callbackUrl: string;
    httpMethod: string;
    xApiKey: string;
    events: any;
    businessName: string;
}