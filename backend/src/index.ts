import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { contentGeneratorService } from './services/content-generator';
import { imageScraperService } from './services/image-scraper';
import { homeDataService } from './services/home-data';
import { focusDataService } from './services/focus-data';
import { vocabularyService } from './services/vocabulary-service';
import { scheduleService } from './services/schedule-service';
import { flashcardService } from './services/flashcard-service';
import { mathExerciseService } from './services/math-exercise-service';
import { storybookService } from './services/storybook-service';
import { storybookGeneratorService } from './services/storybook-generator';
import { vsdService } from './services/vsd-service';
import { analyticsService } from './services/analytics-service';
import { childService } from './services/child-service';
import { favoriteService } from './services/favorite-service';
import { progressService } from './services/progress-service';
import { wordQueryService } from './services/word-query-service';
import { coreWordPositionService } from './services/core-word-position-service';
import { recommendationService } from './services/recommendation-service';
import { rewardService } from './services/reward-service';
import { generateTtsMp3 } from './services/tts-service';
import { symbolPackService } from './services/symbol-pack-service';
import { roleService } from './services/role-service';
import { syncPolicyService } from './services/sync-policy-service';
import { complianceService } from './services/compliance-service';
import { storybookFavoriteService } from './services/storybook-favorite-service';
import { requireDbPool } from './lib/db-pool';
import { queryWithRetry } from './lib/db-retry';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '127.0.0.1';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(
    '/symbols/arasaac/raw',
    express.static(path.join(__dirname, '../assets/symbols/arasaac/raw/png'))
);

app.get('/api/symbol-packs', async (req, res) => {
    try {
        const provider = typeof req.query.provider === 'string' ? req.query.provider : 'arasaac';
        res.json(symbolPackService.listPacks(provider));
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to list symbol packs' });
    }
});

app.get('/api/health/db', async (req, res) => {
    try {
        const pool = requireDbPool();
        const result = await queryWithRetry(pool, 'SELECT NOW() AS now');
        res.json({ ok: true, now: result.rows?.[0]?.now || null });
    } catch (error: any) {
        res.status(503).json({ ok: false, error: error.message || 'db unavailable' });
    }
});

const adminGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = process.env.ADMIN_TOKEN;
    if (!token) return next();
    const header = req.header('x-admin-token');
    if (header !== token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
};

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
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
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
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
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
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        await wordService.delete(id);
        res.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting word:', error);
        res.status(500).json({ error: error.message || 'Failed to delete word' });
    }
});

app.get('/api/words/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
        const word = await wordQueryService.getById(id, userId);
        if (!word) return res.status(404).json({ error: 'Not found' });
        res.json(word);
    } catch (error: any) {
        console.error('Error fetching word:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch word' });
    }
});

app.get('/api/words/search', async (req, res) => {
    try {
        const query = typeof req.query.q === 'string' ? req.query.q : '';
        const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
        if (!query) return res.json([]);
        const results = await wordQueryService.search(query, userId);
        res.json(results);
    } catch (error: any) {
        console.error('Error searching words:', error);
        res.status(500).json({ error: error.message || 'Failed to search words' });
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
    const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
    const items = await homeDataService.getCoreWords(scene, childId);
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
    const childId = typeof req.body?.childId === 'string' ? req.body.childId : undefined;
    const emotionZone = req.body?.emotionZone === 'blue' || req.body?.emotionZone === 'green' || req.body?.emotionZone === 'yellow' || req.body?.emotionZone === 'red'
        ? req.body.emotionZone
        : undefined;
    res.json(await homeDataService.getRecommendations(scene, { taskTitle, recentWords, childId, emotionZone }));
});

app.get('/api/home/task-reminder', async (req, res) => {
    const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
    res.json(await homeDataService.getTaskReminder(childId));
});

app.get('/api/home/reward-summary', async (req, res) => {
    const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
    res.json(await homeDataService.getRewardSummary(childId));
});

app.get('/api/focus/current-task', async (req, res) => {
    const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
    const task = await focusDataService.getCurrentTask(childId);
    res.json(task);
});

app.post('/api/focus/complete-task', async (req, res) => {
    try {
        const taskId = Number(req.body?.taskId);
        if (!taskId) {
            return res.status(400).json({ error: 'taskId is required' });
        }
        const result = await scheduleService.completeTask(taskId);
        res.json(result);
    } catch (error: any) {
        console.error('Failed to complete task', error);
        res.status(500).json({ error: error.message || 'Failed to complete task' });
    }
});

// Vocabulary items (caregiver maintenance API, minimal)
app.get('/api/vocabulary-items', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const type = typeof req.query.type === 'string' ? req.query.type : undefined;
        const items = await vocabularyService.getAll(type);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch vocabulary items' });
    }
});

