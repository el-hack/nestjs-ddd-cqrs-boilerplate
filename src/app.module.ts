import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { WinstonModule } from 'nest-winston';
import * as redisStore from 'cache-manager-redis-store';
import { CoreModule } from './@core/core.module';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { typeOrmConfig } from './config/typeorm.config';
import { winstonConfig } from './config/winston.config';
import { throttlerConfig } from './config/throttler.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync(typeOrmConfig),

    // Cache
    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      ttl: 300, // 5 minutes default
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync(throttlerConfig),

    // Event system
    EventEmitterModule.forRoot(),

    // Health checks
    TerminusModule,

    // Logging
    WinstonModule.forRootAsync(winstonConfig),

    // Core modules
    CoreModule,
    
    // Business modules
    UserModule,
    HealthModule,
  ],
})
export class AppModule {}
