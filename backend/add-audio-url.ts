import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addAudioUrlColumn() {
    const client = await pool.connect();
    try {
        console.log('Adding audio_url column to words table...');

        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'words' AND column_name = 'audio_url'
        `;
        const checkResult = await client.query(checkQuery);

        if (checkResult.rows.length > 0) {
            console.log('Column audio_url already exists.');
        } else {
            await client.query(`
                ALTER TABLE words 
                ADD COLUMN audio_url TEXT
            `);
            console.log('✅ Column audio_url added!');
        }

        // Update existing words with audio URLs
        console.log('\nUpdating audio_url for existing words...');
        const words = await client.query('SELECT id, word FROM words');

        for (const row of words.rows) {
            const safeWord = row.word.toLowerCase().replace(/ /g, '_').replace(/'/g, '');
            const audioUrl = `/audio/${row.id}_${safeWord}.mp3`;

            await client.query(
                'UPDATE words SET audio_url = $1 WHERE id = $2',
                [audioUrl, row.id]
            );
            console.log(`✅ Updated: ${row.word} -> ${audioUrl}`);
        }

        console.log('\n✅ All audio URLs updated!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

addAudioUrlColumn();