app.post('/api/vocabulary-items', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const item = await vocabularyService.create(req.body);
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create vocabulary item' });
    }
});

app.put('/api/vocabulary-items/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const item = await vocabularyService.update(id, req.body);
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update vocabulary item' });
    }
});

app.delete('/api/vocabulary-items/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const item = await vocabularyService.remove(id);
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to remove vocabulary item' });
    }
});

// Flashcards review API
app.get('/api/flashcards', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const items = await flashcardService.getAll(status, childId);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch flashcards' });
    }
});

app.get('/api/public/flashcards', async (req, res) => {
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const items = await flashcardService.getPublic(childId);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch public flashcards' });
    }
});

// A3: 学完即用 —— 把一张闪卡加入儿童的 AAC 词板（与 AAC 同源）
app.post('/api/flashcards/add-to-board', async (req, res) => {
    try {
        const { flashcardId, childId } = req.body || {};
        if (!flashcardId || !childId) {
            return res.status(400).json({ error: 'flashcardId 和 childId 必填' });
        }
        const result = await flashcardService.addToBoard(Number(flashcardId), String(childId));
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to add flashcard to board' });
    }
});

app.put('/api/flashcards/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const updated = await flashcardService.update(id, req.body);
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update flashcard' });
    }
});

app.post('/api/flashcards/bulk-status', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const ids = Array.isArray(req.body?.ids) ? req.body.ids.map((id: any) => Number(id)).filter((id: number) => Number.isFinite(id)) : [];
        const status = typeof req.body?.status === 'string' ? req.body.status : '';
        if (!ids.length || !status) return res.status(400).json({ error: 'ids and status are required' });
        const result = await flashcardService.bulkUpdateStatus(ids, status);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to bulk update flashcards' });
    }
});

// Math exercises review API
app.get('/api/math-exercises', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const items = await mathExerciseService.getAll(status, childId);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch math exercises' });
    }
});

app.get('/api/public/math-exercises', async (req, res) => {
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const items = await mathExerciseService.getPublic(childId);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch public math exercises' });
    }
});

app.put('/api/math-exercises/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const updated = await mathExerciseService.update(id, req.body);
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update math exercise' });
    }
});

app.post('/api/math-exercises/bulk-status', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const ids = Array.isArray(req.body?.ids) ? req.body.ids.map((id: any) => Number(id)).filter((id: number) => Number.isFinite(id)) : [];
        const status = typeof req.body?.status === 'string' ? req.body.status : '';
        if (!ids.length || !status) return res.status(400).json({ error: 'ids and status are required' });
        const result = await mathExerciseService.bulkUpdateStatus(ids, status);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to bulk update math exercises' });
    }
});

// Storybooks review API
app.get('/api/storybooks', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const items = await storybookService.getAll(status, childId);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch storybooks' });
    }
});

app.get('/api/public/storybooks', async (req, res) => {
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const items = await storybookService.getPublic(childId);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch public storybooks' });
    }
});

app.get('/api/storybooks/favorites', async (req, res) => {
    try {
        const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        const items = await storybookFavoriteService.list(userId);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch storybook favorites' });
    }
});

app.post('/api/storybooks/favorites', async (req, res) => {
    try {
        const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';
        const storybookId = Number(req.body?.storybookId);
        if (!userId || !storybookId) return res.status(400).json({ error: 'userId and storybookId are required' });
        const result = await storybookFavoriteService.add(userId, storybookId);
        res.json(result || { ok: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to add storybook favorite' });
    }
});

app.delete('/api/storybooks/favorites', async (req, res) => {
    try {
        const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';
        const storybookId = Number(req.body?.storybookId);
        if (!userId || !storybookId) return res.status(400).json({ error: 'userId and storybookId are required' });
        const result = await storybookFavoriteService.remove(userId, storybookId);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to remove storybook favorite' });
    }
});

app.put('/api/storybooks/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const updated = await storybookService.update(id, req.body);
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update storybook' });
    }
});

