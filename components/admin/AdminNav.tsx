"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const LINK = "rounded-pill px-4 py-2 text-sm font-semibold";

export function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();

  async function esci() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    // Navigazione piena (non router.push): forza un giro dal server che
    // rilegge la sessione ora assente e fa scattare il redirect del layout
    // admin. Scelta deliberata, non un refuso: router.push/useRouter() qui
    // causava un bailout a client-side-rendering in build di produzione.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/admin/login";
  }

  const voci = [
    { href: "/admin", label: "Panoramica" },
    { href: "/admin/escursioni", label: "Escursioni" },
    { href: "/admin/prenotazioni", label: "Prenotazioni" },
  ];

  return (
    <header className="border-b border-border-faint bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg">RAO · admin</span>
        </div>
        <nav className="flex flex-wrap items-center gap-1.5">
          {voci.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className={`${LINK} ${pathname === v.href ? "bg-ink text-page" : "text-ink-soft hover:bg-surface-hover"}`}
            >
              {v.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm text-ink-muted">
          {email && <span className="hidden sm:inline">{email}</span>}
          <button type="button" onClick={esci} className="font-bold text-accent-dark">
            Esci
          </button>
        </div>
      </div>
    </header>
  );
}
