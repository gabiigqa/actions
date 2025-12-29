export interface GetTransactionStatusResponse {
    transaction_id: string;
    transaction_status_id: number;
    transaction_status_code: string;
    transaction_type_id: number;
    transaction_type_code: string;
    external_transaction_id: string | null;
    partner_id: string | null;
    partner_reference: string | null;
    client_id: string | null;
    business_id: string;
    account_id: string | null;
    wallet_id: string | null;
    external_reference: string | null;
    transaction_detail_id: string;
    amount: number;
    exchange_rate: number;
    fees: number;
    fiat_currency_id: number;
    fiat_currency_code: string;
    fiat_amount: number;
    total_fiat_amount: number;
    asset_currency_id: number;
    asset_currency_code: string;
    asset_amount: number;
    total_asset_amount: number;
    detailsPartner: any | null;
}