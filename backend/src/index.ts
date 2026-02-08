import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { contentGeneratorService } from './services/content-generator';
import { imageScraperService } from './services/image-scraper';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
import { imageGeneratorService } from './services/image-generator';

// ... existing routes ...

app.post('/api/generate-content', async (req, res) => {
    try {
        const { topic, count } = req.body;
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const words = await contentGeneratorService.generateWordList(topic, count || 5);
        res.json({ words });
    } catch (error: any) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: error.message || 'Failed to generate content' });
    }
});

// New Replicate Image Gen Route
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, model } = req.body; // model can be 'schnell' or 'pro'
        const imageUrl = await imageGeneratorService.generateImage(prompt, model);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Image generation error:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.post('/api/search-image', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: 'Query is required' });

        const imageUrl = await imageGeneratorService.searchImage(query);
        res.json({ imageUrl });
    } catch (error: any) {
        console.error('Image search error:', error);
        res.status(500).json({ error: error.message || 'Failed to search image' });
    }
});



app.post('/api/scrape-image', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const imageUrl = await imageScraperService.scrapeGoogleImage(query);
        res.json({ imageUrl });
    } catch (error: any) {
        console.error('Error scraping image:', error);
        res.status(500).json({ error: error.message || 'Failed to scrape image' });
    }
});

import { wordService } from './services/word-service';

app.post('/api/words', async (req, res) => {
    try {
        const word = await wordService.create(req.body);
        res.json(word);
    } catch (error: any) {
        console.error('Error creating word:', error);
        res.status(500).json({ error: error.message || 'Failed to create word' });
    }
});

app.get('/api/words', async (req, res) => {
    try {
        const { category } = req.query;
        let words;
        if (category && typeof category === 'string') {
            words = await wordService.getByCategory(category);
        } else {
            words = await wordService.getAll();
        }
        res.json(words);
    } catch (error: any) {
        console.error('Error fetching words:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch words' });
    }
});

app.put('/api/words/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body;
        const word = await wordService.update(id, updates);
        res.json(word);
    } catch (error: any) {
        console.error('Error updating word:', error);
        res.status(500).json({ error: error.message || 'Failed to update word' });
    }
});

app.delete('/api/words/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await wordService.delete(id);
        res.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting word:', error);
        res.status(500).json({ error: error.message || 'Failed to delete word' });
    }
});

import { categoryService } from './services/category-service';

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await categoryService.getAll();
        res.json(categories);
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch categories' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
