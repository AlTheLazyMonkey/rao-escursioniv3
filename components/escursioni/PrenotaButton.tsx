"use client";

import type { ButtonHTMLAttributes } from "react";
import { apriModalEscursione, type SchedaModal } from "./apriPrenotazione";

/** Bottone "Prenota" che apre il modal globale sulla scheda richiesta. */
export function PrenotaButton({
  idEscursione,
  scheda = "prenotazione",
  className = "",
  children = "Prenota",
  ...props
}: {
  idEscursione: string;
  scheda?: SchedaModal;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        apriModalEscursione(idEscursione, scheda);
      }}
      className={`inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-pill bg-ink px-6 py-3.5 font-bold text-page transition-colors duration-150 hover:bg-ink-soft ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
