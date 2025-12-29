export interface UserData {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
  businessId?: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password?: string;
}

export interface IUserService {
  createUser(userData: CreateUserRequest): Promise<UserData | null>;
  getUserById(id: string): Promise<UserData | null>;
  getUserByEmail(email: string): Promise<UserData | null>;
  getAllUsers(): Promise<UserData[]>;
  updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<UserData | null>;
  deleteUser(id: string): Promise<boolean>;
  verifyPassword(userId: string, password: string): Promise<boolean>;
}
