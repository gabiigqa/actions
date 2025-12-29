export interface FeeType {
  id: number;
  description: string;
  code: string;
}

export interface CreateFeeTypeData {
  description: string;
  code: string;
}

export interface UpdateFeeTypeData {
  description?: string;
  code?: string;
}