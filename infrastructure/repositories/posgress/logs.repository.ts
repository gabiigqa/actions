import { BaseRepository } from './base.repository'
import { IPostgreSQLConnection } from '@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection'
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService'
import { TYPES } from '@/infrastructure/config/inversify'
import { inject, injectable } from 'inversify'
import { AppConfig } from '@/infrastructure/config'
import { LogsData } from '@/domain/interfaces/domain/services/ILogsService'
import { ILogsRepository } from '@/domain/interfaces/infrastructure/repositories/ILogsRepository'

@injectable()
export class LogsRepository extends BaseRepository implements ILogsRepository {
  constructor (
    @inject(TYPES.IPostgreSQLConnection)  postgreSQLConnection: IPostgreSQLConnection,
    @inject(TYPES.AppConfig) appConfig: AppConfig,
    @inject(TYPES.ILoggerService) loggerService: ILoggerService
  ) {
    super(loggerService, appConfig, postgreSQLConnection)
  }

  async addLog (logData: LogsData): Promise<boolean> {
    try {
      this.loggerService.info('Adding new log entry:', logData)

      const query = `
        INSERT INTO integration.gateway_logs (consumer, request, client_ip, response, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `
      const values = [
        logData.consumer,
        logData.request,
        logData.client_ip,
        logData.response
      ]
      await this.postgreSQLConnection.query(query, values);
      return true;
    } catch (error) {
      this.loggerService.error('Error adding log:', {
        logData,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return false
    }
  }
}