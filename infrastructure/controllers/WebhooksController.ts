import { IBusinessWebhookService } from "@/domain/interfaces/domain";
import { IBusinessService } from "@/domain/interfaces/domain/services/IBusinessService";
import { CreateWebhookRequest, UpdateWebhookRequest } from "@/domain/interfaces/infrastructure/controllers/requests/webhooks/CreateWebhookRequest";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseController } from "@/infrastructure/controllers/BaseController";
import { requireAuth } from "@/infrastructure/middleware/AuthMiddleware";
import validateRequest from "@/infrastructure/middleware/ValidateRequestMiddleware";
import { ValidateCreateWebhookRequest, ValidateUpdateWebhookRequest } from "@/infrastructure/validators/webhooks";
import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";

@controller('/api/webhooks', requireAuth)
export class WebhooksController extends BaseController {
    constructor(
        @inject(TYPES.ILoggerService) loggerService: ILoggerService,
        @inject(TYPES.IBusinessWebhookService) protected businessWebhookService: IBusinessWebhookService,
        @inject(TYPES.IBusinessService) protected businessService: IBusinessService
    ) {
        super(loggerService);
    }

    @httpGet('')
    async getWebhooks(req: Request, res: Response): Promise<void> {
        try {
            let { session } = req;
            let business = await this.businessService.getBusinessByEmail(session.email);
            if (!business) {
                this.sendResponse(res, 404, 'Business not found');
                return;
            }

            let webhooks = await this.businessWebhookService.getWebhooksByBusinessId(business.id);
            this.sendResponse(res, 200, 'Webhooks fetched successfully', webhooks);
        } catch (error) {
            this.loggerService.error("Error fetching webhooks", error);
            this.sendResponse(res, 500, 'Internal Server Error');
        }
    }

    @httpPost('', validateRequest(ValidateCreateWebhookRequest))
    async saveWebhook(req: Request, res: Response): Promise<void> {
        try {
            let { session, body } = req;
            const createWebhookRequest: CreateWebhookRequest = body;

            this.loggerService.info("Received webhook data:");
            this.loggerService.info(JSON.stringify(createWebhookRequest, null, 2));
            let business = await this.businessService.getBusinessByEmail(session.email);

            if (!business) {
                this.sendResponse(res, 404, 'Business not found');
                throw new Error('Business not found');
            }
            // TODO: Implement webhook saving logic here

            let createdWebhook = await this.businessWebhookService.createWebhook({
                callbackUrl: createWebhookRequest.url,
                xApiKey: createWebhookRequest.apiKey,
                httpMethod: createWebhookRequest.method,
                events: createWebhookRequest.events,
                description: createWebhookRequest.description,
                businessId: business.id,
                status: 'E'
            });

            this.sendResponse(res, 200, 'Webhook received successfully', { createdWebhook });
        } catch (error) {
            this.loggerService.error("Error saving webhook", error);
            this.sendResponse(res, 500, 'Internal Server Error');
        }
    }

    @httpGet('/:id')
    async getWebhook(req: Request, res: Response): Promise<void> {
        try {
            let { session } = req;
            let business = await this.businessService.getBusinessByEmail(session.email);
            if (!business) {
                this.sendResponse(res, 404, 'Business not found');
                return;
            }

            let webhook = await this.businessWebhookService.getWebhookById(req.params.id);
            if (!webhook) {
                this.sendResponse(res, 404, 'Webhook not found');
                return;
            }

            this.sendResponse(res, 200, 'Webhook fetched successfully', webhook);
        } catch (error) {
            this.loggerService.error("Error fetching webhook", error);
            this.sendResponse(res, 500, 'Internal Server Error');
        }
    }

    @httpPut('/:id', validateRequest(ValidateUpdateWebhookRequest))
    async updateWebhook(req: Request, res: Response): Promise<void> {
        try {
            let { session, body } = req;
            const updateWebhookRequest: UpdateWebhookRequest = body;

            let business = await this.businessService.getBusinessByEmail(session.email);
            if (!business) {
                this.sendResponse(res, 404, 'Business not found');
                return;
            }
            let updatedWebhook = await this.businessWebhookService.updateWebhook(req.params.id, {
                callbackUrl: updateWebhookRequest.url,
                xApiKey: updateWebhookRequest.apiKey,
                httpMethod: updateWebhookRequest.method,
                events: updateWebhookRequest.events,
                description: updateWebhookRequest.description,
            });
            
            if (!updatedWebhook) {
                this.sendResponse(res, 404, 'Webhook not found');
                return;
            }

            this.sendResponse(res, 200, 'Webhook updated successfully', updatedWebhook);
        } catch (error) {
            this.loggerService.error("Error updating webhook", error);
            this.sendResponse(res, 500, 'Internal Server Error');
        }
    }
}