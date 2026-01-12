import {
  appConfig,
  cookieConfig,
  databaseConfig,
  httpConfig,
  jwtConfig,
} from '@app/configs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventPublisherModule } from './core/infrastructure';
import { BackfillModule } from './modules/dictionary/infrastructure/backfill/backfill.module';

/**
 * CLI Module for running administrative commands
 * Uses nest-commander for CLI functionality
 */
@Module({
  imports: [
    EventPublisherModule,
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, jwtConfig, httpConfig],
      envFilePath: `./.env.${process.env.NODE_ENV || 'dev'}`,
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfig,
    }),
    BackfillModule,
  ],
})
export class CliModule {}
