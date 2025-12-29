import 'reflect-metadata';
import { TYPES } from './types';

// Domain interfaces and implementations
import { IAssetService } from '@/domain/interfaces/domain/services/IAssetService';
import { IATCRedEnlaceService } from '@/domain/interfaces/domain/services/IATCRedEnlaceService';
import { IATCPayoutService } from '@/domain/interfaces/domain/services/IATCPayoutService';
import { IAuthService } from '@/domain/interfaces/domain/services/IAuthService';
import { ICallbackService } from '@/domain/interfaces/domain/services/ICallbackService';
import { ICountryService } from '@/domain/interfaces/domain/services/ICountryService';
import { ICurrencyService } from '@/domain/interfaces/domain/services/ICurrencyService';
import { IEmailTemplateService } from '@/domain/interfaces/domain/services/IEmailTemplateService';
import { IExchangeRateService } from '@/domain/interfaces/domain/services/IExchangeRateService';
import { IFeeService } from '@/domain/interfaces/domain/services/IFeeService';
import { ITenantFeeService } from '@/domain/interfaces/domain/services/ITenantFeeService';
import { ICommissionService } from '@/domain/interfaces/domain/services/ICommissionService';
import { IPartnerService } from '@/domain/interfaces/domain/services/IPartnerService';
import { IPingPongService } from '@/domain/interfaces/domain/services/IPingoService';
import { ITransactionStatusService } from '@/domain/interfaces/domain/services/ITransactionStatusService';
import { ITransactionTypeService } from '@/domain/interfaces/domain/services/ITransactionTypeService';
import { IUserService } from '@/domain/interfaces/domain/services/IUserService';
import { IWalletService } from '@/domain/interfaces/domain/services/IWalletService';
import { ITenantDatabaseService } from '@/domain/interfaces/domain/services/ITenantDatabaseService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IExchangeRateRepository } from '@/domain/interfaces/infrastructure/repositories/IExchangeRateRepository';
import { IFeeRepository } from '@/domain/interfaces/infrastructure/repositories/IFeeRepository';
import { ITenantFeeRepository } from '@/domain/interfaces/infrastructure/repositories/ITenantFeeRepository';
import { IPartnerRepository } from '@/domain/interfaces/infrastructure/repositories/IPartnerRepository';
import { IPostgreSQLConnection } from '@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection';
import { IUserRepository } from '@/domain/interfaces/infrastructure/repositories/IUserRepository';
import { PingPongService } from '@/domain/services/PingPongService';
import { AssetService } from '@domain/services/AssetService';
import { AuthService } from '@domain/services/AuthService';
import { CallbackService } from '@domain/services/CallbackService';
import { ConsoleLoggerService } from '@domain/services/ConsoleLoggerService';
import { CountryService } from '@domain/services/CountryService';
import { CurrencyService } from '@domain/services/CurrencyService';
import { EmailTemplateService } from '@domain/services/email.template.service';
import { ExchangeRateService } from '@domain/services/ExchangeRateService';
import { FeeService } from '@domain/services/FeeService';
import { TenantFeeService } from '@domain/services/TenantFeeService';
import { CommissionService } from '@domain/services/CommissionService';
import { PartnerService } from '@domain/services/PartnerService';
import { TransactionStatusService } from '@domain/services/TransactionStatusService';
import { TransactionTypeService } from '@domain/services/TransactionTypeService';
import { UserService } from '@domain/services/UserService';
import { WalletService } from '@domain/services/WalletService';
import { TenantDatabaseService } from '@domain/services/TenantDatabaseService';

