import {
  ExampleEntity,
  PronunciationEntity,
  WordEntity,
  WordSenseEntity,
} from '@app/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AzVocabController } from './azvocab.controller';
import { AzVocabService } from './azvocab.service';

@Module({
  imports: [
    HttpModule,
    MikroOrmModule.forFeature([
      WordEntity,
      WordSenseEntity,
      PronunciationEntity,
      ExampleEntity,
    ]),
  ],
  controllers: [AzVocabController],
  providers: [AzVocabService],
  exports: [AzVocabService],
})
export class AzVocabModule {}
