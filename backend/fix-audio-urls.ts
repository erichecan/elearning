import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const BACKEND_URL = 'http://localhost:3001';

async function fixAudioUrls() {
    const client = await pool.connect();
    try {
        console.log('Fixing audio URLs to use absolute paths...');

        const words = await client.query('SELECT id, word, audio_url FROM words');

        for (const row of words.rows) {
            if (row.audio_url && !row.audio_url.startsWith('http')) {
                const absoluteUrl = `${BACKEND_URL}${row.audio_url}`;
                await client.query(
                    'UPDATE words SET audio_url = $1 WHERE id = $2',
                    [absoluteUrl, row.id]
                );
                console.log(`✅ Fixed: ${row.word} -> ${absoluteUrl}`);
            }
        }

        console.log('\n✅ All audio URLs fixed!');
    } catch (error) {
        console.error('Fix failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

fixAudioUrls();
