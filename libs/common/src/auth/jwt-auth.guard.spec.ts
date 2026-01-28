import { lastValueFrom, of, type Observable } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';
import { type ClientProxy } from '@nestjs/microservices';
import { type ExecutionContext } from '@nestjs/common';
import { type UserDto } from '../dto';

type AuthenticatedRequest = {
  cookies?: { Authentication?: string };
  user?: UserDto;
};

describe('JwtAuthGuard (common)', () => {
  const makeContext = (request: AuthenticatedRequest): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as ExecutionContext;

  it('returns false when no Authentication cookie is present', () => {
    const send = jest.fn();
    const authClient = { send } as unknown as ClientProxy;
    const guard = new JwtAuthGuard(authClient);
    const request: AuthenticatedRequest = { cookies: {} };

    const result = guard.canActivate(makeContext(request));

    expect(result).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });

  it('authenticates and attaches user to request', async () => {
    const user: UserDto = {
      _id: 'user-1',
      email: 'user@example.com',
    } as UserDto;
    const send = jest.fn().mockReturnValue(of(user));
    const authClient = { send } as unknown as ClientProxy;
    const guard = new JwtAuthGuard(authClient);
    const request: AuthenticatedRequest = {
      cookies: { Authentication: 'jwt-token' },
    };

    const result$ = guard.canActivate(
      makeContext(request),
    ) as Observable<boolean>;
    const result = await lastValueFrom(result$);

    expect(send).toHaveBeenCalledWith('authenticate', {
      Authentication: 'jwt-token',
    });
    expect(request.user).toBe(user);
    expect(result).toBe(true);
  });
});
