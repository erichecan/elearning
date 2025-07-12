import Database from 'better-sqlite3';

// 数据类型定义 (与原database.ts保持一致)
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

class LocalDatabase {
  private db: Database.Database;

  constructor(dbPath: string = './local-elearning.db') {
    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');
  }

  // 模拟Supabase的查询接口
  from(table: string) {
    return new LocalQueryBuilder(this.db, table);
  }

  close() {
    this.db.close();
  }
}

class LocalQueryBuilder {
  private db: Database.Database;
  private table: string;
  private selectFields: string = '*';
  private whereClauses: string[] = [];
  private orderClauses: string[] = [];
  private limitNum?: number;
  private params: any[] = [];

  constructor(db: Database.Database, table: string) {
    this.db = db;
    this.table = table;
  }

  select(fields: string) {
    this.selectFields = fields;
    return this;
  }

  eq(field: string, value: any) {
    this.whereClauses.push(`${field} = ?`);
    this.params.push(value);
    return this;
  }

  or(condition: string) {
    // 简化处理 or 条件，实际使用时可能需要更复杂的解析
    if (condition.includes('ilike')) {
      const parts = condition.split(',');
      const orConditions = parts.map(part => {
        const match = part.match(/(\w+)\.ilike\.%(.+)%/);
        if (match) {
          this.params.push(`%${match[2]}%`);
          return `${match[1]} LIKE ?`;
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
      let actualParams = [...this.params];

      // 处理复杂的SELECT语句
      if (this.selectFields.includes('categories!inner') || this.selectFields.includes('categories(')) {
        // 处理带JOIN的查询
        if (this.table === 'words') {
          sql = `SELECT w.*, c.display_name, c.icon, c.color FROM words w 
                 INNER JOIN categories c ON w.category_id = c.id`;
          
          // 处理favorites JOIN
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

      // 处理WHERE条件
      if (this.whereClauses.length > 0) {
        // 替换表别名
        const whereClause = this.whereClauses.join(' AND ')
          .replace(/categories\.name/g, 'c.name')
          .replace(/categories\.display_name/g, 'c.display_name')
          .replace(/words\./g, 'w.')
          .replace(/favorites\./g, 'f.');
        sql += ` WHERE ${whereClause}`;
      }

      // 处理ORDER BY
      if (this.orderClauses.length > 0) {
        sql += ` ORDER BY ${this.orderClauses.join(', ')}`;
      }

      // 处理LIMIT
      if (this.limitNum) {
        sql += ` LIMIT ${this.limitNum}`;
      }

      console.log('执行SQL:', sql, '参数:', actualParams);
      
      const stmt = this.db.prepare(sql);
      
      if (single) {
        const result = stmt.get(...actualParams);
        return { data: result || null, error: null };
      } else {
        const results = stmt.all(...actualParams);
        return { data: results || [], error: null };
      }
    } catch (error) {
      console.error('Database query error:', error);
      console.log('SQL:', sql, 'Params:', this.params);
      return { data: null, error: error };
    }
  }

  // 插入操作
  async insert(data: any) {
    try {
      const fields = Object.keys(data);
      const placeholders = fields.map(() => '?').join(', ');
      const sql = `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${placeholders})`;
      
      const stmt = this.db.prepare(sql);
      const result = stmt.run(...Object.values(data)); // [自动修复] 2024-07-06 23:32:00 恢复 result 变量用于 lastInsertRowid
      return { data: { id: result.lastInsertRowid }, error: null };
    } catch (error) {
      console.error('Database insert error:', error);
      return { data: null, error: error };
    }
  }

  // 删除操作
  async delete() {
    try {
      let sql = `DELETE FROM ${this.table}`;
      
      if (this.whereClauses.length > 0) {
        sql += ` WHERE ${this.whereClauses.join(' AND ')}`;
      }
      
      const stmt = this.db.prepare(sql);
      stmt.run(...this.params);
      
      return { data: null, error: null };
    } catch (error) {
      console.error('Database delete error:', error);
      return { data: null, error: error };
    }
  }

  // 获取所有结果的方法
  async then(callback: (result: { data: any, error: any }) => void) {
    const result = await this.executeQuery();
    callback(result);
  }
}

// 创建本地数据库实例
export const localDatabase = new LocalDatabase();

// 导出与原始 database.ts 兼容的接口
export const supabase = localDatabase; 