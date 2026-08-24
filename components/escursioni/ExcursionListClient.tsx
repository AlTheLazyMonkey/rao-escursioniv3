"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EscursioneConDisponibilita } from "@/lib/types";
import type { OrdinePagina } from "@/lib/data";
import { ExcursionCard } from "./ExcursionCard";
import { FiltersBar } from "./FiltersBar";

const PAGINA = 9;

interface Filtri {
  zona: string;
  difficolta: string;
  ordine: OrdinePagina;
}

export function ExcursionListClient({
  escursioniIniziali,
  hasMoreIniziale,
  zone,
}: {
  escursioniIniziali: EscursioneConDisponibilita[];
  hasMoreIniziale: boolean;
  zone: string[];
}) {
  const [filtri, setFiltri] = useState<Filtri>({ zona: "", difficolta: "", ordine: "data" });
  const [escursioni, setEscursioni] = useState(escursioniIniziali);
  const [hasMore, setHasMore] = useState(hasMoreIniziale);
  const [caricando, setCaricando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const primoRender = useRef(true);
  const sentinellaRef = useRef<HTMLDivElement | null>(null);

  const carica = useCallback(async (offset: number, f: Filtri, sostituisci: boolean) => {
    setCaricando(true);
    setErrore(null);
    try {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(PAGINA),
        ordine: f.ordine,
      });
      if (f.zona) params.set("zona", f.zona);
      if (f.difficolta) params.set("difficolta", f.difficolta);

      const res = await fetch(`/api/escursioni?${params.toString()}`);
      if (!res.ok) throw new Error("Errore nel caricamento delle escursioni.");
      const body = (await res.json()) as { items: EscursioneConDisponibilita[]; hasMore: boolean };

      setEscursioni((prev) => (sostituisci ? body.items : [...prev, ...body.items]));
      setHasMore(body.hasMore);
    } catch {
      setErrore("Non è stato possibile caricare altre escursioni. Riprova.");
    } finally {
      setCaricando(false);
    }
  }, []);

  // Rifai la ricerca da capo quando cambiano i filtri (non al primo render:
  // per quello usiamo già i dati pre-caricati dal server).
  useEffect(() => {
    if (primoRender.current) {
      primoRender.current = false;
      return;
    }
    void carica(0, filtri, true);
  }, [filtri, carica]);

  useEffect(() => {
    const nodo = sentinellaRef.current;
    if (!nodo) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !caricando) {
          void carica(escursioni.length, filtri, false);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(nodo);
    return () => observer.disconnect();
  }, [carica, escursioni.length, filtri, hasMore, caricando]);

  return (
    <div>
      <FiltersBar
        zone={zone}
        zona={filtri.zona}
        difficolta={filtri.difficolta}
        ordine={filtri.ordine}
        onChange={setFiltri}
      />

      {escursioni.length === 0 && !caricando ? (
        <div className="mt-8 rounded-card bg-surface p-10 text-center text-ink-soft">
          Nessuna escursione trovata con questi filtri.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {escursioni.map((e) => (
            <ExcursionCard key={e.id} escursione={e} />
          ))}
        </div>
      )}

      <div ref={sentinellaRef} className="h-4" />

      {caricando && (
        <p className="mt-8 text-center text-sm font-semibold text-ink-muted">Caricamento…</p>
      )}
      {errore && (
        <div className="mt-8 text-center">
          <p className="text-sm font-semibold text-accent-dark">{errore}</p>
          <button
            type="button"
            onClick={() => void carica(escursioni.length, filtri, false)}
            className="mt-2 font-bold text-accent-dark underline underline-offset-2"
          >
            Riprova
          </button>
        </div>
      )}
      {!hasMore && !caricando && escursioni.length > 0 && (
        <p className="mt-8 text-center text-sm text-ink-faint">
          Hai visto tutte le uscite in programma.
        </p>
      )}
    </div>
  );
}
