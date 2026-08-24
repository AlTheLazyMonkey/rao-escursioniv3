import { NextResponse } from "next/server";
import { createSupabaseAnonClient } from "@/lib/supabase/anon";
import { prenotazioneSchema } from "@/lib/validation";
import { inviaEmailConfermaPrenotazione } from "@/lib/email";
import type { CreaPrenotazioneRisultato } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Crea una prenotazione. La verifica atomica dei posti disponibili avviene
 * lato database (RPC crea_prenotazione, in transazione con lock di riga),
 * non qui: questo endpoint valida solo la forma dei dati e traduce
 * l'eventuale errore del database in un messaggio leggibile.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errore: "Corpo della richiesta non valido." }, { status: 400 });
  }

  const risultatoValidazione = prenotazioneSchema.safeParse(body);
  if (!risultatoValidazione.success) {
    return NextResponse.json(
      {
        errore: "Dati non validi.",
        dettagli: risultatoValidazione.error.issues.map((i) => ({
          campo: i.path.join("."),
          messaggio: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { id_escursione, partecipanti, note } = risultatoValidazione.data;
  const supabase = createSupabaseAnonClient();

  const { data, error } = await supabase.rpc("crea_prenotazione", {
    p_id_escursione: id_escursione,
    p_partecipanti: partecipanti.map((p) => ({
      nome: p.nome,
      cognome: p.cognome,
      codice_fiscale: p.codice_fiscale || null,
      telefono: p.telefono || null,
      email: p.email || null,
    })),
    p_note: note || null,
  });

  if (error) {
    console.error("[api/prenotazioni] RPC crea_prenotazione:", error);
    const messaggioConflitto = /posti non sufficienti/i.test(error.message);
    const nonTrovata = /non trovata/i.test(error.message);
    return NextResponse.json(
      { errore: error.message || "Impossibile completare la prenotazione." },
      { status: nonTrovata ? 404 : messaggioConflitto ? 409 : 400 },
    );
  }

  const risultato = data as CreaPrenotazioneRisultato;

  // L'email di conferma non deve mai far fallire la richiesta: la
  // prenotazione è già salvata a questo punto.
  const esitoEmail = await inviaEmailConfermaPrenotazione(risultato);

  return NextResponse.json({
    numero_prenotazione: risultato.numero_prenotazione,
    importo_totale: risultato.importo_totale,
    email_inviata: esitoEmail.inviata,
  });
}
