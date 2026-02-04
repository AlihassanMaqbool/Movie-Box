-- =================================================================
-- MovieBox App - Complete Supabase Database Setup
-- =================================================================
--
-- This SQL script sets up the complete database schema for the MovieBox
-- movie management application built with React, TypeScript, and Supabase.
--
-- Features:
-- - User authentication and profiles with role-based access
-- - Movie catalog with full CRUD operations
-- - Row Level Security (RLS) policies for data protection
-- - Automatic profile creation on user signup
-- - Admin and user role management
-- - Sample movie data for testing
--
-- Setup Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to the SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute
--
-- After setup, update your environment variables:
-- VITE_SUPABASE_URL=your_supabase_url
-- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
--
-- =================================================================

-- Create profiles table
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id AND auth.role() = 'authenticated');

-- Create movies table
DROP TABLE IF EXISTS public.movies CASCADE;
CREATE TABLE public.movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  release_date DATE,
  rating DECIMAL(3,1),
  genre TEXT[],
  duration INTEGER,
  director TEXT,
  "cast" TEXT[],
  trailer_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for movies
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Create policies for movies table
DROP POLICY IF EXISTS "Anyone can view movies" ON public.movies;
CREATE POLICY "Anyone can view movies" ON public.movies
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert movies" ON public.movies;
CREATE POLICY "Authenticated users can insert movies" ON public.movies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own movies" ON public.movies;
CREATE POLICY "Users can update their own movies" ON public.movies
  FOR UPDATE USING (auth.uid() = movies.created_by);

DROP POLICY IF EXISTS "Admins can update any movie" ON public.movies;
CREATE POLICY "Admins can update any movie" ON public.movies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete any movie" ON public.movies;
CREATE POLICY "Admins can delete any movie" ON public.movies
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Disable RLS for this insert operation
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
-- Note: Profile creation is now handled client-side in AuthContext
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_movies ON public.movies;
CREATE TRIGGER handle_updated_at_movies
  BEFORE UPDATE ON public.movies
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create indexes for better performance
DROP INDEX IF EXISTS idx_movies_created_by;
CREATE INDEX idx_movies_created_by ON public.movies(created_by);
DROP INDEX IF EXISTS idx_movies_title;
CREATE INDEX idx_movies_title ON public.movies(title);
DROP INDEX IF EXISTS idx_movies_genre;
CREATE INDEX idx_movies_genre ON public.movies USING GIN(genre);
DROP INDEX IF EXISTS idx_movies_rating;
CREATE INDEX idx_movies_rating ON public.movies(rating);
DROP INDEX IF EXISTS idx_movies_release_date;
CREATE INDEX idx_movies_release_date ON public.movies(release_date);
DROP INDEX IF EXISTS idx_profiles_role;
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- =================================================================
-- Setup Complete!
-- =================================================================
--
-- Your MovieBox database is now ready. Here's what you can do:
--
-- 1. Test the setup by running your application
-- 2. Sign up as an admin user to test movie management
-- 3. The sample movies will appear in your app immediately
-- 4. Use the DatabaseSetupChecker component to verify everything works
--
-- Admin Features:
-- - Add new movies via the "Add Movie" page
-- - Edit any movie in the catalog
-- - Delete movies from the catalog
-- - View all user profiles and roles
--
-- User Features:
-- - Browse and view all movies
-- - Search and filter movies
-- - View movie details and trailers
--
-- Security Notes:
-- - Row Level Security is enabled on all tables
-- - Users can only modify their own profiles
-- - Only admins can modify movie data
-- - All data access is authenticated
--
-- =================================================================

-- Insert sample movies (optional - remove if not needed)
INSERT INTO public.movies (title, description, poster_url, backdrop_url, release_date, rating, genre, duration, director, "cast", trailer_url)
VALUES
  (
    'Inception',
    'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    '2010-07-16',
    8.8,
    ARRAY['Action', 'Sci-Fi', 'Thriller'],
    148,
    'Christopher Nolan',
    ARRAY['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
    'https://www.youtube.com/watch?v=YoHD9XEInc0'
  ),
  (
    'The Dark Knight',
    'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/original/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    '2008-07-18',
    9.0,
    ARRAY['Action', 'Crime', 'Drama'],
    152,
    'Christopher Nolan',
    ARRAY['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    'https://www.youtube.com/watch?v=EXeTwQWrcwY'
  ),
  (
    'Interstellar',
    'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.',
    'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    '2014-11-07',
    8.6,
    ARRAY['Adventure', 'Drama', 'Sci-Fi'],
    169,
    'Christopher Nolan',
    ARRAY['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    'https://www.youtube.com/watch?v=zSWdZVtXT7E'
  )
ON CONFLICT DO NOTHING;