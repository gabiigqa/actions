import { IAuthService } from '@/domain/interfaces/domain/services/IAuthService';
import { LoginRequest } from "@/domain/interfaces/infrastructure/controllers/requests/LoginRequest";
import { RefreshTokenRequest } from "@/domain/interfaces/infrastructure/controllers/requests/RefreshTokenRequest";
import { ChangePasswordRequest } from "@/domain/interfaces/infrastructure/controllers/requests/ChangePasswordRequest";
import validateRequest from '@/infrastructure/middleware/ValidateRequestMiddleware';
import { requireAuth } from '@/infrastructure/middleware/AuthMiddleware';
import { BvnkServiceConnector } from '@/infrastructure/third-party/bvnk/bvnk.services.connector';
import { LoginRequestValidations } from '@/infrastructure/validators/auth/loginRequestValidation';
import { RefreshTokenRequestValidations } from '@/infrastructure/validators/auth/refreshTokenRequestValidation';
import { ChangePasswordRequestValidations } from '@/infrastructure/validators/auth/changePasswordRequestValidation';
import { TYPES } from '@infrastructure/config/inversify/types';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpGet } from 'inversify-express-utils';

@controller('/api/auth')
export class AuthController {
    constructor(
        @inject(TYPES.IAuthService) private authService: IAuthService,
        @inject(TYPES.BvnkServiceConnector) private bvnkService: BvnkServiceConnector
    ) { }

    @httpPost('/login', validateRequest(LoginRequestValidations))
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body as LoginRequest;

            const loginResponse = await this.authService.login({ email, password });

            if (loginResponse.success) {
                res.status(200).json(loginResponse);
            } else {
                res.status(401).json({
                    error: 'Authentication Failed',
                    message: loginResponse.message
                });
            }
        } catch (error) {
            res.status(500).json({
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error occurred during login'
            });
        }
    }

    @httpPost('/refresh', validateRequest(RefreshTokenRequestValidations))
    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body as RefreshTokenRequest;

            const refreshResponse = await this.authService.refreshToken(refreshToken);

            res.status(200).json(refreshResponse);
        } catch (error) {
            res.status(401).json({
                error: 'No Autorizado',
                message: error instanceof Error ? error.message : 'Refresh token inválido o expirado',
                statusCode: 401
            });
        }
    }

    @httpGet('/me', requireAuth)
    async getCurrentUser(req: Request, res: Response): Promise<void> {
        try {
            // Get user ID from session (set by requireAuth middleware)
            const userId = req.session?.id;

            if (!userId) {
                res.status(401).json({
                    error: 'No Autorizado',
                    message: 'Usuario no autenticado',
                    statusCode: 401
                });
                return;
            }

            const userProfile = await this.authService.getUserProfile(userId);

            res.status(200).json(userProfile);
        } catch (error) {
            res.status(500).json({
                error: 'Error Interno del Servidor',
                message: error instanceof Error ? error.message : 'Error al obtener perfil de usuario',
                statusCode: 500
            });
        }
    }

    @httpPost('/logout', requireAuth)
    async logout(req: Request, res: Response): Promise<void> {
        try {
            // Get user ID from session
            const userId = req.session?.id;

            if (userId) {
                await this.authService.logout(userId);
            }

            res.status(200).json({
                message: 'Sesión cerrada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error Interno del Servidor',
                message: error instanceof Error ? error.message : 'Error al cerrar sesión',
                statusCode: 500
            });
        }
    }

    @httpPost('/change-password', requireAuth, validateRequest(ChangePasswordRequestValidations))
    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            // Get user ID from session
            const userId = req.session?.id;

            if (!userId) {
                res.status(401).json({
                    error: 'No Autorizado',
                    message: 'Usuario no autenticado',
                    statusCode: 401
                });
                return;
            }

            const { currentPassword, newPassword } = req.body as ChangePasswordRequest;

            await this.authService.changePassword(userId, currentPassword, newPassword);

            res.status(200).json({
                message: 'Contraseña actualizada exitosamente'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message.includes('incorrect') ? 400 : 500;

            res.status(statusCode).json({
                error: statusCode === 400 ? 'Solicitud Incorrecta' : 'Error Interno del Servidor',
                message: error instanceof Error ? error.message : 'Error al cambiar contraseña',
                statusCode
            });
        }
    }
}
