import { TYPES } from '@/infrastructure/config/inversify/types';
import { inject } from 'inversify';
import { EnvironmentConfig } from './EnvironmentConfig';

export class AppConfig extends EnvironmentConfig {
  getDatabaseHost(): string {
    return this.getVariableOrDefault('DATABASE_HOST', 'localhost');
  }

  getDatabasePort(): number {
    return this.getNumberVariableOrDefault('DATABASE_PORT', 5432);
  }

  getDatabaseName(): string {
    return this.getVariableOrDefault('DATABASE_NAME', '');
  }

  getDatabaseUsername(): string {
    return this.getVariableOrDefault('DATABASE_USERNAME', '');
  }

  getDatabasePassword(): string {
    return this.getVariableOrDefault('DATABASE_PASSWORD', '');
  }

  constructor(
    @inject(TYPES.ILoggerService) logger: any
  ) {
    super(logger);
  }

  /**
   * Initializes the application configuration
   * Should be called once at application startup
   */
  public initialize(): void {
    super.initialize();
  }

  /**
   * Gets the server port
   * Render provides PORT environment variable, fall back to 3000 for local development
   * Ensures the port is always a valid number
   */
  public getPort(): number {
    const port = process.env.PORT || this.getVariableOrDefault('PORT', '3000');
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber) || portNumber <= 0 || portNumber > 65535) {
      this.logger?.log(`Invalid port value: ${port}, using default 3000`);
      return 3000;
    }
    return portNumber;
  }

  /**
   * Gets the hostname for server binding
   * In production (like Render), we should bind to 0.0.0.0 to accept connections from all interfaces
   * In development, use localhost for security
   */
  public getHostname(): string {
    if (this.isProduction()) {
      return '0.0.0.0';
    }
    return this.getVariableOrDefault('HOSTNAME', 'localhost');
  }

  /**
   * Gets the database configuration
   */
  public getDatabaseUrl(): string {
    return this.getVariableOrDefault('DATABASE_URL', '');
  }

  /**
   * Gets the BVNK hashing algorithm
   */
  public getBvnkAlgorithm(): "sha1" | "sha256" {
    let algorithm = this.getVariableOrDefault('BVNK_ALGORITHM', 'sha256');
    if (algorithm !== 'sha1' && algorithm !== 'sha256') {
      throw new Error(`Invalid BVNK_ALGORITHM: ${algorithm}`);
    }
    return algorithm;
  }

  /**
   * Gets the BVNK secret key
   */
  public getBvnkSecretKey(): string {
    return this.getVariableOrDefault('BVNK_SECRET_KEY', 'development-secret-key');
  }

  /**
   * Gets the BVNK authentication ID
   */
  public getBvnkAuthId(): string {
    return this.getVariableOrDefault('BVNK_AUTH_ID', 'development-auth-id');
  }

  /**
   * Gets the JWT secret
   */
  public getJwtSecret(): string {
    return this.getVariableOrDefault('JWT_SECRET', 'development-jwt-secret-change-in-production');
  }

  /**
   * Gets JWT expiration time
   */
  public getJwtExpiresIn(): number {
    return this.getNumberVariableOrDefault('JWT_EXPIRES_IN', 24 * 60 * 60);
  }

  /**
   * Gets JWT refresh token expiration time
   */
  public getJwtRefreshExpiresIn(): number {
    return this.getNumberVariableOrDefault('JWT_REFRESH_EXPIRES_IN', 7 * 24 * 60 * 60);
  }


  getQueueMaxRetries(): number {
    return this.getNumberVariableOrDefault('QUEUE_MAX_RETRIES', 3);
  }

  getQueueRetryDelays(): number[] {
    const delaysStr = this.getVariableOrDefault('QUEUE_RETRY_DELAYS', '1,2,5');

    try {
      // Parse comma-separated values and convert minutes to milliseconds
      const delays = delaysStr
        .split(',')
        .map(str => str.trim())
        .filter(str => str.length > 0)
        .map(str => {
          const minutes = parseFloat(str);
          if (isNaN(minutes) || minutes < 0) {
            throw new Error(`Invalid delay value: ${str}`);
          }
          return minutes * 60 * 1000; // Convert minutes to milliseconds
        });

      if (delays.length === 0) {
        throw new Error('No valid delays found');
      }

      return delays;
    } catch (error) {
      this.logger?.warn(`Failed to parse QUEUE_RETRY_DELAY, using defaults: ${error}`);
      // Default delays: 1, 2, and 5 minutes in milliseconds
      return [60000, 120000, 300000];
    }
  }

  getRedisPath(): string {
    return this.getVariableOrDefault('REDIS_PATH', '');
  }
  /**
   * Gets Fireblocks API key
  */
  public getFireblocksApiKey(): string {
    return this.getVariableOrDefault('FIREBLOCKS_API_KEY', '');
  }

  public getFireblocksSecretPath(): string {
    return this.getVariableOrDefault('FIREBLOCKS_SECRET_PATH', '');
  }

  public getFireblocksBasePath(): string {
    return this.getVariableOrDefault('FIREBLOCKS_BASE_PATH', 'https://sandbox-api.fireblocks.io');
  }

  public getFireblocksAssets(): string[] {
    const assets = this.getVariableOrDefault('FIREBLOCKS_ASSETS', 'USDC');
    return assets.split(',').map(asset => asset.trim());
  }

  public getCommissionAddress(): string {
    return this.getVariableOrDefault('COMMISSION_ADDRESS', '');
  }
  public getAtcBasePath(): string {
    return this.getVariableOrDefault('ATC_BASE_PATH', '');
  }
  public getAPiKeyATC(): string {
    return this.getVariableOrDefault('API_KEY_ATC', '');
  }

  public getAPiKeyATCCallback(): string {
    return this.getVariableOrDefault('API_KEY_ATC_CALLBACK', '');
  }

  public getAPiKeyCallback(): string {
    return this.getVariableOrDefault('X_API_KEY', '');
  }

  /**
   * Gets ATC Payout base path URL
   */
  public getAtcPayoutBasePath(): string {
    return this.getVariableOrDefault('ATC_PAYOUT_BASE_PATH', 'https://atcsindev.redenlace.com.bo');
  }

  /**
   * Gets ATC Payout key ID for HMAC authentication
   */
  public getAtcPayoutKeyId(): string {
    return this.getVariableOrDefault('ATC_PAYOUT_KEY_ID', '');
  }

  /**
   * Gets ATC Payout shared secret for HMAC signature (Base64)
   */
  public getAtcPayoutSharedSecret(): string {
    return this.getVariableOrDefault('ATC_PAYOUT_SHARED_SECRET', '');
  }

  /**
   * Gets ATC Payout branch ID (merchant code)
   */
  public getAtcPayoutBranchId(): string {
    return this.getVariableOrDefault('ATC_PAYOUT_BRANCH_ID', '');
  }

  /**
   * Gets ATC Payout public key for encrypting requests (PEM format)
   */
  public getAtcPayoutPublicKey(): string {
    let key = this.getVariableOrDefault('ATC_PAYOUT_PUBLIC_KEY', '');
    // Remove surrounding quotes if Azure Key Vault added them
    if (key.startsWith('"') && key.endsWith('"')) {
      key = key.slice(1, -1);
    }
    // Replace literal \n with actual newlines if they exist
    return key.replace(/\\n/g, '\n');
  }

  /**
   * Gets own private key for decrypting ATC Payout responses (PEM format)
   */
  public getAtcPayoutOwnPrivateKey(): string {
    let key = this.getVariableOrDefault('ATC_PAYOUT_OWN_PRIVATE_KEY', '');
    // Remove surrounding quotes if Azure Key Vault added them
    if (key.startsWith('"') && key.endsWith('"')) {
      key = key.slice(1, -1);
    }
    // Replace literal \n with actual newlines if they exist
    return key.replace(/\\n/g, '\n');
  }

  /**
   * Gets CORS origins
   */
  public getCorsOrigins(): string[] {
    const corsOrigins = this.getVariableOrDefault('CORS_ORIGINS', '*');
    return corsOrigins === '*' ? ['*'] : corsOrigins.split(',').map(origin => origin.trim());
  }

  /**
   * Gets the log level
   */
  public getLogLevel(): string {
    return this.getVariableOrDefault('LOG_LEVEL', this.isDevelopment() ? 'debug' : 'info');
  }

  /**
   * Gets the rate limit window in milliseconds
   */
  public getRateLimitWindowMs(): number {
    return this.getNumberVariableOrDefault('RATE_LIMIT_WINDOW_MS', 1 * 60 * 1000); // 1 minute
  }
  /**
   * Gets max requests per rate limit window
   */
  public getRateLimitMaxRequests(): number {
    return this.getNumberVariableOrDefault('RATE_LIMIT_MAX_REQUESTS', 50);
  }

  /**
   * Gets the number of salt rounds for password hashing
   */
  public getSaltRounds(): number {
    return this.getNumberVariableOrDefault('SALT_ROUNDS', 10);
  }

  /**
   * Gets request timeout in milliseconds
   */
  public getRequestTimeout(): number {
    return this.getNumberVariableOrDefault('REQUEST_TIMEOUT', 30000); // 30 seconds
  }

  /**
   * Override to define application-specific required variables
   */
  protected getRequiredVariables(): string[] {
    const baseRequired = super.getRequiredVariables();
    const appRequired: string[] = [
      // Add your application-specific required variables here
      'JWT_SECRET',
      'ATC_COD_SUCURSAL',
      'ATC_NOM_SUCURSAL',
      'ATC_RUBRO_COMERCIO',
      'ATC_QR_EXPIRY'
    ];

    // In production, some variables might be required that aren't in development
    if (this.isProduction()) {
      appRequired.push(
        // Add production-only required variables here
        // Example: 'DATABASE_URL'
      );
    }

    return [...baseRequired, ...appRequired];
  }

  /**
   * Gets all application configuration as an object
   * Useful for logging configuration at startup
   */
  public getAppConfigSummary(): Record<string, any> {
    return {
      environment: this.getEnvironment(),
      port: this.getPort(),
      logLevel: this.getLogLevel(),
      corsOrigins: this.getCorsOrigins(),
      rateLimitWindowMs: this.getRateLimitWindowMs(),
      rateLimitMaxRequests: this.getRateLimitMaxRequests(),
      requestTimeout: this.getRequestTimeout(),
      isDevelopment: this.isDevelopment(),
      isProduction: this.isProduction(),
      isTest: this.isTest(),
      bvnk: {
        secretKey: this.getBvnkSecretKey(),
        authId: this.getBvnkAuthId(),
        algorithm: this.getBvnkAlgorithm(),
      },
    };
  }

  public getDatabaseURL(): string {
    return this.getVariableOrDefault('DATABASE_URL', '');
  }

  public getAtcCodSucursal(): string {
    return this.getVariableOrDefault('ATC_COD_SUCURSAL', '');
  }

  public getAtcNomSucursal(): string {
    return this.getVariableOrDefault('ATC_NOM_SUCURSAL', '');
  }

  public getAtcRubroComercio(): string {
    return this.getVariableOrDefault('ATC_RUBRO_COMERCIO', '');
  }

  public getAtcQrExpiry(): string {
    return this.getVariableOrDefault('ATC_QR_EXPIRY', '00:15:00');
  }
}

// No default export: always use AppConfig.getInstance(container) for singleton access
