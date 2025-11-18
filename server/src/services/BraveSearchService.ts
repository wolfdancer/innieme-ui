/**
 * Service for interacting with the Brave Search API
 * Documentation: https://api.search.brave.com/app/documentation/web-search/get-started
 */
export class BraveSearchService {
    private apiKey: string;
    private baseUrl = 'https://api.search.brave.com/res/v1/web/search';

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Brave API key is required');
        }
        this.apiKey = apiKey;
    }

    /**
     * Performs a web search using the Brave Search API
     * @param query - The search query string
     * @param count - Number of results to return (default: 5, max: 20)
     * @returns Formatted search results string
     */
    async search(query: string, count: number = 5): Promise<string> {
        if (!query || query.trim().length === 0) {
            return 'Error: Search query cannot be empty';
        }

        // Ensure count is within valid range
        const resultCount = Math.min(Math.max(count, 1), 20);

        try {
            const url = new URL(this.baseUrl);
            url.searchParams.append('q', query);
            url.searchParams.append('count', resultCount.toString());

            console.log(`Brave Search: Searching for "${query}" (count: ${resultCount})`);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': this.apiKey,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Brave Search API error (${response.status}):`, errorText);

                if (response.status === 401) {
                    return 'Error: Invalid Brave API key. Please check your configuration.';
                } else if (response.status === 429) {
                    return 'Error: Brave Search API rate limit exceeded. Please try again later.';
                } else {
                    return `Error: Brave Search API returned status ${response.status}`;
                }
            }

            const data = await response.json() as BraveSearchResponse;

            // Check if we have web results
            if (!data.web?.results || data.web.results.length === 0) {
                return `No search results found for "${query}"`;
            }

            // Format the results
            const formattedResults = data.web.results
                .slice(0, resultCount)
                .map((result, index) => {
                    const parts = [
                        `${index + 1}. ${result.title}`,
                        `   URL: ${result.url}`,
                    ];

                    if (result.description) {
                        parts.push(`   ${result.description}`);
                    }

                    return parts.join('\n');
                })
                .join('\n\n');

            const resultSummary = `Search results for "${query}" (showing ${data.web.results.length} result${data.web.results.length === 1 ? '' : 's'}):\n\n${formattedResults}`;

            console.log(`Brave Search: Found ${data.web.results.length} results for "${query}"`);

            return resultSummary;

        } catch (error) {
            console.error('Brave Search error:', error);

            if (error instanceof Error) {
                return `Error performing web search: ${error.message}`;
            }

            return 'Error: An unknown error occurred while performing the search';
        }
    }
}

/**
 * Brave Search API response types
 * Based on: https://api.search.brave.com/app/documentation/web-search/responses
 */
interface BraveSearchResponse {
    query?: {
        original: string;
        show_strict_warning: boolean;
        is_navigational: boolean;
        is_news_breaking: boolean;
        spellcheck_off: boolean;
        country: string;
        bad_results: boolean;
        should_fallback: boolean;
        postal_code: string;
        city: string;
        header_country: string;
        more_results_available: boolean;
        state: string;
    };
    web?: {
        results: BraveSearchResult[];
    };
}

interface BraveSearchResult {
    title: string;
    url: string;
    description?: string;
    age?: string;
    page_age?: string;
    language?: string;
    family_friendly: boolean;
}
