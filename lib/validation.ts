import { z } from "zod";

/** Formato standard del codice fiscale italiano (16 caratteri alfanumerici). */
export const CODICE_FISCALE_REGEX =
  /^[A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z][0-9LMNPQRSTUV]{2}[A-Za-z][0-9LMNPQRSTUV]{3}[A-Za-z]$/;

const partecipanteBase = z.object({
  nome: z.string().trim().min(1, "Il nome è obbligatorio."),
  cognome: z.string().trim().min(1, "Il cognome è obbligatorio."),
  codice_fiscale: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .or(z.literal("")),
  telefono: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Email non valida.").optional().or(z.literal("")),
});

export const prenotazioneSchema = z
  .object({
    id_escursione: z.string().uuid(),
    partecipanti: z.array(partecipanteBase).min(1).max(20),
    note: z.string().trim().max(2000).optional().or(z.literal("")),
    consenso_privacy: z.literal(true, {
      error: "È necessario accettare l'informativa privacy.",
    }),
  })
  .superRefine((val, ctx) => {
    const primo = val.partecipanti[0];
    if (!primo?.telefono) {
      ctx.addIssue({
        code: "custom",
        path: ["partecipanti", 0, "telefono"],
        message: "Il telefono del referente è obbligatorio.",
      });
    }
    if (!primo?.email) {
      ctx.addIssue({
        code: "custom",
        path: ["partecipanti", 0, "email"],
        message: "L'email del referente è obbligatoria.",
      });
    }
  });

export type PrenotazioneFormValues = z.infer<typeof prenotazioneSchema>;

export const richiestaPreventivoSchema = z.object({
  nome: z.string().trim().min(1, "Il nome è obbligatorio."),
  email: z.string().trim().email("Email non valida."),
  telefono: z.string().trim().optional().or(z.literal("")),
  persone: z.coerce.number().int().min(1).max(200).optional(),
  uscita_di_interesse: z.string().trim().optional().or(z.literal("")),
  messaggio: z.string().trim().max(3000).optional().or(z.literal("")),
  consenso_privacy: z.literal(true, {
    error: "È necessario accettare l'informativa privacy.",
  }),
});

export type RichiestaPreventivoValues = z.infer<typeof richiestaPreventivoSchema>;

/** Verifica il formato del codice fiscale se richiesto dall'escursione. */
export function validaCodiceFiscaleSeRichiesto(
  richiesto: boolean,
  valore: string | undefined,
): string | null {
  if (!richiesto) return null;
  if (!valore || !valore.trim()) return "Il codice fiscale è obbligatorio per questa uscita.";
  if (!CODICE_FISCALE_REGEX.test(valore.trim())) {
    return "Il formato del codice fiscale non è valido.";
  }
  return null;
}
