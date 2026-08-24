import { HeroB } from "@/components/site-b/HeroB";
import { CredenzialiBar } from "@/components/site-b/CredenzialiBar";
import { ValoriSection } from "@/components/site/ValoriSection";
import { CalendarioSectionB } from "@/components/site-b/CalendarioSectionB";
import { ComeSiParteSection } from "@/components/site-b/ComeSiParteSection";
import { BioSectionB } from "@/components/site-b/BioSectionB";
import { GruppiSection } from "@/components/site/GruppiSection";
import { RichiestaFormSectionB } from "@/components/site-b/RichiestaFormSectionB";
import { FooterB } from "@/components/site-b/FooterB";

// Le uscite vengono lette da Supabase ad ogni richiesta, come nella home 1a.
export const dynamic = "force-dynamic";

export default function HomePageB() {
  return (
    <>
      <HeroB />
      <CredenzialiBar />
      <ValoriSection />
      <CalendarioSectionB />
      <ComeSiParteSection />
      <BioSectionB />
      <GruppiSection />
      <RichiestaFormSectionB />
      <FooterB />
    </>
  );
}
