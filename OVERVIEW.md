# Dictionary & Vocabulary Learning System - Overview

## Introduction

This is a **dictionary-based vocabulary learning system** designed to help users build vocabulary through **contextual, sense-specific learning**. The system integrates with external dictionary APIs to provide comprehensive word definitions, then enables users to create personalized learning collections organized by topics.

Unlike traditional dictionary apps that simply display word definitions, this system:
- **Separates** dictionary lookup from vocabulary learning
- **Treats** each word sense (meaning) as an independent learning unit
- **Preserves** authoritative dictionary data while allowing user customizations
- **Enables** personalized learning paths without data duplication
- **Supports** multi-tenant deployments with efficient resource sharing

The architecture is built on a clear separation of concerns: **global dictionary data** (shared and immutable) vs. **user learning data** (personal and customizable).

---

## Problem Statement

### The Challenge

Language learners using traditional dictionary apps face several problems:

1. **Lookup without retention**: Apps focus on word lookup but don't help users remember what they've learned
2. **Loss of context**: Users look up words but forget them because there's no review mechanism
3. **Overwhelming information**: A single word often has 10+ meanings, but users only need specific senses
4. **No personalization**: Can't add personal notes, mnemonics, or examples without losing the original definition
5. **Lack of organization**: No way to group vocabulary by themes, proficiency levels, or learning goals
6. **No learning reinforcement**: No spaced repetition or progress tracking

### Our Solution

This system solves these problems by:

- **Combining lookup with learning**: Search words AND save specific meanings for review
- **Sense-level granularity**: Users add specific word senses, not entire words
- **Topic-based organization**: Create collections like "Business English" or "IELTS Vocabulary"
- **Layered customization**: Add personal notes and examples WITHOUT modifying dictionary data
- **Efficient caching**: Shared dictionary data reduces API costs and improves performance
- **Extensible design**: Built to support spaced repetition, progress tracking, and collaborative learning

---

## Core Concepts

### 1. **Word**

A **word** is a lexical entry retrieved from dictionary APIs. It serves as a container for:
- **Pronunciations** (IPA notation, audio files, regional variants)
- **Word Senses** (multiple meanings of the same word)

**Example**: The word "bank" has:
- Pronunciations: `/bæŋk/` (US), `/baŋk/` (UK)
- Multiple senses: financial institution (noun), river edge (noun), tilt aircraft (verb)

**Key characteristics:**
- **Global and shared**: All users see the same dictionary data
- **Immutable**: Dictionary definitions cannot be modified by users
- **API-sourced**: Fetched from external services (e.g., dictionaryapi.dev, Oxford Dictionary)

---

### 2. **Word Sense** (Atomic Learning Unit) ⭐

A **word sense** is a specific meaning or definition of a word. This is the **fundamental unit of learning**.

**Example**: The word "run" has 30+ senses:
- **Sense 1** (verb): "Move at a speed faster than walking"
- **Sense 2** (verb): "Manage or operate a business"
- **Sense 3** (noun): "An act of running"
- ... and many more

Each sense includes:
- **Definition** (authoritative dictionary explanation)
- **Part of Speech** (noun, verb, adjective, etc.)
- **Examples** (sample sentences from the dictionary)
- **Synonyms and Antonyms** (related words)

**Why senses matter:**
- Users learn **specific meanings**, not entire words
- Prevents confusion when a word has unrelated meanings
- Enables precise flashcard creation
- Supports context-aware learning

**Important**: Dictionary senses are **read-only**. Users can add personal customizations (see below) but cannot change the original dictionary definition.

---

### 3. **Topic**

A **topic** is a user-created collection of word senses, similar to an Anki deck or Quizlet set.

**Example topics:**
- "IELTS 7.0 - Academic Vocabulary"
- "Medical Terminology - Cardiology"
- "Business English - Finance & Banking"
- "Phrasal Verbs for Travel"

Topics allow users to:
- **Organize** vocabulary by theme, proficiency level, or learning goal
- **Customize** learning order and difficulty
- **Track** progress per collection
- **Share** with other users (optional)

**Key characteristics:**
- **User-owned**: Each user creates their own topics
- **Tenant-scoped**: In multi-tenant deployments, topics are isolated per tenant
- **Sense-based**: Topics contain word senses, not whole words

**Important distinction**: A user might add "bank" (financial institution) to their "Business English" topic while ignoring "bank" (river edge), because they're learning **specific meanings**, not words.

---

### 4. **User Customization** (Personalization Layer)

Users can **personalize** their learning experience by adding custom data **on top of** dictionary senses:

#### Personal Notes
- Mnemonics: "Remember: 'bank' (money) vs. 'bank' (river) - different words!"
- Context: "Used this in yesterday's meeting"
- Translation: "Banco (Portuguese)"

