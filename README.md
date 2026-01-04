# Easy English - Local Development Guide

## Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: Running locally or a connection URL to a remote instance

---

## Project Structure

```
easy-english/
├── client/     # React frontend (RSBuild + TanStack Router)
├── server/     # NestJS backend (MikroORM + PostgreSQL)
```

---

## Server Setup

### 1. Navigate to the server directory

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.dev` file (or `.env.prod`, `.env.stag` for other environments):

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy_english

# Application
APP_SCHEME=http
APP_HOST=localhost
APP_PORT=3000
APP_CLIENT_DOMAIN=http://localhost:4200
CORS_ORIGINS=http://localhost:4200

# JWT Secrets (Optional, defaults exist)
JWT_ACCESS_TOKEN_SECRET=your-access-secret
JWT_ACCESS_TOKEN_EXPIRED=3600
JWT_REFRESH_TOKEN_SECRET=your-refresh-secret
JWT_REFRESH_TOKEN_EXPIRED=86400

# Cookie (Optional)
COOKIE_REFRESH_NAME=refresh
COOKIE_SECRET=your-cookie-secret
```

### 4. Run database migrations

```bash
npm run migration:up
```

### 5. (Optional) Seed the database

```bash
npm run seed:run
```

### 6. Start the development server

```bash
npm run start:dev
```

The server will be running at `http://localhost:3000`. Swagger docs available at `http://localhost:3000/api`.

---

## Test Account

Sau khi seed database, bạn có thể sử dụng tài khoản sau để đăng nhập:

| Field     | Value           |
|-----------|-----------------|
| Email     | `18maytinhmoi@gmail.com` |
| Password  | `Dungcool102608@`      |

> **Note:** Tài khoản này được tạo tự động khi chạy `npm run seed:run`. Nếu bạn muốn thay đổi thông tin đăng nhập mặc định, hãy chỉnh sửa seeder trong `server/src/core/database/seeders/`.

---

## Client Setup

### 1. Navigate to the client directory

```bash
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables (optional)

The client uses RSBuild with environment modes. Configuration can be added via `.env.local`:

```env
# Example
PUBLIC_API_URL=http://localhost:3000
```

### 4. Start the development server

```bash
npm run dev
```

The client will be running at `http://localhost:4200` and will automatically open in your browser.

---

## Quick Start (Both)

Open two terminals:

**Terminal 1 (Server):**

```bash
cd server
npm install
npm run migration:up
npm run start:dev
```

**Terminal 2 (Client):**

```bash
cd client
npm install
npm run dev
```

---

## Available Scripts

### Server (`server/package.json`)

| Script                | Description                        |
|-----------------------|------------------------------------|
| `npm run start:dev`   | Start in watch mode                |
| `npm run build`       | Build for production               |
| `npm run migration:up`| Run pending migrations             |
| `npm run migration:create` | Create a new migration        |
| `npm run seed:run`    | Run database seeders               |
| `npm run test`        | Run unit tests                     |

### Client (`client/package.json`)

| Script              | Description                         |
|---------------------|-------------------------------------|
| `npm run dev`       | Start development server on :4200   |
| `npm run build`     | Build for production                |
| `npm run preview`   | Preview production build            |
| `npm run check`     | Run Biome linter                    |
