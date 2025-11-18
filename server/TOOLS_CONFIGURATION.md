# Tools Configuration Guide

This document explains how to configure tools (web_search and webcal) for InnieMe topics.

## Overview

InnieMe supports configuring external tools for topics, allowing the AI to access additional capabilities beyond its knowledge base and training data. Currently supported tools are:

- **web_search**: Enables web searches to look up current, real-time information
- **webcal**: Allows querying calendar events from a webcal URL

## Configuration Format

Tools are configured in the `config.yaml` file under each topic's `tools` array.

### Basic Structure

```yaml
outies:
  - outie_id: "example-outie"
    topics:
      - name: "Example Topic"
        id: "example-topic"
        role: "You are a helpful assistant."
        docs_dir: "./data/example"
        tools:
          - name: "web_search"
            description: "Useful for when you need to look up current, real-time information on the web."
            type: "web_search"
          - name: "calendar"
            description: "Look up events in the calendar."
            type: "webcal"
            url: "webcal://example.com/calendar.ics"
```

## Tool Types

### 1. Web Search

The web_search tool allows the AI to search the web for current information.

**Required fields:**
- `name`: A unique identifier for the tool (e.g., "web_search")
- `description`: A clear description of when and how to use the tool
- `type`: Must be "web_search"

**Optional fields:**
- None

**Example:**
```yaml
tools:
  - name: "web_search"
    description: "Useful for when you need to look up current, real-time information on the web."
    type: "web_search"
```

### 2. Webcal (Calendar)

The webcal tool allows the AI to query events from a calendar feed.

