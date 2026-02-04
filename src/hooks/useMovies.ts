import { useState, useEffect, useCallback } from 'react';
import { supabase, type Movie } from '@/lib/supabase';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setMovies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMovie = useCallback(async (movieData: Omit<Movie, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data, error: supabaseError } = await supabase
        .from('movies')
        .insert([{
          ...movieData,
          created_by: userData.user.id,
        }])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setMovies(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, []);

  const updateMovie = useCallback(async (id: string, movieData: Partial<Movie>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('movies')
        .update(movieData)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setMovies(prev => prev.map(movie => movie.id === id ? data : movie));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, []);

  const deleteMovie = useCallback(async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('movies')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      setMovies(prev => prev.filter(movie => movie.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    loading,
    error,
    fetchMovies,
    addMovie,
    updateMovie,
    deleteMovie,
  };
}
