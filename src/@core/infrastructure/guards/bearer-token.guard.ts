import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  JsonWebTokenPort,
  JsonWebTokenPortToken,
} from '@core/domain/ports/json-web-token.port';
import { REQUEST_TOKEN_KEY } from '../auth/auth.constants';

type RequestWithUser = ExpressRequest & {
  [REQUEST_TOKEN_KEY]?: any;
  user?: any;
};

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    @Inject(JsonWebTokenPortToken)
    private readonly jsonWebToken: JsonWebTokenPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Le jeton d'accès est manquant");
    }

    const response = await this.jsonWebToken.verify(token);

    if (!response) {
      throw new UnauthorizedException("Jeton d'accès invalide");
    }

    const userWithRoles = {
      ...response,
      roles: response.role ? [response.role] : undefined,
    };

    request[REQUEST_TOKEN_KEY] = userWithRoles;
    request.user = userWithRoles;

    return true;
  }

  private extractTokenFromHeader(request: ExpressRequest): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.split(' ');

    return scheme === 'Bearer' && token ? token : undefined;
  }
}
