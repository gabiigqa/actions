import { IAuthService } from '@/domain/interfaces/domain/services/IAuthService';
import { IUserService } from '@/domain/interfaces/domain/services/IUserService';
import { AppConfig } from '@infrastructure/config/AppConfig';
import { TYPES } from '@infrastructure/config/inversify/types';
import { inject, injectable } from 'inversify';
import { JsonWebTokenError, sign, SignOptions, TokenExpiredError, verify } from 'jsonwebtoken';
import { JwtPayload } from "../interfaces/domain/entities/JwtPayload";
import { TokenValidationResult } from "../interfaces/domain/entities/TokenValidationResult";
import { LoginRequest } from "../interfaces/infrastructure/controllers/requests/LoginRequest";
import { LoginResponse } from "../interfaces/infrastructure/controllers/responses/LoginResponse";
import { RefreshTokenResponse } from "../interfaces/infrastructure/controllers/responses/RefreshTokenResponse";
import { UserProfileResponse } from "../interfaces/infrastructure/controllers/responses/UserProfileResponse";

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.IUserService) private userService: IUserService,
        @inject(TYPES.AppConfig) protected appConfig: AppConfig
    ) { }

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            // Find user by email
            const user = await this.userService.getUserByEmail(credentials.email);
            if (!user) {
                return {
                    success: false,
                    message: 'Invalid email or password'
                };
            }

            // Verify password
            const isPasswordValid = await this.userService.verifyPassword(user.id, credentials.password);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Invalid email or password'
                };
            }

            // Generate token
            const token = await this.generateToken(user.id, user.email, user.name, user.businessId ?? '');

            return {
                success: true,
                token,
                message: 'Login successful'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Authentication failed'
            };
        }
    }

    async validateToken(token: string): Promise<TokenValidationResult> {
        try {
            const secret = this.appConfig.getJwtSecret();
            const decoded = verify(token, secret) as JwtPayload;

            return {
                valid: true,
                payload: decoded
            };
        } catch (error) {
            let errorMessage = 'Invalid token';

            if (error instanceof TokenExpiredError) {
                errorMessage = 'Token has expired';
            } else if (error instanceof JsonWebTokenError) {
                errorMessage = 'Malformed token';
            }

            return {
                valid: false,
                error: errorMessage
            };
        }
    }

    async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        try {
            // Validate the refresh token
            const validationResult = await this.validateToken(refreshToken);

            if (!validationResult.valid || !validationResult.payload) {
                throw new Error('Invalid or expired refresh token');
            }

            // Generate new token with same payload
            const token = await this.generateToken(
                validationResult.payload.userId,
                validationResult.payload.email,
                validationResult.payload.name,
                validationResult.payload.businessId
            );

            // Get expiration time in seconds (default 1 hour)
            const expiresIn = 3600;

            return {
                token,
                expiresIn
            };
        } catch (error) {
            throw new Error('Failed to refresh token');
        }
    }

    async getUserProfile(userId: string): Promise<UserProfileResponse> {
        try {
            const user = await this.userService.getUserById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            return {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: 'partner', // Default role
                status: 'active', // Default status
                createdAt: user.createdAt.toISOString()
            };
        } catch (error) {
            throw new Error('Failed to get user profile');
        }
    }

    async logout(userId: string): Promise<void> {
        // JWT tokens are stateless, so logout is handled client-side
        // This method is here for future implementation (e.g., token blacklisting)
        return Promise.resolve();
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        try {
            // Verify current password
            const isPasswordValid = await this.userService.verifyPassword(userId, currentPassword);

            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }

            // Update password
            await this.userService.updateUser(userId, { password: newPassword });
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to change password');
        }
    }

    private async generateToken(userId: string, email: string, name: string, businessId: string): Promise<string> {
        try {
            const secret = this.appConfig.getJwtSecret();

            const payload: JwtPayload = {
                userId,
                email,
                name,
                businessId
            };

            const options: SignOptions = {
                expiresIn: this.appConfig.getJwtExpiresIn()
            };

            return sign(payload, secret, options);
        } catch (error) {
            throw new Error('Failed to generate token');
        }
    }
}
