import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, AuthError } from '@supabase/supabase-js';
import { supabase, type Profile } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Refreshing profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Profile fetch error:', error);

        // If the table doesn't exist, set profile to null
        if (error.message.includes('relation "public.profiles" does not exist')) {
          console.log('Profiles table does not exist. Falling back to user metadata.');
          // Fall back to user metadata for role
          const fallbackProfile: Profile = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || null,
            role: (user.user_metadata?.role as 'user' | 'admin') || 'user',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(fallbackProfile);
          return;
        }

        // If profile doesn't exist (PGRST116), try to create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create one...');

          try {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email,
                role: user.user_metadata?.role || 'user',
              })
              .select()
              .single();

            if (createError) {
              console.warn('Failed to create profile:', createError);
              // Fall back to user metadata
              const fallbackProfile: Profile = {
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.email || null,
                role: (user.user_metadata?.role as 'user' | 'admin') || 'user',
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              setProfile(fallbackProfile);
            } else {
              console.log('Profile created successfully:', newProfile);
              setProfile(newProfile as Profile);
            }
            return;
          } catch (createError) {
            console.warn('Profile creation failed:', createError);
            setProfile(null);
            return;
          }
        }

        // If it's a 406 error (Not Acceptable), it might be RLS blocking access
        if (error.message.includes('406')) {
          console.log('RLS policy blocking profile access. Falling back to user metadata.');
          // Fall back to user metadata for role
          const fallbackProfile: Profile = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || null,
            role: (user.user_metadata?.role as 'user' | 'admin') || 'user',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(fallbackProfile);
          return;
        }

        throw error;
      }

      if (data) {
        console.log('Profile loaded successfully:', data);
        // Check if the role in the profile matches the user metadata
        const metadataRole = user.user_metadata?.role;
        if (metadataRole && data.role !== metadataRole) {
          console.log('Profile role mismatch. Updating from', data.role, 'to', metadataRole);
          // Update the profile with the correct role
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: metadataRole })
            .eq('id', user.id);

          if (!updateError) {
            data.role = metadataRole;
            console.log('Profile role updated successfully');
          } else {
            console.warn('Failed to update profile role:', updateError);
          }
        }
        setProfile(data as Profile);
      } else {
        console.log('No profile data returned');
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fall back to user metadata as last resort
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email || null,
        role: (user.user_metadata?.role as 'user' | 'admin') || 'user',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
    }
  }, [user]);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          await refreshProfile();
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      setUser(data.user);
      await refreshProfile();
    }

    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
