# Dictionary Core - Technical Documentation

## Introduction

The **Dictionary Core** is the foundational module responsible for acquiring, caching, normalizing, and serving dictionary data from external APIs. It forms the bedrock of the vocabulary learning system by providing **authoritative, immutable dictionary content** that users can learn from.

This module is designed around three core principles:

1. **Dictionary data is global and shared** - All users see the same authoritative definitions
2. **Dictionary data is immutable** - Users cannot modify dictionary content
3. **User customizations are layered on top** - Personal notes and examples are stored separately

The Dictionary Core **does not** manage user learning data, topics, or review schedules. Its sole responsibility is to provide **reliable, structured dictionary content** that the Learning Core can reference.

---

## Scope & Responsibilities

### In Scope ✅

**Dictionary Data Acquisition**
- Fetch word definitions from external APIs (dictionaryapi.dev, Oxford, etc.)
- Cache raw API responses for performance and cost optimization
- Normalize diverse API formats into a consistent internal structure

**Dictionary Data Storage**
- Store normalized words, word senses, and pronunciations
- Maintain referential integrity across dictionary entities
- Provide fast, indexed lookups

**Dictionary Data Serving**
- Return structured dictionary data for user queries
- Support search and filtering by part of speech, source, etc.

### Out of Scope ❌

**User Learning Data**
- Topics, flashcards, review schedules → **Learning Core**
- Personal notes, custom examples → **User Customization Module**
- Progress tracking, review history → **Learning Analytics Module**

**Authentication & Authorization**
- User login, tenant isolation → **Auth Module**

**Business Logic**
- Spaced repetition algorithms → **SRS Module**
- Recommendation engine → **AI Module**

---

## Core Domain Concepts

### 1. Word

A **word** is a lexical entry fetched from a dictionary API. It represents the headword or lemma form.

**Examples**: "run", "book", "bank"

**Characteristics**:
- **Text representation**: Original form ("Hello") and normalized form ("hello")
- **Language-specific**: "chat" in English ≠ "chat" in French
- **Container**: Holds pronunciations and word senses
- **Global**: Shared across all users and tenants
- **Immutable**: Cannot be modified by users

**Not a learning unit**: Users do not learn "words" - they learn specific **word senses**.

---

### 2. Word Sense (Atomic Learning Unit)

A **word sense** is a specific meaning or definition of a word. This is the **fundamental unit of learning**.

**Example**: The word "bank" has multiple senses:
- **Sense 1** (noun): "A financial institution that accepts deposits and makes loans"
- **Sense 2** (noun): "The sloping land beside a body of water"
- **Sense 3** (verb): "To tilt an aircraft during a turn"

**Characteristics**:
- **Definition**: Complete explanation from the dictionary API
- **Part of Speech**: noun, verb, adjective, adverb, etc.
- **Examples**: Sample sentences from the dictionary
- **Synonyms/Antonyms**: Related words from the dictionary
- **Sense Index**: Ordering within the same part of speech (0-based)
- **Source**: Which dictionary API provided this sense

**Why senses are atomic**:
- Prevents ambiguity (users learn "bank = financial institution", not "bank = ??")
- Enables precise flashcards (one meaning per card)
- Supports context-aware learning

**Important**: Word senses are **read-only**. Users cannot edit definitions, examples, or synonyms from the dictionary.

---

### 3. Pronunciation

**Pronunciation** data is associated with the **word** itself, not individual senses.

**Components**:
- **IPA notation**: International Phonetic Alphabet (e.g., `/həˈloʊ/`)
- **Audio URL**: Link to pronunciation audio file
- **Region**: Dialect variant (US, UK, AU, etc.)

**Rationale**: "bank" sounds the same regardless of whether it means "financial institution" or "river edge". Pronunciation is a property of the word form, not the meaning.

**Exception**: Homographs with different pronunciations (e.g., "read" /riːd/ vs. /rɛd/) would require linking pronunciation to specific senses (future enhancement).

---

### 4. Topic

A **topic** is a user-created collection of **word senses** (not words). Think of it as an Anki deck or Quizlet set.

**Examples**:
- "Business English - Finance"
- "IELTS 7.0 Vocabulary"
- "Medical Terminology - Cardiology"

