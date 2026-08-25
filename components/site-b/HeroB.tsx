import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PillLink } from "@/components/ui/Pill";
import { HeaderB } from "./HeaderB";
import Image from "next/image";

export function HeroB() {
  return (
    <section className="relative overflow-hidden">
      <HeaderB />

      <div className="absolute inset-0">
        <ImagePlaceholder
          label="foto di copertina — cresta panoramica, formato orizzontale"
          radius={0}
          className="brightness-[.82] contrast-[1.02] saturate-[.85]"
        />
         <Image
            src="https://images.unsplash.com/photo-1606909297337-be76ed45039e?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="RAO"
            width={1674}
            height={1116}
            className="absolute inset-0 h-full w-full rounded-[28px] object-cover"
            priority
          />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(39,46,27,.72) 0%, rgba(39,46,27,.12) 38%, rgba(39,46,27,.88) 100%)",
        }}
      />

      {/*
        Il contenuto resta nel flusso (non "position:absolute" sull'intera
        sezione) e riceve un padding-top che lo tiene sempre sotto l'header
        fisso: se su schermi stretti badge+titolo+testo+bottoni non entrano
        nell'altezza minima, la sezione (e la foto/overlay che la riempiono
        via inset-0) crescono di conseguenza invece di sovrapporsi
        all'header, cosa che con un'altezza fissa + contenuto "bottom-*"
        assoluto poteva succedere sui mobile più piccoli.
      */}
      <div className="relative flex min-h-[560px] flex-col justify-end px-5 pt-28 pb-16 sm:min-h-[640px] sm:px-8 sm:pb-20 lg:min-h-[760px] lg:px-14 lg:pb-24">
        <span className="inline-block rounded-pill bg-[rgba(240,250,225,.16)] px-4.5 py-2 text-sm font-bold tracking-wide text-mint-surface backdrop-blur-[6px] w-fit">
          Guida ambientale escursionistica · AIGAE FR122
        </span>
        <h1 className="text-balance mt-5 max-w-[820px] font-display text-[44px] leading-[1] tracking-[-0.01em] text-page sm:text-[64px] lg:text-[92px] lg:leading-[.98] lg:tracking-[-0.015em]">
          Emozioni, un passo alla volta.
        </h1>
        <p className="text-pretty mt-5 max-w-[560px] text-lg leading-relaxed text-page/85 lg:text-xl">
          Escursioni e trekking nelle Dolomiti Friulane, senza fretta e senza
          competizione. Cammini scelti a mano, raccontati passo per passo da
          una guida del Parco.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <PillLink href="#uscite">Le prossime uscite</PillLink>
          <PillLink href="#richiesta" variant="outline-light">
            Uscita su misura
          </PillLink>
        </div>
      </div>
    </section>
  );
}
