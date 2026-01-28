import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JsonWebTokenPortToken } from '@core/domain/ports/json-web-token.port';
import { JsonWebTokenService } from './infrastructure/auth/json-web-token.service';

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
    {
      provide: JsonWebTokenPortToken,
      useClass: JsonWebTokenService,
    },
  ],
  exports: [CqrsModule, JwtModule, JsonWebTokenPortToken, JsonWebTokenService],
})
export class CoreModule {}
