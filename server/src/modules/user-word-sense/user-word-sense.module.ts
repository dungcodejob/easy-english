import { Module } from '@nestjs/common';
import { LookupModule } from '../lookup/lookup.module';
import {
  TopicWordSenseController,
  UserWordSenseController,
} from './user-word-sense.controller';
import { UserWordSenseService } from './user-word-sense.service';

@Module({
  imports: [LookupModule],
  controllers: [UserWordSenseController, TopicWordSenseController],
  providers: [UserWordSenseService],
  exports: [UserWordSenseService],
})
export class UserWordSenseModule {}
