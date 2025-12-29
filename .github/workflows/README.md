# GitHub Actions CI/CD Workflows - Backend Deployment

Workflows để deploy Backend (NestJS server) lên Railway sử dụng Docker containers **built on GitHub Actions** và pushed to **GitHub Container Registry (GHCR)**, optimized cho Railway **free tier**.

## ✨ Why GitHub Actions Build?

**Optimized for Railway Free Tier:**
- ✅ **Build on GitHub Actions**: Free 2000 minutes/month
- ✅ **Push to GHCR**: Unlimited bandwidth, free for public repos
- ✅ **Railway pulls image**: Saves Railway build minutes
- ✅ **Faster deployments**: Pre-built images deploy instantly

## 📋 Prerequisites

### 1. Railway Token
Tạo Railway API token:
1. Vào [Railway Dashboard](https://railway.app)
2. Click vào account settings (góc trên bên phải)
3. Chọn "Tokens" tab
4. Click "New Token"
5. Copy token

### 2. GitHub Secrets Configuration
Thêm secret sau vào GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `RAILWAY_TOKEN` | Railway API token | ✅ Yes |

**Note:** `GITHUB_TOKEN` tự động available, không cần thêm.

### 3. Railway Service Configuration

**QUAN TRỌNG:** Railway phải được config để pull image từ GHCR thay vì build từ source.

**Xem chi tiết:** [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)

**TL;DR:**
1. Railway Service → Settings → Source → Change to **"Image"**
2. Image URL: `ghcr.io/<your-github-username>/<your-repo>/backend:latest`
3. Make GHCR package public (hoặc add credentials)

### 4. Railway Environment Variables Setup

**Railway Dashboard → Service → Variables**

| Variable | Example Value | Required |
|----------|---------------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | ✅ Yes |
| `JWT_SECRET` | `your-secret-key` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `PORT` | `3000` | ⚠️ Optional |

### 5. Make GHCR Package Public

Để Railway có thể pull image miễn phí:

1. **Make repo public** (recommended) hoặc
2. **Make package public**:
   - GitHub → Profile → Packages
   - Click package `backend`
   - Settings → Change visibility to Public

Alternatively, add GHCR credentials to Railway (xem [RAILWAY_SETUP.md](./RAILWAY_SETUP.md))

## 🐳 Docker Deployment Architecture

### Docker Architecture

**Multi-stage Build:**
1. **Builder stage:** Build TypeScript code
2. **Production stage:** Copy artifacts, run app

**Build Process:**
1. **GitHub Actions:** Builds Docker image
2. **GHCR:** Stores image with version tags
3. **Railway:** Pulls and runs pre-built image

**Features:**
- ✅ Built on GitHub Actions (saves Railway build time)
- ✅ Cached layers for fast builds
- ✅ Pushed to GHCR with version tags
- ✅ Railway pulls pre-built image
- ✅ Auto-run migrations on startup

**Dockerfile location:** `server/Dockerfile`

### How Railway Handles GHCR Images

```mermaid
graph LR
    A[GitHub Actions] --> B[Build Docker Image]
    B --> C[Push to GHCR]
    C --> D[Railway Webhook]
    D --> E[Railway pulls image]
    E --> F[Run container]
    F --> G[Migrations run]
    G --> H[App starts]
```

**Railway automatically:**
1. Gets notified of new deployment
2. Pulls image from GHCR (configured image URL)
3. Runs container with env vars injected
4. Exposes port 3000
5. Monitors health check

## 🚀 Workflows

### 1. Deploy Backend to Railway (`deploy-backend.yml`)

**Mục đích:** Build Docker image on GitHub Actions, push to GHCR, deploy to Railway.

**Triggers:**
- ⚠️ **Auto (commented out):** Uncomment lines 5-7 để enable auto-deploy
- ✅ **Manual:** Run workflow từ Actions tab

**Quy trình:**
1. Checkout code
2. Get version (auto-increment patch)
3. **Build Docker image on GitHub Actions**
4. **Push to GHCR** với tags:
   - `v1.0.X` (version tag)
   - `latest`
   - `{branch}-{sha}` (commit tag)
5. Railway deployment (pulls pre-built image)
6. Create version tag
7. Push tag + Create GitHub Release

**Image Tags:**
- `ghcr.io/<username>/<repo>/backend:v1.0.0`
- `ghcr.io/<username>/<repo>/backend:latest`
- `ghcr.io/<username>/<repo>/backend:master-abc1234`

**Cách enable auto-deploy:**
Uncomment lines trong workflow file:
```yaml
on:
  push:
    branches:
      - master
```

**Cách dùng Manual Deploy:**
1. Vào tab **Actions** trên GitHub
2. Click workflow **"Deploy Backend to Railway"**
3. Click **"Run workflow"**
4. Chọn branch muốn deploy
5. Click **"Run workflow"** button

---

### 2. Rollback Backend Deployment (`rollback-backend.yml`)

**Mục đích:** Rollback Backend về version cũ sử dụng Git tags.

**Triggers:**
- ✅ **Manual only**

**Quy trình:**
1. Validate tag format
2. Checkout code từ tag
3. Verify tag exists
4. Deploy to Railway (Railway builds Docker từ tag)
5. (Optional) Create rollback tag

**Cách dùng:**
1. Vào tab **Actions**
2. Click workflow **"Rollback Backend Deployment"**
3. Click **"Run workflow"**
4. Nhập tag version (e.g., `v1.0.5`)
5. Chọn create rollback tag (recommended: true)
6. Click **"Run workflow"**

---

## 📊 Version Management

### Semantic Versioning
Format: `v{major}.{minor}.{patch}`

**Auto-increment:**
- Workflow tự động tăng **patch** version
- `v1.0.0` → `v1.0.1` → `v1.0.2`

**Manual bump:**
```bash
# Bump minor version
git tag -a v1.1.0 -m "Release v1.1.0 - New features"
git push origin v1.1.0

# Bump major version
git tag -a v2.0.0 -m "Release v2.0.0 - Breaking changes"
git push origin v2.0.0
```

---

## 🔧 Troubleshooting

### Issue: "Dockerfile not found"
**Solution:** 
- Ensure Dockerfile exists in `server/` directory
- Check workflow `cd server` command

### Issue: "Migrations failed"
**Solution:**
1. Check Railway logs for migration errors
2. Verify `DATABASE_URL` is set correctly in Railway
3. Check migrations files exist in Docker image
4. Manually run migrations: `railway run npx mikro-orm migration:up`

### Issue: "Container fails to start"
**Solution:**
1. Check Railway logs: `railway logs`
2. Verify all env vars are set
3. Check health endpoint: `/api/v1/health`
4. Test Dockerfile locally:
```bash
cd server
docker build -t test-server .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=test \
  test-server
```

### Issue: "Railway Token invalid"
**Solution:**
- Regenerate token in Railway dashboard
- Update `RAILWAY_TOKEN` in GitHub Secrets

### Issue: "Build timeout"
**Solution:**
- Check if dependencies are cached correctly
- Verify `.dockerignore` excludes `node_modules`
- Railway free tier has build time limits

---

## 🔐 Security Best Practices

- ✅ Never commit secrets to code
- ✅ Use GitHub Secrets for sensitive data
- ✅ Railway injects env vars at runtime
- ✅ Docker runs as non-root user
- ✅ Health checks enabled
- ✅ Minimal image size (multi-stage build)

---

## 📈 Monitoring

### Railway Dashboard
1. **Deployments tab:** View deployment history
2. **Logs tab:** Real-time application logs
3. **Metrics tab:** CPU, RAM, Network usage
4. **Health checks:** Automatic monitoring

### GitHub Actions
1. **Actions tab:** View workflow runs
2. **Releases tab:** View all versions
3. **Tags:** Version history

---

## 🧪 Testing

### Local Docker Testing
```bash
# Build image
cd server
docker build -t easy-english-backend .

# Run with env vars
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://localhost:5432/testdb \
  -e JWT_SECRET=test-secret \
  -e NODE_ENV=production \
  easy-english-backend

# Test API
curl http://localhost:3000/api/v1/health
```

### Test Workflow (Dry Run)
1. Comment out Railway deployment step
2. Run manual workflow
3. Verify build succeeds
4. Check tag creation logic

---

## 💡 Tips

### Cost Optimization
 - ✅ **GitHub Actions Build:** Use free 2000 minutes/month on GitHub instead of Railway build minutes
 - ✅ **No Railway Build Minutes:** Railway only runs the image, doesn't build it
 - ✅ **Docker Layer Caching:** Faster builds on GitHub
 - ✅ **Multi-stage build:** Smaller image = faster deploy/pull

### Deployment Strategy
1. **Feature branches:** Test locally first
2. **Pull Requests:** Review before merge
3. **Merge to master:** (Optional) Auto-deploy
4. **Manual deploy:** For hotfixes/testing

### Rollback Strategy
1. Keep 5-10 stable versions tagged
2. Test rollback process periodically
3. Document known good versions
4. Have monitoring alerts set up

---

## 📚 References

- [Railway Docs - Docker Deployments](https://docs.railway.app/deploy/dockerfiles)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