app.post('/api/storybooks/bulk-status', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const ids = Array.isArray(req.body?.ids) ? req.body.ids.map((id: any) => Number(id)).filter((id: number) => Number.isFinite(id)) : [];
        const status = typeof req.body?.status === 'string' ? req.body.status : '';
        if (!ids.length || !status) return res.status(400).json({ error: 'ids and status are required' });
        const result = await storybookService.bulkUpdateStatus(ids, status);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to bulk update storybooks' });
    }
});

// AI generation endpoints (draft by default)
app.post('/api/flashcards/generate', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const topic = typeof req.body?.topic === 'string' ? req.body.topic : '';
        const count = typeof req.body?.count === 'number' ? req.body.count : 10;
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : undefined;
        if (!topic) {
            return res.status(400).json({ error: 'topic is required' });
        }
        const words = await contentGeneratorService.generateWordList(topic, count);
        const created = await flashcardService.createMany(words.map((word) => ({
            child_id: childId || null,
            word_en: word.word,
            word_zh: word.chinese,
            image_url: null,
            audio_url: null,
            source: 'ai',
            status: 'draft'
        })));
        res.json({ createdCount: created.length, items: created });
    } catch (error: any) {
        console.error('Failed to generate flashcards', error);
        res.status(500).json({ error: error.message || 'Failed to generate flashcards' });
    }
});

app.post('/api/math-exercises/generate', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const count = typeof req.body?.count === 'number' ? req.body.count : 10;
        const difficulty = typeof req.body?.difficulty === 'number' ? req.body.difficulty : 1;
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : undefined;

        const items = Array.from({ length: count }).map(() => {
            const max = difficulty <= 1 ? 10 : difficulty <= 2 ? 20 : 50;
            const a = Math.floor(Math.random() * max) + 1;
            const b = Math.floor(Math.random() * max) + 1;
            return {
                child_id: childId || null,
                difficulty,
                question_text: `${a} + ${b} = ?`,
                question_payload: { a, b, op: '+' },
                answer_payload: { value: a + b },
                source: 'ai',
                status: 'draft'
            };
        });

        const created = await mathExerciseService.createMany(items);
        res.json({ createdCount: created.length, items: created });
    } catch (error: any) {
        console.error('Failed to generate math exercises', error);
        res.status(500).json({ error: error.message || 'Failed to generate math exercises' });
    }
});

app.post('/api/storybooks/generate', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const topic = typeof req.body?.topic === 'string' ? req.body.topic : '';
        const pages = typeof req.body?.pages === 'number' ? req.body.pages : 6;
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : undefined;
        if (!topic) {
            return res.status(400).json({ error: 'topic is required' });
        }
        const story = await storybookGeneratorService.generateStory(topic, pages);
        const created = await storybookService.create({
            child_id: childId || null,
            title: story.title,
            pages: story.pages,
            source: 'ai',
            status: 'draft'
        });
        res.json(created);
    } catch (error: any) {
        console.error('Failed to generate storybook', error);
        res.status(500).json({ error: error.message || 'Failed to generate storybook' });
    }
});

// VSD scenes & hotspots
app.get('/api/vsd/scenes', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const context = typeof req.query.context === 'string' ? req.query.context : undefined;
        const scenes = await vsdService.getScenes(childId, context);
        res.json(scenes);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch scenes' });
    }
});

// Public VSD read (no admin token)
app.get('/api/public/vsd/scenes', async (req, res) => {
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const context = typeof req.query.context === 'string' ? req.query.context : undefined;
        const scenes = await vsdService.getScenes(childId, context);
        res.json(scenes);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch scenes' });
    }
});

app.get('/api/public/vsd/scenes/:id/hotspots', async (req, res) => {
    try {
        const sceneId = parseInt(req.params.id);
        const hotspots = await vsdService.getHotspots(sceneId);
        res.json(hotspots);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch hotspots' });
    }
});

app.post('/api/vsd/scenes', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const scene = await vsdService.createScene(req.body);
        res.json(scene);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create scene' });
    }
});

app.put('/api/vsd/scenes/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const scene = await vsdService.updateScene(id, req.body);
        res.json(scene);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update scene' });
    }
});

app.delete('/api/vsd/scenes/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const result = await vsdService.deleteScene(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to delete scene' });
    }
});

app.get('/api/vsd/scenes/:id/hotspots', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const sceneId = parseInt(req.params.id);
        const hotspots = await vsdService.getHotspots(sceneId);
        res.json(hotspots);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch hotspots' });
    }
});

