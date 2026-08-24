"use client";

import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PillButton } from "@/components/ui/Pill";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [invio, setInvio] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrore(null);
    setInvio(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setInvio(false);
    if (error) {
      setErrore("Email o password non corrette.");
      return;
    }
    // Navigazione "piena" (non router.push): forza un giro completo dal
    // server così il layout admin rilegge subito la sessione appena creata.
    const next = new URLSearchParams(window.location.search).get("next") || "/admin";
    window.location.href = next;
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-card bg-surface p-8 shadow-raised">
      <h1 className="font-display text-2xl">Area amministrazione</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Accesso riservato alla gestione del sito.</p>

      <label className="mt-6 flex flex-col gap-2 text-sm font-bold text-ink-soft">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-pill border-[1.5px] border-border bg-surface-soft px-4.5 py-3 text-base text-ink"
        />
      </label>
      <label className="mt-4 flex flex-col gap-2 text-sm font-bold text-ink-soft">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-pill border-[1.5px] border-border bg-surface-soft px-4.5 py-3 text-base text-ink"
        />
      </label>

      {errore && <p className="mt-4 text-sm font-semibold text-accent-dark">{errore}</p>}

      <PillButton type="submit" disabled={invio} className="mt-6 w-full">
        {invio ? "Accesso in corso…" : "Accedi"}
      </PillButton>
    </form>
  );
}
