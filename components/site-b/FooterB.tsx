import Image from "next/image";
import Link from "next/link";

export function FooterB() {
  return (
    <footer className="bg-ink px-5 py-12 text-[#dcd3c4] sm:px-8 lg:px-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3.5">
            <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-page">
              <Image src="/logo.svg" alt="RAO" width={40} height={40} className="h-10 w-10 object-contain" />
            </span>
            <span className="font-display text-2xl text-page">RAO escursioni ed emozioni</span>
          </div>
          <p className="mt-3.5 max-w-md text-[15px] leading-relaxed">
            Andrea Favret · P.IVA 01941620930 · operante ai sensi della legge 4/2013,
            iscritto ad AIGAE con tessera FR122.
          </p>
          <Link href="/privacy" className="mt-4 inline-block text-accent-light underline underline-offset-2">
            Privacy &amp; policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
