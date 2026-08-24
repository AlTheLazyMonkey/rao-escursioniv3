import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:px-0">
      <div className="mb-8 rounded-card bg-accent-soft p-5 text-sm leading-relaxed text-accent-soft-ink">
        <strong>Bozza da validare.</strong> Questo testo è un modello di partenza, non una
        consulenza legale: prima della pubblicazione va rivisto da un consulente
        privacy/legale, verificando in particolare i tempi di conservazione, l&rsquo;eventuale
        nomina di responsabili del trattamento (Supabase, Resend) e i diritti applicabili.
      </div>

      <h1 className="font-display text-3xl sm:text-4xl">Informativa privacy</h1>
      <p className="mt-2 text-sm text-ink-faint">Ultimo aggiornamento: da definire</p>

      <div className="mt-8 flex flex-col gap-7 text-[17px] leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl text-ink">Titolare del trattamento</h2>
          <p className="mt-2">
            Andrea Favret, P.IVA 01941620930, guida ambientale escursionistica AIGAE FR122
            (&ldquo;RAO escursioni ed emozioni&rdquo;).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Dati raccolti</h2>
          <p className="mt-2">
            Quando prenoti un&rsquo;escursione raccogliamo nome, cognome, telefono ed email del
            referente della prenotazione; per gli altri partecipanti, nome e cognome (e
            telefono/email solo se li fornisci volontariamente). Per le escursioni che lo
            richiedono per motivi assicurativi raccogliamo anche il codice fiscale di ogni
            partecipante. Se ci scrivi tramite il modulo di richiesta preventivo raccogliamo
            nome, email, telefono e il contenuto del messaggio.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Finalità e base giuridica</h2>
          <p className="mt-2">
            Trattiamo i tuoi dati per gestire la prenotazione e l&rsquo;escursione (esecuzione
            del contratto), per rispondere alle richieste di preventivo (misure
            precontrattuali) e, dove richiesto, sulla base del consenso espresso al momento
            dell&rsquo;invio del modulo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Conservazione</h2>
          <p className="mt-2">
            I dati delle prenotazioni sono conservati per il tempo necessario alla gestione
            dell&rsquo;escursione e agli obblighi fiscali/assicurativi successivi; da definire
            insieme al consulente il periodo esatto di conservazione.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Servizi terzi</h2>
          <p className="mt-2">
            Per il funzionamento del sito ci appoggiamo a Supabase (database e
            autenticazione) e, per l&rsquo;invio delle email di conferma, a Resend. Entrambi
            trattano i dati per nostro conto in qualità di responsabili del trattamento.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">I tuoi diritti</h2>
          <p className="mt-2">
            Puoi chiedere in qualsiasi momento accesso, rettifica, cancellazione o
            limitazione del trattamento dei tuoi dati scrivendo al titolare ai recapiti
            indicati in fondo al sito.
          </p>
        </section>
      </div>
    </div>
  );
}
