import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidV4 } from 'uuid';
import {
  AuthenticateUser,
  ClientVerifyResponse,
  JsonWebTokenPayloadType,
  JsonWebTokenPort,
  JsonWebTokenType,
} from '@core/domain/ports/json-web-token.port';

@Injectable()
export class JsonWebTokenService implements JsonWebTokenPort {
  private readonly logger = new Logger(JsonWebTokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async generate(client: JsonWebTokenPayloadType): Promise<JsonWebTokenType> {
    if (!client.id) {
      throw new Error('client.id is required to generate tokens');
    }
    const refreshTokenId = uuidV4();

    const [accessToken, refreshToken] = await Promise.all([
      this.sign(client.id, 'token', {
        email: client.email,
        id: client.id,
        role: client.role,
        ownerId: client.ownerId,
      }),
      this.sign(client.id, 'refresh', {
        refreshTokenId,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async sign(
    subId: string,
    type: 'refresh' | 'token',
    payload?: AuthenticateUser | Record<string, unknown>,
  ): Promise<string> {
    try {
      const secret = this.config.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('JWT_SECRET is not set');
      }

      const expiresIn =
        type === 'token'
          ? this.config.get<string>('JWT_EXPIRES_IN') || '24h'
          : this.config.get<string>('JWT_REFRESH_TOKEN_TTL') || '7d';

      return this.jwtService.signAsync(
        { sub: subId, ...payload },
        {
          audience: this.config.get<string>('JWT_TOKEN_AUDIENCE') || undefined,
          issuer: this.config.get<string>('JWT_TOKEN_ISSUER') || undefined,
          secret,
          expiresIn,
        },
      );
    } catch (err) {
      this.logger.error(`signing token failed with message : ${err}`);
      throw err;
    }
  }

  async verify(token: string): Promise<ClientVerifyResponse> {
    try {
      const { sub, refreshTokenId, email, role, ownerId } =
        await this.jwtService.verifyAsync<
          AuthenticateUser & {
            refreshTokenId?: string;
          }
        >(token, {
          audience: this.config.get<string>('JWT_TOKEN_AUDIENCE') || undefined,
          issuer: this.config.get<string>('JWT_TOKEN_ISSUER') || undefined,
          secret: this.config.get<string>('JWT_SECRET'),
        });

      if (!sub) {
        throw new Error('Token subject (sub) is missing');
      }

      return {
        id: sub,
        email,
        tokenId: refreshTokenId,
        role,
        ownerId,
      };
    } catch (err) {
      this.logger.error(`verifying token failed with message : ${err}`);
      throw err;
    }
  }
}
