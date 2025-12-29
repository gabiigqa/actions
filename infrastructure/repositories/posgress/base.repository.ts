import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { inject } from "inversify";

export class BaseRepository {
    constructor(
        @inject(TYPES.ILoggerService) protected loggerService: ILoggerService,
        @inject(TYPES.AppConfig) protected appConfig: AppConfig,
        @inject(TYPES.IPostgreSQLConnection) protected postgreSQLConnection: IPostgreSQLConnection
    ) {
        this.postgreSQLConnection.initialize();
    }
}