import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { TopicEntity, TopicSenseEntity, WordSenseEntity } from '@app/entities';
import { TopicSenseController } from './topic-sense.controller';
import { TopicSenseService } from './topic-sense.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TopicSenseEntity, TopicEntity, WordSenseEntity]),
  ],
  controllers: [TopicSenseController],
  providers: [TopicSenseService],
  exports: [TopicSenseService],
})
export class TopicSenseModule {}
