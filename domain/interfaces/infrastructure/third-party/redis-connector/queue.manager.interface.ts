export interface QueueInfo {
    name: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
}

export interface JobOptions {
    delay?: number;
    priority?: number;
    repeat?: {
        pattern?: string;
        every?: number;
        limit?: number;
    };
    jobId?: string;
}

/**
 * Interface for managing queues and jobs.
 * Focuses exclusively on queue and job operations, without coupling to infrastructure concerns.
 */
export interface IQueueManager {
    /**
     * Gets all available queues
     */
    getAvailableQueues(): Promise<string[]>;

    /**
     * Gets detailed information about a specific queue
     * @param queueName - The name of the queue
     */
    getQueueInfo(queueName: string): Promise<QueueInfo>;

    /**
     * Gets detailed information about all available queues
     */
    getAllQueuesInfo(): Promise<QueueInfo[]>;

    /**
     * Cleans all jobs from the specified queue
     * @param queueName - The name of the queue to clean
     */
    cleanQueue(queueName: string): Promise<void>;

    /**
     * Creates a new job in the specified queue
     * @param queueName - The name of the queue
     * @param jobName - The name of the job
     * @param data - The data for the job
     * @param opts - Optional job options
     */
    createJob(queueName: string, jobName: string, data: any, opts?: JobOptions): Promise<void>;

    /**
     * Creates multiple jobs in the specified queue
     * @param queueName - The name of the queue
     * @param jobs - An array of job definitions including jobName, data, and optional opts
     */
    createJobs(
        queueName: string,
        jobs: { jobName: string; data: any; opts?: JobOptions }[],
    ): Promise<void>;

    /**
     * Gets jobs from a specific queue based on their state
     * @param queueName - The name of the queue
     * @param state - The state of the jobs to retrieve
     */
    getJobInQueue(
        queueName: string,
        state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed',
    ): Promise<any[]>;
}
