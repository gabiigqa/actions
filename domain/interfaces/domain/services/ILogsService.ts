export interface LogsData {
  consumer: string
  request: JSON,
  client_ip: string,
  response: JSON
}

export interface ILogsService {
  addLog(logData: LogsData): Promise<boolean>
}