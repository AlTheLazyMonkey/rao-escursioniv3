"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { embedMappaValido } from "@/lib/embed";
import type { Difficolta, StatoEscursione, StatoPrenotazione } from "@/lib/types";

export interface StatoForm {
  errore?: string;
}

function leggiEscursioneDaForm(formData: FormData) {
  const data = String(formData.get("data") || "");
  const ora = String(formData.get("ora") || "09:00");
  const dataOra = data ? new Date(`${data}T${ora}:00`) : null;

  const embedMappa = String(formData.get("embed_mappa") || "").trim();
  if (embedMappa && !embedMappaValido(embedMappa)) {
    throw new Error(
      "L'embed della mappa è ammesso solo da Komoot o Mapy (komoot.com, mapy.cz, mapy.com).",
    );
  }

  return {
    titolo: String(formData.get("titolo") || "").trim(),
    descrizione: String(formData.get("descrizione") || "").trim(),
    descrizione_breve: String(formData.get("descrizione_breve") || "").trim() || null,
    richiede_codice_fiscale: formData.get("richiede_codice_fiscale") === "on",
    zona: String(formData.get("zona") || "").trim(),
    punto_di_ritrovo: String(formData.get("punto_di_ritrovo") || "").trim(),
    dislivello: String(formData.get("dislivello") || "").trim() || null,
    lunghezza_percorso: String(formData.get("lunghezza_percorso") || "").trim() || null,
    durata: String(formData.get("durata") || "").trim() || null,
    difficolta: String(formData.get("difficolta") || "Facile") as Difficolta,
    data_ora: dataOra ? dataOra.toISOString() : null,
    prezzo: Number(formData.get("prezzo") || 0),
    posti_totali: Number(formData.get("posti_totali") || 1),
    embed_mappa: embedMappa || null,
    stato: String(formData.get("stato") || "bozza") as StatoEscursione,
    foto: String(formData.get("foto") || "").trim() || null,
  };
}

export async function creaEscursione(_prev: StatoForm, formData: FormData): Promise<StatoForm> {
  let valori;
  try {
    valori = leggiEscursioneDaForm(formData);
  } catch (err) {
    return { errore: err instanceof Error ? err.message : "Dati non validi." };
  }
  if (!valori.titolo || !valori.descrizione || !valori.zona || !valori.punto_di_ritrovo) {
    return { errore: "Titolo, descrizione, zona e punto di ritrovo sono obbligatori." };
  }
  if (!valori.data_ora) {
    return { errore: "Data e ora dell'escursione sono obbligatorie." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("escursioni").insert(valori);
  if (error) {
    return { errore: error.message };
  }

  revalidatePath("/admin/escursioni");
  revalidatePath("/");
  revalidatePath("/escursioni");
  redirect("/admin/escursioni");
}

export async function aggiornaEscursione(
  id: string,
  _prev: StatoForm,
  formData: FormData,
): Promise<StatoForm> {
  let valori;
  try {
    valori = leggiEscursioneDaForm(formData);
  } catch (err) {
    return { errore: err instanceof Error ? err.message : "Dati non validi." };
  }
  if (!valori.titolo || !valori.descrizione || !valori.zona || !valori.punto_di_ritrovo) {
    return { errore: "Titolo, descrizione, zona e punto di ritrovo sono obbligatori." };
  }
  if (!valori.data_ora) {
    return { errore: "Data e ora dell'escursione sono obbligatorie." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("escursioni").update(valori).eq("id", id);
  if (error) {
    return { errore: error.message };
  }

  revalidatePath("/admin/escursioni");
  revalidatePath("/");
  revalidatePath("/escursioni");
  redirect("/admin/escursioni");
}

export async function eliminaEscursione(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("escursioni").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/escursioni");
  revalidatePath("/");
  revalidatePath("/escursioni");
  redirect("/admin/escursioni");
}

export async function annullaEscursione(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("escursioni")
    .update({ stato: "annullata" satisfies StatoEscursione })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/escursioni");
  revalidatePath("/");
  revalidatePath("/escursioni");
}

export async function aggiornaPrenotazione(
  id: string,
  _prev: StatoForm,
  formData: FormData,
): Promise<StatoForm> {
  const supabase = await createSupabaseServerClient();
  const stato = String(formData.get("stato") || "confermata") as StatoPrenotazione;
  const importo_totale = Number(formData.get("importo_totale") || 0);
  const note = String(formData.get("note") || "").trim() || null;

  const { error } = await supabase
    .from("prenotazioni")
    .update({ stato, importo_totale, note })
    .eq("id", id);

  if (error) return { errore: error.message };

  revalidatePath("/admin/prenotazioni");
  revalidatePath(`/admin/prenotazioni/${id}`);
  return {};
}

export async function annullaPrenotazione(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("prenotazioni")
    .update({ stato: "annullata" satisfies StatoPrenotazione })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/prenotazioni");
  revalidatePath(`/admin/prenotazioni/${id}`);
}
