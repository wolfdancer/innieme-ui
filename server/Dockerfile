# Build from the repo root so the workspace lockfile is used:
#   docker build -f server/Dockerfile .
# Build stage: compile TypeScript and native modules (hnswlib-node)
FROM node:24-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
COPY e2e/package.json e2e/
RUN npm ci -w server
COPY server/ server/
RUN npm run build -w server && npm prune --omit=dev -w server

# Use Node.js LTS version as the base image
FROM node:24-alpine
ENV NODE_ENV=production
# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
WORKDIR /app
RUN mkdir -p /app/config
# Production dependencies only (pruned in the build stage)
COPY --from=builder --chown=nodejs:nodejs /app ./
WORKDIR /app/server
USER nodejs

EXPOSE 3001
# Command to run the application
CMD ["node", "dist/server.js"]
