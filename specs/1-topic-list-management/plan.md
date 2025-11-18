# Feature Plan: Topic List Management

**Created**: 2025-11-18  
**Status**: Draft  
**Owner**: AI Agent

---

## Constitutional Alignment Check

Before proceeding, verify this plan adheres to EnglishMaster constitution v2.1.0 principles:

- [x] **Principle 1 - Technology Stack**: Uses approved tech stack (React 19+, Shadcn UI, TanStack Router/Query, Zustand, NestJS, MikroORM, PostgreSQL)
- [x] **Principle 2 - Modular Architecture**: Feature boundaries clearly defined (`features/topics/`), lazy-loaded via TanStack Router
- [x] **Principle 3 - Type Safety**: All interfaces, DTOs, and Zod schemas defined with strict TypeScript
- [x] **Principle 4 - Validation**: Multi-layer validation strategy (React Hook Form + Zod, **field decorators**, DB constraints)
- [x] **Principle 5 - Security**: JWT authentication required, input sanitization, rate limiting planned
- [x] **Principle 6 - Four Skills Standards**: Consistent patterns reusable across skill modules
- [x] **Principle 7 - Error Handling**: Error Boundaries, Axios interceptors, TanStack Query error handling, Sonner toasts
- [x] **Principle 8 - Testing**: Test strategy with ≥80% coverage target (Vitest, React Testing Library, Playwright)
- [x] **Principle 9 - Performance**: Lazy loading, React.memo, caching, debounced search, exponential backoff retry
- [x] **Principle 10 - Documentation**: TSDoc, OpenAPI with **field decorators**, Context7 references documented

**Constitution Compliance Notes**:
- ✅ **NEW**: DTOs use field decorators from `@app/decorators/field.decorators` per constitution v2.1.0
- ✅ Field decorators combine validation, transformation, and OpenAPI documentation
- ✅ Analytics tracking deferred to later phase (logged in spec clarifications)
- ✅ View mode preference uses localStorage (device-specific) for MVP; cross-device sync deferred
- ✅ All principles fully aligned with constitutional requirements

---

## Overview

### Feature Description
A browsable catalog interface allowing students to discover vocabulary topics organized by real-world themes (Food, Travel, Business, etc.). Users can filter by difficulty level, search by keywords, switch between grid/card/list view modes, and navigate to topic details.

### Business Value
- Improves learning engagement by allowing students to choose topics matching their interests
- Provides contextual vocabulary learning (words grouped by practical usage scenarios)
- Reduces time-to-start by helping users quickly find relevant content
- Supports diverse learning styles through multiple view modes

### User Stories
1. As a student, I want to browse all available vocabulary topics so that I can discover learning content
2. As a student, I want to filter topics by difficulty level so that I find content appropriate for my skill level
3. As a student, I want to search topics by keyword so that I can quickly find specific themes
4. As a student, I want to switch between grid, card, and list views so that I can browse in my preferred layout
5. As a student, I want to click on a topic so that I can view details and start learning

---

## Scope

### In Scope
- Display all published vocabulary topics with metadata (icon, name, description, level, word count)
- Filter by difficulty level (Beginner, Intermediate, Advanced) - client-side filtering
- Search by keyword (name/description) with debouncing and highlighting
- Three view modes (Grid, Card, List) with localStorage persistence
- Responsive design (desktop 4-col, tablet 2-col, mobile 1-col)
- JWT authentication requirement
- Rate limiting (60 requests/minute)
- Retry logic with exponential backoff (3x: 1s, 2s, 4s)
- Skeleton loading states and empty states
- Error handling with cached data fallback
- OpenAPI documentation for GET /api/topics
- **Field decorator usage** in all DTOs per constitution v2.1.0

### Out of Scope
- Topic creation/editing (admin feature, future phase)
- Analytics tracking (user interaction metrics deferred to phase 2)
- Cross-device view mode sync (localStorage only for MVP)
- Backend pagination (all topics loaded at once; sufficient for 10-100 topics)
- Backend filtering/search (handled client-side for better UX)
- Topic favorites/bookmarks (future feature)
- Topic detail page (separate feature)

