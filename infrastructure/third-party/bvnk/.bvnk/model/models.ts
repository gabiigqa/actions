import localVarRequest from 'request';

export * from './acceptedQuoteDto';
export * from './accountMethodDto';
export * from './accountsServerErrorDto';
export * from './accountsValidationErrorDto';
export * from './address';
export * from './addressCountryCodeOnly';
export * from './addressV2';
export * from './alternativeAddressDto';
export * from './apiError';
export * from './balance';
export * from './balanceDto';
export * from './bankAccount';
export * from './bankDetails';
export * from './bulkExchangeDto';
export * from './businessCustomerDocument';
export * from './channelCreateRequest';
export * from './channelList200ResponseInner';
export * from './channelPaymentRead200Response';
export * from './channelPaymentRead200ResponseNetworkFee';
export * from './clientValidationErrorDto';
export * from './companyDetails';
export * from './companyPartyDetailDto';
export * from './completeOnboarding200Response';
export * from './completeOnboarding200ResponseResultsInner';
export * from './complianceDetailDto';
export * from './corporateCustomer';
export * from './corporateCustomerRepresentative';
export * from './countryCodeDto';
export * from './createAddress';
export * from './createAgreementSession200Response';
export * from './createAgreementSession200ResponseAgreementsInner';
export * from './createAgreementSessionRequest';
export * from './createCompanyCustomerRequest';
export * from './createCorporateCustomer';
export * from './createCorporateCustomerAssociates';
export * from './createCorporateRiskScore';
export * from './createCustomer202Response';
export * from './createCustomer400ResponseInner';
export * from './createCustomer400ResponseInnerDetails';
export * from './createCustomerRequest';
export * from './createCustomerRequestAnyOf';
export * from './createCustomerRequestAnyOf1';
export * from './createCustomerRequestAnyOf1Individual';
export * from './createCustomerRequestAnyOf1IndividualAddress';
export * from './createCustomerRequestAnyOf1IndividualCdd';
export * from './createCustomerRequestAnyOf1IndividualCddExpectedMonthlyVolume';
export * from './createCustomerRequestAnyOf1IndividualTaxIdentification';
export * from './createCustomerRequestAnyOfCompany';
export * from './createCustomerRequestAnyOfCompanyAddress';
export * from './createCustomerRequestAnyOfCompanyAssociates';
export * from './createCustomerRequestAnyOfCompanyAssociatesContactInfo';
export * from './createCustomerRequestAnyOfCompanyAssociatesOwnership';
export * from './createCustomerRequestAnyOfCompanyAssociatesTaxIdentification';
export * from './createCustomerWalletRequest';
export * from './createCustomerWalletRequestInstruction';
export * from './createEPMRequestDto';
export * from './createEmbeddedPartnerMerchant400Response';
export * from './createEmbeddedPartnerMerchant400ResponseDetails';
export * from './createEmbeddedPartnerMerchant500Response';
export * from './createEmbeddedPartnerMerchant500ResponseDetails';
export * from './createEmbeddedPartnerMerchantRequest';
export * from './createIndividualCustomer';
export * from './createIndividualCustomerRequest';
export * from './createReportSchedule201Response';
export * from './createReportSchedule409Response';
export * from './createReportScheduleRequest';
export * from './createTransferRequest';
export * from './createTransferResponse';
export * from './createWalletRequest';
export * from './cryptoAddressDto';
export * from './cryptoLedger';
export * from './currencyDto';
export * from './currencyFiatDto';
export * from './currencyOptions';
export * from './currencyProtocol';
export * from './customerDto';
export * from './customerInternalDto';
export * from './customerOverviewDto';
export * from './customerReferenceAndStatus';
export * from './customerStatusExternal';
export * from './customerStatusInternal';
export * from './customerType';
export * from './customersPage';
export * from './customersPageInternal';
export * from './detail';
export * from './directionDto';
export * from './embeddedPartnerWebhookDto';
export * from './entityTypeEnumDto';
export * from './errorCode';
export * from './estimateRefundFee200Response';
export * from './estimateRefundFee200ResponseFee';
export * from './estimateRefundFee200ResponseMaxAvailableToRefund';
export * from './estimateRefundFee400Response';
export * from './estimateRefundFee400ResponseDetails';
export * from './estimateRefundFee400ResponseDetailsErrors';
export * from './estimateRefundFeeRequest';
export * from './exchangeDto';
export * from './exchangeRateDto';
export * from './exchangeRequestDto';
export * from './externalCurrencyWithdrawalParameter';
export * from './feeDto';
export * from './feesDto';
export * from './fetchExchangeRate200Response';
export * from './fetchExchangeRateDto';
export * from './fetchExchangeRateRequest';
export * from './fiatLedger';
export * from './gatewayTransactionDto';
export * from './getAccountWebhook200Response';
export * from './getAccountWebhook200ResponseAccount';
export * from './getAgreementSessionStatus200Response';
export * from './getAgreements200ResponseInner';
export * from './getCustomerDocuments200Response';
export * from './getCustomerDocuments200ResponseContentInner';
export * from './getCustomerDocuments404ResponseInner';
export * from './getCustomerFeeWallets200Response';
export * from './getCustomerFeeWallets200ResponseCustomerFeeWalletsInner';
export * from './getCustomerFeeWallets403Response';
export * from './getMonthlyExpectedVolumes200ResponseInner';
export * from './getQuestionnaireDefinitions200ResponseInner';
export * from './getQuestionnaireDefinitions200ResponseInnerSectionsInner';
export * from './getQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInner';
export * from './getQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInnerOptionsInner';
export * from './getQuestionnaires200ResponseInner';
export * from './getQuestionnaires200ResponseInnerSectionsInner';
export * from './getSupportedTimezones200ResponseInner';
export * from './individualCustomerDocument';
export * from './individualDetails';
export * from './individualPartyDetailDto';
export * from './industry';
export * from './instruction';
export * from './intermediaryBank';
export * from './ledger';
export * from './ledgerWalletList200Response';
export * from './ledgerWalletList200ResponseContentInner';
export * from './ledgerWalletList200ResponseContentInnerBalance';
export * from './ledgerWalletList200ResponseContentInnerLedgersInner';
export * from './ledgerWalletList200ResponseContentInnerLedgersInnerOneOf';
export * from './ledgerWalletList200ResponseContentInnerLedgersInnerOneOf1';
export * from './ledgerWalletList200ResponsePageable';
export * from './listAccountCustomers200Response';
export * from './listAccountCustomers200ResponseContentInner';
export * from './listAccountCustomers200ResponsePage';
export * from './listCountries200ResponseInner';
export * from './listCountries200ResponseInnerDocumentsInner';
export * from './listCountries200ResponseInnerOptions';
export * from './listCurrenciesCrypto200ResponseInner';
export * from './listCurrenciesCrypto200ResponseInnerOptions';
export * from './listCurrenciesCrypto200ResponseInnerProtocolsInner';
export * from './listCurrenciesCrypto200ResponseInnerWithdrawalParametersInner';
export * from './listCurrenciesFiat200ResponseInner';
export * from './listExchangeRates200ResponseInner';
export * from './listReportSchedules200Response';
export * from './listReportSchedules200ResponseAllOfContentInner';
export * from './listReportSchedules200ResponseAllOfPageable';
export * from './listReportSchedules400Response';
export * from './listReportSchedules400ResponseDetails';
export * from './merchantChannelDto';
export * from './merchantChannelPaymentDto';
export * from './merchantChannelRequestDto';
export * from './merchantDto';
export * from './merchantIdCreate400Response';
export * from './merchantIdCreate400ResponseErrorListInner';
export * from './merchantIdCreateRequest';
export * from './merchantIdCreateRequestWallet';
export * from './merchantIdList200ResponseInner';
export * from './merchantIdList200ResponseInnerWallet';
export * from './metadata';
export * from './modelError';
export * from './money';
export * from './monthlyExpectedVolumes';
export * from './networkFeeDto';
export * from './page';
export * from './pageMetadata';
export * from './pageable';
export * from './partyDetailDto';
export * from './partyDetailDtoOneOf';
export * from './payAmountsDto';
export * from './payInDetailDto';
export * from './payInInstructionDto';
export * from './payInMethodDto';
export * from './payOutDetailDto';
export * from './payOutMethodDto';
export * from './payRequestDto';
export * from './paymentCreateRequest';
export * from './paymentCreateRequestComplianceDetails';
export * from './paymentCreateRequestComplianceDetailsPartyDetailsInner';
export * from './paymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf';
export * from './paymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf1';
export * from './paymentCreateRequestEmbeddedCustomerDetails';
export * from './paymentCreateRequestFees';
export * from './paymentCreateRequestFeesCustomerFee';
export * from './paymentCreateRequestMetadata';
export * from './paymentCreateRequestPayInDetails';
export * from './paymentCreateRequestPayOutDetails';
export * from './paymentLegDto';
export * from './paymentList200ResponseInner';
export * from './paymentList200ResponseInnerAddress';
export * from './paymentList200ResponseInnerAddressAlternativesInner';
export * from './paymentList200ResponseInnerDisplayCurrency';
export * from './paymentList200ResponseInnerDisplayRate';
export * from './paymentList200ResponseInnerTransactionsInner';
export * from './paymentList500Response';
export * from './paymentStatusDto';
export * from './paymentUpdateRequest';
export * from './payoutBeneficiaryDetails';
export * from './payoutCreate200Response';
export * from './payoutCreate200ResponseDetails';
export * from './payoutCreate200ResponseDetailsBeneficiary';
export * from './payoutCreate200ResponseDetailsBeneficiaryAddress';
export * from './payoutCreate200ResponseDetailsBeneficiaryBankAccount';
export * from './payoutCreate200ResponseDetailsBeneficiaryBankAccountBankAddress';
export * from './payoutCreate200ResponseDetailsBeneficiaryCompanyDetails';
export * from './payoutCreate400Response';
export * from './payoutCreate400ResponseDetails';
export * from './payoutCreateRequest';
export * from './payoutCreateRequestAmount';
export * from './payoutCreateRequestInstruction';
export * from './payoutCreateRequestInstructionBeneficiary';
export * from './payoutCreateRequestInstructionBeneficiaryDetails';
export * from './payoutCreateRequestInstructionBeneficiaryDetailsAddress';
export * from './payoutCreateRequestInstructionBeneficiaryDetailsBankDetails';
export * from './payoutCreateRequestInstructionBeneficiaryDetailsBankDetailsIntermediaryBanksInner';
export * from './payoutCreateRequestInstructionBeneficiaryDetailsBusinessDetails';
export * from './payoutCreateRequestInstructionBeneficiaryDetailsIndividualDetails';
export * from './payoutCreateRequestRequestDetails';
export * from './payoutCreateRequestRequestDetailsOriginator';
export * from './quoteAccept200Response';
export * from './quoteCreate200Response';
export * from './quoteCreate200ResponseFees';
export * from './quoteCreate200ResponseFeesPercentage';
export * from './quoteCreate200ResponsePayInInstruction';
export * from './quoteCreate200ResponsePayInLegsInner';
export * from './quoteCreate200ResponsePayInMethod';
export * from './quoteCreate200ResponsePayOutMethod';
export * from './quoteCreate200ResponseUsePayInMethod';
export * from './quoteCreateRequest';
export * from './quoteDto';
export * from './quoteRequestDto';
export * from './readExchangeRate200Response';
export * from './refundPayin200Response';
export * from './refundPayin200ResponseFee';
export * from './refundPayinRequest';
export * from './refundPayinRequestAmount';
export * from './serverErrorDto';
export * from './setCustomerFeeWallet200Response';
export * from './setCustomerFeeWallet200ResponseCustomerFeeWalletsInner';
export * from './setCustomerFeeWallet404Response';
export * from './setCustomerFeeWalletRequest';
export * from './simplifiedTransactionReportDto';
export * from './simulatePayinRequest';
export * from './simulatePayinRequestOriginator';
export * from './simulatePayinRequestOriginatorBankAccount';
export * from './submitQuestionnaireResponses200Response';
export * from './submitQuestionnaireResponsesRequestInner';
export * from './submitQuestionnaireResponsesRequestInnerSectionsInner';
export * from './submitQuestionnaireResponsesRequestInnerSectionsInnerItemsInner';
export * from './summaryPaymentDto';
export * from './transactionReportDto';
export * from './transactionReportRequestDataDto';
export * from './transferBeneficiaryResponse';
export * from './transferCreate200Response';
export * from './transferCreateRequest';
export * from './transferCreateRequestInstruction';
export * from './transferDetails';
export * from './transferRead200Response';
export * from './transferRead200ResponseDetails';
export * from './transferRead200ResponseDetailsBeneficiary';
export * from './transferRead200ResponseDetailsBeneficiaryAddress';
export * from './transferResponse';
export * from './transfersBeneficiaryRead200ResponseInner';
export * from './unifiedPayoutDetails';
export * from './unifiedPayoutRequest';
export * from './unifiedPayoutResponse';
export * from './updateAgreementSessionRequest';
export * from './updateReportSchedule200Response';
export * from './updateReportScheduleRequest';
export * from './uploadCustomerDocuments202Response';
export * from './uploadCustomerDocuments400Response';
export * from './uploadCustomerDocuments400ResponseDetails';
export * from './uploadCustomerDocumentsRequestInner';
export * from './validationErrorDto';
export * from './walletBalanceList200ResponseInner';
export * from './walletCreateRequest';
export * from './walletDto';
export * from './walletListTransactions200Response';
export * from './walletListTransactions200ResponseContentInner';
export * from './walletListTransactions200ResponseContentInnerAmount';
export * from './walletListTransactions200ResponseContentInnerBeneficiary';
export * from './walletListTransactions200ResponseContentInnerBeneficiaryBankAccount';
export * from './walletListTransactions200ResponseContentInnerBeneficiaryEntity';
export * from './walletListTransactions200ResponseContentInnerDetails';
export * from './walletListTransactions200ResponseContentInnerOriginator';
export * from './walletListTransactions200ResponseContentInnerOriginatorBankAccount';
export * from './walletListTransactions200ResponseContentInnerOriginatorEntity';
export * from './walletListTransactions200ResponseContentInnerRunningBalance';
export * from './walletListTransactions200ResponsePageable';
export * from './walletProfiles200Response';
export * from './walletProfiles200ResponseProfilesInner';
export * from './walletRequestDto';
export * from './walletResponse';
export * from './walletTransactionReport201ResponseInner';
export * from './walletTransactionReport201ResponseInnerRequestData';
export * from './walletTransactionReportV2200ResponseInner';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { AcceptedQuoteDto } from './acceptedQuoteDto';
import { AccountMethodDto } from './accountMethodDto';
import { AccountsServerErrorDto } from './accountsServerErrorDto';
import { AccountsValidationErrorDto } from './accountsValidationErrorDto';
import { Address } from './address';
import { AddressCountryCodeOnly } from './addressCountryCodeOnly';
import { AddressV2 } from './addressV2';
import { AlternativeAddressDto } from './alternativeAddressDto';
import { ApiError } from './apiError';
import { Balance } from './balance';
import { BalanceDto } from './balanceDto';
import { BankAccount } from './bankAccount';
import { BankDetails } from './bankDetails';
import { BulkExchangeDto } from './bulkExchangeDto';
import { BusinessCustomerDocument } from './businessCustomerDocument';
import { ChannelCreateRequest } from './channelCreateRequest';
import { ChannelList200ResponseInner } from './channelList200ResponseInner';
import { ChannelPaymentRead200Response } from './channelPaymentRead200Response';
import { ChannelPaymentRead200ResponseNetworkFee } from './channelPaymentRead200ResponseNetworkFee';
import { ClientValidationErrorDto } from './clientValidationErrorDto';
import { CompanyDetails } from './companyDetails';
import { CompanyPartyDetailDto } from './companyPartyDetailDto';
import { CompleteOnboarding200Response } from './completeOnboarding200Response';
import { CompleteOnboarding200ResponseResultsInner } from './completeOnboarding200ResponseResultsInner';
import { ComplianceDetailDto } from './complianceDetailDto';
import { CorporateCustomer } from './corporateCustomer';
import { CorporateCustomerRepresentative } from './corporateCustomerRepresentative';
import { CountryCodeDto } from './countryCodeDto';
import { CreateAddress } from './createAddress';
import { CreateAgreementSession200Response } from './createAgreementSession200Response';
import { CreateAgreementSession200ResponseAgreementsInner } from './createAgreementSession200ResponseAgreementsInner';
import { CreateAgreementSessionRequest } from './createAgreementSessionRequest';
import { CreateCompanyCustomerRequest } from './createCompanyCustomerRequest';
import { CreateCorporateCustomer } from './createCorporateCustomer';
import { CreateCorporateCustomerAssociates } from './createCorporateCustomerAssociates';
import { CreateCorporateRiskScore } from './createCorporateRiskScore';
import { CreateCustomer202Response } from './createCustomer202Response';
import { CreateCustomer400ResponseInner } from './createCustomer400ResponseInner';
import { CreateCustomer400ResponseInnerDetails } from './createCustomer400ResponseInnerDetails';
import { CreateCustomerRequest } from './createCustomerRequest';
import { CreateCustomerRequestAnyOf } from './createCustomerRequestAnyOf';
import { CreateCustomerRequestAnyOf1 } from './createCustomerRequestAnyOf1';
import { CreateCustomerRequestAnyOf1Individual } from './createCustomerRequestAnyOf1Individual';
import { CreateCustomerRequestAnyOf1IndividualAddress } from './createCustomerRequestAnyOf1IndividualAddress';
import { CreateCustomerRequestAnyOf1IndividualCdd } from './createCustomerRequestAnyOf1IndividualCdd';
import { CreateCustomerRequestAnyOf1IndividualCddExpectedMonthlyVolume } from './createCustomerRequestAnyOf1IndividualCddExpectedMonthlyVolume';
import { CreateCustomerRequestAnyOf1IndividualTaxIdentification } from './createCustomerRequestAnyOf1IndividualTaxIdentification';
import { CreateCustomerRequestAnyOfCompany } from './createCustomerRequestAnyOfCompany';
import { CreateCustomerRequestAnyOfCompanyAddress } from './createCustomerRequestAnyOfCompanyAddress';
import { CreateCustomerRequestAnyOfCompanyAssociates } from './createCustomerRequestAnyOfCompanyAssociates';
import { CreateCustomerRequestAnyOfCompanyAssociatesContactInfo } from './createCustomerRequestAnyOfCompanyAssociatesContactInfo';
import { CreateCustomerRequestAnyOfCompanyAssociatesOwnership } from './createCustomerRequestAnyOfCompanyAssociatesOwnership';
import { CreateCustomerRequestAnyOfCompanyAssociatesTaxIdentification } from './createCustomerRequestAnyOfCompanyAssociatesTaxIdentification';
import { CreateCustomerWalletRequest } from './createCustomerWalletRequest';
import { CreateCustomerWalletRequestInstruction } from './createCustomerWalletRequestInstruction';
import { CreateEPMRequestDto } from './createEPMRequestDto';
import { CreateEmbeddedPartnerMerchant400Response } from './createEmbeddedPartnerMerchant400Response';
import { CreateEmbeddedPartnerMerchant400ResponseDetails } from './createEmbeddedPartnerMerchant400ResponseDetails';
import { CreateEmbeddedPartnerMerchant500Response } from './createEmbeddedPartnerMerchant500Response';
import { CreateEmbeddedPartnerMerchant500ResponseDetails } from './createEmbeddedPartnerMerchant500ResponseDetails';
import { CreateEmbeddedPartnerMerchantRequest } from './createEmbeddedPartnerMerchantRequest';
import { CreateIndividualCustomer } from './createIndividualCustomer';
import { CreateIndividualCustomerRequest } from './createIndividualCustomerRequest';
import { CreateReportSchedule201Response } from './createReportSchedule201Response';
import { CreateReportSchedule409Response } from './createReportSchedule409Response';
import { CreateReportScheduleRequest } from './createReportScheduleRequest';
import { CreateTransferRequest } from './createTransferRequest';
import { CreateTransferResponse } from './createTransferResponse';
import { CreateWalletRequest } from './createWalletRequest';
import { CryptoAddressDto } from './cryptoAddressDto';
import { CryptoLedger } from './cryptoLedger';
import { CurrencyDto } from './currencyDto';
import { CurrencyFiatDto } from './currencyFiatDto';
import { CurrencyOptions } from './currencyOptions';
import { CurrencyProtocol } from './currencyProtocol';
import { CustomerDto } from './customerDto';
import { CustomerInternalDto } from './customerInternalDto';
import { CustomerOverviewDto } from './customerOverviewDto';
import { CustomerReferenceAndStatus } from './customerReferenceAndStatus';
import { CustomerStatusExternal } from './customerStatusExternal';
import { CustomerStatusInternal } from './customerStatusInternal';
import { CustomerType } from './customerType';
import { CustomersPage } from './customersPage';
import { CustomersPageInternal } from './customersPageInternal';
import { Detail } from './detail';
import { DirectionDto } from './directionDto';
import { EmbeddedPartnerWebhookDto } from './embeddedPartnerWebhookDto';
import { EntityTypeEnumDto } from './entityTypeEnumDto';
import { ErrorCode } from './errorCode';
import { EstimateRefundFee200Response } from './estimateRefundFee200Response';
import { EstimateRefundFee200ResponseFee } from './estimateRefundFee200ResponseFee';
import { EstimateRefundFee200ResponseMaxAvailableToRefund } from './estimateRefundFee200ResponseMaxAvailableToRefund';
import { EstimateRefundFee400Response } from './estimateRefundFee400Response';
import { EstimateRefundFee400ResponseDetails } from './estimateRefundFee400ResponseDetails';
import { EstimateRefundFee400ResponseDetailsErrors } from './estimateRefundFee400ResponseDetailsErrors';
import { EstimateRefundFeeRequest } from './estimateRefundFeeRequest';
import { ExchangeDto } from './exchangeDto';
import { ExchangeRateDto } from './exchangeRateDto';
import { ExchangeRequestDto } from './exchangeRequestDto';
import { ExternalCurrencyWithdrawalParameter } from './externalCurrencyWithdrawalParameter';
import { FeeDto } from './feeDto';
import { FeesDto } from './feesDto';
import { FetchExchangeRate200Response } from './fetchExchangeRate200Response';
import { FetchExchangeRateDto } from './fetchExchangeRateDto';
import { FetchExchangeRateRequest } from './fetchExchangeRateRequest';
import { FiatLedger } from './fiatLedger';
import { GatewayTransactionDto } from './gatewayTransactionDto';
import { GetAccountWebhook200Response } from './getAccountWebhook200Response';
import { GetAccountWebhook200ResponseAccount } from './getAccountWebhook200ResponseAccount';
import { GetAgreementSessionStatus200Response } from './getAgreementSessionStatus200Response';
import { GetAgreements200ResponseInner } from './getAgreements200ResponseInner';
import { GetCustomerDocuments200Response } from './getCustomerDocuments200Response';
import { GetCustomerDocuments200ResponseContentInner } from './getCustomerDocuments200ResponseContentInner';
import { GetCustomerDocuments404ResponseInner } from './getCustomerDocuments404ResponseInner';
import { GetCustomerFeeWallets200Response } from './getCustomerFeeWallets200Response';
import { GetCustomerFeeWallets200ResponseCustomerFeeWalletsInner } from './getCustomerFeeWallets200ResponseCustomerFeeWalletsInner';
import { GetCustomerFeeWallets403Response } from './getCustomerFeeWallets403Response';
import { GetMonthlyExpectedVolumes200ResponseInner } from './getMonthlyExpectedVolumes200ResponseInner';
import { GetQuestionnaireDefinitions200ResponseInner } from './getQuestionnaireDefinitions200ResponseInner';
import { GetQuestionnaireDefinitions200ResponseInnerSectionsInner } from './getQuestionnaireDefinitions200ResponseInnerSectionsInner';
import { GetQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInner } from './getQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInner';
import { GetQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInnerOptionsInner } from './getQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInnerOptionsInner';
import { GetQuestionnaires200ResponseInner } from './getQuestionnaires200ResponseInner';
import { GetQuestionnaires200ResponseInnerSectionsInner } from './getQuestionnaires200ResponseInnerSectionsInner';
import { GetSupportedTimezones200ResponseInner } from './getSupportedTimezones200ResponseInner';
import { IndividualCustomerDocument } from './individualCustomerDocument';
import { IndividualDetails } from './individualDetails';
import { IndividualPartyDetailDto } from './individualPartyDetailDto';
import { Industry } from './industry';
import { Instruction } from './instruction';
import { IntermediaryBank } from './intermediaryBank';
import { Ledger } from './ledger';
import { LedgerWalletList200Response } from './ledgerWalletList200Response';
import { LedgerWalletList200ResponseContentInner } from './ledgerWalletList200ResponseContentInner';
import { LedgerWalletList200ResponseContentInnerBalance } from './ledgerWalletList200ResponseContentInnerBalance';
import { LedgerWalletList200ResponseContentInnerLedgersInner } from './ledgerWalletList200ResponseContentInnerLedgersInner';
import { LedgerWalletList200ResponseContentInnerLedgersInnerOneOf } from './ledgerWalletList200ResponseContentInnerLedgersInnerOneOf';
import { LedgerWalletList200ResponseContentInnerLedgersInnerOneOf1 } from './ledgerWalletList200ResponseContentInnerLedgersInnerOneOf1';
import { LedgerWalletList200ResponsePageable } from './ledgerWalletList200ResponsePageable';
import { ListAccountCustomers200Response } from './listAccountCustomers200Response';
import { ListAccountCustomers200ResponseContentInner } from './listAccountCustomers200ResponseContentInner';
import { ListAccountCustomers200ResponsePage } from './listAccountCustomers200ResponsePage';
import { ListCountries200ResponseInner } from './listCountries200ResponseInner';
import { ListCountries200ResponseInnerDocumentsInner } from './listCountries200ResponseInnerDocumentsInner';
import { ListCountries200ResponseInnerOptions } from './listCountries200ResponseInnerOptions';
import { ListCurrenciesCrypto200ResponseInner } from './listCurrenciesCrypto200ResponseInner';
import { ListCurrenciesCrypto200ResponseInnerOptions } from './listCurrenciesCrypto200ResponseInnerOptions';
import { ListCurrenciesCrypto200ResponseInnerProtocolsInner } from './listCurrenciesCrypto200ResponseInnerProtocolsInner';
import { ListCurrenciesCrypto200ResponseInnerWithdrawalParametersInner } from './listCurrenciesCrypto200ResponseInnerWithdrawalParametersInner';
import { ListCurrenciesFiat200ResponseInner } from './listCurrenciesFiat200ResponseInner';
import { ListExchangeRates200ResponseInner } from './listExchangeRates200ResponseInner';
import { ListReportSchedules200Response } from './listReportSchedules200Response';
import { ListReportSchedules200ResponseAllOfContentInner } from './listReportSchedules200ResponseAllOfContentInner';
import { ListReportSchedules200ResponseAllOfPageable } from './listReportSchedules200ResponseAllOfPageable';
import { ListReportSchedules400Response } from './listReportSchedules400Response';
import { ListReportSchedules400ResponseDetails } from './listReportSchedules400ResponseDetails';
import { MerchantChannelDto } from './merchantChannelDto';
import { MerchantChannelPaymentDto } from './merchantChannelPaymentDto';
import { MerchantChannelRequestDto } from './merchantChannelRequestDto';
import { MerchantDto } from './merchantDto';
import { MerchantIdCreate400Response } from './merchantIdCreate400Response';
import { MerchantIdCreate400ResponseErrorListInner } from './merchantIdCreate400ResponseErrorListInner';
import { MerchantIdCreateRequest } from './merchantIdCreateRequest';
import { MerchantIdCreateRequestWallet } from './merchantIdCreateRequestWallet';
import { MerchantIdList200ResponseInner } from './merchantIdList200ResponseInner';
import { MerchantIdList200ResponseInnerWallet } from './merchantIdList200ResponseInnerWallet';
import { Metadata } from './metadata';
import { ModelError } from './modelError';
import { Money } from './money';
import { MonthlyExpectedVolumes } from './monthlyExpectedVolumes';
import { NetworkFeeDto } from './networkFeeDto';
import { Page } from './page';
import { PageMetadata } from './pageMetadata';
import { Pageable } from './pageable';
import { PartyDetailDto } from './partyDetailDto';
import { PartyDetailDtoOneOf } from './partyDetailDtoOneOf';
import { PayAmountsDto } from './payAmountsDto';
import { PayInDetailDto } from './payInDetailDto';
import { PayInInstructionDto } from './payInInstructionDto';
import { PayInMethodDto } from './payInMethodDto';
import { PayOutDetailDto } from './payOutDetailDto';
import { PayOutMethodDto } from './payOutMethodDto';
import { PayRequestDto } from './payRequestDto';
import { PaymentCreateRequest } from './paymentCreateRequest';
import { PaymentCreateRequestComplianceDetails } from './paymentCreateRequestComplianceDetails';
import { PaymentCreateRequestComplianceDetailsPartyDetailsInner } from './paymentCreateRequestComplianceDetailsPartyDetailsInner';
import { PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf } from './paymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf';
import { PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf1 } from './paymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf1';
import { PaymentCreateRequestEmbeddedCustomerDetails } from './paymentCreateRequestEmbeddedCustomerDetails';
import { PaymentCreateRequestFees } from './paymentCreateRequestFees';
import { PaymentCreateRequestFeesCustomerFee } from './paymentCreateRequestFeesCustomerFee';
import { PaymentCreateRequestMetadata } from './paymentCreateRequestMetadata';
import { PaymentCreateRequestPayInDetails } from './paymentCreateRequestPayInDetails';
import { PaymentCreateRequestPayOutDetails } from './paymentCreateRequestPayOutDetails';
import { PaymentLegDto } from './paymentLegDto';
import { PaymentList200ResponseInner } from './paymentList200ResponseInner';
import { PaymentList200ResponseInnerAddress } from './paymentList200ResponseInnerAddress';
import { PaymentList200ResponseInnerAddressAlternativesInner } from './paymentList200ResponseInnerAddressAlternativesInner';
import { PaymentList200ResponseInnerDisplayCurrency } from './paymentList200ResponseInnerDisplayCurrency';
import { PaymentList200ResponseInnerDisplayRate } from './paymentList200ResponseInnerDisplayRate';
import { PaymentList200ResponseInnerTransactionsInner } from './paymentList200ResponseInnerTransactionsInner';
import { PaymentList500Response } from './paymentList500Response';
import { PaymentStatusDto } from './paymentStatusDto';
import { PaymentUpdateRequest } from './paymentUpdateRequest';
import { PayoutBeneficiaryDetails } from './payoutBeneficiaryDetails';
import { PayoutCreate200Response } from './payoutCreate200Response';
import { PayoutCreate200ResponseDetails } from './payoutCreate200ResponseDetails';
import { PayoutCreate200ResponseDetailsBeneficiary } from './payoutCreate200ResponseDetailsBeneficiary';
import { PayoutCreate200ResponseDetailsBeneficiaryAddress } from './payoutCreate200ResponseDetailsBeneficiaryAddress';
import { PayoutCreate200ResponseDetailsBeneficiaryBankAccount } from './payoutCreate200ResponseDetailsBeneficiaryBankAccount';
import { PayoutCreate200ResponseDetailsBeneficiaryBankAccountBankAddress } from './payoutCreate200ResponseDetailsBeneficiaryBankAccountBankAddress';
import { PayoutCreate200ResponseDetailsBeneficiaryCompanyDetails } from './payoutCreate200ResponseDetailsBeneficiaryCompanyDetails';
import { PayoutCreate400Response } from './payoutCreate400Response';
import { PayoutCreate400ResponseDetails } from './payoutCreate400ResponseDetails';
import { PayoutCreateRequest } from './payoutCreateRequest';
import { PayoutCreateRequestAmount } from './payoutCreateRequestAmount';
import { PayoutCreateRequestInstruction } from './payoutCreateRequestInstruction';
import { PayoutCreateRequestInstructionBeneficiary } from './payoutCreateRequestInstructionBeneficiary';
import { PayoutCreateRequestInstructionBeneficiaryDetails } from './payoutCreateRequestInstructionBeneficiaryDetails';
import { PayoutCreateRequestInstructionBeneficiaryDetailsAddress } from './payoutCreateRequestInstructionBeneficiaryDetailsAddress';
import { PayoutCreateRequestInstructionBeneficiaryDetailsBankDetails } from './payoutCreateRequestInstructionBeneficiaryDetailsBankDetails';
import { PayoutCreateRequestInstructionBeneficiaryDetailsBankDetailsIntermediaryBanksInner } from './payoutCreateRequestInstructionBeneficiaryDetailsBankDetailsIntermediaryBanksInner';
import { PayoutCreateRequestInstructionBeneficiaryDetailsBusinessDetails } from './payoutCreateRequestInstructionBeneficiaryDetailsBusinessDetails';
import { PayoutCreateRequestInstructionBeneficiaryDetailsIndividualDetails } from './payoutCreateRequestInstructionBeneficiaryDetailsIndividualDetails';
import { PayoutCreateRequestRequestDetails } from './payoutCreateRequestRequestDetails';
import { PayoutCreateRequestRequestDetailsOriginator } from './payoutCreateRequestRequestDetailsOriginator';
import { QuoteAccept200Response } from './quoteAccept200Response';
import { QuoteCreate200Response } from './quoteCreate200Response';
import { QuoteCreate200ResponseFees } from './quoteCreate200ResponseFees';
import { QuoteCreate200ResponseFeesPercentage } from './quoteCreate200ResponseFeesPercentage';
import { QuoteCreate200ResponsePayInInstruction } from './quoteCreate200ResponsePayInInstruction';
import { QuoteCreate200ResponsePayInLegsInner } from './quoteCreate200ResponsePayInLegsInner';
import { QuoteCreate200ResponsePayInMethod } from './quoteCreate200ResponsePayInMethod';
import { QuoteCreate200ResponsePayOutMethod } from './quoteCreate200ResponsePayOutMethod';
import { QuoteCreate200ResponseUsePayInMethod } from './quoteCreate200ResponseUsePayInMethod';
import { QuoteCreateRequest } from './quoteCreateRequest';
import { QuoteDto } from './quoteDto';
import { QuoteRequestDto } from './quoteRequestDto';
import { ReadExchangeRate200Response } from './readExchangeRate200Response';
import { RefundPayin200Response } from './refundPayin200Response';
import { RefundPayin200ResponseFee } from './refundPayin200ResponseFee';
import { RefundPayinRequest } from './refundPayinRequest';
import { RefundPayinRequestAmount } from './refundPayinRequestAmount';
import { ServerErrorDto } from './serverErrorDto';
import { SetCustomerFeeWallet200Response } from './setCustomerFeeWallet200Response';
import { SetCustomerFeeWallet200ResponseCustomerFeeWalletsInner } from './setCustomerFeeWallet200ResponseCustomerFeeWalletsInner';
import { SetCustomerFeeWallet404Response } from './setCustomerFeeWallet404Response';
import { SetCustomerFeeWalletRequest } from './setCustomerFeeWalletRequest';
import { SimplifiedTransactionReportDto } from './simplifiedTransactionReportDto';
import { SimulatePayinRequest } from './simulatePayinRequest';
import { SimulatePayinRequestOriginator } from './simulatePayinRequestOriginator';
import { SimulatePayinRequestOriginatorBankAccount } from './simulatePayinRequestOriginatorBankAccount';
import { SubmitQuestionnaireResponses200Response } from './submitQuestionnaireResponses200Response';
import { SubmitQuestionnaireResponsesRequestInner } from './submitQuestionnaireResponsesRequestInner';
import { SubmitQuestionnaireResponsesRequestInnerSectionsInner } from './submitQuestionnaireResponsesRequestInnerSectionsInner';
import { SubmitQuestionnaireResponsesRequestInnerSectionsInnerItemsInner } from './submitQuestionnaireResponsesRequestInnerSectionsInnerItemsInner';
import { SummaryPaymentDto } from './summaryPaymentDto';
import { TransactionReportDto } from './transactionReportDto';
import { TransactionReportRequestDataDto } from './transactionReportRequestDataDto';
import { TransferBeneficiaryResponse } from './transferBeneficiaryResponse';
import { TransferCreate200Response } from './transferCreate200Response';
import { TransferCreateRequest } from './transferCreateRequest';
import { TransferCreateRequestInstruction } from './transferCreateRequestInstruction';
import { TransferDetails } from './transferDetails';
import { TransferRead200Response } from './transferRead200Response';
import { TransferRead200ResponseDetails } from './transferRead200ResponseDetails';
import { TransferRead200ResponseDetailsBeneficiary } from './transferRead200ResponseDetailsBeneficiary';
import { TransferRead200ResponseDetailsBeneficiaryAddress } from './transferRead200ResponseDetailsBeneficiaryAddress';
import { TransferResponse } from './transferResponse';
import { TransfersBeneficiaryRead200ResponseInner } from './transfersBeneficiaryRead200ResponseInner';
import { UnifiedPayoutDetails } from './unifiedPayoutDetails';
import { UnifiedPayoutRequest } from './unifiedPayoutRequest';
import { UnifiedPayoutResponse } from './unifiedPayoutResponse';
import { UpdateAgreementSessionRequest } from './updateAgreementSessionRequest';
import { UpdateReportSchedule200Response } from './updateReportSchedule200Response';
import { UpdateReportScheduleRequest } from './updateReportScheduleRequest';
import { UploadCustomerDocuments202Response } from './uploadCustomerDocuments202Response';
import { UploadCustomerDocuments400Response } from './uploadCustomerDocuments400Response';
import { UploadCustomerDocuments400ResponseDetails } from './uploadCustomerDocuments400ResponseDetails';
import { UploadCustomerDocumentsRequestInner } from './uploadCustomerDocumentsRequestInner';
import { ValidationErrorDto } from './validationErrorDto';
import { WalletBalanceList200ResponseInner } from './walletBalanceList200ResponseInner';
import { WalletCreateRequest } from './walletCreateRequest';
import { WalletDto } from './walletDto';
import { WalletListTransactions200Response } from './walletListTransactions200Response';
import { WalletListTransactions200ResponseContentInner } from './walletListTransactions200ResponseContentInner';
import { WalletListTransactions200ResponseContentInnerAmount } from './walletListTransactions200ResponseContentInnerAmount';
import { WalletListTransactions200ResponseContentInnerBeneficiary } from './walletListTransactions200ResponseContentInnerBeneficiary';
import { WalletListTransactions200ResponseContentInnerBeneficiaryBankAccount } from './walletListTransactions200ResponseContentInnerBeneficiaryBankAccount';
import { WalletListTransactions200ResponseContentInnerBeneficiaryEntity } from './walletListTransactions200ResponseContentInnerBeneficiaryEntity';
import { WalletListTransactions200ResponseContentInnerDetails } from './walletListTransactions200ResponseContentInnerDetails';
import { WalletListTransactions200ResponseContentInnerOriginator } from './walletListTransactions200ResponseContentInnerOriginator';
import { WalletListTransactions200ResponseContentInnerOriginatorBankAccount } from './walletListTransactions200ResponseContentInnerOriginatorBankAccount';
import { WalletListTransactions200ResponseContentInnerOriginatorEntity } from './walletListTransactions200ResponseContentInnerOriginatorEntity';
import { WalletListTransactions200ResponseContentInnerRunningBalance } from './walletListTransactions200ResponseContentInnerRunningBalance';
import { WalletListTransactions200ResponsePageable } from './walletListTransactions200ResponsePageable';
import { WalletProfiles200Response } from './walletProfiles200Response';
import { WalletProfiles200ResponseProfilesInner } from './walletProfiles200ResponseProfilesInner';
import { WalletRequestDto } from './walletRequestDto';
import { WalletResponse } from './walletResponse';
import { WalletTransactionReport201ResponseInner } from './walletTransactionReport201ResponseInner';
import { WalletTransactionReport201ResponseInnerRequestData } from './walletTransactionReport201ResponseInnerRequestData';
import { WalletTransactionReportV2200ResponseInner } from './walletTransactionReportV2200ResponseInner';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: {[index: string]: any} = {
        "Balance.CurrencyCodeEnum": Balance.CurrencyCodeEnum,
        "BankAccount.FormatEnum": BankAccount.FormatEnum,
        "BankDetails.AccountTypeEnum": BankDetails.AccountTypeEnum,
        "BankDetails.BankTypeIdentifierEnum": BankDetails.BankTypeIdentifierEnum,
        "ChannelList200ResponseInner.StatusEnum": ChannelList200ResponseInner.StatusEnum,
        "ChannelPaymentRead200Response.StatusEnum": ChannelPaymentRead200Response.StatusEnum,
        "CompanyPartyDetailDto.EntityTypeEnum": CompanyPartyDetailDto.EntityTypeEnum,
        "CompleteOnboarding200ResponseResultsInner.StatusEnum": CompleteOnboarding200ResponseResultsInner.StatusEnum,
        "CreateAgreementSession200Response.StatusEnum": CreateAgreementSession200Response.StatusEnum,
        "CreateAgreementSessionRequest.TypeEnum": CreateAgreementSessionRequest.TypeEnum,
        "CreateAgreementSessionRequest.UseCaseEnum": CreateAgreementSessionRequest.UseCaseEnum,
        "CreateCompanyCustomerRequest.TypeEnum": CreateCompanyCustomerRequest.TypeEnum,
        "CreateCompanyCustomerRequest.RiskScoreEnum": CreateCompanyCustomerRequest.RiskScoreEnum,
        "CreateCorporateCustomer.EntityTypeEnum": CreateCorporateCustomer.EntityTypeEnum,
        "CreateCorporateCustomerAssociates.TitlesEnum": CreateCorporateCustomerAssociates.TitlesEnum,
        "CreateCorporateRiskScore": CreateCorporateRiskScore,
        "CreateCustomer202Response.StatusEnum": CreateCustomer202Response.StatusEnum,
        "CreateCustomerRequest.TypeEnum": CreateCustomerRequest.TypeEnum,
        "CreateCustomerRequest.RiskScoreEnum": CreateCustomerRequest.RiskScoreEnum,
        "CreateCustomerRequestAnyOf.TypeEnum": CreateCustomerRequestAnyOf.TypeEnum,
        "CreateCustomerRequestAnyOf.RiskScoreEnum": CreateCustomerRequestAnyOf.RiskScoreEnum,
        "CreateCustomerRequestAnyOf1.TypeEnum": CreateCustomerRequestAnyOf1.TypeEnum,
        "CreateCustomerRequestAnyOf1.RiskScoreEnum": CreateCustomerRequestAnyOf1.RiskScoreEnum,
        "CreateCustomerRequestAnyOf1IndividualCdd.EmploymentStatusEnum": CreateCustomerRequestAnyOf1IndividualCdd.EmploymentStatusEnum,
        "CreateCustomerRequestAnyOf1IndividualCdd.SourceOfFundsEnum": CreateCustomerRequestAnyOf1IndividualCdd.SourceOfFundsEnum,
        "CreateCustomerRequestAnyOf1IndividualCdd.PepStatusEnum": CreateCustomerRequestAnyOf1IndividualCdd.PepStatusEnum,
        "CreateCustomerRequestAnyOf1IndividualCdd.IntendedUseOfAccountEnum": CreateCustomerRequestAnyOf1IndividualCdd.IntendedUseOfAccountEnum,
        "CreateCustomerRequestAnyOfCompany.EntityTypeEnum": CreateCustomerRequestAnyOfCompany.EntityTypeEnum,
        "CreateCustomerRequestAnyOfCompanyAssociates.TitlesEnum": CreateCustomerRequestAnyOfCompanyAssociates.TitlesEnum,
        "CreateCustomerRequestAnyOfCompanyAssociatesOwnership.TypeEnum": CreateCustomerRequestAnyOfCompanyAssociatesOwnership.TypeEnum,
        "CreateCustomerWalletRequest.CurrencyCodeEnum": CreateCustomerWalletRequest.CurrencyCodeEnum,
        "CreateCustomerWalletRequestInstruction.TypeEnum": CreateCustomerWalletRequestInstruction.TypeEnum,
        "CreateIndividualCustomerRequest.TypeEnum": CreateIndividualCustomerRequest.TypeEnum,
        "CreateIndividualCustomerRequest.RiskScoreEnum": CreateIndividualCustomerRequest.RiskScoreEnum,
        "CreateReportSchedule201Response.FrequencyTypeEnum": CreateReportSchedule201Response.FrequencyTypeEnum,
        "CreateReportSchedule201Response.FormatEnum": CreateReportSchedule201Response.FormatEnum,
        "CreateReportSchedule201Response.ChannelEnum": CreateReportSchedule201Response.ChannelEnum,
        "CreateReportSchedule201Response.ReportTypeEnum": CreateReportSchedule201Response.ReportTypeEnum,
        "CreateReportScheduleRequest.FrequencyTypeEnum": CreateReportScheduleRequest.FrequencyTypeEnum,
        "CreateReportScheduleRequest.FormatEnum": CreateReportScheduleRequest.FormatEnum,
        "CreateReportScheduleRequest.ChannelEnum": CreateReportScheduleRequest.ChannelEnum,
        "CreateWalletRequest.CurrencyCodeEnum": CreateWalletRequest.CurrencyCodeEnum,
        "CryptoLedger.TypeEnum": CryptoLedger.TypeEnum,
        "CustomerDto.StatusEnum": CustomerDto.StatusEnum,
        "CustomerDto.TypeEnum": CustomerDto.TypeEnum,
        "CustomerInternalDto.StatusEnum": CustomerInternalDto.StatusEnum,
        "CustomerInternalDto.StatusInternalEnum": CustomerInternalDto.StatusInternalEnum,
        "CustomerInternalDto.TypeEnum": CustomerInternalDto.TypeEnum,
        "CustomerOverviewDto.StatusEnum": CustomerOverviewDto.StatusEnum,
        "CustomerOverviewDto.TypeEnum": CustomerOverviewDto.TypeEnum,
        "CustomerReferenceAndStatus.StatusEnum": CustomerReferenceAndStatus.StatusEnum,
        "CustomerStatusExternal": CustomerStatusExternal,
        "CustomerStatusInternal": CustomerStatusInternal,
        "CustomerType": CustomerType,
        "DirectionDto": DirectionDto,
        "EntityTypeEnumDto": EntityTypeEnumDto,
        "ErrorCode": ErrorCode,
        "EstimateRefundFeeRequest.CurrencyEnum": EstimateRefundFeeRequest.CurrencyEnum,
        "FetchExchangeRate200Response.TypeEnum": FetchExchangeRate200Response.TypeEnum,
        "FetchExchangeRateDto.TypeEnum": FetchExchangeRateDto.TypeEnum,
        "FiatLedger.TypeEnum": FiatLedger.TypeEnum,
        "FiatLedger.AccountNumberFormatEnum": FiatLedger.AccountNumberFormatEnum,
        "GetAgreementSessionStatus200Response.StatusEnum": GetAgreementSessionStatus200Response.StatusEnum,
        "GetCustomerDocuments200ResponseContentInner.StatusEnum": GetCustomerDocuments200ResponseContentInner.StatusEnum,
        "GetCustomerDocuments404ResponseInner.CodeEnum": GetCustomerDocuments404ResponseInner.CodeEnum,
        "GetQuestionnaireDefinitions200ResponseInner.CodeEnum": GetQuestionnaireDefinitions200ResponseInner.CodeEnum,
        "GetQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInner.TypeEnum": GetQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInner.TypeEnum,
        "GetQuestionnaires200ResponseInner.QuestionnaireCodeEnum": GetQuestionnaires200ResponseInner.QuestionnaireCodeEnum,
        "GetQuestionnaires200ResponseInner.StatusEnum": GetQuestionnaires200ResponseInner.StatusEnum,
        "IndividualPartyDetailDto.EntityTypeEnum": IndividualPartyDetailDto.EntityTypeEnum,
        "Instruction.TypeEnum": Instruction.TypeEnum,
        "Ledger.TypeEnum": Ledger.TypeEnum,
        "Ledger.AccountNumberFormatEnum": Ledger.AccountNumberFormatEnum,
        "LedgerWalletList200ResponseContentInner.StatusEnum": LedgerWalletList200ResponseContentInner.StatusEnum,
        "LedgerWalletList200ResponseContentInnerBalance.CurrencyCodeEnum": LedgerWalletList200ResponseContentInnerBalance.CurrencyCodeEnum,
        "LedgerWalletList200ResponseContentInnerLedgersInner.TypeEnum": LedgerWalletList200ResponseContentInnerLedgersInner.TypeEnum,
        "LedgerWalletList200ResponseContentInnerLedgersInner.AccountNumberFormatEnum": LedgerWalletList200ResponseContentInnerLedgersInner.AccountNumberFormatEnum,
        "LedgerWalletList200ResponseContentInnerLedgersInnerOneOf.TypeEnum": LedgerWalletList200ResponseContentInnerLedgersInnerOneOf.TypeEnum,
        "LedgerWalletList200ResponseContentInnerLedgersInnerOneOf.AccountNumberFormatEnum": LedgerWalletList200ResponseContentInnerLedgersInnerOneOf.AccountNumberFormatEnum,
        "LedgerWalletList200ResponseContentInnerLedgersInnerOneOf1.TypeEnum": LedgerWalletList200ResponseContentInnerLedgersInnerOneOf1.TypeEnum,
        "ListAccountCustomers200ResponseContentInner.StatusEnum": ListAccountCustomers200ResponseContentInner.StatusEnum,
        "ListAccountCustomers200ResponseContentInner.TypeEnum": ListAccountCustomers200ResponseContentInner.TypeEnum,
        "ListReportSchedules200ResponseAllOfContentInner.FrequencyTypeEnum": ListReportSchedules200ResponseAllOfContentInner.FrequencyTypeEnum,
        "ListReportSchedules200ResponseAllOfContentInner.FormatEnum": ListReportSchedules200ResponseAllOfContentInner.FormatEnum,
        "ListReportSchedules200ResponseAllOfContentInner.ChannelEnum": ListReportSchedules200ResponseAllOfContentInner.ChannelEnum,
        "ListReportSchedules200ResponseAllOfContentInner.ReportTypeEnum": ListReportSchedules200ResponseAllOfContentInner.ReportTypeEnum,
        "MerchantChannelDto.StatusEnum": MerchantChannelDto.StatusEnum,
        "MerchantChannelPaymentDto.StatusEnum": MerchantChannelPaymentDto.StatusEnum,
        "ModelError.CodeEnum": ModelError.CodeEnum,
        "Money.CurrencyEnum": Money.CurrencyEnum,
        "PartyDetailDto.EntityTypeEnum": PartyDetailDto.EntityTypeEnum,
        "PartyDetailDtoOneOf.EntityTypeEnum": PartyDetailDtoOneOf.EntityTypeEnum,
        "PaymentCreateRequestComplianceDetailsPartyDetailsInner.EntityTypeEnum": PaymentCreateRequestComplianceDetailsPartyDetailsInner.EntityTypeEnum,
        "PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf.EntityTypeEnum": PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf.EntityTypeEnum,
        "PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf1.EntityTypeEnum": PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf1.EntityTypeEnum,
        "PaymentList200ResponseInner.TypeEnum": PaymentList200ResponseInner.TypeEnum,
        "PaymentList200ResponseInner.SubTypeEnum": PaymentList200ResponseInner.SubTypeEnum,
        "PaymentList200ResponseInner.StatusEnum": PaymentList200ResponseInner.StatusEnum,
        "PaymentStatusDto": PaymentStatusDto,
        "PayoutBeneficiaryDetails.BeneficiaryTypeEnum": PayoutBeneficiaryDetails.BeneficiaryTypeEnum,
        "PayoutBeneficiaryDetails.TransferDestinationEnum": PayoutBeneficiaryDetails.TransferDestinationEnum,
        "PayoutBeneficiaryDetails.CurrencyEnum": PayoutBeneficiaryDetails.CurrencyEnum,
        "PayoutCreate200Response.StatusEnum": PayoutCreate200Response.StatusEnum,
        "PayoutCreate200ResponseDetails.TypeEnum": PayoutCreate200ResponseDetails.TypeEnum,
        "PayoutCreate200ResponseDetailsBeneficiary.EntityTypeEnum": PayoutCreate200ResponseDetailsBeneficiary.EntityTypeEnum,
        "PayoutCreate200ResponseDetailsBeneficiaryBankAccount.FormatEnum": PayoutCreate200ResponseDetailsBeneficiaryBankAccount.FormatEnum,
        "PayoutCreateRequestAmount.CurrencyEnum": PayoutCreateRequestAmount.CurrencyEnum,
        "PayoutCreateRequestInstruction.TypeEnum": PayoutCreateRequestInstruction.TypeEnum,
        "PayoutCreateRequestInstruction.PaymentMethodEnum": PayoutCreateRequestInstruction.PaymentMethodEnum,
        "PayoutCreateRequestInstructionBeneficiaryDetails.BeneficiaryTypeEnum": PayoutCreateRequestInstructionBeneficiaryDetails.BeneficiaryTypeEnum,
        "PayoutCreateRequestInstructionBeneficiaryDetails.TransferDestinationEnum": PayoutCreateRequestInstructionBeneficiaryDetails.TransferDestinationEnum,
        "PayoutCreateRequestInstructionBeneficiaryDetails.CurrencyEnum": PayoutCreateRequestInstructionBeneficiaryDetails.CurrencyEnum,
        "PayoutCreateRequestInstructionBeneficiaryDetailsBankDetails.AccountTypeEnum": PayoutCreateRequestInstructionBeneficiaryDetailsBankDetails.AccountTypeEnum,
        "PayoutCreateRequestInstructionBeneficiaryDetailsBankDetails.BankTypeIdentifierEnum": PayoutCreateRequestInstructionBeneficiaryDetailsBankDetails.BankTypeIdentifierEnum,
        "QuoteCreate200Response.QuoteStatusEnum": QuoteCreate200Response.QuoteStatusEnum,
        "QuoteCreate200Response.PaymentStatusEnum": QuoteCreate200Response.PaymentStatusEnum,
        "QuoteCreate200Response.TypeEnum": QuoteCreate200Response.TypeEnum,
        "QuoteDto.QuoteStatusEnum": QuoteDto.QuoteStatusEnum,
        "QuoteDto.PaymentStatusEnum": QuoteDto.PaymentStatusEnum,
        "QuoteDto.TypeEnum": QuoteDto.TypeEnum,
        "RefundPayinRequestAmount.CurrencyEnum": RefundPayinRequestAmount.CurrencyEnum,
        "SimulatePayinRequest.PaymentMethodEnum": SimulatePayinRequest.PaymentMethodEnum,
        "SimulatePayinRequestOriginatorBankAccount.AccountNumberFormatEnum": SimulatePayinRequestOriginatorBankAccount.AccountNumberFormatEnum,
        "SubmitQuestionnaireResponsesRequestInner.CodeEnum": SubmitQuestionnaireResponsesRequestInner.CodeEnum,
        "SummaryPaymentDto.TypeEnum": SummaryPaymentDto.TypeEnum,
        "SummaryPaymentDto.SubTypeEnum": SummaryPaymentDto.SubTypeEnum,
        "SummaryPaymentDto.StatusEnum": SummaryPaymentDto.StatusEnum,
        "TransferBeneficiaryResponse.WalletTypeEnum": TransferBeneficiaryResponse.WalletTypeEnum,
        "TransferCreateRequestInstruction.TypeEnum": TransferCreateRequestInstruction.TypeEnum,
        "TransferDetails.TypeEnum": TransferDetails.TypeEnum,
        "TransferRead200Response.StatusEnum": TransferRead200Response.StatusEnum,
        "TransferRead200ResponseDetails.TypeEnum": TransferRead200ResponseDetails.TypeEnum,
        "TransferRead200ResponseDetailsBeneficiary.EntityTypeEnum": TransferRead200ResponseDetailsBeneficiary.EntityTypeEnum,
        "TransferResponse.StatusEnum": TransferResponse.StatusEnum,
        "TransfersBeneficiaryRead200ResponseInner.WalletTypeEnum": TransfersBeneficiaryRead200ResponseInner.WalletTypeEnum,
        "UnifiedPayoutDetails.TypeEnum": UnifiedPayoutDetails.TypeEnum,
        "UnifiedPayoutResponse.StatusEnum": UnifiedPayoutResponse.StatusEnum,
        "UpdateAgreementSessionRequest.StatusEnum": UpdateAgreementSessionRequest.StatusEnum,
        "UpdateReportSchedule200Response.FrequencyTypeEnum": UpdateReportSchedule200Response.FrequencyTypeEnum,
        "UpdateReportSchedule200Response.FormatEnum": UpdateReportSchedule200Response.FormatEnum,
        "UpdateReportSchedule200Response.ChannelEnum": UpdateReportSchedule200Response.ChannelEnum,
        "UpdateReportSchedule200Response.ReportTypeEnum": UpdateReportSchedule200Response.ReportTypeEnum,
        "UpdateReportScheduleRequest.FrequencyTypeEnum": UpdateReportScheduleRequest.FrequencyTypeEnum,
        "UpdateReportScheduleRequest.FormatEnum": UpdateReportScheduleRequest.FormatEnum,
        "UpdateReportScheduleRequest.ChannelEnum": UpdateReportScheduleRequest.ChannelEnum,
        "UploadCustomerDocuments202Response.StatusEnum": UploadCustomerDocuments202Response.StatusEnum,
        "UploadCustomerDocuments400Response.StatusEnum": UploadCustomerDocuments400Response.StatusEnum,
        "WalletListTransactions200ResponseContentInner.TypeEnum": WalletListTransactions200ResponseContentInner.TypeEnum,
        "WalletListTransactions200ResponseContentInner.StatusEnum": WalletListTransactions200ResponseContentInner.StatusEnum,
        "WalletListTransactions200ResponseContentInnerAmount.CurrencyCodeEnum": WalletListTransactions200ResponseContentInnerAmount.CurrencyCodeEnum,
        "WalletListTransactions200ResponseContentInnerBeneficiaryBankAccount.AccountNumberFormatEnum": WalletListTransactions200ResponseContentInnerBeneficiaryBankAccount.AccountNumberFormatEnum,
        "WalletListTransactions200ResponseContentInnerBeneficiaryEntity.TypeEnum": WalletListTransactions200ResponseContentInnerBeneficiaryEntity.TypeEnum,
        "WalletListTransactions200ResponseContentInnerDetails.PaymentMethodEnum": WalletListTransactions200ResponseContentInnerDetails.PaymentMethodEnum,
        "WalletListTransactions200ResponseContentInnerOriginatorBankAccount.AccountNumberFormatEnum": WalletListTransactions200ResponseContentInnerOriginatorBankAccount.AccountNumberFormatEnum,
        "WalletListTransactions200ResponseContentInnerOriginatorEntity.TypeEnum": WalletListTransactions200ResponseContentInnerOriginatorEntity.TypeEnum,
        "WalletListTransactions200ResponseContentInnerRunningBalance.CurrencyCodeEnum": WalletListTransactions200ResponseContentInnerRunningBalance.CurrencyCodeEnum,
        "WalletProfiles200ResponseProfilesInner.CurrencyCodesEnum": WalletProfiles200ResponseProfilesInner.CurrencyCodesEnum,
        "WalletProfiles200ResponseProfilesInner.PaymentMethodsEnum": WalletProfiles200ResponseProfilesInner.PaymentMethodsEnum,
        "WalletResponse.StatusEnum": WalletResponse.StatusEnum,
}

