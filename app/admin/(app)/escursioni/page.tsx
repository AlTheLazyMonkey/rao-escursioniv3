import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { dataBreveFmt, oraFmt, prezzoFmt } from "@/lib/format";
import { eliminaEscursione, annullaEscursione } from "@/lib/admin/actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import type { EscursioneConDisponibilita } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATO_LABEL: Record<string, string> = {
  bozza: "Bozza",
  pubblicata: "Pubblicata",
  annullata: "Annullata",
  conclusa: "Conclusa",
};

const STATO_STILE: Record<string, string> = {
  bozza: "bg-medium text-medium-ink",
  pubblicata: "bg-mint text-sage",
  annullata: "bg-accent-soft text-accent-dark",
  conclusa: "bg-border text-ink-muted",
};

export default async function AdminEscursioniPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("escursioni_con_disponibilita")
    .select("*")
    .order("data_ora", { ascending: false });

  const escursioni = (data ?? []) as EscursioneConDisponibilita[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Escursioni</h1>
        <Link href="/admin/escursioni/nuova" className="rounded-pill bg-accent px-6 py-3 font-bold text-on-accent hover:bg-accent-hover">
          + Nuova escursione
        </Link>
      </div>

      {error && <p className="mt-6 text-accent-dark">{error.message}</p>}

      <div className="mt-7 flex flex-col gap-3">
        {escursioni.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center gap-4 rounded-card bg-surface p-5">
            <span className={`rounded-pill px-3 py-1 text-xs font-bold ${STATO_STILE[e.stato]}`}>
              {STATO_LABEL[e.stato]}
            </span>
            <div className="min-w-[220px] flex-1">
              <p className="font-semibold">{e.titolo}</p>
              <p className="text-sm text-ink-muted">
                {dataBreveFmt(e.data_ora)} · {oraFmt(e.data_ora)} · {e.zona} · {prezzoFmt(e.prezzo)} ·{" "}
                {e.posti_liberi}/{e.posti_totali} liberi
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/escursioni/${e.id}`}
                className="rounded-pill border-2 border-ink px-4 py-2 text-sm font-bold hover:bg-page"
              >
                Modifica
              </Link>
              {e.stato === "pubblicata" && (
                <ConfirmForm
                  action={annullaEscursione.bind(null, e.id)}
                  messaggio="Segnare questa escursione come annullata?"
                >
                  <button type="submit" className="rounded-pill bg-ink px-4 py-2 text-sm font-bold text-page hover:bg-ink-soft">
                    Annulla uscita
                  </button>
                </ConfirmForm>
              )}
              <ConfirmForm
                action={eliminaEscursione.bind(null, e.id)}
                messaggio="Eliminare definitivamente questa escursione? Non è possibile se ha prenotazioni collegate."
              >
                <button type="submit" className="rounded-pill px-4 py-2 text-sm font-bold text-accent-dark hover:bg-accent-soft">
                  Elimina
                </button>
              </ConfirmForm>
            </div>
          </div>
        ))}
        {escursioni.length === 0 && (
          <p className="rounded-card bg-surface p-8 text-center text-ink-soft">
            Nessuna escursione ancora creata.
          </p>
        )}
      </div>
    </div>
  );
}
