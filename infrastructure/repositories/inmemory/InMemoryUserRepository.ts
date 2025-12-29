import { CreateUserRequest, UserData } from '@/domain/interfaces/domain/services/IUserService';
import { IUserRepository } from '@/domain/interfaces/infrastructure/repositories/IUserRepository';
import { TYPES } from '@/infrastructure/config/inversify/types';
import { AppConfig } from '@infrastructure/config/AppConfig';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import uuid4 from 'uuid4';
import usersJson from '../../../data/users.json';

@injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, UserData> = new Map();
  private saltRounds: number = 10;
  constructor(
    @inject(TYPES.AppConfig) protected appConfig: AppConfig
  ) {
    // Preload with a default user (Raul Nota)
    this.saltRounds = this.appConfig.getSaltRounds();
    let usersDefault: UserData[] = [];

    usersJson.forEach(userJson => {
      const user: UserData = {
        id: userJson.id,
        email: userJson.email,
        name: userJson.name,
        password: bcrypt.hashSync(userJson.password, this.saltRounds),
        createdAt: new Date(userJson.createdAt)
      };

      usersDefault.push(user);
    });

    usersDefault.forEach(userDefault => {
      this.users.set(userDefault.id, userDefault);
    });
  }

  async createUser(userData: CreateUserRequest): Promise<UserData | null> {
    try {
      if (!userData.password) {
        throw new Error('Password is required');
      }

      const user: UserData = {
        id: uuid4(),
        email: userData.email,
        name: userData.name,
        password: bcrypt.hashSync(userData.password, this.saltRounds),
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<UserData | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(email: string): Promise<UserData | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getAllUsers(): Promise<UserData[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<UserData | null> {
    const existingUser = this.users.get(id);
    if (!existingUser) return null;
    const updatedUser: UserData = {
      ...existingUser,
      ...userData,
      password: userData.password ? bcrypt.hashSync(userData.password, this.saltRounds) : existingUser.password
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
