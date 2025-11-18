import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from './app.config';
import { ThrottlerConfig } from './throttler.config';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: `./.env.${process.env.NODE_ENV || 'dev'}`,
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfig,
    }),
  ],
  providers: [],
  exports: [],
})
export class ConfigsModule {}
