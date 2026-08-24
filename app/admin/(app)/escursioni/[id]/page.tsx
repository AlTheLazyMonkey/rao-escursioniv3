import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EscursioneForm } from "@/components/admin/EscursioneForm";
import { aggiornaEscursione } from "@/lib/admin/actions";
import type { Escursione } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ModificaEscursionePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("escursioni").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  const escursione = data as Escursione;
  const azione = aggiornaEscursione.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl">Modifica escursione</h1>
      <div className="mt-7 max-w-2xl rounded-card bg-page p-2">
        <EscursioneForm azione={azione} escursione={escursione} />
      </div>
    </div>
  );
}
