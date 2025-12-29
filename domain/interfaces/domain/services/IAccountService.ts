import { ClientAccount } from "@/domain/interfaces/domain/entities/ClientAccount";

export interface AccountData {
    id: string;
    name: string;
    clientId: string;
    balance: number;
    currency: string;
    address: string;
}

export interface IAccountService {
    getAccountById(accountId: string): Promise<ClientAccount | null>;
    getAccountByClientId(clientId: string): Promise<ClientAccount[]>;
}