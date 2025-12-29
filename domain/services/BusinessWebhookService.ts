import { BusinessWebhook } from '@/domain/interfaces/domain/entities/BusinessWebhook';
import { IBusinessWebhookService, PublicBusinessWebhook } from '@/domain/interfaces/domain/services/IBusinessWebhookService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IBusinessWebhookRepository } from '@/domain/interfaces/infrastructure/repositories/IBusinessWebhookRepository';
import { TYPES } from '@/infrastructure/config/inversify';
import { inject, injectable } from 'inversify';

@injectable()
export class BusinessWebhookService implements IBusinessWebhookService {
  constructor(
    @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
    @inject(TYPES.IBusinessWebhookRepository) private businessWebhookRepository: IBusinessWebhookRepository
  ) {}

  /**
   * Filter BusinessWebhook to remove sensitive fields
   * @param webhook The complete BusinessWebhook entity
   * @returns PublicBusinessWebhook without sensitive fields
   */
  private filterWebhookData(webhook: BusinessWebhook): PublicBusinessWebhook {
    const { businessId, createdAt, updatedAt, status, ...publicWebhook } = webhook;
    return publicWebhook;
  }

  /**
   * Filter array of BusinessWebhooks to remove sensitive fields
   * @param webhooks Array of complete BusinessWebhook entities
   * @returns Array of PublicBusinessWebhook without sensitive fields
   */
  private filterWebhooksData(webhooks: BusinessWebhook[]): PublicBusinessWebhook[] {
    return webhooks.map(webhook => this.filterWebhookData(webhook));
  }

  // =============================================================================
  // INTERNAL METHODS - Return complete BusinessWebhook entities (for internal use)
  // =============================================================================

