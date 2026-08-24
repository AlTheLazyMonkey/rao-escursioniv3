"use client";

import type { EscursioneConDisponibilita } from "@/lib/types";
import { giornoNumero, meseBreve, oraFmt, prezzoFmt } from "@/lib/format";
import { DifficoltaChip } from "@/components/ui/DifficoltaChip";
import { PrenotaButton } from "./PrenotaButton";
import { apriModalEscursione } from "./apriPrenotazione";

export function ExcursionRow({
  escursione,
  mostraPrezzo = true,
}: {
  escursione: EscursioneConDisponibilita;
  mostraPrezzo?: boolean;
}) {
  const e = escursione;
  const esaurita = e.posti_liberi <= 0;

  return (
    <button
      type="button"
      onClick={() => apriModalEscursione(e.id, "dettaglio")}
      className="group flex w-full flex-col gap-4 rounded-card bg-surface p-5 text-left transition-colors duration-150 hover:bg-surface-hover sm:grid sm:grid-cols-[104px_1fr_auto] sm:items-center sm:gap-7 sm:p-7"
    >
      <div className="flex h-[88px] w-[88px] shrink-0 flex-col items-center justify-center rounded-full bg-mint-surface sm:h-[104px] sm:w-[104px]">
        <span className="font-display text-2xl leading-none text-sage sm:text-[32px]">
          {giornoNumero(e.data_ora)}
        </span>
        <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-sage-mid">
          {meseBreve(e.data_ora)}
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-xl leading-tight sm:text-[29px]">{e.titolo}</h3>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[15px] text-ink-soft">
          <DifficoltaChip difficolta={e.difficolta} />
          <span>ore {oraFmt(e.data_ora)}</span>
          <span className="text-separator">·</span>
          <span>{e.zona}</span>
          {e.dislivello && (
            <>
              <span className="text-separator">·</span>
              <span>{e.dislivello}</span>
            </>
          )}
          {e.lunghezza_percorso && (
            <>
              <span className="text-separator">·</span>
              <span>{e.lunghezza_percorso}</span>
            </>
          )}
          {e.durata && (
            <>
              <span className="text-separator">·</span>
              <span>{e.durata}</span>
            </>
          )}
          <span className="text-separator">·</span>
          <span className={esaurita ? "font-semibold text-accent-dark" : ""}>
            {esaurita ? "Posti esauriti" : `${e.posti_liberi} posti liberi su ${e.posti_totali}`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 sm:justify-end">
        {mostraPrezzo && (
          <span className="font-display text-xl sm:text-2xl">{prezzoFmt(e.prezzo)}</span>
        )}
        <PrenotaButton idEscursione={e.id} scheda="prenotazione" disabled={esaurita}>
          {esaurita ? "Lista d'attesa" : "Prenota"}
        </PrenotaButton>
      </div>
    </button>
  );
}
