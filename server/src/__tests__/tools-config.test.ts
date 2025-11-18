import { Tool, Topic } from '../config/config';
import { KnowledgeService } from '../services/KnowledgeService';

describe('Tools Configuration', () => {
    const mockOpenAIKey = 'test-key';

    describe('Tool interface', () => {
        it('should accept valid web_search tool configuration', () => {
            const tool: Tool = {
                name: 'web_search',
                description: 'Search the web for information',
                type: 'web_search'
            };

            expect(tool.name).toBe('web_search');
            expect(tool.type).toBe('web_search');
            expect(tool.url).toBeUndefined();
        });

        it('should accept valid webcal tool configuration with URL', () => {
            const tool: Tool = {
                name: 'calendar',
                description: 'Look up events in the calendar',
                type: 'webcal',
                url: 'webcal://example.com/calendar.ics'
            };

            expect(tool.name).toBe('calendar');
            expect(tool.type).toBe('webcal');
            expect(tool.url).toBe('webcal://example.com/calendar.ics');
        });
    });

    describe('Topic with tools', () => {
        it('should accept topic with tools array', () => {
            const topic: Topic = {
                name: 'Test Topic',
                id: 'test-topic',
                role: 'You are a helpful assistant',
                docs_dir: '/tmp/docs',
                tools: [
                    {
                        name: 'web_search',
                        description: 'Search the web',
                        type: 'web_search'
                    },
                    {
                        name: 'calendar',
                        description: 'Check calendar',
                        type: 'webcal',
                        url: 'webcal://example.com/cal.ics'
                    }
                ]
            };

            expect(topic.tools).toBeDefined();
            expect(topic.tools?.length).toBe(2);
            expect(topic.tools?.[0].type).toBe('web_search');
            expect(topic.tools?.[1].type).toBe('webcal');
        });

        it('should accept topic without tools array', () => {
            const topic: Topic = {
                name: 'Test Topic',
                id: 'test-topic',
                role: 'You are a helpful assistant',
                docs_dir: '/tmp/docs'
            };

            expect(topic.tools).toBeUndefined();
        });
    });

    describe('KnowledgeService with tools', () => {
        it('should store tools from topic configuration', () => {
            const topic: Topic = {
                name: 'Test Topic',
                id: 'test-topic',
                role: 'You are a helpful assistant',
                docs_dir: '/tmp/docs',
                tools: [
                    {
                        name: 'web_search',
                        description: 'Search the web',
                        type: 'web_search'
                    }
                ]
            };

            const service = new KnowledgeService(topic, mockOpenAIKey);

            expect(service.tools).toBeDefined();
            expect(service.tools?.length).toBe(1);
            expect(service.tools?.[0].name).toBe('web_search');
        });

        it('should handle topic without tools', () => {
            const topic: Topic = {
                name: 'Test Topic',
                id: 'test-topic',
                role: 'You are a helpful assistant',
                docs_dir: '/tmp/docs'
            };

            const service = new KnowledgeService(topic, mockOpenAIKey);

            expect(service.tools).toBeUndefined();
        });

        it('should expose tools via getter', () => {
            const tools: Tool[] = [
                {
                    name: 'web_search',
                    description: 'Search the web',
                    type: 'web_search'
                },
                {
                    name: 'calendar',
                    description: 'Check calendar',
                    type: 'webcal',
                    url: 'webcal://example.com/cal.ics'
                }
            ];

            const topic: Topic = {
                name: 'Test Topic',
                id: 'test-topic',
                role: 'You are a helpful assistant',
                docs_dir: '/tmp/docs',
                tools: tools
            };

            const service = new KnowledgeService(topic, mockOpenAIKey);

            expect(service.tools).toEqual(tools);
        });
    });
});
