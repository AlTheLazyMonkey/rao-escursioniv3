import { NextResponse } from "next/server";
import { richiestaPreventivoSchema } from "@/lib/validation";
import { inviaEmailRichiestaPreventivo } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Richiesta generica di preventivo (gruppi, scuole, aziende, uscite su
 * misura): non è legata a un'escursione con posti fissi, quindi non passa
 * dalla RPC di prenotazione. Viene solo inoltrata via email alla guida.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errore: "Corpo della richiesta non valido." }, { status: 400 });
  }

  const risultato = richiestaPreventivoSchema.safeParse(body);
  if (!risultato.success) {
    return NextResponse.json(
      {
        errore: "Dati non validi.",
        dettagli: risultato.error.issues.map((i) => ({
          campo: i.path.join("."),
          messaggio: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { nome, email, telefono, persone, uscita_di_interesse, messaggio } =
    risultato.data;

  const esito = await inviaEmailRichiestaPreventivo({
    nome,
    email,
    telefono,
    persone,
    usciteDiInteresse: uscita_di_interesse,
    messaggio,
  });

  return NextResponse.json({ inviata: esito.inviata });
}
