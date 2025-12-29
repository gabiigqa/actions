import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import {
    IQueueManager,
    JobOptions,
    QueueInfo,
} from '@domain/interfaces/infrastructure/third-party/redis-connector/queue.manager.interface';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { ConnectionOptions, Queue } from 'bullmq';
import { inject, injectable } from 'inversify';
import { AppConfig } from '@/infrastructure/config';

@injectable()
export class QueueManager implements IQueueManager {
    private connection: ConnectionOptions;
    private queues: Map<string, Queue> = new Map();
    private readonly maxRetries: number;
    private readonly retryDelays: number[];

    constructor(
        @inject(TYPES.AppConfig) private appConfig: AppConfig,
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
    ) {
        this.connection = this.createConnectionOptions();
        this.maxRetries = this.appConfig.getQueueMaxRetries();
        this.retryDelays = this.appConfig.getQueueRetryDelays();
        this.logger.info(
            `BullMQ Queue Manager initialized with Redis connection`,
        );
        this.logger.info(
            `Retry configuration: maxRetries=${this.maxRetries}, delays=${this.retryDelays.map(d => `${d / 60000}min`).join(', ')}`,
        );
    }

    /**
     * Creates BullMQ connection options from Redis URL
     * BullMQ will handle the connection pool and reconnection logic automatically
     */
    private createConnectionOptions(): ConnectionOptions {
        const redisPath = this.appConfig.getRedisPath();
        try {
            const url = new URL(redisPath);

            const options: ConnectionOptions = {
                host: url.hostname,
                port: parseInt(url.port) || 6379,
                maxRetriesPerRequest: null, // Required by BullMQ for blocking operations
                enableReadyCheck: true,
                enableOfflineQueue: true,
                retryStrategy: (times: number) => {
                    // Exponential backoff with max delay of 3 seconds
                    const delay = Math.min(times * 50, 3000);
                    this.logger.warn(`Redis connection retry attempt ${times}, waiting ${delay}ms`);
                    return delay;
                },
            };

            if (url.username) {
                options.username = url.username;
            }

            if (url.password) {
                options.password = url.password;
            }

            if (url.protocol === 'rediss:') {
                options.tls = {};
                this.logger.info('Using secure Redis connection (TLS)');
            }

            return options;
        } catch (error) {
            this.logger.error('Failed to parse Redis connection URL', error);
            throw new Error('Invalid Redis connection URL');
        }
    }

    /**
     * Gets the connection options managed by BullMQ
     */
    getConnectionOptions(): ConnectionOptions {
        return this.connection;
    }

    /**
     * Gets or creates a queue instance with BullMQ connection management
     * BullMQ automatically handles connection pooling and reconnection
     */
    private getOrCreateQueue(queueName: string): Queue {
        if (!this.queues.has(queueName)) {
            const queue = new Queue(queueName, {
                connection: this.connection,
                defaultJobOptions: {
                    removeOnComplete: 1000, // Keep last 1000 completed jobs
                    removeOnFail: 5000, // Keep last 5000 failed jobs
                },
            });

            // Set up connection event listeners
            queue.on('error', (error) => {
                this.logger.error(`Queue ${queueName} connection error:`, error);
            });

            this.queues.set(queueName, queue);
            this.logger.info(`Queue "${queueName}" created with BullMQ connection management`);
        }
        return this.queues.get(queueName)!;
    }

    /**
     * Validates if a queue connection is active
     * BullMQ handles reconnection automatically, so this checks current status
     */
    private async isQueueConnected(queue: Queue): Promise<boolean> {
        try {
            const client = await queue.client;
            return client.status === 'ready' || client.status === 'connect';
        } catch (error) {
            this.logger.warn('Failed to check queue connection status', error);
            return false;
        }
    }

