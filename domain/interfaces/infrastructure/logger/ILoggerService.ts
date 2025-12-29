export interface ILoggerService {
  log(message: string, level?: 'info' | 'warn' | 'error', data?: any): void;
  error(message: string, error?: Error | any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
}
