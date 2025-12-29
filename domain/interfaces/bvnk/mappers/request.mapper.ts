import { AgreementSigningSessionCreateRequest, CustomerCompanyCreateRequest } from '@/domain/interfaces/bvnk/request';
import { CreateAgreementSessionRequest } from '@bvnk/api';
import { CreateCustomerRequest } from '@bvnk/model/createCustomerRequest';
import { CustomerIndividualCreateRequest } from '@domain/interfaces/bvnk/request/customer.individual.create.request';
import { plainToInstance } from 'class-transformer';

/**
 * Helper: convert a plain object to an instance of a generated class with consistent error handling.
 */
function mapPlainToInstance<T>(cls: any, plain: any): T {
    try {
        // plainToInstance may return T | T[]; cast through unknown to satisfy strict typing
        return (plainToInstance(cls as any, plain) as unknown) as T;
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        console.error(`Mapping failed: ${msg}`, error);
        throw new Error(`Mapping failed: ${msg}`);
    }
}

export function mapCustomerIndividualToCreateCustomerRequest(
    input: CustomerIndividualCreateRequest
): CreateCustomerRequest {
    const plain: any = {
        type: 'individual',
        riskScore: input.riskScore,
        signedAgreementSessionReference: input.signedAgreementSessionReference,
        individual: input.individual ?? undefined,
        company: undefined
    };

    return mapPlainToInstance<CreateCustomerRequest>(CreateCustomerRequest, plain);
}

export function mapCustomerCompanyToCreateCustomerRequest(
    input: CustomerCompanyCreateRequest
): CreateCustomerRequest {
    const plain: any = {
        type: 'company',
        riskScore: input.riskScore,
        signedAgreementSessionReference: input.signedAgreementSessionReference,
        individual: undefined,
        company: input.company ?? undefined
    };

    return mapPlainToInstance<CreateCustomerRequest>(CreateCustomerRequest, plain);
}

export function mapAgreementSigningSessionCreateRequest(
    input: AgreementSigningSessionCreateRequest
): CreateAgreementSessionRequest {
    const plain: any = {
        customerType: input.type,
        countryCode: input.addressCountryCode,
        useCase: input.useCase
    };

    return mapPlainToInstance<CreateAgreementSessionRequest>(CreateAgreementSessionRequest, plain);
}