#### Personal Examples
- "I went to the bank to deposit my paycheck." (user's own sentence)
- "My bank offers free checking accounts." (real-life usage)

#### Custom Pronunciation
- Custom IPA notation for dialect variants
- Personal audio recordings (e.g., user's own voice)
- Pronunciation tips: "Silent 'k' in 'know'"

#### Learning Metadata
- **Difficulty rating** (1-5 scale)
- **Review history** (for future SRS implementation)
- **Custom tags** ("urgent", "exam-critical", "already-memorized")

**Critical Design Rule**: User customizations are stored **separately** from dictionary data. The original dictionary definition remains unchanged and can be viewed at any time.

**Data Model**:
```
Dictionary Data (Global, Read-Only)
├── Word: "bank"
├── Sense 1: "A financial institution" [from API]
└── Sense 2: "The land alongside a river" [from API]

User Learning Data (Personal, Writable)
└── Topic: "Business English"
    └── Sense 1 (linked) + Personal Customizations
        ├── Personal Note: "Remember checking vs. savings"
        ├── Personal Example: "My bank appointment is today"
        ├── Difficulty: 2/5
        └── Review Count: 5
```

---

## System Responsibilities

### Dictionary Lookup Module
**Responsibility**: Fetch and cache dictionary data from external APIs

- Query dictionary providers (dictionaryapi.dev, Oxford, etc.)
- Cache responses to reduce API calls and costs
- Normalize data across different API formats
- Return structured word + sense data

**Data ownership**: Global, shared, immutable

---

### Word Sense Management Module
**Responsibility**: Manage normalized dictionary entities

- Store words, pronunciations, and senses
- Provide fast lookups with indexing
- Maintain referential integrity
- Support full-text search (future)

**Data ownership**: Global, shared, immutable

---

### Topic & Learning Module
**Responsibility**: Manage user learning collections

- Create and organize topics
- Add/remove word senses to/from topics
- Store user customizations (notes, examples, difficulty)
- Track learning progress (review count, last reviewed)

**Data ownership**: User-scoped, tenant-scoped, mutable

---

### User Customization Module
**Responsibility**: Store personal learning data

- Save personal notes and examples
- Manage custom pronunciations and audio
- Track review history and difficulty ratings
- Preserve data separation from dictionary source

**Data ownership**: User-scoped, tenant-scoped, mutable

---

### Auth & Tenant Module
**Responsibility**: Manage users and multi-tenant isolation

- Authenticate users (JWT with refresh tokens)
- Enforce tenant-based access control
- Manage subscription plans and usage limits
- Ensure data privacy between tenants

---

## High-Level Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│         (React SPA, Mobile Apps, API Clients)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│         (Controllers, DTOs, Guards, Validation)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer                           │
│      (Business Logic, Use Cases, Domain Services)           │
│                                                              │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ Dictionary Core  │      │ Learning Core    │            │
│  │ (Global Data)    │      │ (User Data)      │            │
│  └──────────────────┘      └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                       │
│  (Database, External APIs, Cache, File Storage, Queue)      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow: Word Lookup

```
User searches "hello"
    │
    ▼
Check: Does "hello" exist in database?
    │
    ├─> YES: Return word + senses + pronunciations
    │
    └─> NO:
         │
         ▼
    Check: Is "hello" in cache?
         │
         ├─> YES: Use cached data
         │
         └─> NO: Call external API → Save to cache
              │
              ▼
         Normalize raw response
              │
              ▼
         Save: words, pronunciations, word_senses
              │
              ▼
         Return to user
```

### Data Flow: Add Sense to Topic

```
User selects sense "bank (financial institution)"
User selects topic "Business English"
    │
    ▼
Validate: Does user own topic?
Validate: Does sense exist?
    │
    ▼
Check: Is sense already in topic?
    │
    ├─> YES: Return error (409 Conflict)
    │
    └─> NO:
         │
         ▼
    Create relationship (topic ↔ sense)
    Save user customizations (note, difficulty)
    Update topic sense count
         │
         ▼
    Return success
```

---

## Design Principles

### 1. **Separation of Dictionary and Learning Data**

**Dictionary Data** (Global):
- Authoritative definitions from APIs
- Shared across all users and tenants
- Immutable (read-only for users)
- Cached aggressively

**Learning Data** (Personal):
- User-created topics and collections
- Personal notes, examples, difficulty ratings
- Tenant-scoped and isolated
- Fully customizable

**Why this separation?**
- **Efficiency**: Don't duplicate "hello" definition 10,000 times
- **Authority**: Preserve dictionary integrity
- **Personalization**: Allow customization without data corruption
- **Scalability**: Shared data grows logarithmically, not linearly

---

### 2. **Word Sense as Atomic Unit**

Users interact with **specific meanings**, not generic words. This enables:
- Precise learning (no ambiguity)
- Better flashcards (one meaning per card)
- Context-aware review (review what you're actually learning)

**Anti-pattern**: Saving entire words leads to confusion when reviewing.

---

### 3. **Immutable Dictionary Data**

Dictionary data is **never modified by users**. This ensures:
- **Data integrity**: Definitions remain authoritative
- **Auditability**: Changes can be traced to API updates, not user edits
- **Consistency**: All users see the same source definition

User customizations are **layered on top** via separate tables/entities.

---

### 4. **Cache-First for Performance**

All dictionary lookups check the local cache before calling external APIs. This:
- Reduces API costs (pay-per-call pricing)
- Improves response times (< 20ms vs. 200ms+)
- Works offline (cached data available)

**Cache invalidation**: Time-based expiration (30 days default).

---

### 5. **Multi-Tenant by Design**

**Tenant-scoped data**:
- Users, topics, topic_senses, user customizations

**Global data**:
- Words, word_senses, pronunciations, word_cache

This hybrid approach provides:
- **Data isolation**: Tenants cannot access each other's learning data
- **Resource efficiency**: Shared dictionary data across tenants
- **Cost optimization**: Single API call benefits all tenants

---

### 6. **Extensibility Through Separation**

The system is designed for future features:
- **Spaced Repetition**: Leverage `review_count`, `last_reviewed_at`
- **User-Generated Content**: Allow user-submitted senses (separate from API data)
- **AI Recommendations**: Suggest related senses based on learning history
- **Collaborative Learning**: Share topics with other users

---

## What This System Is NOT

### ❌ Not a Dictionary API Provider

This system **consumes** external dictionary APIs (Oxford, Free Dictionary) but does **not** expose its own public dictionary API. It's a learning tool, not a data service.

---

### ❌ Not a Translation Tool

The system provides **monolingual definitions** (English → English), examples, and context. It is **not** designed for real-time translation or sentence-level analysis.

**Future consideration**: Add translation support as a **user customization layer** (not modifying dictionary data).

---

### ❌ Not a Full Language Learning Platform

This is a **vocabulary learning tool**, not a comprehensive language course. It does **not** include:
- Grammar lessons
- Speaking practice
- Writing feedback
- Certification exams

**Focus**: Building vocabulary through dictionary-based learning.

---

### ❌ Not a Social Network

While topics can be shared and collaborative features are planned, the primary focus is **personal learning**, not social interaction or community features.

---

### ❌ Not a User-Editable Wiki

Users cannot **modify** dictionary definitions. They can only **add personal customizations** on top of the authoritative data. This preserves data integrity and authority.

---

## Future Vision

### Phase 1: Core Foundation ✅ (Current)

- Dictionary lookup with caching
- Word sense normalization
- Topic-based organization
- User customizations (notes, examples)
- Multi-tenant support

---

### Phase 2: Spaced Repetition System (SRS)

**Features**:
- Schedule reviews based on forgetting curve
- Track review performance (correct/incorrect)
- Adaptive difficulty adjustment
- Review reminders and notifications

**Data model**: Leverage existing `review_count`, `last_reviewed_at`, add `next_review_at`.

---

### Phase 3: Learning Analytics

**Features**:
- Vocabulary size tracking
- Mastery levels per word sense
- Topic completion percentage
- Learning heatmaps and streaks
- Personalized insights

**Data model**: Aggregate review history, track unique senses reviewed.

---

### Phase 4: Enhanced Personalization

**Features**:
- User-generated senses (custom definitions)
- Community-contributed examples
- Audio recordings (user's own voice)
- Image associations (visual mnemonics)

**Critical**: All user content stored separately from dictionary data.

---

### Phase 5: Collaborative Learning

**Features**:
- Share topics with other users
- Topic marketplace (public topics)
- Collaborative editing (team learning)
- Leaderboards and achievements

**Data model**: Add `topic.is_public`, `topic_collaborators`, `topic_ratings`.

---

### Phase 6: AI-Powered Features

**Features**:
- Context-aware sense recommendations
- Example sentence generation
- Pronunciation feedback (speech recognition)
- Adaptive learning paths

**Integration**: Separate AI service layer, non-intrusive to core data model.

---

## Summary

This dictionary and vocabulary learning system is built on a foundation of **clear separation** between:

1. **Global dictionary data** (shared, immutable, API-sourced)
2. **User learning data** (personal, customizable, tenant-scoped)

By treating each **word sense** as an atomic learning unit and allowing **layered customization** without modifying source data, the system provides:

- ✅ **Data integrity**: Dictionary definitions remain authoritative
- ✅ **Personalization**: Users can customize learning without data corruption
- ✅ **Efficiency**: Shared dictionary data reduces costs and duplication
- ✅ **Scalability**: Multi-tenant design with optimal resource sharing
- ✅ **Extensibility**: Ready for SRS, analytics, and collaborative features

**Target Audience**: Language learners, educators, language schools, and self-study enthusiasts who want to move beyond passive lookup to active vocabulary building with personalized, sense-specific learning.

**Key Differentiator**: Sense-level granularity + immutable dictionary data + layered user customization + multi-tenant efficiency.

**Next Steps**: Implement SRS, build mobile apps, add AI-powered recommendations.
