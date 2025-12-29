import { AuthService } from '../services/AuthService';
import { IUserService, UserData } from '@/domain/interfaces/domain/services/IUserService';
import { AppConfig } from '@infrastructure/config/AppConfig';
import { sign } from 'jsonwebtoken';

// 1. Centralización de Datos de Mock (Inputs/Outputs)
const MOCK_DATA = {
    user: {
        valid: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            password: 'hashedPassword',
            createdAt: new Date(),
            businessId: 'business-456',
        } as UserData,
        noBusiness: {
            id: 'user-001',
            email: 'user1@test.com',
            name: 'User 1',
            createdAt: new Date(),
        } as UserData,
    },
    credentials: {
        valid: { email: 'test@example.com', password: 'correctPassword' },
        wrong: { email: 'test@example.com', password: 'wrongPassword' },
        notExists: { email: 'noexiste@example.com', password: 'any' },
    },
    config: {
        secret: 'test-secret-key',
        expiresIn: 3600,
    }
};

describe('AuthService', () => {
    let service: AuthService;
    let userService: jest.Mocked<Partial<IUserService>>;
    let appConfig: jest.Mocked<Partial<AppConfig>>;

    // 2. Setup Único de Mocks
    beforeEach(() => {
        userService = {
            getUserByEmail: jest.fn(),
            verifyPassword: jest.fn(),
        };

        appConfig = {
            getJwtSecret: jest.fn().mockReturnValue( MOCK_DATA.config.secret),
            getJwtExpiresIn: jest.fn().mockReturnValue(MOCK_DATA.config.expiresIn),
        };

        service = new AuthService(
            userService as IUserService,
            appConfig as AppConfig
        );
    });

    describe('login', () => {
        test('éxito con credenciales válidas', async () => {
            // Cada test define únicamente lo que necesita
            userService.getUserByEmail = jest.fn(async () => MOCK_DATA.user.valid);
            userService.verifyPassword = jest.fn(async () => true);

            const result = await service.login(MOCK_DATA.credentials.valid);

            expect(result.success).toBe(true);
            expect(result.token).toBeDefined();
            expect(userService.getUserByEmail).toHaveBeenCalledWith(MOCK_DATA.credentials.valid.email);
            expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
            expect(userService.verifyPassword).toHaveBeenCalledWith(MOCK_DATA.user.valid.id, MOCK_DATA.credentials.valid.password);

        });

        test('error cuando el email no existe', async () => {

            const result = await service.login(MOCK_DATA.credentials.notExists);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid email or password');
            expect(userService.verifyPassword).not.toHaveBeenCalled();
        });

        test('error cuando la password es incorrecta', async () => {
            userService.getUserByEmail = jest.fn(async () => MOCK_DATA.user.valid);
            userService.verifyPassword = jest.fn(async () => false);

            const result = await service.login(MOCK_DATA.credentials.wrong);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid email or password');
        });
    });

    describe('validateToken', () => {
        test('éxito con token correcto', async () => {
            const payload = {
                userId: MOCK_DATA.user.valid.id,
                email: MOCK_DATA.user.valid.email,
                businessId: MOCK_DATA.user.valid.businessId
            };
            const token = sign(payload, MOCK_DATA.config.secret);

            const result = await service.validateToken(token);

            expect(result.valid).toBe(true);
            expect(result.payload?.userId).toBe(payload.userId);
        });

        test('error con token expirado', async () => {
            const token = sign({ id: '1' }, MOCK_DATA.config.secret, { expiresIn: '-1s' });

            const result = await service.validateToken(token);

            expect(result.valid).toBe(false);
            expect(result.error).toBe('Token has expired');
        });
    });
});