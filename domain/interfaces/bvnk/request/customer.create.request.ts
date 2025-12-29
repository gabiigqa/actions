import { AssociateTitle, CompanyEntityType, CurrenciesFiat, CustomerDueDiligenceEmploymentStatus, CustomerDueDiligenceIntendedUseOfAccount, CustomerDueDiligencePepStatus, CustomerDueDiligenceSourceOfFunds, CustomerType } from "@/domain/interfaces/bvnk/enums";
import { CustomerRiskScore } from "@/domain/interfaces/bvnk/enums/customer.risk.score.enum";

export interface ExpectedMonthlyVolume {
    amount: string; // "10000.01"
    currency: CurrenciesFiat; // "USD"
}

export interface DueDiligenceInfo {
    employmentStatus: CustomerDueDiligenceEmploymentStatus; // "SELF_EMPLOYED"
    sourceOfFunds: CustomerDueDiligenceSourceOfFunds; // "SALARY"
    pepStatus: CustomerDueDiligencePepStatus; // "NOT_PEP"
    intendedUseOfAccount: CustomerDueDiligenceIntendedUseOfAccount; // "TRANSFERS_FAMILY_FRIENDS"
    expectedMonthlyVolume: ExpectedMonthlyVolume;
}

export interface AddressInfo {
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    city: string;
    countryCode: string; // 2-letter country code in the ISO 3166-1 alpha-2 format.
    country?: string;
    stateCode?: string;
}

export interface TaxIdentificationInfo {
    number: string; // Tax Number 
    taxResidenceCountryCode: string; // Tax residency country ISO 2-letter code
}

export interface IndividualInfo {
    description: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // Date of birth in YYYY-MM-DD format
    address: AddressInfo;
    taxIdentification: TaxIdentificationInfo;
    cdd: DueDiligenceInfo;
    nationality?: string; // Nationality (ISO 2-letter code)
    emailAddress: string;
    phoneNumber?: string;
}

export interface CompanyInfo {
    name: string;
    description?: string;
    entityType: CompanyEntityType; // e.g. "LIMITED_LIABILITY_COMPANY" or "CORPORATION"
    taxResidenceCountryCode: string; // The 2-character country code for the company's tax residence (ISO 3166-1 alpha-2).
    taxNumber?: string; // Tax number of the USA-based company. Required for the USA customers.
    registrationNumber: string; // Official company registration number.
    industryReference: string; // UUID reference
    monthlyExpectedVolumesReference: string; // UUID reference
    address: AddressInfo;
    operationalAddress?: AddressInfo;
    incorporationDate?: string; // Incorporation date of the company in the ISO-8601 format. YYYY-MM-DD format
    businessOperationsStartDate?: string; // Actual date when the company began conducting its business activities or commercial operations. ISO-8601 format.
    website?: string; // Website URL of the company.
    associates?: Associate[];
}

export interface PersonContactInfo {
    emailAddress: string;
    phoneNumber: string;
}

export interface Associate {
    firstName: string;
    lastName: string;
    dateOfBirth: string; // Date of birth in the ISO-8601 format.
    birthCountryCode: string; // 2-letter birth country code in the ISO 3166-1 alpha-2 format.
    nationality?: string; // 2-letter nationality code in the ISO 3166-1 alpha-2 format.
    address?: AddressInfo;
    contactInfo?: PersonContactInfo;
    taxIdentification?: TaxIdentificationInfo;
    titles?: AssociateTitle[]; // e.g. ["BUSINESS_OWNER", "DIRECTOR"]
}

export class CustomerCreateRequest {
    public type: CustomerType;

    // Optional/enum-like fields
    public riskScore: CustomerRiskScore;

    // Company is included in the sample JSON but may be optional for individuals
    public company?: CompanyInfo;

    // Individual data (required by sample)
    public individual?: IndividualInfo;

    public signedAgreementSessionReference: string; // UUID string

    constructor(data: Partial<CustomerCreateRequest> = {}) {
        this.type = data.type ?? CustomerType.Individual;
        this.signedAgreementSessionReference = data.signedAgreementSessionReference ?? '';
        this.riskScore = data.riskScore ?? CustomerRiskScore.High;
    }
}