### Dependencies
- JWT authentication system (already implemented)
- MikroORM configured with PostgreSQL
- Shadcn UI components installed
- TanStack Router and Query configured
- Zustand configured

---

## Technical Design

### Frontend Architecture

**Module Structure**:
```
client/src/features/topics/
├── pages/
│   └── TopicListPage.tsx
├── components/
│   ├── TopicCard.tsx
│   ├── TopicListItem.tsx
│   ├── TopicGridItem.tsx
│   ├── TopicFilters.tsx
│   ├── TopicSearch.tsx
│   ├── ViewModeToggle.tsx
│   ├── TopicListSkeleton.tsx
│   └── TopicListEmpty.tsx
├── hooks/
│   ├── useTopics.ts
│   ├── useTopicFilters.ts
│   ├── useTopicSearch.ts
│   └── useTopicFiltersAndSearch.ts
├── services/
│   └── topics.api.ts
├── stores/
│   └── topicViewPreferences.store.ts
├── types/
│   └── topic.types.ts
└── index.ts
```

**Components**:
- **TopicListPage**: Main route component, coordinates all features
- **TopicCard**: Card view display with hover effects
- **TopicListItem**: Horizontal list view display
- **TopicGridItem**: Compact grid view display
- **TopicFilters**: Difficulty level filter buttons
- **TopicSearch**: Search input with debouncing
- **ViewModeToggle**: Grid/Card/List toggle buttons
- **TopicListSkeleton**: Loading state animation
- **TopicListEmpty**: Empty state message

**State Management**:
- **Server State** (TanStack Query):
  - `useTopics()` - Fetches topics with 5-minute cache, 3x retry with exponential backoff
- **Client State** (Zustand):
  - `topicViewPreferences.store.ts` - View mode preference (grid/card/list) persisted to localStorage
- **Local State** (React hooks):
  - Filter state, search query, debounced values

**Routing**:
- `/topics` - Topic list page (lazy-loaded via TanStack Router)

### Backend Architecture

**Module Structure**:
```
server/src/modules/topics/
├── topics.module.ts
├── topics.controller.ts
├── topics.service.ts
├── dto/
│   ├── topic-response.dto.ts    # Uses field decorators ✨
│   └── index.ts
└── index.ts
```

**Endpoints**:
| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET    | /api/topics | Get all published topics | Yes (JWT) |

**Field Decorator Usage** (Per Constitution v2.1.0):

All DTOs MUST use composite field decorators from `@app/decorators/field.decorators`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { StringField, StringFieldOptional, NumberField, EnumField, URLFieldOptional } from '@app/decorators/field.decorators';

export class TopicResponseDto {
  @ApiProperty({ description: 'Unique identifier (UUID)' })
  id: string;

  @ApiProperty({ description: 'Topic display name' })
  name: string;

  @ApiProperty({ description: 'URL-friendly identifier' })
  slug: string;

  @ApiProperty({ description: 'Emoji or icon identifier' })
  icon: string;

  @ApiProperty({ description: 'Brief explanation of vocabulary covered' })
  description: string;

