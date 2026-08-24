const CELLE = [
  { valore: "AIGAE", sotto: "Guida abilitata FR122" },
  { valore: "Parco", sotto: "Guida ufficiale Dolomiti Friulane" },
  { valore: "Max 12", sotto: "Persone per uscita, mai di più" },
];

/**
 * Barra di credenziali sovrapposta al bordo inferiore dell'hero
 * (translateY(-52px) nel prototipo), esclusiva della variante 1b.
 */
export function CredenzialiBar() {
  return (
    <div className="relative z-10 px-5 pb-10 sm:px-8 lg:px-14 lg:pb-14">
      <div className="-mt-10 grid grid-cols-3 divide-x divide-border rounded-card bg-surface-soft shadow-lifted sm:-mt-12 lg:-mt-[52px]">
        {CELLE.map((c) => (
          <div key={c.valore} className="px-3 py-6 text-center sm:px-6 sm:py-8">
            <div className="font-display text-xl text-accent-dark sm:text-2xl lg:text-[34px]">{c.valore}</div>
            <p className="mt-1.5 text-[12px] leading-snug text-ink-muted sm:text-sm">{c.sotto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
