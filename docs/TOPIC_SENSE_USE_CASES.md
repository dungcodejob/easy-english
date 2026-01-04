# TopicSense Use Cases

## Overview

Tài liệu này mô tả các use cases cho tính năng TopicSense - cho phép user thêm từ vựng từ dictionary vào topic cá nhân và customize.

---

## UC1: Thêm từ từ Dictionary vào Topic

### Actors
- Authenticated User

### Preconditions
- User đã có ít nhất 1 workspace và 1 topic
- Từ đã được lookup từ dictionary (WordSenseEntity tồn tại)

### Main Flow
1. User search từ "book" trong dictionary
2. System hiển thị tất cả senses của từ "book"
3. User chọn sense "a written text" (noun)
4. User click "Add to Topic" và chọn topic "IELTS Vocabulary"
5. System tạo TopicSenseEntity link tới WordSenseEntity
6. System hiển thị thông báo thành công

### Alternative Flow
- **4a.** Từ đã tồn tại trong topic → Hiển thị error "Từ này đã có trong topic"

### Postconditions
- TopicSenseEntity được tạo với `wordSenseId` reference
- Topic.senseCount tăng 1

---

## UC2: Thêm ghi chú cá nhân

### Actors
- Authenticated User

### Preconditions
- TopicSenseEntity đã tồn tại

### Main Flow
1. User mở chi tiết từ "book" trong topic
2. User nhập ghi chú: "Nhớ: book (sách) ≠ book (đặt chỗ)"
3. User click Save
4. System cập nhật `personalNote`

### Postconditions
- TopicSenseEntity.personalNote được cập nhật

---

## UC3: Thêm ví dụ cá nhân

### Actors
- Authenticated User

### Main Flow
1. User mở chi tiết từ trong topic
2. User thêm ví dụ: "Mình mua cuốn sách này ở Fahasa"
3. System lưu vào `personalExamples` array

### Data Model
```json
{
  "personalExamples": [
    "Mình mua cuốn sách này ở Fahasa",
    "Cuốn sách này rất hay"
  ]
}
```

---

## UC4: Review từ vựng (SRS)

### Actors
- Authenticated User

### Preconditions
- TopicSenseEntity.nextReviewAt <= now

### Main Flow
1. User vào màn Review
2. System hiển thị flashcard với từ cần review
3. User cố nhớ nghĩa
4. User tiết lộ đáp án
5. User đánh giá: ❌ Quên / 😐 Hơi nhớ / ✅ Nhớ rõ
6. System tính toán `nextReviewAt` theo SM-2 algorithm

### SM-2 Algorithm Summary
```
If quality < 3:
  repetitions = 0
  interval = 1
Else:
  easeFactor = max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  If repetitions == 0: interval = 1
  Elif repetitions == 1: interval = 6
  Else: interval = interval * easeFactor
  repetitions += 1

nextReviewAt = now + interval days
```

---

## UC5: Học từ ở nhiều Topics

### Scenario
- User có "book" trong cả "IELTS Vocabulary" và "Business English"
- Mỗi topic có progress riêng

### Data Model
```
TopicSenseEntity (topic: IELTS)
├── wordSenseId: "book-noun-1"
├── learningStatus: "mastered"
└── reviewCount: 10

TopicSenseEntity (topic: Business)
├── wordSenseId: "book-noun-1"  ← CÙNG wordSenseId
├── learningStatus: "learning"
└── reviewCount: 2
```

### Key Point
- Không có unique constraint trên `wordSenseId`
- Constraint là `UNIQUE(topicId, wordSenseId)`

---

## UC6: Clone từ VocabSet có sẵn

### Actors
- Authenticated User

### Preconditions
- VocabSetEntity với các WordSenseEntity đã tồn tại
- User có topic đích

### Main Flow
1. User browse VocabSets → chọn "Cambridge Starters - School 1"
2. System hiển thị danh sách senses trong VocabSet
3. User click "Clone to My Topic"
4. User chọn topic đích hoặc tạo topic mới
5. System tạo TopicSenseEntity cho mỗi sense

### Batch Operation
```typescript
await Promise.all(
  vocabSet.senses.map(sense => 
    topicSenseService.addSenseToTopic({ topicId, wordSenseId: sense.id })
  )
)
```

---

## UC7: Thêm từ tự tạo (không có trong Dictionary)

### Scenario
- User muốn thêm slang "YOLO" mà Cambridge không có

### Main Flow
1. User search "YOLO" → Dictionary trả về 404
2. System hiển thị option "Add custom word"
3. User nhập:
   - Word: YOLO
   - Part of Speech: interjection
   - Definition: You Only Live Once
   - Definition Vi: Sống là phải biết tận hưởng
4. System tạo **UserWordSenseEntity** (không phải TopicSenseEntity)

### Key Point
- UserWordSenseEntity được giữ lại cho trường hợp này
- `isCustomWord = true`
- `dictionarySense = null`

---

## UC8: Xóa từ khỏi Topic

### Main Flow
1. User mở topic
2. User click "Remove" trên từ "book"
3. System xác nhận
4. System xóa TopicSenseEntity
5. WordSenseEntity trong dictionary KHÔNG bị xóa

### Cascade Behavior
- Xóa topic → Xóa tất cả TopicSenseEntity của topic
- Xóa WordSenseEntity (admin) → Xóa TopicSenseEntity liên quan

---

## Summary

| Use Case | Entity Used | Data Duplication |
|----------|-------------|------------------|
| UC1: Add from dictionary | TopicSenseEntity | ❌ No |
| UC2-UC4: Customize & Review | TopicSenseEntity | ❌ No |
| UC5: Multi-topic | TopicSenseEntity | ❌ No |
| UC6: Clone VocabSet | TopicSenseEntity | ❌ No |
| UC7: Custom word | UserWordSenseEntity | ✅ Yes (required) |
