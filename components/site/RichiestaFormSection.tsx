import { getProssimeEscursioni } from "@/lib/data";
import { RichiestaForm } from "./RichiestaForm";

export async function RichiestaFormSection() {
  const escursioni = await getProssimeEscursioni(8);

  return (
    <section
      id="richiesta"
      className="grid gap-10 bg-page px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:gap-14 lg:px-14 lg:py-20 scroll-mt-20"
    >
      <div>
        <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-ink-faint">
          Prenota
        </span>
        <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl lg:text-[44px]">
          Dimmi dove vuoi andare
        </h2>
        <p className="mt-4.5 text-[17px] leading-relaxed text-ink-soft">
          Rispondo entro 24 ore con posti disponibili, punto di ritrovo e
          cosa mettere nello zaino. Per un&rsquo;uscita già in calendario puoi
          anche prenotare direttamente dalla{" "}
          <a href="#uscite" className="underline underline-offset-2 text-accent-dark">
            lista delle prossime uscite
          </a>
          .
        </p>
      </div>
      <RichiestaForm uscite={escursioni.map((e) => ({ id: e.id, titolo: e.titolo }))} />
    </section>
  );
}
