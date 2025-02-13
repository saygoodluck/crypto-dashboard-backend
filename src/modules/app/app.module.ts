import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { DatabaseModule } from '../database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../database/model/User';
import { Admin } from '../database/model/Admin';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AccountTypeGuard } from '../auth/guards/account-type.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccountRightsGuard } from '../auth/guards/account-rights.guard';
import { RedisModule } from '../redis/redis.module';
import { LoggingInterceptor } from '../../utils/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required()
      }),
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    AuthModule,
    AdminModule,
    DatabaseModule,
    UserModule,
    RedisModule,
    SequelizeModule.forFeature([User, Admin])
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: AccountTypeGuard },
    { provide: APP_GUARD, useClass: AccountRightsGuard }
  ]
})
export class AppModule {}
