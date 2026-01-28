import { JwtStrategy } from './jwt.strategy';
import { type UsersService } from '../users/users.service';
import { type ConfigService } from '@nestjs/config';
import { type TokenPayload } from '../interfaces/token-payload.interface';

describe('JwtStrategy', () => {
  it('loads JWT secret from config', () => {
    const get = jest.fn().mockReturnValue('secret');
    const configService = { get } as unknown as ConfigService;
    const usersService = { getUser: jest.fn() } as unknown as UsersService;

    new JwtStrategy(configService, usersService);

    expect(get).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('returns user from UsersService.getUser', async () => {
    const get = jest.fn().mockReturnValue('secret');
    const configService = { get } as unknown as ConfigService;
    const getUser = jest.fn().mockResolvedValue({
      _id: 'user-1',
      email: 'user@example.com',
    });
    const usersService = { getUser } as unknown as UsersService;
    const strategy = new JwtStrategy(configService, usersService);
    const payload: TokenPayload = { userId: 'user-1' };

    const result = await strategy.validate(payload);

    expect(getUser).toHaveBeenCalledWith({ _id: 'user-1' });
    expect(result).toEqual({ _id: 'user-1', email: 'user@example.com' });
  });
});
