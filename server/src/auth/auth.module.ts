import { AccountModule } from '@app/account';
import { ConfigsModule, jwtConfig } from '@app/configs';
import { TenantModule } from '@app/tenant';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BacklistService, BcryptService, JwtTokenService } from './services';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule,
    AccountModule,
    TenantModule,
    ConfigsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, BacklistService, BcryptService],
  exports: [AuthService],
})
export class AuthModule {}