app.post('/api/vsd/hotspots', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const hotspot = await vsdService.createHotspot(req.body);
        res.json(hotspot);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create hotspot' });
    }
});

app.put('/api/vsd/hotspots/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const hotspot = await vsdService.updateHotspot(id, req.body);
        res.json(hotspot);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update hotspot' });
    }
});

app.delete('/api/vsd/hotspots/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const result = await vsdService.deleteHotspot(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to delete hotspot' });
    }
});

// Analytics events
app.post('/api/analytics/event', async (req, res) => {
    try {
        const eventType = typeof req.body?.event_type === 'string' ? req.body.event_type : '';
        if (!eventType) {
            return res.status(400).json({ error: 'event_type is required' });
        }
        const event = await analyticsService.logEvent({
            child_id: typeof req.body?.child_id === 'string' ? req.body.child_id : null,
            event_type: eventType,
            event_payload: req.body?.event_payload || {}
        });
        res.json(event);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to log event' });
    }
});

// Admin auth check
app.get('/api/admin/ping', (req, res) => {
    const token = process.env.ADMIN_TOKEN;
    if (!token) return res.json({ ok: true, mode: 'open' });
    const header = req.header('x-admin-token');
    if (header !== token) return res.status(401).json({ ok: false });
    return res.json({ ok: true, mode: 'token' });
});

app.get('/api/roles/capabilities', (req, res) => {
    const role = req.query.role === 'child' || req.query.role === 'parent' || req.query.role === 'therapist' || req.query.role === 'admin'
        ? req.query.role
        : 'admin';
    res.json({ role, capabilities: roleService.getCapabilities(role) });
});

app.get('/api/sync/policy', (req, res) => {
    res.json(syncPolicyService.getPolicy());
});

app.get('/api/compliance/checklist', (req, res) => {
    res.json(complianceService.getChecklist());
});

app.get('/api/compliance/consents/:childId', async (req, res) => {
    try {
        const token = process.env.ADMIN_TOKEN;
        if (token && req.header('x-admin-token') !== token) return res.status(401).json({ error: 'Unauthorized' });
        const childId = String(req.params.childId || '');
        if (!childId) return res.status(400).json({ error: 'childId is required' });
        const result = await complianceService.listParentalConsents(childId);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch parental consents' });
    }
});

app.post('/api/compliance/consents', async (req, res) => {
    try {
        const token = process.env.ADMIN_TOKEN;
        if (token && req.header('x-admin-token') !== token) return res.status(401).json({ error: 'Unauthorized' });
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : '';
        const guardianName = typeof req.body?.guardianName === 'string' ? req.body.guardianName.trim() : '';
        if (!childId || !guardianName) return res.status(400).json({ error: 'childId and guardianName are required' });
        const created = await complianceService.createParentalConsent({
            childId,
            guardianName,
            relationship: typeof req.body?.relationship === 'string' ? req.body.relationship : null,
            consentVersion: typeof req.body?.consentVersion === 'string' ? req.body.consentVersion : 'v1',
            consentMethod: typeof req.body?.consentMethod === 'string' ? req.body.consentMethod : 'checkbox',
            scope: req.body?.scope || {}
        });
        res.json(created);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create parental consent' });
    }
});

app.post('/api/compliance/consents/:id/revoke', async (req, res) => {
    try {
        const token = process.env.ADMIN_TOKEN;
        if (token && req.header('x-admin-token') !== token) return res.status(401).json({ error: 'Unauthorized' });
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ error: 'id is required' });
        const revoked = await complianceService.revokeParentalConsent(id, typeof req.body?.reason === 'string' ? req.body.reason : null);
        if (!revoked) return res.status(404).json({ error: 'consent not found' });
        res.json(revoked);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to revoke parental consent' });
    }
});

app.get('/api/compliance/export/:childId', async (req, res) => {
    try {
        const token = process.env.ADMIN_TOKEN;
        if (token && req.header('x-admin-token') !== token) return res.status(401).json({ error: 'Unauthorized' });
        const childId = String(req.params.childId || '');
        if (!childId) return res.status(400).json({ error: 'childId is required' });
        const payload = await complianceService.exportChildData(childId, 'admin');
        res.json(payload);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to export compliance data' });
    }
});

