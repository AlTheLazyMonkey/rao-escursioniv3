import type { Metadata } from "next";
import { getEscursioniPagina, getZoneDisponibili } from "@/lib/data";
import { ExcursionListClient } from "@/components/escursioni/ExcursionListClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tutte le escursioni",
  description:
    "Tutte le prossime escursioni guidate nelle Dolomiti Friulane: filtra per zona e difficoltà e prenota il tuo posto.",
};

const PAGINA = 9;

export default async function EscursioniPage() {
  const [{ items, hasMore }, zone] = await Promise.all([
    getEscursioniPagina({ offset: 0, limit: PAGINA }),
    getZoneDisponibili(),
  ]);

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-14 lg:py-16">
      <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-ink-faint">
        Calendario completo
      </span>
      <h1 className="mt-2.5 font-display text-3xl sm:text-4xl lg:text-[46px]">
        Tutte le escursioni
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">
        Le uscite già svolte non compaiono più qui. Se cerchi un&rsquo;uscita privata o su
        misura, scrivici dalla home.
      </p>

      <div className="mt-9">
        <ExcursionListClient escursioniIniziali={items} hasMoreIniziale={hasMore} zone={zone} />
      </div>
    </div>
  );
}