**Characteristics**:
- **User-owned**: Each user creates their own topics
- **Tenant-scoped**: In multi-tenant systems, topics are isolated per tenant
- **Sense-based**: Contains references to word senses, not entire words

**Note**: Topics are managed by the **Learning Core**, not the Dictionary Core. Dictionary Core only provides the sense data that topics reference.

---

### 5. User Customization (Overlay Model)

Users can **personalize** their learning by adding custom data **on top of** dictionary senses, without modifying the original dictionary content.

**Customization Types**:

1. **Personal Notes**
   - Mnemonics: "Remember: 'bank' for money, not river!"
   - Translations: "banco (Portuguese)"
   - Context: "Used in yesterday's meeting"

2. **Personal Examples**
   - User-written sentences: "I went to the bank to deposit my paycheck."
   - Real-life usage: "My bank offers free checking."

3. **Custom Pronunciations**
   - Personal IPA notation for dialect variants
   - User audio recordings (own voice)
   - Pronunciation tips: "Silent 'k' in 'know'"

4. **Learning Metadata**
   - Difficulty rating (1-5)
   - Review count
   - Last reviewed timestamp
   - Custom tags ("urgent", "exam-critical")

**Critical Rule**: Customizations are stored **separately** from dictionary data. The original dictionary definition remains unchanged and can always be viewed.

**Data Model**:
```
Dictionary Layer (Global, Immutable)
├── Word: "bank"
├── Sense 1: "A financial institution" [from API]
└── Sense 2: "The land alongside a river" [from API]

User Customization Layer (Personal, Mutable)
└── Topic: "Business English"
    └── Sense 1 (reference) + Customizations
        ├── Personal Note: "Remember: checking vs. savings"
        ├── Personal Example: "My bank appointment is today"
        ├── Difficulty: 2/5
        └── Review Count: 5
```

---

## Dictionary Data Model (Conceptual)

### Overview

The dictionary data model consists of four main entities:

1. **`word_cache`** - Raw API response storage
2. **`words`** - Normalized word entries
3. **`pronunciations`** - Phonetic information
4. **`word_senses`** - Individual meanings (atomic learning units)

### Entity: `word_cache`

**Purpose**: Store raw dictionary API responses to minimize external API calls.

**Characteristics**:
- **JSONB storage**: Preserves complete, unmodified API response
- **Source-specific**: Different APIs have different structures
- **TTL-based expiration**: Default 30 days
- **Tenant-agnostic**: Shared across all users
- **NOT user-facing**: Only used for normalization

**Key Fields**:
- `word` - The searched word (lowercase)
- `language` - Language code (e.g., "en")
- `source` - API provider (e.g., "dictionaryapi.dev")
- `raw` - Complete API response as JSONB
- `expires_at` - Cache expiration timestamp

**Unique Constraint**: One cache entry per `(word, language, source)` combination

**Why separate cache?**
- **Fast writes**: Save API response immediately without parsing
- **Traceability**: Preserve original data for debugging
- **Reprocessing**: Can re-normalize if data model changes
- **Flexibility**: Different sources have different formats

---

### Entity: `words`

**Purpose**: Store unique word headwords (lexical entries).

**Characteristics**:
- **Minimal fields**: Only word text and language
- **Normalized form**: Lowercase for case-insensitive lookups
- **Global**: Shared across all users and tenants
- **Immutable**: Cannot be modified by users

**Key Fields**:
- `text` - Original casing (e.g., "Hello")
- `normalized_text` - Lowercase (e.g., "hello")
- `language` - Language code

**Unique Constraint**: One word per `(normalized_text, language)` combination

**Relationships**:
- One word → Many pronunciations
- One word → Many word senses

**Role**: Container for pronunciations and senses. Not a learning unit.

---

### Entity: `pronunciations`

**Purpose**: Store phonetic information for words.

**Characteristics**:
- **Word-level**: Linked to word, not sense
- **Multiple per word**: US, UK, AU variants
- **Optional fields**: Not all words have IPA or audio

**Key Fields**:
- `word_id` - Foreign key to `words`
- `ipa` - IPA notation (e.g., "/həˈloʊ/")
- `audio_url` - Link to pronunciation audio
- `region` - Dialect (e.g., "US", "UK")

