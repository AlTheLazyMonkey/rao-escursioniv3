import { NextResponse } from "next/server";
import { getEscursioniPagina, type OrdinePagina } from "@/lib/data";

export const dynamic = "force-dynamic";

const LIMITE_MASSIMO = 24;
const ORDINI_VALIDI: OrdinePagina[] = ["data", "zona", "difficolta"];

/**
 * Elenco paginato di escursioni pubblicate e future, usato dallo
 * scorrimento infinito della pagina /escursioni.
 * Query: offset, limit, zona, difficolta, ordine (data|zona|difficolta).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
  const limit = Math.min(
    LIMITE_MASSIMO,
    Math.max(1, Number(url.searchParams.get("limit")) || 9),
  );
  const zona = url.searchParams.get("zona") || undefined;
  const difficolta = url.searchParams.get("difficolta") || undefined;
  const ordineParam = url.searchParams.get("ordine") || "data";
  const ordine = (ORDINI_VALIDI as string[]).includes(ordineParam)
    ? (ordineParam as OrdinePagina)
    : "data";

  const risultato = await getEscursioniPagina({
    offset,
    limit,
    filtri: { zona, difficolta, ordine },
  });

  return NextResponse.json(risultato);
}
