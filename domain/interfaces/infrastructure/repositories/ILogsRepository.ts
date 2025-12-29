import { LogsData } from '../../domain/services/ILogsService'

export interface ILogsRepository {
  addLog(logData: LogsData): Promise<boolean>
}