app.delete('/api/compliance/child/:childId', async (req, res) => {
    try {
        const token = process.env.ADMIN_TOKEN;
        if (token && req.header('x-admin-token') !== token) return res.status(401).json({ error: 'Unauthorized' });
        const childId = String(req.params.childId || '');
        if (!childId) return res.status(400).json({ error: 'childId is required' });
        const result = await complianceService.deleteChildData(childId, 'admin');
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to delete compliance data' });
    }
});

app.get('/api/analytics/summary', async (req, res) => {
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const params: any[] = [];
        let where = '';
        if (childId) {
            params.push(childId);
            where = 'WHERE child_id = $1';
        }
        const result = await analyticsService.getSummary(params, where);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch summary' });
    }
});

app.get('/api/analytics/therapist-summary', async (req, res) => {
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const result = await analyticsService.getTherapistSummary(childId);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch therapist summary' });
    }
});

// Edge TTS (server-side)
app.get('/api/tts', async (req, res) => {
    try {
        const text = typeof req.query.text === 'string' ? req.query.text.trim() : '';
        if (!text) return res.status(400).json({ error: 'text is required' });
        const url = await generateTtsMp3(text);
        res.json({ url });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to generate TTS' });
    }
});

// Recommendation feedback
app.post('/api/recommendations/shown', async (req, res) => {
    try {
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : null;
        const scene = req.body?.scene === 'school' ? 'school' : 'home';
        const recommendedIds = Array.isArray(req.body?.recommendedIds) ? req.body.recommendedIds.map((v: any) => Number(v)).filter((v: number) => Number.isFinite(v)) : [];
        const recentWords = Array.isArray(req.body?.recentWords) ? req.body.recentWords.map((v: any) => String(v)) : [];
        const taskTitle = typeof req.body?.taskTitle === 'string' ? req.body.taskTitle : '';
        await recommendationService.shown(childId, scene, recommendedIds, recentWords, taskTitle);
        res.json({ ok: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to log recommendation shown event' });
    }
});

app.post('/api/recommendations/accept', async (req, res) => {
    try {
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : null;
        const scene = req.body?.scene === 'school' ? 'school' : 'home';
        const recommendedIds = Array.isArray(req.body?.recommendedIds) ? req.body.recommendedIds.map((v: any) => Number(v)) : [];
        const recentWords = Array.isArray(req.body?.recentWords) ? req.body.recentWords.map((v: any) => String(v)) : [];
        const acceptedId = Number(req.body?.acceptedId);
        if (!acceptedId) return res.status(400).json({ error: 'acceptedId is required' });
        const result = await recommendationService.accept(childId, scene, recommendedIds, acceptedId, recentWords);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to log acceptance' });
    }
});

app.post('/api/recommendations/complete', async (req, res) => {
    try {
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : null;
        const scene = req.body?.scene === 'school' ? 'school' : 'home';
        const sentenceWords = Array.isArray(req.body?.sentenceWords) ? req.body.sentenceWords.map((v: any) => String(v)) : [];
        const sentenceVocabIds = Array.isArray(req.body?.sentenceVocabIds) ? req.body.sentenceVocabIds.map((v: any) => Number(v)).filter((v: number) => Number.isFinite(v)) : [];
        await recommendationService.sentenceComplete(childId, scene, sentenceWords, sentenceVocabIds);
        res.json({ ok: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to log sentence completion' });
    }
});

// Rewards
app.get('/api/rewards', async (req, res) => {
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
        const rules = await rewardService.getRules(childId);
        res.json(rules);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch rewards' });
    }
});

app.post('/api/rewards', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const childId = typeof req.body?.child_id === 'string' ? req.body.child_id : '';
        const title = typeof req.body?.title === 'string' ? req.body.title : '';
        const cost = Number(req.body?.cost);
        if (!childId || !title || !cost) return res.status(400).json({ error: 'child_id, title, cost are required' });
        const rule = await rewardService.createRule(req.body);
        res.json(rule);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create reward' });
    }
});

app.put('/api/rewards/:id', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const id = parseInt(req.params.id);
        const rule = await rewardService.updateRule(id, req.body);
        res.json(rule);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update reward' });
    }
});

