import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variante = "accent" | "outline" | "dark" | "light" | "outline-light";

const VARIANTI: Record<Variante, string> = {
  accent:
    "bg-accent text-on-accent hover:bg-accent-hover",
  outline:
    "border-2 border-ink text-ink hover:bg-surface",
  dark: "bg-ink text-page hover:bg-ink-soft",
  light: "bg-mint-surface text-sage-dark hover:bg-mint",
  "outline-light":
    "border-2 border-page/70 text-page hover:bg-page/15",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill font-bold transition-colors duration-150 whitespace-nowrap min-h-11";

export function PillLink({
  variant = "accent",
  size = "md",
  className = "",
  href,
  ...props
}: {
  variant?: Variante;
  size?: "sm" | "md";
} & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const padding = size === "sm" ? "px-6 py-3 text-[15px]" : "px-7 py-4 text-[17px]";
  return (
    <Link
      href={href}
      className={`${BASE} ${padding} ${VARIANTI[variant]} ${className}`}
      {...props}
    />
  );
}

export function PillButton({
  variant = "accent",
  size = "md",
  className = "",
  ...props
}: {
  variant?: Variante;
  size?: "sm" | "md";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const padding = size === "sm" ? "px-6 py-3 text-[15px]" : "px-7 py-4 text-[17px]";
  return (
    <button
      className={`${BASE} ${padding} ${VARIANTI[variant]} cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
