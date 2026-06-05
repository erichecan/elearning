import { neonDatabase } from './neon-database';

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
    sentence?: string;
    sentence_cn?: string;
    sentence_audio_url?: string;
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