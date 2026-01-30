import { Pool } from '@neondatabase/serverless';

// Data Types (Consistent with database.ts)
export interface Category {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    icon?: string;
    color?: string;
    created_at: string;
    updated_at: string;
}

export interface Word {
    id: number;
    word: string;
    chinese: string;
    phonetic?: string;
    image_url?: string;
    audio_url?: string;
    category_id: number;
    difficulty_level: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    category?: Category;
    is_favorite?: boolean;
    category_display_name?: string;
    category_icon?: string;
    category_color?: string;
}

export interface Favorite {
    id: number;
    user_id: string;
    word_id: number;
    created_at: string;
}

export interface LearningProgress {
    id: number;
    user_id: string;
    word_id: number;
    correct_count: number;
    wrong_count: number;
    last_learned_at: string;
    mastery_level: number;
}

// Hardcoded for User Request
const CONNECTION_STRING = 'postgresql://neondb_owner:npg_0LEtMGW5bjxQ@ep-sparkling-forest-ahucz7zx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

class NeonDatabase {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({ connectionString: CONNECTION_STRING });
    }

    // Mimic Supabase Interface
    from(table: string) {
        return new NeonQueryBuilder(this.pool, table);
    }

    async end() {
        await this.pool.end();
    }
}

class NeonQueryBuilder {
    private pool: Pool;
    private table: string;
    private selectFields: string = '*';
    private whereClauses: string[] = [];
    private orderClauses: string[] = [];
    private limitNum?: number;
    private params: any[] = [];

    constructor(pool: Pool, table: string) {
        this.pool = pool;
        this.table = table;
    }

    select(fields: string) {
        this.selectFields = fields;
        return this;
    }

    eq(field: string, value: any) {
        this.whereClauses.push(`${field} = $${this.params.length + 1}`);
        this.params.push(value);
        return this;
    }

    or(condition: string) {
        // Simplified OR handling matching LocalDatabase logic
        if (condition.includes('ilike')) {
            const parts = condition.split(',');
            const orConditions = parts.map(part => {
                const match = part.match(/(\w+)\.ilike\.%(.+)%/);
                if (match) {
                    this.params.push(`%${match[2]}%`);
                    return `${match[1]} LIKE $${this.params.length}`;
                }
                return part;
            });
            this.whereClauses.push(`(${orConditions.join(' OR ')})`);
        }
        return this;
    }

    order(field: string, options?: { ascending: boolean }) {
        const direction = options?.ascending === false ? 'DESC' : 'ASC';
        this.orderClauses.push(`${field} ${direction}`);
        return this;
    }

    limit(num: number) {
        this.limitNum = num;
        return this;
    }

    single() {
        return this.executeQuery(true);
    }

    async executeQuery(single: boolean = false) {
        let sql = '';
        try {
            // Handle Complex Joins (Simplified based on app usage)
            if (this.selectFields.includes('categories!inner') || this.selectFields.includes('categories(')) {
                if (this.table === 'words') {
                    sql = `SELECT w.*, c.display_name, c.icon, c.color FROM words w 
                 INNER JOIN categories c ON w.category_id = c.id`;

                    if (this.selectFields.includes('favorites')) {
                        sql = `SELECT w.*, c.display_name, c.icon, c.color,
                   CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
                   FROM words w 
                   INNER JOIN categories c ON w.category_id = c.id
                   LEFT JOIN favorites f ON w.id = f.word_id`;
                    }
                }
            } else {
                sql = `SELECT ${this.selectFields} FROM ${this.table}`;
            }

            if (this.whereClauses.length > 0) {
                // Replace aliases for Joins
                const whereClause = this.whereClauses.join(' AND ')
                    .replace(/categories\.name/g, 'c.name')
                    .replace(/categories\.display_name/g, 'c.display_name')
                    .replace(/words\./g, 'w.')
                    .replace(/favorites\./g, 'f.');
                sql += ` WHERE ${whereClause}`;
            }

            if (this.orderClauses.length > 0) {
                sql += ` ORDER BY ${this.orderClauses.join(', ')}`;
            }

            if (this.limitNum) {
                sql += ` LIMIT ${this.limitNum}`;
            }

            console.log('Execute SQL:', sql, 'Params:', this.params);

            const result = await this.pool.query(sql, this.params);

            if (single) {
                return { data: result.rows[0] || null, error: null };
            } else {
                return { data: result.rows || [], error: null };
            }
        } catch (error) {
            console.error('Database query error:', error);
            return { data: null, error: error };
        }
    }

    // Insert
    async insert(data: any) {
        try {
            const fields = Object.keys(data);
            // Generate $1, $2 placeholders
            const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

            // Postgres requires RETURNING id to get the new ID
            const sql = `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING id`;

            console.log('Insert SQL:', sql);

            const result = await this.pool.query(sql, Object.values(data));
            // result.rows[0] should be { id: ... }
            return { data: result.rows[0], error: null };
        } catch (error) {
            console.error('Database insert error:', error);
            return { data: null, error: error };
        }
    }

    // Delete
    async delete() {
        try {
            let sql = `DELETE FROM ${this.table}`;

            if (this.whereClauses.length > 0) {
                sql += ` WHERE ${this.whereClauses.join(' AND ')}`;
            }

            const result = await this.pool.query(sql, this.params);

            return { data: null, error: null };
        } catch (error) {
            console.error('Database delete error:', error);
            return { data: null, error: error };
        }
    }

    // Thenable
    async then(callback: (result: { data: any, error: any }) => void) {
        const result = await this.executeQuery();
        callback(result);
    }
}

export const neonDatabase = new NeonDatabase();
export const supabase = neonDatabase;
