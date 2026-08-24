const PASSI = [
  {
    numero: "1",
    titolo: "Scegli l'uscita",
    testo: "Guarda il calendario, controlla difficoltà e posti liberi: trovi tutto qui sopra.",
  },
  {
    numero: "2",
    titolo: "Prenota in due minuti",
    testo: "Compili i dati dei partecipanti, ricevi conferma via email: nessun account da creare.",
  },
  {
    numero: "3",
    titolo: "Ci vediamo sul sentiero",
    testo: "Ti scrivo i dettagli pratici — meteo, equipaggiamento, punto di ritrovo — prima della partenza.",
  },
];

export function ComeSiParteSection() {
  return (
    <section className="bg-forest px-5 py-14 sm:px-8 lg:px-14 lg:py-16">
      <h2 className="max-w-[560px] font-display text-3xl leading-tight text-mint-surface sm:text-4xl lg:text-[44px]">
        Come si parte
      </h2>
      <div className="mt-9 grid gap-8 sm:grid-cols-3">
        {PASSI.map((p) => (
          <div key={p.numero}>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-dark font-display text-2xl text-mint-surface">
              {p.numero}
            </span>
            <h3 className="mt-5 font-display text-2xl text-mint-surface sm:text-[26px]">{p.titolo}</h3>
            <p className="mt-2.5 text-base leading-relaxed text-mint-on-dark">{p.testo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
