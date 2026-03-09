import { createBrowserClient } from '@supabase/ssr'

// Check if we're in demo mode (no real Supabase credentials)
export const isDemoMode = () => {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
         !process.env.NEXT_PUBLIC_SUPABASE_URL ||
         process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co';
};

// Lazy singleton - only created when first accessed
let _supabase: ReturnType<typeof createBrowserClient> | null = null;

// Demo user for mock authentication
const DEMO_USER = {
  id: 'demo-user-id-12345',
  email: 'demo@localhost',
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: { provider: 'email' },
  user_metadata: { name: 'Demo User' },
  aud: 'authenticated',
  role: 'authenticated',
};

const DEMO_SESSION = {
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: DEMO_USER,
};

// Mock auth state management for demo mode
let mockAuthState: { user: typeof DEMO_USER | null; session: typeof DEMO_SESSION | null } = {
  user: null,
  session: null,
};
let authStateListeners: ((event: string, session: typeof DEMO_SESSION | null) => void)[] = [];

// Mock auth methods for demo mode - supports signing into demo account
const createMockClient = () => ({
  auth: {
    getSession: async () => ({
      data: { session: mockAuthState.session },
      error: null
    }),
    getUser: async () => ({
      data: { user: mockAuthState.user },
      error: null
    }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Accept any credentials in demo mode
      mockAuthState = { user: { ...DEMO_USER, email }, session: { ...DEMO_SESSION, user: { ...DEMO_USER, email } } };
      // Notify listeners
      authStateListeners.forEach(cb => cb('SIGNED_IN', mockAuthState.session));
      return { data: { user: mockAuthState.user, session: mockAuthState.session }, error: null };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      mockAuthState = { user: { ...DEMO_USER, email }, session: { ...DEMO_SESSION, user: { ...DEMO_USER, email } } };
      authStateListeners.forEach(cb => cb('SIGNED_IN', mockAuthState.session));
      return { data: { user: mockAuthState.user, session: mockAuthState.session }, error: null };
    },
    signInWithOtp: async ({ email }: { email: string }) => {
      mockAuthState = { user: { ...DEMO_USER, email }, session: { ...DEMO_SESSION, user: { ...DEMO_USER, email } } };
      authStateListeners.forEach(cb => cb('SIGNED_IN', mockAuthState.session));
      return { error: null };
    },
    signInWithOAuth: async ({ provider }: { provider: string }) => {
      // Simulate OAuth by immediately signing in
      mockAuthState = { user: DEMO_USER, session: DEMO_SESSION };
      authStateListeners.forEach(cb => cb('SIGNED_IN', mockAuthState.session));
      return { data: { url: null, provider }, error: null };
    },
    signOut: async () => {
      mockAuthState = { user: null, session: null };
      authStateListeners.forEach(cb => cb('SIGNED_OUT', null));
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: typeof DEMO_SESSION | null) => void) => {
      authStateListeners.push(callback);
      // Return a mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authStateListeners = authStateListeners.filter(cb => cb !== callback);
            }
          }
        }
      };
    },
    linkIdentity: async () => ({ data: { url: null }, error: null }),
    mfa: {
      listFactors: async () => ({ data: { totp: [], phone: [] }, error: null }),
      enroll: async () => ({ data: null, error: null }),
      unenroll: async () => ({ data: null, error: null }),
      challenge: async () => ({ data: null, error: null }),
      verify: async () => ({ data: null, error: null }),
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
    // Make builder thenable so `await supabase.from().select()` works
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return builder;
};

export function createClient() {
  // If in demo mode or missing credentials, return mock client
  if (isDemoMode()) {
    console.log('[Supabase] Running in demo mode - auth/database features disabled');
    return createMockClient() as any;
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Handle auth errors gracefully (e.g., expired refresh tokens)
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Auth token refreshed successfully');
    }
    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    }
  });

  return supabase;
}

// Lazy getter - doesn't create client at import time
export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient();
  }
  return _supabase;
}

export default createClient;
