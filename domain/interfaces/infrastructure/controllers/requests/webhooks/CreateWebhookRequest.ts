export interface CreateWebhookRequest {
    url: string;
    apiKey: string;
    method: string;
    events: any;
    description: string;
}

export interface UpdateWebhookRequest {
    url: string;
    apiKey: string;
    method: string;
    events: any;
    description: string;
}