import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OxfordDictionaryService } from '../../shared/services/oxford-dictionary.service';
import { LookupModule } from '../lookup/lookup.module';
import { SingleWordController, WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  imports: [ConfigModule, CacheModule.register(), LookupModule],
  controllers: [WordController, SingleWordController],
  providers: [WordService, OxfordDictionaryService],
  exports: [WordService],
})
export class WordModule {}
