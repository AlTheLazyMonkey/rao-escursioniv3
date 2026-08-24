const dataBreve = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "short",
});

const dataEstesa = new Intl.DateTimeFormat("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const ora = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
});

const valuta = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

/** "14" */
export function giornoNumero(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit" });
}

/** "set" */
export function meseBreve(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("it-IT", { month: "short" })
    .replace(".", "");
}

/** "14 set" */
export function dataBreveFmt(iso: string): string {
  return dataBreve.format(new Date(iso)).replace(".", "");
}

/** "domenica 14 settembre 2026" */
export function dataEstesaFmt(iso: string): string {
  return dataEstesa.format(new Date(iso));
}

/** "09:00" */
export function oraFmt(iso: string): string {
  return ora.format(new Date(iso));
}

export function prezzoFmt(valore: number): string {
  if (valore === 0) return "Gratuito";
  return valuta.format(valore);
}

export function troncaTesto(testo: string, lunghezza = 140): string {
  const pulito = testo.trim();
  if (pulito.length <= lunghezza) return pulito;
  return pulito.slice(0, lunghezza).replace(/\s+\S*$/, "") + "…";
}
