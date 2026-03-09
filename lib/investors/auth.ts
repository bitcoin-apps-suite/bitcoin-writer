/**
 * Investor Auth Utilities
 *
 * Gets the authenticated unified user from request context.
 * Supports Supabase Auth, HandCash, MetaMask, Phantom, and Twitter.
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export interface UnifiedUser {
  id: string;
  display_name: string | null;
  primary_email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContext {
  unifiedUser: UnifiedUser;
  supabaseUserId?: string;
  handcashHandle?: string;
  walletProvider?: string;
  walletAddress?: string;
  twitterUser?: string;
}

/**
 * Get authenticated unified user from request context
 * Creates unified_user and user_identity if they don't exist
 */
export async function getAuthenticatedUser(): Promise<AuthContext | null> {
  const supabase = await createClient();

  // Check for Supabase user
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();

  // Check for cookie-based auth
  const cookieStore = await cookies();
  const handcashHandle = cookieStore.get('b0ase_user_handle')?.value;
  const walletProvider = cookieStore.get('b0ase_wallet_provider')?.value;
  const walletAddress = cookieStore.get('b0ase_wallet_address')?.value;
  const twitterUser = cookieStore.get('b0ase_twitter_user')?.value;

  if (!supabaseUser && !handcashHandle && !(walletProvider && walletAddress) && !twitterUser) {
    return null;
  }

  let unifiedUserId: string | null = null;

  // Try to find/create unified user from Supabase identity
  if (supabaseUser) {
    const { data: supabaseIdentities } = await supabase
      .from('user_identities')
      .select('unified_user_id')
      .eq('provider', 'supabase')
      .eq('provider_user_id', supabaseUser.id)
      .limit(1);

    const supabaseIdentity = supabaseIdentities?.[0];
    if (supabaseIdentity) {
      unifiedUserId = supabaseIdentity.unified_user_id;
    } else {
      // Create unified user
      const { data: newUnifiedUser, error: createError } = await supabase
        .from('unified_users')
        .insert({
          display_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
          primary_email: supabaseUser.email,
          avatar_url: supabaseUser.user_metadata?.avatar_url,
        })
        .select()
        .single();

      if (createError || !newUnifiedUser) {
        console.error('[investors/auth] Failed to create unified user:', createError);
        return null;
      }

      unifiedUserId = newUnifiedUser.id;

      // Link Supabase identity
      await supabase
        .from('user_identities')
        .insert({
          unified_user_id: unifiedUserId,
          provider: 'supabase',
          provider_user_id: supabaseUser.id,
          provider_email: supabaseUser.email,
          provider_handle: supabaseUser.user_metadata?.user_name || supabaseUser.user_metadata?.preferred_username,
          oauth_provider: supabaseUser.app_metadata?.provider,
          provider_data: {
            full_name: supabaseUser.user_metadata?.full_name,
            avatar_url: supabaseUser.user_metadata?.avatar_url,
          },
        });
    }
  }

  // Try HandCash
  if (!unifiedUserId && handcashHandle) {
    const { data: handcashIdentity } = await supabase
      .from('user_identities')
      .select('unified_user_id')
      .eq('provider', 'handcash')
      .eq('provider_user_id', handcashHandle)
      .single();

    if (handcashIdentity) {
      unifiedUserId = handcashIdentity.unified_user_id;
    } else {
      const { data: newUnifiedUser, error } = await supabase
        .from('unified_users')
        .insert({ display_name: handcashHandle })
        .select()
        .single();

      if (!error && newUnifiedUser) {
        unifiedUserId = newUnifiedUser.id;
        await supabase.from('user_identities').insert({
          unified_user_id: unifiedUserId,
          provider: 'handcash',
          provider_user_id: handcashHandle,
          provider_handle: `$${handcashHandle}`,
        });
      }
    }
  }

  // Try wallet (MetaMask/Phantom)
  if (!unifiedUserId && walletProvider && walletAddress) {
    const { data: walletIdentity } = await supabase
      .from('user_identities')
      .select('unified_user_id')
      .eq('provider', walletProvider)
      .eq('provider_user_id', walletAddress)
      .single();

    if (walletIdentity) {
      unifiedUserId = walletIdentity.unified_user_id;
    } else {
      const displayName = walletProvider === 'metamask'
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;

      const { data: newUnifiedUser, error } = await supabase
        .from('unified_users')
        .insert({ display_name: displayName })
        .select()
        .single();

      if (!error && newUnifiedUser) {
        unifiedUserId = newUnifiedUser.id;
        await supabase.from('user_identities').insert({
          unified_user_id: unifiedUserId,
          provider: walletProvider,
          provider_user_id: walletAddress,
          provider_handle: displayName,
          provider_data: {
            chain: walletProvider === 'metamask' ? 'ethereum' : 'solana',
            full_address: walletAddress,
          },
        });
      }
    }
  }

  // Try Twitter
  if (!unifiedUserId && twitterUser) {
    const { data: twitterIdentity } = await supabase
      .from('user_identities')
      .select('unified_user_id')
      .eq('provider', 'twitter')
      .eq('provider_handle', `@${twitterUser}`)
      .limit(1);

    if (twitterIdentity?.[0]) {
      unifiedUserId = twitterIdentity[0].unified_user_id;
    }
  }

  if (!unifiedUserId) {
    return null;
  }

  // Get the unified user, following any merge chain
  let { data: unifiedUser } = await supabase
    .from('unified_users')
    .select('*')
    .eq('id', unifiedUserId)
    .single();

  if (unifiedUser?.merged_into_id) {
    const { data: mergedUser } = await supabase
      .from('unified_users')
      .select('*')
      .eq('id', unifiedUser.merged_into_id)
      .single();
    if (mergedUser) {
      unifiedUser = mergedUser;
    }
  }

  if (!unifiedUser) {
    return null;
  }

  return {
    unifiedUser: unifiedUser as UnifiedUser,
    supabaseUserId: supabaseUser?.id,
    handcashHandle,
    walletProvider,
    walletAddress,
    twitterUser,
  };
}

/**
 * Check if user has completed KYC verification
 */
export async function checkKycStatus(userId: string): Promise<{
  hasKyc: boolean;
  status: string;
  isVerified: boolean;
}> {
  const supabase = await createClient();

  const { data: kyc } = await supabase
    .from('kyc_verifications')
    .select('status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    hasKyc: !!kyc,
    status: kyc?.status || 'none',
    isVerified: kyc?.status === 'approved',
  };
}

/**
 * Check if user is a registered investor
 */
export async function checkInvestorStatus(walletAddress: string): Promise<{
  isInvestor: boolean;
  shareholder: Record<string, unknown> | null;
}> {
  const supabase = await createClient();

  const { data: shareholder } = await supabase
    .from('cap_table_shareholders')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  return {
    isInvestor: !!shareholder,
    shareholder: shareholder || null,
  };
}
