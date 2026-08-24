import Link from "next/link";
import { getProssimeEscursioni } from "@/lib/data";
import { ExcursionRow } from "@/components/escursioni/ExcursionRow";

export async function CalendarioSection() {
  const escursioni = await getProssimeEscursioni(6);

  return (
    <section id="uscite" className="px-5 pb-16 sm:px-8 lg:px-14 lg:pb-20 scroll-mt-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            Calendario
          </span>
          <h2 className="mt-2.5 font-display text-3xl sm:text-4xl lg:text-[46px]">
            Prossime uscite
          </h2>
        </div>
        <Link href="/escursioni" className="font-bold text-[17px] hover:text-accent-hover">
          Tutte le date →
        </Link>
      </div>

      {escursioni.length === 0 ? (
        <div className="rounded-card bg-surface p-10 text-center text-ink-soft">
          Nessuna uscita in programma al momento: torna a trovarci presto, oppure
          scrivici per un&rsquo;uscita su misura.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {escursioni.map((e) => (
            <ExcursionRow key={e.id} escursione={e} />
          ))}
        </div>
      )}
    </section>
  );
}
