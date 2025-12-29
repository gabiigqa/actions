import { LogsRequest } from '@/domain/interfaces/infrastructure/controllers/requests/LogsRequest'
import { Request, Response } from 'express'
import { controller, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { ILogsRepository } from '@/domain/interfaces/infrastructure/repositories/ILogsRepository'
import { TYPES } from '@infrastructure/config/inversify/types'
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService'

@controller('/api/logs')
export class LogsController {
  constructor(
    @inject(TYPES.ILogsRepository) private logsService: ILogsRepository,
    @inject(TYPES.ILoggerService) private loggerService: ILoggerService
  ) { }

  @httpPost('/log')
  async log(req: Request, res: Response): Promise<any>{
    try {
      const { body } = req
      const { consumer, request, client_ip, response } = body as LogsRequest
      const { username } = consumer
      const responseLog = await this.logsService.addLog({ consumer: username, request, client_ip, response })

      if (!responseLog) {
        this.loggerService.error('Failed to log data', { body })
        return res.status(500).json({
          error: 'Failed to log data',
          message: 'An error occurred while saving the log data'
        })
      } 

      return res.status(200).json({ message: 'Log received', data: body })
    } catch (error) {
      this.loggerService.error('Error occurred during logging', { error })
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred during logging'
      })
    }
  }
}