import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Movie = {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  backdrop_url: string | null;
  release_date: string | null;
  rating: number | null;
  genre: string[] | null;
  duration: number | null;
  director: string | null;
  cast: string[] | null;
  trailer_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string;
  role: 'user' | 'admin';
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRole = 'user' | 'admin';
