# Database Schema - Dictionary & Vocabulary Learning System

## Overview

### Purpose

This database powers a dictionary-based vocabulary learning system where users:
1. **Search for words** and receive authoritative dictionary definitions
2. **Select specific word senses** (meanings) to learn
3. **Organize senses into topics** (similar to Anki decks)
4. **Personalize their learning** with custom notes, examples, and pronunciations

The database is designed around a fundamental separation:

- **Dictionary Data** - Global, shared, immutable content from external APIs
- **Learning Data** - User-specific topics, progress, and customizations

### High-Level Data Separation

```
┌──────────────────────────────────────────────────────────┐
│         DICTIONARY CORE (Global, Immutable)              │
│                                                           │
│  - words                                                 │
│  - pronunciations                                        │
│  - word_senses ⭐ (atomic learning unit)                │
│  - word_cache (raw API responses)                       │
│                                                           │
│  Characteristics:                                        │
│  ✓ Shared across all users and tenants                  │
│  ✓ Read-only for users                                  │
│  ✓ Populated from external dictionary APIs              │
└──────────────────────────────────────────────────────────┘
                          │
                          │ Referenced by
                          ▼
┌──────────────────────────────────────────────────────────┐
│         LEARNING CORE (User-Specific, Mutable)           │
│                                                           │
│  - topics (user collections)                             │
│  - topic_senses (sense → topic mapping)                 │
│  - user_sense_progress (review history)                 │
│                                                           │
│  Characteristics:                                        │
│  ✓ Owned by individual users                            │
│  ✓ Tenant-scoped in multi-tenant deployments            │
│  ✓ References dictionary data via foreign keys          │
└─────┌─────────────────────────────────────────────────────┐
│ STEP 3: Call External API (via Provider)            │
│ Adapter fetches data (e.g., Oxford, Provider)  │
└─────────────────────────────────────────────────────┘─────┐
│    USER CUSTOMIZATION LAYER (Overlay Model)              │
│                                                           │
│  - user_word_sense_definitions                           │
│  - user_word_sense_examples                              │
│  - user_pronunciation_notes                              │
│  - (stored in topic_senses + separate tables)            │
│                                                           │
│  Characteristics:                                        │
│  ✓ Personal customizations layered on dictionary data   │
│  ✓ Does NOT modify original dictionary content          │
│  ✓ Always preserves authoritative source                │
└──────────────────────────────────────────────────────────┘
```

**Key Principle**: Dictionary data is the **authoritative source**. User customizations are **overlays** that enhance but never replace the original content.

---

## Dictionary Core Tables

### Table: `words`

**Purpose**: Store unique word headwords (lexical entries) that serve as containers for senses and pronunciations.

**Ownership**: Global, shared across all users and tenants

**Key Fields**:
- `id` - Primary key (UUID)
- `text` - Original casing from API (e.g., "Hello")
- `normalized_text` - Lowercase for lookups (e.g., "hello")
- `language` - ISO language code (e.g., "en", "fr")

**Relationships**:
- One word → Many pronunciations
- One word → Many word senses

**Constraints**:
- **Unique**: `(normalized_text, language)` - Ensures one entry per word per language
- **Index**: `normalized_text` for fast case-insensitive lookups

**Immutability**: Users cannot modify word entries. Updates only occur when re-fetching from dictionary APIs.

**Design Notes**:
- `text` preserves original API casing for display
- `normalized_text` enables case-insensitive searches
- No `user_id` or `tenant_id` - this is global data
- Acts as a lightweight container; not the learning unit

---

### Table: `pronunciations`

**Purpose**: Store phonetic information (IPA, audio URLs) for words.

**Ownership**: Global, shared

**Key Fields**:
- `id` - Primary key (UUID)
- `word_id` - Foreign key → `words(id)`
- `ipa` - IPA notation (e.g., "/həˈloʊ/")
- `audio_url` - Link to pronunciation audio file
- `region` - Dialect variant (e.g., "US", "UK", "AU")

**Relationships**:
- Many pronunciations → One word
- **Not** linked to word senses (pronunciation is word-level)

**Constraints**:
- **Foreign Key**: `word_id` with cascading delete
- **Index**: `word_id` for fast lookup of all pronunciations for a word

**Immutability**: Read-only for users. Populated from API.

**Design Notes**:
- **Word-level, not sense-level**: "bank" sounds the same whether it means "financial institution" or "river edge"
- Multiple pronunciations per word support regional variants
- **Exception case**: Homographs with different pronunciations (e.g., "read" /riːd/ vs. /rɛd/) would require linking to senses (future enhancement)

