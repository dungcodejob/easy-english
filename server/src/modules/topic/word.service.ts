import { WordEntity } from '@app/entities';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { wrap } from '@mikro-orm/core';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OxfordDictionaryService } from '../../shared/services/oxford-dictionary.service';
import { LookupService } from '../lookup/lookup.service';
import { CreateWordDto, UpdateWordDto } from './models';

@Injectable()
export class WordService {
  private readonly logger = new Logger(WordService.name);

  constructor(
    @Inject(UNIT_OF_WORK) private readonly uow: UnitOfWork,
    private readonly lookupService: LookupService,
    private readonly oxfordService: OxfordDictionaryService,
  ) {}

  async create(
    topicId: string,
    userId: string,
    dto: CreateWordDto,
  ): Promise<WordEntity> {
    const topic = await this.uow.topic.findOne({ id: topicId });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    // Check permissions if needed (topic.user.id === userId) - skipped for brevity as per instructions unless specified

    const word = new WordEntity({
      ...dto,
      topic,
      tenant: topic.tenant, // Inherit tenant from topic
    });

    this.uow.word.create(word);
    await this.uow.save();
    await this.updateTopicWordCount(topic.id);

    return word;
  }

  async createFromOxford(
    topicId: string,
    userId: string,
    wordText: string,
  ): Promise<WordEntity> {
    const topic = await this.uow.topic.findOne({ id: topicId });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const parsedData = await this.lookupService.lookup(wordText);
    // const parsedData = this.oxfordService.parseOxfordData(oxfordData);

    const word = new WordEntity({
      word: wordText,
      topic,
      tenant: topic.tenant,
      fromOxfordApi: true,
      oxfordData: parsedData,
      definition: parsedData?.definition,
      examples: parsedData?.examples,
      pronunciation: parsedData?.pronunciation,
      audioUrl: parsedData?.audioUrl,
      partOfSpeech: parsedData?.partOfSpeech,
      synonyms: parsedData?.synonyms,
    });

    this.uow.word.create(word);
    await this.uow.save();
    await this.updateTopicWordCount(topic.id);

    return word;
  }

  async findAll(topicId: string, query?: any): Promise<[WordEntity[], number]> {
    return this.uow.word.findAndCount(
      { topic: { id: topicId } },
      {
        limit: query?.limit,
        offset: query?.offset,
        orderBy: { createAt: 'DESC' },
      },
    );
  }

  async findOne(id: string): Promise<WordEntity> {
    const word = await this.uow.word.findOne({ id });
    if (!word) {
      throw new NotFoundException('Word not found');
    }
    return word;
  }

  async update(id: string, dto: UpdateWordDto): Promise<WordEntity> {
    const word = await this.uow.word.findOne({ id });
    if (!word) {
      throw new NotFoundException('Word not found');
    }

    wrap(word).assign(dto);
    await this.uow.save();
    return word;
  }

  async delete(id: string): Promise<void> {
    const word = await this.uow.word.findOne({ id });
    if (!word) {
      throw new NotFoundException('Word not found');
    }

    const topicId = word.topic.id;
    await this.uow.word.nativeDelete({ id }); // Or soft delete if base entity supports it
    await this.updateTopicWordCount(topicId);
  }

  private async updateTopicWordCount(topicId: string) {
    const count = await this.uow.word.count({ topic: { id: topicId } });
    const topic = await this.uow.topic.findOne({ id: topicId });
    if (topic) {
      topic.wordCount = count;
      await this.uow.save();
    }
  }
}
