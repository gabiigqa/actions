import { WebhookBusinessNotification } from "@/domain/interfaces/domain/entities/WebhookBusinessNotification";

export interface IWebhookBusinessNotificationRepository {
  create(notification: Omit<WebhookBusinessNotification, 'id' | 'requestAt' | 'responseAt'>): Promise<WebhookBusinessNotification>;
}