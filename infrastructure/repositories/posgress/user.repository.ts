import { CreateUserRequest, UserData } from "@/domain/interfaces/domain/services/IUserService";
import { ILoggerService } from "@/domain/interfaces/infrastructure/logger/ILoggerService";
import { IPostgreSQLConnection } from "@/domain/interfaces/infrastructure/repositories/IPostgreSQLConnection";
import { IUserRepository } from "@/domain/interfaces/infrastructure/repositories/IUserRepository";
import { AppConfig } from "@/infrastructure/config";
import { TYPES } from "@/infrastructure/config/inversify";
import { BaseRepository } from "@/infrastructure/repositories/posgress/base.repository";
import { id, inject, injectable } from "inversify";

@injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
    constructor(
        @inject(TYPES.IPostgreSQLConnection)  postgreSQLConnection: IPostgreSQLConnection,
        @inject(TYPES.AppConfig) appConfig: AppConfig,
        @inject(TYPES.ILoggerService) loggerService: ILoggerService
    ) {
        super(loggerService, appConfig, postgreSQLConnection);
    }

    createUser(userData: CreateUserRequest): Promise<UserData | null> {
        throw new Error("Method not implemented.");
    }

    async getUserById(id: string): Promise<UserData | null> {
        try {
            this.loggerService.info(`Getting user by ID: ${id}`);

            const query = `
                SELECT u.id, business_id, username, password_hash, u.status, b.name as business_name
                FROM integration.users u
                inner join integration.business b on b.id = u.business_id
                where b.status = 'E' and u.status = 'E' and u.id = $1
            `;

            const result = await this.postgreSQLConnection.query(query, [id]);

            if (result.rows.length === 0) {
                this.loggerService.info(`User not found for ID: ${id}`);
                return null;
            }

            const row = result.rows[0];

            // Map database fields to UserData interface
            // Note: Using username as email and name since DB schema doesn't have separate email/name fields
            const userData: UserData = {
                id: row.id,
                email: row.username, // Using username as email since DB doesn't have separate email field
                name: row.business_name,
                password: row.password_hash,
                createdAt: new Date(row.created_at),
                businessId: row.business_id
            };

            this.loggerService.info(`User found: ${userData.name} (ID: ${userData.id})`);
            return userData;
        } catch (error) {
            this.loggerService.error('Error getting user by ID:', {
                id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getUserByUsername(email: string): Promise<UserData | null> {
        try {
            this.loggerService.info(`Getting user by email: ${email}`);

            const query = `
                SELECT u.id, business_id, username, password_hash, u.status, b.name as business_name
                FROM integration.users u
                inner join integration.business b on b.id = u.business_id
                where b.status = 'E' and u.status = 'E' and u.username = $1
            `;

            const result = await this.postgreSQLConnection.query(query, [email]);

            if (result.rows.length === 0) {
                this.loggerService.info(`User not found for email: ${email}`);
                return null;
            }

            const row = result.rows[0];

            const userData: UserData = {
                id: row.id,
                email: row.username, // Using username as email since DB doesn't have separate email field
                name: row.business_name,
                password: row.password_hash,
                createdAt: new Date(row.created_at),
                businessId: row.business_id
            };

            this.loggerService.info(`User found: ${userData.name} (ID: ${userData.id})`);
            return userData;
        } catch (error) {
            this.loggerService.error('Error getting user by ID:', {
                id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Failed to get user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getAllUsers(): Promise<UserData[]> {
        throw new Error("Method not implemented.");
    }
    updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<UserData | null> {
        throw new Error("Method not implemented.");
    }
    async deleteUser(id: string): Promise<boolean> {
        try {
            this.loggerService.info(`Deleting user by ID: ${id}`);
            const query = `
                UPDATE integration.users
                SET status = 'D'
                WHERE id = $1 AND status = 'E'
            `;
            const result = await this.postgreSQLConnection.query(query, [id]);

            if (result.rowCount === 0) {
                this.loggerService.info(`User not found for ID: ${id}`);
                throw new Error('User not found or already deleted');
            }
            return true;
        } catch (error) {
            this.loggerService.error('Error deleting user by ID:', {
                id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            this.loggerService.info(`User not found for ID: ${id}`);
            return false;
        }
    }


}