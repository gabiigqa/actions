import { ClientAccountWallet } from "@/domain/interfaces/domain/entities/ClientAccountWallet";

export interface IWalletService {
  getWalletById(id: string): Promise<ClientAccountWallet | null>;
  getWalletsByAccountId(accountId: string): Promise<ClientAccountWallet[]>;
}