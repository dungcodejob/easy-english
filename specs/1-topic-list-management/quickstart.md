# Quick Start Guide: Topic List Management

**Feature**: Topic List Management  
**Version**: 1.0.0  
**Last Updated**: 2025-11-18

---

## Overview

This guide helps developers quickly integrate and use the Topic List Management feature in the EnglishMaster application. It covers both frontend (React) and backend (NestJS) integration points.

---

## Prerequisites

### Required Knowledge
- React 19+ with hooks and TypeScript
- TanStack Router for routing
- TanStack Query for data fetching
- Zustand for state management
- NestJS with MikroORM
- PostgreSQL database

### Required Setup
- ✅ Authentication system implemented (JWT tokens)
- ✅ Database connection configured (PostgreSQL)
- ✅ Shadcn UI components installed
- ✅ Axios configured with interceptors

---

## Quick Integration (5-Minute Setup)

### Step 1: Backend Setup

**1.1 Run Database Migration**:
```bash
# Navigate to server directory
cd server

# Generate migration from entity
npm run migration:create

# Run migration
npm run migration:up
```

**1.2 Seed Sample Topics** (Optional):
```bash
npm run seed:topics
```

**1.3 Verify API Endpoint**:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/topics
```

Expected: JSON array of topics with 200 status

### Step 2: Frontend Setup

**2.1 Install Dependencies** (if not already installed):
```bash
cd client
bun add @tanstack/react-query @tanstack/react-router zustand axios
```

**2.2 Add Route**:

Create `client/src/routes/topics.tsx`:
```typescript
import { createFileRoute } from '@tanstack/react-router';
import { TopicListPage } from '@/features/topics';

export const Route = createFileRoute('/topics')({
  component: TopicListPage,
});
```

**2.3 Navigate to Topics**:
```tsx
// From any component
import { Link } from '@tanstack/react-router';

<Link to="/topics">Browse Topics</Link>
```

**Done!** Visit `/topics` to see the topic list.

---

## Detailed Frontend Integration

### API Client Setup

**File**: `client/src/features/topics/services/topics.api.ts`

```typescript
import axios from 'axios';
import type { Topic } from '../types/topic.types';

const API_BASE_URL = process.env.PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Fetches all published vocabulary topics.
 * @returns Promise resolving to array of topics
 * @throws {Error} Network or API errors
 */
