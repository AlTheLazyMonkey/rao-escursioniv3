"use client";

import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { DifficoltaChip } from "@/components/ui/DifficoltaChip";
import { dataBreveFmt, oraFmt, prezzoFmt, troncaTesto } from "@/lib/format";
import type { EscursioneConDisponibilita } from "@/lib/types";
import { apriModalEscursione } from "./apriPrenotazione";
import { PrenotaButton } from "./PrenotaButton";

export function ExcursionCard({ escursione: e }: { escursione: EscursioneConDisponibilita }) {
  const esaurita = e.posti_liberi <= 0;
  const descrizioneBreve = e.descrizione_breve || troncaTesto(e.descrizione, 110);

  return (
    <button
      type="button"
      onClick={() => apriModalEscursione(e.id, "dettaglio")}
      className="group flex flex-col overflow-hidden rounded-card bg-surface text-left shadow-soft transition-shadow duration-150 hover:shadow-lifted"
    >
      <div className="relative h-[190px] shrink-0">
        {e.foto ? (
          <Image
            src={e.foto}
            alt={e.titolo}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder label={e.titolo} className="rounded-none" />
        )}
        <span className="absolute left-4 top-4 rounded-pill bg-page px-3.5 py-1.5 text-sm font-bold text-ink shadow-soft">
          {dataBreveFmt(e.data_ora)} · {oraFmt(e.data_ora)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <DifficoltaChip difficolta={e.difficolta} className="self-start" />
        <h3 className="mt-3.5 font-display text-xl leading-tight">{e.titolo}</h3>
        <p className="mt-1.5 text-sm text-ink-soft">
          {e.zona}
          {e.dislivello ? ` · ${e.dislivello}` : ""}
          {e.lunghezza_percorso ? ` · ${e.lunghezza_percorso}` : ""}
          {e.durata ? ` · ${e.durata}` : ""}
        </p>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-soft">{descrizioneBreve}</p>

        <p className={`mt-3.5 text-sm font-semibold ${esaurita ? "text-accent-dark" : "text-sage"}`}>
          {esaurita ? "Posti esauriti" : `${e.posti_liberi} posti liberi su ${e.posti_totali}`}
        </p>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="font-display text-xl">{prezzoFmt(e.prezzo)}</span>
          <PrenotaButton idEscursione={e.id} scheda="prenotazione" disabled={esaurita} className="text-sm">
            {esaurita ? "Lista d'attesa" : "Prenota"}
          </PrenotaButton>
        </div>
      </div>
    </button>
  );
}
