import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../database/model/User';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SequelizeModule.forFeature([User]), ConfigModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