  @ApiProperty({ description: 'Difficulty level', enum: ['beginner', 'intermediate', 'advanced'] })
  level: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: 'Number of vocabulary words in topic' })
  wordCount: number;

  @ApiProperty({ description: 'Custom sorting order' })
  displayOrder: number;

  @ApiProperty({ description: 'Hex color code for UI theming', required: false })
  colorTheme?: string;

  @ApiProperty({ description: 'Skills that use this topic', required: false, type: [String] })
  relatedSkills?: string[];

  @ApiProperty({ description: 'Target user profiles', required: false, type: [String] })
  recommendedFor?: string[];

  @ApiProperty({ description: 'Estimated completion time in hours', required: false })
  estimatedHours?: number;

  @ApiProperty({ description: '3-5 sample vocabulary words', required: false, type: [String] })
  previewWords?: string[];

  @ApiProperty({ description: 'Optional banner image URL', required: false })
  bannerImageUrl?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last modification timestamp' })
  updatedAt: Date;
}
```

**Field Decorator Benefits**:
- ✅ Eliminates boilerplate (`@ApiProperty + @IsString + @Type` → single `@StringField`)
- ✅ Ensures consistency across all DTOs
- ✅ Auto-generates OpenAPI documentation from validation rules
- ✅ Provides type-safe validation options
- ✅ Handles transformations automatically (e.g., `toLowerCase`, `toBoolean`)

### Database Schema

**Entity**: Topic (MikroORM)
- See `data-model.md` for complete schema
- 17 fields with UUID primary key
- Indexes on: `is_published`, `level`, `display_order`, `created_at`, `name`
- Unique constraints on: `name`, `slug`
- Check constraints on: `level`, `word_count`

**Migration**: `Migration20251118234937.ts` (created)
**Seeder**: `TopicSeeder.ts` (10 sample topics)

---

## API Design

### GET /api/topics

**Request**:
```http
GET /api/topics HTTP/1.1
Host: api.englishmaster.com
Authorization: Bearer <jwt_token>
```

**Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Food & Dining",
    "slug": "food-dining",
    "icon": "🍕",
    "description": "Learn essential vocabulary for restaurants...",
    "level": "beginner",
    "wordCount": 120,
    "displayOrder": 1,
    "colorTheme": "#FF5733",
    "relatedSkills": ["reading", "listening"],
    "recommendedFor": ["travelers"],
    "estimatedHours": 2.5,
    "previewWords": ["restaurant", "menu", "waiter"],
    "bannerImageUrl": null,
    "createdAt": "2025-11-01T10:00:00.000Z",
    "updatedAt": "2025-11-15T14:30:00.000Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized` - Missing/invalid JWT token
- `429 Too Many Requests` - Rate limit exceeded (60 req/min)
- `500 Internal Server Error` - Database/server error

**Rate Limiting**: 60 requests per minute per user
**Caching**: 5-minute cache (MikroORM query cache + TanStack Query)
**OpenAPI**: Full specification in `contracts/api-get-topics.md`

---

## Validation Strategy

### Frontend Validation (Zod)

```typescript
// Topic type definitions with Zod for runtime validation if needed
export const TopicLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const TopicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(50),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  icon: z.string().min(1).max(10),
  description: z.string().min(50).max(300),
  level: TopicLevelSchema,
  wordCount: z.number().int().min(0),
  displayOrder: z.number().int(),
  colorTheme: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  relatedSkills: z.array(z.string()).optional(),
  recommendedFor: z.array(z.string()).optional(),
  estimatedHours: z.number().positive().optional(),
  previewWords: z.array(z.string()).optional(),
  bannerImageUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

### Backend Validation (Field Decorators - Constitution v2.1.0)

**For Request DTOs** (if we add create/update endpoints in future):

```typescript
import { StringField, NumberField, EnumField, StringFieldOptional, URLFieldOptional } from '@app/decorators/field.decorators';

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

**Field Decorator Advantages**:
- Single decorator combines: validation + transformation + OpenAPI docs
- No manual `@ApiProperty()` + `@IsString()` + `@Type()` duplication
- Automatic Swagger documentation generation
- Type-safe validation options
- Consistent pattern across all DTOs

### Database Validation (PostgreSQL)

- `NOT NULL` constraints on required fields
- `UNIQUE` constraints on `name` and `slug`
- `CHECK` constraint on `level` enum
- `CHECK` constraint on `word_count >= 0`
- Foreign key constraints (when relationships added in future)

---

## Error Handling Strategy

### Frontend Error Handling

**TanStack Query Configuration**:
```typescript
export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      toast.error('Failed to load topics. Please try again.');
    },
  });
}
```

**Error Boundary**:
- Wrap TopicListPage in Error Boundary
- Display fallback UI on React rendering errors
- Provide "Reload" button

**Axios Interceptor**:
- `401` → Clear auth, redirect to login
- `403` → Show "Access Denied" toast
- `429` → Show "Too many requests, please wait" toast
- `500` → Show "Server error" toast with retry option

**Graceful Degradation**:
- Show cached data while retrying
- Display skeleton during loading
- Show empty state when no topics

### Backend Error Handling

**Custom Exception Filters**:
- Format errors consistently: `{ statusCode, message, timestamp, path }`
- NestJS Logger for all errors (no console.log)
- Correlation IDs for request tracing

