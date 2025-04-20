import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

interface Config {
    openai_api_key: string;
}

export function loadConfig(): Config {
    const configPath = path.join(__dirname, '../../../config.yaml');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return yaml.load(fileContents) as Config;
}