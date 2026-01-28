import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { type UsersService } from '../users/users.service';

describe('LocalStrategy', () => {
  it('returns user when credentials are valid', async () => {
    const validateUser = jest.fn().mockResolvedValue({
      _id: 'user-1',
      email: 'user@example.com',
    });
    const usersService = { validateUser } as unknown as UsersService;
    const strategy = new LocalStrategy(usersService);

    await expect(
      strategy.validate('user@example.com', 'password'),
    ).resolves.toEqual({ _id: 'user-1', email: 'user@example.com' });

    expect(validateUser).toHaveBeenCalledWith('user@example.com', 'password');
  });

  it('throws UnauthorizedException when service throws', async () => {
    const validateUser = jest.fn().mockImplementation(() => {
      throw new Error('invalid credentials');
    });
    const usersService = { validateUser } as unknown as UsersService;
    const strategy = new LocalStrategy(usersService);

    await expect(
      strategy.validate('user@example.com', 'bad-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
