import { IExchangeRateService } from "@/domain/interfaces/domain/services/IExchangeRateService";
import { CalculatedExchangeRateRequest } from "@/domain/interfaces/infrastructure/controllers/requests/quotes/CalculatedExchangeRateRequest";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseController } from "@/infrastructure/controllers/BaseController";
import { requireAuth } from "@/infrastructure/middleware/AuthMiddleware";
import validateRequest from "@/infrastructure/middleware/ValidateRequestMiddleware";
import { CalculatedExchangeRateRequestValidator } from "@/infrastructure/validators/quotes/CalculateDepositQuoteRequestValidator";
import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";

@controller('/api/quotes', requireAuth)
export class QuotesController extends BaseController {
    constructor(
        @inject(TYPES.ILoggerService) loggerService: ILoggerService,
        @inject(TYPES.IExchangeRateService) private exchangeRateService: IExchangeRateService
    ) {
        super(loggerService);
    }

    private truncateDecimals(value: any): any {
        if (typeof value === 'number') {
            const truncated = Math.floor(value * 100) / 100;
            return truncated.toFixed(2);
        }
        if (typeof value === 'string' && !isNaN(Number(value))) {
            const truncated = Math.floor(Number(value) * 100) / 100;
            return truncated.toFixed(2);
        }
        if (Array.isArray(value)) {
            return value.map(item => this.truncateDecimals(item));
        }
        if (typeof value === 'object' && value !== null) {
            const truncated: any = {};
            for (const key in value) {
                truncated[key] = this.truncateDecimals(value[key]);
            }
            return truncated;
        }
        return value;
    }

    // @httpGet('/test')
    // async testEndpoint(req: Request, res: Response): Promise<void> {
    //     try {
    //         const session = req.session
    //         this.sendResponse(res, 200, `Test endpoint successful`, { session });
    //     } catch (error: Error | any) {
    //         console.log('esto es el error en test: ', error)
    //         this.sendResponse(res, 500, `Test endpoint failed`, error);
    //     }
    // }

    // @httpPost('/deposit', validateRequest(CalculatedExchangeRateRequestValidator))
    // async getDepositQuote(req: Request, res: Response): Promise<void> {
    //     try {
    //         const quoteDepositRequest: CalculatedExchangeRateRequest = req.body;

    //         this.loggerService.info(`Received request for deposit quote: transactionType=${quoteDepositRequest.transactionType}, cryptoAsset=${quoteDepositRequest.cryptoAsset}, fiatCurrency=${quoteDepositRequest.fiatCurrency}`);
    //         let direction: 'asset' | 'fiat' = 'asset';
    //         let amount: number = 0;

    //         if (quoteDepositRequest.cryptoAmount) {
    //             direction = 'asset';
    //             amount = quoteDepositRequest.cryptoAmount;
    //         } else if (quoteDepositRequest.fiatAmount) {
    //             direction = 'fiat';
    //             amount = quoteDepositRequest.fiatAmount;
    //         } else {
    //             this.sendResponse(res, 400, `Either fiatAmount or cryptoAmount must be provided`);
    //             return;
    //         }

    //         const exchangeRate = await this.exchangeRateService.calculateExchangeAmount(quoteDepositRequest.transactionType, quoteDepositRequest.cryptoAsset, quoteDepositRequest.fiatCurrency, amount, direction);

    //         if (!exchangeRate) {
    //             this.loggerService.warn(`Exchange rate not found for deposit quote: transactionType=${quoteDepositRequest.transactionType}, cryptoAsset=${quoteDepositRequest.cryptoAsset}, fiatCurrency=${quoteDepositRequest.fiatCurrency}`);
    //             this.sendResponse(res, 404, `Exchange rate not found for the provided parameters`);
    //             return;
    //         }

    //         this.sendResponse(res, 200, `Deposit quote retrieved successfully`, exchangeRate);
    //     } catch (error: Error | any) {
    //         this.sendResponse(res, 500, `Failed to get deposit quote`, error);
    //     }
    // }

    // @httpPost('/withdrawal', validateRequest(CalculatedExchangeRateRequestValidator))
    // async getWithdrawQuote(req: Request, res: Response): Promise<void> {
    //     try {
    //         const quoteWithdrawRequest: CalculatedExchangeRateRequest = req.body;

    //         this.loggerService.info(`Received request for withdraw quote: transactionType=${quoteWithdrawRequest.transactionType}, cryptoAsset=${quoteWithdrawRequest.cryptoAsset}, fiatCurrency=${quoteWithdrawRequest.fiatCurrency}`);
    //         let direction: 'asset' | 'fiat' = 'fiat';
    //         let amount: number = 0;

    //         if (quoteWithdrawRequest.fiatAmount) {
    //             direction = 'fiat';
    //             amount = quoteWithdrawRequest.fiatAmount;
    //         } else if (quoteWithdrawRequest.cryptoAmount) {
    //             direction = 'asset';
    //             amount = quoteWithdrawRequest.cryptoAmount;
    //         } else {
    //             this.sendResponse(res, 400, `Either fiatAmount or cryptoAmount must be provided`);
    //             return;
    //         }

