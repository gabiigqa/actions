import { injectable } from "inversify";
import uuid4 from "uuid4";

export interface CreateDepositTransactionRequest {
    transactionId: string;
    cryptoAmount: number;
    asset: string;
    fiatCurrency: string;
    referenceId: string;
    country: string;
    clientId: string;
    accountId: string;
    walletId: string;
}

export interface CreateDepositTransactionResponse {
    id: string;
    transactionId: string;
    partnerId: string;
    partnerReference: string;
    bankAccountDetails: {
        bankCode: string;
        bankName: string;
        accountNumber: string;
        accountType: string;
        accountHolderName: string;
        accountHolderCI: string;
        currency: string;
        reference: string;
    }
}

@injectable()
export class FakePartnerConnector {

    async createTransaction(transactionData: CreateDepositTransactionRequest): Promise<CreateDepositTransactionResponse> {
        // Simulate interaction with a fake partner API
        const codigoReferencia = `REF-WALLET-${transactionData.asset}-${transactionData.transactionId}`;

        return {
            id: this.generateUUID(),
            transactionId: transactionData.transactionId,
            partnerId: this.generateUUID(),
            partnerReference: codigoReferencia,
            bankAccountDetails: {
                bankCode: '001',
                bankName: 'Banco de Bolivia',
                accountNumber: '1234567890',
                accountHolderCI: '98765432',
                accountHolderName: 'Mesa de Pagos S.A.',
                accountType: 'savings',
                currency: transactionData.fiatCurrency,
                reference: `${codigoReferencia}`
            }
        }
    }

    generateUUID(): string {
        return uuid4();
    }
} 