// Middleware
import { IAccountService } from '@/domain/interfaces/domain/services/IAccountService';
import { IBusinessService } from '@/domain/interfaces/domain/services/IBusinessService';
import { IBusinessWebhookService } from '@/domain/interfaces/domain/services/IBusinessWebhookService';
import { IClientService } from '@/domain/interfaces/domain/services/IClientService';
import { ITransactionService } from '@/domain/interfaces/domain/services/ITransacctionService';
import { IQueueManagerService } from '@/domain/interfaces/domain/services/third-party/queue.manager.service.interface';
import { IBusinessRepository } from '@/domain/interfaces/infrastructure/repositories/IBusinessRepository';
import { IBusinessWebhookRepository } from '@/domain/interfaces/infrastructure/repositories/IBusinessWebhookRepository';
import { IClientAccountRepository } from '@/domain/interfaces/infrastructure/repositories/IClientAccountRepository';
import { IClientAccountWalletRepository } from '@/domain/interfaces/infrastructure/repositories/IClientAccountWalletRepository';
import { IClientRepository } from '@/domain/interfaces/infrastructure/repositories/IClientRepository';
import { ICountryRepository } from '@/domain/interfaces/infrastructure/repositories/ICountryRepository';
import { ICryptoCurrencyRepository } from '@/domain/interfaces/infrastructure/repositories/ICryptoCurrencyRepository';
import { IEmailTemplateRepository } from '@/domain/interfaces/infrastructure/repositories/IEmailTemplateRepository';
import { IFeeTypeRepository } from '@/domain/interfaces/infrastructure/repositories/IFeeTypeRepository';
import { IFiatCurrencyRepository } from '@/domain/interfaces/infrastructure/repositories/IFiatCurrencyRepository';
import { ITransactionRepository } from '@/domain/interfaces/infrastructure/repositories/ITransactionRepository';
import { ITransactionStatusRepository } from '@/domain/interfaces/infrastructure/repositories/ITransactionStatusRepository';
import { ITransactionTypeRepository } from '@/domain/interfaces/infrastructure/repositories/ITransactionTypeRepository';
import { IWebhookBusinessNotificationRepository } from '@/domain/interfaces/infrastructure/repositories/IWebhookBusinessNotificationRepository';
import { ITenantDatabaseRepository } from '@/domain/interfaces/infrastructure/repositories/ITenantDatabaseRepository';
import { IATCRedEnlaceConnector } from '@/domain/interfaces/infrastructure/third-party/IATCRedEnlaceConnector';
import { IATCPayoutConnector } from '@/domain/interfaces/infrastructure/third-party/IATCPayoutConnector';
import { IQueueManager } from '@/domain/interfaces/infrastructure/third-party/redis-connector/queue.manager.interface';
import { AccountService } from '@/domain/services/AccountService';
import { BusinessService } from '@/domain/services/BusinessService';
import { BusinessWebhookService } from '@/domain/services/BusinessWebhookService';
import { ClientService } from '@/domain/services/ClientService';
import { ATCRedEnlaceService } from '@/domain/services/third-party/atc.red.enlace.services';
import { ATCPayoutService } from '@/domain/services/third-party/atc.payout.service';
import { BvnkServices } from '@/domain/services/third-party/bvnk.services';
import { FireblocksServices } from '@/domain/services/third-party/fireblocks.services';
import { QueueManagerService } from '@/domain/services/third-party/queue.manager.service';
import { TransactionService } from '@/domain/services/TransactionService';
import { FireblockController } from '@/infrastructure/controllers/FireblockTestController';
import { BusinessRepository } from '@/infrastructure/repositories/posgress/business.repository';
import { BusinessWebhookRepository } from '@/infrastructure/repositories/posgress/businessWebhook.repository';
import { ClientAccountRepository } from '@/infrastructure/repositories/posgress/clientAccount.repository';
import { ClientAccountWalletRepository } from '@/infrastructure/repositories/posgress/clientAccountWallet.repository';
import { ClientsRepository } from '@/infrastructure/repositories/posgress/clients.repository';
import { CountryRepository } from '@/infrastructure/repositories/posgress/CountryRepository';
import { CryptoCurrencyRepository } from '@/infrastructure/repositories/posgress/cryptoCurrency.repository';
import { EmailTemplateRepository } from '@/infrastructure/repositories/posgress/email.template.repository';
import { ExchangeRateRepository } from '@/infrastructure/repositories/posgress/exchangeRate.repository';
import { FeeRepository } from '@/infrastructure/repositories/posgress/fee.repository';
import { TenantFeeRepository } from '@/infrastructure/repositories/posgress/tenant-fee.repository';
import { FeeTypeRepository } from '@/infrastructure/repositories/posgress/feeType.repository';
import { FiatCurrencyRepository } from '@/infrastructure/repositories/posgress/fiatCurrency.repository';
import { PartnersRepository } from '@/infrastructure/repositories/posgress/partners.repository';
import { PostgreSQLConnection } from '@/infrastructure/repositories/posgress/postgresql.conexion';
import { TransactionRepository } from '@/infrastructure/repositories/posgress/transactions.repository';
import { TransactionStatusRepository } from '@/infrastructure/repositories/posgress/transactionStatus.repository';
import { TransactionTypeRepository } from '@/infrastructure/repositories/posgress/transactionType.repository';
import { UserRepository } from '@/infrastructure/repositories/posgress/user.repository';
import { WebhookBusinessNotificationRepository } from '@/infrastructure/repositories/posgress/webhookBusinessNotification.repository';
import { TenantDatabaseRepository } from '@/infrastructure/repositories/TenantDatabaseRepository';
import { ATCRedEnlaceConnector } from '@/infrastructure/third-party/atc-red-enlace/atc.red.enlace.connector';
import { ATCPayoutConnector } from '@/infrastructure/third-party/atc-red-enlace/atc.payout.connector';
import { BvnkServiceConnector } from '@/infrastructure/third-party/bvnk/bvnk.services.connector';
import { BvnkConfiguration } from '@/infrastructure/third-party/bvnk/configuration.bvnk';
import { CallbackConnector } from '@/infrastructure/third-party/callbacks/callback.connector';
import { FakePartnerConnector } from '@/infrastructure/third-party/fake-partner/fake.partner';
import { FireblocksConnector } from '@/infrastructure/third-party/fireblocks/fireblocks.connector';
import { QueueManager } from '@/infrastructure/third-party/redis-connector/queue.manager';
import { AppConfig, EnvironmentConfig } from '@infrastructure/config';
import { AppConfigWithDI } from '@infrastructure/config/AppConfigWithDI';
import { ILogsService } from '@/domain/interfaces/domain/services/ILogsService';
import { ILogsRepository } from '@/domain/interfaces/infrastructure/repositories/ILogsRepository';
import { LogsRepository } from '@/infrastructure/repositories/posgress/logs.repository';
import { Container } from 'inversify';

