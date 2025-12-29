import { CustomerType } from "@/domain/interfaces/bvnk/enums";
import { AgreementApplies } from "@/domain/interfaces/bvnk/enums/agreement.applies.enum";

export class AgreementSigningSessionCreateRequest {
    public type: CustomerType;
    public addressCountryCode: string; // Country code of the customer's address in the ISO 3166-1 alpha-2 format.
    public useCase: AgreementApplies;

    constructor(data: Partial<AgreementSigningSessionCreateRequest> = {}) {
        this.type = data.type ?? CustomerType.Individual;
        this.addressCountryCode = data.addressCountryCode ?? '';
        this.useCase = data.useCase ?? AgreementApplies.StableCoinPayouts;
    }
}