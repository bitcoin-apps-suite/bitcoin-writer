import { createClient } from '@supabase/supabase-js';

// Check if we're in demo mode
const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
         !process.env.NEXT_PUBLIC_SUPABASE_URL ||
         process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co';
};

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

// Mock admin client for demo mode - returns null errors to avoid console spam
const createMockAdminClient = () => ({
  auth: {
    admin: {
      listUsers: async () => ({ data: { users: [] }, error: null }),
      getUserById: async () => ({ data: { user: null }, error: null }),
      deleteUser: async () => ({ data: null, error: null }),
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

/**
 * Creates a Supabase client configured for admin operations using the service role key.
 * IMPORTANT: This client bypasses all RLS policies and should only be used in secure
 * server-side environments (e.g., API routes, server components) where you've
 * already verified the user's authorization.
 *
 * In demo mode, returns a mock client that returns empty data.
 */
export const createAdminClient = () => {
  // Return mock client in demo mode
  if (isDemoMode()) {
    console.log('[Supabase Admin] Running in demo mode - admin features disabled');
    return createMockAdminClient() as any;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!serviceRoleKey) {
    throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}; 