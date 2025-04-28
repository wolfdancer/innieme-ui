# Use Node.js LTS version as the base image
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN mkdir -p /app/config
COPY package*.json ./
# Install production dependencies only
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
# Create a non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
# Command to run the application
CMD ["node", "dist/server.js"]