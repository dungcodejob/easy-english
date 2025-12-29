# 🧭 ONBOARDING WORKSPACE FLOW

Tài liệu này mô tả **flow onboarding khi user chưa có Workspace** trong Vocabulary Learning App.

Mục tiêu:

* Bắt buộc user tạo Workspace trước khi học
* Đảm bảo dữ liệu học tập luôn có context (workspace)
* Kiến trúc sạch, dễ scale đa ngôn ngữ

---

## 1️⃣ Nguyên tắc thiết kế

* Workspace = **Learning Context** (ngôn ngữ / mục tiêu học)
* Không có Workspace → không cho học
* Không tạo Workspace mặc định
* Dictionary core vẫn global (không phụ thuộc workspace)

---

## 2️⃣ High-level Flow

```text
User đăng ký / đăng nhập
↓
Backend trả về user + workspaces[]
↓
Nếu workspaces.length === 0
  → redirect /onboarding/workspace
↓
User tạo workspace (bắt buộc)
↓
Set currentWorkspace
↓
Redirect dashboard
```

---

## 3️⃣ Backend Flow chi tiết

### 3.1 Auth Response

```json
{
  "user": { "id": "u1", "email": "user@email.com" },
  "workspaces": [],
  "currentWorkspaceId": null
}
```

> Trạng thái **không có workspace là hợp lệ**

---

### 3.2 Guard Workspace (Server-side)

* Áp dụng cho các route:

  * create topic
  * add word
  * review SRS

Logic:

* Nếu request yêu cầu workspace
* Nhưng user chưa có workspace
  → trả lỗi `WORKSPACE_REQUIRED`

---

## 4️⃣ Frontend Flow

### 4.1 App Initialization

```text
Load user session
↓
Fetch /workspaces
↓
if empty → redirect onboarding
else → set currentWorkspace
```

---

### 4.2 Onboarding – Create Workspace

* Đây là **bước bắt buộc**
* Không cho skip

Sau khi tạo thành công:

* Save `currentWorkspaceId`
* Redirect dashboard

---

## 5️⃣ Khi nào user được làm gì?

| Action            | Có Workspace? |
| ----------------- | ------------- |
| Browse dictionary | ✅             |
| Create topic      | ❌             |
| Add word          | ❌             |
| Review SRS        | ❌             |
| Onboarding        | ✅             |

---

## 6️⃣ Tương thích với DICTIONARY CORE

* Word / WordSense: global
* Workspace không ảnh hưởng lookup
* UserWordSense / Topic / SRS: bắt buộc workspaceId

---

## 7️⃣ Edge Cases

* User xoá workspace cuối cùng → redirect onboarding
* User đăng nhập từ thiết bị mới → phải chọn workspace

---

## 8️⃣ Kết luận

> Workspace-first onboarding giúp:
>
> * Tránh dữ liệu rác
> * Rõ ràng mục tiêu học
> * Scale tốt cho đa ngôn ngữ & team
