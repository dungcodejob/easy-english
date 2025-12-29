# 📘 Vocabulary Learning App – Feature Specification

## 🎯 Product Vision

Xây dựng một ứng dụng học từ vựng **tập trung vào hiệu quả ghi nhớ dài hạn**, cá nhân hoá theo từng người học, đủ mạnh để **so sánh với Anki**, nhưng **dễ dùng hơn – hiện đại hơn – gắn với ngữ cảnh thực tế**.

---

## 1️⃣ Tăng “Hiệu Quả Học” (Core Value)

### 🔁 Spaced Repetition System (SRS) ⭐⭐⭐⭐⭐

#### Mô tả

Mỗi **UserWordSense** có metadata học tập:

* `easeFactor`
* `nextReviewAt`
* `reviewCount`
* `lastReviewResult`

Người dùng đánh giá sau mỗi lần học:

* ❌ Quên
* 😐 Hơi nhớ
* ✅ Nhớ rõ

Hệ thống tự động điều chỉnh lịch ôn tập.

#### Cách người dùng sử dụng

1. Vào màn **Review**
2. Học các từ đến hạn
3. Đánh giá mức độ nhớ
4. App tự động lên lịch ôn tiếp theo

#### Tương tác dữ liệu

* Update learning metadata trên `UserWordSenseEntity`
* Query theo `nextReviewAt <= now`

#### Vì sao cần

* Phù hợp cơ chế ghi nhớ của não
* Là nền tảng của mọi app học từ vựng hiệu quả

#### Giá trị mang lại

* Học ít hơn nhưng nhớ lâu
* App quyết định giúp người dùng nên học gì

---

### ✍️ Multiple Learning Modes

#### Mô tả

Một topic có thể học bằng nhiều mode:

* Flashcard
* Typing (gõ từ / nghĩa)
* Multiple choice
* Listen & type
* Reverse card

#### Giá trị

* Tránh nhàm chán
* Phù hợp nhiều kiểu người học

---

### 🧠 Active Recall (Bắt buộc)

#### Mô tả

* Ẩn nghĩa mặc định
* Bắt user trả lời trước khi xem đáp án
* Không cho lật thẻ ngay

#### Giá trị

* Tăng khả năng ghi nhớ dài hạn

---

## 2️⃣ Cá Nhân Hoá & Thông Minh

### 🎯 Word Status

#### Mô tả

Mỗi từ có trạng thái:

* New
* Learning
* Mastered
* Forgotten

#### Giá trị

* Trực quan hoá tiến trình học
* Tạo cảm giác tiến bộ

---

### 🔍 Smart Filter

Cho phép lọc:

* Từ hay quên
* Từ mới
* Từ học gần đây
* Theo topic / độ khó

---

### 🧩 Suggest Words

Gợi ý từ dựa trên:

* Topic đang học
* Level user
* Lịch sử học tập

---

## 3️⃣ Gamification (Giữ User Quay Lại)

### 🔥 Daily Streak ⭐⭐⭐⭐

* Học ≥ X từ/ngày để giữ streak
* Mất streak sẽ reset

### 🏆 Achievement / Badge

Ví dụ:

* Học 100 từ
* Master 50 từ
* Streak 7 ngày

### 📊 Progress Dashboard

* Tổng số từ đã học
* % mastered
* Biểu đồ theo ngày / tuần

---

## 4️⃣ Ghi Nhớ Sâu (Deep Learning)

### 📝 Personal Note / Mnemonic

* Ghi chú cá nhân
* Câu nhớ / kỷ niệm

### 🖼️ Image / Context

* Hình ảnh minh hoạ
* Ví dụ theo ngữ cảnh thực tế

---

## 5️⃣ Social (Mở Rộng Sau)

### 🤝 Share / Clone Topic

* Public topic
* Clone topic của người khác

### 🧑‍🤝‍🧑 Challenge Bạn Bè

* Thi đua học từ
* Ranking nhỏ

---

## 6️⃣ Thông Báo & Nhắc Học (Retention)

### ⏰ Smart Reminder ⭐⭐⭐⭐

* Nhắc khi đến hạn ôn SRS
* Gợi ý “5 phút học nhanh”

---

## 7️⃣ Dành Cho Dev / Power User

### 📤 Import / Export

* CSV
* Anki
* Notion

---

## 🌍 Đa Ngôn Ngữ & Workspace

### Đề xuất

* Tạo **Workspace / Profile theo ngôn ngữ**
* Mỗi workspace có:

  * Topics
  * SRS riêng
  * Difficulty scale riêng

### Lợi ích

* Tránh trộn logic giữa các ngôn ngữ
* Chuẩn bị cho mở rộng lâu dài

---

## 🚀 Đề Xuất Cải Tiến Thêm

1. Learning session ngắn (5–10 phút)
2. Weak words focus mode
3. AI gợi ý ví dụ câu
4. Offline-first + sync
5. Learning heatmap (GitHub-style)

---

> 📌 Tài liệu này dùng làm nền tảng cho:
>
> * Thiết kế DB & API
> * Chia task trong Notion
> * Align FE / BE / Product
