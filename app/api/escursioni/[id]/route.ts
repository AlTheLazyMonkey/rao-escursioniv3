import { NextResponse } from "next/server";
import { createSupabaseAnonClient } from "@/lib/supabase/anon";

export const dynamic = "force-dynamic";

/**
 * Dettaglio di una singola escursione pubblicata, con posti liberi
 * aggiornati in tempo reale. Usata dal modal di dettaglio/prenotazione,
 * che vuole sempre il dato più fresco possibile indipendentemente dalla
 * pagina da cui è stato aperto.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = createSupabaseAnonClient();

  const { data, error } = await supabase
    .from("escursioni_con_disponibilita")
    .select("*")
    .eq("id", id)
    .eq("stato", "pubblicata")
    .maybeSingle();

  if (error) {
    console.error("[api/escursioni/:id] errore:", error);
    return NextResponse.json({ errore: "Errore del server." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ errore: "Escursione non trovata." }, { status: 404 });
  }
  return NextResponse.json(data);
}
