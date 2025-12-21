import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WordModule } from '../word/word.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [ConfigModule, WordModule, CacheModule.register()],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
