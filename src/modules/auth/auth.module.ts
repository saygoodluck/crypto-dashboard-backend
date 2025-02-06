import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../database/model/User';
import { Admin } from '../database/model/Admin';
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user/user.service';

@Module({
  imports: [RedisModule, SequelizeModule.forFeature([User, Admin]), ConfigModule, HttpModule],
  providers: [AuthService, UserService],
  controllers: [AuthController]
})
export class AuthModule {}