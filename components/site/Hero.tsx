import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PillLink } from "@/components/ui/Pill";

export function Hero() {
  return (
    <section className="grid gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-14 lg:px-14 lg:py-20">
      <div>
        <span className="inline-block rounded-pill bg-mint px-4.5 py-2 text-sm font-bold tracking-wide text-sage">
          Guida ambientale escursionistica · AIGAE FR122
        </span>
        <h1 className="text-balance mt-5 font-display text-[42px] leading-[1.05] tracking-tight sm:text-6xl lg:text-[74px] lg:leading-[1.02]">
          Il Friuli si cammina,
          <br />
          non si guarda.
        </h1>
        <p className="text-pretty mt-6 max-w-[520px] text-lg leading-relaxed text-ink-soft lg:text-xl">
          Escursioni e trekking nelle Dolomiti Friulane, senza fretta e senza
          competizione. Cammini scelti a mano, raccontati passo per passo da
          una guida del Parco.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <PillLink href="#uscite">Le prossime uscite</PillLink>
          <PillLink href="#richiesta" variant="outline">
            Uscita su misura
          </PillLink>
        </div>
      </div>

      <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">
        <ImagePlaceholder
          label="foto di copertina — cresta all'alba, formato verticale"
          radius={28}
          className="saturate-90 contrast-95"
        />
        <div className="absolute -left-3 bottom-6 hidden h-[120px] w-[120px] flex-col items-center justify-center rounded-full bg-surface text-center shadow-raised md:flex md:-left-11 md:bottom-11 md:h-[150px] md:w-[150px]">
          <span className="font-display text-2xl text-accent-dark sm:text-[34px]">18</span>
          <span className="text-[11px] uppercase leading-tight tracking-[0.1em] text-ink-muted sm:text-xs">
            anni sui
            <br />
            sentieri
          </span>
        </div>
      </div>
    </section>
  );
}
