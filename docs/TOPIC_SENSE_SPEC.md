# TopicSense Technical Specification

## 1. Introduction

### Purpose
Cho phép user thêm từ vựng từ dictionary vào topic cá nhân mà không duplicate data, đồng thời hỗ trợ customizations và SRS tracking.

### Scope
- Tạo TopicSenseEntity cho dictionary-linked words
- Giữ UserWordSenseEntity cho custom words
- API endpoints cho CRUD và SRS review

---

## 2. Entity Design

### 2.1 TopicSenseEntity

```typescript
@Entity({ tableName: 'topic_senses' })
@Unique({ properties: ['topic', 'wordSense'] })
export class TopicSenseEntity extends BaseEntity {
  // === References ===
  @ManyToOne(() => TopicEntity, { onDelete: 'cascade' })
  @Index()
  topic: TopicEntity;

  @ManyToOne(() => WordSenseEntity)
  @Index()
  wordSense: WordSenseEntity;

  // === User Customizations ===
  @Property({ type: 'text', nullable: true })
  personalNote?: string;

  @Property({ type: JsonType, nullable: true })
  personalExamples?: string[];

  @Property({ fieldName: 'definition_vi', type: 'text', nullable: true })
  definitionVi?: string;

  @Property({ type: JsonType, nullable: true })
  customImages?: string[];

  @Property({ fieldName: 'difficulty_rating', nullable: true })
  difficultyRating?: number; // 1-5

  @Property({ type: JsonType, nullable: true })
  tags?: string[];

  @Property({ fieldName: 'order_index', default: 0 })
  orderIndex: number;

  // === SRS Metadata ===
  @Enum({ items: () => LearningStatus, fieldName: 'learning_status' })
  learningStatus: LearningStatus = LearningStatus.New;

  @Property({ fieldName: 'last_review_at', type: 'date', nullable: true })
  lastReviewAt?: Date;

  @Property({ fieldName: 'review_count', default: 0 })
  reviewCount: number = 0;

  @Property({ fieldName: 'ease_factor', type: 'decimal', default: 2.5 })
  easeFactor: number = 2.5;

  @Property({ fieldName: 'next_review_at', type: 'date', nullable: true })
  nextReviewAt?: Date;
}
```

### 2.2 Relationships

```
┌─────────────────┐      ┌─────────────────┐
│   TopicEntity   │──1:N──│ TopicSenseEntity│
└─────────────────┘      └────────┬────────┘
                                  │
                                  │ N:1
                                  ▼
                         ┌─────────────────┐
                         │ WordSenseEntity │ (Dictionary)
                         └─────────────────┘
```

---

## 3. API Endpoints

### 3.1 Add Sense to Topic

```
POST /api/topics/:topicId/senses
```

**Request Body:**
```json
{
  "wordSenseId": "uuid",
  "personalNote": "optional",
  "definitionVi": "optional"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "wordSense": {
    "id": "uuid",
    "word": { "text": "book" },
    "partOfSpeech": "noun",
    "definition": "a written text..."
  },
  "personalNote": null,
  "learningStatus": "new"
}
```

**Errors:**
- `404` - Topic or WordSense not found
- `409` - Sense already in topic

### 3.2 List Topic Senses

```
GET /api/topics/:topicId/senses?status=learning&page=1&limit=20
```

**Response:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### 3.3 Update Customization

```
PATCH /api/topics/:topicId/senses/:id
```

**Request Body:**
```json
{
  "personalNote": "Nhớ: book ≠ booking",
  "personalExamples": ["Mình mua sách ở Fahasa"],
  "definitionVi": "quyển sách",
  "difficultyRating": 3,
  "tags": ["exam", "important"]
}
```

### 3.4 Remove Sense from Topic

```
DELETE /api/topics/:topicId/senses/:id
```

**Response:** `204 No Content`

### 3.5 Record Review

```
POST /api/topics/:topicId/senses/:id/review
```

**Request Body:**
```json
{
  "quality": 4  // 0-5 scale for SM-2
}
```

**Response:**
```json
{
  "nextReviewAt": "2026-01-10T00:00:00Z",
  "easeFactor": 2.6,
  "reviewCount": 5
}
```

### 3.6 Get Review Queue

```
GET /api/topics/:topicId/review-queue?limit=20
```

**Query:** Senses where `nextReviewAt <= now`

**Response:**
```json
{
  "data": [...],
  "total": 15
}
```

