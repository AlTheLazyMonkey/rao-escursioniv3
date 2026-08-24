"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PillLink } from "@/components/ui/Pill";

const NAV = [
  { href: "/b", label: "Home" },
  { href: "/b#mi-presento", label: "Mi presento" },
  { href: "/escursioni", label: "Uscite" },
  { href: "/b#richiesta", label: "Contatti" },
];

/**
 * Header della variante 1b "Cresta": trasparente sopra la foto dell'hero,
 * diventa una barra piena (stile 1a) non appena si scorre oltre l'hero —
 * comportamento non prototipato nel design originale (statico, una sola
 * schermata), ma necessario perché la navigazione resti leggibile e
 * utilizzabile lungo tutta la pagina.
 */
export function HeaderB() {
  const [scorso, setScorso] = useState(false);
  const [aperto, setAperto] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScorso(window.scrollY > 64);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scuro = scorso; // testo/bordi scuri quando la barra è piena

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        scorso ? "bg-page border-b border-border-faint" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-14 lg:py-[22px]">
        <Link href="/b" className="flex items-center gap-3.5 shrink-0" onClick={() => setAperto(false)}>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full lg:h-[52px] lg:w-[52px] ${
              scuro ? "bg-transparent" : "bg-[rgba(245,234,216,.92)]"
            }`}
          >
            <Image
              src="/logo.svg"
              alt="RAO"
              width={52}
              height={52}
              className="h-8 w-8 lg:h-10 lg:w-10 object-contain"
              priority
            />
          </span>
          <span className="flex flex-col leading-[1.15]">
            <span className={`font-display text-lg lg:text-xl tracking-wide ${scuro ? "text-ink" : "text-page"}`}>
              RAO
            </span>
            <span
              className={`text-[11px] lg:text-xs uppercase tracking-[0.14em] ${
                scuro ? "text-ink-faint" : "text-page/78"
              }`}
            >
              escursioni ed emozioni
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-base font-semibold">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                scuro
                  ? "text-ink-muted hover:text-ink transition-colors"
                  : "text-page/78 hover:text-page transition-colors"
              }
            >
              {item.label}
            </Link>
          ))}
          <PillLink href="/b#uscite" size="sm">
            Prenota un&rsquo;uscita
          </PillLink>
        </nav>

        <button
          type="button"
          aria-label={aperto ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={aperto}
          onClick={() => setAperto((v) => !v)}
          className={`lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-pill ${
            scuro ? "hover:bg-surface text-ink" : "hover:bg-page/15 text-page"
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {aperto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {aperto && (
        <nav className="lg:hidden flex flex-col gap-1 px-5 pb-5 text-base font-semibold border-t border-border-faint bg-page">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAperto(false)}
              className="rounded-xl px-3 py-3 text-ink-soft hover:bg-surface hover:text-ink min-h-11 flex items-center"
            >
              {item.label}
            </Link>
          ))}
          <PillLink href="/b#uscite" className="mt-2 justify-center" onClick={() => setAperto(false)}>
            Prenota un&rsquo;uscita
          </PillLink>
        </nav>
      )}
    </header>
  );
}
