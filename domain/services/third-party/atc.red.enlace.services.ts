import { TransactionStatus } from "@/domain/interfaces/domain";
import { IATCRedEnlaceService } from "@/domain/interfaces/domain/services/IATCRedEnlaceService";
import { IPartnerService } from "@/domain/interfaces/domain/services/IPartnerService";
import { ITransactionStatusService } from "@/domain/interfaces/domain/services/ITransactionStatusService";
import { ATCCallbackRequest, ATCStatus } from "@/domain/interfaces/infrastructure/controllers/requests/Callbacks/ATCCallbackRequest";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IATCRedEnlaceConnector } from "@/domain/interfaces/infrastructure/third-party/IATCRedEnlaceConnector";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { ConsultarQRResponse } from "@/infrastructure/third-party/atc-red-enlace/entitites/consultar.qr.response";
import { GenerarQRRequest } from "@/infrastructure/third-party/atc-red-enlace/entitites/generar.qr.request";
import { GenerarQRResponse } from "@/infrastructure/third-party/atc-red-enlace/entitites/generar.qr.response";
import { inject, injectable } from "inversify";

@injectable()
export class ATCRedEnlaceService implements IATCRedEnlaceService {
    constructor(
        @inject(TYPES.AppConfig) private appConfig: AppConfig,
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.IATCRedEnlaceConnector) private atcRedEnlaceConnector: IATCRedEnlaceConnector,
        @inject(TYPES.IPartnerService) private partnerService: IPartnerService,
        @inject(TYPES.ITransactionStatusService) private transactionStatusService: ITransactionStatusService
    ) { }
    async generateQR(data: GenerarQRRequest): Promise<GenerarQRResponse> {
        this.loggerService.info("Generating QR Code via ATC Red Enlace");
        return this.atcRedEnlaceConnector.generarQR(data);
    }

    async consultaQRByReferenceNumber(numeroReferencia: string): Promise<ConsultarQRResponse> {
        this.loggerService.info(`Consulting QR Code via ATC Red Enlace for reference number: ${numeroReferencia}`);
        return this.atcRedEnlaceConnector.consultarQR(numeroReferencia);
    }

    async updateCallbackData(data: ATCCallbackRequest, xApiKey: string): Promise<void> {
        try {
            this.loggerService.info("Updating ATC Red Enlace callback data");
            await this.partnerService.updateDataCallbackData(data.numeroReferencia, {
                ...data,
                status: this.mapStatusCode(data.estado),
                transactionStatusId: await this.mapTransactionStatus(data.estado)
            }, xApiKey);
        } catch (error) {
            this.loggerService.error("Error updating ATC Red Enlace callback data", error);
            throw new Error("Failed to update ATC Red Enlace callback data");
        }
    }

    protected async mapTransactionStatus(status: ATCStatus): Promise<number> {
        let transactionStatus: TransactionStatus | null;
        switch (status) {
            case ATCStatus.APROBADA:
                transactionStatus = await this.transactionStatusService.getTransactionStatusByCode('approved_qr_payment');
                break;
            case ATCStatus.EXPIRADA:
                transactionStatus = await this.transactionStatusService.getTransactionStatusByCode('expired_qr_payment');
                break;
            case ATCStatus.INVALIDO:
                transactionStatus = await this.transactionStatusService.getTransactionStatusByCode('invalid_qr_payment');
                break;
            default:
                throw new Error(`Unknown ATC status code: ${status}`);
        }

        if (!transactionStatus) throw new Error("Transaction status not found");
        return transactionStatus.id;
    }

    protected mapStatusCode(statusCode: ATCStatus): string {
        switch (statusCode) {
            case ATCStatus.APROBADA:
                return 'approved';
            case ATCStatus.EXPIRADA:
                return 'expired';
            case ATCStatus.INVALIDO:
                return 'invalid';
            default:
                throw new Error(`Unknown ATC status code: ${statusCode}`);
        }
    }
}