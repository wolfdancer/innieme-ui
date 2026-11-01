import { Topic } from '../config/config';
import { HierarchicalNSW } from "hnswlib-node";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from 'fs-extra';
import pdf from 'pdf-parse';
import path from 'path';

export class KnowledgeService {
    private _role: string;
    private _id: string;
    private _name: string;
    private _docsDir: string;
    private index: HierarchicalNSW | null = null;
    private chunks: string[] = [];
    private embeddings: OpenAIEmbeddings;

    constructor(topic: Topic, openAIApiKey: string) {
        this._role = topic.role;
        this._id = topic.id;
        this._name = topic.name;
        this._docsDir = topic.docs_dir;
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: openAIApiKey,
            modelName: "text-embedding-3-small"
        });
    }

    get role(): string {
        return this._role;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    private async readPDFContent(filePath: string): Promise<string> {
        const dataBuffer = await fs.readFile(filePath);
        const pdfResult = await pdf(dataBuffer);
        return pdfResult.text;
    }

    private async loadDocuments(): Promise<string[]> {
        const texts: string[] = [];
        const files = await fs.readdir(this._docsDir);
        
        for (const file of files) {
            const filePath = path.join(this._docsDir, file);
            try {
                let content = '';
                if (file.endsWith('.txt') || file.endsWith('.md')) {
                    content = await fs.readFile(filePath, 'utf-8');
                } else if (file.endsWith('.pdf')) {
                    content = await this.readPDFContent(filePath);
                }
                if (content) {
                    texts.push(content);
                }
            } catch (error) {
                console.error(`Error reading file ${file}:`, error);
            }
        }
        return texts;
    }

    async initialize(): Promise<void> {
        try {
            // Load documents from directory
            const texts = await this.loadDocuments();
            
            // Create text splitter
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });

            // Split each document separately so no chunk spans two files
            const chunks = (await Promise.all(texts.map(text => textSplitter.splitText(text)))).flat();
            if (chunks.length === 0) {
                console.warn(`${this.name} - No content loaded from ${this._docsDir}; every query will report no match`);
            }

            // Embed chunks and build the vector index (label = chunk position)
            const vectors = await this.embeddings.embedDocuments(chunks);
            const index = new HierarchicalNSW('cosine', vectors[0]?.length ?? 0);
            index.initIndex(vectors.length);
            vectors.forEach((vector, i) => index.addPoint(vector, i));
            this.chunks = chunks;
            this.index = index;

            console.log(`${this.name} - Initialized vector store with ${chunks.length} chunks from ${texts.length} documents`);
        } catch (error) {
            console.error(`${this.name} - Error initializing knowledge service:`, error);
            throw error;
        }
    }

    async similaritySearch(query: string, k: number = 5): Promise<string[]> {
        if (!this.index) {
            throw new Error('Vector store not initialized');
        }
        const count = this.index.getCurrentCount();
        if (count === 0) {
            return [];
        }
        const queryVector = await this.embeddings.embedQuery(query);
        const { neighbors } = this.index.searchKnn(queryVector, Math.min(k, count));
        return neighbors.map(label => this.chunks[label]);
    }
}