**Relationships**:
- Many pronunciations → One word

**Why word-level?**
- Pronunciation is a property of the word form
- Same audio applies to all senses
- Reduces duplication

---

### Entity: `word_senses`

**Purpose**: Store individual word meanings. **This is the core learning entity.**

**Characteristics**:
- **Sense-level granularity**: Each meaning is a separate record
- **Global**: Shared across users
- **Immutable**: Cannot be modified by users
- **Referenced by topics**: Learning happens via references

**Key Fields**:
- `word_id` - Foreign key to `words`
- `part_of_speech` - "noun", "verb", "adjective", etc.
- `definition` - Complete dictionary definition
- `short_definition` - Optional condensed form for flashcards
- `examples` - Array of example sentences (JSONB)
- `synonyms` - Array of synonym words (JSONB)
- `antonyms` - Array of antonym words (JSONB)
- `sense_index` - Order within same part of speech (0-based)
- `source` - Dictionary API source

**Unique Constraint**: One sense per `(word_id, part_of_speech, sense_index, source)` combination

**Relationships**:
- Many word senses → One word
- Word senses ← Referenced by topic_senses (in Learning Core)

**Why separate records for each sense?**
- **Referential integrity**: Topics can link to specific meanings
- **Queryability**: Filter by part of speech, search examples
- **Review tracking**: Future SRS tracks progress per sense
- **No ambiguity**: One sense = one learning unit

---

## Dictionary Architecture & Flow

### Key Components

The Dictionary Core implementation follows a **Factory-Adapter Pattern** to ensure extensibility and separation of concerns:

1.  **`LookupService`**: The orchestrator. Types together caching, normalization, and persistence. It does NOT know about specific dictionary APIs.
2.  **`DictionaryProviderFactory`**: Responsible for selecting the correct provider strategy based on the source (e.g., "oxford", "wiki").
3.  **`DictionaryProvider` (Interface)**: Defines the contract that all external dictionary adapters must implement.
    -   `fetchRaw(word)`: Returns the unmodified JSON response from the external API.
4.  **`DictionaryNormalizer`**: A pure service that transforms raw API data into our standardized `NormalizedData` structure.
5.  **`UnitOfWork` & Repositories**: Handles transactional persistence of normalized entities (`WordEntity`, `WordSenseEntity`, etc.).

### Word Lookup Flow (Detailed)

When a user requests a definition for the word *"hello"*:

1.  **Level 1 Cache (Normalized DB)**:
    -   The service checks the `words` table for `normalizedText="hello"` (and language="en").
    -   **Hit**: Returns the fully populated `WordEntity` (with senses and pronunciations).
    -   **Miss**: Proceeds to Extenal API.

2.  **External API Fetch (Adapter)**:
    -   `DictionaryProviderFactory` selects the appropriate provider (e.g., `OxfordProvider`).
    -   `provider.fetchRaw("hello")` is called.
    -   The provider calls the external API and returns the raw JSON response.
    -   **Action**: The raw response is immediately upserted into `word_cache` (archival/backup).

3.  **Normalization**:
    -   `DictionaryNormalizer` processes the raw JSON.
    -   It extracts:
        -   **Headword**: `text`, `normalizedText`.
        -   **Pronunciations**: IPA, `audioUrl`, region (inferring region from URL/tags).
        -   **Senses**: `definition`, `partOfSpeech`, `shortDefinition`, `examples`, `synonyms`.

4.  **Persistence (Transactional)**:
    -   A transaction is started.
    -   `WordEntity` is created/updated.
    -   `PronunciationEntity` records are inserted.
    -   `WordSenseEntity` records are inserted (Atomic Learning Units).
    -   Transaction commits.

5.  **Return**:
    -   The newly persisted `WordEntity` is returned to the controller.

### Multi-Source Strategy

The system is designed to support multiple dictionary sources (Oxford, Wiktionary, Cambridge, etc.) concurrently.

-   **Source Selection**: The client can specify a preferred `source` (default: 'oxford').
-   **Fallback**: (Future) If the primary source fails or returns 404, the Factory can try a fallback provider.
-   **Extensibility**: Adding a new source requires:
    1.  Creating a new Provider implementing `DictionaryProvider`.
    2.  Registering it in `DictionaryProviderFactory`.
    3.  Updates to `DictionaryNormalizer` to handle the new JSON structure.

