"use client";

import { useMemo, useState, type FormEvent } from "react";
import { PillButton } from "@/components/ui/Pill";
import { prezzoFmt } from "@/lib/format";
import { CODICE_FISCALE_REGEX } from "@/lib/validation";
import type { EscursioneConDisponibilita } from "@/lib/types";

interface PartecipanteForm {
  nome: string;
  cognome: string;
  codice_fiscale: string;
  telefono: string;
  email: string;
}

const PARTECIPANTE_VUOTO: PartecipanteForm = {
  nome: "",
  cognome: "",
  codice_fiscale: "",
  telefono: "",
  email: "",
};

const inputClass =
  "rounded-pill border-[1.5px] border-border bg-surface-soft px-4.5 py-3.5 text-base text-ink placeholder:text-ink-faint";
const labelClass = "flex flex-col gap-2 text-sm font-bold text-ink-soft";

export function BookingForm({
  escursione,
  onSuccess,
}: {
  escursione: EscursioneConDisponibilita;
  onSuccess: (info: { numeroPrenotazione: string; importoTotale: number }) => void;
}) {
  const postiLiberi = escursione.posti_liberi;
  const maxPersone = Math.max(postiLiberi, 0);

  const [numeroPersone, setNumeroPersone] = useState(Math.min(1, maxPersone));
  const [partecipanti, setPartecipanti] = useState<PartecipanteForm[]>([{ ...PARTECIPANTE_VUOTO }]);
  const [note, setNote] = useState("");
  const [consenso, setConsenso] = useState(false);
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const importoStimato = useMemo(
    () => escursione.prezzo * numeroPersone,
    [escursione.prezzo, numeroPersone],
  );

  function aggiornaNumeroPersone(valore: number) {
    const n = Math.min(Math.max(valore, 1), maxPersone);
    setNumeroPersone(n);
    setPartecipanti((prev) => {
      const next = prev.slice(0, n);
      while (next.length < n) next.push({ ...PARTECIPANTE_VUOTO });
      return next;
    });
  }

  function aggiornaPartecipante(indice: number, campo: keyof PartecipanteForm, valore: string) {
    setPartecipanti((prev) =>
      prev.map((p, i) => (i === indice ? { ...p, [campo]: valore } : p)),
    );
  }

  function validaLocalmente(): string | null {
    for (let i = 0; i < partecipanti.length; i++) {
      const p = partecipanti[i];
      if (!p.nome.trim() || !p.cognome.trim()) {
        return `Nome e cognome sono obbligatori per il partecipante ${i + 1}.`;
      }
      if (i === 0) {
        if (!p.telefono.trim()) return "Il telefono del referente è obbligatorio.";
        if (!p.email.trim()) return "L'email del referente è obbligatoria.";
      }
      if (escursione.richiede_codice_fiscale) {
        const cf = p.codice_fiscale.trim().toUpperCase();
        if (!cf) return `Il codice fiscale è obbligatorio per il partecipante ${i + 1}.`;
        if (!CODICE_FISCALE_REGEX.test(cf)) {
          return `Il codice fiscale del partecipante ${i + 1} non è in un formato valido.`;
        }
      }
    }
    if (!consenso) return "Devi accettare l'informativa privacy per continuare.";
    return null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const erroreLocale = validaLocalmente();
    if (erroreLocale) {
      setErrore(erroreLocale);
      return;
    }
    setErrore(null);
    setInvio(true);
    try {
      const res = await fetch("/api/prenotazioni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_escursione: escursione.id,
          partecipanti: partecipanti.map((p) => ({
            nome: p.nome.trim(),
            cognome: p.cognome.trim(),
            codice_fiscale: p.codice_fiscale.trim() || undefined,
            telefono: p.telefono.trim() || undefined,
            email: p.email.trim() || undefined,
          })),
          note: note.trim() || undefined,
          consenso_privacy: true,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.errore || "Non è stato possibile completare la prenotazione.");
      }
      onSuccess({
        numeroPrenotazione: body.numero_prenotazione,
        importoTotale: body.importo_totale,
      });
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setInvio(false);
    }
  }

  if (maxPersone < 1) {
    return (
      <div className="rounded-card bg-surface p-8 text-center text-ink-soft">
        Questa uscita è al completo. Scrivici dal form &ldquo;Uscita su misura&rdquo; per essere
        avvisato in caso di posti liberi o per organizzare una data privata.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <label className={`${labelClass} max-w-[220px]`}>
        Quante persone (max {maxPersone} disponibili)
        <select
          value={numeroPersone}
          onChange={(e) => aggiornaNumeroPersone(Number(e.target.value))}
          className={inputClass}
        >
          {Array.from({ length: maxPersone }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "persona" : "persone"}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-5">
        {partecipanti.map((p, i) => (
          <fieldset key={i} className="rounded-card border border-border bg-surface p-5">
            <legend className="px-1 text-sm font-bold text-ink-soft">
              {i === 0 ? "Partecipante 1 — referente della prenotazione" : `Partecipante ${i + 1}`}
            </legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Nome
                <input
                  className={inputClass}
                  required
                  value={p.nome}
                  onChange={(e) => aggiornaPartecipante(i, "nome", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                Cognome
                <input
                  className={inputClass}
                  required
                  value={p.cognome}
                  onChange={(e) => aggiornaPartecipante(i, "cognome", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                Telefono {i === 0 ? "" : "(facoltativo)"}
                <input
                  className={inputClass}
                  type="tel"
                  required={i === 0}
                  value={p.telefono}
                  onChange={(e) => aggiornaPartecipante(i, "telefono", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                Email {i === 0 ? "" : "(facoltativa)"}
                <input
                  className={inputClass}
                  type="email"
                  required={i === 0}
                  value={p.email}
                  onChange={(e) => aggiornaPartecipante(i, "email", e.target.value)}
                />
              </label>
              {escursione.richiede_codice_fiscale && (
                <label className={`${labelClass} sm:col-span-2`}>
                  Codice fiscale
                  <input
                    className={`${inputClass} uppercase`}
                    required
                    maxLength={16}
                    value={p.codice_fiscale}
                    onChange={(e) =>
                      aggiornaPartecipante(i, "codice_fiscale", e.target.value.toUpperCase())
                    }
                  />
                </label>
              )}
            </div>
          </fieldset>
        ))}
      </div>

      <label className={labelClass}>
        Note (facoltativo)
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Allenamento, bambini, allergie, richieste particolari…"
          className="rounded-soft border-[1.5px] border-border bg-surface-soft px-5 py-4 text-base text-ink placeholder:text-ink-faint resize-y"
        />
      </label>

      <div className="flex items-center justify-between gap-4 rounded-card bg-mint-surface px-5 py-4">
        <span className="text-sm font-semibold text-sage-dark">
          Totale stimato ({numeroPersone} {numeroPersone === 1 ? "persona" : "persone"})
        </span>
        <span className="font-display text-2xl text-sage-dark">{prezzoFmt(importoStimato)}</span>
      </div>

      {errore && (
        <p role="alert" className="text-sm font-semibold text-accent-dark">
          {errore}
        </p>
      )}

      <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-start gap-2.5 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={consenso}
            onChange={(e) => setConsenso(e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-accent"
          />
          Ho letto{" "}
          <a href="/privacy" target="_blank" className="underline underline-offset-2 text-accent-dark">
            l&rsquo;informativa privacy
          </a>{" "}
          e acconsento al trattamento dei dati personali.
        </label>
        <PillButton type="submit" disabled={invio} className="w-full sm:w-auto">
          {invio ? "Invio in corso…" : "Invia richiesta"}
        </PillButton>
      </div>
    </form>
  );
}
