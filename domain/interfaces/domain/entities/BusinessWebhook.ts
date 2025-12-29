export interface BusinessWebhook {
  id: string;
  businessId: string;
  description: string;
  callbackUrl: string;
  httpMethod: string;
  xApiKey: string;
  events: any; // JSONB data
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}