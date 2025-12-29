export interface WebhookBusinessNotification {
  id: string;
  businessId: string;
  businessWebhookId: string;
  eventType: string;
  callbackUrl: string;
  httpMethod: string;
  xApiKey: string;
  requestAt: Date;
  payload: any; // JSONB data
  codeStatusResponse: string;
  messageResponse: any; // JSONB data
  responseAt: Date;
}