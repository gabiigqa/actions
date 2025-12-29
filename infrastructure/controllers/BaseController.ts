import { BaseResponse } from "@/domain/interfaces/infrastructure/controllers/responses/BaseResponse";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { TYPES } from "@/infrastructure/config/inversify";
import { Response } from "express";
import { inject } from "inversify";

export class BaseController {
    constructor(
        @inject(TYPES.ILoggerService) protected loggerService: ILoggerService,
    ) { }

    protected sendResponse<T>(res: Response, status: number = 200, message: string = '', data?: T): void {
        const response: BaseResponse<T> = {
            data,
            message,
            success: status >= 200 && status < 300 ? true : false
        };
        res.status(status).json(response);
    }
}