import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import 'reflect-metadata';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/passport/jwt.guard';
import { CommonModule } from '@modules/common/common.module';
import { UserModule } from '@modules/user/user.module';
import { CaslModule } from '@modules/infrastructure/casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ACCESS_TOKEN_SECRET: Joi.string().min(16).required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().alphanum().default('900s'),
        DB_TYPE: Joi.string().valid('postgres', 'mysql').default('postgres'),
        DB_HOST: Joi.string().hostname().required(),
        DB_PORT: Joi.number().integer().min(1).max(65535).default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        REDIS_HOST: Joi.string().hostname().required(),
        REDIS_PORT: Joi.number().integer().min(1).max(65535).default(6379),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          synchronize: configService.get('DB_SYNC'),
          autoLoadEntities: true,
          keepConnectionAlive: true,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
      }),
      isGlobal: true,
    }),
    CommonModule,
    UserModule,
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Enables JWT authentication globally
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
