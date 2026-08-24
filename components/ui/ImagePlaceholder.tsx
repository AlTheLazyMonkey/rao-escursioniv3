/**
 * Segnaposto per una fotografia non ancora fornita dal cliente (vedi
 * README del design: "Immagini: sono segnaposto, vanno sostituite con le
 * foto reali del cliente"). Componente idiomatico, non dipende dal
 * runtime di prototipazione (<image-slot>) che il README chiede
 * esplicitamente di non portare in produzione.
 *
 * Da sostituire con <Image src="..."> quando le foto reali sono disponibili
 * (es. caricate su Supabase Storage e referenziate dal campo `foto`).
 */
export function ImagePlaceholder({
  label,
  shape = "rect",
  radius,
  className = "",
}: {
  label: string;
  shape?: "rect" | "circle" | "pill";
  radius?: number;
  className?: string;
}) {
  const shapeClass =
    shape === "circle" ? "rounded-full" : shape === "pill" ? "rounded-pill" : "";
  const style = shape === "rect" && radius !== undefined ? { borderRadius: radius } : undefined;

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden border border-dashed border-ink/25 bg-[linear-gradient(135deg,#ebddc5_0%,#dfd0b4_100%)] ${shapeClass || "rounded-card"} ${className}`}
      style={style}
    >
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/35">
          <path d="M4 18l5-7 4 5 3-4 4 6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="17" cy="7" r="2" />
          <rect x="2.5" y="3.5" width="19" height="17" rx="3" />
        </svg>
        <span className="text-xs font-medium leading-snug text-ink/45">{label}</span>
      </div>
    </div>
  );
}
