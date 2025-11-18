import { BraveSearchService } from '../services/BraveSearchService';

// Mock fetch globally
global.fetch = jest.fn();

describe('BraveSearchService', () => {
    let braveSearch: BraveSearchService;
    const mockApiKey = 'test-api-key-12345';

    beforeEach(() => {
        braveSearch = new BraveSearchService(mockApiKey);
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should throw error if API key is not provided', () => {
            expect(() => new BraveSearchService('')).toThrow('Brave API key is required');
        });

        it('should initialize with valid API key', () => {
            expect(() => new BraveSearchService(mockApiKey)).not.toThrow();
        });
    });

    describe('search', () => {
        it('should return error for empty query', async () => {
            const result = await braveSearch.search('');
            expect(result).toBe('Error: Search query cannot be empty');
        });

        it('should return error for whitespace-only query', async () => {
            const result = await braveSearch.search('   ');
            expect(result).toBe('Error: Search query cannot be empty');
        });

        it('should make correct API call with query and count parameters', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    web: {
                        results: [
                            {
                                title: 'Test Result',
                                url: 'https://example.com',
                                description: 'Test description',
                                family_friendly: true
                            }
                        ]
                    }
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await braveSearch.search('test query', 5);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('q=test+query'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'X-Subscription-Token': mockApiKey
                    })
                })
            );
        });

        it('should format search results correctly', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    web: {
                        results: [
                            {
                                title: 'First Result',
                                url: 'https://example1.com',
                                description: 'First description',
                                family_friendly: true
                            },
                            {
                                title: 'Second Result',
                                url: 'https://example2.com',
                                description: 'Second description',
                                family_friendly: true
                            }
                        ]
                    }
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await braveSearch.search('test query');

            expect(result).toContain('Search results for "test query"');
            expect(result).toContain('1. First Result');
            expect(result).toContain('URL: https://example1.com');
            expect(result).toContain('First description');
            expect(result).toContain('2. Second Result');
            expect(result).toContain('URL: https://example2.com');
            expect(result).toContain('Second description');
        });

        it('should handle results without descriptions', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    web: {
                        results: [
                            {
                                title: 'Result Without Description',
                                url: 'https://example.com',
                                family_friendly: true
                            }
                        ]
                    }
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await braveSearch.search('test');

            expect(result).toContain('1. Result Without Description');
            expect(result).toContain('URL: https://example.com');
            expect(result).not.toContain('undefined');
        });

        it('should return message when no results found', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    web: {
                        results: []
                    }
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await braveSearch.search('nonexistent query');

            expect(result).toBe('No search results found for "nonexistent query"');
        });

        it('should handle missing web results in response', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({})
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await braveSearch.search('test');

            expect(result).toBe('No search results found for "test"');
        });

        it('should handle 401 unauthorized error', async () => {
            const mockResponse = {
                ok: false,
                status: 401,
                text: async () => 'Unauthorized'
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await braveSearch.search('test');

            expect(result).toBe('Error: Invalid Brave API key. Please check your configuration.');
        });

        it('should handle 429 rate limit error', async () => {
            const mockResponse = {
                ok: false,
                status: 429,
                text: async () => 'Rate limit exceeded'
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await braveSearch.search('test');

            expect(result).toBe('Error: Brave Search API rate limit exceeded. Please try again later.');
        });

        it('should handle other API errors', async () => {
            const mockResponse = {
                ok: false,
                status: 500,
                text: async () => 'Internal server error'
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await braveSearch.search('test');

            expect(result).toBe('Error: Brave Search API returned status 500');
        });

        it('should handle network errors', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

            const result = await braveSearch.search('test');

            expect(result).toBe('Error performing web search: Network error');
        });

        it('should handle unknown errors', async () => {
            (global.fetch as jest.Mock).mockRejectedValue('Unknown error');

            const result = await braveSearch.search('test');

            expect(result).toBe('Error: An unknown error occurred while performing the search');
        });

        it('should respect count parameter and limit to max 20', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    web: {
                        results: Array(25).fill({
                            title: 'Result',
                            url: 'https://example.com',
                            family_friendly: true
                        })
                    }
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await braveSearch.search('test', 30);

            // Should request max 20 results
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('count=20'),
                expect.any(Object)
            );
        });

        it('should enforce minimum count of 1', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    web: {
                        results: [{
                            title: 'Result',
                            url: 'https://example.com',
                            family_friendly: true
                        }]
                    }
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await braveSearch.search('test', 0);

            // Should enforce minimum of 1
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('count=1'),
                expect.any(Object)
            );
        });

        it('should limit displayed results to requested count', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    web: {
                        results: [
                            { title: 'Result 1', url: 'https://1.com', family_friendly: true },
                            { title: 'Result 2', url: 'https://2.com', family_friendly: true },
                            { title: 'Result 3', url: 'https://3.com', family_friendly: true },
                            { title: 'Result 4', url: 'https://4.com', family_friendly: true },
                            { title: 'Result 5', url: 'https://5.com', family_friendly: true }
                        ]
                    }
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await braveSearch.search('test', 3);

            // Should only show first 3 results
            expect(result).toContain('1. Result 1');
            expect(result).toContain('2. Result 2');
            expect(result).toContain('3. Result 3');
            expect(result).not.toContain('4. Result 4');
            expect(result).not.toContain('5. Result 5');
        });
    });
});
