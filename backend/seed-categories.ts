
import dotenv from 'dotenv';
import path from 'path';
import { Pool } from '@neondatabase/serverless';

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

// Fallback to hardcoded string if env fails (as seen in neon-database.ts)
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_0LEtMGW5bjxQ@ep-sparkling-forest-ahucz7zx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
}

const pool = new Pool({ connectionString });

const categories = [
    { name: 'Animal Sounds', icon: '🐶', color: '#FFD8B1' },
    { name: 'Jobs', icon: '👨‍🚒', color: '#B2F7EF' },
    { name: 'Feelings', icon: '😢', color: '#C1E1C1' },
    { name: 'Letter Sounds', icon: '🅰️', color: '#E6E6FA' },
    { name: 'Mouth Exercises', icon: '👄', color: '#FFCC99' },
    { name: 'Fruits & Veggies', icon: '🍎', color: '#98FF98' },
    { name: 'Colors', icon: '🌈', color: '#AEC6CF' },
    { name: 'Clothes', icon: '👕', color: '#DCD0FF' },
    { name: 'Friends', icon: '👫', color: '#C1E1C1' },
    { name: 'Animals', icon: '🐻', color: '#B2F7EF' },
    { name: 'Songs', icon: '🎵', color: '#FDFD96' },
    { name: 'Family', icon: '👨‍👩‍👧', color: '#80CEE1' },
    { name: 'Small Numbers', icon: '🔢', color: '#FDFD96' },
    { name: 'Adjectives', icon: '🐇', color: '#FFD1DC' },
    { name: 'Talking', icon: '🐦', color: '#AEC6CF' },
    { name: 'My Body', icon: '🤖', color: '#C1E1C1' },
    { name: 'Big Numbers', icon: '🔟', color: '#FFB7B2' },
    { name: 'Instruments', icon: '🎹', color: '#E6E6FA' },
    { name: 'Vehicles', icon: '🚗', color: '#FFB7B2' },
    { name: 'Exclamations', icon: '😮', color: '#FFD8B1' }
];

async function seed() {
    console.log(`Seeding ${categories.length} categories...`);
    const client = await pool.connect();

    try {
        for (const cat of categories) {
            // Check if exists
            const existing = await client.query('SELECT id FROM categories WHERE name = $1', [cat.name]);
            if (existing.rows.length === 0) {
                await client.query(
                    'INSERT INTO categories (name, display_name, icon, color, created_at, updated_at) VALUES ($1, $1, $2, $3, NOW(), NOW())',
                    [cat.name, cat.icon, cat.color]
                );
                console.log(`Created: ${cat.name}`);
            } else {
                console.log(`Skipped (Exists): ${cat.name}`);
            }
        }
        console.log('Seeding Complete!');
    } catch (err) {
        console.error('Error seeding:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
