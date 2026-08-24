"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase per i Client Component (browser).
 * Usa la chiave pubblica "anon": tutte le operazioni sensibili sono
 * protette da Row Level Security (vedi supabase/migrations/0001_init.sql).
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
