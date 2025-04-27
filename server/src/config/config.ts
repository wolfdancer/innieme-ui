import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export interface Topic {
    name: string;
    id: string;
    role: string;
    docs_dir: string;
}

interface Outie {
    outie_id: string;
    topics: Topic[];
}

export interface Config {
    openai_api_key: string;
    outies: Outie[];
}

export function loadConfig(configPath:string): Config {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents) as Config;
    
    // Get the directory containing the config file to use as base
    const configDir = path.dirname(configPath);
    
    // Iterate through all outies and their topics
    config.outies.forEach(outie => {
        outie.topics.forEach(topic => {
            // If docs_dir is a relative path, convert it to absolute
            if (!path.isAbsolute(topic.docs_dir)) {
                topic.docs_dir = path.resolve(configDir, topic.docs_dir);
            }
        });
    });
    
    return config;
}