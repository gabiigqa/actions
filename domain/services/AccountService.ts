import { ClientAccount } from "@/domain/interfaces/domain/entities/ClientAccount";
import { IAccountService } from "@/domain/interfaces/domain/services/IAccountService";
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IClientAccountRepository } from "@/domain/interfaces/infrastructure/repositories/IClientAccountRepository";
import { TYPES } from "@/infrastructure/config/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class AccountService implements IAccountService {
    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
        @inject(TYPES.IClientAccountRepository) private accountRepository: IClientAccountRepository,
    ) { }

    getAccountById(accountId: string): Promise<ClientAccount | null> {
        return this.accountRepository.getClientAccountById(accountId);
    }
    getAccountByClientId(clientId: string): Promise<ClientAccount[]> {
        return this.accountRepository.getClientAccountsByClientId(clientId);
    }
}