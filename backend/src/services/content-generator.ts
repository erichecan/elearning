import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeneratedWord {
    word: string;
    chinese: string;
    phonetic: string;
    sentence_en: string;
    sentence_zh: string;
}

export const contentGeneratorService = {
    async generateWordList(topic: string, count: number = 5): Promise<GeneratedWord[]> {
        if (!process.env.GOOGLE_API_KEY) {
            console.error('GOOGLE_API_KEY is missing in process.env');
            return this.getFallbackData(count);
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

        console.log(`Generating ${count} words for topic: "${topic}" using Google Gemini (Flash Latest)`);

        try {
            // Use Gemini Flash Latest (Generic Alias - Confirmed Working)
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

            const prompt = `
        You are an expert educational content creator for children.
        The user has provided a topic: "${topic}".
        
        CRITICAL INSTRUCTION:
        1. If the topic is a category (e.g., "Animals", "Flags", "Fruits"), generate SPECIFIC DISTINCT ITEMS in that category.
           - BAD: "Color", "Legs", "Eating", "Nature", "Stripe", "Symbol", "Pole"
           - GOOD: "Lion", "Elephant", "Apple", "Banana", "American Flag", "Chinese Flag", "Canadian Flag"
        2. The words must be CONCRETE and VISUAL (something you can verify with a picture).
        3. Do not repeat the same word.
        4. STRICTLY FORBIDDEN:
           - Do NOT list parts of the item (e.g., if topic is "Car", do NOT list "Wheel", "Window").
           - Do NOT list attributes (e.g., "Fast", "Red").
           - Do NOT list verbs (e.g., "Driving").
           - Do NOT list related concepts (e.g., "Traffic", "Road").
           - ONLY list types of the topic itself (e.g., "Sedan", "SUV", "Truck").

        If topic is "National Flags" (or similar), return distinct country flags like "USA Flag", "Brazil Flag", "India Flag".
        
        Create a list of ${count} English vocabulary words related to "${topic}".
        
        For each word, provide:
        1. The word itself (in English). 
           - For flags, use "American Flag", "Chinese Flag", etc.
           - For animals, use "Lion", "Tiger", etc.
        2. Chinese translation (simplified).
        3. IPA Phonetic transcription.
        4. A simple example sentence in English suitable for a child.
        5. The Chinese translation of that sentence.

        Return the result strictly as a valid JSON array of objects.
        Do not include markdown code blocks.
        
        JSON Keys: "word", "chinese", "phonetic", "sentence_en", "sentence_zh".
        
        Example for topic "Space":
        [
          { "word": "Astronaut", "chinese": "宇航员", "phonetic": "/ˈæs.trə.nɔːt/", "sentence_en": "The astronaut floats in space.", "sentence_zh": "宇航员在太空中漂浮。" },
          { "word": "Rocket", "chinese": "火箭", "phonetic": "/ˈrɒk.ɪt/", "sentence_en": "The rocket flies to the moon.", "sentence_zh": "火箭飞向月球。" }
        ]
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log('Gemini Output:', text.substring(0, 100) + '...');

            // Clean up potentially wrapped JSON (Gemini sometimes wraps in ```json ... ```)
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            let data: any;
            try {
                data = JSON.parse(cleanText);
            } catch (e) {
                console.error('JSON Parse Failed, trying regex extraction', e);
                const jsonMatch = text.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    data = JSON.parse(jsonMatch[0]);
                }
            }

            if (!Array.isArray(data)) {
                // Try to find array inside object
                const arrayVal = Object.values(data).find(v => Array.isArray(v));
                if (arrayVal) return arrayVal as GeneratedWord[];
                throw new Error('AI response format was not an array.');
            }

            return data as GeneratedWord[];

        } catch (error) {
            console.error('Error calling Google Gemini:', error);
            return this.getFallbackData(count);
        }
    },

    getFallbackData(count: number) {
        const mockWords = [
            { word: 'lion', chinese: '狮子', phonetic: '/ˈlaɪ.ən/', sentence_en: 'The lion is the king of the jungle.', sentence_zh: '狮子是丛林之王。' },
            { word: 'elephant', chinese: '大象', phonetic: '/ˈel.ɪ.fənt/', sentence_en: 'The elephant has a long trunk.', sentence_zh: '大象有一个长鼻子。' },
            { word: 'zebra', chinese: '斑马', phonetic: '/ˈzeb.rə/', sentence_en: 'The zebra has black and white stripes.', sentence_zh: '斑马有黑白相间的条纹。' },
            { word: 'giraffe', chinese: '长颈鹿', phonetic: '/dʒɪˈrɑːf/', sentence_en: 'The giraffe has a very long neck.', sentence_zh: '长颈鹿有一个很长的脖子。' },
            { word: 'monkey', chinese: '猴子', phonetic: '/ˈmʌŋ.ki/', sentence_en: 'The monkey likes to eat bananas.', sentence_zh: '猴子喜欢吃香蕉。' }
        ];
        return Array(count).fill(null).map((_, i) => mockWords[i % mockWords.length]);
    }
};
