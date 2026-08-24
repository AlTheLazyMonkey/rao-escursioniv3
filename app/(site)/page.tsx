import { Hero } from "@/components/site/Hero";
import { ValoriSection } from "@/components/site/ValoriSection";
import { CalendarioSection } from "@/components/site/CalendarioSection";
import { BioSection } from "@/components/site/BioSection";
import { GruppiSection } from "@/components/site/GruppiSection";
import { RichiestaFormSection } from "@/components/site/RichiestaFormSection";

// Le uscite vengono lette da Supabase ad ogni richiesta: mai in cache
// statica, perché posti liberi e calendario cambiano di continuo.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValoriSection />
      <CalendarioSection />
      <BioSection />
      <GruppiSection />
      <RichiestaFormSection />
    </>
  );
}
