import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [AccountService, UserService],
  exports: [AccountService, UserService],
})
export class AccountModule {}
