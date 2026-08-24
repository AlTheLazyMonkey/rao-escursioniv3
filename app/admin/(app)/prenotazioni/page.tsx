import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { dataBreveFmt, oraFmt, prezzoFmt } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATO_LABEL: Record<string, string> = {
  in_attesa: "In attesa",
  confermata: "Confermata",
  pagata: "Pagata",
  annullata: "Annullata",
};

const STATO_STILE: Record<string, string> = {
  in_attesa: "bg-medium text-medium-ink",
  confermata: "bg-mint text-sage",
  pagata: "bg-sage text-mint-surface",
  annullata: "bg-accent-soft text-accent-dark",
};

interface RigaPrenotazione {
  id: string;
  numero_prenotazione: string;
  numero_partecipanti: number;
  stato: string;
  importo_totale: number;
  telefono: string | null;
  email: string | null;
  data_creazione: string;
  escursioni: { titolo: string; data_ora: string } | null;
}

export default async function AdminPrenotazioniPage({
  searchParams,
}: {
  searchParams: Promise<{ stato?: string }>;
}) {
  const { stato } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("prenotazioni")
    .select("id, numero_prenotazione, numero_partecipanti, stato, importo_totale, telefono, email, data_creazione, escursioni(titolo, data_ora)")
    .order("data_creazione", { ascending: false });

  if (stato) query = query.eq("stato", stato);

  const { data, error } = await query;
  const prenotazioni = (data ?? []) as unknown as RigaPrenotazione[];

  return (
    <div>
      <h1 className="font-display text-3xl">Prenotazioni</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        <FiltroLink stato={undefined} attivo={!stato}>
          Tutte
        </FiltroLink>
        {Object.entries(STATO_LABEL).map(([valore, label]) => (
          <FiltroLink key={valore} stato={valore} attivo={stato === valore}>
            {label}
          </FiltroLink>
        ))}
      </div>

      {error && <p className="mt-6 text-accent-dark">{error.message}</p>}

      <div className="mt-6 flex flex-col gap-3">
        {prenotazioni.map((p) => (
          <Link
            key={p.id}
            href={`/admin/prenotazioni/${p.id}`}
            className="flex flex-wrap items-center gap-4 rounded-card bg-surface p-5 hover:bg-surface-hover"
          >
            <span className={`rounded-pill px-3 py-1 text-xs font-bold ${STATO_STILE[p.stato]}`}>
              {STATO_LABEL[p.stato] ?? p.stato}
            </span>
            <div className="min-w-[220px] flex-1">
              <p className="font-semibold">
                {p.numero_prenotazione} — {p.escursioni?.titolo ?? "Escursione eliminata"}
              </p>
              <p className="text-sm text-ink-muted">
                {p.escursioni?.data_ora ? `${dataBreveFmt(p.escursioni.data_ora)} · ${oraFmt(p.escursioni.data_ora)} · ` : ""}
                {p.numero_partecipanti} partecipanti · {p.telefono ?? "—"} · {p.email ?? "—"}
              </p>
            </div>
            <span className="font-display text-xl">{prezzoFmt(p.importo_totale)}</span>
          </Link>
        ))}
        {prenotazioni.length === 0 && (
          <p className="rounded-card bg-surface p-8 text-center text-ink-soft">
            Nessuna prenotazione trovata.
          </p>
        )}
      </div>
    </div>
  );
}

function FiltroLink({
  stato,
  attivo,
  children,
}: {
  stato: string | undefined;
  attivo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={stato ? `/admin/prenotazioni?stato=${stato}` : "/admin/prenotazioni"}
      className={`rounded-pill px-4 py-2 text-sm font-semibold ${attivo ? "bg-ink text-page" : "bg-surface text-ink-soft hover:bg-surface-hover"}`}
    >
      {children}
    </Link>
  );
}
