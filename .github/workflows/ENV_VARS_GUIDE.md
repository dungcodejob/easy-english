# Railway Production Environment Variables Guide

## 🔧 Environment Variables Configuration

Khi deploy lên Railway, bạn cần config các environment variables sau trong Railway dashboard.

**Railway Dashboard → Service → Variables → Add Variables**

---

## 📋 Required Variables

### Application Settings

```bash
# APP_HOST - Railway tự động inject
# Để trống hoặc set: 0.0.0.0
APP_HOST=0.0.0.0

# APP_PORT - Railway tự động inject PORT variable
# Railway recommends using $PORT or 3000
APP_PORT=3000

# APP_CLIENT_DOMAIN - Frontend URL (React app)
# ⚠️ CHANGE THIS: URL của client app deployed
APP_CLIENT_DOMAIN=https://your-frontend-app.web.app
# Examples:
# - Vercel: https://your-app.vercel.app
# - Netlify: https://your-app.netlify.app
# - Firebase: https://your-app.web.app
# - Railway: https://your-client.railway.app

# APP_SCHEME - Protocol
APP_SCHEME=https
# Production MUST use https

# APP_ID - Application identifier
APP_ID=easy-english-prod
# Change to production identifier
```

### HTTP Configuration

```bash
# HTTP_VERSION
HTTP_VERSION=1
# Keep as is

# HTTP_VERSIONING_ENABLE
HTTP_VERSIONING_ENABLE=true
# Keep as is
```

### Database

```bash
# DATABASE_URL - PostgreSQL connection string
# Railway có thể tự generate nếu bạn dùng Railway PostgreSQL
DATABASE_URL=postgresql://user:password@host:port/database

# Example từ Railway PostgreSQL:
# DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

### JWT & Security

```bash
# JWT_SECRET - CRITICAL: Must be strong random string
JWT_SECRET=your-super-strong-secret-key-change-this-in-production
# Generate strong secret:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# JWT_EXPIRES_IN (optional)
JWT_EXPIRES_IN=7d
# Token expiration time
```

### Node Environment

```bash
# NODE_ENV - Set to production
NODE_ENV=production
```

### CORS (if needed)

```bash
# CORS_ORIGIN - Allowed origins
CORS_ORIGIN=https://your-frontend-app.web.app
# Multiple origins (comma-separated):
# CORS_ORIGIN=https://app1.com,https://app2.com
```

---

## 🔄 Development vs Production Comparison

| Variable | Development | Production |
|----------|------------|------------|
| `APP_HOST` | `localhost` | `0.0.0.0` (Railway auto) |
| `APP_PORT` | `3000` | `3000` (Railway auto-inject `PORT`) |
| `APP_CLIENT_DOMAIN` | `http://localhost:4200` | `https://your-app.web.app` |
| `APP_SCHEME` | `http` | `https` |
| `APP_ID` | `app_id` | `easy-english-prod` |
| `DATABASE_URL` | Local PostgreSQL | Railway PostgreSQL URL |
| `JWT_SECRET` | Simple string | **Strong random secret** |
| `NODE_ENV` | `dev` or `development` | `production` |

---

## 🚀 How to Set Variables in Railway

### Method 1: Railway UI (Recommended)

1. **Navigate to Service:**
   - Railway Dashboard → Your Project → Backend Service

2. **Open Variables Tab:**
   - Click **"Variables"** tab

3. **Add Variables:**
   - Click **"+ New Variable"**
   - Enter variable name (e.g., `APP_CLIENT_DOMAIN`)
   - Enter value (e.g., `https://your-app.web.app`)
   - Click **"Add"**

4. **Repeat for all variables**

5. **Deploy:**
   - Variables automatically applied on next deployment

### Method 2: Railway CLI

```bash
# Login
railway login

# Link to project
railway link

# Set variables
railway variables set APP_HOST=0.0.0.0
railway variables set APP_PORT=3000
railway variables set APP_CLIENT_DOMAIN=https://your-app.web.app
railway variables set APP_SCHEME=https
railway variables set APP_ID=easy-english-prod
railway variables set HTTP_VERSION=1
railway variables set HTTP_VERSIONING_ENABLE=true
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# For DATABASE_URL, use Railway's PostgreSQL plugin URL
# Railway automatically provides DATABASE_URL if you add PostgreSQL plugin
```

### Method 3: Bulk Import (JSON)

