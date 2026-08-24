import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase "anon" senza stato/cookie, per Route Handler pubblici
 * (creazione prenotazioni, richieste di preventivo). Non serve una sessione:
 * la sicurezza è garantita dalla RPC SECURITY DEFINER e dalla RLS.
 */
export function createSupabaseAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
