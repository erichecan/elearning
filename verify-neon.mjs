import { Pool } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_0LEtMGW5bjxQ@ep-sparkling-forest-ahucz7zx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({ connectionString });

async function testConnection() {
    try {
        console.log('Connecting to Neon...');
        const result = await pool.query('SELECT now()');
        console.log('Connected!', result.rows[0]);
        await pool.end();
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

testConnection();
