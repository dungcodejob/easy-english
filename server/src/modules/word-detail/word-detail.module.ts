import { Module } from '@nestjs/common';
import { WordDetailController } from './word-detail.controller';
import { WordDetailService } from './word-detail.service';

@Module({
  controllers: [WordDetailController],
  providers: [WordDetailService],
})
export class WordDetailModule {}
