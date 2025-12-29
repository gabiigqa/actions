import { AgreementSigningSessionCreateRequest } from "@/domain/interfaces/bvnk/request";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { TYPES } from "@/infrastructure/config/inversify";
import { BvnkServiceConnector } from "@infrastructure/third-party/bvnk/bvnk.services.connector";
import { inject, injectable } from "inversify";

@injectable()
export class BvnkServices {
    constructor(
        @inject(TYPES.BvnkServiceConnector) private bvnkServiceConnector: BvnkServiceConnector,
        @inject(TYPES.ILoggerService) private logger: ILoggerService
    ) { }

    public async listCustomers(name: string = ""): Promise<any> {
        let customers: any[] = [];
        try {
            if (name && name.trim().length > 0) {
                customers = await this.bvnkServiceConnector.getCustomers(name);
            } else {
                customers = await this.bvnkServiceConnector.getCustomers();
            }
        } catch (error) {
            this.logger.error("Error listing customers:", error);
            customers = [];
        }
        return customers;
    }

    public async createToS(data: AgreementSigningSessionCreateRequest): Promise<any> {
        try {
            const response = await this.bvnkServiceConnector.createAgreementSigningSession(data);
            return response;
        } catch (error) {
            this.logger.error("Error creating ToS agreement session:", error);
            return null;
        }
    }
}