export interface TenantDatabaseCredentials {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

export interface TenantTransactionData {
    transactionId: string;
    businessId: string;
    externalReference: string;
    transactionType: string;  // Código del tipo, no ID
    transactionStatus: string;  // Código del estado, no ID
    assetCode: string;
    fiatCurrencyCode: string;
    cryptoAmount: number;
    fiatAmount: number;
    feeAmount: number;
    exchangeRate: number;
    errorCode: string | null;
    errorMessage: string | null;
    isActive: boolean;
}

export interface TenantPayoutDetailsData {
    transactionId: string;
    numeroReferencia: string;
    cuentaDestino: string;
    titularDestino: string;
    monto: number;
    moneda: string;
    glosa: string | null;
}

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

export interface ITenantDatabaseService {
    getTenantCredentials(businessId: string): Promise<TenantDatabaseCredentials | null>;
    saveTransactionToTenant(credentials: TenantDatabaseCredentials, transactionData: TenantTransactionData): Promise<void>;
    savePayoutDetailsToTenant(credentials: TenantDatabaseCredentials, payoutDetails: TenantPayoutDetailsData): Promise<void>;
    saveTransactionAndPayoutDetails(
        credentials: TenantDatabaseCredentials,
        transactionData: TenantTransactionData,
        payoutDetails: TenantPayoutDetailsData
    ): Promise<void>;
    updateTransactionAndPayoutDetails(
        credentials: TenantDatabaseCredentials,
        transactionUpdate: UpdateTenantTransactionData,
        payoutDetailsUpdate: UpdateTenantPayoutDetailsData
    ): Promise<void>;
}