const container = new Container({
  defaultScope: 'Transient',
});

// Bind configuration
container.bind<EnvironmentConfig>(TYPES.EnvironmentConfig).to(AppConfigWithDI).inSingletonScope();
container.bind<AppConfig>(TYPES.AppConfig).to(AppConfigWithDI).inSingletonScope();

// Bind database connections
container.bind<IPostgreSQLConnection>(TYPES.IPostgreSQLConnection).to(PostgreSQLConnection).inSingletonScope();

// Bind repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IClientRepository>(TYPES.IClientRepository).to(ClientsRepository).inSingletonScope();
container.bind<IClientAccountRepository>(TYPES.IClientAccountRepository).to(ClientAccountRepository).inSingletonScope();
container.bind<IClientAccountWalletRepository>(TYPES.IClientAccountWalletRepository).to(ClientAccountWalletRepository).inSingletonScope();
container.bind<IFiatCurrencyRepository>(TYPES.IFiatCurrencyRepository).to(FiatCurrencyRepository).inSingletonScope();
container.bind<ICryptoCurrencyRepository>(TYPES.ICryptoCurrencyRepository).to(CryptoCurrencyRepository).inSingletonScope();
container.bind<ICountryRepository>(TYPES.ICountryRepository).to(CountryRepository).inSingletonScope();
container.bind<IFeeTypeRepository>(TYPES.IFeeTypeRepository).to(FeeTypeRepository).inSingletonScope();
container.bind<ITransactionTypeRepository>(TYPES.ITransactionTypeRepository).to(TransactionTypeRepository).inSingletonScope();
container.bind<ITransactionStatusRepository>(TYPES.ITransactionStatusRepository).to(TransactionStatusRepository).inSingletonScope();
container.bind<IExchangeRateRepository>(TYPES.IExchangeRateRepository).to(ExchangeRateRepository).inSingletonScope();
container.bind<IFeeRepository>(TYPES.IFeeRepository).to(FeeRepository).inSingletonScope();
container.bind<ITenantFeeRepository>(TYPES.ITenantFeeRepository).to(TenantFeeRepository).inSingletonScope();
container.bind<IBusinessRepository>(TYPES.IBusinessRepository).to(BusinessRepository).inSingletonScope();
container.bind<IBusinessWebhookRepository>(TYPES.IBusinessWebhookRepository).to(BusinessWebhookRepository).inSingletonScope();
container.bind<IWebhookBusinessNotificationRepository>(TYPES.IWebhookBusinessNotificationRepository).to(WebhookBusinessNotificationRepository).inSingletonScope();
container.bind<IEmailTemplateRepository>(TYPES.IEmailTemplateRepository).to(EmailTemplateRepository).inSingletonScope();
container.bind<IPartnerRepository>(TYPES.IPartnerRepository).to(PartnersRepository).inSingletonScope();
container.bind<ITransactionRepository>(TYPES.ITransactionRepository).to(TransactionRepository).inSingletonScope();
container.bind<ILogsRepository>(TYPES.ILogsRepository).to(LogsRepository).inSingletonScope();
container.bind<ITenantDatabaseRepository>(TYPES.ITenantDatabaseRepository).to(TenantDatabaseRepository).inSingletonScope();
// Bind in-memory repositories for testing or development

