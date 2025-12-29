import { CreateUserRequest, UserData } from '@/domain/interfaces/domain/services/IUserService';

export interface IUserRepository {
  createUser(userData: CreateUserRequest): Promise<UserData | null>;
  getUserById(id: string): Promise<UserData | null>;
  getUserByUsername(email: string): Promise<UserData | null>;
  getAllUsers(): Promise<UserData[]>;
  updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<UserData | null>;
  deleteUser(id: string): Promise<boolean>;
}