---

### Table: `word_senses`

**Purpose**: Store individual word meanings/definitions. **This is the atomic learning unit.**

**Ownership**: Global, shared

**Key Fields**:
- `id` - Primary key (UUID)
- `word_id` - Foreign key → `words(id)`
- `part_of_speech` - "noun", "verb", "adjective", etc.
- `definition` - Complete dictionary definition
- `short_definition` - Optional condensed form (< 100 chars) for flashcards
- `examples` - Array of example sentences (JSONB)
- `synonyms` - Array of synonym words (JSONB)
- `antonyms` - Array of antonym words (JSONB)
- `sense_index` - Order within the same part of speech (0-based)
- `source` - Dictionary API provider (e.g., "dictionaryapi.dev")

**Relationships**:
- Many word senses → One word
- Referenced by `topic_senses` (user learning)
- Referenced by `user_word_sense_definitions` (customizations)

**Constraints**:
- **Unique**: `(word_id, part_of_speech, sense_index, source)` - Prevents duplicate senses
- **Index**: `word_id` for loading all senses of a word
- **Index**: `part_of_speech` for filtering
- **GIN Index**: `examples`, `synonyms` for array search

**Immutability**: Users cannot edit definitions, examples, or synonyms. This preserves dictionary integrity.

**Design Notes**:
- **Each sense is a separate record** - Enables referential integrity with topics
- `sense_index` preserves API ordering (common meanings first)
- **Why separate records?** 
  - Topics link to specific senses (not entire words)
  - Review tracking per sense (for future SRS)
  - Queryable (filter by POS, search examples)

---

### Table: `word_cache`

**Purpose**: Store raw, unmodified dictionary API responses to minimize external API calls.

**Ownership**: Global, shared

**Key Fields**:
- `id` - Primary key (UUID)
- `word` - Searched word (lowercase)
- `language` - Language code
- `source` - API provider (e.g., "dictionaryapi.dev")
- `raw` - Complete API response (JSONB)
- `expires_at` - Cache expiration timestamp (TTL: 30 days default)

**Relationships**:
- Standalone table (does not reference other tables)
- Used only for cache-aside pattern

**Constraints**:
- **Unique**: `(word, language, source)` - One cache entry per word/source
- **Index**: `expires_at` for cleanup queries

**Immutability**: Entries are replaced (upserted) when re-fetched. Not user-modifiable.

**Design Notes**:
- **Why JSONB?** Preserves complete API structure without parsing
- **Why separate from normalized data?**
  - Fast writes (no normalization overhead)
  - Traceability (original response preserved)
  - Reprocessing capability (can re-normalize if schema changes)
- **Not used directly by UI** - Only for populating `words`, `pronunciations`, `word_senses`

---

## Learning & User Tables

### Table: `users`

**Purpose**: Store user accounts and authentication data.

**Ownership**: User-specific, tenant-scoped

**Key Fields**:
- `id` - Primary key (UUID)
- `tenant_id` - Foreign key → `tenants(id)`
- `name` - Display name
- `role` - "USER" | "ADMIN"

**Relationships**:
- Many users → One tenant
- One user → Many topics

**Constraints**:
- **Foreign Key**: `tenant_id` with cascading delete
- **Index**: `tenant_id` for tenant isolation queries

---

### Table: `topics`

**Purpose**: User-created collections of word senses (similar to Anki decks).

**Ownership**: User-specific, tenant-scoped

**Key Fields**:
- `id` - Primary key (UUID)
- `user_id` - Foreign key → `users(id)`
- `tenant_id` - Foreign key → `tenants(id)`
- `name` - Topic title (e.g., "Business English")
- `description` - Optional long description
- `category` - "Vocabulary", "Grammar", "Idioms", etc.
- `tags` - Freeform tags (JSONB array)
- `language_pair` - "en-vi", "en-es", etc.
- `is_public` - Whether topic is shared publicly
- `sense_count` - Denormalized count of senses in topic

**Relationships**:
- Many topics → One user
- One topic → Many topic_senses

**Constraints**:
- **Foreign Key**: `user_id`, `tenant_id`
- **Index**: `user_id` for user's topic list
- **Index**: `tenant_id` for tenant isolation
- **Index**: `is_public` for public topic discovery

**Design Notes**:
- Topics contain **word senses**, not words
- `sense_count` is denormalized for performance (updated on add/remove)
- Users might add "bank (financial institution)" to "Business English" while ignoring "bank (river edge)"

