import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

const CREDENZIALI = [
  "Guida ambientale escursionistica",
  "Guida del Parco Dolomiti Friulane",
  "AIGAE FR122",
];

/**
 * Bio della variante 1b: split a due colonne su fondo `surface`, foto
 * verticale a piena altezza (non ritratto circolare come in 1a).
 */
export function BioSectionB() {
  return (
    <section
      id="mi-presento"
      className="grid gap-0 bg-surface sm:grid-cols-1 lg:grid-cols-[.85fr_1.15fr] lg:items-stretch scroll-mt-20"
    >
      <div className="h-[280px] sm:h-[380px] lg:h-auto lg:min-h-[520px]">
        <ImagePlaceholder label="ritratto della guida sul sentiero, formato verticale" radius={0} />
      </div>
      <div className="px-5 py-12 sm:px-8 sm:py-14 lg:px-14 lg:py-16">
        <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-ink-faint">
          Mi presento
        </span>
        <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl lg:text-[46px]">
          Andrea Favret,
          <br />
          guida del Parco
        </h2>
        <p className="text-pretty mt-5 max-w-[560px] text-lg leading-relaxed text-ink-soft">
          Cammino queste montagne da quando ero ragazzo e da guida le racconto
          ogni settimana: le Dolomiti Friulane, la Val Colvera, i boschi sopra
          Budoia. Il mio lavoro è portarti dove non arriveresti da solo e
          riportarti indietro sereno.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {CREDENZIALI.map((c) => (
            <span
              key={c}
              className="rounded-pill border-[1.5px] border-ink/[.18] px-4.5 py-2.5 text-[15px] font-semibold"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
