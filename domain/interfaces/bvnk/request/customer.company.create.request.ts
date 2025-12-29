import { CustomerRiskScore, CustomerType } from "@/domain/interfaces/bvnk/enums";
import { CustomerCreateRequest } from "@/domain/interfaces/bvnk/request/customer.create.request";

export class CustomerCompanyCreateRequest extends CustomerCreateRequest {

    constructor(data: Partial<CustomerCompanyCreateRequest> = {}) {
        super(data);
        this.type = CustomerType.Company;
        this.riskScore = data.riskScore ?? CustomerRiskScore.High;
        this.signedAgreementSessionReference = data.signedAgreementSessionReference ?? '';

        this.company = data.company ?? undefined;
        this.individual = undefined; // Ensure individual is not set for company customers
    }
}
