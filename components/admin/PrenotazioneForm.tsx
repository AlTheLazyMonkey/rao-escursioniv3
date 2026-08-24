"use client";

import { useActionState } from "react";
import type { Prenotazione } from "@/lib/types";
import type { StatoForm } from "@/lib/admin/actions";

const inputClass =
  "rounded-pill border-[1.5px] border-border bg-surface-soft px-4.5 py-3 text-base text-ink";
const labelClass = "flex flex-col gap-2 text-sm font-bold text-ink-soft";

export function PrenotazioneForm({
  azione,
  prenotazione,
}: {
  azione: (prevState: StatoForm, formData: FormData) => Promise<StatoForm>;
  prenotazione: Prenotazione;
}) {
  const [stato, formAction, invio] = useActionState(azione, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Stato
          <select name="stato" defaultValue={prenotazione.stato} className={inputClass}>
            <option value="in_attesa">In attesa</option>
            <option value="confermata">Confermata</option>
            <option value="pagata">Pagata</option>
            <option value="annullata">Annullata</option>
          </select>
        </label>
        <label className={labelClass}>
          Importo totale (€)
          <input
            name="importo_totale"
            type="number"
            min={0}
            step="0.01"
            defaultValue={prenotazione.importo_totale}
            className={inputClass}
          />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Note
          <textarea
            name="note"
            rows={3}
            defaultValue={prenotazione.note ?? ""}
            className="rounded-soft border-[1.5px] border-border bg-surface-soft px-5 py-3.5 text-base text-ink resize-y"
          />
        </label>
      </div>

      {stato.errore && <p className="font-semibold text-accent-dark">{stato.errore}</p>}

      <button
        type="submit"
        disabled={invio}
        className="self-start rounded-pill bg-accent px-7 py-3.5 font-bold text-on-accent hover:bg-accent-hover disabled:opacity-60"
      >
        {invio ? "Salvataggio…" : "Salva modifiche"}
      </button>
    </form>
  );
}
