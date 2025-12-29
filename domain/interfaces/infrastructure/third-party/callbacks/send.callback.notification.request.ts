export interface EventsDetails {
    transactions?: string[];
    compliances?: string[];
    accounts?: string[];
    wallets?: string[];
}

export interface TransactionCallbackData {
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
    events: EventsDetails;
    businessName: string;
}

export interface CallbackNotificationResponse {
    businessId: string;
    businessWebhookId: string;
    eventType: string;
    callbackUrl: string;
    httpMethod: string;
    xApiKey: string;
    requestAt: Date | null;
    payload?: any;
    isResponseOk: boolean;
    responseCode: number;
    responseMessage: any;
    responseAt: Date | null;

    existEventNotification: boolean;
}