### Caching & Data Model

-   **`word_cache`**: Stores `raw` (JSONB). Acts as a buffer and backup.
-   **Normalized Tables** (`words`, `word_senses`): Optimized for querying and referencing.
    -   **Field Naming**: Application layer uses `camelCase` (e.g., `normalizedText`, `partOfSpeech`), mapped to `snake_case` database columns.
    -   **Immutability**: Normalized data is overwritten if the raw cache is refreshed (e.g., after TTL expiry).

---

## Add Word Sense to Topic Flow

### Overview

This flow describes how a user adds a **specific word sense** to a learning topic. This operation is handled by the **Learning Core**, but the Dictionary Core provides the sense data.

### Process

```
User selects:
  - Sense: "bank (financial institution)" [sense_id: 123]
  - Topic: "Business English" [topic_id: 456]
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ STEP 1: Validate (Learning Core)                    │
│ - Does topic belong to user?                        │
│ - Does sense_id exist in word_senses?               │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: Check Duplicate (Learning Core)             │
│ Query: topic_senses WHERE topic_id=456 AND sense_id=123 │
│ If already exists → Return Error (409 Conflict)     │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: Create Relationship (Learning Core)         │
│ INSERT INTO topic_senses (                          │
│   topic_id: 456,                                     │
│   sense_id: 123,   ← Reference to dictionary sense  │
│   order_index: ...,                                  │
│   difficulty: 1,                                     │
│   review_count: 0                                    │
│ )                                                    │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ STEP 4: Update Denormalized Count (Learning Core)   │
│ UPDATE topics SET sense_count = sense_count + 1     │
└─────────────────────────────────────────────────────┘
    │
    ▼
Return success [END]
```

### Dictionary Core Role

The Dictionary Core's **only** role in this flow is:
- Provide the `sense_id` that can be referenced
- Ensure sense data exists and is immutable

The actual topic management, relationship creation, and user customizations are handled by the **Learning Core**.

---

## User Customization Model

### Overlay Architecture

User customizations are stored in a **separate layer** from dictionary data:

```
┌──────────────────────────────────────────────────────┐
│           User Customization Layer                   │
│           (topic_senses table)                       │
│                                                       │
│  - personal_note: "Remember: banks handle money"    │
│  - personal_examples: ["I deposited $100"]          │
│  - custom_pronunciation_note: "stress on 'bank'"     │
│  - difficulty: 3                                     │
│  - review_count: 10                                  │
│                                                       │
│  References ↓                                        │
└──────────────────────────────────────────────────────┘
                    │
                    │ Foreign Key: sense_id
                    ▼
┌──────────────────────────────────────────────────────┐
│           Dictionary Layer                           │
│           (word_senses table)                        │
│                                                       │
│  - definition: "A financial institution..."         │
│  - examples: ["I opened a bank account"]            │
│  - part_of_speech: "noun"                           │
│  - synonyms: ["financial institution"]              │
│                                                       │
│  [IMMUTABLE]                                         │
└──────────────────────────────────────────────────────┘
```

### UI Presentation

When displaying a word sense to a user:

1. **Load dictionary data** (from `word_senses`)
2. **Load user customizations** (from `topic_senses`)
3. **Merge for display**:
   ```
   Definition: [Dictionary definition] [READ-ONLY]
   Personal Note: [User's note] [EDITABLE]
   
   Examples (Dictionary):
   - [Example 1 from API]
   - [Example 2 from API]
   
   Personal Examples:
   - [User's example 1] [EDITABLE]
   - [User's example 2] [EDITABLE]
   ```

### Benefits

✅ **Data Integrity**: Dictionary data cannot be corrupted by users  
✅ **Traceability**: Changes tracked separately from authoritative source  
✅ **Flexibility**: Users can customize without losing original  
✅ **Scalability**: Shared dictionary data across all users  

---

## Design Decisions & Trade-offs

### 1. Separate `word_cache` from Normalized Tables

**Decision**: Keep raw API responses in `word_cache`, normalize into `words`, `pronunciations`, `word_senses`.

