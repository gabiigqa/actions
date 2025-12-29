import { CurrencyCryptoListResponse } from "@/domain/interfaces/bvnk/response/currency.crypto.list.response";
import { ListCurrenciesCrypto200ResponseInner } from "@bvnk/api";
import { plainToInstance } from "class-transformer";

/**
 * Helper: convert a plain object to an instance of a generated class with consistent error handling.
 */
function mapPlainToInstance<T>(cls: any, plain: any): T {
    try {
        // plainToInstance  return T | T[] 
        return (plainToInstance(cls as any, plain) as unknown) as T;
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        console.error(`Mapping failed: ${msg}`, error);
        throw new Error(`Mapping failed: ${msg}`);
    }
}

export function mapCurrencyCryptoListResponse(
    input: ListCurrenciesCrypto200ResponseInner[]
): CurrencyCryptoListResponse[] {

    if (!input || input.length === 0) {
        return [];
    }

    const plain = input.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        icon: item.icon,
        fiat: item.fiat,
        depositFee: item.depositFee,
        withdrawalFee: item.withdrawalFee,
        supportsDeposits: item.supportsDeposits,
        supportsWithdrawals: item.supportsWithdrawals,
        quantityPrecision: item.quantityPrecision,
        pricePrecision: item.pricePrecision,
        options: item.options,
        protocols: item.protocols,
        withdrawalParameters: item.withdrawalParameters
    }));

    return mapPlainToInstance<CurrencyCryptoListResponse[]>(CurrencyCryptoListResponse, plain);
}
