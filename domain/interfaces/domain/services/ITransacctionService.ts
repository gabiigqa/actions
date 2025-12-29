import { TransactionCallbackResponse } from "@/domain/interfaces/domain/entities/Transaction";
import { GetTransactionStatusResponse } from "@/domain/interfaces/infrastructure/controllers/responses/transactions/get.transaction.status";

export interface ExchangeTransactionData {
    amount: number;
    asset: string;
    fiatCurrency: string;
}

export interface DepositExpressTransactionRequest {
    clientId: string;
    accountId: string;
    walletId: string;
    cryptoAmount: number;
    asset: string;
    fiatCurrency: string;
    referenceId: string;
    country: string;
}

export interface DepositExternalExpressTransactionRequest {
    email: string;
    businessId: string;
    cryptoAmount: number;
    asset: string;
    fiatCurrency: string;
    referenceId: string;
    country: string;
}

export interface DepositWalletTransactionRequest {
    clientId: string;
    walletId: string;
    accountId: string;
    cryptoAmount: number;
    asset: string;
    fiatCurrency: string;
    referenceId: string;
    country: string;
}

export interface DepositExpressTransactionResponse {
    transactionId: string;
    type: string;
    status: string;
    clientId: string;
    accountId: string;
    walletId: string;
    referenceId: string;
    country: string;
    countryName: string;
    requestedCryptoAmount: string;
    asset: string;
    calculatedFiatAmount: string;
    fiatCurrency: string;
    exchangeRate: string;
    qrCodeBase64: string;
}

export interface DepositExternalExpressTransactionResponse {
    transactionId: string;
    type: string;
    status: string;
    referenceId: string;
    country: string;
    countryName: string;
    requestedCryptoAmount: string;
    asset: string;
    calculatedFiatAmount: string;
    fiatCurrency: string;
    exchangeRate: string;
    qrCodeBase64: string;
}

export interface BankAccountDetails {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountType: string;
    accountHolderName: string;
    accountHolderCI: string;
    currency: string;
    reference: string;
}

export interface WalletDetails {
    walletId: string;
    asset: string;
    network: string;
    address: string;
    label: string;
    purpose: string;
}

export interface DepositWalletTransactionResponse {
    transactionId: string;
    type: string;
    status: string;
    clientId: string;
    walletId: string;
    accountId: string;
    country: string;
    countryName: string;
    referenceId: string;
    asset: string;
    requestedCryptoAmount: string;
    calculatedFiatAmount: string;
    fiatCurrency: string;
    exchangeRate: string;
    bankAccountDetails: BankAccountDetails;
    walletDetails: WalletDetails;
    depositInstructions: string;
    expiresAt: string;
    createdAt: string;
}

export interface SendTransactionRequest {
    amount: number;
    fromId: string;
    toId: string;
    idempotencyKey: string;
}

export interface SendTransactionResponse {
    id: string;
    amount: number;
    fromId: string;
    toId: string;
    status: 'created' | 'failed' | 'pending' | 'completed';
    type: 'deposit' | 'withdrawal';
    idempotencyKey: string;
}

export interface BeneficiaryBankData {
    bankCode: string;
    bankName?: string;
    accountNumber: string;
    accountType: string;
    accountHolderName: string;
    accountHolderCI: string;
    accountHolderPhone?: string;
    accountHolderEmail?: string;
    currency?: string;
}

export interface SendFiatWalletTransactionRequest {
    clientId: string;
    walletId: string;
    accountId: string;
    fiatAmount: number;
    fiatCurrency: string;
    country: string;
    beneficiaryBankData: BeneficiaryBankData;
}

export interface CryptoWithdrawalDetails {
    withdrawnAmount: number;
    cryptoAsset: string;
    cryptoNetwork: string;
    walletAddress: string;
    transactionHash: string;
    withdrawalFee: number;
}
export interface FiatTransferDetails {
    sentAmount: number;
    fiatCurrency: string;
    country: string;
    countryName: string;
    beneficiaryBankData: BeneficiaryBankData;
    transferReference: string;
}

export interface SendFiatWalletTransactionResponse {
    transactionId: string;
    status: string;
    type: string;
    clientId: string;
    walletId: string;
    accountId: string;
    cryptoWithdrawal: CryptoWithdrawalDetails;
    fiatTransfer: FiatTransferDetails;
    exchangeRate: string;
}

export interface ITransactionService {
    createExpressDepositTransaction(data: DepositExpressTransactionRequest): Promise<DepositExpressTransactionResponse | null>;
    createExternalExpressDepositTransaction(data: DepositExternalExpressTransactionRequest): Promise<DepositExternalExpressTransactionResponse | null>;
    createDepositToWalletAssets(data: DepositWalletTransactionRequest): Promise<DepositWalletTransactionResponse | null>
    // Define methods related to transactions
    createDepositTransaction(data: SendTransactionRequest): Promise<SendTransactionResponse | null>;
    createWithdrawalTransaction(data: SendTransactionRequest): Promise<SendTransactionResponse | null>;
    sendFiatWalletTransaction(data: SendFiatWalletTransactionRequest): Promise<SendFiatWalletTransactionResponse | null>;
    updateTransactionStatus(transactionId: string, transactionStatus: number): Promise<boolean>;
    getTransactionForCallback(partenerReference: string): Promise<TransactionCallbackResponse | null>
    getTransacctionById(transactionId: string): Promise<GetTransactionStatusResponse | null>
}