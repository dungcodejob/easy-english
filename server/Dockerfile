# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Build application (needs devDependencies like @nestjs/testing)
RUN npm run build

# Install only production dependencies for final image
RUN npm ci --only=production && \
  npm cache clean --force

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

# Copy built application from builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/tsconfig.json ./  
COPY --from=builder --chown=nestjs:nodejs /app/src/core/database/migrations ./src/core/database/migrations
COPY --from=builder --chown=nestjs:nodejs /app/src/core/configs ./src/core/configs

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run migrations and start application
# Use compiled JS config (now using relative paths)
CMD ["sh", "-c", "npx mikro-orm migration:up --config ./dist/core/configs/database.config.js && node dist/main"]
