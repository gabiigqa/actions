import { Business } from '@/domain/interfaces/domain/entities/Business';

export interface IBusinessService {
  getBusinessById(businessId: string): Promise<Business | null>;
  getBusinessByEmail(email: string): Promise<Business | null>;
}