---

## 4. Service Layer

### 4.1 TopicSenseService

```typescript
class TopicSenseService {
  // CRUD
  addSenseToTopic(dto: CreateTopicSenseDto): Promise<TopicSenseEntity>
  getSensesForTopic(topicId: string, filters): Promise<TopicSenseEntity[]>
  updateCustomization(id: string, dto: UpdateTopicSenseDto): Promise<TopicSenseEntity>
  removeSenseFromTopic(id: string): Promise<void>

  // SRS
  getReviewQueue(topicId: string): Promise<TopicSenseEntity[]>
  recordReview(id: string, quality: number): Promise<TopicSenseEntity>

  // Batch
  cloneVocabSetToTopic(vocabSetId: string, topicId: string): Promise<TopicSenseEntity[]>
}
```

### 4.2 SM-2 Algorithm Implementation

```typescript
function calculateNextReview(
  current: { easeFactor: number; interval: number; repetitions: number },
  quality: number // 0-5
): { easeFactor: number; interval: number; nextReviewAt: Date } {
  let { easeFactor, interval, repetitions } = current;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    
    repetitions++;
  }

  return {
    easeFactor,
    interval,
    nextReviewAt: addDays(new Date(), interval)
  };
}
```

---

## 5. Data Flow

### 5.1 Adding from Dictionary

```
User → Search "book"
         ↓
    LookupService
         ↓
    WordSenseEntity[]
         ↓
User → Select sense "written text"
         ↓
User → Click "Add to IELTS Topic"
         ↓
    TopicSenseService.addSenseToTopic({
      topicId: "...",
      wordSenseId: "..."
    })
         ↓
    TopicSenseEntity created
    (NO data copied, only reference)
```

### 5.2 Displaying Topic Content

```
User → Open Topic
         ↓
    TopicSenseService.getSensesForTopic(topicId)
         ↓
    Query with JOIN:
    SELECT ts.*, ws.*, w.*
    FROM topic_senses ts
    JOIN word_senses ws ON ts.word_sense_id = ws.id
    JOIN words w ON ws.word_id = w.id
         ↓
    Merge: dictionary data + user customizations
         ↓
    Return to frontend
```

---

## 6. Migration Strategy

### 6.1 Database Migration

```sql
-- Create table
CREATE TABLE topic_senses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  word_sense_id UUID NOT NULL REFERENCES word_senses(id),
  personal_note TEXT,
  personal_examples JSONB,
  definition_vi TEXT,
  custom_images JSONB,
  difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5),
  tags JSONB,
  order_index INT DEFAULT 0,
  learning_status VARCHAR(20) DEFAULT 'new',
  last_review_at TIMESTAMP,
  review_count INT DEFAULT 0,
  ease_factor DECIMAL DEFAULT 2.5,
  next_review_at TIMESTAMP,
  create_at TIMESTAMP DEFAULT NOW(),
  update_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  delete_flag BOOLEAN DEFAULT FALSE,
  UNIQUE(topic_id, word_sense_id)
);

-- Indexes
CREATE INDEX idx_topic_senses_topic ON topic_senses(topic_id);
CREATE INDEX idx_topic_senses_word_sense ON topic_senses(word_sense_id);
CREATE INDEX idx_topic_senses_next_review ON topic_senses(next_review_at);
CREATE INDEX idx_topic_senses_learning_status ON topic_senses(learning_status);
```

### 6.2 Data Migration (Optional)

Nếu muốn migrate existing UserWordSenseEntity có `dictionarySense`:

```typescript
async function migrateUserWordSensesToTopicSenses() {
  const userSenses = await em.find(UserWordSenseEntity, {
    dictionarySense: { $ne: null }
  });

  for (const uws of userSenses) {
    await em.create(TopicSenseEntity, {
      topic: uws.topic,
      wordSense: uws.dictionarySense,
      definitionVi: uws.definitionVi,
      learningStatus: uws.learningStatus,
      lastReviewAt: uws.lastReviewAt,
    });
  }
}
```

---

## 7. Security Considerations

### 7.1 Authorization

- User chỉ có thể CRUD TopicSenseEntity của topics mình sở hữu
- Check: `topic.userId === currentUser.id`

### 7.2 Validation

- `wordSenseId` phải tồn tại trong WordSenseEntity
- `quality` cho review phải trong range 0-5
- `difficultyRating` phải trong range 1-5