let typeMap: {[index: string]: any} = {
    "AcceptedQuoteDto": AcceptedQuoteDto,
    "AccountMethodDto": AccountMethodDto,
    "AccountsServerErrorDto": AccountsServerErrorDto,
    "AccountsValidationErrorDto": AccountsValidationErrorDto,
    "Address": Address,
    "AddressCountryCodeOnly": AddressCountryCodeOnly,
    "AddressV2": AddressV2,
    "AlternativeAddressDto": AlternativeAddressDto,
    "ApiError": ApiError,
    "Balance": Balance,
    "BalanceDto": BalanceDto,
    "BankAccount": BankAccount,
    "BankDetails": BankDetails,
    "BulkExchangeDto": BulkExchangeDto,
    "BusinessCustomerDocument": BusinessCustomerDocument,
    "ChannelCreateRequest": ChannelCreateRequest,
    "ChannelList200ResponseInner": ChannelList200ResponseInner,
    "ChannelPaymentRead200Response": ChannelPaymentRead200Response,
    "ChannelPaymentRead200ResponseNetworkFee": ChannelPaymentRead200ResponseNetworkFee,
    "ClientValidationErrorDto": ClientValidationErrorDto,
    "CompanyDetails": CompanyDetails,
    "CompanyPartyDetailDto": CompanyPartyDetailDto,
    "CompleteOnboarding200Response": CompleteOnboarding200Response,
    "CompleteOnboarding200ResponseResultsInner": CompleteOnboarding200ResponseResultsInner,
    "ComplianceDetailDto": ComplianceDetailDto,
    "CorporateCustomer": CorporateCustomer,
    "CorporateCustomerRepresentative": CorporateCustomerRepresentative,
    "CountryCodeDto": CountryCodeDto,
    "CreateAddress": CreateAddress,
    "CreateAgreementSession200Response": CreateAgreementSession200Response,
    "CreateAgreementSession200ResponseAgreementsInner": CreateAgreementSession200ResponseAgreementsInner,
    "CreateAgreementSessionRequest": CreateAgreementSessionRequest,
    "CreateCompanyCustomerRequest": CreateCompanyCustomerRequest,
    "CreateCorporateCustomer": CreateCorporateCustomer,
    "CreateCorporateCustomerAssociates": CreateCorporateCustomerAssociates,
    "CreateCustomer202Response": CreateCustomer202Response,
    "CreateCustomer400ResponseInner": CreateCustomer400ResponseInner,
    "CreateCustomer400ResponseInnerDetails": CreateCustomer400ResponseInnerDetails,
    "CreateCustomerRequest": CreateCustomerRequest,
    "CreateCustomerRequestAnyOf": CreateCustomerRequestAnyOf,
    "CreateCustomerRequestAnyOf1": CreateCustomerRequestAnyOf1,
    "CreateCustomerRequestAnyOf1Individual": CreateCustomerRequestAnyOf1Individual,
    "CreateCustomerRequestAnyOf1IndividualAddress": CreateCustomerRequestAnyOf1IndividualAddress,
    "CreateCustomerRequestAnyOf1IndividualCdd": CreateCustomerRequestAnyOf1IndividualCdd,
    "CreateCustomerRequestAnyOf1IndividualCddExpectedMonthlyVolume": CreateCustomerRequestAnyOf1IndividualCddExpectedMonthlyVolume,
    "CreateCustomerRequestAnyOf1IndividualTaxIdentification": CreateCustomerRequestAnyOf1IndividualTaxIdentification,
    "CreateCustomerRequestAnyOfCompany": CreateCustomerRequestAnyOfCompany,
    "CreateCustomerRequestAnyOfCompanyAddress": CreateCustomerRequestAnyOfCompanyAddress,
    "CreateCustomerRequestAnyOfCompanyAssociates": CreateCustomerRequestAnyOfCompanyAssociates,
    "CreateCustomerRequestAnyOfCompanyAssociatesContactInfo": CreateCustomerRequestAnyOfCompanyAssociatesContactInfo,
    "CreateCustomerRequestAnyOfCompanyAssociatesOwnership": CreateCustomerRequestAnyOfCompanyAssociatesOwnership,
    "CreateCustomerRequestAnyOfCompanyAssociatesTaxIdentification": CreateCustomerRequestAnyOfCompanyAssociatesTaxIdentification,
    "CreateCustomerWalletRequest": CreateCustomerWalletRequest,
    "CreateCustomerWalletRequestInstruction": CreateCustomerWalletRequestInstruction,
    "CreateEPMRequestDto": CreateEPMRequestDto,
    "CreateEmbeddedPartnerMerchant400Response": CreateEmbeddedPartnerMerchant400Response,
    "CreateEmbeddedPartnerMerchant400ResponseDetails": CreateEmbeddedPartnerMerchant400ResponseDetails,
    "CreateEmbeddedPartnerMerchant500Response": CreateEmbeddedPartnerMerchant500Response,
    "CreateEmbeddedPartnerMerchant500ResponseDetails": CreateEmbeddedPartnerMerchant500ResponseDetails,
    "CreateEmbeddedPartnerMerchantRequest": CreateEmbeddedPartnerMerchantRequest,
    "CreateIndividualCustomer": CreateIndividualCustomer,
    "CreateIndividualCustomerRequest": CreateIndividualCustomerRequest,
    "CreateReportSchedule201Response": CreateReportSchedule201Response,
    "CreateReportSchedule409Response": CreateReportSchedule409Response,
    "CreateReportScheduleRequest": CreateReportScheduleRequest,
    "CreateTransferRequest": CreateTransferRequest,
    "CreateTransferResponse": CreateTransferResponse,
    "CreateWalletRequest": CreateWalletRequest,
    "CryptoAddressDto": CryptoAddressDto,
    "CryptoLedger": CryptoLedger,
    "CurrencyDto": CurrencyDto,
    "CurrencyFiatDto": CurrencyFiatDto,
    "CurrencyOptions": CurrencyOptions,
    "CurrencyProtocol": CurrencyProtocol,
    "CustomerDto": CustomerDto,
    "CustomerInternalDto": CustomerInternalDto,
    "CustomerOverviewDto": CustomerOverviewDto,
    "CustomerReferenceAndStatus": CustomerReferenceAndStatus,
    "CustomersPage": CustomersPage,
    "CustomersPageInternal": CustomersPageInternal,
    "Detail": Detail,
    "EmbeddedPartnerWebhookDto": EmbeddedPartnerWebhookDto,
    "EstimateRefundFee200Response": EstimateRefundFee200Response,
    "EstimateRefundFee200ResponseFee": EstimateRefundFee200ResponseFee,
    "EstimateRefundFee200ResponseMaxAvailableToRefund": EstimateRefundFee200ResponseMaxAvailableToRefund,
    "EstimateRefundFee400Response": EstimateRefundFee400Response,
    "EstimateRefundFee400ResponseDetails": EstimateRefundFee400ResponseDetails,
    "EstimateRefundFee400ResponseDetailsErrors": EstimateRefundFee400ResponseDetailsErrors,
    "EstimateRefundFeeRequest": EstimateRefundFeeRequest,
    "ExchangeDto": ExchangeDto,
    "ExchangeRateDto": ExchangeRateDto,
    "ExchangeRequestDto": ExchangeRequestDto,
    "ExternalCurrencyWithdrawalParameter": ExternalCurrencyWithdrawalParameter,
    "FeeDto": FeeDto,
    "FeesDto": FeesDto,
    "FetchExchangeRate200Response": FetchExchangeRate200Response,
    "FetchExchangeRateDto": FetchExchangeRateDto,
    "FetchExchangeRateRequest": FetchExchangeRateRequest,
    "FiatLedger": FiatLedger,
    "GatewayTransactionDto": GatewayTransactionDto,
    "GetAccountWebhook200Response": GetAccountWebhook200Response,
    "GetAccountWebhook200ResponseAccount": GetAccountWebhook200ResponseAccount,
    "GetAgreementSessionStatus200Response": GetAgreementSessionStatus200Response,
    "GetAgreements200ResponseInner": GetAgreements200ResponseInner,
    "GetCustomerDocuments200Response": GetCustomerDocuments200Response,
    "GetCustomerDocuments200ResponseContentInner": GetCustomerDocuments200ResponseContentInner,
    "GetCustomerDocuments404ResponseInner": GetCustomerDocuments404ResponseInner,
    "GetCustomerFeeWallets200Response": GetCustomerFeeWallets200Response,
    "GetCustomerFeeWallets200ResponseCustomerFeeWalletsInner": GetCustomerFeeWallets200ResponseCustomerFeeWalletsInner,
    "GetCustomerFeeWallets403Response": GetCustomerFeeWallets403Response,
    "GetMonthlyExpectedVolumes200ResponseInner": GetMonthlyExpectedVolumes200ResponseInner,
    "GetQuestionnaireDefinitions200ResponseInner": GetQuestionnaireDefinitions200ResponseInner,
    "GetQuestionnaireDefinitions200ResponseInnerSectionsInner": GetQuestionnaireDefinitions200ResponseInnerSectionsInner,
    "GetQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInner": GetQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInner,
    "GetQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInnerOptionsInner": GetQuestionnaireDefinitions200ResponseInnerSectionsInnerItemsInnerOptionsInner,
    "GetQuestionnaires200ResponseInner": GetQuestionnaires200ResponseInner,
    "GetQuestionnaires200ResponseInnerSectionsInner": GetQuestionnaires200ResponseInnerSectionsInner,
    "GetSupportedTimezones200ResponseInner": GetSupportedTimezones200ResponseInner,
    "IndividualCustomerDocument": IndividualCustomerDocument,
    "IndividualDetails": IndividualDetails,
    "IndividualPartyDetailDto": IndividualPartyDetailDto,
    "Industry": Industry,
    "Instruction": Instruction,
    "IntermediaryBank": IntermediaryBank,
    "Ledger": Ledger,
    "LedgerWalletList200Response": LedgerWalletList200Response,
    "LedgerWalletList200ResponseContentInner": LedgerWalletList200ResponseContentInner,
    "LedgerWalletList200ResponseContentInnerBalance": LedgerWalletList200ResponseContentInnerBalance,
    "LedgerWalletList200ResponseContentInnerLedgersInner": LedgerWalletList200ResponseContentInnerLedgersInner,
    "LedgerWalletList200ResponseContentInnerLedgersInnerOneOf": LedgerWalletList200ResponseContentInnerLedgersInnerOneOf,
    "LedgerWalletList200ResponseContentInnerLedgersInnerOneOf1": LedgerWalletList200ResponseContentInnerLedgersInnerOneOf1,
    "LedgerWalletList200ResponsePageable": LedgerWalletList200ResponsePageable,
    "ListAccountCustomers200Response": ListAccountCustomers200Response,
    "ListAccountCustomers200ResponseContentInner": ListAccountCustomers200ResponseContentInner,
    "ListAccountCustomers200ResponsePage": ListAccountCustomers200ResponsePage,
    "ListCountries200ResponseInner": ListCountries200ResponseInner,
    "ListCountries200ResponseInnerDocumentsInner": ListCountries200ResponseInnerDocumentsInner,
    "ListCountries200ResponseInnerOptions": ListCountries200ResponseInnerOptions,
    "ListCurrenciesCrypto200ResponseInner": ListCurrenciesCrypto200ResponseInner,
    "ListCurrenciesCrypto200ResponseInnerOptions": ListCurrenciesCrypto200ResponseInnerOptions,
    "ListCurrenciesCrypto200ResponseInnerProtocolsInner": ListCurrenciesCrypto200ResponseInnerProtocolsInner,
    "ListCurrenciesCrypto200ResponseInnerWithdrawalParametersInner": ListCurrenciesCrypto200ResponseInnerWithdrawalParametersInner,
    "ListCurrenciesFiat200ResponseInner": ListCurrenciesFiat200ResponseInner,
    "ListExchangeRates200ResponseInner": ListExchangeRates200ResponseInner,
    "ListReportSchedules200Response": ListReportSchedules200Response,
    "ListReportSchedules200ResponseAllOfContentInner": ListReportSchedules200ResponseAllOfContentInner,
    "ListReportSchedules200ResponseAllOfPageable": ListReportSchedules200ResponseAllOfPageable,
    "ListReportSchedules400Response": ListReportSchedules400Response,
    "ListReportSchedules400ResponseDetails": ListReportSchedules400ResponseDetails,
    "MerchantChannelDto": MerchantChannelDto,
    "MerchantChannelPaymentDto": MerchantChannelPaymentDto,
    "MerchantChannelRequestDto": MerchantChannelRequestDto,
    "MerchantDto": MerchantDto,
    "MerchantIdCreate400Response": MerchantIdCreate400Response,
    "MerchantIdCreate400ResponseErrorListInner": MerchantIdCreate400ResponseErrorListInner,
    "MerchantIdCreateRequest": MerchantIdCreateRequest,
    "MerchantIdCreateRequestWallet": MerchantIdCreateRequestWallet,
    "MerchantIdList200ResponseInner": MerchantIdList200ResponseInner,
    "MerchantIdList200ResponseInnerWallet": MerchantIdList200ResponseInnerWallet,
    "Metadata": Metadata,
    "ModelError": ModelError,
    "Money": Money,
    "MonthlyExpectedVolumes": MonthlyExpectedVolumes,
    "NetworkFeeDto": NetworkFeeDto,
    "Page": Page,
    "PageMetadata": PageMetadata,
    "Pageable": Pageable,
    "PartyDetailDto": PartyDetailDto,
    "PartyDetailDtoOneOf": PartyDetailDtoOneOf,
    "PayAmountsDto": PayAmountsDto,
    "PayInDetailDto": PayInDetailDto,
    "PayInInstructionDto": PayInInstructionDto,
    "PayInMethodDto": PayInMethodDto,
    "PayOutDetailDto": PayOutDetailDto,
    "PayOutMethodDto": PayOutMethodDto,
    "PayRequestDto": PayRequestDto,
    "PaymentCreateRequest": PaymentCreateRequest,
    "PaymentCreateRequestComplianceDetails": PaymentCreateRequestComplianceDetails,
    "PaymentCreateRequestComplianceDetailsPartyDetailsInner": PaymentCreateRequestComplianceDetailsPartyDetailsInner,
    "PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf": PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf,
    "PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf1": PaymentCreateRequestComplianceDetailsPartyDetailsInnerOneOf1,
    "PaymentCreateRequestEmbeddedCustomerDetails": PaymentCreateRequestEmbeddedCustomerDetails,
    "PaymentCreateRequestFees": PaymentCreateRequestFees,
    "PaymentCreateRequestFeesCustomerFee": PaymentCreateRequestFeesCustomerFee,
    "PaymentCreateRequestMetadata": PaymentCreateRequestMetadata,
    "PaymentCreateRequestPayInDetails": PaymentCreateRequestPayInDetails,
    "PaymentCreateRequestPayOutDetails": PaymentCreateRequestPayOutDetails,
    "PaymentLegDto": PaymentLegDto,
    "PaymentList200ResponseInner": PaymentList200ResponseInner,
    "PaymentList200ResponseInnerAddress": PaymentList200ResponseInnerAddress,
    "PaymentList200ResponseInnerAddressAlternativesInner": PaymentList200ResponseInnerAddressAlternativesInner,
    "PaymentList200ResponseInnerDisplayCurrency": PaymentList200ResponseInnerDisplayCurrency,
    "PaymentList200ResponseInnerDisplayRate": PaymentList200ResponseInnerDisplayRate,
    "PaymentList200ResponseInnerTransactionsInner": PaymentList200ResponseInnerTransactionsInner,
    "PaymentList500Response": PaymentList500Response,
    "PaymentUpdateRequest": PaymentUpdateRequest,
    "PayoutBeneficiaryDetails": PayoutBeneficiaryDetails,
    "PayoutCreate200Response": PayoutCreate200Response,
    "PayoutCreate200ResponseDetails": PayoutCreate200ResponseDetails,
    "PayoutCreate200ResponseDetailsBeneficiary": PayoutCreate200ResponseDetailsBeneficiary,
    "PayoutCreate200ResponseDetailsBeneficiaryAddress": PayoutCreate200ResponseDetailsBeneficiaryAddress,
    "PayoutCreate200ResponseDetailsBeneficiaryBankAccount": PayoutCreate200ResponseDetailsBeneficiaryBankAccount,
    "PayoutCreate200ResponseDetailsBeneficiaryBankAccountBankAddress": PayoutCreate200ResponseDetailsBeneficiaryBankAccountBankAddress,
    "PayoutCreate200ResponseDetailsBeneficiaryCompanyDetails": PayoutCreate200ResponseDetailsBeneficiaryCompanyDetails,
    "PayoutCreate400Response": PayoutCreate400Response,
    "PayoutCreate400ResponseDetails": PayoutCreate400ResponseDetails,
    "PayoutCreateRequest": PayoutCreateRequest,
    "PayoutCreateRequestAmount": PayoutCreateRequestAmount,
    "PayoutCreateRequestInstruction": PayoutCreateRequestInstruction,
    "PayoutCreateRequestInstructionBeneficiary": PayoutCreateRequestInstructionBeneficiary,
    "PayoutCreateRequestInstructionBeneficiaryDetails": PayoutCreateRequestInstructionBeneficiaryDetails,
    "PayoutCreateRequestInstructionBeneficiaryDetailsAddress": PayoutCreateRequestInstructionBeneficiaryDetailsAddress,
    "PayoutCreateRequestInstructionBeneficiaryDetailsBankDetails": PayoutCreateRequestInstructionBeneficiaryDetailsBankDetails,
    "PayoutCreateRequestInstructionBeneficiaryDetailsBankDetailsIntermediaryBanksInner": PayoutCreateRequestInstructionBeneficiaryDetailsBankDetailsIntermediaryBanksInner,
    "PayoutCreateRequestInstructionBeneficiaryDetailsBusinessDetails": PayoutCreateRequestInstructionBeneficiaryDetailsBusinessDetails,
    "PayoutCreateRequestInstructionBeneficiaryDetailsIndividualDetails": PayoutCreateRequestInstructionBeneficiaryDetailsIndividualDetails,
    "PayoutCreateRequestRequestDetails": PayoutCreateRequestRequestDetails,
    "PayoutCreateRequestRequestDetailsOriginator": PayoutCreateRequestRequestDetailsOriginator,
    "QuoteAccept200Response": QuoteAccept200Response,
    "QuoteCreate200Response": QuoteCreate200Response,
    "QuoteCreate200ResponseFees": QuoteCreate200ResponseFees,
    "QuoteCreate200ResponseFeesPercentage": QuoteCreate200ResponseFeesPercentage,
    "QuoteCreate200ResponsePayInInstruction": QuoteCreate200ResponsePayInInstruction,
    "QuoteCreate200ResponsePayInLegsInner": QuoteCreate200ResponsePayInLegsInner,
    "QuoteCreate200ResponsePayInMethod": QuoteCreate200ResponsePayInMethod,
    "QuoteCreate200ResponsePayOutMethod": QuoteCreate200ResponsePayOutMethod,
    "QuoteCreate200ResponseUsePayInMethod": QuoteCreate200ResponseUsePayInMethod,
    "QuoteCreateRequest": QuoteCreateRequest,
    "QuoteDto": QuoteDto,
    "QuoteRequestDto": QuoteRequestDto,
    "ReadExchangeRate200Response": ReadExchangeRate200Response,
    "RefundPayin200Response": RefundPayin200Response,
    "RefundPayin200ResponseFee": RefundPayin200ResponseFee,
    "RefundPayinRequest": RefundPayinRequest,
    "RefundPayinRequestAmount": RefundPayinRequestAmount,
    "ServerErrorDto": ServerErrorDto,
    "SetCustomerFeeWallet200Response": SetCustomerFeeWallet200Response,
    "SetCustomerFeeWallet200ResponseCustomerFeeWalletsInner": SetCustomerFeeWallet200ResponseCustomerFeeWalletsInner,
    "SetCustomerFeeWallet404Response": SetCustomerFeeWallet404Response,
    "SetCustomerFeeWalletRequest": SetCustomerFeeWalletRequest,
    "SimplifiedTransactionReportDto": SimplifiedTransactionReportDto,
    "SimulatePayinRequest": SimulatePayinRequest,
    "SimulatePayinRequestOriginator": SimulatePayinRequestOriginator,
    "SimulatePayinRequestOriginatorBankAccount": SimulatePayinRequestOriginatorBankAccount,
    "SubmitQuestionnaireResponses200Response": SubmitQuestionnaireResponses200Response,
    "SubmitQuestionnaireResponsesRequestInner": SubmitQuestionnaireResponsesRequestInner,
    "SubmitQuestionnaireResponsesRequestInnerSectionsInner": SubmitQuestionnaireResponsesRequestInnerSectionsInner,
    "SubmitQuestionnaireResponsesRequestInnerSectionsInnerItemsInner": SubmitQuestionnaireResponsesRequestInnerSectionsInnerItemsInner,
    "SummaryPaymentDto": SummaryPaymentDto,
    "TransactionReportDto": TransactionReportDto,
    "TransactionReportRequestDataDto": TransactionReportRequestDataDto,
    "TransferBeneficiaryResponse": TransferBeneficiaryResponse,
    "TransferCreate200Response": TransferCreate200Response,
    "TransferCreateRequest": TransferCreateRequest,
    "TransferCreateRequestInstruction": TransferCreateRequestInstruction,
    "TransferDetails": TransferDetails,
    "TransferRead200Response": TransferRead200Response,
    "TransferRead200ResponseDetails": TransferRead200ResponseDetails,
    "TransferRead200ResponseDetailsBeneficiary": TransferRead200ResponseDetailsBeneficiary,
    "TransferRead200ResponseDetailsBeneficiaryAddress": TransferRead200ResponseDetailsBeneficiaryAddress,
    "TransferResponse": TransferResponse,
    "TransfersBeneficiaryRead200ResponseInner": TransfersBeneficiaryRead200ResponseInner,
    "UnifiedPayoutDetails": UnifiedPayoutDetails,
    "UnifiedPayoutRequest": UnifiedPayoutRequest,
    "UnifiedPayoutResponse": UnifiedPayoutResponse,
    "UpdateAgreementSessionRequest": UpdateAgreementSessionRequest,
    "UpdateReportSchedule200Response": UpdateReportSchedule200Response,
    "UpdateReportScheduleRequest": UpdateReportScheduleRequest,
    "UploadCustomerDocuments202Response": UploadCustomerDocuments202Response,
    "UploadCustomerDocuments400Response": UploadCustomerDocuments400Response,
    "UploadCustomerDocuments400ResponseDetails": UploadCustomerDocuments400ResponseDetails,
    "UploadCustomerDocumentsRequestInner": UploadCustomerDocumentsRequestInner,
    "ValidationErrorDto": ValidationErrorDto,
    "WalletBalanceList200ResponseInner": WalletBalanceList200ResponseInner,
    "WalletCreateRequest": WalletCreateRequest,
    "WalletDto": WalletDto,
    "WalletListTransactions200Response": WalletListTransactions200Response,
    "WalletListTransactions200ResponseContentInner": WalletListTransactions200ResponseContentInner,
    "WalletListTransactions200ResponseContentInnerAmount": WalletListTransactions200ResponseContentInnerAmount,
    "WalletListTransactions200ResponseContentInnerBeneficiary": WalletListTransactions200ResponseContentInnerBeneficiary,
    "WalletListTransactions200ResponseContentInnerBeneficiaryBankAccount": WalletListTransactions200ResponseContentInnerBeneficiaryBankAccount,
    "WalletListTransactions200ResponseContentInnerBeneficiaryEntity": WalletListTransactions200ResponseContentInnerBeneficiaryEntity,
    "WalletListTransactions200ResponseContentInnerDetails": WalletListTransactions200ResponseContentInnerDetails,
    "WalletListTransactions200ResponseContentInnerOriginator": WalletListTransactions200ResponseContentInnerOriginator,
    "WalletListTransactions200ResponseContentInnerOriginatorBankAccount": WalletListTransactions200ResponseContentInnerOriginatorBankAccount,
    "WalletListTransactions200ResponseContentInnerOriginatorEntity": WalletListTransactions200ResponseContentInnerOriginatorEntity,
    "WalletListTransactions200ResponseContentInnerRunningBalance": WalletListTransactions200ResponseContentInnerRunningBalance,
    "WalletListTransactions200ResponsePageable": WalletListTransactions200ResponsePageable,
    "WalletProfiles200Response": WalletProfiles200Response,
    "WalletProfiles200ResponseProfilesInner": WalletProfiles200ResponseProfilesInner,
    "WalletRequestDto": WalletRequestDto,
    "WalletResponse": WalletResponse,
    "WalletTransactionReport201ResponseInner": WalletTransactionReport201ResponseInner,
    "WalletTransactionReport201ResponseInnerRequestData": WalletTransactionReport201ResponseInnerRequestData,
    "WalletTransactionReportV2200ResponseInner": WalletTransactionReportV2200ResponseInner,
}

