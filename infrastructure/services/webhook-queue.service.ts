import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { secretsCache } from '../config/azure.config'

dotenv.config({ quiet: true });

// Interfaz para el job del webhook
export interface WebhookJobData {
  // Campos de la transacción
  transactionId: string;
  externalReference: string;
  transactionStatus: string;
  transactionType: string;
  details: any;
  
  // Campos del webhook
  webhookUrl: string;
  headers?: Record<string, string>;
  
  // Campos para guardar en la BD
  businessId: string;
  businessWebhookId: string;
  eventType: string; // Tipo de evento del webhook (ej: 'transactions.created', 'transactions.updated')
  callbackUrl: string; // URL del callback (mismo que webhookUrl)
  httpMethod: string; // Método HTTP (ej: 'POST')
  xApiKey: string; // API Key para autenticación
  payload: any; // Payload que se envía (mismo que details)
}

/**
 * Servicio para encolar jobs de webhook usando BullMQ
 */
export class WebhookQueueService {
  private queue: Queue<WebhookJobData>;
  private connection: IORedis;

  constructor() {
    const REDIS_URL = secretsCache['REDIS-URL']

    if (!REDIS_URL) {
      throw new Error('REDIS_URL environment variable is required');
    }

    // Crear conexión Redis para BullMQ
    this.connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null, // Requerido por BullMQ
      tls: REDIS_URL.startsWith('rediss://') ? {} : undefined,
    });

    // Crear la cola
    this.queue = new Queue<WebhookJobData>('webhooks', {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 5, // Máximo 5 intentos
        backoff: {
          type: 'exponential',
          delay: 5000, // Delay inicial de 5 segundos (antes era 1 segundo)
          // Con exponential: 5s, 10s, 20s, 40s, 80s
        },
        removeOnComplete: {
          age: 24 * 3600, // Mantener jobs completados por 24 horas
          count: 1000, // Mantener máximo 1000 jobs completados
        },
        removeOnFail: {
          age: 7 * 24 * 3600, // Mantener jobs fallidos por 7 días
        },
      },
    });
  }

  /**
   * Encola un job de webhook
   */
  async enqueueWebhook(jobData: WebhookJobData): Promise<void> {
    try {
      // Crear un jobId único basado en transactionId + webhookUrl para evitar duplicados
      // Si el mismo webhook ya está en la cola (waiting, active, delayed), no se encolará de nuevo
      // Esto previene que el mismo webhook se envíe múltiples veces para la misma transacción
      const urlHash = Buffer.from(jobData.webhookUrl).toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 20);
      const jobId = `webhook-${jobData.transactionId}-${urlHash}`;
      
      const job = await this.queue.add(
        'webhook',
        jobData,
        {
          jobId: jobId, // JobId único para evitar duplicados
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 5000, // 5 segundos inicial, luego 10s, 20s, 40s, 80s
            // Esto permite que otros webhooks en la cola se procesen antes de reintentar
          },
          removeOnComplete: {
            age: 24 * 3600, // Mantener jobs completados por 24 horas
            count: 1000,
          },
          removeOnFail: {
            age: 7 * 24 * 3600, // Mantener jobs fallidos por 7 días
          },
        }
      );

      console.log(`✅ Webhook job enqueued: ${job.id} (${jobId}) for ${jobData.externalReference}`);
    } catch (error: any) {
      console.error('❌ Error enqueuing webhook job:', error);
      throw error;
    }
  }

  /**
   * Cierra la conexión (útil para shutdown graceful)
   */
  async close(): Promise<void> {
    await this.queue.close();
    await this.connection.quit();
  }
}

// Singleton instance
let webhookQueueServiceInstance: WebhookQueueService | null = null;

export function getWebhookQueueService(): WebhookQueueService {
  if (!webhookQueueServiceInstance) {
    webhookQueueServiceInstance = new WebhookQueueService();
  }
  return webhookQueueServiceInstance;
}



