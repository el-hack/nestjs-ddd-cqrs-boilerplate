import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_TYPE_KEY, AuthType } from '../decorators/auth.decorator';
import { BearerTokenGuard } from './bearer-token.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.BearerToken;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly bearerTokenGuard: BearerTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.BearerToken]: this.bearerTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    let error = new UnauthorizedException();

    for (const instance of guards) {
      const result = instance.canActivate(context) as
        | boolean
        | Promise<boolean>;

      const canActivate = await (result instanceof Promise
        ? result.catch((err) => {
            error = err as HttpException;
            return false;
          })
        : Promise.resolve(result));

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