---

### Table: `topic_senses`

**Purpose**: Many-to-many relationship between topics and word senses. **This is where learning happens.**

**Ownership**: User-specific (via topic ownership), tenant-scoped

**Key Fields**:
- `id` - Primary key (UUID)
- `topic_id` - Foreign key → `topics(id)`
- `sense_id` - Foreign key → `word_senses(id)` (DICTIONARY DATA)
- `order_index` - Custom ordering within topic
- `personal_note` - User's mnemonic or note
- `difficulty` - User-rated difficulty (1-5)
- `review_count` - Number of times reviewed
- `last_reviewed_at` - Timestamp of last review
- `added_at` - When sense was added to topic

**Relationships**:
- Many topic_senses → One topic
- Many topic_senses → One word_sense (references dictionary)

**Constraints**:
- **Unique**: `(topic_id, sense_id)` - No duplicate senses in a topic
- **Foreign Key**: `topic_id` cascades delete (remove sense if topic deleted)
- **Foreign Key**: `sense_id` cascades delete (remove mapping if sense deleted)
- **Index**: `topic_id, order_index` for ordered topic view
- **Index**: `sense_id` for reverse lookup (which topics contain this sense)

**Design Notes**:
- **Bridge between user and dictionary**: Links user's learning to global data
- `personal_note` is the simplest form of user customization
- Review metadata (`review_count`, `last_reviewed_at`) supports future SRS
- Deleting a topic does NOT delete the word sense (dictionary data preserved)

---

### Table: `user_sense_progress` (Future)

**Purpose**: Track detailed learning progress for Spaced Repetition System (SRS).

**Ownership**: User-specific

**Key Fields**:
- `id` - Primary key (UUID)
- `user_id` - Foreign key → `users(id)`
- `sense_id` - Foreign key → `word_senses(id)`
- `easiness_factor` - SM-2 algorithm parameter (default: 2.5)
- `interval` - Days until next review
- `repetitions` - Number of successful reviews
- `next_review_at` - Scheduled review date
- `quality_history` - Array of quality ratings (JSONB)

**Relationships**:
- Many progress records → One user
- Many progress records → One word_sense

**Constraints**:
- **Unique**: `(user_id, sense_id)` - One progress record per user per sense

**Design Notes**:
- Not yet implemented, but schema is designed to support it
- Separate from `topic_senses` because:
  - Progress is user-global (across all topics containing the sense)
  - Same sense in multiple topics should share progress

---

## User Customization Tables

### Overlay Model Philosophy

Users can **personalize** their learning experience by adding custom content **on top of** dictionary data. This is achieved through separate tables that:

1. Reference dictionary senses via foreign keys
2. Store user-specific customizations
3. **Never modify** the original dictionary data

When displaying a sense to a user, the system:
1. Loads the dictionary sense (authoritative)
2. Loads user customizations (if any)
3. Merges for display (dictionary + overlay)

---

### Table: `user_word_sense_definitions`

**Purpose**: Store user-written custom definitions that overlay dictionary definitions.

**Ownership**: User-specific

**Key Fields**:
- `id` - Primary key (UUID)
- `user_id` - Foreign key → `users(id)`
- `sense_id` - Foreign key → `word_senses(id)`
- `custom_definition` - User's own definition
- `is_replacing` - If true, hide dictionary definition; if false, show both

**Relationships**:
- Many custom definitions → One user
- Many custom definitions → One word_sense

**Constraints**:
- **Unique**: `(user_id, sense_id)` - One custom definition per user per sense
- **Foreign Key**: `sense_id` references dictionary (no cascade delete - preserve user data)

**Design Notes**:
- **Does NOT modify** `word_senses.definition`
- UI shows dictionary definition + custom definition side-by-side
- User can toggle between views

---

### Table: `user_word_sense_examples`

**Purpose**: Store user-created example sentences that supplement dictionary examples.

**Ownership**: User-specific

**Key Fields**:
- `id` - Primary key (UUID)
- `user_id` - Foreign key → `users(id)`
- `sense_id` - Foreign key → `word_senses(id)`
- `example_text` - User's custom example sentence
- `context` - Optional context (e.g., "from meeting notes")

**Relationships**:
- Many custom examples → One user
- Many custom examples → One word_sense

**Constraints**:
- **Index**: `(user_id, sense_id)` for loading all examples for a sense

**Design Notes**:
- **Does NOT modify** `word_senses.examples`
- UI shows dictionary examples + user examples in separate sections
- Users can add unlimited examples

