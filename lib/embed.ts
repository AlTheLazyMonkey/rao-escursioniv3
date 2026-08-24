/**
 * Domini fidati per l'embed della mappa del sentiero (Komoot / Mapy).
 * Vedi prompt-sito-escursioni.md — "Modal dettaglio escursione".
 */
const DOMINI_FIDATI = ["komoot.com", "mapy.cz", "mapy.com"];

function hostnameFidato(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return DOMINI_FIDATI.some((d) => host === d || host.endsWith(`.${d}`));
}

/**
 * Estrae, valida e restituisce l'URL src di un embed HTML (iframe) fornito
 * dall'admin, accettando solo domini fidati. Non usiamo mai
 * dangerouslySetInnerHTML sull'HTML salvato: ricostruiamo noi l'<iframe>
 * a partire dal solo src validato, per evitare qualunque rischio di
 * markup arbitrario nel DB.
 */
export function estraiSrcMappaSicuro(embedHtml: string | null | undefined): string | null {
  if (!embedHtml) return null;
  const match = embedHtml.match(/src\s*=\s*["']([^"']+)["']/i);
  if (!match) return null;
  try {
    const url = new URL(match[1]);
    if (url.protocol !== "https:") return null;
    if (!hostnameFidato(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Usata dal form admin per avvisare subito se il dominio non è fidato. */
export function embedMappaValido(embedHtml: string): boolean {
  if (!embedHtml.trim()) return true; // campo opzionale
  return estraiSrcMappaSicuro(embedHtml) !== null;
}
