import { Resend } from "resend";
import type { CreaPrenotazioneRisultato } from "./types";
import { dataEstesaFmt, oraFmt, prezzoFmt } from "./format";

const MITTENTE =
  process.env.RESEND_FROM_EMAIL || "RAO escursioni <onboarding@resend.dev>";

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

/**
 * Invia l'email di conferma prenotazione al contatto principale, con il
 * riepilogo dei dati come richiesto dalla specifica. Se RESEND_API_KEY non
 * è configurata la funzione non fallisce: la prenotazione resta comunque
 * salvata sul DB, solo l'email non parte (utile in sviluppo).
 */
export async function inviaEmailConfermaPrenotazione(
  risultato: CreaPrenotazioneRisultato,
) {
  const client = getResendClient();

  if (!client) {
    console.warn(
      `[email] RESEND_API_KEY non configurata: email di conferma per ${risultato.numero_prenotazione} non inviata.`,
    );
    return { inviata: false };
  }

  if (!risultato.email) {
    console.warn(
      `[email] Prenotazione ${risultato.numero_prenotazione} priva di email di contatto: invio saltato.`,
    );
    return { inviata: false };
  }

  const { escursione } = risultato;
  const righePartecipanti = risultato.partecipanti
    .map((p) => `${p.nome} ${p.cognome}`)
    .join(", ");

  const html = `
    <div style="font-family:Figtree,Arial,sans-serif;color:#201e1d;max-width:560px;margin:0 auto">
      <h1 style="font-size:22px;margin:0 0 16px">Prenotazione confermata</h1>
      <p>Ciao, la tua richiesta per <strong>${escursione.titolo}</strong> è stata registrata.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
        <tbody>
          <tr><td style="padding:6px 0;color:#645c50">Numero prenotazione</td><td style="padding:6px 0;text-align:right"><strong>${risultato.numero_prenotazione}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#645c50">Data e ora</td><td style="padding:6px 0;text-align:right">${dataEstesaFmt(escursione.data_ora)} · ${oraFmt(escursione.data_ora)}</td></tr>
          <tr><td style="padding:6px 0;color:#645c50">Punto di ritrovo</td><td style="padding:6px 0;text-align:right">${escursione.punto_di_ritrovo}</td></tr>
          <tr><td style="padding:6px 0;color:#645c50">Partecipanti</td><td style="padding:6px 0;text-align:right">${risultato.numero_partecipanti} (${righePartecipanti})</td></tr>
          <tr><td style="padding:6px 0;color:#645c50">Totale</td><td style="padding:6px 0;text-align:right"><strong>${prezzoFmt(risultato.importo_totale)}</strong></td></tr>
        </tbody>
      </table>
      <p style="color:#474238">Ti scriviamo entro 24 ore se ci sono variazioni. Per qualsiasi modifica o cancellazione, rispondi a questa email: le prenotazioni possono essere aggiornate solo dalla guida.</p>
      <p style="color:#82796a;font-size:13px;margin-top:32px">RAO — escursioni ed emozioni</p>
    </div>
  `;

  try {
    await client.emails.send({
      from: MITTENTE,
      to: risultato.email,
      subject: `Prenotazione confermata — ${escursione.titolo} (${risultato.numero_prenotazione})`,
      html,
    });
    return { inviata: true };
  } catch (err) {
    console.error("[email] invio conferma prenotazione fallito:", err);
    return { inviata: false };
  }
}

/** Invia al gestore del sito una richiesta di preventivo per uscite su misura. */
export async function inviaEmailRichiestaPreventivo(params: {
  nome: string;
  email: string;
  telefono?: string;
  persone?: number;
  usciteDiInteresse?: string;
  messaggio?: string;
}) {
  const client = getResendClient();
  const destinatario = process.env.RESEND_NOTIFY_EMAIL;

  if (!client || !destinatario) {
    console.warn(
      "[email] RESEND_API_KEY o RESEND_NOTIFY_EMAIL non configurati: richiesta di preventivo non inoltrata via email (resta comunque nei log del server).",
    );
    return { inviata: false };
  }

  const html = `
    <div style="font-family:Figtree,Arial,sans-serif;color:#201e1d;max-width:560px;margin:0 auto">
      <h1 style="font-size:20px;margin:0 0 16px">Nuova richiesta dal sito</h1>
      <p><strong>${params.nome}</strong> — ${params.email}${params.telefono ? ` — ${params.telefono}` : ""}</p>
      ${params.persone ? `<p>Persone: ${params.persone}</p>` : ""}
      ${params.usciteDiInteresse ? `<p>Uscita di interesse: ${params.usciteDiInteresse}</p>` : ""}
      ${params.messaggio ? `<p style="white-space:pre-wrap">${params.messaggio}</p>` : ""}
    </div>
  `;

  try {
    await client.emails.send({
      from: MITTENTE,
      to: destinatario,
      replyTo: params.email,
      subject: `Richiesta preventivo — ${params.nome}`,
      html,
    });
    return { inviata: true };
  } catch (err) {
    console.error("[email] invio richiesta preventivo fallito:", err);
    return { inviata: false };
  }
}
