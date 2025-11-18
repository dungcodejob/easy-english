# Data Model: Topic List Management

**Created**: 2025-11-18  
**Last Updated**: 2025-11-18  
**Status**: Draft

---

## Overview

This document defines the data entities, relationships, and validation rules for the Topic List Management feature. The primary entity is **Topic**, which represents a thematic vocabulary collection.

---

## Entities

### Topic Entity

**Description**: A thematic grouping of vocabulary words (e.g., "Food & Dining", "Travel & Tourism") that provides contextual learning.

**Database Table**: `topics`

**Fields**:

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Topic display name (e.g., "Food & Dining") |
| `slug` | VARCHAR(60) | NOT NULL, UNIQUE | URL-friendly identifier (e.g., "food-dining") |
| `icon` | VARCHAR(10) | NOT NULL | Emoji character or icon identifier (e.g., "🍕") |
| `description` | VARCHAR(300) | NOT NULL | Brief explanation of vocabulary covered |
| `level` | VARCHAR(20) | NOT NULL, CHECK (level IN ('beginner', 'intermediate', 'advanced')) | Difficulty level |
| `word_count` | INTEGER | NOT NULL, DEFAULT 0, CHECK (word_count >= 0) | Number of vocabulary words in topic |
| `display_order` | INTEGER | NOT NULL, DEFAULT 999 | Custom sorting order (lower = earlier) |
| `is_published` | BOOLEAN | NOT NULL, DEFAULT false | Visibility to students |
| `color_theme` | VARCHAR(7) | NULLABLE | Hex color code (e.g., "#FF5733") |
| `related_skills` | TEXT[] | NULLABLE | Skills using this topic (e.g., ['reading', 'listening']) |
| `recommended_for` | TEXT[] | NULLABLE | User profiles (e.g., ['travelers', 'business professionals']) |
| `estimated_hours` | DECIMAL(4,1) | NULLABLE | Estimated completion time |
| `preview_words` | TEXT[] | NULLABLE | 3-5 sample words (e.g., ['restaurant', 'menu', 'waiter']) |
| `banner_image_url` | VARCHAR(500) | NULLABLE | Optional banner image URL |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification timestamp |

**Indexes**:

```sql
CREATE INDEX idx_topics_published ON topics(is_published);
CREATE INDEX idx_topics_level ON topics(level);
CREATE INDEX idx_topics_display_order ON topics(display_order);
CREATE INDEX idx_topics_created_at ON topics(created_at DESC);
```

**Unique Constraints**:
- `name` UNIQUE: Prevents duplicate topic names
- `slug` UNIQUE: Ensures URL uniqueness for routing

**Check Constraints**:
- `level` must be one of: 'beginner', 'intermediate', 'advanced'
- `word_count` must be >= 0

---

## TypeScript Interfaces

### Topic Interface (Frontend)

```typescript
/**
 * Represents a vocabulary topic with metadata.
 */
export interface Topic {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  level: TopicLevel;
  wordCount: number;
  displayOrder: number;
  colorTheme?: string;
  relatedSkills?: SkillType[];
  recommendedFor?: string[];
  estimatedHours?: number;
  previewWords?: string[];
  bannerImageUrl?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Difficulty level enum for topics.
 */
export type TopicLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Skill types that can use vocabulary topics.
 */
export type SkillType = 'reading' | 'writing' | 'listening' | 'speaking';

/**
 * View mode preferences for topic list display.
 */
export type ViewMode = 'grid' | 'card' | 'list';

/**
 * Filter options for difficulty level.
 */
export type TopicLevelFilter = 'all' | TopicLevel;
```

### MikroORM Entity (Backend)

