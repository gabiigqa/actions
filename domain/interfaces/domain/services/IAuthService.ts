import { TokenValidationResult } from "@/domain/interfaces/domain/entities/TokenValidationResult";
import { LoginRequest } from "@/domain/interfaces/infrastructure/controllers/requests/LoginRequest";
import { LoginResponse } from "@/domain/interfaces/infrastructure/controllers/responses/LoginResponse";
import { RefreshTokenResponse } from "@/domain/interfaces/infrastructure/controllers/responses/RefreshTokenResponse";
import { UserProfileResponse } from "@/domain/interfaces/infrastructure/controllers/responses/UserProfileResponse";

export interface IAuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  validateToken(token: string): Promise<TokenValidationResult>;
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
  getUserProfile(userId: string): Promise<UserProfileResponse>;
  logout(userId: string): Promise<void>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