app.post('/api/rewards/redeem', async (req, res) => {
    try {
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : '';
        const rewardId = Number(req.body?.rewardId);
        if (!childId || !rewardId) return res.status(400).json({ error: 'childId and rewardId are required' });
        const redemption = await rewardService.redeem(childId, rewardId);
        res.json(redemption);
    } catch (error: any) {
        if (error?.message === 'Insufficient coins' || error?.message === 'Reward not found' || error?.message === 'Reward is inactive' || error?.message === 'Reward does not belong to this child') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message || 'Failed to redeem reward' });
    }
});

app.get('/api/rewards/history', async (req, res) => {
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : '';
        const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 30;
        if (!childId) return res.status(400).json({ error: 'childId is required' });
        const items = await rewardService.getRedemptionHistory(childId, Math.min(limit, 100));
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch reward history' });
    }
});

// Simple image upload (data URL)
app.post('/api/upload-image', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const dataUrl = typeof req.body?.dataUrl === 'string' ? req.body.dataUrl : '';
        const filename = typeof req.body?.filename === 'string' ? req.body.filename : '';
        if (!dataUrl || !filename) {
            return res.status(400).json({ error: 'dataUrl and filename are required' });
        }

        const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl);
        if (!match) {
            return res.status(400).json({ error: 'Invalid dataUrl' });
        }

        const buffer = Buffer.from(match[2], 'base64');
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const safeName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, buffer);
        res.json({ url: `/uploads/${safeName}` });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to upload image' });
    }
});

// Favorites
app.get('/api/favorites', async (req, res) => {
    try {
        const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        const favorites = await favoriteService.getAll(userId);
        res.json(favorites);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch favorites' });
    }
});

app.post('/api/favorites', async (req, res) => {
    try {
        const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';
        const wordId = Number(req.body?.wordId);
        if (!userId || !wordId) return res.status(400).json({ error: 'userId and wordId are required' });
        const result = await favoriteService.add(userId, wordId);
        res.json(result || { success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to add favorite' });
    }
});

app.delete('/api/favorites', async (req, res) => {
    try {
        const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';
        const wordId = Number(req.body?.wordId);
        if (!userId || !wordId) return res.status(400).json({ error: 'userId and wordId are required' });
        const result = await favoriteService.remove(userId, wordId);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to remove favorite' });
    }
});

// Learning progress
app.post('/api/progress', async (req, res) => {
    try {
        const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';
        const wordId = Number(req.body?.wordId);
        const isCorrect = Boolean(req.body?.isCorrect);
        if (!userId || !wordId) return res.status(400).json({ error: 'userId and wordId are required' });
        const result = await progressService.updateProgress(userId, wordId, isCorrect);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update progress' });
    }
});

app.get('/api/progress/stats', async (req, res) => {
    try {
        const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        const stats = await progressService.getStats(userId);
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch stats' });
    }
});

// Children
app.get('/api/children', async (req, res) => {
    try {
        const children = await childService.getAll();
        res.json(children);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch children' });
    }
});

app.post('/api/children', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        if (!req.body?.name) {
            return res.status(400).json({ error: 'name is required' });
        }
        const child = await childService.create(req.body);
        res.json(child);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create child' });
    }
});

// Core word positions
app.get('/api/core-word-positions', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const childId = typeof req.query.childId === 'string' ? req.query.childId : '';
        const grid = typeof req.query.grid === 'string' ? req.query.grid : '6x6';
        if (!childId) return res.status(400).json({ error: 'childId is required' });
        const items = await coreWordPositionService.getPositions(childId, grid);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch positions' });
    }
});

app.post('/api/core-word-positions/seed', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : '';
        const grid = typeof req.body?.grid === 'string' ? req.body.grid : '6x6';
        if (!childId) return res.status(400).json({ error: 'childId is required' });
        const result = await coreWordPositionService.seedPositions(childId, grid);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to seed positions' });
    }
});

app.put('/api/core-word-positions', async (req, res) => {
    if (process.env.ADMIN_TOKEN) {
        const header = req.header('x-admin-token');
        if (header !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    try {
        const childId = typeof req.body?.childId === 'string' ? req.body.childId : '';
        const grid = typeof req.body?.grid === 'string' ? req.body.grid : '6x6';
        const positions = Array.isArray(req.body?.positions) ? req.body.positions : [];
        if (!childId || positions.length === 0) {
            return res.status(400).json({ error: 'childId and positions are required' });
        }
        const result = await coreWordPositionService.upsertPositions(childId, grid, positions);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update positions' });
    }
});

app.listen(port, host, () => {
    console.log(`Backend server running on http://${host}:${port}`);
});
