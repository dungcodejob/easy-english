import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  wrap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addDays } from 'date-fns';

import {
  LearningStatus,
  TopicEntity,
  TopicSenseEntity,
  WordSenseEntity,
} from '@app/entities';
import { TopicSenseRepository } from '@app/repositories';

import {
  CreateTopicSenseDto,
  ReviewTopicSenseDto,
  UpdateTopicSenseDto,
} from './dto';

@Injectable()
export class TopicSenseService {
  constructor(
    private readonly em: EntityManager,
    private readonly topicSenseRepository: TopicSenseRepository,
    @InjectRepository(TopicEntity)
    private readonly topicRepository: EntityRepository<TopicEntity>,
    @InjectRepository(WordSenseEntity)
    private readonly wordSenseRepository: EntityRepository<WordSenseEntity>,
  ) {}

  async create(
    userId: string,
    topicId: string,
    dto: CreateTopicSenseDto,
  ): Promise<TopicSenseEntity> {
    const topic = await this.topicRepository.findOne({
      id: topicId,
      user: { id: userId },
    });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const wordSense = await this.wordSenseRepository.findOne({
      id: dto.wordSenseId,
    });
    if (!wordSense) {
      throw new NotFoundException('WordSense not found');
    }

    const existing = await this.topicSenseRepository.findOne({
      topic: { id: topicId },
      wordSense: { id: dto.wordSenseId },
    });

    if (existing) {
      throw new ConflictException('Word already exists in this topic');
    }

    const topicSense = new TopicSenseEntity({
      topic,
      wordSense,
      personalNote: dto.personalNote,
      definitionVi: dto.definitionVi,
    });

    await this.em.persistAndFlush(topicSense);

    // Update topic word count
    await this.updateTopicWordCount(topicId);

    return topicSense;
  }

  async findAll(
    userId: string,
    topicId: string,
    page: number = 1,
    limit: number = 20,
    status?: LearningStatus,
  ): Promise<[TopicSenseEntity[], number]> {
    // verify ownership
    const topic = await this.topicRepository.findOne({
      id: topicId,
      user: { id: userId },
    });
    if (!topic) throw new NotFoundException('Topic not found');

    const where: FilterQuery<TopicSenseEntity> = {
      topic: { id: topicId },
    };

    if (status) {
      where.learningStatus = status;
    }

    return this.topicSenseRepository.findAndCount(where, {
      populate: ['wordSense', 'wordSense.word'],
      limit,
      offset: (page - 1) * limit,
      orderBy: { orderIndex: 'ASC', createAt: 'DESC' },
    });
  }

  async findOne(
    userId: string,
    topicId: string,
    id: string,
  ): Promise<TopicSenseEntity> {
    const sense = await this.topicSenseRepository.findOne(
      {
        id,
        topic: { id: topicId, user: { id: userId } },
      },
      {
        populate: ['wordSense', 'wordSense.word'],
      },
    );

    if (!sense) throw new NotFoundException('Topic sense not found');
    return sense;
  }

  async update(
    userId: string,
    topicId: string,
    id: string,
    dto: UpdateTopicSenseDto,
  ): Promise<TopicSenseEntity> {
    const topicSense = await this.findOne(userId, topicId, id);

    wrap(topicSense).assign(dto);
    await this.em.flush();
    return topicSense;
  }

  async remove(userId: string, topicId: string, id: string): Promise<void> {
    const topicSense = await this.findOne(userId, topicId, id);

    await this.em.removeAndFlush(topicSense);
    await this.updateTopicWordCount(topicId);
  }

  async recordReview(
    userId: string,
    topicId: string,
    id: string,
    dto: ReviewTopicSenseDto,
  ): Promise<TopicSenseEntity> {
    const topicSense = await this.findOne(userId, topicId, id);

    const { quality } = dto;
    const { easeFactor, interval, repetitions } = this.calculateSM2(
      topicSense.easeFactor,
      topicSense.interval, // Now using the field I just added
      topicSense.reviewCount,
      quality,
    );

    topicSense.easeFactor = easeFactor;
    topicSense.interval = interval;
    topicSense.reviewCount = repetitions;
    topicSense.lastReviewAt = new Date();
    topicSense.nextReviewAt = addDays(new Date(), interval);

    // Update status
    if (quality >= 3) {
      if (topicSense.learningStatus === LearningStatus.New) {
        topicSense.learningStatus = LearningStatus.Learning;
      } else if (
        repetitions >= 5 &&
        topicSense.learningStatus === LearningStatus.Learning
      ) {
        topicSense.learningStatus = LearningStatus.Mastered;
      }
    } else {
      // If forgot, maybe demote? For now keep as is or logic can be complex
      if (topicSense.learningStatus === LearningStatus.Mastered) {
        topicSense.learningStatus = LearningStatus.Review;
      }
    }

    // Simple state transition for MVP
    if (quality < 3) {
      // Reset if failed bad? SM2 handles interval reset.
      // Keep status as Learning or Review
    }

    await this.em.flush();
    return topicSense;
  }

  async getReviewQueue(
    userId: string,
    topicId: string,
    limit: number = 20,
  ): Promise<TopicSenseEntity[]> {
    // Verify ownership
    const hasTopic = await this.topicRepository.count({
      id: topicId,
      user: { id: userId },
    });
    if (!hasTopic) throw new NotFoundException('Topic not found');

    return this.topicSenseRepository.find(
      {
        topic: { id: topicId },
        $or: [
          { nextReviewAt: { $lte: new Date() } },
          { nextReviewAt: null, learningStatus: LearningStatus.New }, // Include new items? Maybe separate endpoint
        ],
      },
      {
        populate: ['wordSense', 'wordSense.word'],
        limit,
        orderBy: { nextReviewAt: 'ASC' },
      },
    );
  }

  private calculateSM2(
    currentEaseFactor: number,
    currentInterval: number,
    repetitions: number,
    quality: number,
  ) {
    let nextEaseFactor = currentEaseFactor;
    let nextInterval = currentInterval;
    let nextRepetitions = repetitions;

    if (quality < 3) {
      nextRepetitions = 0;
      nextInterval = 1;
    } else {
      nextEaseFactor = Math.max(
        1.3,
        currentEaseFactor +
          (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
      );

      if (repetitions === 0) {
        nextInterval = 1;
      } else if (repetitions === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.ceil(currentInterval * nextEaseFactor);
      }
      nextRepetitions++;
    }

    return {
      easeFactor: nextEaseFactor,
      interval: nextInterval,
      repetitions: nextRepetitions,
    };
  }

  private async updateTopicWordCount(topicId: string) {
    const count = await this.topicSenseRepository.count({
      topic: { id: topicId },
    });
    const topic = await this.topicRepository.findOne(topicId);
    if (topic) {
      topic.wordCount = count;
      await this.em.flush();
    }
  }
}