**Required fields:**
- `name`: A unique identifier for the tool (e.g., "calendar")
- `description`: A clear description of when and how to use the tool
- `type`: Must be "webcal"
- `url`: The webcal URL pointing to the calendar feed (in webcal:// format)

**Security Note:** All events served through the URL can potentially be communicated by the configured InnieMe. Do not rely solely on role-based configurations to restrict event sharing.

**Example:**
```yaml
tools:
  - name: "calendar"
    description: "Look up events in the calendar."
    type: "webcal"
    url: "webcal://pleasanton998.mytroop.us/ical/feed/6c856f19-34f2-4fc4-822b-b5ccf3deae55"
```

## Complete Example

Here's a complete example showing a topic with both tools configured:

```yaml
openai_api_key: "your-api-key-here"

outies:
  - outie_id: "scouts"
    topics:
      - name: "Artificial Intelligence Merit Badge"
        id: "ai-merit-badge"
        tools:
          - name: "web_search"
            description: "Useful for when you need to look up current, real-time information on the web."
            type: "web_search"
          - name: "calendar"
            description: "Look up events in the calendar."
            type: "webcal"
            url: "webcal://<url>"
        role: |
          You are an AI assistant helping Boy Scouts learn about artificial intelligence
          for their AI Merit Badge. You have access to web search for current information
          and can check the troop calendar for upcoming events.
        docs_dir: "./data/ai-merit-badge"
```

## Implementation Details

### Type Definitions

The TypeScript types for tools are defined in `server/src/config/config.ts`:

```typescript
export interface Tool {
    name: string;
    description: string;
    type: 'web_search' | 'webcal';
    url?: string; // Required for webcal type
}

export interface Topic {
    name: string;
    id: string;
    role: string;
    docs_dir: string;
    tools?: Tool[]; // Optional array of tools
}
```

### OpenAI Integration and Tool Execution

When tools are configured for a topic, they are automatically converted to OpenAI's function calling format and included in the chat completion API calls. The OpenAI model can then decide when to use these tools based on the user's query.

#### Tool Registration

The conversion happens in `OpenAIConversationService.convertToolsToOpenAIFormat()`, which maps:
- Tool name → function name
- Tool description → function description
- Tool type → function parameters schema (query parameter for both web_search and webcal)

#### Tool Execution Flow

When OpenAI requests a tool call, the following happens automatically:

1. **Tool Call Detection**: The response message is checked for `tool_calls`
2. **Tool Execution**: Each requested tool is executed via `executeTool()`:
   - **web_search**: Currently returns a placeholder message (ready for integration with real search API)
   - **webcal**: Fetches the iCal feed, parses events, and filters by query
3. **Result Return**: Tool results are added to the conversation as `tool` role messages
4. **Final Response**: A second API call is made with tool results to get the final AI response

#### Tool Implementations

**Web Search (`executeWebSearch`)**:
- Currently returns a placeholder indicating the feature needs API integration
- Ready to integrate with services like Google Custom Search, Bing API, or Brave Search API
- Logs the search query for debugging

**Webcal (`executeWebcal`)**:
- Converts `webcal://` URLs to `https://` for fetching
- Parses iCal format to extract events (SUMMARY, DTSTART, DESCRIPTION)
- Filters events by query string (searches in summary and description)
- Returns up to 10 matching events with formatted dates
- Handles errors gracefully with descriptive error messages

### Logging

When tools are configured and used, the server logs:
```
Topic has X tool(s) configured: tool_name_1, tool_name_2
AI requested N tool call(s)
Executing tool: tool_name with args: {...}
Tool tool_name result: [first 100 chars of result]
```

This helps verify that tools are being loaded and executed correctly.

## Best Practices

1. **Clear Descriptions**: Write clear, specific descriptions for each tool to help the AI understand when to use them.

2. **Security**: Be aware that:
   - Web search tools may expose the AI to external content
   - Webcal URLs should only point to calendars you're comfortable sharing
   - All calendar events are potentially accessible to users

3. **Optional Tools**: Tools are optional - topics work perfectly fine without any tools configured.

4. **Testing**: After configuring tools, check the server logs to verify they're being loaded correctly.

## Troubleshooting

### Tools not being used

If tools are configured but not being used:
1. Check server logs for "Topic has X tool(s) configured" message
2. Verify the tool descriptions clearly indicate when they should be used
3. Ensure the OpenAI API key has access to function calling (requires gpt-3.5-turbo or later)

### Configuration errors

If you get errors on startup:
1. Verify YAML syntax is correct (proper indentation, quotes)
2. Ensure required fields are present (name, description, type)
3. For webcal tools, verify the `url` field is provided

### TypeScript compilation errors

If you get TypeScript errors:
1. Ensure you're using the latest type definitions from `config.ts`
2. Run `npm run build` in the server directory to check for type errors
3. Verify tool objects match the `Tool` interface exactly

### Webcal calendar not accessible

If webcal calendar fetching fails:
1. Verify the URL is accessible via browser (replace `webcal://` with `https://`)
2. Check for CORS or authentication issues
3. Ensure the URL returns valid iCal format data
4. Check server logs for specific error messages

## Configuring Web Search with Brave Search API

The `web_search` tool is now integrated with the Brave Search API. To enable web search functionality:

### Setup Instructions

1. **Get a Brave Search API key:**
   - Visit [brave.com/search/api](https://brave.com/search/api/)
   - Sign up for an API key (free tier available)
   - Copy your API key

2. **Add the API key to your config.yaml:**
   ```yaml
   openai_api_key: "your-openai-key-here"
   brave_api_key: "your-brave-api-key-here"  # Add this line

   outies:
     - outie_id: "example-outie"
       topics:
         - name: "Example Topic"
           id: "example-topic"
           role: "You are a helpful assistant."
           docs_dir: "./data/example"
           tools:
             - name: "web_search"
               description: "Useful for when you need to look up current, real-time information on the web."
               type: "web_search"
   ```

3. **Restart the server** to load the new configuration

### How It Works

When a topic has the `web_search` tool configured:
- The AI can call the web search function when it needs current information
- The system uses the Brave Search API to fetch up to 5 relevant results
- Results include titles, URLs, and descriptions
- The AI incorporates the search results into its response

### Without an API Key

If you configure the `web_search` tool without providing a `brave_api_key` in your config:
- The tool will return a placeholder message indicating that an API key is required
- The system will log that web search is not configured
- No errors will occur - it gracefully degrades

### Rate Limits and Costs

- Brave Search API free tier: 2,000 queries per month
- Rate limits apply (check Brave's documentation for current limits)
- The system handles rate limit errors gracefully

### Troubleshooting

**Search not working:**
1. Verify `brave_api_key` is in config.yaml
2. Check server logs for "Brave Search API initialized" message
3. Ensure API key is valid (test at [api.search.brave.com](https://api.search.brave.com))

**Rate limit errors:**
- Upgrade your Brave API plan
- Or implement result caching (not currently supported)

**Invalid API key errors:**
- Double-check the API key in config.yaml
- Ensure there are no extra spaces or quotes

### Alternative Search APIs

While the system is configured to use Brave Search API, you can implement other search providers by:

1. Creating a new search service class (similar to `BraveSearchService.ts`)
2. Updating `OpenAIConversationService.ts` to use the new service
3. Adding configuration for the new API key

Other search API options:
- **Google Custom Search API** - Powerful but requires custom search engine setup
- **Bing Web Search API** - Part of Microsoft Azure
- **SerpAPI** - Aggregates multiple search engines
- **DuckDuckGo API** - Privacy-focused, limited features
