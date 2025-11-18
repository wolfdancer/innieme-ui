import OpenAI from 'openai';
import { Config, Tool } from '../config/config';
import { ChatMessage, IConversationService } from './IConversationService';
import { KnowledgeService } from './KnowledgeService';
import { BraveSearchService } from './BraveSearchService';
import https from 'https';
import http from 'http';

export class OpenAIConversationService implements IConversationService {
    private openai: OpenAI;
    private topics = new Map<string, KnowledgeService>();
    private braveSearch?: BraveSearchService;

    constructor(config: Config) {
        this.openai = new OpenAI({
            apiKey: config.openai_api_key
        });

        // Initialize Brave Search if API key is provided
        if (config.brave_api_key) {
            this.braveSearch = new BraveSearchService(config.brave_api_key);
            console.log('Brave Search API initialized');
        } else {
            console.log('Brave Search API key not configured - web search will return placeholder message');
        }

        for (const outie of config.outies) {
            for (const topic of outie.topics) {
                const knowledgeService = new KnowledgeService(topic, config.openai_api_key);
                this.topics.set(topic.id, knowledgeService);
            }
        }
    }

    private convertToolsToOpenAIFormat(tools: Tool[]): OpenAI.Chat.ChatCompletionTool[] {
        return tools.map(tool => {
            const openAITool: OpenAI.Chat.ChatCompletionTool = {
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: {
                        type: 'object',
                        properties: {},
                        required: []
                    }
                }
            };

            // Add URL parameter for webcal type
            if (tool.type === 'webcal' && tool.url) {
                openAITool.function.parameters = {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search query for calendar events'
                        }
                    },
                    required: ['query']
                };
            } else if (tool.type === 'web_search') {
                openAITool.function.parameters = {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search query for web search'
                        }
                    },
                    required: ['query']
                };
            }

            return openAITool;
        });
    }

    private async fetchUrl(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const client = url.startsWith('https') ? https : http;
            client.get(url, (response) => {
                let data = '';
                response.on('data', (chunk) => data += chunk);
                response.on('end', () => resolve(data));
            }).on('error', (error) => reject(error));
        });
    }

    private async executeWebSearch(query: string): Promise<string> {
        if (!this.braveSearch) {
            console.log(`Web search requested for: ${query}, but Brave API key not configured`);
            return `Web search functionality requires a Brave API key. Search query was: "${query}". Please add 'brave_api_key' to your config.yaml to enable this feature.`;
        }

        try {
            return await this.braveSearch.search(query);
        } catch (error) {
            console.error('Error executing web search:', error);
            return `Error performing web search: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    private async executeWebcal(query: string, url: string): Promise<string> {
        try {
            console.log(`Webcal search requested for: ${query} from ${url}`);

            // Convert webcal:// to https://
            const httpUrl = url.replace(/^webcal:\/\//, 'https://');

            const icalData = await this.fetchUrl(httpUrl);

            // Simple iCal parsing - extract events with SUMMARY containing the query
            const lines = icalData.split('\n');
            const events: Array<{summary: string, start?: string, description?: string}> = [];
            let currentEvent: {summary?: string, start?: string, description?: string} | null = null;

            for (const line of lines) {
                const trimmedLine = line.trim();

                if (trimmedLine === 'BEGIN:VEVENT') {
                    currentEvent = {};
                } else if (trimmedLine === 'END:VEVENT' && currentEvent) {
                    if (currentEvent.summary) {
                        events.push({
                            summary: currentEvent.summary,
                            start: currentEvent.start,
                            description: currentEvent.description
                        });
                    }
                    currentEvent = null;
                } else if (currentEvent) {
                    if (trimmedLine.startsWith('SUMMARY:')) {
                        currentEvent.summary = trimmedLine.substring(8);
                    } else if (trimmedLine.startsWith('DTSTART')) {
                        const value = trimmedLine.split(':')[1];
                        currentEvent.start = value;
                    } else if (trimmedLine.startsWith('DESCRIPTION:')) {
                        currentEvent.description = trimmedLine.substring(12);
                    }
                }
            }

            // Filter events if query is provided
            let relevantEvents = events;
            if (query && query.trim()) {
                const lowerQuery = query.toLowerCase();
                relevantEvents = events.filter(event =>
                    event.summary?.toLowerCase().includes(lowerQuery) ||
                    event.description?.toLowerCase().includes(lowerQuery)
                );
            }

            if (relevantEvents.length === 0) {
                return `No calendar events found${query ? ` matching "${query}"` : ''}.`;
            }

            const eventDescriptions = relevantEvents.slice(0, 10).map(event => {
                let desc = `- ${event.summary}`;
                if (event.start) {
                    // Format the date (basic formatting)
                    const year = event.start.substring(0, 4);
                    const month = event.start.substring(4, 6);
                    const day = event.start.substring(6, 8);
                    desc += ` (${year}-${month}-${day})`;
                }
                return desc;
            }).join('\n');

            return `Found ${relevantEvents.length} calendar event(s)${query ? ` matching "${query}"` : ''}:\n${eventDescriptions}`;

        } catch (error) {
            console.error('Error fetching webcal:', error);
            return `Error accessing calendar: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    private async executeTool(toolCall: OpenAI.Chat.ChatCompletionMessageToolCall, topicTools: Tool[]): Promise<string> {
        // Type guard to ensure we have a function tool call
        if (toolCall.type !== 'function') {
            return `Error: Unsupported tool call type "${toolCall.type}"`;
        }

        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        // Find the tool definition
        const toolDef = topicTools.find(t => t.name === functionName);
        if (!toolDef) {
            return `Error: Tool "${functionName}" not found in configuration`;
        }

        console.log(`Executing tool: ${functionName} with args:`, args);

        // Execute based on tool type
        if (toolDef.type === 'web_search') {
            return await this.executeWebSearch(args.query || '');
        } else if (toolDef.type === 'webcal') {
            if (!toolDef.url) {
                return 'Error: Webcal tool is missing URL configuration';
            }
            return await this.executeWebcal(args.query || '', toolDef.url);
        }

        return `Error: Unknown tool type "${toolDef.type}"`;
    }

    async initialize(): Promise<void> {
        // Uncomment the following to sleep for 30 seconds for testing purposes
        // console.log('Sleeping for 30 seconds...');
        // await new Promise(resolve => setTimeout(resolve, 30000));
        // console.log('Continuing after sleep');        
        await Promise.all(
            Array.from(this.topics.values()).map(knowledgeService => 
                knowledgeService.initialize()
            )
        );
    }
    
    async sendMessage(message: string, history: ChatMessage[] = [], topic: string = ''): Promise<string> {
        const matchedTopic = this.topics.get(topic);
        let systemPrompt = '';
        let tools: OpenAI.Chat.ChatCompletionTool[] | undefined = undefined;
        let topicTools: Tool[] | undefined = undefined;

        if (matchedTopic) {
            console.log(`Using topic: ${matchedTopic.id}: ${matchedTopic.name}`);
            const match = await matchedTopic.similaritySearch(message);
            systemPrompt = match?.length
                ? `${matchedTopic.role}

Here is some relevant information to help answer the query:

${match.join('\n\n')}`
                : `${matchedTopic.role}

no match found in the knowledge base`;

            // Add tools if configured for this topic
            if (matchedTopic.tools && matchedTopic.tools.length > 0) {
                topicTools = matchedTopic.tools;
                tools = this.convertToolsToOpenAIFormat(matchedTopic.tools);
                const toolNames = tools.map(t => t.type === 'function' ? t.function.name : 'unknown').join(', ');
                console.log(`Topic has ${tools.length} tool(s) configured: ${toolNames}`);
            }
        }
        else {
            console.log(`No topic found for: ${topic}`);
        }
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt }
        ]
        for (const message of history) {
            messages.push({
                role: message.role,
                content: message.content
            });
        }
        messages.push({
            role: 'user',
            content: message
        });

        const completionParams: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.1,
            max_tokens: 1000
        };

        // Only add tools parameter if tools are configured
        if (tools && tools.length > 0) {
            completionParams.tools = tools;
        }

        let completion = await this.openai.chat.completions.create(completionParams);
        let responseMessage = completion.choices[0]?.message;

        // Handle tool calls if present
        if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0 && topicTools) {
            console.log(`AI requested ${responseMessage.tool_calls.length} tool call(s)`);

            // Add the assistant's message with tool calls to the conversation
            messages.push(responseMessage);

            // Execute each tool call and add results to messages
            for (const toolCall of responseMessage.tool_calls) {
                const toolResult = await this.executeTool(toolCall, topicTools);
                console.log(`Tool ${toolCall.type === 'function' ? toolCall.function.name : toolCall.id} result:`, toolResult.substring(0, 100));

                messages.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: toolResult
                });
            }

            // Get final response from OpenAI with tool results
            const finalCompletionParams: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.1,
                max_tokens: 1000
            };

            completion = await this.openai.chat.completions.create(finalCompletionParams);
            responseMessage = completion.choices[0]?.message;
        }

        return responseMessage?.content ?? 'No response generated';
    }
}