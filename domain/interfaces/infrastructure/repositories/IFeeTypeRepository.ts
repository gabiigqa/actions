import { CreateFeeTypeData, FeeType } from '@/domain/interfaces/domain/entities/FeeType';

export interface IFeeTypeRepository {
  getFeeTypeById(id: number): Promise<FeeType | null>;
  getFeeTypeByCode(code: string): Promise<FeeType | null>;
  createFeeType(feeTypeData: CreateFeeTypeData): Promise<FeeType>;
  getAllFeeTypes(): Promise<FeeType[]>;
}