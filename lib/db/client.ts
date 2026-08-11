/**
 * @file lib/db/client.ts
 * @description Supabase client singleton for FieldAgentMVP.
 * Uses the service-role key so it bypasses RLS — only call from server-side code.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client initialised with the service-role key.
 * Never exposes this to the browser — server-side only.
 *
 * @throws {Error} When the required env vars are missing.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      '[FieldAgent] Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.'
    );
  }

  _client = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return _client;
}
