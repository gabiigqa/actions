import { ConnectionOptions } from 'bullmq';
import { Redis } from 'ioredis';

export interface IRedisConnector {
    /**
     * Establishes connection to Redis using the configured Redis path
     */
    connect(): Promise<void>;

    /**
     * Disconnects from Redis
     */
    disconnect(): Promise<void>;

    /**
     * Gets the Redis client instance
     */
    getClient(): Redis;

    /**
     * Gets BullMQ connection options
     */
    getBullMQConnection(): ConnectionOptions;

    /**
     * Checks if Redis is connected
     */
    isRedisConnected(): boolean;

    /**
     * Performs a health check on the Redis connection
     */
    healthCheck(): Promise<boolean>;
}
