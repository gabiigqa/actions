import { AppConfig } from '@infrastructure/config/AppConfig';
import { TYPES } from '@infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';
import { SwaggerConfig } from './swagger';

/**
 * Swagger configuration with dependency injection support
 * This version includes AppConfig injection for use within the DI container
 */
@injectable()
export class SwaggerConfigWithDI extends SwaggerConfig {

  constructor(
    @inject(TYPES.AppConfig) appConfig: AppConfig
  ) {
    super(appConfig);
  }
}
