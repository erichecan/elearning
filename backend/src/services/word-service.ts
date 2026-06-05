import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL!);

export const wordService = {
    async create(wordData: any) {
        const { word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level } = wordData;
        const rows = await sql`
            INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level, is_active, created_at, updated_at)
            VALUES (${word}, ${chinese}, ${phonetic}, ${image_url || null}, ${audio_url || null}, ${category_id}, ${difficulty_level || 1}, true, NOW(), NOW())
            RETURNING *
        `;
        return rows[0];
    },

    async getAll() {
        const rows = await sql`
            SELECT w.*, c.name as category_name, c.display_name as category_display_name, c.icon as category_icon, c.color as category_color
            FROM words w
            LEFT JOIN categories c ON w.category_id = c.id
            WHERE w.is_active = true
            ORDER BY w.created_at DESC
        `;
        return rows;
    },

    async getByCategory(categoryName: string) {
        const rows = await sql`
            SELECT w.*, c.name as category_name, c.display_name as category_display_name, c.icon as category_icon, c.color as category_color
            FROM words w
            INNER JOIN categories c ON w.category_id = c.id
            WHERE c.name = ${categoryName} AND w.is_active = true
            ORDER BY w.id ASC
        `;
        return rows;
    },

    async update(id: number, updates: Record<string, any>) {
        const fields = Object.keys(updates).filter(k => updates[k] !== undefined);
        if (fields.length === 0) throw new Error('No valid updates provided');
        const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = [...fields.map(f => updates[f]), id];
        const result = await sql.query(
            `UPDATE words SET ${setClauses}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
            values
        ) as any;
        return result.rows[0];
    },

    async delete(id: number) {
        const rows = await sql`
            UPDATE words SET is_active = false, updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;
        return rows[0];
    }
};