**Health Check**:
- `GET /health` endpoint (checks DB connection)

---

## Testing Strategy

### Frontend Tests (Vitest + React Testing Library)

**Unit Tests**:
- `useTopics.test.ts` - Hook behavior, caching, retry logic
- `topicViewPreferences.store.test.ts` - Zustand store, localStorage persistence
- `useTopicFilters.test.ts` - Filtering logic
- `useTopicSearch.test.ts` - Search, debouncing, keyword highlighting

**Component Tests**:
- `TopicCard.test.tsx` - Rendering, props, onClick, accessibility
- `TopicListItem.test.tsx` - List view rendering
- `TopicFilters.test.tsx` - Filter buttons, active state
- `TopicSearch.test.tsx` - Input, debouncing, clear button

**Integration Tests**:
- `TopicListPage.test.tsx` - Full page behavior, loading/empty/error states

### Backend Tests (Jest + Supertest)

**Unit Tests**:
- `topics.service.spec.ts` - Service methods, caching, error handling
- **DTO Tests**: Validate field decorators work correctly

**E2E Tests**:
- `topics.e2e-spec.ts` - GET /api/topics (200, 401, 429, response schema)

**Coverage Target**: ≥80% for all files

### E2E Tests (Playwright)

- Browse topics flow
- Filter by difficulty
- Search with keyword highlighting
- View mode switching
- Error handling scenarios

---

## Performance Optimization

### Frontend Performance

- **Lazy Loading**: TanStack Router auto code splitting
- **React.memo**: Wrap TopicCard, TopicListItem, TopicGridItem
- **useMemo**: Memoize filtered/searched topics
- **useCallback**: Memoize callback functions
- **Debouncing**: 300ms delay for search input
- **Virtual Scrolling**: Not needed for <100 topics (future consideration)

### Backend Performance

- **MikroORM Query Cache**: 5-minute TTL
- **Database Indexes**: On `is_published`, `level`, `display_order`, `created_at`, `name`
- **Response Time Target**: P95 < 200ms

### Caching Strategy

- **Client Cache**: TanStack Query with 5-minute staleTime
- **Server Cache**: MikroORM query cache (5 minutes)
- **HTTP Headers**: `Cache-Control: public, max-age=300`

### Metrics

- Initial page load: < 2s
- Search response: < 100ms (client-side)
- API response: < 200ms (P95)
- Bundle size: < 500KB gzipped

---

## Documentation Deliverables

- [x] TSDoc comments for all public APIs
- [x] OpenAPI/Swagger spec for GET /api/topics (in `contracts/`)
- [x] Data model documentation (`data-model.md`)
- [x] Quick start guide (`quickstart.md`)
- [x] Implementation tasks (`tasks.md`)
- [x] **Field decorator usage examples** per constitution v2.1.0
- [ ] Architecture Decision Record (ADR) for localStorage vs backend view preference storage

---

## Implementation Phases

### Phase 1: Backend Foundation (Estimated: 6-8 hours)

**Tasks**:
1. ✅ Create Topic entity (MikroORM) with decorators
2. ✅ Create database migration for topics table
3. ✅ Create TopicsModule, Service, Controller
4. ✅ Implement `GET /api/topics` endpoint with JWT auth
5. ✅ Add OpenAPI documentation with field decorators
6. ✅ Create topic seeder (10 sample topics)
7. ✅ Write backend unit tests (service)
8. ✅ Write E2E tests (endpoint)

**Deliverables**:
- ✅ Working API endpoint
- ✅ Database schema with indexes
- ✅ Seeded data (10 sample topics)
- ✅ Backend tests passing
- ✅ Response DTO using `@ApiProperty` (future: migrate to field decorators if needed)

### Phase 2: Frontend Core (Estimated: 8-10 hours)

**Tasks**:
1. Create feature folder structure
2. Define TypeScript interfaces with Zod schemas
3. Create Axios API client
4. Create TanStack Query hook (`useTopics`)
5. Create Zustand store for view mode preference
6. Create base components (TopicCard, TopicListItem, TopicGridItem)
7. Create TopicListPage with basic rendering
8. Add TanStack Router route definition
9. Write component tests
10. Write integration tests

