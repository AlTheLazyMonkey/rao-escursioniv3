"use client";

import { useActionState } from "react";
import type { Escursione } from "@/lib/types";
import type { StatoForm } from "@/lib/admin/actions";

const inputClass =
  "rounded-pill border-[1.5px] border-border bg-surface-soft px-4.5 py-3 text-base text-ink";
const textareaClass =
  "rounded-soft border-[1.5px] border-border bg-surface-soft px-5 py-3.5 text-base text-ink resize-y";
const labelClass = "flex flex-col gap-2 text-sm font-bold text-ink-soft";

function isoADataOra(iso: string | undefined) {
  if (!iso) return { data: "", ora: "09:00" };
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    data: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    ora: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

export function EscursioneForm({
  azione,
  escursione,
}: {
  azione: (prevState: StatoForm, formData: FormData) => Promise<StatoForm>;
  escursione?: Escursione;
}) {
  const [stato, formAction, invio] = useActionState(azione, {});
  const { data, ora } = isoADataOra(escursione?.data_ora);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          Titolo
          <input name="titolo" required defaultValue={escursione?.titolo} className={inputClass} />
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Descrizione completa
          <textarea
            name="descrizione"
            required
            rows={6}
            defaultValue={escursione?.descrizione}
            className={textareaClass}
          />
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Descrizione breve (facoltativa — se vuota, si useranno i primi caratteri della descrizione)
          <textarea
            name="descrizione_breve"
            rows={2}
            defaultValue={escursione?.descrizione_breve ?? ""}
            className={textareaClass}
          />
        </label>

        <label className={labelClass}>
          Zona
          <input name="zona" required defaultValue={escursione?.zona} className={inputClass} />
        </label>
        <label className={labelClass}>
          Difficoltà
          <select name="difficolta" defaultValue={escursione?.difficolta ?? "Facile"} className={inputClass}>
            <option value="Facile">Facile</option>
            <option value="Medio">Medio</option>
            <option value="Difficile">Difficile</option>
          </select>
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Punto di ritrovo (indirizzo preciso)
          <input
            name="punto_di_ritrovo"
            required
            defaultValue={escursione?.punto_di_ritrovo}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Dislivello
          <input name="dislivello" defaultValue={escursione?.dislivello ?? ""} placeholder="es. 900 m D+" className={inputClass} />
        </label>
        <label className={labelClass}>
          Lunghezza percorso
          <input name="lunghezza_percorso" defaultValue={escursione?.lunghezza_percorso ?? ""} placeholder="es. 11 km" className={inputClass} />
        </label>
        <label className={labelClass}>
          Durata
          <input name="durata" defaultValue={escursione?.durata ?? ""} placeholder="es. 6 ore" className={inputClass} />
        </label>
        <label className={labelClass}>
          Posti totali
          <input
            name="posti_totali"
            type="number"
            min={1}
            required
            defaultValue={escursione?.posti_totali ?? 12}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Data
          <input name="data" type="date" required defaultValue={data} className={inputClass} />
        </label>
        <label className={labelClass}>
          Ora
          <input name="ora" type="time" required defaultValue={ora} className={inputClass} />
        </label>

        <label className={labelClass}>
          Prezzo (€)
          <input
            name="prezzo"
            type="number"
            min={0}
            step="0.01"
            defaultValue={escursione?.prezzo ?? 0}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Stato
          <select name="stato" defaultValue={escursione?.stato ?? "bozza"} className={inputClass}>
            <option value="bozza">Bozza</option>
            <option value="pubblicata">Pubblicata</option>
            <option value="annullata">Annullata</option>
            <option value="conclusa">Conclusa</option>
          </select>
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          URL foto di copertina (facoltativo)
          <input
            name="foto"
            type="url"
            placeholder="https://…"
            defaultValue={escursione?.foto ?? ""}
            className={inputClass}
          />
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Embed mappa del sentiero (solo Komoot o Mapy — incolla il codice &lt;iframe&gt;)
          <textarea
            name="embed_mappa"
            rows={3}
            defaultValue={escursione?.embed_mappa ?? ""}
            placeholder='<iframe src="https://www.komoot.com/..."></iframe>'
            className={textareaClass}
          />
        </label>

        <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-soft sm:col-span-2">
          <input
            type="checkbox"
            name="richiede_codice_fiscale"
            defaultChecked={escursione?.richiede_codice_fiscale}
            className="h-5 w-5 accent-accent"
          />
          Richiede il codice fiscale di ogni partecipante (es. per assicurazione)
        </label>
      </div>

      {stato.errore && <p className="font-semibold text-accent-dark">{stato.errore}</p>}

      <button
        type="submit"
        disabled={invio}
        className="self-start rounded-pill bg-accent px-7 py-3.5 font-bold text-on-accent hover:bg-accent-hover disabled:opacity-60"
      >
        {invio ? "Salvataggio…" : "Salva"}
      </button>
    </form>
  );
}
