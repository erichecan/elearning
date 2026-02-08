import dotenv from 'dotenv';
import path from 'path';

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

import { contentGeneratorService } from './src/services/content-generator';

async function runTest() {
    const topic = "National Flags";
    const count = 20;

    console.log(`Testing content generation for topic: "${topic}", count: ${count}`);

    try {
        const results = await contentGeneratorService.generateWordList(topic, count);
        console.log(`\nGenerated ${results.length} items:`);
        results.forEach((item, index) => {
            console.log(`${index + 1}. ${item.word} (${item.chinese})`);
        });

        // Check for duplicates
        const uniqueWords = new Set(results.map(r => r.word));
        console.log(`\nUnique words: ${uniqueWords.size} / ${results.length}`);

        if (uniqueWords.size < results.length) {
            console.warn("WARNING: Duplicates detected!");
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}

runTest();