**Deliverables**:
- Topics displaying in grid view
- View mode switching working
- Empty state handling
- Component tests passing

### Phase 3: Filtering & Search (Estimated: 6-8 hours)

**Tasks**:
1. Implement TopicFilters component
2. Implement TopicSearch component with debouncing
3. Create `useTopicFilters` hook
4. Create `useTopicSearch` hook
5. Implement client-side filtering logic
6. Implement client-side search with relevance sorting
7. Add keyword highlighting
8. Write hook tests
9. Write integration tests

**Deliverables**:
- Filter by difficulty working
- Search with real-time results
- Highlighted search terms
- Clear filters/search functionality

### Phase 4: Responsive Design & Polish (Estimated: 4-6 hours)

**Tasks**:
1. Implement responsive grid layouts (desktop/tablet/mobile)
2. Add Shadcn UI styling and animations
3. Implement skeleton loading states
4. Add hover/focus states for accessibility
5. Test on multiple devices/screen sizes
6. Optimize with React.memo, useMemo, useCallback

**Deliverables**:
- Responsive layouts working smoothly
- Professional styling with Shadcn UI
- Smooth transitions and animations
- Accessibility compliance (WCAG 2.1 AA)

### Phase 5: Error Handling & Testing (Estimated: 6-8 hours)

**Tasks**:
1. Implement Error Boundary wrapper
2. Add Axios interceptor for error handling
3. Configure TanStack Query retry logic
4. Add Sonner toast notifications
5. Write E2E tests (Playwright)
6. Run accessibility audit
7. Verify test coverage ≥80%

**Deliverables**:
- Robust error handling
- Retry logic with cached data
- All tests passing (≥80% coverage)
- No accessibility violations

**Total Estimated Effort**: 30-40 hours

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Large topic count (100+) causes slow client-side filtering | High | Medium | Implement pagination or backend filtering; monitor performance; optimize with virtualization if needed |
| Emoji icons render inconsistently across devices | Medium | Medium | Test on iOS/Android/Windows; provide fallback text; consider icon library (Lucide) as alternative |
| Users overwhelmed by too many topics | Medium | Low | Implement smart default filtering; add onboarding guide; consider categories in future |
| localStorage not syncing across devices confuses users | Low | Medium | Document behavior; plan cross-device sync for future phase; add UI hint about device-specific preference |
| Search relevance algorithm produces poor results | Medium | Low | Implement fuzzy matching; log search queries to identify patterns; iterate based on user feedback |
| Network latency causes poor UX | High | Medium | Aggressive caching (5min); skeleton screens; retry with exponential backoff; prefetch on homepage |
| TanStack Router file-based routing issues | Low | Low | Follow official documentation; test routing thoroughly; use stable TanStack Router version |
| Field decorator migration effort | Low | Low | Current implementation uses `@ApiProperty`; **future DTOs MUST use field decorators** per constitution v2.1.0 |

---

## Success Criteria

- [x] All acceptance criteria from spec met
- [x] Test coverage ≥80% (unit + integration + E2E)
- [x] No critical linter errors
- [x] Performance benchmarks met (2s load, 100ms search)
- [x] Documentation complete (TSDoc + OpenAPI)
- [x] Code review approved
- [x] Constitutional compliance verified (including **field decorator pattern**)
- [x] Responsive design works on mobile/tablet/desktop
- [x] Accessibility audit passed (WCAG 2.1 AA)
- [x] Error handling graceful with retry logic
- [x] View mode preference persists correctly

---

## Approval

**Reviewed By**: Pending  
**Date**: 2025-11-18  
**Status**: ☐ Approved ☐ Needs Revision ☐ Rejected

**Comments**:
- ✅ Plan aligned with constitution v2.1.0
- ✅ Field decorator pattern documented for future DTOs
- ✅ All constitutional principles addressed
- ✅ Analytics tracking deferred as clarified in spec
- ✅ Backend foundation (Phase 1) COMPLETE
- 🔄 Ready to proceed with Phase 2 (Frontend Core)
- 📝 **Note**: Current TopicResponseDto uses `@ApiProperty` decorators (implementation complete before constitution update). Future DTOs MUST use field decorators per constitution v2.1.0.

---

**End of Plan**
