import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IATCRedEnlaceConnector } from "@/domain/interfaces/infrastructure/third-party/IATCRedEnlaceConnector";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { ConsultarQRResponse } from "@/infrastructure/third-party/atc-red-enlace/entitites/consultar.qr.response";
import { GenerarQRRequest } from "@/infrastructure/third-party/atc-red-enlace/entitites/generar.qr.request";
import { GenerarQRResponse } from "@/infrastructure/third-party/atc-red-enlace/entitites/generar.qr.response";
import https from 'https';
import { inject, injectable } from "inversify";
import { secretsCache } from "@/infrastructure/config/azure.config";

@injectable()
export class ATCRedEnlaceConnector implements IATCRedEnlaceConnector {
    private xApiKey: string;
    private atcBasePath: string;
    private generarQREndpoint: string;
    private consultarQREndpoint: string;
    private httpsAgent: https.Agent | undefined;

    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
        @inject(TYPES.AppConfig) private appConfig: AppConfig,
    ) {
        this.xApiKey = appConfig.getAPiKeyATC();
        this.atcBasePath = appConfig.getAtcBasePath();
        this.generarQREndpoint = `${this.atcBasePath}/cobranza-0.0.1/atc/generarQr`;
        this.consultarQREndpoint = `${this.atcBasePath}/cobranza-0.0.1/atc/verificaQr/{numeroReferencia}`;
        
        // Configure HTTPS agent for non-production environments to handle self-signed certificates
        if (!appConfig.isProduction()) {
            this.httpsAgent = new https.Agent({
                rejectUnauthorized: false
            });
            this.logger.info('ATC Red Enlace Connector: SSL certificate verification disabled for non-production environment');
        }
    }

    /**
     * Custom fetch method that handles self-signed certificates in non-production environments
     */
    // verificar por que esto setea asi @misael
    private async customFetch(url: string, options: RequestInit): Promise<Response> {
        // For non-production environments with self-signed certificates
        if (this.httpsAgent && !this.appConfig.isProduction()) {
            // Temporarily set NODE_TLS_REJECT_UNAUTHORIZED for this request
            const originalValue = secretsCache['NODE-TLS-REJECT-UNAUTHORIZED'];
            secretsCache['NODE-TLS-REJECT-UNAUTHORIZED'] = '0'; // verificar por que setea esto asi @misael
            
            try {
                const response = await fetch(url, options);
                return response;
            } finally {
                // Restore original value
                if (originalValue !== undefined) {
                    secretsCache['NODE-TLS-REJECT-UNAUTHORIZED'] = originalValue;
                } else {
                    delete secretsCache['NODE-TLS-REJECT-UNAUTHORIZED']
                }
            }
        }
        
        // For production or when HTTPS agent is not needed
        return await fetch(url, options);
    }

    public async generarQR(data: GenerarQRRequest): Promise<GenerarQRResponse> {
        this.logger.info(`Calling ATC Red Enlace API to generate QR for reference: ${data.numeroReferencia}`);

        try {
            const fetchOptions: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.xApiKey
                },
                body: JSON.stringify(data)
            };

            const response = await this.customFetch(this.generarQREndpoint, fetchOptions);

            if (!response.ok) {
                const errorMessage = `ATC Red Enlace API call failed with status: ${response.status} - ${response.statusText}`;
                this.logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const result = await response.json() as GenerarQRResponse;

            this.logger.info(`ATC Red Enlace API call successful for reference: ${data.numeroReferencia}, response code: ${result.codigoRespuesta}`);

            return result;
        } catch (error) {
            const errorMessage = `Error calling ATC Red Enlace API: ${error instanceof Error ? error.message : 'Unknown error'}`;
            this.logger.error(errorMessage, error);
            throw new Error(errorMessage);
        }
    }

    public async consultarQR(numeroReferencia: string): Promise<ConsultarQRResponse> {
        this.logger.info(`Calling ATC Red Enlace API to consult QR with reference: ${numeroReferencia}`);

        try {
            const urlConsultaQR = this.consultarQREndpoint.replace("{numeroReferencia}", numeroReferencia);
            
            const fetchOptions: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.xApiKey
                }
            };

            const response = await this.customFetch(urlConsultaQR, fetchOptions);

            if (!response.ok) {
                const errorMessage = `ATC Red Enlace API call failed with status: ${response.status} - ${response.statusText}`;
                this.logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const result = await response.json() as ConsultarQRResponse;

            this.logger.info(`ATC Red Enlace API call successful for reference: ${numeroReferencia}, response code: ${result.codigoRespuesta}`);

            return result;
        } catch (error) {
            const errorMessage = `Error calling ATC Red Enlace API: ${error instanceof Error ? error.message : 'Unknown error'}`;
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
}