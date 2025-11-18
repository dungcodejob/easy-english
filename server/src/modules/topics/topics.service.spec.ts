import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TopicsService } from './topics.service';
import { Topic } from '@app/entities';
import { TopicResponseDto } from './dto';

describe('TopicsService', () => {
  let service: TopicsService;
  let repository: EntityRepository<Topic>;
  let entityManager: EntityManager;

  // Mock data
  const mockTopics: Topic[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Food & Dining',
      slug: 'food-dining',
      icon: '🍕',
      description: 'Learn essential vocabulary for restaurants...',
      level: 'beginner',
      wordCount: 120,
      displayOrder: 1,
      isPublished: true,
      colorTheme: '#FF5733',
      relatedSkills: ['reading', 'listening'],
      recommendedFor: ['travelers'],
      estimatedHours: 2.5,
      previewWords: ['restaurant', 'menu', 'waiter'],
      bannerImageUrl: null,
      createdAt: new Date('2025-11-01T10:00:00.000Z'),
      updatedAt: new Date('2025-11-15T14:30:00.000Z'),
    } as Topic,
    {
      id: '660f9511-f3ac-52e5-b827-557766551111',
      name: 'Travel & Tourism',
      slug: 'travel-tourism',
      icon: '✈️',
      description: 'Essential phrases and vocabulary for airports...',
      level: 'beginner',
      wordCount: 150,
      displayOrder: 2,
      isPublished: true,
      colorTheme: '#3498DB',
      relatedSkills: ['speaking', 'listening'],
      recommendedFor: ['travelers', 'tourists'],
      estimatedHours: 3.0,
      previewWords: ['airport', 'hotel', 'ticket'],
      bannerImageUrl: null,
      createdAt: new Date('2025-11-01T10:05:00.000Z'),
      updatedAt: new Date('2025-11-15T14:35:00.000Z'),
    } as Topic,
  ];

  beforeEach(async () => {
    // Create mock repository
    const mockRepository = {
      find: jest.fn(),
    };

    // Create mock entity manager
    const mockEntityManager = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: getRepositoryToken(Topic),
          useValue: mockRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    repository = module.get<EntityRepository<Topic>>(getRepositoryToken(Topic));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPublished', () => {
    it('should return array of published topics ordered by displayOrder and name', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue(mockTopics);

      // Act
      const result = await service.findAllPublished();

      // Assert
      expect(repository.find).toHaveBeenCalledWith(
        { isPublished: true },
        {
          orderBy: {
            displayOrder: 'ASC',
            name: 'ASC',
          },
          cache: 300000,
        },
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: mockTopics[0].id,
        name: mockTopics[0].name,
        slug: mockTopics[0].slug,
        level: mockTopics[0].level,
      });
    });

    it('should return empty array when no published topics exist', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      // Act
      const result = await service.findAllPublished();

      // Assert
      expect(repository.find).toHaveBeenCalledWith(
        { isPublished: true },
        expect.any(Object),
      );
      expect(result).toEqual([]);
    });

    it('should map Topic entities to TopicResponseDto correctly', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue([mockTopics[0]]);

      // Act
      const result = await service.findAllPublished();

      // Assert
      const dto = result[0];
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('name');
      expect(dto).toHaveProperty('slug');
      expect(dto).toHaveProperty('icon');
      expect(dto).toHaveProperty('description');
      expect(dto).toHaveProperty('level');
      expect(dto).toHaveProperty('wordCount');
      expect(dto).toHaveProperty('displayOrder');
      expect(dto).toHaveProperty('createdAt');
      expect(dto).toHaveProperty('updatedAt');
    });

    it('should include optional fields when present', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue([mockTopics[0]]);

      // Act
      const result = await service.findAllPublished();

      // Assert
      const dto = result[0];
      expect(dto.colorTheme).toBe('#FF5733');
      expect(dto.relatedSkills).toEqual(['reading', 'listening']);
      expect(dto.recommendedFor).toEqual(['travelers']);
      expect(dto.estimatedHours).toBe(2.5);
      expect(dto.previewWords).toEqual(['restaurant', 'menu', 'waiter']);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      jest.spyOn(repository, 'find').mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAllPublished()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should use caching with 5-minute TTL', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue(mockTopics);

      // Act
      await service.findAllPublished();

      // Assert
      expect(repository.find).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          cache: 300000, // 5 minutes in milliseconds
        }),
      );
    });

    it('should filter by isPublished = true only', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue(mockTopics);

      // Act
      await service.findAllPublished();

      // Assert
      expect(repository.find).toHaveBeenCalledWith(
        { isPublished: true },
        expect.any(Object),
      );
    });

    it('should order results by displayOrder ASC, then name ASC', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue(mockTopics);

      // Act
      await service.findAllPublished();

      // Assert
      expect(repository.find).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          orderBy: {
            displayOrder: 'ASC',
            name: 'ASC',
          },
        }),
      );
    });
  });
});

