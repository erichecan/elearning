
import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not set. Please check your .env file.');
}

const pool = new Pool({ connectionString });

export const wordService = {
    async create(wordData: any) {
        const client = await pool.connect();
        try {
            const { word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level } = wordData;

            const query = `
        INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
        RETURNING *
      `;

            const values = [
                word,
                chinese,
                phonetic,
                image_url || null,
                audio_url || null,
                category_id,
                difficulty_level || 1
            ];

            const res = await client.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error('Database insert error:', error);
            throw error;
        } finally {
            client.release();
        }
    },

    async getAll() {
        const client = await pool.connect();
        try {
            const res = await client.query(`
                SELECT w.*, c.name as category_name, c.display_name as category_display_name, c.icon as category_icon, c.color as category_color
                FROM words w
                LEFT JOIN categories c ON w.category_id = c.id
                WHERE w.is_active = true
                ORDER BY w.created_at DESC
            `);
            return res.rows;
        } finally {
            client.release();
        }
    },

    async getByCategory(categoryName: string) {
        const client = await pool.connect();
        try {
            const res = await client.query(`
                SELECT w.*, c.name as category_name, c.display_name as category_display_name, c.icon as category_icon, c.color as category_color
                FROM words w
                INNER JOIN categories c ON w.category_id = c.id
                WHERE c.name = $1 AND w.is_active = true
                ORDER BY w.id ASC
            `, [categoryName]);
            return res.rows;
        } finally {
            client.release();
        }
    },

    async update(id: number, updates: { category_id?: number; is_approved?: boolean }) {
        const client = await pool.connect();
        try {
            const setClauses: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (updates.category_id !== undefined) {
                setClauses.push(`category_id = $${paramIndex++}`);
                values.push(updates.category_id);
            }

            if (updates.is_approved !== undefined) {
                setClauses.push(`is_approved = $${paramIndex++}`);
                values.push(updates.is_approved);
            }

            if (setClauses.length === 0) {
                throw new Error('No valid updates provided');
            }

            setClauses.push(`updated_at = NOW()`);
            values.push(id);

            const query = `
                UPDATE words 
                SET ${setClauses.join(', ')}
                WHERE id = $${paramIndex}
                RETURNING *
            `;

            const res = await client.query(query, values);
            return res.rows[0];
        } finally {
            client.release();
        }
    },

    async delete(id: number) {
        const client = await pool.connect();
        try {
            // Soft delete - set is_active to false
            const res = await client.query(`
                UPDATE words 
                SET is_active = false, updated_at = NOW()
                WHERE id = $1
                RETURNING *
            `, [id]);
            return res.rows[0];
        } finally {
            client.release();
        }
    }
};
