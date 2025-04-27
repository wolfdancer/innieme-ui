import { Topic } from '../config/config';
import { OpenAI } from 'openai';
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from 'fs-extra';
import pdf from 'pdf-parse';
import path from 'path';

export class KnowledgeService {
    private _role: string;
    private _id: string;
    private _name: string;
    private _docsDir: string;
    private vectorStore: HNSWLib | null = null;
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

            // Split all texts into chunks
            const chunks = await textSplitter.splitText(texts.join('\n'));
            
            // Create vector store from chunks
            this.vectorStore = await HNSWLib.fromTexts(
                chunks,
                chunks.map((_, i) => ({ id: i })),
                this.embeddings
            );

            console.log(`${this.name} - Initialized vector store with ${chunks.length} chunks from ${texts.length} documents`);
        } catch (error) {
            console.error(`${this.name} - Error initializing knowledge service:`, error);
            throw error;
        }
    }

    async similaritySearch(query: string, k: number = 5): Promise<string[]> {
        if (!this.vectorStore) {
            throw new Error('Vector store not initialized');
        }
        const results = await this.vectorStore.similaritySearch(query, k);
        return results.map(doc => doc.pageContent);
    }
}