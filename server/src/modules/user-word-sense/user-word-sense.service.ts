import { UserWordSenseEntity, WordSenseEntity } from '@app/entities';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Loaded, wrap } from '@mikro-orm/core';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserWordSenseDto } from './dto/create-user-word-sense.dto';
import { UpdateUserWordSenseDto } from './dto/update-user-word-sense.dto';

@Injectable()
export class UserWordSenseService {
  private readonly logger = new Logger(UserWordSenseService.name);

  constructor(@Inject(UNIT_OF_WORK) private readonly uow: UnitOfWork) {}

  async createBatch(userId: string, dto: CreateUserWordSenseDto) {
    const { topicId, senses, word, language } = dto;

    const topic = await this.uow.topic.findOne({ id: topicId });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    if (topic.user.id !== userId) {
      throw new ForbiddenException('You do not own this topic');
    }

    const workspace = await this.uow.workspace.findOne({
      id: dto.workspaceId,
      userId,
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return await this.uow.transaction(async () => {
      const createdSenses: UserWordSenseEntity[] = [];

      for (const senseDto of senses) {
        let dictionarySense: Loaded<WordSenseEntity, never, '*', never> | null =
          null;
        if (senseDto.dictionarySenseId) {
          dictionarySense = await this.uow.wordSense.findOne({
            id: senseDto.dictionarySenseId,
          });
          if (!dictionarySense) {
            // Optional: throw new NotFoundException('Dictionary sense not found');
            // Or just ignore. Let's ignore to safely create manual sense if ID is stale.
          }
        }

        const newSense = new UserWordSenseEntity({
          userId,
          topic,
          word,
          language,
          partOfSpeech: senseDto.partOfSpeech,
          definition: senseDto.definition,
          examples: senseDto.examples,
          pronunciation: senseDto.pronunciation,
          synonyms: senseDto.synonyms,
          antonyms: senseDto.antonyms,
          difficultyLevel: senseDto.difficultyLevel,
          learningStatus: senseDto.learningStatus,
          media: senseDto.media,
          dictionarySense: dictionarySense,
          workspace: workspace,
        });

        this.uow.userWordSense.create(newSense);
        createdSenses.push(newSense);
      }

      // Since we are in transaction, flushing happens at end or implicitly if we didn't use managed transaction?
      // MikroORM transaction wrapper usually handles flush.
      // But creating adds to UoW identity map.

      return createdSenses;
    });
  }

  async update(id: string, userId: string, dto: UpdateUserWordSenseDto) {
    const entity = await this.uow.userWordSense.findOne({ id });

    if (!entity) {
      throw new NotFoundException('Word sense not found');
    }

    if (entity.userId !== userId) {
      throw new ForbiddenException('You do not own this word sense');
    }

    wrap(entity).assign(dto);
    await this.uow.save();

    return entity;
  }

  async delete(id: string, userId: string): Promise<void> {
    const entity = await this.uow.userWordSense.findOne({ id });

    if (!entity) {
      throw new NotFoundException('Word sense not found');
    }

    if (entity.userId !== userId) {
      throw new ForbiddenException('You do not own this word sense');
    }

    await this.uow.userWordSense.nativeDelete({ id });
  }

  async findByTopic(topicId: string, userId: string) {
    // Validate topic ownership first
    const topic = await this.uow.topic.findOne({ id: topicId });
    if (!topic) {
      // To be safe/secure, we could return empty or throw not found.
      // If topic doesn't exist, hard to verify ownership.
      throw new NotFoundException('Topic not found');
    }

    if (topic.user.id !== userId) {
      throw new ForbiddenException('You do not own this topic');
    }

    return this.uow.userWordSense.find(
      {
        userId,
        topic: { id: topicId },
      },
      {
        orderBy: { createAt: 'DESC' },
      },
    );
  }
}
