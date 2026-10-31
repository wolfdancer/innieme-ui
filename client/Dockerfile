# Build stage
FROM node:24-bookworm-slim AS build

# Build from the repo root so the workspace lockfile is used:
#   docker build -f client/Dockerfile .

# Set working directory
WORKDIR /app

# Copy package files (root lockfile + every workspace manifest)
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
COPY e2e/package.json e2e/

# Install client dependencies exactly as locked
RUN npm ci -w client

# Copy source code
COPY client/ client/
WORKDIR /app/client

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Copy built assets from build stage
COPY --from=build /app/client/dist /usr/share/nginx/html

# Configure nginx to handle SPA routing
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]