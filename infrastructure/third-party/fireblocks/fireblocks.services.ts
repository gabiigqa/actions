import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { AppConfig } from '@/infrastructure/config';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { BasePath, Fireblocks, TransferPeerPathType } from '@fireblocks/ts-sdk';
import fs from 'fs';
import { inject, injectable } from 'inversify';
import path from 'path';


@injectable()
export class FireblocksServices {
    private fireblocks: Fireblocks;
    private basePath: string;
    private apiKey: string;
    private apiSecretKey: string;
    private commissionAddress: string;
    private assets: string[];

    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.AppConfig) private appConfig: AppConfig
    ) {
        this.apiKey = this.appConfig.getFireblocksApiKey();
        this.basePath = this.appConfig.getFireblocksBasePath();
        const secretKeyName = this.appConfig.getFireblocksSecretPath();
        const secretKeyPath = path.resolve(__dirname, '..', 'fireblocks/config', `${secretKeyName}`);

        this.loggerService.info(`key path: ${secretKeyPath}`);

        this.apiSecretKey = fs.readFileSync(secretKeyPath, 'utf8');

        this.commissionAddress = this.appConfig.getCommissionAddress();
        this.assets = this.appConfig.getFireblocksAssets();

        this.fireblocks = new Fireblocks({
            apiKey: this.apiKey,
            secretKey: this.apiSecretKey,
            basePath: BasePath.Sandbox
        });
        this.loggerService.info('FireblocksServices initialized');
    }

    public async createVaultAccount(name: string, customerId: string): Promise<any> {
        try {
            this.fireblocks = new Fireblocks({
                apiKey: this.apiKey,
                secretKey: this.apiSecretKey,
                basePath: BasePath.Sandbox
            });
            const vault = await this.fireblocks.vaults.createVaultAccount({
                createVaultAccountRequest: {
                    name,
                    hiddenOnUI: false,
                    autoFuel: true,
                    customerRefId: customerId
                }
            });
            this.loggerService.info(`Vault account created with ID: ${vault.data.id}`);

            if (vault.statusCode !== 200) {
                throw new Error(`Failed to create vault account: ${vault.statusCode}`);
            }

            return vault.data;
        } catch (error) {
            this.loggerService.error('Error creating vault account', error as Error);
            return false;
        }
    }

    public async activateVaultAssets(vaultAccountId: string): Promise<any> {
        try {
            let resultado: any[] = [];
            for (const assetId of this.assets) {
                this.loggerService.info(`Activating asset: ${assetId} for vault account ID: ${vaultAccountId}`);
                const assets = await this.fireblocks.vaults.createVaultAccountAsset({
                    vaultAccountId,
                    assetId
                });

                this.loggerService.info(`Vault assets activated for vault account ID: ${vaultAccountId}`);
                if (assets.statusCode !== 200) {
                    throw new Error(`Failed to activate vault assets: ${assets.statusCode}`);
                }
                resultado.push(assets.data);
            }
            return resultado;
        } catch (error) {
            this.loggerService.error('Error activating vault assets', error as Error);
            return false;
        }
    }

    public async getBalance(vaultAccountId: string, assetId: string): Promise<any> {
        try {
            const balance = await this.fireblocks.vaults.getVaultAccountAsset({
                assetId,
                vaultAccountId
            });

            this.loggerService.info(`Balance for vault account ID ${vaultAccountId} and asset ${assetId}: ${JSON.stringify(balance.data)}`);

            if (balance.statusCode !== 200) {
                throw new Error(`Failed to fetch balance: ${balance.statusCode}`);
            }

            return balance.data;
        } catch (error) {
            this.loggerService.error('Error fetching balance', error as Error);
            return false;
        }
    }

    public async createExternalTransaction(vaultAccountId: string, assetId: string, amount: string, destinationAddress: string, note: string): Promise<any> {
        try {
            note = note || `Transaction from ${vaultAccountId} to ${destinationAddress} of amount ${amount} ${assetId}`;
            let payload = {
                assetId,
                amount,
                source: {
                    type: TransferPeerPathType.VaultAccount,
                    id: vaultAccountId
                },
                destination: {
                    type: TransferPeerPathType.ExternalWallet,
                    id: destinationAddress
                },
                note
            }

            const transaction = await this.fireblocks.transactions.createTransaction({
                transactionRequest: payload
            });

            if (transaction.statusCode !== 200) {
                throw new Error(`Failed to create transaction: ${transaction.statusCode}`);
            }

            this.loggerService.info(`Transaction created with ID: ${transaction.data.id}`);
        } catch (error) {
            this.loggerService.error('Error creating transaction', error as Error);
            return false;
        }
    }

    public async createInternalTransaction(sourceVaultAccountId: string, destinationVaultAccountId: string, assetId: string, amount: string, note: string): Promise<any> {
        try {
            note = note || `Internal transaction from ${sourceVaultAccountId} to ${destinationVaultAccountId} of amount ${amount} ${assetId}`;
            let payload = {
                assetId,
                amount,
                source: {
                    type: TransferPeerPathType.VaultAccount,
                    id: sourceVaultAccountId
                },
                destination: {
                    type: TransferPeerPathType.VaultAccount,
                    id: destinationVaultAccountId
                },
                note
            }
            const transaction = await this.fireblocks.transactions.createTransaction({
                transactionRequest: payload
            });

            if (transaction.statusCode !== 200) {
                throw new Error(`Failed to create internal transaction: ${transaction.statusCode}`);
            }

            this.loggerService.info(`Internal transaction created with ID: ${transaction.data.id}`);
            return transaction.data;
        } catch (error) {
            this.loggerService.error('Error creating internal transaction', error as Error);
            return false;
        }
    }

    public async createExternalTransactionWithCommission(vaultAccountId: string, assetId: string, amountTotal: string, amountDestination: string, amountCommission: string, destinationAddress: string, note: string): Promise<any> {
        try {
            note = note || `Transaction from ${vaultAccountId} to ${destinationAddress} of amount ${amountTotal} ${assetId} with commission ${amountCommission}`;

            if (!this.commissionAddress) {
                throw new Error('Commission address is not set in environment variables');
            }

            let payload = {
                assetId,
                amount: amountTotal,
                source: {
                    type: TransferPeerPathType.VaultAccount,
                    id: vaultAccountId
                },
                destinations: [
                    {
                        amount: amountDestination,
                        destination: {
                            type: TransferPeerPathType.ExternalWallet,
                            id: destinationAddress
                        }
                    },
                    {
                        amount: amountCommission,
                        destination: {
                            type: TransferPeerPathType.ExternalWallet,
                            id: this.commissionAddress
                        }
                    }
                ],
                note
            }

            const transaction = await this.fireblocks.transactions.createTransaction({
                transactionRequest: payload
            });

            if (transaction.statusCode !== 200) {
                throw new Error(`Failed to create transaction: ${transaction.statusCode}`);
            }

            this.loggerService.info(`Transaction created with ID: ${transaction.data.id}`);
            return transaction.data;
        } catch (error) {
            this.loggerService.error('Error creating transaction', error as Error);
            return false;
        }
    }
}