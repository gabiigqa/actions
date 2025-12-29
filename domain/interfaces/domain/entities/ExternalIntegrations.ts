export interface ExternalIntegration {
    id: string;
    partnerId: string;
    transactionId: string;
    internalReference: string;
    partnerReference: string;
    responseCode: string;
    responseMessage: string;
    details: string;
    status: string;
    createdAt: Date;
}

export interface CreateExternalIntegrationData {
    partnerId: string;
    transactionId: string;
    internalReference: string;
    partnerReference: string;
    responseCode: string;
    responseMessage: string;
    details: any;
    status: string;
}