// Check if a string starts with another string without using es6 features
function startsWith(str: string, match: string): boolean {
    return str.substring(0, match.length) === match;
}

// Check if a string ends with another string without using es6 features
function endsWith(str: string, match: string): boolean {
    return str.length >= match.length && str.substring(str.length - match.length) === match;
}

const nullableSuffix = " | null";
const optionalSuffix = " | undefined";
const arrayPrefix = "Array<";
const arraySuffix = ">";
const mapPrefix = "{ [key: string]: ";
const mapSuffix = "; }";

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if(typeMap[discriminatorType]){
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string): any {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (endsWith(type, nullableSuffix)) {
            let subType: string = type.slice(0, -nullableSuffix.length); // Type | null => Type
            return ObjectSerializer.serialize(data, subType);
        } else if (endsWith(type, optionalSuffix)) {
            let subType: string = type.slice(0, -optionalSuffix.length); // Type | undefined => Type
            return ObjectSerializer.serialize(data, subType);
        } else if (startsWith(type, arrayPrefix)) {
            let subType: string = type.slice(arrayPrefix.length, -arraySuffix.length); // Array<Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.serialize(datum, subType));
            }
            return transformedData;
        } else if (startsWith(type, mapPrefix)) {
            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type
            let transformedData: { [key: string]: any } = {};
            for (let key in data) {
                transformedData[key] = ObjectSerializer.serialize(
                    data[key],
                    subType,
                );
            }
            return transformedData;
        } else if (type === "Date") {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string): any {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (endsWith(type, nullableSuffix)) {
            let subType: string = type.slice(0, -nullableSuffix.length); // Type | null => Type
            return ObjectSerializer.deserialize(data, subType);
        } else if (endsWith(type, optionalSuffix)) {
            let subType: string = type.slice(0, -optionalSuffix.length); // Type | undefined => Type
            return ObjectSerializer.deserialize(data, subType);
        } else if (startsWith(type, arrayPrefix)) {
            let subType: string = type.slice(arrayPrefix.length, -arraySuffix.length); // Array<Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.deserialize(datum, subType));
            }
            return transformedData;
        } else if (startsWith(type, mapPrefix)) {
            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type
            let transformedData: { [key: string]: any } = {};
            for (let key in data) {
                transformedData[key] = ObjectSerializer.deserialize(
                    data[key],
                    subType,
                );
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap[type]) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): Promise<void> | void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class HttpBearerAuth implements Authentication {
    public accessToken: string | (() => string) = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            const accessToken = typeof this.accessToken === 'function'
                            ? this.accessToken()
                            : this.accessToken;
            requestOptions.headers["Authorization"] = "Bearer " + accessToken;
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        } else if (this.location == 'cookie' && requestOptions && requestOptions.headers) {
            if (requestOptions.headers['Cookie']) {
                requestOptions.headers['Cookie'] += '; ' + this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
            else {
                requestOptions.headers['Cookie'] = this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}

export type Interceptor = (requestOptions: localVarRequest.Options) => (Promise<void> | void);