  /**
   * Internal method: Get webhook by ID with complete data
   * @param id The webhook UUID
   * @returns Complete BusinessWebhook entity or null if not found
   */
  async getInternalWebhookById(id: string): Promise<BusinessWebhook | null> {
    try {
      this.loggerService.info(`BusinessWebhookService: Getting internal webhook by ID ${id}`);
      
      if (!id || id.trim() === '') {
        this.loggerService.warn('BusinessWebhookService: Invalid webhook ID provided');
        return null;
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        this.loggerService.warn(`BusinessWebhookService: Invalid UUID format - ${id}`);
        return null;
      }

      const webhook = await this.businessWebhookRepository.getWebhookById(id);
      
      if (webhook) {
        this.loggerService.info(`BusinessWebhookService: Internal webhook found - ${webhook.description}`);
      } else {
        this.loggerService.info(`BusinessWebhookService: Internal webhook not found for ID ${id}`);
      }

      return webhook;
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error getting internal webhook by ID', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Internal method: Get all webhooks for a specific business with complete data
   * @param businessId The business UUID
   * @returns Array of complete BusinessWebhook entities
   */
  async getInternalWebhooksByBusinessId(businessId: string): Promise<BusinessWebhook[]> {
    try {
      this.loggerService.info(`BusinessWebhookService: Getting internal webhooks for business ${businessId}`);
      
      if (!businessId || businessId.trim() === '') {
        this.loggerService.warn('BusinessWebhookService: Invalid business ID provided');
        return [];
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(businessId)) {
        this.loggerService.warn(`BusinessWebhookService: Invalid business UUID format - ${businessId}`);
        return [];
      }

      const webhooks = await this.businessWebhookRepository.getWebhooksByBusinessId(businessId);
      
      this.loggerService.info(`BusinessWebhookService: Found ${webhooks.length} internal webhooks for business ${businessId}`);
      return webhooks;
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error getting internal webhooks by business ID', {
        businessId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Internal method: Get active webhooks for a specific business with complete data
   * @param businessId The business UUID
   * @returns Array of complete active BusinessWebhook entities
   */
  async getInternalActiveWebhooksByBusinessId(businessId: string): Promise<BusinessWebhook[]> {
    try {
      this.loggerService.info(`BusinessWebhookService: Getting internal active webhooks for business ${businessId}`);
      
      if (!businessId || businessId.trim() === '') {
        this.loggerService.warn('BusinessWebhookService: Invalid business ID provided');
        return [];
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(businessId)) {
        this.loggerService.warn(`BusinessWebhookService: Invalid business UUID format - ${businessId}`);
        return [];
      }

      const webhooks = await this.businessWebhookRepository.getActiveWebhooksByBusinessId(businessId);
      
      this.loggerService.info(`BusinessWebhookService: Found ${webhooks.length} internal active webhooks for business ${businessId}`);
      return webhooks;
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error getting internal active webhooks by business ID', {
        businessId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Internal method: Get webhooks for a specific business and event with complete data
   * @param businessId The business UUID
   * @param event The event name to filter by
   * @returns Array of complete BusinessWebhook entities that handle the specified event
   */
  async getInternalWebhooksByBusinessIdAndEvent(businessId: string, event: string): Promise<BusinessWebhook[]> {
    try {
      this.loggerService.info(`BusinessWebhookService: Getting internal webhooks for business ${businessId} and event ${event}`);
      
      if (!businessId || businessId.trim() === '') {
        this.loggerService.warn('BusinessWebhookService: Invalid business ID provided');
        return [];
      }

      if (!event || event.trim() === '') {
        this.loggerService.warn('BusinessWebhookService: Invalid event provided');
        return [];
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(businessId)) {
        this.loggerService.warn(`BusinessWebhookService: Invalid business UUID format - ${businessId}`);
        return [];
      }

      const webhooks = await this.businessWebhookRepository.getWebhooksByBusinessIdAndEvent(businessId, event);
      
      this.loggerService.info(`BusinessWebhookService: Found ${webhooks.length} internal webhooks for business ${businessId} and event ${event}`);
      return webhooks;
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error getting internal webhooks by business ID and event', {
        businessId,
        event,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // =============================================================================
  // PUBLIC METHODS - Return filtered BusinessWebhook entities (for external use)
  // =============================================================================

  /**
   * Get webhook by ID (public - filtered data)
   * @param id The webhook UUID
   * @returns PublicBusinessWebhook entity or null if not found
   */
  async getWebhookById(id: string): Promise<PublicBusinessWebhook | null> {
    const webhook = await this.getInternalWebhookById(id);
    return webhook ? this.filterWebhookData(webhook) : null;
  }

  /**
   * Get all webhooks for a specific business (public - filtered data)
   * @param businessId The business UUID
   * @returns Array of PublicBusinessWebhook entities
   */
  async getWebhooksByBusinessId(businessId: string): Promise<PublicBusinessWebhook[]> {
    const webhooks = await this.getInternalWebhooksByBusinessId(businessId);
    return this.filterWebhooksData(webhooks);
  }

  /**
   * Get active webhooks for a specific business (public - filtered data)
   * @param businessId The business UUID
   * @returns Array of active PublicBusinessWebhook entities
   */
  async getActiveWebhooksByBusinessId(businessId: string): Promise<PublicBusinessWebhook[]> {
    const webhooks = await this.getInternalActiveWebhooksByBusinessId(businessId);
    return this.filterWebhooksData(webhooks);
  }

  /**
   * Get webhooks for a specific business and event (public - filtered data)
   * @param businessId The business UUID
   * @param event The event name to filter by
   * @returns Array of PublicBusinessWebhook entities that handle the specified event
   */
  async getWebhooksByBusinessIdAndEvent(businessId: string, event: string): Promise<PublicBusinessWebhook[]> {
    const webhooks = await this.getInternalWebhooksByBusinessIdAndEvent(businessId, event);
    return this.filterWebhooksData(webhooks);
  }

  /**
   * Create a new webhook
   * @param webhook Webhook data without id, createdAt, and updatedAt
   * @returns Created BusinessWebhook entity
   */
  async createWebhook(webhook: Omit<BusinessWebhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessWebhook> {
    try {
      this.loggerService.info(`BusinessWebhookService: Creating webhook for business ${webhook.businessId}`);
      
      // Validate webhook data
      const validation = await this.validateWebhookData(webhook);
      if (!validation.isValid) {
        const errorMessage = `Webhook validation failed: ${validation.errors.join(', ')}`;
        this.loggerService.error(errorMessage);
        throw new Error(errorMessage);
      }

      const createdWebhook = await this.businessWebhookRepository.createWebhook(webhook);
      
      this.loggerService.info(`BusinessWebhookService: Webhook created successfully with ID ${createdWebhook.id}`);
      return createdWebhook;
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error creating webhook', {
        businessId: webhook.businessId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Update an existing webhook
   * @param id The webhook UUID
   * @param updates Partial webhook data to update
   * @returns Updated BusinessWebhook entity or null if not found
   */
  async updateWebhook(id: string, updates: Partial<Omit<BusinessWebhook, 'id' | 'businessId' | 'createdAt'>>): Promise<BusinessWebhook | null> {
    try {
      this.loggerService.info(`BusinessWebhookService: Updating webhook ${id}`);
      
      if (!id || id.trim() === '') {
        this.loggerService.warn('BusinessWebhookService: Invalid webhook ID provided');
        return null;
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        this.loggerService.warn(`BusinessWebhookService: Invalid UUID format - ${id}`);
        return null;
      }

      // Validate that webhook exists
      const existingWebhook = await this.businessWebhookRepository.getWebhookById(id);
      if (!existingWebhook) {
        this.loggerService.warn(`BusinessWebhookService: Webhook not found for update - ${id}`);
        return null;
      }

      // Validate update data if URL is being updated
      if (updates.callbackUrl && !this.isValidUrl(updates.callbackUrl)) {
        throw new Error('Invalid callback URL format');
      }

      // Validate HTTP method if being updated
      if (updates.httpMethod && !this.isValidHttpMethod(updates.httpMethod)) {
        throw new Error('Invalid HTTP method. Allowed: GET, POST, PUT, PATCH, DELETE');
      }

      const updatedWebhook = await this.businessWebhookRepository.updateWebhook(id, updates);
      
      if (updatedWebhook) {
        this.loggerService.info(`BusinessWebhookService: Webhook updated successfully - ${updatedWebhook.id}`);
      }

      return updatedWebhook;
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error updating webhook', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Delete a webhook
   * @param id The webhook UUID
   * @returns True if deleted, false if not found
   */
  async deleteWebhook(id: string): Promise<boolean> {
    try {
      this.loggerService.info(`BusinessWebhookService: Deleting webhook ${id}`);
      
      if (!id || id.trim() === '') {
        this.loggerService.warn('BusinessWebhookService: Invalid webhook ID provided');
        return false;
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        this.loggerService.warn(`BusinessWebhookService: Invalid UUID format - ${id}`);
        return false;
      }

      const deleted = await this.businessWebhookRepository.deleteWebhook(id);
      
      if (deleted) {
        this.loggerService.info(`BusinessWebhookService: Webhook deleted successfully - ${id}`);
      } else {
        this.loggerService.info(`BusinessWebhookService: Webhook not found for deletion - ${id}`);
      }

      return deleted;
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error deleting webhook', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Update webhook status
   * @param id The webhook UUID
   * @param status The new status ('E' for enabled, 'D' for disabled)
   * @returns True if updated, false if not found
   */
  async updateWebhookStatus(id: string, status: string): Promise<boolean> {
    try {
      this.loggerService.info(`BusinessWebhookService: Updating webhook status ${id} to ${status}`);
      
      if (!id || id.trim() === '') {
        this.loggerService.warn('BusinessWebhookService: Invalid webhook ID provided');
        return false;
      }

      if (!status || !['E', 'D'].includes(status)) {
        this.loggerService.warn('BusinessWebhookService: Invalid status provided. Must be E (enabled) or D (disabled)');
        return false;
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        this.loggerService.warn(`BusinessWebhookService: Invalid UUID format - ${id}`);
        return false;
      }

      const updated = await this.businessWebhookRepository.updateWebhookStatus(id, status);
      
      if (updated) {
        this.loggerService.info(`BusinessWebhookService: Webhook status updated successfully - ${id} -> ${status}`);
      } else {
        this.loggerService.info(`BusinessWebhookService: Webhook not found for status update - ${id}`);
      }

      return updated;
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error updating webhook status', {
        id,
        status,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Validate webhook data before creation or update
   * @param webhook Webhook data to validate
   * @returns Validation result with errors if any
   */
  async validateWebhookData(webhook: Omit<BusinessWebhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Business ID validation
      if (!webhook.businessId || webhook.businessId.trim() === '') {
        errors.push('Business ID is required');
      } else {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(webhook.businessId)) {
          errors.push('Business ID must be a valid UUID');
        }
      }

      // Description validation
      if (!webhook.description || webhook.description.trim() === '') {
        errors.push('Description is required');
      } else if (webhook.description.length > 255) {
        errors.push('Description must be less than 255 characters');
      }

      // Callback URL validation
      if (!webhook.callbackUrl || webhook.callbackUrl.trim() === '') {
        errors.push('Callback URL is required');
      } else if (!this.isValidUrl(webhook.callbackUrl)) {
        errors.push('Callback URL must be a valid HTTP or HTTPS URL');
      }

      // HTTP method validation
      if (!webhook.httpMethod || webhook.httpMethod.trim() === '') {
        errors.push('HTTP method is required');
      } else if (!this.isValidHttpMethod(webhook.httpMethod)) {
        errors.push('HTTP method must be one of: GET, POST, PUT, PATCH, DELETE');
      }

      // API key validation (optional but if provided, must not be empty)
      if (webhook.xApiKey !== undefined && webhook.xApiKey !== null && webhook.xApiKey.trim() === '') {
        errors.push('X-API-Key cannot be empty if provided');
      }

      // Events validation
      if (!webhook.events) {
        errors.push('Events configuration is required');
      } else {
        try {
          // If events is a string, try to parse it as JSON
          const eventsObj = typeof webhook.events === 'string' ? JSON.parse(webhook.events) : webhook.events;
          if (typeof eventsObj !== 'object' || Array.isArray(eventsObj)) {
            errors.push('Events must be a valid JSON object');
          }
        } catch (e) {
          errors.push('Events must be valid JSON');
        }
      }

      // Status validation
      if (!webhook.status || !['E', 'D'].includes(webhook.status)) {
        errors.push('Status must be E (enabled) or D (disabled)');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      this.loggerService.error('BusinessWebhookService: Error validating webhook data', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      errors.push('Validation failed due to unexpected error');
      return {
        isValid: false,
        errors
      };
    }
  }

  /**
   * Validate URL format
   * @param url URL to validate
   * @returns True if valid URL
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validate HTTP method
   * @param method HTTP method to validate
   * @returns True if valid HTTP method
   */
  private isValidHttpMethod(method: string): boolean {
    const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    return validMethods.includes(method.toUpperCase());
  }
}