```typescript
import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';
import { v4 } from 'uuid';

/**
 * Topic entity representing a thematic vocabulary collection.
 */
@Entity({ tableName: 'topics' })
export class Topic {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ length: 50, unique: true })
  @Index()
  name: string;

  @Property({ length: 60, unique: true })
  slug: string;

  @Property({ length: 10 })
  icon: string;

  @Property({ length: 300 })
  description: string;

  @Property({ type: 'string', length: 20 })
  @Index()
  level: 'beginner' | 'intermediate' | 'advanced';

  @Property({ type: 'integer', default: 0 })
  wordCount: number = 0;

  @Property({ type: 'integer', default: 999 })
  @Index()
  displayOrder: number = 999;

  @Property({ type: 'boolean', default: false })
  @Index()
  isPublished: boolean = false;

  @Property({ length: 7, nullable: true })
  colorTheme?: string;

  @Property({ type: 'array', nullable: true })
  relatedSkills?: string[];

  @Property({ type: 'array', nullable: true })
  recommendedFor?: string[];

  @Property({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  estimatedHours?: number;

  @Property({ type: 'array', nullable: true })
  previewWords?: string[];

  @Property({ length: 500, nullable: true })
  bannerImageUrl?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
```

---

## Validation Rules

### Field-Level Validation

