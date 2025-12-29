import { BusinessWebhook } from "@/domain/interfaces/domain/entities/BusinessWebhook";

export interface IBusinessWebhookRepository {
  getWebhookById(id: string): Promise<BusinessWebhook | null>;
  getWebhooksByBusinessId(businessId: string): Promise<BusinessWebhook[]>;
  getActiveWebhooksByBusinessId(businessId: string): Promise<BusinessWebhook[]>;
  getWebhooksByBusinessIdAndEvent(businessId: string, event: string): Promise<BusinessWebhook[]>;
  createWebhook(webhook: Omit<BusinessWebhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessWebhook>;
  updateWebhook(id: string, updates: Partial<Omit<BusinessWebhook, 'id' | 'businessId' | 'createdAt'>>): Promise<BusinessWebhook | null>;
  deleteWebhook(id: string): Promise<boolean>;
  updateWebhookStatus(id: string, status: string): Promise<boolean>;
}