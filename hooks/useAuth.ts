'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

/**
 * Hook for checking authentication status
 *
 * Returns:
 * - user: Currently authenticated user (null if not logged in)
 * - accessToken: the session's bearer token, for calling our own API
 * - isAuthenticated: Boolean indicating if user is logged in
 * - isLoading: Boolean indicating if still checking auth status
 *
 * ⚠ `accessToken` IS NOT A CONVENIENCE. Callers were reaching for `user.getIdToken()`, a
 * FIREBASE method that does not exist on a Supabase user, and sending the resulting
 * `undefined` as a bearer token. The token was always right there in the session this hook
 * already fetches — it was just being thrown away with the rest of it.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
  };
}
