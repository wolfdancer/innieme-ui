# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InnieMe is an AI-powered knowledge management system that allows users to interact with topic-specific chatbots backed by document collections. The system consists of a React frontend, Node.js/Express backend, and uses OpenAI for conversation and embeddings with vector search for knowledge retrieval.

## Architecture

This is a monorepo with three main workspaces:
- **client/**: React TypeScript frontend using Vite
- **server/**: Node.js/Express TypeScript backend with OpenAI integration
- **e2e/**: Playwright end-to-end tests

### Key Backend Components

- **KnowledgeService** (`server/src/services/KnowledgeService.ts`): Handles document processing (PDF, MD, TXT), text chunking, and vector similarity search using LangChain and HNSW
- **OpenAIConversationService** (`server/src/services/OpenAIConversationService.ts`): Manages OpenAI API interactions and integrates knowledge retrieval with chat responses
- **App initialization** (`server/src/app/index.ts`): Express server setup with rate limiting, CORS, retry logic for service initialization

### Frontend Architecture

- React with TypeScript using functional components and hooks
- Axios for API communication with exponential backoff retry logic for 503 errors
- ReactMarkdown for rendering AI responses (HTML tags restricted)
- React Router for navigation between topic pages

### Configuration System

The system uses YAML configuration (`config.yaml`) defining:
- OpenAI API key
- Topic definitions with custom roles, IDs, names, and document directories
- Each topic has its own knowledge base from documents in specified directories

## Common Development Commands

### Root Level Commands
```bash
# Install all dependencies
npm run install:all

# Start both client and server in development
npm start

# Build both client and server
npm run build

# Run tests for both client and server
npm test

# Run e2e tests
npm run test:e2e
```

### Client-Specific Commands
```bash
cd client
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run test       # Run Jest tests
npm run test:watch # Run tests in watch mode
```

### Server-Specific Commands
```bash
cd server
npm run dev   # Start with nodemon (auto-reload)
npm run build # Compile TypeScript
npm run test  # Run Jest tests
```

### E2E Testing Commands
```bash
cd e2e
npm run test           # Run all Playwright tests
npm run test:headed    # Run tests with browser UI
npm run test:chrome    # Run only Chrome tests
npm run debug          # Debug mode
npm run report         # View test results
```

## Docker Support

The project includes Docker support with multiple configurations:
- Production builds: `npm run docker:build`
- Debug builds: `npm run docker:build:debug`
- Docker Compose: `docker-compose.yml` and `docker-compose.debug.yml`

## Key Technical Details

### Rate Limiting
The server implements rate limiting (20 requests per minute per IP) and includes retry logic with exponential backoff.

### Error Handling
- Client handles 503 errors with exponential backoff retry
- Server includes comprehensive error logging and status code mapping
- Service initialization has retry mechanism with exponential backoff

### Testing Strategy
- Jest for unit tests in both client and server
- Playwright for end-to-end testing
- Test coverage includes API endpoints and React components

### Security
- CORS enabled for cross-origin requests
- Rate limiting to prevent abuse
- HTML sanitization in markdown rendering
- Trust proxy configuration for proper IP detection