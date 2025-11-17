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

- **KnowledgeService** (`server/src/services/KnowledgeService.ts`): Handles document processing (PDF, MD, TXT), text chunking (1000 chars with 200 overlap using RecursiveCharacterTextSplitter), and vector similarity search using LangChain with HNSW index and OpenAI embeddings (text-embedding-3-small)
- **OpenAIConversationService** (`server/src/services/OpenAIConversationService.ts`): Manages OpenAI API interactions (gpt-3.5-turbo), maintains a Map of topic IDs to KnowledgeService instances, performs similarity search to retrieve relevant context before sending to LLM
- **App initialization** (`server/src/app/index.ts`): Express server setup with rate limiting, CORS, retry logic for service initialization with exponential backoff (5 attempts, starting at 1s delay), middleware to block requests until initialization completes (returns 503)
- **IConversationService** (`server/src/services/IConversationService.ts`): Interface for conversation services allowing different implementations

### Frontend Architecture

- React with TypeScript using functional components and hooks
- Axios for API communication with exponential backoff retry logic for 503 errors (5 attempts with jitter)
- ReactMarkdown for rendering AI responses (HTML tags restricted via skipHtml)
- React Router for navigation between topic pages
- Maintains conversation history and sends it with each request for context
- Client-side API URL construction adapts to http/https based on window.location

### Configuration System

The system uses YAML configuration (`config.yaml`) defining:
- OpenAI API key
- "Outies" containing topics, where each outie has an ID and contains multiple topics
- Each topic has: name, ID (used as routing key), role (system prompt), and docs_dir (path to knowledge base documents)
- Documents are loaded from the specified directory and chunked during service initialization
- Configuration is loaded from CONFIG_PATH environment variable or defaults to `../../config.yaml` relative to server dist folder

## Project Structure

```
innieme-ui/
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.tsx           # Main chat component with retry logic
│   │   ├── router.tsx        # React Router configuration
│   │   ├── pages/            # Topic and Home page components
│   │   └── __tests__/        # Jest tests
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                    # Express backend
│   ├── src/
│   │   ├── server.ts         # Entry point, loads config and starts server
│   │   ├── app/
│   │   │   └── index.ts      # Express app setup with middleware
│   │   ├── config/
│   │   │   └── config.ts     # Config type definitions and YAML loader
│   │   └── services/
│   │       ├── IConversationService.ts
│   │       ├── KnowledgeService.ts
│   │       ├── OpenAIConversationService.ts
│   │       └── EchoConversationService.ts  # Mock service for testing
│   └── tsconfig.json
├── e2e/                       # Playwright E2E tests
│   └── tests/
│       └── chat.spec.ts
├── data/                      # Document directories for topics
├── config.yaml               # Main configuration (not in git)
└── package.json              # Root workspace configuration
```

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
npm run test              # Run all Playwright tests
npm run test:headed       # Run tests with browser UI
npm run test:chrome       # Run only Chrome tests
npm run test:firefox      # Run only Firefox tests
npm run test:webkit       # Run only WebKit tests
npm run debug             # Debug mode
npm run report            # View test results
npm run install:browsers  # Install Playwright browsers
```

## Docker Support

The project includes Docker support with multiple configurations:

### Building Images
```bash
npm run docker:build              # Build both client and server images
npm run docker:build:version      # Build with git commit tags
npm run docker:build:debug        # Build debug versions
```

### Running Containers
```bash
npm run docker:run:server         # Run server on port 3001
npm run docker:run:client         # Run client on port 3000
npm run docker:up:debug           # Start with docker-compose (debug mode)
npm run docker:down:debug         # Stop docker-compose services
```

### Utilities
```bash
npm run docker:clean              # Clean up Docker system
npm run docker:stop:server        # Stop running server container
npm run docker:stop:debug         # Stop debug containers
```

Docker Compose files available:
- `docker-compose.yml`: Production configuration
- `docker-compose.debug.yml`: Debug configuration with volume mounts for config and data

## API Endpoints

### POST /api/chat
Main chat endpoint for conversation with knowledge-augmented responses.

**Request Body:**
```json
{
  "message": "string",          // Required: User's message
  "topic": "string",            // Optional: Topic ID from config.yaml
  "history": [                  // Optional: Conversation history
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

**Response:**
```json
{
  "ping": "string",             // Original message
  "pong": "string",             // AI response
  "received": "ISO timestamp",
  "responded": "ISO timestamp"
}
```

### GET /api/heartbeat
Simple endpoint to test OpenAI connectivity.

**Query Parameters:**
- `message` (optional): Test message to send to OpenAI

**Returns:** Same response format as /api/chat

## Key Technical Details

### API Behavior
- Server returns 503 status during initialization (knowledge base loading)
- Client automatically retries 503 errors with exponential backoff
- Topic matching: if topic ID is provided, relevant documents are retrieved via similarity search before generating response
- Conversation history is maintained client-side and sent with each request

### Rate Limiting
- 20 requests per minute per IP address
- Applied globally via express-rate-limit middleware
- Returns appropriate error message when limit exceeded
- Trust proxy setting enabled for correct IP detection behind reverse proxies

### Error Handling
- Client retries 503 errors with exponential backoff and jitter (5 attempts)
- Server initialization uses exponential backoff retry (5 attempts, starting at 1s delay)
- Comprehensive error logging with stack traces
- Status code mapping: 400 for validation errors, 500 for server errors, 503 during initialization

### Knowledge Base Processing
- Supports PDF, MD, and TXT file formats
- Text chunking: 1000 characters with 200 character overlap
- Vector embeddings: OpenAI text-embedding-3-small model
- Similarity search returns top 5 most relevant chunks by default
- HNSW (Hierarchical Navigable Small World) algorithm for efficient vector search

### Testing Strategy
- Jest for unit tests in both client and server
- Playwright for end-to-end testing across Chrome, Firefox, and WebKit
- Test files located in `__tests__` directories and `e2e/tests`
- Testing utilities: React Testing Library, supertest for API testing

### Security
- CORS enabled for cross-origin requests
- Rate limiting to prevent abuse
- HTML sanitization in markdown rendering (skipHtml flag)
- Trust proxy configuration for proper IP detection
- API key stored in config.yaml (not committed to git)

## Environment Variables

### Server
- `CONFIG_PATH`: Path to config.yaml file (default: `../../config.yaml` relative to dist folder)
- `PORT`: Server port (default: 3001)

### Client (Vite)
- `VITE_API_URL`: API server URL (runtime detection from window.location if not set)

## Deployment Notes

- Server runs on port 3001 by default, client on port 3000
- Production client build served as static files
- Nginx configuration in `bootstrap.sh` shows reverse proxy setup for SSL/TLS
- Docker debug mode mounts `config.yaml` and `data/` directory as volumes for live updates
- Knowledge base initialization happens on server startup and can take 10-30+ seconds depending on document count
- Vector store is built in-memory on each startup (not persisted to disk)