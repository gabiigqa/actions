import { AccountData } from "@/domain/interfaces/domain/services/IAccountService";

export interface IAccountRepository {
    // Define methods for account repository
    getAccountById(accountId: string): Promise<AccountData | null>;
    getAccountsByClientId(clientId: string): Promise<AccountData | null>;
}