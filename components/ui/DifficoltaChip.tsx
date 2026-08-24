import type { Difficolta } from "@/lib/types";

const STILI: Record<Difficolta, string> = {
  Facile: "bg-mint text-sage",
  Medio: "bg-medium text-medium-ink",
  Difficile: "bg-accent-soft text-accent-dark",
};

export function DifficoltaChip({
  difficolta,
  className = "",
}: {
  difficolta: Difficolta;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3.5 py-1.5 text-sm font-bold ${STILI[difficolta]} ${className}`}
    >
      {difficolta}
    </span>
  );
}
