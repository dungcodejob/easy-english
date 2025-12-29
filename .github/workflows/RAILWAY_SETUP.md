# Railway Configuration for GHCR Deployment

## 🎯 Overview

Để deploy Docker image từ GitHub Container Registry (GHCR) lên Railway thay vì để Railway build, bạn cần config Railway service để pull image từ GHCR.

## 📋 Setup Steps

### Step 1: Enable GHCR Image in Railway

1. **Vào Railway Dashboard**
   - Login vào [Railway](https://railway.app)
   - Chọn project của bạn

2. **Navigate to Service Settings**
   - Click vào service (backend/server)
   - Click tab **"Settings"**

3. **Configure Image Source**
   
   **Option A: Using Railway UI (Recommended)**
   - Scroll xuống **"Source"** section
   - Click **"Change Source"** hoặc **"Configure"**
   - Chọn **"Image"** thay vì **"GitHub Repo"**
   - Nhập image URL:
     ```
     ghcr.io/<your-github-username>/<your-repo-name>/backend:latest
     ```
   - Click **"Save"**

   **Option B: Using railway.json (Alternative)**
   - Tạo file `railway.json` trong `server/` directory:
     ```json
     {
       "$schema": "https://railway.app/railway.schema.json",
       "build": {
         "image": "ghcr.io/<username>/<repo>/backend:latest"
       },
       "deploy": {
         "restartPolicyType": "ON_FAILURE",
         "restartPolicyMaxRetries": 10
       }
     }
     ```

### Step 2: Configure Environment Variables

Railway **PHẢI** có các environment variables sau:

| Variable | Value | Note |
|----------|--------|------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | PostgreSQL connection string |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `3000` | (Optional, Railway tự inject) |

**Cách thêm:**
1. Railway Service → Tab **"Variables"**
2. Click **"+ New Variable"**
3. Nhập tên và giá trị
4. Click **"Add"**

### Step 3: Verify Image is Public or Add Authentication

**GHCR Images có 2 loại:**

#### Option A: Public Image (Recommended cho free tier)

1. **Make repository public:**
   - GitHub Repo → Settings → Change visibility to Public
   
2. **Make package public:**
   - GitHub → Profile → Packages
   - Click vào package `backend`
   - Package settings → Change visibility to Public

**Railway có thể pull public images mà không cần authentication.**

#### Option B: Private Image (Requires authentication)

Nếu repo private, Railway cần GHCR credentials:

1. **Create GitHub Personal Access Token (PAT):**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Scopes: ✅ `read:packages`
   - Copy token

2. **Add credentials to Railway:**
   ```bash
   # Using Railway CLI
   railway variables set DOCKER_USERNAME=<your-github-username>
   railway variables set DOCKER_PASSWORD=<your-PAT-token>
   ```
   
   Or in Railway UI:
   - Service → Variables → Add:
     - `DOCKER_USERNAME`: your GitHub username
     - `DOCKER_PASSWORD`: your PAT token

### Step 4: Test Deployment

1. **Trigger deployment:**
   - Vào GitHub Actions
   - Run workflow **"Deploy Backend to Railway"**
   - Chọn branch `master`

2. **Monitor Railway logs:**
   ```bash
   # Using Railway CLI
   railway logs
   
   # Or in Railway UI
   # Service → Deployments → Click deployment → Logs
   ```

3. **Verify deployment:**
   - Check logs for:
     - ✅ "Pulling image from ghcr.io..."
     - ✅ "Image pulled successfully"
     - ✅ "Migrations completed"
     - ✅ "Server is running on port 3000"

## 🔄 How It Works

### Deployment Flow

```mermaid
graph TD
    A[GitHub Actions] -->|1. Build| B[Docker Image]
    B -->|2. Push| C[GHCR]
    C -->|3. Railway pulls| D[Railway Service]
    D -->|4. Run| E[Container]
    E -->|5. Migrations| F[Database]
    F -->|6. Start| G[App Running]
```

### What GitHub Actions Does
1. ✅ Build Docker image from Dockerfile
2. ✅ Push image to GHCR với tags:
   - `v1.0.X` (version tag)
   - `latest` (always points to newest)
3. ✅ Trigger Railway deployment

### What Railway Does
1. ✅ Pull image từ GHCR
2. ✅ Run container với env vars
3. ✅ Expose port 3000
4. ✅ Monitor health checks

## 🚀 Advantages

**Why build on GitHub Actions instead of Railway:**

| Aspect | Railway Build | GitHub Actions Build |
|--------|--------------|---------------------|
| **Cost** | Uses Railway build minutes | Free (2000 min/month) |
| **Free Tier** | Limited build time | Generous limits |
| **Build Speed** | Moderate | Fast (parallel builds) |
| **Caching** | Basic | Advanced (GHA cache) |
| **Build Logs** | Railway only | GitHub + Railway |

**For Railway Free Tier: GitHub Actions build is BETTER!**

## 🔧 Troubleshooting

### Issue: "Failed to pull image"

**Possible causes:**
1. Image doesn't exist in GHCR
2. Image is private but no credentials
3. Wrong image URL

**Solutions:**
```bash
# Check if image exists
docker manifest inspect ghcr.io/<username>/<repo>/backend:latest

# Verify image is public
# GitHub → Packages → backend → Settings → Visibility

# Check Railway image URL
# Railway → Service → Settings → Source → Verify URL
```

### Issue: "Authentication required"

**Solution:** Image is private, add credentials:
```bash
railway variables set DOCKER_USERNAME=<username>
railway variables set DOCKER_PASSWORD=<PAT>
```

### Issue: "Image pull timeout"

**Causes:**
- Image too large
- Network issues
- GHCR rate limits

**Solutions:**
- Optimize Dockerfile (reduce image size)
- Retry deployment
- Check GHCR status

### Issue: "Container fails to start"

**Check:**
1. Railway logs: `railway logs`
2. Environment variables are set
3. Image has correct CMD
4. Health check endpoint works

## 📊 Monitoring

### Check Image Tags
```bash
# List all images
gh api /user/packages/container/easy-english%2Fbackend/versions

# Or visit GitHub
# Profile → Packages → backend → Package versions
```

### Check Railway Deployments
```bash
# Using Railway CLI
railway status
railway logs --tail

# Or Railway UI
# Service → Deployments → View logs
```

## 💡 Best Practices

1. **Always use version tags:** Don't rely only on `latest`
2. **Keep images small:** Use multi-stage builds
3. **Test locally:** `docker pull ghcr.io/...` before deploying
4. **Monitor GHCR storage:** Free tier has limits
5. **Clean old images:** Remove unused versions

## 🔐 Security

- ✅ GHCR images are scanned for vulnerabilities
- ✅ Use minimal base images (alpine)
- ✅ Run as non-root user
- ✅ Don't include secrets in image
- ✅ Use Railway env vars for secrets

## 📚 References

- [Railway Docs - Docker Deployments](https://docs.railway.app/deploy/deployments)
- [GHCR Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions - Docker Build](https://github.com/marketplace/actions/build-and-push-docker-images)