**Rationale**:
- ✅ Fast caching (save JSONB immediately)
- ✅ Data preservation (original API response for debugging)
- ✅ Flexible normalization (can re-parse if data model changes)
- ✅ Source independence (different APIs have different formats)

**Trade-off**:
- ❌ Storage overhead (raw + normalized)
- ✅ Worth it for performance and flexibility

---

### 2. Word Sense as Separate Entity

**Decision**: Each sense is a separate database record.

**Rationale**:
- ✅ Sense-level granularity for learning
- ✅ Referential integrity (topics link to specific senses)
- ✅ Queryable (filter by part of speech, search examples)
- ✅ Review tracking per sense

**Alternative Considered**: Store senses as JSONB array in `words`
- ❌ Harder to query and filter
- ❌ No foreign key integrity for topics
- ❌ Can't track review history per sense

---

### 3. Pronunciation at Word Level

**Decision**: Pronunciations belong to `words`, not `word_senses`.

**Rationale**:
- ✅ Pronunciation is word-level (same sound for all meanings)
- ✅ Reduces duplication
- ✅ Simpler data model

**Exception**: Homographs (e.g., "read" /riːd/ vs. /rɛd/) would need sense-specific pronunciation (future enhancement).

---

### 4. Immutable Dictionary Data

**Decision**: Users cannot modify dictionary definitions, examples, or synonyms.

**Rationale**:
- ✅ Data integrity (preserve authoritative source)
- ✅ Consistency (all users see same data)
- ✅ Auditability (changes come from API updates, not users)

**User customizations**: Stored separately in `topic_senses` table via overlay model.

---

### 5. Global Dictionary Data (Tenant-Agnostic)

**Decision**: `words`, `word_senses`, `pronunciations` are shared across all tenants.

**Rationale**:
- ✅ Efficiency (don't duplicate "hello" 1000 times)
- ✅ Cost reduction (one API call serves all tenants)
- ✅ Faster onboarding (new tenants get pre-cached data)

**User data isolation**: Topics and customizations are tenant-scoped.

---

### 6. JSONB for Arrays

**Decision**: Store `examples`, `synonyms`, `antonyms` as JSONB arrays.

**Rationale**:
- ✅ Read-heavy workload (rarely updated)
- ✅ Variable length (0-20 items)
- ✅ Simple queries with GIN indexes

**Trade-off**:
- ❌ Less normalized (synonyms duplicated)
- ✅ Acceptable for dictionary data (static)

---

## Future Extensions

### Phase 2: User-Generated Senses

**Feature**: Allow users to create custom word senses not from API.

**Data Model**:
- Add `created_by_user_id` to `word_senses` (nullable)
- `source = 'user'` to distinguish from API senses

**UI**: Show "User-contributed" badge for non-API senses.

---

### Phase 3: Multiple Dictionary Sources

**Feature**: Support Oxford, Merriam-Webster, etc. simultaneously.

**Data Model**:
- `source` field already exists in `word_senses`
- UI can toggle between sources or merge definitions

**Challenge**: Deduplication of identical senses from different sources.

---

### Phase 4: Multilingual Support

**Feature**: Dictionary lookups for multiple languages.

**Data Model**:
- `language` field already exists in `words`
- Add `translations` table linking English ↔ Foreign language senses

---

### Phase 5: Contextual Examples

**Feature**: Extract example sentences from real texts (news, books).

**Data Model**:
- Add `contextual_examples` table
- Link to `word_senses` with source attribution

---

## Summary

The **Dictionary Core** is a focused module responsible for:

1. ✅ Fetching dictionary data from external APIs
2. ✅ Caching raw responses for performance
3. ✅ Normalizing data into structured entities
4. ✅ Serving immutable, global dictionary content

**Key Principles**:
- Dictionary data is **global and shared**
- Dictionary data is **immutable**
- User customizations are **layered on top** via overlay model
- Word **sense** (not word) is the atomic learning unit

**Boundaries**:
- Dictionary Core **provides** data
- Learning Core **consumes** data
- User customizations are **separate** from source data

This design enables:
- Fast lookups with minimal API calls
- Data integrity and authority
- Scalable multi-tenant deployments
- Flexible user personalization

**Next Steps**: Implement normalization logic, create repositories, build Learning Core integration.
