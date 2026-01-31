# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --only=production

# Install bird for inspiration feature
RUN npm install -g @steipete/bird

# Create directory for SQLite DB
RUN mkdir -p /app/data
ENV DB_PATH=/app/data/humor.db

EXPOSE 3001
CMD ["node", "dist/index.js"]
