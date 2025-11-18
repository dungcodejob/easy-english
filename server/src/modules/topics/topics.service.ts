import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Topic } from '@app/entities';
import { TopicResponseDto } from './dto';

/**
 * Service for managing vocabulary topics.
 * Handles business logic for topic retrieval and transformation.
 * 
 * @service TopicsService
 */
@Injectable()
export class TopicsService {
  private readonly logger = new Logger(TopicsService.name);

  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: EntityRepository<Topic>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Retrieves all published vocabulary topics.
   * Results are ordered by display order (ascending) and name (alphabetical).
   * Implements caching for 5 minutes to optimize performance.
   * 
   * @returns {Promise<TopicResponseDto[]>} Array of published topics
   * @throws {Error} Database connection or query errors
   * 
   * @example
   * ```typescript
   * const topics = await topicsService.findAllPublished();
   * console.log(topics.length); // e.g., 10
   * ```
   */
  async findAllPublished(): Promise<TopicResponseDto[]> {
    try {
      this.logger.log('Fetching all published topics');

      const topics = await this.topicsRepository.find(
        { isPublished: true },
        {
          orderBy: {
            displayOrder: 'ASC',
            name: 'ASC',
          },
          cache: 300000, // 5 minutes in milliseconds
        },
      );

      this.logger.log(`Found ${topics.length} published topics`);

      return topics.map((topic) => this.mapToDto(topic));
    } catch (error) {
      this.logger.error('Failed to fetch published topics', error);
      throw error;
    }
  }

  /**
   * Maps Topic entity to TopicResponseDto.
   * Converts database entity to API response format.
   * 
   * @private
   * @param {Topic} topic - Topic entity from database
   * @returns {TopicResponseDto} Formatted response DTO
   */
  private mapToDto(topic: Topic): TopicResponseDto {
    return {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      icon: topic.icon,
      description: topic.description,
      level: topic.level,
      wordCount: topic.wordCount,
      displayOrder: topic.displayOrder,
      colorTheme: topic.colorTheme,
      relatedSkills: topic.relatedSkills,
      recommendedFor: topic.recommendedFor,
      estimatedHours: topic.estimatedHours,
      previewWords: topic.previewWords,
      bannerImageUrl: topic.bannerImageUrl,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    };
  }
}

