import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { KnowledgeService } from '../services/KnowledgeService';

// Deterministic stand-in for OpenAI embeddings: a letter-frequency vector,
// so texts sharing words land close together under cosine distance.
jest.mock('@langchain/openai', () => {
    const embed = (text: string): number[] => {
        const vector = new Array(26).fill(0);
        for (const ch of text.toLowerCase()) {
            const code = ch.charCodeAt(0) - 97;
            if (code >= 0 && code < 26) vector[code]++;
        }
        return vector;
    };
    return {
        OpenAIEmbeddings: jest.fn().mockImplementation(() => ({
            embedDocuments: async (texts: string[]) => texts.map(embed),
            embedQuery: async (text: string) => embed(text),
        })),
    };
});

const filler = (word: string) => Array(150).fill(word).join(' ');

describe('KnowledgeService', () => {
    let docsDir: string;

    const createService = () => new KnowledgeService(
        { id: 'test', name: 'Test', role: 'You are a test bot', docs_dir: docsDir },
        'fake-key'
    );

    beforeEach(async () => {
        docsDir = await fs.mkdtemp(path.join(os.tmpdir(), 'innieme-knowledge-'));
    });

    afterEach(async () => {
        await fs.remove(docsDir);
    });

    it('returns the most similar chunk first', async () => {
        await fs.writeFile(path.join(docsDir, 'zebra.txt'), filler('zebra'));
        await fs.writeFile(path.join(docsDir, 'apple.md'), filler('apple'));
        const service = createService();
        await service.initialize();

        const results = await service.similaritySearch('apple', 1);
        expect(results).toHaveLength(1);
        expect(results[0]).toContain('apple');
        expect(results[0]).not.toContain('zebra');
    });

    it('caps k at the number of chunks', async () => {
        await fs.writeFile(path.join(docsDir, 'short.txt'), 'only one small chunk');
        const service = createService();
        await service.initialize();

        const results = await service.similaritySearch('chunk', 5);
        expect(results).toEqual(['only one small chunk']);
    });

    it('returns no results for an empty docs directory', async () => {
        const service = createService();
        await service.initialize();

        expect(await service.similaritySearch('anything')).toEqual([]);
    });

    it('throws when searched before initialization', async () => {
        await expect(createService().similaritySearch('anything')).rejects.toThrow('Vector store not initialized');
    });
});
