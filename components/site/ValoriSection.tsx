const VALORI = [
  {
    numero: "01",
    titolo: "Sicurezza",
    testo:
      "Percorsi verificati, meteo letto ogni giorno e una guida abilitata sempre al tuo fianco.",
  },
  {
    numero: "02",
    titolo: "Passione",
    testo:
      "Non solo ore di svago: storie, fauna, geologia e il perché di ogni valle che attraversiamo.",
  },
  {
    numero: "03",
    titolo: "Emozione",
    testo:
      "Il capriolo che attraversa, la nebbia che si apre. Camminiamo lenti perché succeda.",
  },
];

export function ValoriSection() {
  return (
    <section className="grid gap-5 px-5 pb-14 sm:px-8 sm:grid-cols-3 lg:px-14 lg:pb-18">
      {VALORI.map((v) => (
        <div key={v.numero} className="rounded-card bg-surface p-7">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-page font-display text-xl text-accent-dark">
            {v.numero}
          </span>
          <h3 className="mt-5 font-display text-2xl">{v.titolo}</h3>
          <p className="mt-2.5 text-base leading-relaxed text-ink-soft">{v.testo}</p>
        </div>
      ))}
    </section>
  );
}
