import { UserService } from '@/domain/services/UserService';
import { CreateUserRequest, UserData } from '@/domain/interfaces/domain/services/IUserService';
import { AppConfig } from '@/infrastructure/config';
import { ILoggerService } from '@/domain/interfaces/infrastructure/logger/ILoggerService';
import { IUserRepository } from '@/domain/interfaces/infrastructure/repositories/IUserRepository';

const MOCK_DATA = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date(),
  },
  user2: {
    id: 'user-456',
    email: 'test2@example.com',
    name: 'Test User 2',
    password: 'hashedPassword2',
    createdAt: new Date(),
  },
};

describe('UserService', () => {
  let service: UserService;
  let logger: Partial<jest.Mocked<ILoggerService>>;
  let userRepository: Partial<jest.Mocked<IUserRepository>>;
  let appConfig: Partial<jest.Mocked<AppConfig>>;

  // 2. Setup Unico de Mocks
  beforeEach(() => {
    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
    };

    userRepository = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      getUserByUsername: jest.fn(),
      getAllUsers: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    }
    appConfig = {
      getSaltRounds: jest.fn().mockReturnValue(10),
    }

    service = new UserService(
      logger as ILoggerService,
      userRepository as IUserRepository,
      appConfig as unknown as AppConfig
    );
  });

  describe('createUser', () => {
    test('createUser hashea password y retorna el usuario', async () => {
      const input: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'plainPassword123',
      };
      const saved: UserData = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      userRepository.createUser!.mockResolvedValue(saved);

      const result = await service.createUser({ ...input });

      expect(userRepository.createUser).toHaveBeenCalledTimes(1);
      const calledWith = userRepository.createUser!.mock.calls[0][0];
      expect(calledWith.password).not.toBe('plainPassword123');
      expect(result).toEqual(saved);
    });

    test('createUser retorna null si el repo devuelve null', async () => {
      userRepository.createUser!.mockResolvedValue(null);

      const result = await service.createUser({
        email: 'fail@test.com',
        name: 'Fail User',
        password: 'pass',
      });

      expect(result).toBeNull();
    });

    test('getUserById retorna usuario cuando existe', async () => {
      const user: UserData = { id: 'u1', email: 'a@test.com', name: 'User A', createdAt: new Date() };
      userRepository.getUserById!.mockResolvedValue(user);

      const result = await service.getUserById('u1');

      expect(result).toEqual(user);
      expect(userRepository.getUserById).toHaveBeenCalledWith('u1');
    });

    test('getUserById retorna null si no existe', async () => {
      userRepository.getUserById!.mockResolvedValue(null);

      const result = await service.getUserById('missing');

      expect(result).toBeNull();
    });

    test('getAllUsers retorna lista de usuarios', async () => {
      const users: UserData[] = [
        { id: 'u1', email: 'a@test.com', name: 'User A', createdAt: new Date() },
        { id: 'u2', email: 'b@test.com', name: 'User B', createdAt: new Date() },
      ];
      userRepository.getAllUsers!.mockResolvedValue(users);

      const result = await service.getAllUsers();
      console.log(result);
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    test('updateUser re-hashea password si viene en los datos', async () => {
      const updated: UserData = { id: 'u1', email: 'a', name: 'A', password: 'newHash', createdAt: new Date() };
      userRepository.updateUser!.mockResolvedValue(updated);

      await service.updateUser('u1', { password: 'newPlainPassword' });

      const calledWith = userRepository.updateUser!.mock.calls[0][1];
      expect(calledWith.password).not.toBe('newPlainPassword');
    });

    test('updateUser retorna null si no existe el usuario', async () => {
      userRepository.updateUser!.mockResolvedValue(null);

      const result = await service.updateUser('missing', { email: 'test@test.com' });

      expect(result).toBeNull();
    });

    test('deleteUser retorna true cuando se elimina correctamente', async () => {
      userRepository.deleteUser!.mockResolvedValue(true);

      const result = await service.deleteUser('u1');

      expect(result).toBe(true);
    });

    test('deleteUser retorna false cuando no existe', async () => {
      userRepository.deleteUser!.mockResolvedValue(false);

      const result = await service.deleteUser('missing');

      expect(result).toBe(false);
    });

    test('verifyPassword retorna true con password correcta', async () => {
      const hash = (service as any).hashPassword('secretPassword');
      userRepository.getUserById!.mockResolvedValue({
        id: 'u1',
        email: 'test@example.com',
        name: 'Test',
        password: hash,
        createdAt: new Date(),
      });

      const result = await service.verifyPassword('u1', 'secretPassword');

      expect(result).toBe(true);
    });

    test('verifyPassword retorna false con password incorrecta', async () => {
      const hash = (service as any).hashPassword('correctPassword');
      userRepository.getUserById!.mockResolvedValue({
        id: 'u1',
        email: 'test@example.com',
        name: 'Test',
        password: hash,
        createdAt: new Date(),
      });

      const result = await service.verifyPassword('u1', 'wrongPassword');

      expect(result).toBe(false);
    });

    test('verifyPassword retorna false si no existe el usuario', async () => {
      userRepository.getUserById!.mockResolvedValue(null);

      const result = await service.verifyPassword('missing', 'anyPassword');

      expect(result).toBe(false);
    });

    test('hashPassword usa getSaltRounds del config', () => {
      (service as any).hashPassword('testPassword');

      expect(appConfig.getSaltRounds).toHaveBeenCalled();
    });
  });

})