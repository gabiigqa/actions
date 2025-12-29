import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { injectable } from 'inversify';

@injectable()
export class ConsoleLoggerService implements ILoggerService {
  private formatDateToString = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  private formatTimeToString = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2 digits
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Ensure 2 digits
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0'); // Ensure 3 digits
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  private normalizeData = (data: any, maxLength: number = 100, depth: number = 0, maxDepth: number = 10): any => {
    // Prevent infinite recursion
    if (depth > maxDepth) {
      return '[MAX DEPTH REACHED]';
    }

    if (!data) return data;

    // Handle primitive types
    if (typeof data === 'string') {
      if (data.length > maxLength) {
        if (this.isBase64(data)) {
          return `[BASE64 DATA - ${data.length} chars]`;
        }
        return `${data.substring(0, maxLength)}... (truncated ${data.length} chars)`;
      }
      return data;
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
      return data;
    }

    if (data instanceof Date) {
      return data.toISOString();
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => this.normalizeData(item, maxLength, depth + 1, maxDepth));
    }

    // Handle objects
    if (typeof data === 'object' && data !== null) {
      // Handle special cases
      if (data instanceof Error) {
        return {
          name: data.name,
          message: data.message,
          stack: data.stack ? `${data.stack.substring(0, 500)}...` : undefined
        };
      }

      try {
        const normalized: any = {};
        for (const [key, value] of Object.entries(data)) {
          normalized[key] = this.normalizeData(value, maxLength, depth + 1, maxDepth);
        }
        return normalized;
      } catch (error) {
        // If we can't serialize the object, return a safe representation
        return `[OBJECT: ${data.constructor?.name || 'Unknown'} - Cannot serialize]`;
      }
    }

    return data;
  };

  private isBase64 = (str: string): boolean => {
    // Basic base64 pattern check
    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
    return str.length > 50 && str.length % 4 === 0 && base64Pattern.test(str);
  };

  log(message: string, level: 'info' | 'warn' | 'error' = 'info', data?: any): void {
    const now = new Date();
    const timestamp = `${this.formatDateToString(now)} ${this.formatTimeToString(now)}`;
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    const logFunction = this.getLogFunction(level);
    if (data !== undefined) {
      try {
        const normalizedData = this.normalizeData(data);
        const dataString = JSON.stringify(normalizedData, null, 2);
        logMessage += '\n' + dataString;
      } catch (error) {
        logMessage += '\n[ERROR SERIALIZING DATA]: ' + String(data);
      }
    }

    logFunction(logMessage);
  }

  private getLogFunction(level: 'info' | 'warn' | 'error'): (...args: any[]) => void {
    switch (level) {
      case 'info':
        return console.info.bind(console);
      case 'error':
        return console.error.bind(console);
      case 'warn':
        return console.warn.bind(console);
      default:
        return console.log.bind(console);
    }
  }

  error(message: string, error?: Error | any): void {
    if (error instanceof Error) {
      this.log(message, 'error', {
        stack: error.stack,
        message: error.message
      });
    } else if (error) {
      this.log(message, 'error', error);
    } else {
      this.log(message, 'error');
    }
  }

  info(message: string, data?: any): void {
    this.log(message, 'info', data);
  }

  warn(message: string, data?: any): void {
    this.log(message, 'warn', data);
  }
}
