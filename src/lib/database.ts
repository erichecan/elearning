// import { createClient } from '@supabase/supabase-js';
import { neonDatabase } from './neon-database';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabase = neonDatabase;

// 数据类型定义
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