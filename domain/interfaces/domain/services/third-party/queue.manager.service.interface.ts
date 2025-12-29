export interface CallbackNotificationData {
    transactionId: string;
    externalReference: string;
    transactionStatus: string;
    transactionType: string;
    details: any;
    webhookUrl: string;
    businessId: string;
    businessWebhookId: string;
    eventType: string;
    callbackUrl: string;
    httpMethod: string;
    xApiKey: string;
    payload?: any;
}

export interface MailNotificationData {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
        filename: string;
        content?: string | Buffer;
        path?: string;
    }>;
}

export interface IQueueManagerService{
    setCallbackNotificationToQueue(callbackData: CallbackNotificationData): Promise<boolean>;
    setMailNotificationToQueue(mailData: MailNotificationData): Promise<boolean>;
}