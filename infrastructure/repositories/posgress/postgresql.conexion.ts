import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IPostgreSQLConnection, PostgreSQLConnectionConfig } from '@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection';
import { AppConfig, EnvironmentConfig } from '@/infrastructure/config';
import { TYPES } from '@/infrastructure/config/inversify';
import { inject, injectable } from 'inversify';
import { Pool, PoolClient, PoolConfig } from 'pg';

/**
 * PostgreSQL connection implementation using connection pooling
 * Implements best practices for database connection management
 */
@injectable()
export class PostgreSQLConnection implements IPostgreSQLConnection {
  private pool: Pool | null = null;
  private isInitialized = false;
  private config: PostgreSQLConnectionConfig;


  constructor(
    @inject(TYPES.AppConfig) private appConfig: AppConfig,
    @inject(TYPES.EnvironmentConfig) private environmentConfig: EnvironmentConfig,
    @inject(TYPES.ILoggerService) private logger: ILoggerService
  ) {
    const configuration = this.getConfiguration();
    if (!configuration) {
      throw new Error('Invalid database configuration');
    }
    this.config = configuration;
  }

  private getConfiguration(): PostgreSQLConnectionConfig | null {
    try {
      const databaseUrl = this.appConfig.getDatabaseURL();
      let options: PostgreSQLConnectionConfig;
      if (!databaseUrl) {
        this.logger.info('Building database configuration from individual environment variables');
        const host = this.appConfig.getDatabaseHost();
        // Auto-detect SSL requirement based on hostname (Render databases require SSL)
        const requiresSSL = host.includes('render.com') ||
                           this.environmentConfig.isProduction() ||
                           this.environmentConfig.isStaging();

        options = {
          host,
          port: this.appConfig.getDatabasePort(),
          database: this.appConfig.getDatabaseName(),
          username: this.appConfig.getDatabaseUsername(),
          password: this.appConfig.getDatabasePassword(),
          ssl: requiresSSL ? { rejectUnauthorized: false } : false
        };
      } else {
        this.logger.info('Database URL retrieved from configuration');
        const parsedUrl = new URL(databaseUrl);
        options = {
          host: parsedUrl.hostname,
          port: parseInt(parsedUrl.port, 10) || 5432,
          database: parsedUrl.pathname.slice(1),
          ssl: false
        };

        if (parsedUrl.username) {
          options.username = parsedUrl.username;
        }
        if (parsedUrl.password) {
          options.password = parsedUrl.password;
        }

        if (this.environmentConfig.isProduction()) {
          options.ssl = { rejectUnauthorized: false };
        } else if (this.environmentConfig.isStaging() || this.environmentConfig.isSandbox()) {
          options.ssl = { rejectUnauthorized: false };
        }
        // En desarrollo, permitir conexiones sin SSL para bases de datos locales
        // Si tu base de datos local requiere SSL, cambia esto a { rejectUnauthorized: false }
        else if (this.environmentConfig.isDevelopment()) {
          options.ssl = false;
        }
      }

      return options;

    } catch (error) {
      this.logger.error('Error retrieving database configuration', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null
    }
  }

  /**
   * Initialize the connection pool with optimal settings
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.info('PostgreSQL connection already initialized');
      return;
    }

    try {
      const poolConfig: PoolConfig = {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
        // Connection pool settings
        max: 20, // Maximum number of clients in pool
        min: 2,  // Minimum number of clients in pool
        idleTimeoutMillis: 30000, // 30 seconds
        connectionTimeoutMillis: 10000, // 10 seconds
        ssl: this.config.ssl,
        // Additional settings
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
        allowExitOnIdle: true
      };

      this.pool = new Pool(poolConfig);

      this.setupPoolEventHandlers();

      await this.testConnection();

      this.isInitialized = true;
      this.logger.info(`PostgreSQL connection pool initialized successfully - Host: ${this.config.host}:${this.config.port}, DB: ${this.config.database}, Max: ${poolConfig.max}, Min: ${poolConfig.min}`);
    } catch (error) {
      this.logger.error('Failed to initialize PostgreSQL connection pool', {
        error: error instanceof Error ? error.message : 'Unknown error',
        host: this.config.host,
        port: this.config.port,
        database: this.config.database
      });
      throw new Error(`Database connection initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a client from the connection pool
   */
  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('Database connection not initialized. Call initialize() first.');
    }

