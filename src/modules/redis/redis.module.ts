import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(
              `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`
            )
          ]
        };
      },
      inject: [ConfigService]
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class RedisModule {}
