import { Injectable } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
// import { RedisOptions } from 'ioredis';
// import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { AppConfig, InjectAppConfig } from './app.config';

@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(@InjectAppConfig() private readonly _appConfig: AppConfig) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    const { testing, throttlerLimit, throttlerTtl } = this._appConfig;

    const throttler = {
      ttl: throttlerTtl,
      limit: throttlerLimit,
    };

    if (testing) {
      return {
        throttlers: [
          {
            name: 'default',
            ...throttler,
          },
        ],
      };
    }

    return {
      throttlers: [
        {
          name: 'short',
          ...throttler,
        },
        {
          name: 'medium',
          ...throttler,
          ttl: throttler.ttl * 2,
        },
        {
          name: 'long',
          ...throttler,
          ttl: throttler.ttl * 5,
        },
      ],
    };

    // if (testing) {
    //   return throttler;
    // }

    // return {
    //   ...throttler,
    //   storage: new ThrottlerStorageRedisService(
    //     this.configService.get<RedisOptions>('redis'),
    //   ),
    // };
  }
}