    /**
     * Waits for queue to be ready
     * BullMQ will automatically reconnect if disconnected
     */
    private async waitForConnection(queue: Queue, maxAttempts: number = 10): Promise<void> {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (await this.isQueueConnected(queue)) {
                return;
            }
            this.logger.info(`Waiting for queue connection (attempt ${attempt}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        throw new Error('Queue connection timeout - BullMQ could not establish connection');
    }

    /**
     * Ensures queue is connected
     * BullMQ handles reconnection logic internally
     */
    private async ensureQueueConnection(queueName: string): Promise<Queue> {
        const queue = this.getOrCreateQueue(queueName);
        await this.waitForConnection(queue);
        return queue;
    }

    /**
     * Executes an operation with automatic retry logic
     * BullMQ handles reconnection automatically via retryStrategy
     */
    private async executeWithRetry<T>(
        queueName: string,
        operation: (queue: Queue) => Promise<T>,
        operationName: string,
    ): Promise<T> {
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const queue = await this.ensureQueueConnection(queueName);
                return await operation(queue);
            } catch (error) {
                lastError = error as Error;
                this.logger.warn(
                    `${operationName} failed (attempt ${attempt}/${this.maxRetries})`,
                    error,
                );

                if (attempt < this.maxRetries) {
                    // Get delay for this attempt (use last delay if attempt exceeds array length)
                    const delayIndex = Math.min(attempt - 1, this.retryDelays.length - 1);
                    const delay = this.retryDelays[delayIndex] || 60000; // Fallback to 1 minute

                    this.logger.info(
                        `Waiting ${(delay / 60000).toFixed(2)} minutes before retry ${attempt + 1}/${this.maxRetries}`,
                    );

                    // Wait before retrying (BullMQ will handle reconnection)
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        this.logger.error(`${operationName} failed after ${this.maxRetries} attempts`, lastError);
        throw lastError || new Error(`${operationName} failed after ${this.maxRetries} attempts`);
    }

    async getAvailableQueues(): Promise<string[]> {
        let tempQueue: Queue | undefined;
        try {
            // Reuse an existing queue if available, otherwise create a temporary one
            const existingQueues = Array.from(this.queues.values());
            if (existingQueues.length > 0) {
                const firstQueue = existingQueues[0]!; // Safe: length check above ensures element exists
                const client = await firstQueue.client;

                // Get all keys that match BullMQ queue pattern
                const keys = await client.keys('bull:*:meta');

                // Extract queue names from the keys
                const queueNames = keys
                    .map(key => {
                        // Keys are in format: bull:queueName:meta
                        const match = key.match(/^bull:(.+):meta$/);
                        return match ? match[1] : null;
                    })
                    .filter((name): name is string => name !== null);

                this.logger.info(`Retrieved ${queueNames.length} available queues from Redis`);
                return queueNames;
            }

            // If no queues exist, create a temporary one
            tempQueue = new Queue('temp-discovery', { connection: this.connection });
            const client = await tempQueue.client;

            // Get all keys that match BullMQ queue pattern
            const keys = await client.keys('bull:*:meta');

            // Extract queue names from the keys
            const queueNames = keys
                .map(key => {
                    // Keys are in format: bull:queueName:meta
                    const match = key.match(/^bull:(.+):meta$/);
                    return match ? match[1] : null;
                })
                .filter((name): name is string => name !== null && name !== 'temp-discovery');

            this.logger.info(`Retrieved ${queueNames.length} available queues from Redis`);
            return queueNames;
        } catch (error) {
            this.logger.error('Failed to get available queues', error);
            throw error;
        } finally {
            // Always close temporary queue if it was created
            if (tempQueue) {
                try {
                    await tempQueue.close();
                } catch (closeError) {
                    this.logger.warn('Error closing temporary queue:', closeError);
                }
            }
        }
    }

    async getQueueInfo(queueName: string): Promise<QueueInfo> {
        return this.executeWithRetry(
            queueName,
            async queue => {
                const counts = await queue.getJobCounts();
                const isPaused = await queue.isPaused();

                const queueInfo: QueueInfo = {
                    name: queueName,
                    waiting: counts.waiting || 0,
                    active: counts.active || 0,
                    completed: counts.completed || 0,
                    failed: counts.failed || 0,
                    delayed: counts.delayed || 0,
                    paused: isPaused,
                };

                this.logger.info(`Retrieved info for queue: ${queueName}`, queueInfo);
                return queueInfo;
            },
            `getQueueInfo for ${queueName}`,
        );
    }

    async getAllQueuesInfo(): Promise<QueueInfo[]> {
        try {
            const queueNames = await this.getAvailableQueues();
            const queuesInfo = await Promise.all(
                queueNames.map(queueName => this.getQueueInfo(queueName)),
            );
            this.logger.info(`Retrieved info for ${queuesInfo.length} queues`);
            return queuesInfo;
        } catch (error) {
            this.logger.error('Failed to get all queues info', error);
            throw error;
        }
    }

    async cleanQueue(queueName: string): Promise<void> {
        await this.executeWithRetry(
            queueName,
            async queue => {
                await queue.obliterate({ force: true });
                this.logger.info(`Queue ${queueName} has been cleaned`);
            },
            `cleanQueue ${queueName}`,
        );
    }

    async createJob(
        queueName: string,
        jobName: string,
        data: any,
        opts?: JobOptions,
    ): Promise<void> {
        await this.executeWithRetry(
            queueName,
            async queue => {
                const jobOptions: any = {};

                if (opts) {
                    if (opts.delay) jobOptions.delay = opts.delay;
                    if (opts.priority) jobOptions.priority = opts.priority;
                    if (opts.repeat) jobOptions.repeat = opts.repeat;
                    if (opts.jobId) jobOptions.jobId = opts.jobId;
                }

                await queue.add(jobName, data, jobOptions);
                this.logger.info(`Job ${jobName} created in queue ${queueName}`);
            },
            `createJob ${jobName} in ${queueName}`,
        );
    }

    async createJobs(
        queueName: string,
        jobs: { jobName: string; data: any; opts?: JobOptions }[],
    ): Promise<void> {
        await this.executeWithRetry(
            queueName,
            async queue => {
                const bullJobs = jobs.map(job => {
                    const jobOptions: any = {};
                    if (job.opts) {
                        if (job.opts.delay) jobOptions.delay = job.opts.delay;
                        if (job.opts.priority) jobOptions.priority = job.opts.priority;
                        if (job.opts.repeat) jobOptions.repeat = job.opts.repeat;
                        if (job.opts.jobId) jobOptions.jobId = job.opts.jobId;
                    }
                    return { name: job.jobName, data: job.data, opts: jobOptions };
                });

                await queue.addBulk(bullJobs);
                this.logger.info(`${jobs.length} jobs created in queue ${queueName}`);
            },
            `createJobs (${jobs.length} jobs) in ${queueName}`,
        );
    }

    async getJobInQueue(
        queueName: string,
        state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed',
    ): Promise<any[]> {
        return this.executeWithRetry(
            queueName,
            async queue => {
                let jobs: any[] = [];

                switch (state) {
                    case 'waiting':
                        jobs = await queue.getWaiting();
                        break;
                    case 'active':
                        jobs = await queue.getActive();
                        break;
                    case 'completed':
                        jobs = await queue.getCompleted();
                        break;
                    case 'failed':
                        jobs = await queue.getFailed();
                        break;
                    case 'delayed':
                        jobs = await queue.getDelayed();
                        break;
                }

                this.logger.info(`Retrieved ${jobs.length} ${state} jobs from queue ${queueName}`);
                return jobs;
            },
            `getJobInQueue (${state}) from ${queueName}`,
        );
    }

    /**
     * Closes all queue connections
     * BullMQ will handle graceful shutdown of connections
     */
    async closeAllConnections(): Promise<void> {
        this.logger.info(`Closing ${this.queues.size} queue connections...`);
        const closePromises = Array.from(this.queues.values()).map(queue =>
            queue.close().catch(error => {
                this.logger.error('Error closing queue connection:', error);
            })
        );
        await Promise.all(closePromises);
        this.queues.clear();
        this.logger.info('All queue connections closed');
    }
}