// Bind domain services
container.bind<IPingPongService>(TYPES.IPingPongService).to(PingPongService).inSingletonScope();
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<ILoggerService>(TYPES.ILoggerService).to(ConsoleLoggerService).inSingletonScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
container.bind<IAccountService>(TYPES.IAccountService).to(AccountService).inSingletonScope();
container.bind<IClientService>(TYPES.IClientService).to(ClientService).inSingletonScope();
container.bind<ITransactionService>(TYPES.ITransactionService).to(TransactionService).inSingletonScope();
container.bind<ICallbackService>(TYPES.ICallbackService).to(CallbackService).inSingletonScope();
container.bind<IBusinessService>(TYPES.IBusinessService).to(BusinessService).inSingletonScope();
container.bind<IBusinessWebhookService>(TYPES.IBusinessWebhookService).to(BusinessWebhookService).inSingletonScope();
container.bind<IFeeService>(TYPES.IFeeService).to(FeeService).inSingletonScope();
container.bind<ITenantFeeService>(TYPES.ITenantFeeService).to(TenantFeeService).inSingletonScope();
container.bind<ICommissionService>(TYPES.ICommissionService).to(CommissionService).inSingletonScope();
container.bind<IPartnerService>(TYPES.IPartnerService).to(PartnerService).inSingletonScope();
container.bind<ILogsService>(TYPES.ILogsService).to(LogsRepository).inSingletonScope();
container.bind<IEmailTemplateService>(TYPES.IEmailTemplateService).to(EmailTemplateService).inSingletonScope();

// Bind additional domain services
container.bind<ITransactionTypeService>(TYPES.ITransactionTypeService).to(TransactionTypeService).inSingletonScope();
container.bind<ITransactionStatusService>(TYPES.ITransactionStatusService).to(TransactionStatusService).inSingletonScope();
container.bind<IWalletService>(TYPES.IWalletService).to(WalletService).inSingletonScope();
container.bind<ICountryService>(TYPES.ICountryService).to(CountryService).inSingletonScope();
container.bind<IAssetService>(TYPES.IAssetService).to(AssetService).inSingletonScope();
container.bind<ICurrencyService>(TYPES.ICurrencyService).to(CurrencyService).inSingletonScope();
container.bind<IExchangeRateService>(TYPES.IExchangeRateService).to(ExchangeRateService).inSingletonScope();
container.bind<ITenantDatabaseService>(TYPES.ITenantDatabaseService).to(TenantDatabaseService).inSingletonScope();
container.bind<IATCRedEnlaceService>(TYPES.IATCRedEnlaceService).to(ATCRedEnlaceService).inSingletonScope();

// Note: Controllers are automatically discovered by inversify-express-utils through @controller decorators
// No need to bind them explicitly in the container
container.bind<FireblockController>(TYPES.FireblockController).to(FireblockController);
container.bind<IQueueManager>(TYPES.IQueueManager).to(QueueManager).inSingletonScope();
container.bind<IQueueManagerService>(TYPES.IQueueManagerService).to(QueueManagerService).inSingletonScope();
container.bind<BvnkConfiguration>(TYPES.BvnkConfiguration).to(BvnkConfiguration);
container.bind<BvnkServiceConnector>(TYPES.BvnkServiceConnector).to(BvnkServiceConnector);

container.bind<FireblocksConnector>(TYPES.FireblocksServices).to(FireblocksConnector);
container.bind<FireblocksServices>(TYPES.FireblocksConnector).to(FireblocksServices);
container.bind<BvnkServices>(TYPES.BvnkServices).to(BvnkServices);

container.bind<IATCRedEnlaceConnector>(TYPES.IATCRedEnlaceConnector).to(ATCRedEnlaceConnector);
container.bind<CallbackConnector>(TYPES.CallbackConnector).to(CallbackConnector);

// ATC Payout Services
container.bind<IATCPayoutConnector>(TYPES.IATCPayoutConnector).to(ATCPayoutConnector).inSingletonScope();
container.bind<IATCPayoutService>(TYPES.IATCPayoutService).to(ATCPayoutService).inSingletonScope();

// Fake Partner Connector
container.bind<FakePartnerConnector>(TYPES.FakePartnerConnector).to(FakePartnerConnector);

export { container };

