import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          nickname: string;
          phone: string;
          password_hash: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          nickname: string;
          phone: string;
          password_hash: string;
        };
        Update: {
          nickname?: string;
          phone?: string;
          password_hash?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: number;
          user_id: number;
          festival_id: string;
          created_at: string;
        };
        Insert: {
          user_id: number;
          festival_id: string;
        };
        Update: {
          user_id?: number;
          festival_id?: string;
        };
      };
      reviews: {
        Row: {
          id: number;
          user_id: number;
          festival_id: string;
          festival_end_date: string;
          text: string;
          rating: number;
          x: number;
          y: number;
          font_size: number;
          rotate: number;
          color: string;
          created_at: string;
        };
        Insert: {
          user_id: number;
          festival_id: string;
          festival_end_date: string;
          text: string;
          rating: number;
          x: number;
          y: number;
          font_size: number;
          rotate: number;
          color: string;
        };
        Update: never; // 수정 불가
      };
    };
  };
};
