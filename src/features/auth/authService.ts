import type { AuthError } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../lib/supabase';

// Every function here throws an Error with a message that is safe to show to the user.

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured. Fill in .env.local and restart npm run dev.');
  }
  return supabase;
}

function friendlyMessage(error: AuthError): string {
  if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
    return 'Too many emails were sent. Please wait a few minutes and try again.';
  }
  if (error.code === 'email_address_invalid') {
    return 'This email address is not valid.';
  }
  return error.message;
}

// Sends a sign-in link. New emails get an account automatically (= register).
export async function sendMagicLink(email: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Where the link in the email sends the user back to.
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw new Error(friendlyMessage(error));
}

export async function signOut(): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(friendlyMessage(error));
}