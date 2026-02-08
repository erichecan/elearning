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
    sentence?: string;
    sentence_cn?: string;
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

    private operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
    private operationData: any = null;

    constructor(pool: Pool, table: string) {
        this.pool = pool;
        this.table = table;
    }

    select(fields: string = '*') {
        if (this.operation === 'insert' || this.operation === 'update' || this.operation === 'delete') {
            // In Supabase, .select() after mutation means "return the data".
            // Our execute methods already do RETURNING *, so we just ignore this state change.
            // We could optionally parse fields to customize RETURNING, but * is fine for now.
            return this;
        }
        this.operation = 'select';
        this.selectFields = fields;
        return this;
    }

    insert(data: any) {
        this.operation = 'insert';
        this.operationData = data;
        return this;
    }

    update(data: any) {
        this.operation = 'update';
        this.operationData = data;
        return this;
    }

    delete() {
        this.operation = 'delete';
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
        // Just a flag for return format, logic handled in valid response
        return this;
    }

    async then(resolve: (result: { data: any, error: any }) => void, reject?: (reason: any) => void) {
        try {
            const result = await this.execute();
            resolve(result);
        } catch (error) {
            if (reject) reject(error);
        }
    }

    private async execute() {
        switch (this.operation) {
            case 'insert': return this.executeInsert();
            case 'update': return this.executeUpdate();
            case 'delete': return this.executeDelete();
            default: return this.executeSelect();
        }
    }

    private async executeSelect() {
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
                } else {
                    sql = `SELECT ${this.selectFields} FROM ${this.table}`;
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

            // Console log removed to reduce noise, or keep if debugging needed
            // console.log('Execute SQL:', sql, 'Params:', this.params);

            const result = await this.pool.query(sql, this.params);

            // Basic single handling (if array has 1 item and single called - strictly Supabase uses .single() to throw if not 1, but we simulate structure)
            return { data: result.rows, error: null };

        } catch (error) {
            console.error('Database query error:', error);
            return { data: null, error: error };
        }
    }

    private async executeInsert() {
        try {
            const data = Array.isArray(this.operationData) ? this.operationData[0] : this.operationData;
            const fields = Object.keys(data);
            const placeholders = fields.map((_, i) => `$${this.params.length + i + 1}`).join(', ');
            const values = Object.values(data);
            this.params.push(...values);

            const sql = `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;

            const result = await this.pool.query(sql, this.params);
            return { data: Array.isArray(this.operationData) ? result.rows : result.rows[0], error: null };
        } catch (error) {
            console.error('Database insert error:', error);
            return { data: null, error: error };
        }
    }

    private async executeUpdate() {
        try {
            const data = this.operationData;
            const fields = Object.keys(data);

            if (fields.length === 0) return { data: [], error: null };

            const setClauses = fields.map((field, i) => {
                const paramIndex = this.params.length + 1;
                this.params.push(data[field]);
                return `${field} = $${paramIndex}`;
            });

            let sql = `UPDATE ${this.table} SET ${setClauses.join(', ')}`;

            if (this.whereClauses.length > 0) {
                // Adjust where clause param indices if necessary? 
                // Ah, wait. this.params already contains WHERE params?
                // NO. The `eq` calls added params to `this.params`.
                // BUT `executeUpdate` ADDS update params to `this.params`.
                // WE MUST BE CAREFUL OF ORDER.
                // Standard SQL: UPDATE ... SET ... WHERE ...
                // Params must match the order in SQL string.
                // Currently `eq` puts params in `this.params` immediately.
                // So if I call .update().eq(), `update` runs first (setting state), then `eq` runs (adding WHERE params).
                // Then `execute` runs.
                // params array: [where_param_1, where_param_2 ...]
                // But SQL needs: SET a=$1 WHERE b=$2.
                // This means SET params must come BEFORE WHERE params in the array? 
                // OR we can use numbered params carefully.
                //
                // FIX: usage is `.update({...}).eq(...)`.
                // `update` saves data. `eq` saves params.
                // When executing:
                // We construct SET clause.
                // We likely need to reconstruct the params array to match (SET params + WHERE params).
                // `this.params` currently holds WHERE params (from `eq` calls).

                const whereParams = [...this.params]; // Save existing WHERE params
                this.params = []; // Reset

                // Add SET params
                const setParamIndices = fields.map((_, i) => `$${this.params.length + 1 + i}`); // broken logic for mapping?
                // simpler:
                fields.forEach(field => {
                    this.params.push(data[field]);
                });
                // Re-build SET string with $1, $2...
                const setString = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

                // Add WHERE params
                const offset = this.params.length;
                whereParams.forEach(p => this.params.push(p));

                // Re-build WHERE string with offset indices
                // This is tricky because `this.whereClauses` has strings like "id = $1".
                // We need to shift those indices.
                // REGEX replace $N with $(N+offset)
                const shiftedWhere = this.whereClauses.map(clause => {
                    return clause.replace(/\$(\d+)/g, (match, n) => `$${parseInt(n) + offset}`);
                }).join(' AND ');

                sql = `UPDATE ${this.table} SET ${setString} WHERE ${shiftedWhere} RETURNING *`;
            } else {
                // No where clause (dangerous but possible)
                const setString = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
                sql = `UPDATE ${this.table} SET ${setString} RETURNING *`;
            }

            const result = await this.pool.query(sql, this.params);
            return { data: result.rows, error: null };

        } catch (error) {
            console.error('Database update error:', error);
            return { data: null, error: error };
        }
    }

    private async executeDelete() {
        try {
            let sql = `DELETE FROM ${this.table}`;
            if (this.whereClauses.length > 0) {
                sql += ` WHERE ${this.whereClauses.join(' AND ')}`;
            }
            const result = await this.pool.query(sql, this.params);
            return { data: result.rows, error: null };
        } catch (error) {
            console.error('Database delete error:', error);
            return { data: null, error: error };
        }
    }
}

export const neonDatabase = new NeonDatabase();
export const supabase = neonDatabase;
