import { CreateTransactionData, Transaction, TransactionCallbackResponse } from "@/domain/interfaces/domain/entities/Transaction";
import { GetTransactionStatusResponse } from "@/domain/interfaces/infrastructure/controllers/responses/transactions/get.transaction.status";

export interface PayoutListItem {
    payout_id: string;
    reference: string;
    status: string;
    amount: number;
    currency: string;
    beneficiary: {
        name: string;
        account: string;
        currency: string;
    };
    created_at: Date;
}

export interface PayoutDetails {
    payout_id: string;
    reference: string;
    status: string;
    funding_source: string;
    beneficiary: {
        name: string;
        account: string;
        currency: string;
    };
    amount: number;
    description: string;
    deposit_address?: string;
    created_at: Date;
    completed_at?: Date;
}

export interface PaginatedPayouts {
    payouts: PayoutListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ITransactionRepository {
    insertTransaction(transactionData: CreateTransactionData): Promise<Transaction | null>;
    getTransactionById(id: string): Promise<Transaction | null>;
    getTransactionByPartnerReference(partenerReference: string): Promise<Transaction | null>;
    updateTransactionStatus(transactionId: string, transactionStatus: number): Promise<boolean>;
    getTransactionForCallback(partenerReference: string): Promise<TransactionCallbackResponse | null>;
    getTransacctionById(transactionId: string): Promise<GetTransactionStatusResponse | null>;
    updateTransactionExternalReference(transactionId: string, externalReference: string): Promise<boolean>;
    updateTransactionDetails(transactionId: string, amount: number, fiatAmount: number, totalFiatAmount: number): Promise<boolean>;
    getPayouts(businessId: string, status?: string, page?: number, limit?: number): Promise<PaginatedPayouts>;
    getPayoutDetails(payoutId: string, businessId: string): Promise<PayoutDetails | null>;
}