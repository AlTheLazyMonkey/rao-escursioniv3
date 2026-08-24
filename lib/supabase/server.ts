import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase per Server Component, Route Handler e Server Action.
 * Lega la sessione ai cookie della richiesta: nei Server Component la
 * scrittura dei cookie viene ignorata (non è consentita da React durante
 * il render), ma viene comunque aggiornata dal proxy per ogni richiesta —
 * vedi proxy.ts.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chiamato da un Server Component: ignorabile, la sessione
            // viene comunque rinfrescata dal proxy ad ogni richiesta.
          }
        },
      },
    },
  );
}
