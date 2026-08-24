"use client";

import { useState, type FormEvent } from "react";
import { PillButton } from "@/components/ui/Pill";

interface UscitaOpzione {
  id: string;
  titolo: string;
}

const inputClass =
  "rounded-pill border-[1.5px] border-border bg-surface-soft px-4.5 py-3.5 text-base text-ink placeholder:text-ink-faint";
const textareaClass =
  "rounded-soft border-[1.5px] border-border bg-surface-soft px-5 py-4 text-base text-ink placeholder:text-ink-faint resize-y";
const labelClass = "flex flex-col gap-2 text-sm font-bold text-ink-soft";

export function RichiestaForm({ uscite }: { uscite: UscitaOpzione[] }) {
  const [inviata, setInviata] = useState(false);
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrore(null);
    const form = new FormData(e.currentTarget);
    const consenso = form.get("consenso_privacy") === "on";

    if (!consenso) {
      setErrore("Devi accettare l'informativa privacy per continuare.");
      return;
    }

    setInvio(true);
    try {
      const res = await fetch("/api/richieste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.get("nome"),
          email: form.get("email"),
          telefono: form.get("telefono") || undefined,
          persone: form.get("persone") ? Number(form.get("persone")) : undefined,
          uscita_di_interesse: form.get("uscita") || undefined,
          messaggio: form.get("messaggio") || undefined,
          consenso_privacy: true,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.errore || "Invio non riuscito.");
      }
      setInviata(true);
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Invio non riuscito.");
    } finally {
      setInvio(false);
    }
  }

  if (inviata) {
    return (
      <div className="rounded-card bg-mint p-9 text-center sm:p-14">
        <span className="inline-flex h-18 w-18 items-center justify-center rounded-full bg-sage font-display text-3xl text-mint-surface">
          ✓
        </span>
        <h3 className="mt-5 font-display text-2xl text-sage-dark sm:text-[32px]">
          Richiesta inviata
        </h3>
        <p className="mt-2.5 text-[17px] text-sage">
          Ti scrivo entro 24 ore. A presto sul sentiero.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-card bg-surface p-6 sm:p-9">
      <div className="grid gap-4.5 sm:grid-cols-2">
        <label className={labelClass}>
          Nome e cognome
          <input name="nome" type="text" required placeholder="Come ti chiami" className={inputClass} />
        </label>
        <label className={labelClass}>
          Email
          <input name="email" type="email" required placeholder="nome@email.it" className={inputClass} />
        </label>
        <label className={labelClass}>
          Telefono
          <input name="telefono" type="tel" placeholder="+39" className={inputClass} />
        </label>
        <label className={labelClass}>
          Persone
          <input name="persone" type="number" min={1} defaultValue={2} className={inputClass} />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Uscita di interesse
          <select name="uscita" defaultValue="" className={inputClass}>
            <option value="">Un&rsquo;uscita privata / su misura</option>
            {uscite.map((u) => (
              <option key={u.id} value={u.titolo}>
                {u.titolo}
              </option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Raccontami qualcosa
          <textarea
            name="messaggio"
            rows={4}
            placeholder="Livello di allenamento, bambini, date alternative…"
            className={textareaClass}
          />
        </label>
      </div>

      {errore && <p className="mt-4 text-sm font-semibold text-accent-dark">{errore}</p>}

      <div className="mt-6 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-start gap-2.5 text-sm text-ink-muted">
          <input
            name="consenso_privacy"
            type="checkbox"
            required
            className="mt-0.5 h-5 w-5 accent-accent"
          />
          Ho letto{" "}
          <a href="/privacy" className="underline underline-offset-2 text-accent-dark">
            l&rsquo;informativa privacy
          </a>
        </label>
        <PillButton type="submit" disabled={invio} className="w-full sm:w-auto">
          {invio ? "Invio in corso…" : "Invia richiesta"}
        </PillButton>
      </div>
    </form>
  );
}
