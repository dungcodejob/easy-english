# 🚀 Quick Setup - Production Environment Variables

## ⚡ TL;DR - Những gì cần thay đổi

| Variable | Development | Production | Notes |
|----------|------------|------------|-------|
| `NODE_ENV` | `dev` | `production` | ✅ Required |
| `APP_HOST` | `localhost` | `0.0.0.0` | Railway auto |
| `APP_CLIENT_DOMAIN` | `http://localhost:4200` | `https://your-app.vercel.app` | ⚠️ **MUST CHANGE** |
| `APP_SCHEME` | `http` | `https` | ✅ Required |
| `APP_ID` | `app_id` | `easy-english-prod` | Recommended |
| `DATABASE_URL` | Local PostgreSQL | Railway PostgreSQL URL | Railway auto-provides |
| `JWT_*_SECRET` | Simple strings | **Strong random 64-char** | ⚠️ **CRITICAL** |
| `COOKIE_SECRET` | Simple string | **Strong random 32-char** | ⚠️ **CRITICAL** |
| `THROTTLE_LIMIT` | `3` | `100` | Increase for production |

---

## 🔑 Generate Secrets (Copy & Run)

```bash
# Generate all secrets at once
node -e "
const crypto = require('crypto');
console.log('JWT_ACCESS_TOKEN_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('JWT_REFRESH_TOKEN_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('JWT_CONFIRMATION_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('JWT_RESET_PASSWORD_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('COOKIE_SECRET=' + crypto.randomBytes(32).toString('hex'));
"
```

Copy output và paste vào Railway Variables!

---

## 🎯 Railway Setup (3 Steps)

### Step 1: Add PostgreSQL (if needed)

```bash
# In Railway Dashboard
Project → New → Database → Add PostgreSQL
```

Railway tự động tạo `DATABASE_URL` variable.

### Step 2: Set Variables

**Railway Dashboard → Service → Variables → Raw Editor**

Paste this (⚠️ **replace placeholders**):

```bash
NODE_ENV=production
APP_HOST=0.0.0.0
APP_PORT=3000
APP_CLIENT_DOMAIN=https://YOUR-FRONTEND-URL.com
APP_SCHEME=https
APP_ID=easy-english-prod
HTTP_VERSION=1
HTTP_VERSIONING_ENABLE=true
COOKIE_REFRESH_NAME=refresh_token
COOKIE_SECRET=PASTE_GENERATED_SECRET_HERE
JWT_ACCESS_TOKEN_SECRET=PASTE_GENERATED_SECRET_HERE
JWT_ACCESS_TOKEN_EXPIRED=3600000
JWT_REFRESH_TOKEN_SECRET=PASTE_GENERATED_SECRET_HERE
JWT_REFRESH_TOKEN_EXPIRED=604800000
JWT_CONFIRMATION_SECRET=PASTE_GENERATED_SECRET_HERE
JWT_CONFIRMATION_EXPIRED=86400000
JWT_RESET_PASSWORD_SECRET=PASTE_GENERATED_SECRET_HERE
JWT_RESET_PASSWORD_EXPIRED=3600000
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Step 3: Deploy

```bash
# GitHub Actions → Deploy Backend to Railway → Run workflow
```

✅ Done!

---

## ⚠️ CRITICAL - Don't Forget!

1. **`APP_CLIENT_DOMAIN`** ← Phải là URL thật của frontend (sau khi deploy client)
2. **All `JWT_*_SECRET`** ← Phải generate random, KHÔNG dùng giá trị dev
3. **`COOKIE_SECRET`** ← Generate random
4. **`APP_SCHEME`** ← Phải là `https` trong production

---

## 📋 Pre-Deployment Checklist

- [ ] Generated all JWT secrets (random 64-char)
- [ ] Generated COOKIE_SECRET (random 32-char)
- [ ] Updated `APP_CLIENT_DOMAIN` to actual frontend URL
- [ ] Set `NODE_ENV=production`
- [ ] Set `APP_SCHEME=https`
- [ ] Railway PostgreSQL added (or external DB URL set)
- [ ] Increased `THROTTLE_LIMIT` to 100+
- [ ] All secrets pasted into Railway Variables
- [ ] GHCR package is public (or credentials added)
- [ ] Railway configured to pull from GHCR

---

## 🧪 Quick Test

After setting variables:

```bash
# Check Railway logs
railway logs

# Should see:
# ✅ "Server is running on port 3000"
# ✅ "Database connected"
# ✅ "Migrations completed"
```

Test health endpoint:
```bash
curl https://your-railway-app.railway.app/api/v1/health
```

---

## 🆘 Common Issues

**Issue:** "Database connection failed"
- ✅ Check `DATABASE_URL` is set
- ✅ Railway PostgreSQL plugin added

**Issue:** "Unauthorized" errors
- ✅ Check all `JWT_*_SECRET` are set
- ✅ Secrets are different from dev values

**Issue:** CORS errors
- ✅ `APP_CLIENT_DOMAIN` matches actual frontend URL
- ✅ Include protocol (`https://`)

---

## 📚 Full Documentation

- [ENV_VARS_GUIDE.md](./ENV_VARS_GUIDE.md) - Complete guide
- [.env.prod.template](../server/.env.prod.template) - Template file
- [RAILWAY_SETUP.md](./RAILWAY_SETUP.md) - Railway configuration

---

**Need help?** Check the full guides above! 🚀
