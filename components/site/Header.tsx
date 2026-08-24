"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PillLink } from "@/components/ui/Pill";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#mi-presento", label: "Mi presento" },
  { href: "/escursioni", label: "Uscite" },
  { href: "/#richiesta", label: "Contatti" },
];

export function Header() {
  const pathname = usePathname();
  const [aperto, setAperto] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-page border-b border-border-faint">
      <div className="flex items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-14 lg:py-[22px]">
        <Link href="/" className="flex items-center gap-3.5 shrink-0" onClick={() => setAperto(false)}>
          <Image
            src="/logo.svg"
            alt="RAO"
            width={52}
            height={52}
            className="h-10 w-10 lg:h-[52px] lg:w-[52px] object-contain"
            priority
          />
          <span className="flex flex-col leading-[1.15]">
            <span className="font-display text-lg lg:text-xl tracking-wide">RAO</span>
            <span className="text-[11px] lg:text-xs uppercase tracking-[0.14em] text-ink-faint">
              escursioni ed emozioni
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-base font-semibold">
          {NAV.map((item) => {
            const attivo = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("#")[0]) && item.href !== "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={attivo ? "text-ink" : "text-ink-muted hover:text-ink transition-colors"}
              >
                {item.label}
              </Link>
            );
          })}
          <PillLink href="/#uscite" size="sm">
            Prenota un&rsquo;uscita
          </PillLink>
        </nav>

        <button
          type="button"
          aria-label={aperto ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={aperto}
          onClick={() => setAperto((v) => !v)}
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-pill hover:bg-surface"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {aperto ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
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
          <PillLink href="/#uscite" className="mt-2 justify-center" onClick={() => setAperto(false)}>
            Prenota un&rsquo;uscita
          </PillLink>
        </nav>
      )}
    </header>
  );
}
