// Tipi allineati allo schema definito in supabase/migrations/0001_init.sql

export type Difficolta = "Facile" | "Medio" | "Difficile";

export type StatoEscursione = "bozza" | "pubblicata" | "annullata" | "conclusa";

export type StatoPrenotazione =
  | "in_attesa"
  | "confermata"
  | "pagata"
  | "annullata";

export interface Escursione {
  id: string;
  foto: string | null;
  titolo: string;
  descrizione: string;
  descrizione_breve: string | null;
  richiede_codice_fiscale: boolean;
  zona: string;
  punto_di_ritrovo: string;
  dislivello: string | null;
  lunghezza_percorso: string | null;
  durata: string | null;
  difficolta: Difficolta;
  data_ora: string; // timestamptz ISO
  prezzo: number;
  posti_totali: number;
  embed_mappa: string | null;
  stato: StatoEscursione;
  created_at: string;
  updated_at: string;
}

/** Escursione arricchita con i posti liberi calcolati lato server. */
export interface EscursioneConDisponibilita extends Escursione {
  posti_liberi: number;
}

export interface Prenotazione {
  id: string;
  numero_prenotazione: string;
  id_escursione: string;
  numero_partecipanti: number;
  data_creazione: string;
  stato: StatoPrenotazione;
  importo_totale: number;
  telefono: string | null;
  email: string | null;
  note: string | null;
}

export interface Partecipante {
  id: string;
  id_prenotazione: string;
  nome: string;
  cognome: string;
  codice_fiscale: string | null;
  telefono: string | null;
  email: string | null;
}

export interface PrenotazionePartecipanteInput {
  nome: string;
  cognome: string;
  codice_fiscale?: string;
  telefono?: string;
  email?: string;
}

export interface CreaPrenotazioneInput {
  id_escursione: string;
  partecipanti: PrenotazionePartecipanteInput[];
  note?: string;
  consenso_privacy: boolean;
}

/** Forma del JSON restituito dalla RPC Postgres crea_prenotazione(). */
export interface CreaPrenotazioneRisultato {
  id: string;
  numero_prenotazione: string;
  importo_totale: number;
  numero_partecipanti: number;
  telefono: string | null;
  email: string | null;
  note: string | null;
  escursione: {
    id: string;
    titolo: string;
    data_ora: string;
    punto_di_ritrovo: string;
    prezzo: number;
  };
  partecipanti: { nome: string; cognome: string }[];
}
