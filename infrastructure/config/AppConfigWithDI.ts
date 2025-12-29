import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { TYPES } from '@infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';
import { AppConfig } from './AppConfig';

@injectable()
export class AppConfigWithDI extends AppConfig {

  constructor(
    @inject(TYPES.ILoggerService) logger: ILoggerService
  ) {
    super(logger);
  }
}
