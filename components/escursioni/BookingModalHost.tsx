"use client";

import { useCallback, useEffect, useState } from "react";
import { ExcursionModal } from "./ExcursionModal";
import { EVENTO_APRI_MODAL, type DettaglioEventoApriModal, type SchedaModal } from "./apriPrenotazione";
import type { EscursioneConDisponibilita } from "@/lib/types";

type Stato =
  | { fase: "chiuso" }
  | { fase: "caricamento" }
  | { fase: "errore"; messaggio: string }
  | { fase: "pronto"; escursione: EscursioneConDisponibilita; scheda: SchedaModal };

/**
 * Montato una volta sola vicino alla radice dell'app. Qualunque bottone
 * "Prenota" nel sito (hero, calendario home, card dell'elenco…) apre
 * questo stesso modal via apriModalEscursione(), senza bisogno di passarsi
 * lo stato tra componenti server distanti tra loro.
 */
export function BookingModalHost() {
  const [stato, setStato] = useState<Stato>({ fase: "chiuso" });

  const chiudi = useCallback(() => setStato({ fase: "chiuso" }), []);

  useEffect(() => {
    async function apri(id: string, scheda: SchedaModal) {
      setStato({ fase: "caricamento" });
      try {
        const res = await fetch(`/api/escursioni/${id}`);
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "Questa uscita non è più disponibile." : "Errore nel caricamento.",
          );
        }
        const escursione = (await res.json()) as EscursioneConDisponibilita;
        setStato({ fase: "pronto", escursione, scheda });
      } catch (err) {
        setStato({
          fase: "errore",
          messaggio: err instanceof Error ? err.message : "Errore imprevisto.",
        });
      }
    }

    function onEvento(e: Event) {
      const custom = e as CustomEvent<DettaglioEventoApriModal>;
      if (!custom.detail) return;
      void apri(custom.detail.id, custom.detail.scheda);
    }

    window.addEventListener(EVENTO_APRI_MODAL, onEvento);
    return () => window.removeEventListener(EVENTO_APRI_MODAL, onEvento);
  }, []);

  useEffect(() => {
    if (stato.fase === "chiuso") return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") chiudi();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [stato.fase, chiudi]);

  if (stato.fase === "chiuso") return null;

  if (stato.fase === "caricamento") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55" onClick={chiudi}>
        <div className="rounded-card bg-page px-8 py-6 text-ink-soft shadow-lifted">Caricamento…</div>
      </div>
    );
  }

  if (stato.fase === "errore") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4" onClick={chiudi}>
        <div
          className="rounded-card bg-page px-7 py-6 text-center shadow-lifted"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-ink-soft">{stato.messaggio}</p>
          <button
            type="button"
            onClick={chiudi}
            className="mt-4 rounded-pill bg-ink px-6 py-2.5 font-bold text-page"
          >
            Chiudi
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExcursionModal
      escursione={stato.escursione}
      schedaIniziale={stato.scheda}
      onClose={chiudi}
    />
  );
}
