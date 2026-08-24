# RAO — escursioni ed emozioni

Sito per la gestione e prenotazione delle escursioni guidate di Andrea Favret
(RAO escursioni ed emozioni). Next.js (App Router) + Supabase, design
"organico" — variante **1a Sentiero**.

## Stack

- **Frontend**: Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS 4.
- **Backend**: Supabase (Postgres + Auth + Row Level Security). Nessun
  backend separato: le pagine pubbliche leggono da Supabase, l'area admin
  scrive tramite Server Action autenticate.
- **Email**: [Resend](https://resend.com) per la conferma di prenotazione e
  le richieste di preventivo (facoltativo in sviluppo).

## Configurazione — passo per passo

### 1. Crea il progetto Supabase

1. Crea un progetto su [supabase.com](https://supabase.com) (piano gratuito
   sufficiente per partire).
2. Apri **SQL Editor** e incolla il contenuto di
   `supabase/migrations/0001_init.sql`, poi eseguilo. Crea tabelle, viste,
   funzioni e le policy di Row Level Security.
3. Facoltativo: esegui anche `supabase/seed.sql` per popolare il sito con
   alcune escursioni di esempio (utile per vedere subito il sito
   funzionante).
4. In **Authentication → Users**, crea manualmente l'utente admin (email +
   password) che userai per accedere a `/admin`. Non esiste registrazione
   pubblica: è una scelta voluta.

> Se preferisci lavorare da riga di comando, la [CLI di Supabase](https://supabase.com/docs/guides/cli)
> permette anche `supabase db push` sulle migration in questa cartella,
> oppure `supabase start` per un'istanza locale via Docker.

### 2. Variabili d'ambiente

```bash
cp .env.example .env.local
```

Compila `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (in
Project Settings → API del progetto Supabase). Le variabili `RESEND_*` sono
facoltative in sviluppo: senza email configurate, le prenotazioni vengono
comunque salvate correttamente, solo l'invio dell'email di conferma viene
saltato (con un avviso nei log del server).

### 3. Avvio

```bash
npm install
npm run dev
```

Sito pubblico su `http://localhost:3000`, area admin su
`http://localhost:3000/admin` (login con l'utente creato al punto 1).

## Cosa manca prima di andare online

Questo è un progetto **funzionante**, non solo una demo: prenotazioni,
disponibilità posti, area admin e RLS sono reali. Restano però alcune cose
esplicitamente segnalate come da completare col cliente prima del lancio
(vedi anche il README del design):

- **Foto reali**: le immagini sono segnaposto (`ImagePlaceholder`) in
  attesa delle fotografie del cliente. Il campo `foto` delle escursioni
  accetta già un URL (es. Supabase Storage) — quando le foto sono pronte,
  basta caricarle e incollare l'URL nel form admin; per mostrarle davvero
  in home/scheda/card sostituire `ImagePlaceholder` con `next/image`
  puntato a `escursione.foto`.
- **Logo reale**: `public/logo.svg` è un segnaposto, va sostituito col
  logo del cliente.
- **Contenuti**: titoli, prezzi, date e testi nel seed sono plausibili ma
  di esempio — non pubblicare senza validarli col cliente.
- **Informativa privacy** (`/privacy`): è una bozza di partenza, da far
  rivedere a un consulente legale/privacy prima della pubblicazione.
- **Pagamenti**: volutamente non implementati in questa prima versione (il
  campo `stato` di `prenotazioni` include già `pagata` per quando verranno
  aggiunti).
- **Punto di ritrovo**: nel form admin è un campo di testo libero, non un
  autocomplete Google Maps/OpenStreetMap come suggerito nella specifica —
  richiede una chiave API che non è stata fornita. Facile da aggiungere in
  seguito (es. `@vis.gl/react-google-maps` o Nominatim di OSM) senza
  toccare lo schema, che salva comunque un indirizzo testuale.
- **Navigazione**: "Blog" non è stato incluso nel menu perché non è nella
  specifica funzionale — la sezione "Mi presento" vive come ancora della
  home (`/#mi-presento`) invece di una pagina propria, in attesa che venga
  effettivamente scritta.

## Struttura del progetto

```
app/
  (site)/                 pagine pubbliche variante 1a (home single-page, /escursioni, /privacy)
  b/                       home pubblica variante 1b "Cresta" (stesso contenuto, design alternativo)
  admin/(app)/             area admin protetta (dashboard, escursioni, prenotazioni)
  admin/login/             login (fuori dalla protezione, altrimenti loop di redirect)
  api/                     route pubbliche: dettaglio escursione, creazione prenotazione, richieste
components/
  site/                    sezioni della home 1a (Hero, Calendario, Bio, Form richiesta…)
  site-b/                  sezioni esclusive della home 1b (Hero pieno formato, calendario a card…)
  escursioni/              card, modal dettaglio/prenotazione, form di prenotazione (condivisi tra 1a e 1b)
  admin/                   form e componenti dell'area amministrazione
  ui/                      primitive di design (Pill, DifficoltaChip, ImagePlaceholder, VariantSwitcher)
lib/
  supabase/                client Supabase (browser, server con cookie, anon per le API)
  admin/actions.ts         Server Action per la gestione admin (CRUD escursioni/prenotazioni)
  data.ts                  query pubbliche (prossime uscite, elenco paginato, dettaglio)
  validation.ts            schema Zod per i form pubblici
  email.ts                 invio email via Resend
supabase/
  migrations/0001_init.sql schema, RLS, funzione di prenotazione atomica
  seed.sql                 dati di esempio
```

## Due varianti di design (1a e 1b)

Il sito ha **due home page pubbliche** allo stesso indirizzo Supabase — stesse
uscite, stesso modal di prenotazione, stessa pagina `/escursioni` — ma con
un design diverso, secondo le due direzioni del bundle di design:

- **`/` — 1a "Sentiero"**: chiara, editoriale, calendario a righe. È la home
  predefinita.
- **`/b` — 1b "Cresta"**: scura e fotografica, hero a pieno formato, header
  trasparente sopra la foto, calendario a card, sezione "Come si parte".

Ogni pagina ha, in basso a destra, un pulsante "Vedi variante 1a/1b →" per
passare velocemente dall'una all'altra e confrontarle. **Questo è un
comodo temporaneo per la fase di scelta**: una volta deciso quale tenere,
vanno rimossi `<VariantSwitcher />` dal layout scelto, la cartella e le
route dell'altra variante (`app/b/`, `app/(site)/layout.tsx` se si tiene la
1b, `components/site-b/`), e va rinominata la route superstite su `/`.

## Come funziona la prenotazione (in breve)

Il pulsante "Prenota", ovunque compaia nel sito, apre un modal globale
(`BookingModalHost`) che carica sempre il dettaglio aggiornato
dell'escursione (posti liberi inclusi) e mostra la scheda di prenotazione
vera e propria. L'invio chiama `POST /api/prenotazioni`, che a sua volta
invoca la funzione Postgres `crea_prenotazione`: blocca la riga
dell'escursione, verifica i posti disponibili e crea prenotazione +
partecipanti **nella stessa transazione**, così due persone non possono mai
prenotare contemporaneamente l'ultimo posto libero. I dati sensibili
(codice fiscale) non sono mai leggibili dal pubblico: la RLS li protegge,
la funzione di prenotazione bypassa la RLS solo per scrivere in modo
sicuro.
