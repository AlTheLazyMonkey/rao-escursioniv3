import { BookingModalHost } from "@/components/escursioni/BookingModalHost";
import { VariantSwitcher } from "@/components/ui/VariantSwitcher";

// Layout dedicato alla variante 1b "Cresta": niente Header/Footer condivisi
// con 1a (qui sono parte della composizione della pagina stessa, perché
// l'header è sovrapposto trasparente all'hero e il footer ha una palette
// scura propria).
export default function SiteLayoutB({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <BookingModalHost />
      <VariantSwitcher attuale="1b" />
    </>
  );
}