| Field | Rule | Message |
|-------|------|---------|
| `name` | Required, 3-50 chars, unique | "Topic name must be between 3 and 50 characters" |
| `slug` | Required, lowercase, hyphens only, unique | "Slug must be URL-safe (lowercase and hyphens only)" |
| `icon` | Required, 1-10 chars, valid emoji or icon ID | "Icon must be a valid emoji or icon identifier" |
| `description` | Required, 50-300 chars | "Description must be between 50 and 300 characters" |
| `level` | Required, enum: beginner/intermediate/advanced | "Level must be beginner, intermediate, or advanced" |
| `word_count` | Required, integer >= 0 | "Word count must be a non-negative integer" |
| `display_order` | Required, integer | "Display order must be an integer" |
| `is_published` | Required, boolean | "Published status must be true or false" |
| `color_theme` | Optional, hex color format (#RRGGBB) | "Color theme must be a valid hex color (e.g., #FF5733)" |
| `estimated_hours` | Optional, decimal >= 0 | "Estimated hours must be a non-negative number" |

**⚠️ Implementation Note (Constitution v2.1.0)**: When creating DTOs for topic creation/update endpoints, use field decorators from `@app/decorators/field.decorators` to implement these validation rules. Field decorators combine validation, transformation, and OpenAPI documentation in a single, consistent pattern. Example:

```typescript
import { StringField, NumberField, EnumField, StringFieldOptional } from '@app/decorators/field.decorators';

export class CreateTopicDto {
  @StringField({ minLength: 3, maxLength: 50, description: 'Topic name' })
  name: string;

  @EnumField(() => TopicLevel, { description: 'Difficulty level' })
  level: TopicLevel;

  @NumberField({ min: 0, int: true, description: 'Word count' })
  wordCount: number;

  @StringFieldOptional({ maxLength: 7, isHexColor: true, description: 'Hex color' })
  colorTheme?: string;
}
```

See `quickstart.md` → "Constitutional Best Practices" section for complete field decorator guide.

### Business Rules

1. **Uniqueness**:
   - No two topics can have the same name
   - No two topics can have the same slug
   - Slug is automatically generated from name on creation

2. **Publishing**:
   - Only published topics (`is_published = true`) are visible to students
   - Unpublished topics are drafts (admin/teacher only in future)

3. **Ordering**:
   - Topics sorted by `display_order` ASC, then `name` ASC
   - Default `display_order` is 999 (appears at end)

4. **Level Classification**:
   - `beginner`: A1-A2 CEFR level equivalent
   - `intermediate`: B1-B2 CEFR level equivalent
   - `advanced`: C1-C2 CEFR level equivalent

5. **Word Count**:
   - Can be 0 for "coming soon" topics
   - Updated automatically when vocabulary words are added/removed (separate feature)

---

## Relationships

### Current Phase (MVP)
- **None**: Topic entity is standalone for MVP
- Topics are self-contained with no foreign key relationships

### Future Phases

**Planned Relationships**:

1. **Topic → VocabularyWords** (One-to-Many):
   ```
   Topic (1) ----< VocabularyWords (N)
   ```
   - Each topic contains multiple vocabulary words
   - Cascade delete: Deleting topic deletes associated words

2. **Topic → UserProgress** (One-to-Many):
   ```
   Topic (1) ----< UserProgress (N)
   ```
   - Tracks user completion and scores per topic
   - No cascade: Progress preserved even if topic deleted

3. **Topic → Lessons** (One-to-Many):
   ```
   Topic (1) ----< Lessons (N)
   ```
   - Reading/writing/speaking/listening lessons grouped by topic
   - Cascade delete or orphan based on business rules

---

## State Transitions

### Topic Lifecycle

```
[Draft] ──(publish)──> [Published] ──(unpublish)──> [Draft]
   │                         │
   └──(delete)──> [Deleted]  │
                             └──(archive)──> [Archived]
```

**States**:
1. **Draft** (`is_published = false`): Topic created but not visible to students
2. **Published** (`is_published = true`): Topic visible to students
3. **Archived** (Future): Topic hidden but preserved for historical data
4. **Deleted** (Soft delete, future): Topic marked deleted but not removed from database

**Transitions** (Current MVP):
- Create → Draft (default)
- Draft → Published (admin action, future)
- Published → Draft (admin action, future)

---

## Data Seeding

### Sample Topics for Development

```sql
INSERT INTO topics (name, slug, icon, description, level, word_count, display_order, is_published, color_theme) VALUES
('Food & Dining', 'food-dining', '🍕', 'Learn essential vocabulary for restaurants, ordering food, and dining experiences. Perfect for travelers and food enthusiasts.', 'beginner', 120, 1, true, '#FF5733'),
('Travel & Tourism', 'travel-tourism', '✈️', 'Essential phrases and vocabulary for airports, hotels, directions, and tourist attractions worldwide.', 'beginner', 150, 2, true, '#3498DB'),
('Business Communication', 'business-communication', '💼', 'Professional vocabulary for meetings, emails, presentations, and workplace interactions.', 'intermediate', 200, 3, true, '#2ECC71'),
('Technology & Computing', 'technology-computing', '💻', 'Modern tech vocabulary covering software, hardware, internet, and digital communication.', 'intermediate', 180, 4, true, '#9B59B6'),
('Health & Medicine', 'health-medicine', '⚕️', 'Medical terminology, symptoms, treatments, and healthcare conversations.', 'advanced', 250, 5, true, '#E74C3C'),
('Education & Learning', 'education-learning', '📚', 'Academic vocabulary for classrooms, studying, exams, and educational discussions.', 'beginner', 100, 6, true, '#F39C12'),
('Daily Conversation', 'daily-conversation', '💬', 'Common phrases for everyday social interactions, greetings, and casual conversations.', 'beginner', 90, 7, true, '#1ABC9C'),
('Home & Family', 'home-family', '🏠', 'Vocabulary for household items, family relationships, and domestic activities.', 'beginner', 110, 8, true, '#E67E22'),
('Sports & Fitness', 'sports-fitness', '⚽', 'Athletic terminology, exercise vocabulary, and sports-related conversations.', 'intermediate', 140, 9, true, '#16A085'),
('Arts & Entertainment', 'arts-entertainment', '🎭', 'Cultural vocabulary for movies, music, theater, museums, and creative arts.', 'intermediate', 160, 10, true, '#8E44AD');
```

---

## Migration Strategy

### Initial Migration (create-topics-table)

**MikroORM CLI Command**:
```bash
# Generate migration from entity changes
npm run migration:create

# Apply migration
npm run migration:up
```

**Filename**: `migrations/Migration20251118000000_create_topics_table.ts`

**Up Migration**:
```typescript
import { Migration } from '@mikro-orm/migrations';

export class Migration20251118000000_create_topics_table extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE topics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        slug VARCHAR(60) NOT NULL UNIQUE,
        icon VARCHAR(10) NOT NULL,
        description VARCHAR(300) NOT NULL,
        level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
        word_count INTEGER NOT NULL DEFAULT 0 CHECK (word_count >= 0),
        display_order INTEGER NOT NULL DEFAULT 999,
        is_published BOOLEAN NOT NULL DEFAULT false,
        color_theme VARCHAR(7),
        related_skills TEXT[],
        recommended_for TEXT[],
        estimated_hours DECIMAL(4,1),
        preview_words TEXT[],
        banner_image_url VARCHAR(500),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(`CREATE INDEX idx_topics_published ON topics(is_published);`);
    this.addSql(`CREATE INDEX idx_topics_level ON topics(level);`);
    this.addSql(`CREATE INDEX idx_topics_display_order ON topics(display_order);`);
    this.addSql(`CREATE INDEX idx_topics_created_at ON topics(created_at DESC);`);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS topics CASCADE;`);
  }
}
```

### Seed Data (Using MikroORM Seeder)

**Filename**: `seeders/TopicSeeder.ts`

**Seeder Implementation**:
```typescript
import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Topic } from '../entities/topic.entity';

