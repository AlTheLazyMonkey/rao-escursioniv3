import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [{ count: totaleEscursioni }, { count: pubblicate }, { count: totalePrenotazioni }, { count: daConfermare }] =
    await Promise.all([
      supabase.from("escursioni").select("id", { count: "exact", head: true }),
      supabase.from("escursioni").select("id", { count: "exact", head: true }).eq("stato", "pubblicata"),
      supabase.from("prenotazioni").select("id", { count: "exact", head: true }),
      supabase.from("prenotazioni").select("id", { count: "exact", head: true }).eq("stato", "in_attesa"),
    ]);

  const CARD = [
    { label: "Escursioni pubblicate", valore: pubblicate ?? 0, href: "/admin/escursioni" },
    { label: "Escursioni totali (bozze incluse)", valore: totaleEscursioni ?? 0, href: "/admin/escursioni" },
    { label: "Prenotazioni totali", valore: totalePrenotazioni ?? 0, href: "/admin/prenotazioni" },
    { label: "Prenotazioni in attesa", valore: daConfermare ?? 0, href: "/admin/prenotazioni" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Panoramica</h1>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARD.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-card bg-surface p-6 transition-colors hover:bg-surface-hover"
          >
            <span className="font-display text-3xl">{c.valore}</span>
            <p className="mt-1.5 text-sm text-ink-soft">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/admin/escursioni/nuova" className="rounded-pill bg-accent px-6 py-3 font-bold text-on-accent hover:bg-accent-hover">
          + Nuova escursione
        </Link>
        <Link href="/admin/prenotazioni" className="rounded-pill border-2 border-ink px-6 py-3 font-bold hover:bg-surface">
          Gestisci prenotazioni
        </Link>
      </div>
    </div>
  );
}
