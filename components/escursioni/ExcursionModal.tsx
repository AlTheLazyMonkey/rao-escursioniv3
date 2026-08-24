"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { DifficoltaChip } from "@/components/ui/DifficoltaChip";
import { PillButton } from "@/components/ui/Pill";
import { dataEstesaFmt, oraFmt, prezzoFmt } from "@/lib/format";
import { estraiSrcMappaSicuro } from "@/lib/embed";
import type { EscursioneConDisponibilita } from "@/lib/types";
import { BookingForm } from "./BookingForm";
import type { SchedaModal } from "./apriPrenotazione";

export function ExcursionModal({
  escursione,
  schedaIniziale,
  onClose,
}: {
  escursione: EscursioneConDisponibilita;
  schedaIniziale: SchedaModal;
  onClose: () => void;
}) {
  const [scheda, setScheda] = useState<SchedaModal | "confermata">(schedaIniziale);
  const [conferma, setConferma] = useState<{ numeroPrenotazione: string; importoTotale: number } | null>(null);

  const e = escursione;
  const esaurita = e.posti_liberi <= 0;
  const srcMappa = estraiSrcMappaSicuro(e.embed_mappa);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/55 p-3 py-8 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-2xl rounded-card bg-page shadow-lifted"
        onClick={(ev) => ev.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titolo-escursione"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-page/90 text-ink shadow-soft hover:bg-surface"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {scheda === "confermata" && conferma ? (
          <div className="p-9 text-center sm:p-14">
            <span className="inline-flex h-18 w-18 items-center justify-center rounded-full bg-sage font-display text-3xl text-mint-surface">
              ✓
            </span>
            <h3 className="mt-5 font-display text-2xl text-sage-dark sm:text-[32px]">
              Prenotazione confermata
            </h3>
            <p className="mt-2.5 text-[17px] text-ink-soft">
              Numero prenotazione <strong>{conferma.numeroPrenotazione}</strong> — totale{" "}
              {prezzoFmt(conferma.importoTotale)}. Ti abbiamo inviato una email di riepilogo;
              ti scriviamo entro 24 ore per confermare gli ultimi dettagli.
            </p>
            <PillButton type="button" onClick={onClose} className="mt-7">
              Chiudi
            </PillButton>
          </div>
        ) : (
          <>
            <div className="h-56 sm:h-72">
              <ImagePlaceholder
                label={`foto di copertina — ${e.titolo}`}
                className="rounded-t-card rounded-b-none"
              />
            </div>

            <div className="p-6 sm:p-9">
              {scheda === "dettaglio" ? (
                <>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <DifficoltaChip difficolta={e.difficolta} />
                    <span className="text-sm font-semibold text-ink-muted">
                      {dataEstesaFmt(e.data_ora)} · {oraFmt(e.data_ora)}
                    </span>
                  </div>
                  <h2 id="modal-titolo-escursione" className="mt-3 font-display text-2xl leading-tight sm:text-[34px]">
                    {e.titolo}
                  </h2>

                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-[15px] sm:grid-cols-3">
                    <Dettaglio etichetta="Zona" valore={e.zona} />
                    {e.dislivello && <Dettaglio etichetta="Dislivello" valore={e.dislivello} />}
                    {e.lunghezza_percorso && <Dettaglio etichetta="Lunghezza" valore={e.lunghezza_percorso} />}
                    {e.durata && <Dettaglio etichetta="Durata" valore={e.durata} />}
                    <Dettaglio etichetta="Prezzo" valore={prezzoFmt(e.prezzo)} />
                    <Dettaglio
                      etichetta="Posti"
                      valore={esaurita ? "Esauriti" : `${e.posti_liberi} liberi su ${e.posti_totali}`}
                    />
                  </dl>

                  <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink-soft">
                    {e.descrizione}
                  </p>

                  <div className="mt-5 rounded-card bg-surface p-4">
                    <span className="text-sm font-bold text-ink-soft">Punto di ritrovo</span>
                    <p className="mt-1 text-[15px] text-ink">{e.punto_di_ritrovo}</p>
                  </div>

                  {srcMappa && (
                    <div className="mt-5 overflow-hidden rounded-card">
                      <iframe
                        src={srcMappa}
                        title={`Mappa del sentiero — ${e.titolo}`}
                        width="100%"
                        height="320"
                        style={{ border: 0 }}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="mt-7">
                    <PillButton
                      type="button"
                      disabled={esaurita}
                      onClick={() => setScheda("prenotazione")}
                      className="w-full sm:w-auto"
                    >
                      {esaurita ? "Posti esauriti" : "Prenota"}
                    </PillButton>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setScheda("dettaglio")}
                    className="mb-5 text-sm font-bold text-ink-muted hover:text-ink"
                  >
                    ← Torna al dettaglio
                  </button>
                  <h2 id="modal-titolo-escursione" className="font-display text-2xl leading-tight sm:text-[30px]">
                    {e.titolo}
                  </h2>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    {dataEstesaFmt(e.data_ora)} · {oraFmt(e.data_ora)}
                  </p>
                  <div className="mt-6">
                    <BookingForm
                      escursione={e}
                      onSuccess={(info) => {
                        setConferma(info);
                        setScheda("confermata");
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Dettaglio({ etichetta, valore }: { etichetta: string; valore: string }) {
  return (
    <div>
      <dt className="text-ink-faint">{etichetta}</dt>
      <dd className="font-semibold text-ink">{valore}</dd>
    </div>
  );
}
