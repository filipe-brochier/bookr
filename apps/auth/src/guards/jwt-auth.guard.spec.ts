import { Guard } from '../interfaces/guard.interface';

jest.mock('@nestjs/passport', () => {
  const authGuardMock = jest.fn().mockImplementation((strategy?: string) => {
    return class MockAuthGuard {
      static strategy = strategy;
      canActivate = jest.fn().mockReturnValue(true);
    };
  });

  return { AuthGuard: authGuardMock };
});

import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('registers passport jwt strategy', () => {
    expect(AuthGuard).toHaveBeenCalledWith('jwt');
  });

  it('exposes canActivate from AuthGuard', () => {
    const guard = new JwtAuthGuard();
    const typedGuard = guard as Guard;

    expect(typeof typedGuard.canActivate).toBe('function');
  });
});
