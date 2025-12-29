import { Business } from '@/domain/interfaces/domain/entities/Business';

export interface IBusinessRepository {
    getBusinessById(businessId: string): Promise<Business | null>;
    getBusinessByEmail(email: string): Promise<Business | null>;
    getBusinessWithUserByUsername(username: string): Promise<Business | null>;
}