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
import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  it('registers passport local strategy', () => {
    expect(AuthGuard).toHaveBeenCalledWith('local');
  });

  it('exposes canActivate from AuthGuard', () => {
    const guard = new LocalAuthGuard();
    const typedGuard = guard as Guard;

    expect(typeof typedGuard.canActivate).toBe('function');
  });
});
