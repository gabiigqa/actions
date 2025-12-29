import { CreateUserRequest, IUserService, UserData } from '@/domain/interfaces/domain/services/IUserService';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IUserRepository } from '@/domain/interfaces/infrastructure/repositories/IUserRepository';
import { AppConfig } from '@/infrastructure/config/AppConfig';
import { TYPES } from '@/infrastructure/config/inversify/types';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ILoggerService) private logger: ILoggerService,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AppConfig) protected appConfig: AppConfig
  ) { }

  async createUser(userData: CreateUserRequest): Promise<UserData | null> {
    this.logger.info(`Creating user with email: ${userData.email}`);
    try {
      if (userData.password) {
        userData.password = await this.hashPassword(userData.password);
      }
      const user = await this.userRepository.createUser(userData);
      if (!user) {
        throw new Error('User creation failed');
      }
      this.logger.info(`User created successfully with ID: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${error}`);
      return null;
    }
  }

  async getUserById(id: string): Promise<UserData | null> {
    this.logger.info(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    this.logger.info(`Fetching user with email: ${email}`);
    const user = await this.userRepository.getUserByUsername(email);
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
    }
    return user;
  }

  async getAllUsers(): Promise<UserData[]> {
    this.logger.info('Fetching all users');
    return this.userRepository.getAllUsers();
  }

  async updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<UserData | null> {
    this.logger.info(`Updating user with ID: ${id}`);
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    const updatedUser = await this.userRepository.updateUser(id, userData);
    if (!updatedUser) {
      this.logger.warn(`Cannot update user with ID ${id}: not found`);
    } else {
      this.logger.info(`User with ID ${id} updated successfully`);
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    this.logger.info(`Deleting user with ID: ${id}`);
    const deleted = await this.userRepository.deleteUser(id);
    if (deleted) {
      this.logger.info(`User with ID ${id} deleted successfully`);
    } else {
      this.logger.warn(`Cannot delete user with ID ${id}: not found`);
    }
    return deleted;
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    this.logger.info(`Verifying password for user ID: ${userId}`);
    const user = await this.userRepository.getUserById(userId);
    if (!user || !user.password) {
      this.logger.warn(`Cannot verify password for user ID ${userId}: user not found or no password set`);
      return false;
    }
    const isValid = bcrypt.compareSync(password, user.password);
    this.logger.info(`Password verification for user ID ${userId}: ${isValid ? 'success' : 'failed'}`);
    return isValid;
  }

  private hashPassword(password: string): string {
    const saltRounds = this.appConfig.getSaltRounds();
    return bcrypt.hashSync(password, saltRounds);
  }
}
