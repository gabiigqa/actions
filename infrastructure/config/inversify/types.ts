// Symbols for dependency injection
export const TYPES = {
	// Configurations
	EnvironmentConfig: Symbol.for('EnvironmentConfig'),
	AppConfig: Symbol.for('AppConfig'),
	// Bvnk Services
	BvnkConfiguration: Symbol.for('BvnkConfiguration'),
	BvnkServiceConnector: Symbol.for('BvnkServiceConnector'),
	BvnkServices: Symbol.for('BvnkServices'),

	// Fireblocks Services
	FireblocksServices: Symbol.for('FireblocksServices'),
	FireblocksConnector: Symbol.for('FireblocksConnector'),

	// ATC Red Enlace Services
	IATCRedEnlaceConnector: Symbol.for('IATCRedEnlaceConnector'),
	CallbackConnector: Symbol.for('CallbackConnector'),

	// ATC Payout Services
	IATCPayoutConnector: Symbol.for('IATCPayoutConnector'),
	IATCPayoutService: Symbol.for('IATCPayoutService'),

	// Domain Services
	IPingPongService: Symbol.for('IPingPongService'),
	IAuthService: Symbol.for('IAuthService'),
	ILoggerService: Symbol.for('ILoggerService'),
	IUserService: Symbol.for('IUserService'),
	IClientService: Symbol.for('IClientService'),
	IAccountService: Symbol.for('IAccountService'),
	ITransactionService: Symbol.for('ITransactionService'),
	IATCRedEnlaceService: Symbol.for('IATCRedEnlaceService'),
	ICallbackService: Symbol.for('ICallbackService'),
	IBusinessService: Symbol.for('IBusinessService'),
	IBusinessWebhookService: Symbol.for('IBusinessWebhookService'),
	IFeeService: Symbol.for('IFeeService'),
	ITenantFeeService: Symbol.for('ITenantFeeService'),
	ICommissionService: Symbol.for('ICommissionService'),
	IPartnerService: Symbol.for('IPartnerService'),
	ILogsService: Symbol.for('ILogsService'),
	IEmailTemplateService: Symbol.for('IEmailTemplateService'),

	// Repositories
	IUserRepository: Symbol.for('IUserRepository'),
	IClientRepository: Symbol.for('IClientRepository'),
	IClientAccountRepository: Symbol.for('IClientAccountRepository'),
	IClientAccountWalletRepository: Symbol.for('IClientAccountWalletRepository'),
	IFiatCurrencyRepository: Symbol.for('IFiatCurrencyRepository'),
	ICryptoCurrencyRepository: Symbol.for('ICryptoCurrencyRepository'),
	IFeeTypeRepository: Symbol.for('IFeeTypeRepository'),
	ITransactionTypeRepository: Symbol.for('ITransactionTypeRepository'),
	ITransactionStatusRepository: Symbol.for('ITransactionStatusRepository'),
	IBusinessRepository: Symbol.for('IBusinessRepository'),
	IFeeRepository: Symbol.for('IFeeRepository'),
	ITenantFeeRepository: Symbol.for('ITenantFeeRepository'),
	IExchangeRateRepository: Symbol.for('IExchangeRateRepository'),
	IPartnerRepository: Symbol.for('IPartnerRepository'),
	ICountryRepository: Symbol.for('ICountryRepository'),
	ITransactionRepository: Symbol.for('ITransactionRepository'),
	IBusinessWebhookRepository: Symbol.for('IBusinessWebhookRepository'),
	IWebhookBusinessNotificationRepository: Symbol.for('IWebhookBusinessNotificationRepository'),
	ILogsRepository: Symbol.for('ILogsRepository'),
	IEmailTemplateRepository: Symbol.for('IEmailTemplateRepository'),
	ITenantDatabaseRepository: Symbol.for('ITenantDatabaseRepository'),

	// Domain Services - Additional
	ITransactionTypeService: Symbol.for('ITransactionTypeService'),
	ITransactionStatusService: Symbol.for('ITransactionStatusService'),
	IWalletService: Symbol.for('IWalletService'),
	ICountryService: Symbol.for('ICountryService'),
	IAssetService: Symbol.for('IAssetService'),
	ICurrencyService: Symbol.for('ICurrencyService'),
	IExchangeRateService: Symbol.for('IExchangeRateService'),
	ITenantDatabaseService: Symbol.for('ITenantDatabaseService'),

	// Database Connections
	IPostgreSQLConnection: Symbol.for('IPostgreSQLConnection'),

	// Controllers
	TestController: Symbol.for('TestController'),
	UserController: Symbol.for('UserController'),
	AuthController: Symbol.for('AuthController'),
	TransactionsController: Symbol.for('TransactionsController'),
	CallbackController: Symbol.for('CallbackController'),
	FireblockController: Symbol.for('FireblockController'),
	FeeController: Symbol.for('FeeController'),
	LogsController: Symbol.for('LogsController'),

	IQueueManager: Symbol.for('IQueueManager'),
	IQueueManagerService: Symbol.for('IQueueManagerService'),

	//Fake Partner
	FakePartnerConnector: Symbol.for('FakePartnerConnector'),
} as const;
// ...existing code...
