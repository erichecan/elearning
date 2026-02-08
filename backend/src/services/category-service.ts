import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

export const categoryService = {
    async getAll() {
        const client = await pool.connect();
        try {
            const res = await client.query(`
                SELECT id, name, display_name, description, icon, color, created_at
                FROM categories
                ORDER BY id ASC
            `);
            return res.rows;
        } finally {
            client.release();
        }
    }
};
