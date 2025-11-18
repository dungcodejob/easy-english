import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Topic } from '@app/entities';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

/**
 * Module for vocabulary topics management.
 * Provides endpoints for browsing and managing vocabulary topics.
 * 
 * @module TopicsModule
 * @imports MikroOrmModule (Topic entity)
 * @controllers TopicsController
 * @providers TopicsService
 * @exports TopicsService (for use in other modules)
 */
@Module({
  imports: [MikroOrmModule.forFeature([Topic])],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService], // Export for use in other modules if needed
})
export class TopicsModule {}

