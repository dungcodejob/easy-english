import { AuthModule } from '@app/auth';
import { appConfig, cookieConfig, databaseConfig } from '@app/configs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('process.env.DATABASE_PASSWORD', process.env.DATABASE_PASSWORD);
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig],
      envFilePath: `./.env.${process.env.NODE_ENV || 'dev'}`,
      isGlobal: true,
    }),

    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfig,
    }),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useClass: CacheConfig,
    // }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
