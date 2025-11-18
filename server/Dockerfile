# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env* ./
COPY --from=builder /app/migration.sh ./migration.sh


# Grant permission
RUN chmod +x ./migration.sh

RUN npm install --only=production --legacy-peer-deps
EXPOSE 3000
CMD ["sh", "./migration.sh"]