1. Create file `railway-env.json`:
```json
{
  "APP_HOST": "0.0.0.0",
  "APP_PORT": "3000",
  "APP_CLIENT_DOMAIN": "https://your-app.web.app",
  "APP_SCHEME": "https",
  "APP_ID": "easy-english-prod",
  "HTTP_VERSION": "1",
  "HTTP_VERSIONING_ENABLE": "true",
  "NODE_ENV": "production",
  "JWT_SECRET": "GENERATE_STRONG_SECRET_HERE"
}
```

2. Import in Railway UI:
   - Variables tab → **"Import from JSON"**
   - Paste JSON content

---

## 🔐 Security Best Practices

### 1. JWT Secret

**❌ NEVER use simple strings in production:**
```bash
# BAD
JWT_SECRET=mysecret123
```

**✅ Generate strong random secret:**
```bash
# Generate using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use online generator (ensure HTTPS)
# https://randomkeygen.com/
```

### 2. Database URL

**✅ Use Railway's PostgreSQL plugin:**
- Automatically managed
- Automatic backups
- Secure connection

**Alternative: External PostgreSQL**
```bash
# Use connection pooling for production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require&pool_timeout=10
```

### 3. Client Domain

**✅ Use actual deployed frontend URL:**
```bash
# After deploying client to Vercel/Netlify/Firebase
APP_CLIENT_DOMAIN=https://your-actual-frontend.vercel.app
```

**❌ Don't use:**
- `localhost` URLs
- HTTP in production
- Wildcard domains

---

## 🧪 Testing Variables

### Local Testing with Production-like Env

Create `.env.prod` file:

```bash
APP_HOST=0.0.0.0
APP_PORT=3000
APP_CLIENT_DOMAIN=https://your-staging-app.web.app
APP_SCHEME=https
APP_ID=easy-english-staging
HTTP_VERSION=1
HTTP_VERSIONING_ENABLE=true
NODE_ENV=production
DATABASE_URL=postgresql://localhost:5432/easy_english_prod
JWT_SECRET=test-jwt-secret-for-staging
```

Run with production env:
```bash
# Load .env.prod
NODE_ENV=prod npm run start:prod

# Or
dotenv -e .env.prod npm run start:prod
```

---

## 📊 Railway-specific Variables

Railway automatically provides:

| Variable | Description | Usage |
|----------|-------------|-------|
| `PORT` | Auto-assigned port | Use for `APP_PORT` |
| `RAILWAY_ENVIRONMENT` | Environment name | `production`, `staging` |
| `RAILWAY_PROJECT_ID` | Project ID | Logging/monitoring |
| `RAILWAY_SERVICE_NAME` | Service name | Logging |

**Access in code:**
```typescript
const PORT = process.env.PORT || process.env.APP_PORT || 3000;
```

---

## ⚠️ Common Mistakes

### 1. Using localhost in production
```bash
# ❌ WRONG
APP_CLIENT_DOMAIN=http://localhost:4200

# ✅ CORRECT
APP_CLIENT_DOMAIN=https://your-app.vercel.app
```

### 2. Using HTTP instead of HTTPS
```bash
# ❌ WRONG
APP_SCHEME=http

# ✅ CORRECT
APP_SCHEME=https
```

### 3. Weak JWT secret
```bash
# ❌ WRONG
JWT_SECRET=secret123

# ✅ CORRECT
JWT_SECRET=a1b2c3d4e5f6...64-character-random-string
```

### 4. Not setting NODE_ENV
```bash
# ❌ WRONG - Missing

# ✅ CORRECT
NODE_ENV=production
```

---

## 📝 Complete Production Checklist

- [ ] `APP_HOST=0.0.0.0`
- [ ] `APP_PORT=3000`
- [ ] `APP_CLIENT_DOMAIN` = actual frontend URL
- [ ] `APP_SCHEME=https`
- [ ] `APP_ID` = production identifier
- [ ] `HTTP_VERSION=1`
- [ ] `HTTP_VERSIONING_ENABLE=true`
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` = Railway PostgreSQL or external DB
- [ ] `JWT_SECRET` = strong random string (64+ chars)
- [ ] CORS configured correctly
- [ ] Client app deployed and URL updated

---

## 🎯 Quick Start Commands

```bash
# 1. Login to Railway
railway login

# 2. Link to project
railway link

# 3. Generate JWT secret
export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# 4. Set basic variables
railway variables set NODE_ENV=production
railway variables set APP_SCHEME=https
railway variables set APP_ID=easy-english-prod
railway variables set JWT_SECRET=$JWT_SECRET

# 5. Set client domain (UPDATE THIS!)
railway variables set APP_CLIENT_DOMAIN=https://YOUR-FRONTEND-URL.com

# 6. Verify variables
railway variables

# 7. Deploy
railway up
```

---

## 📚 References

- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [12-Factor App Config](https://12factor.net/config)
