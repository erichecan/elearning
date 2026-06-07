import { requireDbPool } from '../lib/db-pool'
import { queryWithRetry } from '../lib/db-retry'
const pool = requireDbPool();

export const categoryService = {
    async getAll() {
        const res = await queryWithRetry(pool, `
            SELECT id, name, display_name, description, icon, color, created_at
            FROM categories
            ORDER BY id ASC
        `);
        return res.rows;
    }
};
