"use client";

import type { OrdinePagina } from "@/lib/data";

const inputClass =
  "rounded-pill border-[1.5px] border-border bg-surface-soft px-4.5 py-2.5 text-sm font-semibold text-ink";

export function FiltersBar({
  zone,
  zona,
  difficolta,
  ordine,
  onChange,
}: {
  zone: string[];
  zona: string;
  difficolta: string;
  ordine: OrdinePagina;
  onChange: (valori: { zona: string; difficolta: string; ordine: OrdinePagina }) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={zona}
        onChange={(e) => onChange({ zona: e.target.value, difficolta, ordine })}
        className={inputClass}
        aria-label="Filtra per zona"
      >
        <option value="">Tutte le zone</option>
        {zone.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </select>

      <select
        value={difficolta}
        onChange={(e) => onChange({ zona, difficolta: e.target.value, ordine })}
        className={inputClass}
        aria-label="Filtra per difficoltà"
      >
        <option value="">Tutte le difficoltà</option>
        <option value="Facile">Facile</option>
        <option value="Medio">Medio</option>
        <option value="Difficile">Difficile</option>
      </select>

      <select
        value={ordine}
        onChange={(e) => onChange({ zona, difficolta, ordine: e.target.value as OrdinePagina })}
        className={inputClass}
        aria-label="Ordina per"
      >
        <option value="data">Ordina per data</option>
        <option value="zona">Ordina per zona</option>
        <option value="difficolta">Ordina per difficoltà</option>
      </select>
    </div>
  );
}
