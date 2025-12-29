import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IATCPayoutConnector } from '@/domain/interfaces/infrastructure/third-party/IATCPayoutConnector';
import { AppConfig } from '@/infrastructure/config';
import { TYPES } from '@/infrastructure/config/inversify';
import { inject, injectable } from 'inversify';
import https from 'https';
import { LeerQRRequest } from './entitites/leer.qr.request';
import { LeerQRResponse } from './entitites/leer.qr.response';
import { PagarQRRequest } from './entitites/pagar.qr.request';
import { PagarQRResponse } from './entitites/pagar.qr.response';
import { ATCPayoutResponseWrapper, ATCPayoutResponseCode } from './entitites/atc.payout.response.wrapper';
import { encryptPayload, decryptPayload, EncryptedPayload } from './utils/encryption.util';
import { generateHMACHeaders, HMACConfig } from './utils/hmac-auth.util';

@injectable()
export class ATCPayoutConnector implements IATCPayoutConnector {
    private atcBasePath: string;
    private scanQREndpoint: string;
    private confirmPaymentEndpoint: string;
    private hmacConfig: HMACConfig;
    private atcPublicKey: string;     // Clave pública de ATC para cifrar requests
    private ownPrivateKey: string;    // Clave privada propia para descifrar responses
    private httpsAgent: https.Agent | undefined;
    private host: string;             // Host para el header HMAC

    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
        @inject(TYPES.AppConfig) private appConfig: AppConfig
    ) {
        // Base path de ATC Payout
        this.atcBasePath = appConfig.getAtcPayoutBasePath();

        // Endpoints
        this.scanQREndpoint = `${this.atcBasePath}/api/v1/payout/qr/scan`;
        this.confirmPaymentEndpoint = `${this.atcBasePath}/api/v1/payout/qr/confirm`;

        // Configuración HMAC
        this.hmacConfig = {
            keyId: appConfig.getAtcPayoutKeyId(),
            sharedSecret: appConfig.getAtcPayoutSharedSecret(),
            branchId: appConfig.getAtcPayoutBranchId()
        };

        // Claves RSA
        this.atcPublicKey = appConfig.getAtcPayoutPublicKey();
        this.ownPrivateKey = appConfig.getAtcPayoutOwnPrivateKey();

        // DEBUG: Log key details to diagnose encryption issues
        console.log('🔑 DEBUG: ATC Public Key Details:');
        console.log('  Length:', this.atcPublicKey.length);
        console.log('  First 100 chars:', this.atcPublicKey.substring(0, 100));
        console.log('  Last 100 chars:', this.atcPublicKey.substring(this.atcPublicKey.length - 100));
        console.log('  Has literal \\n:', this.atcPublicKey.includes('\\n'));
        console.log('  Has actual newlines:', this.atcPublicKey.includes('\n'));
        console.log('  Starts with quote:', this.atcPublicKey.startsWith('"'));
        console.log('  Ends with quote:', this.atcPublicKey.endsWith('"'));

        // Extraer host del base path (ej: "atcsindev.redenlace.com.bo:port")
        const url = new URL(this.atcBasePath);
        this.host = url.host;

        // Configurar HTTPS agent para non-production (deshabilitar verificación SSL)
        if (!appConfig.isProduction()) {
            this.httpsAgent = new https.Agent({
                rejectUnauthorized: false
            });
            this.logger.info('ATC Payout Connector: SSL certificate verification disabled for non-production environment');
        }
    }

    /**
     * Custom fetch que maneja certificados self-signed en non-production
     */
    private async customFetch(url: string, options: RequestInit): Promise<Response> {
        if (this.httpsAgent && !this.appConfig.isProduction()) {
            const originalValue = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            try {
                const response = await fetch(url, options);
                return response;
            } finally {
                if (originalValue !== undefined) {
                    process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalValue;
                } else {
                    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
                }
            }
        }

        return await fetch(url, options);
    }

    /**
     * Hace una petición cifrada a ATC Payout con autenticación HMAC
     */
    private async makeEncryptedRequest<TRequest, TResponse>(
        endpoint: string,
        path: string,
        requestPayload: TRequest
    ): Promise<TResponse> {
        try {
            // 1. Cifrar payload usando clave pública de ATC
            this.logger.info('Encrypting request payload with ATC public key');
            const encryptedRequest: EncryptedPayload = encryptPayload(requestPayload, this.atcPublicKey);

            // 2. Generar headers HMAC (incluyendo Digest del body cifrado)
            this.logger.info('Generating HMAC authentication headers');
            const hmacHeaders = generateHMACHeaders(
                this.hmacConfig,
                'POST',
                path,
                this.host,
                encryptedRequest
            );

            // 3. Preparar opciones de fetch
            const fetchOptions: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...hmacHeaders
                },
                body: JSON.stringify(encryptedRequest)
            };

            // Log del payload cifrado para debug
            console.log('📦 Encrypted Payload:');
            console.log('  encryptedData length:', encryptedRequest.encryptedData.length);
            console.log('  encryptedKey length:', encryptedRequest.encryptedKey.length);
            console.log('  iv length:', encryptedRequest.iv.length);

            console.log('\n📤 Request Details:');
            console.log('  URL:', endpoint);
            console.log('  Method: POST');
            console.log('  Headers:', JSON.stringify(fetchOptions.headers, null, 2));
            console.log('  Body (encrypted):', JSON.stringify(encryptedRequest, null, 2));

            // 4. Hacer petición HTTP
            this.logger.info(`Making encrypted request to: ${endpoint}`);
            const response = await this.customFetch(endpoint, fetchOptions);

            console.log('\n📥 Response from ATC:');
            console.log('  Status:', response.status, response.statusText);
            console.log('  Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

            // 5. Leer respuesta
            const responseText = await response.text();
            console.log('  Body (raw):', responseText);

            if (!response.ok) {
                const errorMessage = `ATC Payout API failed: ${response.status} - ${response.statusText}: ${responseText}`;
                this.logger.error(errorMessage);
                const error: any = new Error(errorMessage);
                error.statusCode = response.status; // Preservar el status code de ATC
                throw error;
            }

            const responseWrapper = JSON.parse(responseText) as ATCPayoutResponseWrapper;

            // 6. Verificar código de respuesta
            if (responseWrapper.code === ATCPayoutResponseCode.ERROR) {
                const errorMessage = `ATC Payout returned error: [${responseWrapper.errorCode}] ${responseWrapper.errorMessage}`;
                this.logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            // 7. Descifrar respuesta usando clave privada propia
            if (!responseWrapper.data) {
                throw new Error('ATC Payout response data is null');
            }

            this.logger.info('Decrypting response payload with own private key');
            const decryptedData: TResponse = decryptPayload(responseWrapper.data, this.ownPrivateKey);

            this.logger.info('Request completed successfully');
            return decryptedData;

        } catch (error) {
            const errorMessage = `Error in encrypted request to ATC Payout: ${error instanceof Error ? error.message : 'Unknown error'}`;
            this.logger.error(errorMessage, error);
            throw new Error(errorMessage);
        }
    }

    /**
     * Escanea (lee) un QR para obtener información del destinatario
     */
    public async scanQR(request: LeerQRRequest): Promise<LeerQRResponse> {
        this.logger.info('Scanning QR code via ATC Payout API');

        return await this.makeEncryptedRequest<LeerQRRequest, LeerQRResponse>(
            this.scanQREndpoint,
            '/api/v1/payout/qr/scan',
            request
        );
    }

    /**
     * Confirma y ejecuta el pago de un QR previamente escaneado
     */
    public async confirmPayment(request: PagarQRRequest): Promise<PagarQRResponse> {
        this.logger.info(`Confirming payment for reference: ${request.numeroReferencia}`);

        return await this.makeEncryptedRequest<PagarQRRequest, PagarQRResponse>(
            this.confirmPaymentEndpoint,
            '/api/v1/payout/qr/confirm',
            request
        );
    }
}
