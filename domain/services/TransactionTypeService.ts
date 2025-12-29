import { TransactionType } from '@/domain/interfaces/domain/entities/TransactionType';
import { ITransactionTypeService } from '@/domain/interfaces/domain/services/ITransactionTypeService';
import { ITransactionTypeRepository } from '@/domain/interfaces/infrastructure/repositories/ITransactionTypeRepository';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';

@injectable()
export class TransactionTypeService implements ITransactionTypeService {
    constructor(
        @inject(TYPES.ITransactionTypeRepository) private transactionTypeRepository: ITransactionTypeRepository
    ) {}

    async getTransactionTypeById(id: number): Promise<TransactionType | null> {
        return await this.transactionTypeRepository.getTransactionTypeById(id);
    }

    async getTransactionTypeByCode(code: string): Promise<TransactionType | null> {
        return await this.transactionTypeRepository.getTransactionTypeByCode(code);
    }

    async getAllTransactionTypes(): Promise<TransactionType[]> {
        return await this.transactionTypeRepository.getAllTransactionTypes();
    }
}