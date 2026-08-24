import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { dataEstesaFmt, oraFmt } from "@/lib/format";
import { aggiornaPrenotazione, annullaPrenotazione } from "@/lib/admin/actions";
import { PrenotazioneForm } from "@/components/admin/PrenotazioneForm";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import type { Partecipante, Prenotazione } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DettaglioPrenotazionePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: prenotazione }, { data: partecipanti }] = await Promise.all([
    supabase
      .from("prenotazioni")
      .select("*, escursioni(id, titolo, data_ora, punto_di_ritrovo)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("partecipanti").select("*").eq("id_prenotazione", id).order("id"),
  ]);

  if (!prenotazione) notFound();

  const p = prenotazione as Prenotazione & {
    escursioni: { id: string; titolo: string; data_ora: string; punto_di_ritrovo: string } | null;
  };
  const azione = aggiornaPrenotazione.bind(null, id);

  return (
    <div>
      <Link href="/admin/prenotazioni" className="text-sm font-bold text-ink-muted hover:text-ink">
        ← Tutte le prenotazioni
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">{p.numero_prenotazione}</h1>
        {p.stato !== "annullata" && (
          <ConfirmForm
            action={annullaPrenotazione.bind(null, id)}
            messaggio="Annullare questa prenotazione? I posti torneranno disponibili."
          >
            <button type="submit" className="rounded-pill px-5 py-2.5 text-sm font-bold text-accent-dark hover:bg-accent-soft">
              Annulla prenotazione
            </button>
          </ConfirmForm>
        )}
      </div>

      {p.escursioni && (
        <p className="mt-1.5 text-ink-soft">
          {p.escursioni.titolo} · {dataEstesaFmt(p.escursioni.data_ora)} · {oraFmt(p.escursioni.data_ora)} ·{" "}
          {p.escursioni.punto_di_ritrovo}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl">Dati prenotazione</h2>
          <div className="mt-4 rounded-card bg-page p-2">
            <PrenotazioneForm azione={azione} prenotazione={p} />
          </div>
          <div className="mt-6 rounded-card bg-surface p-5 text-sm text-ink-soft">
            <p>Contatto principale: {p.telefono ?? "—"} · {p.email ?? "—"}</p>
            <p className="mt-1">Creata il {dataEstesaFmt(p.data_creazione)}</p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl">Partecipanti ({p.numero_partecipanti})</h2>
          <div className="mt-4 flex flex-col gap-3">
            {(partecipanti as Partecipante[] | null)?.map((part, i) => (
              <div key={part.id} className="rounded-card bg-surface p-4">
                <p className="font-semibold">
                  {i + 1}. {part.nome} {part.cognome}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {part.telefono && <>Tel: {part.telefono} · </>}
                  {part.email && <>Email: {part.email} · </>}
                  {part.codice_fiscale && <>CF: {part.codice_fiscale}</>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
