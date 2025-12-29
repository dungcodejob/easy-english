import { TopicEntity } from '@app/entities';
import { AuthEventContext, QueryDto } from '@app/models';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto } from './models/create-topic.dto';
import { GetTopicsDto } from './models/get-topics.dto';
import { UpdateTopicDto } from './models/update-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly _unitOfWork: UnitOfWork,
  ) {}

  async create(data: CreateTopicDto & AuthEventContext): Promise<TopicEntity> {
    const workspace = await this._unitOfWork.workspace.findOne({
      id: data.workspaceId,
      userId: data.userId,
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const topic = new TopicEntity(data);
    topic.tenant = this._unitOfWork.tenant.getReference(data.tenantId);
    topic.user = this._unitOfWork.user.getReference(data.userId);
    topic.workspace = workspace;
    this._unitOfWork.topic.create(topic);
    await this._unitOfWork.save();
    return topic;
  }

  async findAll(dto: GetTopicsDto): Promise<[TopicEntity[], number]> {
    console.log(dto);
    // Build filter query from parsed filters
    const filterQuery = QueryDto.setConditionFilter<TopicEntity>(
      { workspace: dto.workspaceId },
      dto.filters,
    );

    // Build options with sorts
    const options: any = QueryDto.setConditionSort<TopicEntity>(
      {
        orderBy: { createAt: 'DESC' },
      },
      dto.sorts,
    );

    return this._unitOfWork.topic.findAndCount(filterQuery, options);
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
