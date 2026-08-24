export type SchedaModal = "dettaglio" | "prenotazione";

export const EVENTO_APRI_MODAL = "rao:escursione-modal";

export interface DettaglioEventoApriModal {
  id: string;
  scheda: SchedaModal;
}

/** Apre il modal globale (vedi BookingModalHost) su una data escursione. */
export function apriModalEscursione(id: string, scheda: SchedaModal = "dettaglio") {
  window.dispatchEvent(
    new CustomEvent<DettaglioEventoApriModal>(EVENTO_APRI_MODAL, {
      detail: { id, scheda },
    }),
  );
}
