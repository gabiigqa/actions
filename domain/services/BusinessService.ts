import { Business } from '@/domain/interfaces/domain/entities/Business';
import { IBusinessService } from '@/domain/interfaces/domain/services/IBusinessService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IBusinessRepository } from '@/domain/interfaces/infrastructure/repositories/IBusinessRepository';
import { TYPES } from '@/infrastructure/config/inversify';
import { inject, injectable } from 'inversify';

@injectable()
export class BusinessService implements IBusinessService {
  constructor(
    @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
    @inject(TYPES.IBusinessRepository) private businessRepository: IBusinessRepository
  ) {}

  /**
   * Get business by ID, only enabled businesses (status = 'E')
   * @param businessId The business UUID
   * @returns Business entity or null if not found/disabled
   */
  async getBusinessById(businessId: string): Promise<Business | null> {
    try {
      this.loggerService.info(`BusinessService: Getting business by ID ${businessId}`);
      
      if (!businessId || businessId.trim() === '') {
        this.loggerService.warn('BusinessService: Invalid business ID provided');
        return null;
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(businessId)) {
        this.loggerService.warn(`BusinessService: Invalid UUID format - ${businessId}`);
        return null;
      }

      const business = await this.businessRepository.getBusinessById(businessId);
      
      if (business) {
        this.loggerService.info(`BusinessService: Business found - ${business.name}`);
      } else {
        this.loggerService.info(`BusinessService: Business not found or disabled for ID ${businessId}`);
      }

      return business;
    } catch (error) {
      this.loggerService.error('BusinessService: Error getting business by ID', {
        businessId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Get business by email, only enabled businesses (status = 'E')
   * @param email The business email
   * @returns Business entity or null if not found/disabled
   */
  async getBusinessByEmail(email: string): Promise<Business | null> {
    try {
      this.loggerService.info(`BusinessService: Getting business by email ${email}`);
      
      if (!email || email.trim() === '') {
        this.loggerService.warn('BusinessService: Invalid email provided');
        return null;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.loggerService.warn(`BusinessService: Invalid email format - ${email}`);
        return null;
      }

      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase().trim();

      const business = await this.businessRepository.getBusinessByEmail(normalizedEmail);
      
      if (business) {
        this.loggerService.info(`BusinessService: Business found - ${business.name} (ID: ${business.id})`);
      } else {
        this.loggerService.info(`BusinessService: Business not found or disabled for email ${normalizedEmail}`);
      }

      return business;
    } catch (error) {
      this.loggerService.error('BusinessService: Error getting business by email', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}