---

### Table: `user_pronunciation_notes`

**Purpose**: Store user-specific pronunciation notes or audio recordings.

**Ownership**: User-specific

**Key Fields**:
- `id` - Primary key (UUID)
- `user_id` - Foreign key → `users(id)`
- `word_id` - Foreign key → `words(id)` (word-level, not sense-level)
- `custom_ipa` - User's custom IPA notation
- `audio_url` - User's recorded audio file (uploaded to storage)
- `note` - Textual pronunciation tip (e.g., "stress on first syllable")

**Relationships**:
- Many pronunciation notes → One user
- Many pronunciation notes → One word

**Constraints**:
- **Unique**: `(user_id, word_id)` - One custom pronunciation per user per word

**Design Notes**:
- **Does NOT modify** `pronunciations` table
- Linked to `words`, not `word_senses` (pronunciation is word-level)
- Audio files stored externally (S3, CDN); only URL stored in DB

---

## Relationships & Cardinality

### Dictionary Core Relationships

```
words (1) ──< pronunciations (N)
words (1) ──< word_senses (N)

(word_cache is standalone, no relationships)
```

**Interpretation**:
- One word has multiple pronunciations (regional variants)
- One word has multiple senses (different meanings)

---

### Learning Core Relationships

```
users (1) ──< topics (N)
topics (1) ──< topic_senses (N)
word_senses (1) ──< topic_senses (N)
```

**Interpretation**:
- One user owns multiple topics
- One topic contains multiple topic_senses
- One word_sense can appear in multiple topics (many-to-many via topic_senses)

**Critical Link**: `topic_senses.sense_id` → `word_senses.id` bridges user learning to dictionary

---

### User Customization Relationships

```
users (1) ──< user_word_sense_definitions (N)
users (1) ──< user_word_sense_examples (N)
users (1) ──< user_pronunciation_notes (N)

word_senses (1) ──< user_word_sense_definitions (N)
word_senses (1) ──< user_word_sense_examples (N)
words (1) ──< user_pronunciation_notes (N)
```

**Interpretation**: Each user can create multiple customizations per sense/word

---

## Indexing & Constraints Strategy

### Lookup Performance Indexes

**Hot Path**: Word lookup (most frequent operation)

```
1. words (normalized_text, language) [UNIQUE]
2. word_senses (word_id) [INDEX]
3. pronunciations (word_id) [INDEX]
```

**Expected Performance**: < 20ms for complete word lookup (with all senses)

---

### Cache Safety Indexes

```
word_cache (word, language, source) [UNIQUE]
word_cache (expires_at) [INDEX for cleanup]
```

**Purpose**: Prevent duplicate cache entries, enable efficient expiration cleanup

---

### User Data Isolation Indexes

```
topics (user_id) [INDEX]
topics (tenant_id) [INDEX]
topic_senses (topic_id, order_index) [INDEX]
```

**Purpose**: Fast filtering by user/tenant, ordered topic browsing

---

### Uniqueness Guarantees

| Table | Constraint | Purpose |
|-------|-----------|---------|
| `words` | `(normalized_text, language)` | One word per language |
| `word_senses` | `(word_id, part_of_speech, sense_index, source)` | Unique sense ordering |
| `word_cache` | `(word, language, source)` | One cache per source |
| `topic_senses` | `(topic_id, sense_id)` | No duplicate senses in topic |
| `user_word_sense_definitions` | `(user_id, sense_id)` | One custom def per user |

---

## Multi-Tenant Considerations

### Tenant-Scoped Tables

**User-specific data** (isolated per tenant):
- `users` - Has `tenant_id`
- `topics` - Has `tenant_id`
- `topic_senses` - Inherits via `topics.tenant_id`
- All user customization tables - Inherits via `users.tenant_id`

**Isolation Mechanism**: All queries for these tables MUST filter by `tenant_id`

---

### Global Tables

**Dictionary data** (shared across all tenants):
- `words`
- `pronunciations`
- `word_senses`
- `word_cache`

**No `tenant_id` field**. All tenants see the same dictionary data.

---

### Hybrid Architecture Benefits

✅ **Efficiency**: "hello" is stored once, not 1000 times  
✅ **Cost**: One API call benefits all tenants  
✅ **Faster onboarding**: New tenants get pre-cached data  
✅ **Privacy**: Learning data (`topics`, customizations) is isolated  

---

## Design Decisions & Trade-offs

