# Build stage: compile TypeScript and native modules (hnswlib-node)
FROM node:24-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && npm prune --omit=dev

# Use Node.js LTS version as the base image
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN mkdir -p /app/config
COPY package*.json ./
# Production dependencies only (pruned in the build stage)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Create a non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
# Command to run the application
CMD ["node", "dist/server.js"]
