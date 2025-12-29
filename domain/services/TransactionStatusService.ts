import { TransactionStatus } from '@/domain/interfaces/domain/entities/TransactionStatus';
import { ITransactionStatusService } from '@/domain/interfaces/domain/services/ITransactionStatusService';
import { ITransactionStatusRepository } from '@/domain/interfaces/infrastructure/repositories/ITransactionStatusRepository';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class TransactionStatusService implements ITransactionStatusService {
    constructor(
        @inject(TYPES.ITransactionStatusRepository) private transactionStatusRepository: ITransactionStatusRepository
    ) {}

    async getTransactionStatusById(id: number): Promise<TransactionStatus | null> {
        return await this.transactionStatusRepository.getTransactionStatusById(id);
    }

    async getTransactionStatusByCode(code: string): Promise<TransactionStatus | null> {
        return await this.transactionStatusRepository.getTransactionStatusByCode(code);
    }

    async getAllTransactionStatuses(): Promise<TransactionStatus[]> {
        return await this.transactionStatusRepository.getAllTransactionStatuses();
    }
}