    //         const exchangeRate = await this.exchangeRateService.calculateExchangeAmount(quoteWithdrawRequest.transactionType, quoteWithdrawRequest.cryptoAsset, quoteWithdrawRequest.fiatCurrency, amount, direction);

    //         if (!exchangeRate) {
    //             this.loggerService.warn(`Exchange rate not found for withdraw quote: transactionType=${quoteWithdrawRequest.transactionType}, cryptoAsset=${quoteWithdrawRequest.cryptoAsset}, fiatCurrency=${quoteWithdrawRequest.fiatCurrency}`);
    //             this.sendResponse(res, 404, `Exchange rate not found for the provided parameters`);
    //             return;
    //         }

    //         this.sendResponse(res, 200, `Withdraw quote retrieved successfully`, exchangeRate);
    //     } catch (error: Error | any) {
    //         this.sendResponse(res, 500, `Failed to get withdraw quote`, error);
    //     }
    // }

    @httpGet('/pair/:pair')
    async getExchangeRate(req: Request, res: Response): Promise<void> {
        try {
            const { pair } = req.params;
            const { fiat, transaction_type } = req.query;
            const session = req.session;

            if (!session || !session.businessId) {
                this.sendResponse(res, 401, `Business ID not found in session. Please login again.`);
                return;
            }

            if (!pair) {
                this.sendResponse(res, 400, `Pair parameter is required`);
                return;
            }

            const validPairs = ['USDC', 'USDT'];
            if (!validPairs.includes(pair.toUpperCase())) {
                this.sendResponse(res, 400, `Invalid pair. Must be one of: ${validPairs.join(', ')}`);
                return;
            }

            if (!fiat) {
                this.sendResponse(res, 400, `Fiat query parameter is required`);
                return;
            }

            if ((fiat as string).toUpperCase() !== 'BOB') {
                this.sendResponse(res, 400, `Invalid fiat currency. Only BOB is supported.`);
                return;
            }

            const transactionTypeCode = transaction_type ? (transaction_type as string).toLowerCase() : 'withdrawal';

            if (transaction_type) {
                const validTransactionTypes = ['deposit', 'withdrawal'];
                if (!validTransactionTypes.includes(transactionTypeCode)) {
                    this.sendResponse(res, 400, `Invalid transaction type. Must be one of: ${validTransactionTypes.join(', ')}`);
                    return;
                }
            }

            this.loggerService.info(`Received request for exchange rate: pair=${pair}, fiat=${fiat}, transaction_type=${transactionTypeCode}`);

            const businessId = session.businessId;

            const exchangeRate = await this.exchangeRateService.getExchangeRateByTransactionType(
                pair.toUpperCase(),
                (fiat as string).toUpperCase(),
                transactionTypeCode,
                businessId
            );

            if (!exchangeRate) {
                this.loggerService.warn(`Exchange rate not found for pair=${pair}, fiat=${fiat}, transaction_type=${transactionTypeCode}`);
                this.sendResponse(res, 404, `Exchange rate not found for the provided parameters`);
                return;
            }

            const truncatedData = this.truncateDecimals(exchangeRate);
            this.sendResponse(res, 200, `Exchange rate retrieved successfully`, truncatedData);
        } catch (error: Error | any) {
            this.loggerService.error('Error getting exchange rate:', error);
            this.sendResponse(res, 500, `Failed to get exchange rate`, error);
        }
    }

    @httpGet('/current')
    async getCurrentQuotes(req: Request, res: Response): Promise<void> {
    try {
        const { fiat } = req.query;
        const session = req.session;

        if (!session || !session.businessId) {
        this.sendResponse(res, 401, `Business ID not found in session. Please login again.`);
        return;
        }

        const fiatCurrency = ((fiat as string) || 'BOB').toUpperCase();

        if (fiatCurrency !== 'BOB') {
        this.sendResponse(res, 400, `Invalid fiat currency. Only BOB is supported.`);
        return;
        }

        this.loggerService.info(`Received request for current quotes: fiat=${fiatCurrency}`);

        const businessId = session.businessId as string;

        const currentQuotes = await this.exchangeRateService.getCurrentExchangeRates(
        fiatCurrency,
        businessId
        );

        if (!currentQuotes || !currentQuotes.quotes || currentQuotes.quotes.length === 0) {
        this.loggerService.warn(
            `No current quotes found for fiat=${fiatCurrency}, businessId=${businessId}`
        );
        this.sendResponse(res, 404, `No current exchange rates found`);
        return;
        }

        const truncatedData = this.truncateDecimals(currentQuotes);
        this.sendResponse(
        res,
        200,
        `Current exchange rates retrieved successfully`,
        truncatedData
        );
    } catch (error: Error | any) {
        this.loggerService.error('Error getting current quotes:', error);
        this.sendResponse(res, 500, `Failed to get current quotes`, error);
    }
    }
}