export class TopicSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const topics = [
      {
        name: 'Food & Dining',
        slug: 'food-dining',
        icon: '🍕',
        description: 'Learn essential vocabulary for restaurants, ordering food, and dining experiences. Perfect for travelers and food enthusiasts.',
        level: 'beginner' as const,
        wordCount: 120,
        displayOrder: 1,
        isPublished: true,
        colorTheme: '#FF5733',
      },
      // ... additional topics
    ];

    for (const topicData of topics) {
      const topic = em.create(Topic, topicData);
      em.persist(topic);
    }

    await em.flush();
  }
}
```

**Run Seeder**:
```bash
# Run all seeders
npx mikro-orm seeder:run

# Run specific seeder
npx mikro-orm seeder:run --class TopicSeeder
```

---

## Data Constraints Summary

| Constraint Type | Details |
|----------------|---------|
| **Primary Key** | `id` (UUID) |
| **Unique Constraints** | `name`, `slug` |
| **Not Null** | `name`, `slug`, `icon`, `description`, `level`, `word_count`, `display_order`, `is_published`, `created_at`, `updated_at` |
| **Check Constraints** | `level` IN ('beginner', 'intermediate', 'advanced'), `word_count` >= 0 |
| **Indexes** | `is_published`, `level`, `display_order`, `created_at` |
| **Default Values** | `word_count` = 0, `display_order` = 999, `is_published` = false |

---

## Query Patterns

### Common Queries

**Get All Published Topics (Ordered)**:
```sql
SELECT * FROM topics
WHERE is_published = true
ORDER BY display_order ASC, name ASC;
```

**Get Topics by Level**:
```sql
SELECT * FROM topics
WHERE is_published = true AND level = 'beginner'
ORDER BY display_order ASC, name ASC;
```

**Search Topics by Name or Description**:
```sql
SELECT * FROM topics
WHERE is_published = true
  AND (name ILIKE '%food%' OR description ILIKE '%food%')
ORDER BY display_order ASC, name ASC;
```

**Get Topic by Slug**:
```sql
SELECT * FROM topics
WHERE slug = 'food-dining' AND is_published = true;
```

---

## Performance Considerations

### Index Usage

- `idx_topics_published`: Used in all student queries (`WHERE is_published = true`)
- `idx_topics_level`: Supports future backend filtering by level
- `idx_topics_display_order`: Optimizes default sorting
- `idx_topics_created_at`: Supports "newest first" sorting (future feature)

### Estimated Row Count

- **MVP**: 10-50 topics
- **Phase 2**: 50-200 topics
- **Scale Target**: Up to 1,000 topics

With proper indexes, all queries should execute in < 10ms even at scale.

---

## Future Extensions

### Planned Enhancements

1. **Categories/Tags**:
   ```sql
   CREATE TABLE topic_categories (
     topic_id UUID REFERENCES topics(id),
     category_name VARCHAR(50),
     PRIMARY KEY (topic_id, category_name)
   );
   ```

2. **Soft Delete**:
   ```sql
   ALTER TABLE topics ADD COLUMN deleted_at TIMESTAMP NULL;
   CREATE INDEX idx_topics_deleted_at ON topics(deleted_at);
   ```

3. **Popularity Metrics**:
   ```sql
   ALTER TABLE topics ADD COLUMN view_count INTEGER DEFAULT 0;
   ALTER TABLE topics ADD COLUMN completion_count INTEGER DEFAULT 0;
   ```

4. **Localization**:
   ```sql
   CREATE TABLE topic_translations (
     topic_id UUID REFERENCES topics(id),
     language_code VARCHAR(5),
     name VARCHAR(50),
     description VARCHAR(300),
     PRIMARY KEY (topic_id, language_code)
   );
   ```

---

**End of Data Model Document**

