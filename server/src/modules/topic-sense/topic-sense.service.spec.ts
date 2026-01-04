import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';

import {
  LearningStatus,
  TopicEntity,
  TopicSenseEntity,
  WordSenseEntity,
} from '@app/entities';
import { TopicSenseRepository } from '@app/repositories';
import { ReviewTopicSenseDto } from './dto';
import { TopicSenseService } from './topic-sense.service';

describe('TopicSenseService', () => {
  let service: TopicSenseService;
  let topicSenseRepository: any;
  let em: any;

  beforeEach(async () => {
    const mockTopicSenseRepository = {
      findOne: jest.fn(),
    };

    const mockEntityManager = {
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    const mockTopicRepository = {
      findOne: jest.fn(),
    };

    const mockWordSenseRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicSenseService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: TopicSenseRepository,
          useValue: mockTopicSenseRepository,
        },
        {
          provide: getRepositoryToken(TopicEntity),
          useValue: mockTopicRepository,
        },
        {
          provide: getRepositoryToken(WordSenseEntity),
          useValue: mockWordSenseRepository,
        },
      ],
    }).compile();

    service = module.get<TopicSenseService>(TopicSenseService);
    topicSenseRepository =
      module.get<TopicSenseRepository>(TopicSenseRepository);
    em = module.get<EntityManager>(EntityManager);
  });

  describe('recordReview', () => {
    it('should correctly calculate SM-2 values for a new item with good quality', async () => {
      const topicSense = {
        id: '1',
        easeFactor: 2.5,
        interval: 0,
        reviewCount: 0,
        learningStatus: LearningStatus.New,
        nextReviewAt: null,
      } as unknown as TopicSenseEntity;

      topicSenseRepository.findOne.mockResolvedValue(topicSense);

      const dto: ReviewTopicSenseDto = { quality: 4 };
      const userId = 'user1';
      const topicId = 'topic1';
      const senseId = '1';

      const result = await service.recordReview(userId, topicId, senseId, dto);

      expect(result.interval).toBe(1);
      expect(result.reviewCount).toBe(1);
      expect(result.easeFactor).toBe(2.5); // q=4 results in same EF
      expect(result.learningStatus).toBe(LearningStatus.Learning);
      expect(em.flush).toHaveBeenCalled();
    });

    it('should correctly calculate SM-2 values for subsequent review', async () => {
      const topicSense = {
        id: '1',
        easeFactor: 2.6,
        interval: 1,
        reviewCount: 1,
        learningStatus: LearningStatus.Learning,
      } as unknown as TopicSenseEntity;

      topicSenseRepository.findOne.mockResolvedValue(topicSense);

      const dto: ReviewTopicSenseDto = { quality: 5 };
      const result = await service.recordReview('user1', 'topic1', '1', dto);

      expect(result.interval).toBe(6); // 2nd repetition -> 6 days
      expect(result.reviewCount).toBe(2);
      expect(result.easeFactor).toBeGreaterThan(2.6);
    });

    it('should reset interval if quality is low (< 3)', async () => {
      const topicSense = {
        id: '1',
        easeFactor: 2.5,
        interval: 10,
        reviewCount: 5,
        learningStatus: LearningStatus.Mastered,
      } as unknown as TopicSenseEntity;

      topicSenseRepository.findOne.mockResolvedValue(topicSense);

      const dto: ReviewTopicSenseDto = { quality: 2 };
      const result = await service.recordReview('user1', 'topic1', '1', dto);

      expect(result.interval).toBe(1);
      expect(result.reviewCount).toBe(0);
      expect(result.learningStatus).toBe(LearningStatus.Review); // Logic in service downgrades Mastered to Review
    });
  });
});
