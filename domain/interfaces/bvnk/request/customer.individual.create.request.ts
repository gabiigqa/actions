import { CustomerRiskScore, CustomerType } from "@/domain/interfaces/bvnk/enums";
import { CustomerCreateRequest } from "@/domain/interfaces/bvnk/request/customer.create.request";

export class CustomerIndividualCreateRequest extends CustomerCreateRequest {

    constructor(data: Partial<CustomerIndividualCreateRequest> = {}) {
        super(data);
        this.type = CustomerType.Individual;
        this.riskScore = data.riskScore ?? CustomerRiskScore.High;
        this.signedAgreementSessionReference = data.signedAgreementSessionReference ?? '';

        this.company = undefined; // Ensure company is not set for individual customers
        this.individual = data.individual ?? undefined;
    }
}
