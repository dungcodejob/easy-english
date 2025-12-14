import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OxfordDictionaryService } from '../../shared/services/oxford-dictionary.service';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { SingleWordController, WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  imports: [ConfigModule, CacheModule.register()],
  controllers: [TopicController, WordController, SingleWordController],
  providers: [TopicService, WordService, OxfordDictionaryService],
  exports: [TopicService, WordService],
})
export class TopicModule {}
