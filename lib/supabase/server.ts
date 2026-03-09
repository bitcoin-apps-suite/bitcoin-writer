import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Check if we're in demo mode
const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co';
};

// Mock server client for demo mode - returns null errors to avoid console spam
const createMockServerClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    mfa: {
      listFactors: async () => ({ data: { totp: [], phone: [] }, error: null }),
      getAuthenticatorAssuranceLevel: async () => ({ data: { currentLevel: 'aal1', nextLevel: null }, error: null }),
    },
  },
  from: () => createMockQueryBuilder(),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      download: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      list: async () => ({ data: [], error: null }),
      remove: async () => ({ data: null, error: null }),
    }),
  },
});

// Chainable mock query builder for Supabase
const createMockQueryBuilder = () => {
  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    upsert: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    containedBy: () => builder,
    filter: () => builder,
    not: () => builder,
    or: () => builder,
    and: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return builder;
};

export async function createClient() {
  // Return mock client in demo mode
  if (isDemoMode()) {
    return createMockServerClient() as any;
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Enhance cookie options for cross-domain OAuth flow
              const isProduction = process.env.NODE_ENV === 'production'
              const enhancedOptions = {
                ...options,
                // Make cookies accessible across the OAuth redirect flow
                sameSite: 'lax' as const,
                // Ensure secure cookies in production
                secure: isProduction,
                // Longer max-age for PKCE cookies (10 minutes)
                maxAge: options?.maxAge || 600,
              }
              cookieStore.set(name, value, enhancedOptions)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.error('Error setting cookies:', error)
          }
        },
      },
    }
  )
}