### 1. Why Dictionary Data Has No `user_id`

**Decision**: `words`, `word_senses`, `pronunciations` are global.

**Rationale**:
- Dictionary definitions are **authoritative sources**, not user-generated content
- "hello" means the same thing for all users
- Massive efficiency gain (no duplication)
- Reduces storage and API costs

**Trade-off**:
- ❌ Users cannot edit dictionary content
- ✅ Acceptable - users can add custom definitions via overlay tables

---

### 2. Why Word Sense Is the Learning Unit

**Decision**: Users add **word senses** (not words) to topics.

**Rationale**:
- Prevents ambiguity (learning "bank" = ?? vs. "bank = financial institution")
- Enables precise flashcards (one meaning per card)
- Supports context-aware learning

**Alternative Considered**: Users add entire words
- ❌ Confusing when reviewing (which meaning should I recall?)
- ❌ Inefficient (learning meanings I don't need)

---

### 3. Why Raw API Data Is Stored

**Decision**: `word_cache` stores unmodified JSONB responses.

**Rationale**:
- **Fast writes**: No parsing overhead
- **Traceability**: Original API response preserved for debugging
- **Reprocessing**: Can re-normalize if schema changes
- **Source flexibility**: Different APIs have different formats

**Trade-off**:
- ❌ Storage overhead (raw + normalized data)
- ✅ Worth it for operational benefits

---

### 4. Why Separate Customization Tables

**Decision**: User customizations in separate tables (not columns in `word_senses`).

**Rationale**:
- **Data integrity**: Dictionary data remains immutable
- **Flexibility**: Users can toggle between dictionary and custom views
- **Scalability**: Most users don't customize; no wasted columns

**Alternative Considered**: `word_senses.user_definition`
- ❌ Requires duplicating entire `word_senses` table per user
- ❌ Loses authoritative source

---

### 5. Denormalization: `topics.sense_count`

**Decision**: Store count directly instead of computing via `COUNT(*)`.

**Rationale**:
- **Performance**: Topic list display is frequent
- **Simplicity**: Avoid expensive aggregation queries

**Trade-off**:
- ❌ Risk of inconsistency if update fails
- ✅ Mitigated by transactional updates
- ✅ Can validate via periodic integrity checks

---

## Future Extensions

### SRS Tables (Spaced Repetition System)

**New Table**: `review_history`

**Purpose**: Track individual review sessions for analytics.

**Key Fields**:
- `user_id`, `sense_id`, `reviewed_at`
- `quality` - Rating (0-5, SuperMemo 2 algorithm)
- `time_spent_seconds` - Time to recall

**Relationships**: Links to `user_sense_progress` for algorithm updates

---

### Analytics Tables

**New Table**: `daily_learning_stats`

**Purpose**: Pre-aggregated daily progress for dashboards.

**Key Fields**:
- `user_id`, `date`
- `senses_reviewed`, `new_senses_added`
- `average_quality`, `time_spent_minutes`

**Materialization**: Populated via daily cron job

---

### Event Sourcing (Optional)

**New Table**: `domain_events`

**Purpose**: Record all state changes as events for auditability.

**Key Fields**:
- `event_type` - "SenseAddedToTopic", "CustomDefinitionCreated", etc.
- `aggregate_id` - Entity that changed
- `payload` - Event data (JSONB)
- `occurred_at` - Timestamp

**Use Cases**:
- Rebuild state from events
- Analytics and ML training
- Multi-tenant data migration

---

## Summary

This database schema is built on a clear separation:

1. **Dictionary Core** (Global, Immutable)
   - Authoritative content from APIs
   - Shared across all users
   - `words`, `word_senses`, `pronunciations`, `word_cache`

2. **Learning Core** (User-Specific, Mutable)
   - User-created topics and learning progress
   - References dictionary via foreign keys
   - `topics`, `topic_senses`, `user_sense_progress`

3. **User Customization** (Overlay Model)
   - Personal notes, examples, pronunciations
   - Layered on top of dictionary data
   - Never modifies authoritative source

**Key Architectural Principles**:
- ✅ Word **sense** (not word) is the atomic learning unit
- ✅ Dictionary data has no `user_id` or `tenant_id`
- ✅ Raw API responses preserved for traceability
- ✅ User customizations stored separately via overlay model

This design enables:
- Fast lookups (< 20ms)
- Multi-tenant efficiency (shared dictionary)
- Data integrity (immutable source)
- Flexible personalization (overlay customizations)
- Future extensibility (SRS, analytics, events)
