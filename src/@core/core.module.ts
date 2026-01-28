import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JsonWebTokenPortToken } from '@core/domain/ports/json-web-token.port';
import { JsonWebTokenService } from './infrastructure/auth/json-web-token.service';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { BearerTokenGuard } from './infrastructure/guards/bearer-token.guard';

@Global()
@Module({
  imports: [
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '24h',
          audience: config.get<string>('JWT_TOKEN_AUDIENCE') || undefined,
          issuer: config.get<string>('JWT_TOKEN_ISSUER') || undefined,
        },
      }),
    }),
  ],
  providers: [
    JsonWebTokenService,
    BearerTokenGuard,
    AuthGuard,
    {
      provide: JsonWebTokenPortToken,
      useClass: JsonWebTokenService,
    },
  ],
  exports: [
    CqrsModule,
    JwtModule,
    JsonWebTokenPortToken,
    JsonWebTokenService,
    BearerTokenGuard,
    AuthGuard,
  ],
})
export class CoreModule {}
