import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

async function listModels() {
    console.log("Checking available models...");

    if (!process.env.GOOGLE_API_KEY) {
        console.error("No API KEY found!");
        return;
    }

    /* 
       Note: The Node SDK does not expose a direct listModels() method easily 
       without using the REST API or specific manager classes usually.
       However, we can try to force a request or just use `gemini-1.5-flash` 
       which SHOULD be valid. 
       
       Let's try a standard stable model name 'gemini-1.0-pro' 
       and also try to print the error details more clearly if it fails.
    */

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // Test a simple generation to see if 'gemini-1.5-flash' works with a simple prompt
    // sometimes the model name is 'models/gemini-1.5-flash'

    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro",
        "gemini-pro"
    ];

    for (const modelName of modelsToTry) {
        console.log(`\n--- Testing model: ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            console.log(`✅ SUCCESS! Model ${modelName} is working.`);
            console.log(`Response: ${result.response.text()}`);
            return; // Found a working one
        } catch (error: any) {
            console.log(`❌ FAILED: ${modelName}`);
            console.log(`Error: ${error.message}`);
        }
    }
}

listModels();
