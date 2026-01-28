import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { type Response } from 'express';
import { Types } from 'mongoose';
import { UserDocument } from './users/models/user.schema';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: { login: jest.Mock };
  const mockUser: UserDocument = {
    _id: new Types.ObjectId(),
    email: 'user@example.com',
    password: 'hashed-password',
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('login -> calls AuthService.login with user and response', () => {
    const response = { send: jest.fn() } as unknown as Response;

    authController.login(mockUser, response);

    expect(authService.login).toHaveBeenCalledWith(mockUser, response);
  });

  it('login -> sends the user in response', () => {
    const response = { send: jest.fn() } as unknown as Response;

    authController.login(mockUser, response);

    expect(response.send).toHaveBeenCalledWith(mockUser);
  });

  it('login -> propagates service errors', () => {
    const response = { send: jest.fn() } as unknown as Response;
    const error = new Error('login failed');

    authService.login.mockImplementation(() => {
      throw error;
    });

    expect(() => authController.login(mockUser, response)).toThrow(error);
  });

  it('authenticate -> returns the user from payload', () => {
    const result = authController.authenticate({ user: mockUser });

    expect(result).toBe(mockUser);
  });
});
