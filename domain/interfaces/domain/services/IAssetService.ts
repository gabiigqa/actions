import { CryptoCurrency } from "@/domain/interfaces/domain/entities/CryptoCurrency";

export interface IAssetService {
  getAssetById(id: number): Promise<CryptoCurrency | null>;
  getAssetByCode(code: string): Promise<CryptoCurrency | null>;
  getAllAssets(): Promise<CryptoCurrency[]>;
}