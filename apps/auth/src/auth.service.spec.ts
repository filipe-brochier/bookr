import { AuthService } from './auth.service';
import { type ConfigService } from '@nestjs/config';
import { type JwtService } from '@nestjs/jwt';
import { type Response } from 'express';
import { Types } from 'mongoose';

describe('AuthService', () => {
  const timestamp = '2026-01-01T00:00:00Z';
  const mockUser = {
    _id: new Types.ObjectId(),
    email: 'user@example.com',
    password: 'hashed-password',
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('signs token and sets auth cookie with expiration', () => {
    jest.useFakeTimers().setSystemTime(new Date(timestamp));

    const get = jest.fn().mockReturnValue(3600);
    const configService = { get } as unknown as ConfigService;
    const sign = jest.fn().mockReturnValue('jwt-token');
    const jwtService = { sign } as unknown as JwtService;

    const service = new AuthService(configService, jwtService);

    const cookie = jest.fn();
    const response = { cookie } as unknown as Response;

    service.login(mockUser, response);

    const expirationDate = new Date(timestamp);
    expirationDate.setSeconds(expirationDate.getSeconds() + 3600);

    expect(sign).toHaveBeenCalledWith({ userId: mockUser._id.toString() });
    expect(cookie).toHaveBeenCalledWith('Authentication', 'jwt-token', {
      httpOnly: true,
      expires: expirationDate,
    });
    expect(get).toHaveBeenCalledWith('JWT_EXPIRATION');
  });
});
