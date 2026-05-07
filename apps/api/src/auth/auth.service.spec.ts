// apps/api/src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { db, users } from '@obc-app/database';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

jest.mock('@obc-app/database', () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    }),
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 1, email: 'test@test.com', role: 'parent' }]),
      }),
    }),
  },
  users: {},
  eq: jest.fn(),
}));
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto: RegisterDto = { email: 'test@test.com', password: '123456', role: 'parent' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.register(dto);
      expect(result).toHaveProperty('token', 'jwt-token');
      expect(result.user).toHaveProperty('email', dto.email);
      expect(db.insert).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto: RegisterDto = { email: 'exists@test.com', password: '123456', role: 'parent' };
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ id: 1 }]),
        }),
      });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const dto = { email: 'test@test.com', password: '123456' };
      const user = { id: 1, email: dto.email, passwordHash: 'hashed', role: 'parent' };
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([user]),
        }),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(dto);
      expect(result).toHaveProperty('token', 'jwt-token');
      expect(result.user).toHaveProperty('email', dto.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const dto = { email: 'notfound@test.com', password: '123456' };
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const dto = { email: 'test@test.com', password: 'wrong' };
      const user = { id: 1, email: dto.email, passwordHash: 'hashed', role: 'parent' };
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([user]),
        }),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});