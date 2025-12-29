import { Pool } from 'pg';
import { TenantDatabaseCredentials, TenantTransactionData, TenantPayoutDetailsData } from '@/domain/interfaces/domain/services/ITenantDatabaseService';

export interface UpdateTenantTransactionData {
    transactionId: string;
    externalReference: string;
    transactionStatus: string;
    cryptoAmount: number;
    fiatAmount: number;
    totalFiatAmount: number;
}

export interface UpdateTenantPayoutDetailsData {
    transactionId: string;
    origenNumeroReferencia: string;
    fechaTransaccion: string;
    cuentaOrigen: string;
    titularOrigen: string;
}

export interface ITenantDatabaseRepository {
    getTenantCredentials(businessId: string): Promise<TenantDatabaseCredentials | null>;
    insertTenantTransaction(pool: Pool, transactionData: TenantTransactionData): Promise<string>;
    insertTenantPayoutDetails(pool: Pool, payoutDetails: TenantPayoutDetailsData): Promise<void>;
    updateTenantTransaction(pool: Pool, updateData: UpdateTenantTransactionData): Promise<void>;
    updateTenantPayoutDetails(pool: Pool, updateData: UpdateTenantPayoutDetailsData): Promise<void>;
}
