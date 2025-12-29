export interface CurrencyCryptoProtocol {
    code: string;
    network: string;
}

export interface WithdrawalParameter {
    id: number;
    code: string;
    name: string;
}

export interface CurrencyOptions {
    address?: string;
    explorer?: string;
    confirmations?: number;
    transaction?: string;
}

export class CurrencyCryptoListResponse {
    id: number;
    code: string;
    fiat: boolean;
    icon: string;
    name: string;
    withdrawalFee: number;
    depositFee: number;
    supportsDeposits: boolean;
    supportsWithdrawals: boolean;
    quantityPrecision: number;
    pricePrecision: number;
    options: CurrencyOptions;
    protocols: CurrencyCryptoProtocol[];
    withdrawalParameters: WithdrawalParameter[];

    constructor(init?: Partial<CurrencyCryptoListResponse>) {
        this.id = init?.id ?? 0;
        this.code = init?.code ?? '';
        this.name = init?.name ?? '';
        this.icon = init?.icon ?? '';
        this.fiat = init?.fiat ?? false;
        this.depositFee = init?.depositFee ?? 0;
        this.withdrawalFee = init?.withdrawalFee ?? 0;
        this.supportsDeposits = init?.supportsDeposits ?? false;
        this.supportsWithdrawals = init?.supportsWithdrawals ?? false;
        this.quantityPrecision = init?.quantityPrecision ?? 0;
        this.pricePrecision = init?.pricePrecision ?? 0;

        this.options = init?.options ?? {};
        this.protocols = init?.protocols ?? [];
        this.withdrawalParameters = init?.withdrawalParameters ?? [];
    }
}
