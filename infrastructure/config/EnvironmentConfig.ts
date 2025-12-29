import { TYPES } from '@/infrastructure/config/inversify/types';
import dotenv from 'dotenv';
import { inject } from 'inversify';
import { secretsCache } from './azure.config'

export class EnvironmentConfig {
  private isInitialized = false;
  protected logger?: any; // Optional logger to avoid circular dependencies
  constructor(
    @inject(TYPES.ILoggerService) logger: any
  ) { }

  /**
   * Set the logger instance (for cases where DI is not available)
   */
  public setLogger(logger: any): void {
    this.logger = logger;
  }

  public parseKeyToAzure = (keyName: string): string => {
    const parsedKey = keyName.replace(/_/g, '-')
    return parsedKey
  }

  /**
   * Initializes the environment configuration
   * Should be called once at application startup
   */
  public initialize(): void {
    if (this.isInitialized) return;
    dotenv.config({
      quiet: true,
    });
    this.validateRequiredVariables();
    this.isInitialized = true;
  }

  /**
   * Gets an environment variable value
   * Throws an error if the variable is not defined
   */
  public getVariable(key: string): string {
    const value = secretsCache[this.parseKeyToAzure(key)]
    if (value === undefined || value === null || value === '') {
      throw new Error(`Environment variable '${key}' is not defined or is empty`);
    }
    return value;
  }

  /**
   * Gets an environment variable with a default value
   */
  public getVariableOrDefault(key: string, defaultValue: string): string {
    const value = secretsCache[this.parseKeyToAzure(key)]
    return value && value !== '' ? value : defaultValue;
  }

  /**
   * Gets an environment variable as a number
   * Throws an error if the variable is not defined or is not a valid number
   */
  public getNumberVariable(key: string): number {
    const value = this.getVariable(key);
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new Error(`Environment variable '${key}' is not a valid number: ${value}`);
    }
    return numValue;
  }

  /**
   * Gets an environment variable as a number with a default value
   */
  public getNumberVariableOrDefault(key: string, defaultValue: number): number {
    try {
      return this.getNumberVariable(key);
    } catch {
      return defaultValue;
    }
  }

  /**
   * Gets an environment variable as a boolean
   * Returns true for: 'true', '1', 'yes', 'on' (case insensitive)
   * Returns false for: 'false', '0', 'no', 'off' (case insensitive)
   * Throws an error if the variable is not defined or is not a valid boolean
   */
  public getBooleanVariable(key: string): boolean {
    const value = this.getVariable(key).toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(value)) {
      return true;
    }
    if (['false', '0', 'no', 'off'].includes(value)) {
      return false;
    }
    throw new Error(`Environment variable '${key}' is not a valid boolean: ${value}`);
  }

  /**
   * Gets an environment variable as a boolean with a default value
   */
  public getBooleanVariableOrDefault(key: string, defaultValue: boolean): boolean {
    try {
      return this.getBooleanVariable(key);
    } catch {
      return defaultValue;
    }
  }

  /**
   * Checks if an environment variable is defined
   */
  public hasVariable(key: string): boolean {
    const value = secretsCache[this.parseKeyToAzure(key)]
    return value !== undefined && value !== null && value !== '';
  }

  /**
   * Gets the current environment (development, production, test)
   */
  public getEnvironment(): string {
    return this.getVariableOrDefault('NODE_ENV', 'development');
  }

  /**
   * Checks if the current environment is development
   */
  public isDevelopment(): boolean {
    return this.getEnvironment() === 'development';
  }

  /**
   * Checks if the current environment is production
   */
  public isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  public isSandbox(): boolean {
    return this.getEnvironment()==='sandbox';
  }

  public isStaging(): boolean {
    return this.getEnvironment() === 'staging';
  }

  /**
   * Checks if the current environment is test
   */
  public isTest(): boolean {
    return this.getEnvironment() === 'test';
  }

  private validateRequiredVariables(): void {
    const requiredVariables = this.getRequiredVariables();
    const missingVariables: string[] = [];

    for (const variable of requiredVariables) {
      if (!this.hasVariable(variable)) {
        missingVariables.push(variable);
      }
    }

    if (missingVariables.length > 0) {
      this.logger.error(`Missing required environment variables: ${missingVariables.join(', ')}`);
      throw new Error(
        `Missing required environment variables: ${missingVariables.join(', ')}\n` +
        'Please check your .env file or environment configuration.'
      );
    }
  }

  /**
   * Returns the list of required environment variables
   * Override this method to customize required variables for your application
   */
  protected getRequiredVariables(): string[] {
    // In production environments like Render, some variables might be optional
    // or have sensible defaults to prevent deployment failures
    const baseRequired = [
      'NODE_ENV'
    ];

    // Add additional required variables only if they don't have defaults
    const additionalRequired = [];
    // Only require JWT_SECRET if not provided as default
    if (!this.hasVariable('JWT_SECRET')) {
      additionalRequired.push('JWT_SECRET');
    }

    // BVNK variables are only required if the service is used
    // In a microservice architecture, not all services need all integrations
    if (this.getVariableOrDefault('ENABLE_BVNK', 'false') === 'true') {
      if (!this.hasVariable('BVNK_SECRET_KEY')) {
        additionalRequired.push('BVNK_SECRET_KEY');
      }
      if (!this.hasVariable('BVNK_AUTH_ID')) {
        additionalRequired.push('BVNK_AUTH_ID');
      }
    }

    return [...baseRequired, ...additionalRequired];
  }

  /**
   * Gets all environment variables (for debugging purposes - use with caution)
   * Only available in development environment
   */
  public getAllVariables(): Record<string, string | undefined> {
    if (!this.isDevelopment()) {
      throw new Error('getAllVariables() is only available in development environment');
    }
    return secretsCache;
  }
}
