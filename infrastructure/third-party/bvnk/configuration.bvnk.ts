import { TYPES } from "@/infrastructure/config/inversify/types";
import { CustomersApiApiKeys } from "@bvnk/api";
import { AppConfig } from '@infrastructure/config/AppConfig';
import { client } from "hawk";
import { Credentials } from "hawk/lib/client";
import { inject, injectable } from "inversify";

@injectable()
export class BvnkConfiguration {
    private credentials: Credentials | null = null;
    private readonly isProduction: boolean;

    baseUrl: string;
    accessToken?: string;
    withCredentials: boolean;

    public constructor(
        @inject(TYPES.AppConfig) protected appConfig: AppConfig
    ) {
        this.isProduction = appConfig.isProduction();
        this.withCredentials = false;
        // Use the sandbox URL when not in production; production should use the live API
        this.baseUrl = this.isProduction ? "https://api.bvnk.com" : "https://api.sandbox.bvnk.com";
    }

    public setConfiguration(url: string, method: string, withCredentials: boolean = false) {
        if (withCredentials) {
            this.credentials = {
                id: this.appConfig.getBvnkAuthId(),
                key: this.appConfig.getBvnkSecretKey(),
                algorithm: this.appConfig.getBvnkAlgorithm(), // The hashing algorith used.
            };

            url = `${this.baseUrl}${url}`;
            this.accessToken = this.hawkHeader(url, method);
        }else{
            this.accessToken = undefined;
            this.credentials = null;
        }
        
        this.withCredentials = withCredentials;
    }

    private hawkHeader(url: string, method: string): string {
        try {
            if (!this.credentials) {
                throw new Error("Credentials are not set");
            }
            const { header } = client.header(url, method, {
                credentials: this.credentials,
            });
            return header;
        } catch (error) {
            throw new Error("Failed to generate Hawk header");
        }
    }

    public factoryApiClient<T extends object>(apiClientClass: new (baseUrl: string) => T): T {
        const apiClient = new apiClientClass(this.baseUrl);

        // Apply credentials if available and the API client supports authentication
        if (this.withCredentials && this.accessToken) {
            if ('setApiKey' in apiClient && typeof (apiClient as any).setApiKey === 'function') {
                if (!this.accessToken) {
                    throw new Error('Missing access token');
                }
                (apiClient as any).setApiKey(CustomersApiApiKeys.Hawk, this.accessToken);

                if ('defaultHeaders' in apiClient && typeof (apiClient as any).defaultHeaders === 'object') {
                    (apiClient as any).defaultHeaders.Authorization = this.accessToken;
                }
            }
        }

        return apiClient;
    }
}
