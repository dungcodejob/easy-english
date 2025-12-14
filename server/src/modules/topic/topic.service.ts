import { TopicEntity } from '@app/entities';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { FilterQuery } from '@mikro-orm/core';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto } from './models/create-topic.dto';
import { UpdateTopicDto } from './models/update-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly _unitOfWork: UnitOfWork,
  ) {}

  async create(data: CreateTopicDto): Promise<TopicEntity> {
    const topic = new TopicEntity(data);
    this._unitOfWork.topic.create(topic);
    await this._unitOfWork.save();
    return topic;
  }

  async findAll(
    query: FilterQuery<TopicEntity> = {},
  ): Promise<[TopicEntity[], number]> {
    return this._unitOfWork.topic.findAndCount(query, {
      orderBy: { createAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TopicEntity> {
    const topic = await this._unitOfWork.topic.findOne({ id });
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }

  async update(id: string, data: UpdateTopicDto): Promise<TopicEntity> {
    const topic = await this.findOne(id);
    this._unitOfWork.topic.assign(topic, data);
    await this._unitOfWork.save();
    return topic;
  }

  async remove(id: string): Promise<void> {
    const topic = await this.findOne(id);
    this._unitOfWork.getEntityManager().remove(topic);
    await this._unitOfWork.save();
  }
}