    try {
      const client = await this.pool.connect();
      this.logger.info('Database client acquired from pool');
      return client;
    } catch (error) {
      this.logger.error('Failed to acquire database client', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error(`Failed to get database client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Execute a query with optional parameters
   */
  async query(text: string, params?: any[]): Promise<any> {
    if (!this.pool) {
      throw new Error('Database connection not initialized. Call initialize() first.');
    }

    const start = Date.now();
    try {
      this.logger.info(`Executing query with ${params?.length || 0} parameters`);

      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      this.logger.info(`Query executed successfully in ${duration}ms, returned ${result.rowCount || 0} rows`);

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.error('Query execution failed', {
        sql: text,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      });
      throw error;
    }
  }

  /**
   * Begin a database transaction
   */
  async beginTransaction(): Promise<PoolClient> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      this.logger.info('Transaction started');
      return client;
    } catch (error) {
      client.release();
      this.logger.error('Failed to begin transaction', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Commit a transaction
   */
  async commitTransaction(client: PoolClient): Promise<void> {
    try {
      await client.query('COMMIT');
      this.logger.info('Transaction committed');
    } catch (error) {
      this.logger.error('Failed to commit transaction', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Rollback a transaction
   */
  async rollbackTransaction(client: PoolClient): Promise<void> {
    try {
      await client.query('ROLLBACK');
      this.logger.info('Transaction rolled back');
    } catch (error) {
      this.logger.error('Failed to rollback transaction', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if the database connection is healthy
   */
  async isHealthy(): Promise<boolean> {
    if (!this.pool) {
      return false;
    }

    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.warn(`Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Close all connections in the pool
   */
  async close(): Promise<void> {
    if (!this.pool) {
      return;
    }

    try {
      await this.pool.end();
      this.pool = null;
      this.isInitialized = false;
      this.logger.info('PostgreSQL connection pool closed');
    } catch (error) {
      this.logger.error('Error closing database pool', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Get connection pool statistics
   */
  getPoolStats(): { totalCount: number; idleCount: number; waitingCount: number } {
    if (!this.pool) {
      return { totalCount: 0, idleCount: 0, waitingCount: 0 };
    }

    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }

  /**
   * Test database connection during initialization
   */
  private async testConnection(): Promise<void> {
    if (!this.pool) {
      throw new Error('Pool not initialized');
    }

    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT version()');
      client.release();
      const version = result.rows[0]?.version?.substring(0, 50) || 'Unknown';
      this.logger.info(`Database connection test successful - Version: ${version}`);
    } catch (error) {
      throw new Error(`Database connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set up event handlers for pool monitoring
   */
  private setupPoolEventHandlers(): void {
    if (!this.pool) {
      return;
    }

    this.pool.on('connect', (client) => {
      this.logger.info(`New client connected to database - Total: ${this.pool?.totalCount}, Idle: ${this.pool?.idleCount}`);
    });

    this.pool.on('acquire', (client) => {
      this.logger.info(`Client acquired from pool - Total: ${this.pool?.totalCount}, Idle: ${this.pool?.idleCount}`);
    });

    this.pool.on('remove', (client) => {
      this.logger.info(`Client removed from pool - Total: ${this.pool?.totalCount}, Idle: ${this.pool?.idleCount}`);
    });

    this.pool.on('error', (error, client) => {
      this.logger.error('Unexpected error on idle client', {
        error: error.message,
        totalCount: this.pool?.totalCount,
        idleCount: this.pool?.idleCount
      });
    });
  }
}