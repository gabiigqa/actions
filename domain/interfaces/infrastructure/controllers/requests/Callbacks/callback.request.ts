import { ATCTransationRequest } from "@/domain/interfaces/infrastructure/controllers/requests/Callbacks/ATCCallbackRequest";

export enum TransactionStatusEnum {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    PENDING = 'PENDING',
}

export interface CallbackRequest {
    referenceNumber: string;
    transactionStatus: TransactionStatusEnum;
    transaction: any | ATCTransationRequest ;
    partnerCode?: string;
}