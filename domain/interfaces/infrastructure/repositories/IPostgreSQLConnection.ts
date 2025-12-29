import { PoolClient } from 'pg';

/**
 * Interface for PostgreSQL database connection management
 * Provides methods for connecting, querying, and managing database connections
 */
export interface PostgreSQLConnectionConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  ssl: boolean | { rejectUnauthorized: boolean };
}

export interface IPostgreSQLConnection {
  /**
   * Initialize the connection pool
   * @returns Promise that resolves when the pool is ready
   */
  initialize(): Promise<void>;

  /**
   * Get a client from the connection pool
   * @returns Promise that resolves to a PoolClient
   */
  getClient(): Promise<PoolClient>;

  /**
   * Execute a query with parameters
   * @param text SQL query string
   * @param params Query parameters
   * @returns Promise that resolves to query result
   */
  query(text: string, params?: any[]): Promise<any>;

  /**
   * Begin a database transaction
   * @returns Promise that resolves to a PoolClient with an active transaction
   */
  beginTransaction(): Promise<PoolClient>;

  /**
   * Commit a transaction
   * @param client The client with the active transaction
   * @returns Promise that resolves when transaction is committed
   */
  commitTransaction(client: PoolClient): Promise<void>;

  /**
   * Rollback a transaction
   * @param client The client with the active transaction
   * @returns Promise that resolves when transaction is rolled back
   */
  rollbackTransaction(client: PoolClient): Promise<void>;

  /**
   * Check if the database connection is healthy
   * @returns Promise that resolves to true if connection is healthy
   */
  isHealthy(): Promise<boolean>;

  /**
   * Close all connections in the pool
   * @returns Promise that resolves when all connections are closed
   */
  close(): Promise<void>;

  /**
   * Get connection pool statistics
   * @returns Pool statistics object
   */
  getPoolStats(): {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  };
}