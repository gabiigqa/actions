import { BusinessWebhook } from '@/domain/interfaces/domain/entities/BusinessWebhook';

// Type for BusinessWebhook without sensitive fields
export type PublicBusinessWebhook = Omit<BusinessWebhook, 'businessId' | 'createdAt' | 'updatedAt' | 'status'>;

export interface IBusinessWebhookService {
  // Public methods (filtered data)
  getWebhookById(id: string): Promise<PublicBusinessWebhook | null>;
  getWebhooksByBusinessId(businessId: string): Promise<PublicBusinessWebhook[]>;
  getActiveWebhooksByBusinessId(businessId: string): Promise<PublicBusinessWebhook[]>;
  getWebhooksByBusinessIdAndEvent(businessId: string, event: string): Promise<PublicBusinessWebhook[]>;
  
  // Internal methods (complete data) - for internal service use
  getInternalWebhookById(id: string): Promise<BusinessWebhook | null>;
  getInternalWebhooksByBusinessId(businessId: string): Promise<BusinessWebhook[]>;
  getInternalActiveWebhooksByBusinessId(businessId: string): Promise<BusinessWebhook[]>;
  getInternalWebhooksByBusinessIdAndEvent(businessId: string, event: string): Promise<BusinessWebhook[]>;
  
  // CRUD operations
  createWebhook(webhook: Omit<BusinessWebhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessWebhook>;
  updateWebhook(id: string, updates: Partial<Omit<BusinessWebhook, 'id' | 'businessId' | 'createdAt'>>): Promise<BusinessWebhook | null>;
  deleteWebhook(id: string): Promise<boolean>;
  updateWebhookStatus(id: string, status: string): Promise<boolean>;
  validateWebhookData(webhook: Omit<BusinessWebhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ isValid: boolean; errors: string[] }>;
}