import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL!);

export const categoryService = {
    async getAll() {
        const rows = await sql`
            SELECT id, name, display_name, description, icon, color, created_at
            FROM categories
            ORDER BY id ASC
        `;
        return rows;
    }
};
