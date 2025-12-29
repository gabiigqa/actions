import { Pool } from 'pg';
import { injectable, inject } from 'inversify';
import { ITenantDatabaseService, TenantDatabaseCredentials, TenantTransactionData, TenantPayoutDetailsData, UpdateTenantTransactionData, UpdateTenantPayoutDetailsData } from '@/domain/interfaces/domain/services/ITenantDatabaseService';
import { ITenantDatabaseRepository } from '@/domain/interfaces/infrastructure/repositories/ITenantDatabaseRepository';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { TYPES } from '@/infrastructure/config/inversify/types';

@injectable()
export class TenantDatabaseService implements ITenantDatabaseService {
    constructor(
        @inject(TYPES.ITenantDatabaseRepository) private tenantDatabaseRepository: ITenantDatabaseRepository,
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService
    ) {}

    async getTenantCredentials(businessId: string): Promise<TenantDatabaseCredentials | null> {
        return await this.tenantDatabaseRepository.getTenantCredentials(businessId);
    }

    async saveTransactionToTenant(
        credentials: TenantDatabaseCredentials,
        transactionData: TenantTransactionData
    ): Promise<void> {
        this.logConnectionAttempt(credentials, 'saveTransactionToTenant');
        const pool = this.createTenantPool(credentials);
        try {
            await this.tenantDatabaseRepository.insertTenantTransaction(pool, transactionData);
        } finally {
            await pool.end();
        }
    }

    async savePayoutDetailsToTenant(
        credentials: TenantDatabaseCredentials,
        payoutDetails: TenantPayoutDetailsData
    ): Promise<void> {
        this.logConnectionAttempt(credentials, 'savePayoutDetailsToTenant');
        const pool = this.createTenantPool(credentials);
        try {
            await this.tenantDatabaseRepository.insertTenantPayoutDetails(pool, payoutDetails);
        } finally {
            await pool.end();
        }
    }

    async saveTransactionAndPayoutDetails(
        credentials: TenantDatabaseCredentials,
        transactionData: TenantTransactionData,
        payoutDetails: TenantPayoutDetailsData
    ): Promise<void> {
        this.logConnectionAttempt(credentials, 'saveTransactionAndPayoutDetails');
        const pool = this.createTenantPool(credentials);
        try {
            // Insertar transaction y obtener el ID generado
            const tenantTransactionId = await this.tenantDatabaseRepository.insertTenantTransaction(pool, transactionData);

            // Usar el ID generado para insertar payout_details
            await this.tenantDatabaseRepository.insertTenantPayoutDetails(pool, {
                ...payoutDetails,
                transactionId: tenantTransactionId  // Usar el UUID generado, no el del sistema principal
            });
        } finally {
            await pool.end();
        }
    }

    private logConnectionAttempt(credentials: TenantDatabaseCredentials, method: string): void {
        const maskedPassword = credentials.password ?
            `${credentials.password.slice(-3).padStart(8, '*')}` :
            'NOT_SET';

        this.loggerService.info(`[${method}] Attempting tenant DB connection`, {
            host: credentials.host,
            port: credentials.port,
            database: credentials.database,
            username: credentials.username,
            password: maskedPassword
        });
    }

    async updateTransactionAndPayoutDetails(
        credentials: TenantDatabaseCredentials,
        transactionUpdate: UpdateTenantTransactionData,
        payoutDetailsUpdate: UpdateTenantPayoutDetailsData
    ): Promise<void> {
        this.logConnectionAttempt(credentials, 'updateTransactionAndPayoutDetails');
        const pool = this.createTenantPool(credentials);
        try {
            // Update transaction
            await this.tenantDatabaseRepository.updateTenantTransaction(pool, transactionUpdate);

            // Update payout_details
            await this.tenantDatabaseRepository.updateTenantPayoutDetails(pool, payoutDetailsUpdate);
        } finally {
            await pool.end();
        }
    }

    private createTenantPool(credentials: TenantDatabaseCredentials): Pool {
        return new Pool({
            host: credentials.host,
            port: credentials.port,
            database: credentials.database,
            user: credentials.username,
            password: credentials.password,
            ssl: {
                rejectUnauthorized: false
            },
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        });
    }
}
