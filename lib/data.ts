import { createSupabaseServerClient } from "./supabase/server";
import type { EscursioneConDisponibilita } from "./types";

export type OrdinePagina = "data" | "zona" | "difficolta";

export interface FiltriEscursioni {
  zona?: string;
  difficolta?: string;
  ordine?: OrdinePagina;
}

const COLONNE_ORDINE: Record<OrdinePagina, string> = {
  data: "data_ora",
  zona: "zona",
  difficolta: "difficolta",
};

/** Le prossime N escursioni pubblicate, più vicine per data/ora, mai passate. */
export async function getProssimeEscursioni(
  limit = 6,
): Promise<EscursioneConDisponibilita[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("escursioni_con_disponibilita")
    .select("*")
    .eq("stato", "pubblicata")
    .gt("data_ora", new Date().toISOString())
    .order("data_ora", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[data] getProssimeEscursioni:", error);
    return [];
  }
  return data ?? [];
}

/** Pagina di escursioni pubblicate e future, per l'elenco a scorrimento infinito. */
export async function getEscursioniPagina(params: {
  offset: number;
  limit: number;
  filtri?: FiltriEscursioni;
}): Promise<{ items: EscursioneConDisponibilita[]; hasMore: boolean }> {
  const { offset, limit, filtri } = params;
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("escursioni_con_disponibilita")
    .select("*")
    .eq("stato", "pubblicata")
    .gt("data_ora", new Date().toISOString());

  if (filtri?.zona) query = query.eq("zona", filtri.zona);
  if (filtri?.difficolta) query = query.eq("difficolta", filtri.difficolta);

  const colonna = COLONNE_ORDINE[filtri?.ordine ?? "data"];
  query = query
    .order(colonna, { ascending: true })
    .order("data_ora", { ascending: true })
    .range(offset, offset + limit); // +1 per capire se c'è altro

  const { data, error } = await query;
  if (error) {
    console.error("[data] getEscursioniPagina:", error);
    return { items: [], hasMore: false };
  }

  const hasMore = (data?.length ?? 0) > limit;
  return { items: (data ?? []).slice(0, limit), hasMore };
}

export async function getEscursioneById(
  id: string,
): Promise<EscursioneConDisponibilita | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("escursioni_con_disponibilita")
    .select("*")
    .eq("id", id)
    .eq("stato", "pubblicata")
    .maybeSingle();

  if (error) {
    console.error("[data] getEscursioneById:", error);
    return null;
  }
  return data;
}

/** Zone distinte tra le escursioni pubblicate, per il filtro dell'elenco. */
export async function getZoneDisponibili(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("escursioni_con_disponibilita")
    .select("zona")
    .eq("stato", "pubblicata")
    .gt("data_ora", new Date().toISOString());

  if (error) {
    console.error("[data] getZoneDisponibili:", error);
    return [];
  }
  const zone = new Set((data ?? []).map((r) => r.zona as string));
  return Array.from(zone).sort((a, b) => a.localeCompare(b, "it"));
}