export async function fetchTopics(): Promise<Topic[]> {
  const response = await axios.get<Topic[]>(`${API_BASE_URL}/topics`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`, // Your auth helper
    },
  });
  return response.data;
}

/**
 * Gets auth token from storage or auth context.
 */
function getAuthToken(): string {
  // Your authentication logic here
  return localStorage.getItem('auth_token') || '';
}
```

### TanStack Query Hook

**File**: `client/src/features/topics/hooks/useTopics.ts`

```typescript
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchTopics } from '../services/topics.api';
import type { Topic } from '../types/topic.types';

/**
 * Fetches all published vocabulary topics with caching and retry logic.
 * 
 * @returns {UseQueryResult<Topic[], Error>} Query result with topics
 * 
 * @example
 * ```tsx
 * const { data: topics, isLoading, error } = useTopics();
 * 
 * if (isLoading) return <Skeleton />;
 * if (error) return <ErrorMessage />;
 * return <TopicList topics={topics} />;
 * ```
 */
export function useTopics(): UseQueryResult<Topic[], Error> {
  return useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 3, // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}
```

### Basic Component Usage

**File**: `client/src/features/topics/pages/TopicListPage.tsx`

```tsx
import React from 'react';
import { useTopics } from '../hooks/useTopics';
import { TopicCard } from '../components/TopicCard';
import { TopicListSkeleton } from '../components/TopicListSkeleton';
import { TopicListEmpty } from '../components/TopicListEmpty';

export function TopicListPage() {
  const { data: topics, isLoading, error } = useTopics();

  if (isLoading) {
    return <TopicListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load topics. Please try again.</p>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return <TopicListEmpty />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vocabulary Topics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
```

### View Mode Persistence (Zustand Store)

**File**: `client/src/features/topics/stores/topicViewPreferences.store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewMode } from '../types/topic.types';

interface TopicViewPreferencesState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

/**
 * Zustand store for persisting topic view mode preference.
 * Stores preference in localStorage.
 */
export const useTopicViewPreferences = create<TopicViewPreferencesState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'topic-view-preferences', // localStorage key
    }
  )
);
```

**Usage**:
```tsx
import { useTopicViewPreferences } from '../stores/topicViewPreferences.store';

function ViewModeToggle() {
  const { viewMode, setViewMode } = useTopicViewPreferences();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setViewMode('grid')}
        className={viewMode === 'grid' ? 'active' : ''}
      >
        Grid
      </button>
      <button
        onClick={() => setViewMode('card')}
        className={viewMode === 'card' ? 'active' : ''}
      >
        Card
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={viewMode === 'list' ? 'active' : ''}
      >
        List
      </button>
    </div>
  );
}
```

---

## Detailed Backend Integration

### Module Setup

**File**: `server/src/modules/topics/topics.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { Topic } from './entities/topic.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Topic])],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService], // Export if other modules need it
})
export class TopicsModule {}
```

### Controller Implementation

**File**: `backend/src/modules/topics/topics.controller.ts`

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { TopicsService } from './topics.service';
import { TopicResponseDto } from './dto/topic-response.dto';

@ApiTags('topics')
@Controller('topics')
@UseGuards(JwtAuthGuard, ThrottlerGuard)
@ApiBearerAuth()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @Throttle(60, 60) // 60 requests per 60 seconds
  @ApiResponse({
    status: 200,
    description: 'List of published topics',
    type: [TopicResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  async findAll(): Promise<TopicResponseDto[]> {
    return this.topicsService.findAllPublished();
  }
}
```

### Service Implementation

**File**: `server/src/modules/topics/topics.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Topic } from './entities/topic.entity';
import { TopicResponseDto } from './dto/topic-response.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: EntityRepository<Topic>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Retrieves all published topics ordered by display order and name.
   * Results are cached for 5 minutes for performance.
   * 
   * @returns Promise<TopicResponseDto[]> Array of published topics
   */
  async findAllPublished(): Promise<TopicResponseDto[]> {
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

    return topics.map((topic) => this.mapToDto(topic));
  }

  /**
   * Maps Topic entity to TopicResponseDto.
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
```

---

## Common Patterns

### Pattern 1: Filtering Topics by Level

```tsx
import { useMemo, useState } from 'react';
import { useTopics } from '../hooks/useTopics';
import type { TopicLevel } from '../types/topic.types';

function FilteredTopicList() {
  const { data: topics } = useTopics();
  const [levelFilter, setLevelFilter] = useState<TopicLevel | 'all'>('all');

  const filteredTopics = useMemo(() => {
    if (!topics) return [];
    if (levelFilter === 'all') return topics;
    return topics.filter((topic) => topic.level === levelFilter);
  }, [topics, levelFilter]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={levelFilter === level ? 'active' : ''}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        {filteredTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
```

### Pattern 2: Searching Topics with Debouncing

```tsx
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce'; // Custom debounce hook
import { useTopics } from '../hooks/useTopics';

function SearchableTopicList() {
  const { data: topics } = useTopics();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300); // 300ms delay

  const searchedTopics = useMemo(() => {
    if (!topics || !debouncedQuery) return topics || [];
    
    const query = debouncedQuery.toLowerCase();
    return topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query)
    );
  }, [topics, debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      />
      
      {searchedTopics.length === 0 ? (
        <p>No topics found for "{debouncedQuery}"</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {searchedTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Pattern 3: Navigation to Topic Detail

```tsx
import { useNavigate } from '@tanstack/react-router';
import type { Topic } from '../types/topic.types';

function TopicCard({ topic }: { topic: Topic }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: '/topics/$topicId',
      params: { topicId: topic.id },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:shadow-lg transition"
    >
      <div className="text-4xl mb-2">{topic.icon}</div>
      <h3 className="font-bold">{topic.name}</h3>
      <p className="text-sm text-gray-600">{topic.description}</p>
      <span className="badge">{topic.level}</span>
      <span className="text-xs">{topic.wordCount} words</span>
    </div>
  );
}
```

---

## Testing Integration

### Frontend Test Example

**File**: `client/src/features/topics/hooks/useTopics.test.ts`

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopics } from './useTopics';
import * as api from '../services/topics.api';

jest.mock('../services/topics.api');

describe('useTopics', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch topics successfully', async () => {
    const mockTopics = [
      { id: '1', name: 'Food', level: 'beginner', /* ... */ },
      { id: '2', name: 'Travel', level: 'intermediate', /* ... */ },
    ];

    jest.spyOn(api, 'fetchTopics').mockResolvedValue(mockTopics);

    const { result } = renderHook(() => useTopics(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTopics);
  });

  it('should handle errors gracefully', async () => {
    jest.spyOn(api, 'fetchTopics').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTopics(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
```

### Backend Test Example

**File**: `backend/src/modules/topics/topics.controller.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

describe('TopicsController', () => {
  let controller: TopicsController;
  let service: TopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        {
          provide: TopicsService,
          useValue: {
            findAllPublished: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
    service = module.get<TopicsService>(TopicsService);
  });

  it('should return array of topics', async () => {
    const mockTopics = [
      { id: '1', name: 'Food', level: 'beginner', /* ... */ },
    ];

    jest.spyOn(service, 'findAllPublished').mockResolvedValue(mockTopics);

    const result = await controller.findAll();
    expect(result).toEqual(mockTopics);
    expect(service.findAllPublished).toHaveBeenCalled();
  });
});
```

---

## Troubleshooting

### Common Issues

**1. Topics Not Loading**:
- ✓ Check JWT token is valid and not expired
- ✓ Verify backend API is running (`curl http://localhost:3000/api/topics`)
- ✓ Check browser console for CORS errors
- ✓ Verify database migration ran successfully

**2. 401 Unauthorized Error**:
- ✓ Ensure JWT token is included in Authorization header
- ✓ Check token hasn't expired (default: 15 minutes)
- ✓ Verify auth guard is configured correctly in NestJS

**3. Empty Topic List**:
- ✓ Check if topics exist in database: `SELECT * FROM topics WHERE is_published = true;`
- ✓ Verify seed script ran: `npm run seed:topics`
- ✓ Check topics are published (`is_published = true`)

**4. Slow Performance**:
- ✓ Enable TypeORM query cache (5 minutes)
- ✓ Add database indexes on `is_published`, `display_order`
- ✓ Check network tab for bundle size (should be <500KB)
- ✓ Use React.memo on TopicCard components

---

## Next Steps

After integrating Topic List Management:

1. **Topic Detail Page**: Create `/topics/$topicId` route showing full topic info
2. **Vocabulary Words**: Link topics to vocabulary word lists
3. **Progress Tracking**: Track which topics users have completed
4. **Analytics**: Implement tracking (deferred to phase 2)
5. **Favorites**: Allow users to bookmark favorite topics

---

## Constitutional Best Practices

### Field Decorator Pattern (Constitution v2.1.0)

**⚠️ Important**: Per EnglishMaster constitution v2.1.0, all new DTOs MUST use field decorators from `@app/decorators/field.decorators` instead of manual `@ApiProperty` + `@IsString` + `@Type` combinations.

#### Why Field Decorators?

1. **Less Boilerplate**: One decorator instead of 3-4 separate decorators
2. **Consistency**: Same pattern across all DTOs
3. **Auto-Documentation**: OpenAPI docs generated automatically from validation rules
4. **Type Safety**: Validation rules match TypeScript types
5. **Transformation**: Automatic transformations (toLowerCase, toBoolean, etc.)

#### Available Field Decorators

```typescript
import {
  StringField,
  StringFieldOptional,
  NumberField,
  NumberFieldOptional,
  BooleanField,
  BooleanFieldOptional,
  EmailField,
  EmailFieldOptional,
  UUIDField,
  UUIDFieldOptional,
  URLField,
  URLFieldOptional,
  DateField,
  DateFieldOptional,
  EnumField,
  EnumFieldOptional,
  PasswordField,
  PasswordFieldOptional,
  ClassField,
  ClassFieldOptional,
} from '@app/decorators/field.decorators';
```

#### Example: Create Topic DTO (Future Feature)

When creating DTOs for topic creation/editing, use field decorators:

```typescript
import { StringField, NumberField, EnumField, StringFieldOptional, URLFieldOptional } from '@app/decorators/field.decorators';

enum TopicLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export class CreateTopicDto {
  @StringField({ 
    minLength: 3, 
    maxLength: 50,
    description: 'Topic display name',
    example: 'Food & Dining'
  })
  name: string;

  @StringField({ 
    minLength: 3, 
    maxLength: 60, 
    toLowerCase: true,
    description: 'URL-friendly identifier',
    example: 'food-dining'
  })
  slug: string;

  @StringField({ 
    minLength: 1, 
    maxLength: 10,
    description: 'Emoji or icon identifier',
    example: '🍕'
  })
  icon: string;

  @StringField({ 
    minLength: 50, 
    maxLength: 300,
    description: 'Brief explanation of vocabulary covered'
  })
  description: string;

  @EnumField(() => TopicLevel, {
    description: 'Difficulty level',
    example: 'beginner'
  })
  level: TopicLevel;

  @NumberField({ 
    min: 0, 
    int: true,
    description: 'Number of vocabulary words',
    example: 120
  })
  wordCount: number;

  @NumberField({ 
    min: 0, 
    int: true,
    description: 'Display sorting order',
    example: 1
  })
  displayOrder: number;

  @StringFieldOptional({ 
    maxLength: 7, 
    isHexColor: true,
    description: 'Hex color code for UI theming',
    example: '#FF5733'
  })
  colorTheme?: string;

  @URLFieldOptional({ 
    maxLength: 500,
    description: 'Optional banner image URL'
  })
  bannerImageUrl?: string;
}
```

#### Field Decorator Options

**Common Options (all decorators)**:
- `description` - OpenAPI description
- `example` - OpenAPI example value
- `nullable` - Allow null values
- `each` - Apply validation to array elements
- `swagger: false` - Disable Swagger documentation

**StringField Options**:
- `minLength`, `maxLength` - Length constraints
- `toLowerCase`, `toUpperCase` - Automatic case transformation
- `isHexColor` - Validate hex color codes

**NumberField Options**:
- `min`, `max` - Range constraints
- `int: true` - Require integer
- `isPositive: true` - Require positive number

**EnumField Options**:
- `enumName` - Custom enum name in OpenAPI

#### Migration Guide

**❌ Old Pattern (Don't use for new DTOs)**:
```typescript
export class CreateTopicDto {
  @ApiProperty({ description: 'Topic name', example: 'Food & Dining' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Type(() => String)
  name: string;
}
```

**✅ New Pattern (Constitution v2.1.0)**:
```typescript
export class CreateTopicDto {
  @StringField({ 
    minLength: 3, 
    maxLength: 50,
    description: 'Topic name',
    example: 'Food & Dining'
  })
  name: string;
}
```

#### Benefits Summary

| Old Pattern | Field Decorator | Savings |
|-------------|-----------------|---------|
| 5 decorators (@ApiProperty, @IsString, @MinLength, @MaxLength, @Type) | 1 decorator (@StringField) | 4 lines |
| Manual sync between OpenAPI and validation | Auto-synced | 0% drift risk |
| Inconsistent patterns across DTOs | Consistent pattern | Better maintainability |
| Verbose and error-prone | Concise and type-safe | Faster development |

---

## Additional Resources

- **API Contract**: See `contracts/api-get-topics.md`
- **Data Model**: See `data-model.md`
- **Technical Plan**: See `plan.md`
- **Specification**: See `spec.md`
- **Constitution**: See `.specify/memory/constitution.md` (Principle 4: Field Decorators)

---

**End of Quick Start Guide**

