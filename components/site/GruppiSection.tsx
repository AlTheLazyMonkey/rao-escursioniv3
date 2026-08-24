import { PillLink } from "@/components/ui/Pill";

const CATEGORIE = [
  {
    titolo: "Scuole",
    testo: "Mezze giornate di educazione ambientale, dalla primaria alle superiori.",
  },
  {
    titolo: "Aziende",
    testo: "Team building che finisce con una vista, non con una slide.",
  },
  {
    titolo: "Gruppi privati",
    testo: "Compleanni, addii, famiglie allargate: scelgo il percorso sulle vostre gambe.",
  },
];

export function GruppiSection() {
  return (
    <section className="bg-sage px-5 py-14 text-mint-surface sm:px-8 lg:px-14 lg:py-16">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-8">
        <h2 className="max-w-[640px] font-display text-3xl leading-tight sm:text-4xl lg:text-[44px]">
          Uscite su misura per gruppi, scuole e aziende
        </h2>
        <PillLink href="#richiesta" variant="light" className="whitespace-nowrap">
          Chiedi un preventivo
        </PillLink>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {CATEGORIE.map((c) => (
          <div key={c.titolo} className="border-t-2 border-mint-surface/35 pt-5">
            <h3 className="font-display text-xl">{c.titolo}</h3>
            <p className="mt-2 text-base leading-relaxed text-mint">{c.testo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
