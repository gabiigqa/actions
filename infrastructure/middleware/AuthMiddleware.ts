import { IAuthService } from '@domain/interfaces/domain/services/IAuthService';
import { container } from '@infrastructure/config/inversify/container';
import { TYPES } from '@infrastructure/config/inversify/types';
import { NextFunction, Request, Response } from 'express';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authService = container.get<IAuthService>(TYPES.IAuthService);

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication Required'
      });
    }

    const token = authHeader.split(' ')[1];

    const validationResult = await authService.validateToken(token);

    if (!validationResult.valid) {
      res.status(401).json({
        error: 'Invalid Token',
        message: validationResult.error || 'The provided token is invalid or expired'
      });
      return;
    }

    // Set user info from JWT payload
    if (validationResult.payload) {
      req.session = {
        id: validationResult.payload.userId,
        email: validationResult.payload.email,
        name: validationResult.payload.name,
        businessId: validationResult.payload.businessId
      };
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication error occurred'
    });
  }
};
