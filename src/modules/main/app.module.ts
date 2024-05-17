import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import 'reflect-metadata';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/passport/jwt.guard';
import { CommonModule } from '@modules/common/common.module';

// TypeORM Entities
import { User } from '@modules/user/user.entity';

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
        DB_USERNAME: Joi.string().alphanum().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().alphanum().required(),
        DB_SYNC: Joi.boolean().default(false),
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
          entities: [User],
          synchronize: configService.get('DB_SYNC'),
          keepConnectionAlive: true,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    CommonModule,
    AuthModule,
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
