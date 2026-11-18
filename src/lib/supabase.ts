import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

// A missing env means the local visual demo can run without connecting to a DB.
// Never put service_role, secret or AI API keys in VITE_* variables.
export function getSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey || url.includes('YOUR_PROJECT_REF')) return null;
  if (!cachedClient) cachedClient = createClient(url, publishableKey);
  return cachedClient;
}
