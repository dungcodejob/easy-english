# Dictionary Module - Architecture & Flow

## Overview

The Dictionary module handles two main operations:

- **Lookup**: Fetch single word on-demand from external APIs
- **Import**: Batch import words from specific sources (e.g., AzVocab)

---

## Lookup Flow

```
GET /lookup/:word
       │
       ▼
┌────────────────────┐
│  LookupController  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   LookupService    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────────┐
│ WordRepository.findByNormalized│
└─────────┬──────────────────────┘
          │
    ┌─────┴─────┐
    │           │
 Found?      Not Found
    │           │
    ▼           ▼
 Return    ┌──────────────────┐
  Word     │ProviderFactory   │
           │.getProvider()    │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │ Provider.lookup()│
           │ (FreeDictionary) │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │ External API     │
           │ dictionaryapi.dev│
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │ Adapter.adapt()  │
           │ → NormalizedData │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │ Create Word      │
           │ (Aggregate)      │
           │ + Pronunciations │
           │ + Senses         │
           │ + Examples       │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │ Repository.save()│
           └────────┬─────────┘
                    │
                    ▼
              Return Word
```

---

## Import Flow

```
POST /dictionary/import
     {keyword, source}
          │
          ▼
┌─────────────────────┐
│  ImportController   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   ImportService     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ ImportProviderFactory│
│ .getProvider(source)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  AzVocabProvider    │
│  .import(keyword)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ AzVocab API Search  │
│ POST /api/vocab/    │
│      search?q=...   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ For each definition:│
│ GET /_next/data/... │
│ /definition/{id}    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Transaction Start   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Find/Create Word    │
│ Adapter.adaptWord() │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Create Pronunciations│
│ Adapter.adaptProns()│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Create WordSenses   │
│ Adapter.adaptSenses()│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Create Examples     │
│ Adapter.adaptExamples│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Transaction Commit  │
└──────────┬──────────┘
           │
           ▼
      ImportResult
      {wordId, created,
       skipped, ...}
```

---

## Comparison

| Aspect       | Lookup                      | Import                   |
| ------------ | --------------------------- | ------------------------ |
| Purpose      | Fetch single word on-demand | Batch import from source |
| Domain Model | `Word` aggregate            | Entities directly        |
| Repository   | `IWordAggregateRepository`  | `EntityManager`          |
| Sources      | Oxford, FreeDictionary      | AzVocab                  |
| Response     | `Word` domain model         | `ImportResult` stats     |

---

## File Structure

```
modules/dictionary/
├── domain/
│   ├── models/           # Word, WordSense, Pronunciation, Example
│   ├── repositories/     # IWordAggregateRepository interface
│   ├── lookup/           # LookupProvider interface, NormalizedData
│   └── import/           # IImportProvider, IImportAdapter interfaces
│
├── application/
│   ├── lookup.service.ts     # Handles word lookup logic
│   └── import.service.ts     # Handles batch import logic
│
├── infrastructure/
│   ├── repositories/         # MikroOrmWordRepository
│   ├── lookup/
│   │   ├── lookup-provider.factory.ts
│   │   └── providers/
│   │       ├── oxford/
│   │       │   ├── oxford.provider.ts
│   │       │   └── oxford.adapter.ts
│   │       └── free-dictionary/
│   │           ├── free-dictionary.provider.ts
│   │           └── free-dictionary.adapter.ts
│   └── import/
│       ├── import-provider.factory.ts
│       └── providers/
│           └── azvocab/
│               ├── azvocab.provider.ts
│               ├── azvocab.adapter.ts
│               └── azvocab.types.ts
│
└── presentation/
    ├── lookup.controller.ts
    ├── import.controller.ts
    └── dto/
        └── import.dto.ts
```

---

## API Endpoints

### Lookup

```
GET /lookup/:word
Authorization: Bearer <token>

Response:
{
  "data": {
    "id": "...",
    "text": "hello",
    "normalizedText": "hello",
    "language": "en",
    "pronunciations": [...],
    "senses": [...]
  }
}
```

### Import

```
POST /dictionary/import
Content-Type: application/json

Body:
{
  "keyword": "hello",
  "source": "AZVOCAB"
}

Response:
{
  "keyword": "hello",
  "wordId": "...",
  "wordCreated": true,
  "createdSenses": 5,
  "createdPronunciations": 2,
  "createdExamples": 10,
  "skippedSenses": 0,
  "totalDefinitions": 5
}
```
