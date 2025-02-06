import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseService from './database.service';
import { User } from './model/User';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        models: [User]
      }),
      inject: [ConfigService]
    })
  ],
  providers: [DatabaseService]
})
export class DatabaseModule {}
