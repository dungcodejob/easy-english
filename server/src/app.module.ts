import {
  appConfig,
  cookieConfig,
  databaseConfig,
  httpConfig,
  jwtConfig,
  ThrottlerConfig,
} from '@app/configs';
import { HttpExceptionFilter } from '@app/filters';
import { TransformInterceptor } from '@app/interceptors';
import { RequestMiddlewareModule } from '@app/middlewares';
import { UnitOfWorkModule } from '@app/repositories';
import {
  AlsThreadContext,
  AlsThreadContextModule,
  RequestModule,
} from '@app/request';
import { UserSessionStorage } from '@app/services/user-session';
import { UserSessionInMemoryStorage } from '@app/services/user-session.in-memory-storage';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth';

import { DictionaryInfrastructureModule } from '@app/infrastructure/dictionary';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { HealthModule } from './modules/health/health.module';
import { TopicSenseModule } from './modules/topic-sense/topic-sense.module';
import { TopicModule } from './modules/topic/topic.module';
import { UserModule } from './modules/user';
import { UserWordSenseModule } from './modules/user-word-sense/user-word-sense.module';
import { WordDetailModule } from './modules/word-detail/word-detail.module';
import { WordModule } from './modules/word/word.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';

@Module({
  imports: [
    AlsThreadContextModule,
    RequestMiddlewareModule,
    RequestModule,
    UnitOfWorkModule,
    AuthModule,
    UserModule,
    WordDetailModule,
    TopicModule,
    TopicSenseModule,
    WordModule,
    UserWordSenseModule,
    WorkspaceModule,
    DictionaryInfrastructureModule,
    DictionaryModule,

    HealthModule,
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, jwtConfig, httpConfig],
      envFilePath: `./.env.${process.env.NODE_ENV || 'dev'}`,
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfig,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: UserSessionStorage,
      useClass: UserSessionInMemoryStorage,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly alsThreadContext: AlsThreadContext) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .apply((_req, _res, next) => this.alsThreadContext.run(next))
      .forRoutes('{*splat}');
  }
}
