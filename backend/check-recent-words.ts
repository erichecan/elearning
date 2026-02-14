
import dotenv from 'dotenv';
import path from 'path';
import { Pool } from '@neondatabase/serverless';

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_0LEtMGW5bjxQ@ep-sparkling-forest-ahucz7zx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({ connectionString });

async function checkRecent() {
    console.log('Checking last 10 words...');
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT id, word, category_id, created_at FROM words ORDER BY created_at DESC LIMIT 10');
        console.table(res.rows);

        const catRes = await client.query('SELECT id, name FROM categories LIMIT 5');
        console.log('Sample Categories:', catRes.rows);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkRecent();
