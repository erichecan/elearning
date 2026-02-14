import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { contentGeneratorService } from './services/content-generator';
import { imageScraperService } from './services/image-scraper';
import { homeDataService } from './services/home-data';
import { focusDataService } from './services/focus-data';
import { vocabularyService } from './services/vocabulary-service';

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

// Home data endpoints (temporary server-driven data, will be backed by DB)
app.get('/api/home/core-words', async (req, res) => {
    const scene = (req.query.scene === 'school' ? 'school' : 'home') as 'home' | 'school';
    const items = await homeDataService.getCoreWords(scene);
    res.json({ items });
});

app.get('/api/home/recommendations', async (req, res) => {
    const scene = (req.query.scene === 'school' ? 'school' : 'home') as 'home' | 'school';
    res.json(await homeDataService.getRecommendations(scene));
});

app.post('/api/home/recommendations', async (req, res) => {
    const scene = (req.body?.scene === 'school' ? 'school' : 'home') as 'home' | 'school';
    const taskTitle = typeof req.body?.taskTitle === 'string' ? req.body.taskTitle : '';
    const recentWords = Array.isArray(req.body?.recentWords) ? req.body.recentWords : [];
    res.json(await homeDataService.getRecommendations(scene, { taskTitle, recentWords }));
});

app.get('/api/home/task-reminder', async (req, res) => {
    res.json(await homeDataService.getTaskReminder());
});

app.get('/api/home/reward-summary', async (req, res) => {
    res.json(await homeDataService.getRewardSummary());
});

app.get('/api/focus/current-task', async (req, res) => {
    const task = await focusDataService.getCurrentTask();
    res.json(task);
});

// Vocabulary items (caregiver maintenance API, minimal)
app.get('/api/vocabulary-items', async (req, res) => {
    try {
        const type = typeof req.query.type === 'string' ? req.query.type : undefined;
        const items = await vocabularyService.getAll(type);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch vocabulary items' });
    }
});

app.post('/api/vocabulary-items', async (req, res) => {
    try {
        const item = await vocabularyService.create(req.body);
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create vocabulary item' });
    }
});

app.put('/api/vocabulary-items/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const item = await vocabularyService.update(id, req.body);
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update vocabulary item' });
    }
});

app.delete('/api/vocabulary-items/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const item = await vocabularyService.remove(id);
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to remove vocabulary item' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
