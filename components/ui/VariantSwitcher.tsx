import Link from "next/link";

/**
 * Comodo solo per il confronto tra le due varianti di design (1a/1b)
 * durante la revisione col cliente — README del design: "vanno implementate
 * come alternative, non entrambe". Da rimuovere una volta scelta la
 * variante definitiva.
 */
export function VariantSwitcher({ attuale }: { attuale: "1a" | "1b" }) {
  const altra = attuale === "1a" ? { href: "/b", label: "1b Cresta" } : { href: "/", label: "1a Sentiero" };
  return (
    <Link
      href={altra.href}
      className="fixed bottom-5 right-5 z-50 rounded-pill bg-ink px-4.5 py-2.5 text-sm font-bold text-page shadow-lifted hover:bg-ink-soft"
    >
      Vedi variante {altra.label} →
    </Link>
  );
}
