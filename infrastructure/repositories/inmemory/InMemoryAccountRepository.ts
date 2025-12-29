import { AccountData } from "@/domain/interfaces/domain/services/IAccountService";
import { IAccountRepository } from "@/domain/interfaces/infrastructure/repositories/IAccountRepository";
import { injectable } from "inversify";
import accountJson from '../../../data/accounts.json';

@injectable()
export class InMemoryAccountRepository implements IAccountRepository {
    private accounts: Map<string, AccountData> = new Map();

    constructor() {
        // Initialize the in-memory account repository with data from the JSON file
        accountJson.forEach(account => {
            this.accounts.set(account.id, account as AccountData);
        });
    }

    getAccountById(accountId: string): Promise<AccountData | null> {
        return Promise.resolve(this.accounts.get(accountId) || null);
    }

    getAccountsByClientId(clientId: string): Promise<AccountData | null> {
        return Promise.resolve(
            Array.from(this.accounts.values()).find(account => account.clientId === clientId) || null
        );
    }
}