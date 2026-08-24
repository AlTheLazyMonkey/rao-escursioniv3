-- =========================================================================
-- RAO escursioni — schema iniziale
-- Copre: escursioni, prenotazioni, partecipanti, calcolo posti liberi,
-- prenotazione atomica via RPC, Row Level Security.
-- =========================================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------------
-- Enum
-- ------------------------------------------------------------------------
do $$ begin
  create type difficolta_enum as enum ('Facile', 'Medio', 'Difficile');
exception when duplicate_object then null; end $$;

do $$ begin
  create type stato_escursione_enum as enum ('bozza', 'pubblicata', 'annullata', 'conclusa');
exception when duplicate_object then null; end $$;

do $$ begin
  create type stato_prenotazione_enum as enum ('in_attesa', 'confermata', 'pagata', 'annullata');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------------------
-- Tabella: escursioni
-- ------------------------------------------------------------------------
create table if not exists escursioni (
  id                       uuid primary key default gen_random_uuid(),
  foto                     text,
  titolo                   text not null,
  descrizione              text not null,
  descrizione_breve        text,
  richiede_codice_fiscale  boolean not null default false,
  zona                     text not null,
  punto_di_ritrovo         text not null,
  dislivello               text,
  lunghezza_percorso       text,
  durata                   text,
  difficolta               difficolta_enum not null,
  data_ora                 timestamptz not null,
  prezzo                   numeric(10, 2) not null default 0 check (prezzo >= 0),
  posti_totali             integer not null check (posti_totali > 0),
  embed_mappa              text,
  stato                    stato_escursione_enum not null default 'bozza',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists idx_escursioni_stato_data on escursioni (stato, data_ora);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_escursioni_updated_at on escursioni;
create trigger trg_escursioni_updated_at
  before update on escursioni
  for each row execute function set_updated_at();

-- ------------------------------------------------------------------------
-- Tabella: prenotazioni
-- ------------------------------------------------------------------------
create table if not exists prenotazioni (
  id                    uuid primary key default gen_random_uuid(),
  numero_prenotazione   text not null unique,
  id_escursione         uuid not null references escursioni (id) on delete restrict,
  numero_partecipanti   integer not null check (numero_partecipanti > 0),
  data_creazione        timestamptz not null default now(),
  stato                 stato_prenotazione_enum not null default 'confermata',
  importo_totale        numeric(10, 2) not null default 0,
  telefono              text,
  email                 text,
  note                  text
);

create index if not exists idx_prenotazioni_escursione on prenotazioni (id_escursione);
create index if not exists idx_prenotazioni_stato on prenotazioni (stato);

-- ------------------------------------------------------------------------
-- Tabella: partecipanti
-- ------------------------------------------------------------------------
create table if not exists partecipanti (
  id                uuid primary key default gen_random_uuid(),
  id_prenotazione   uuid not null references prenotazioni (id) on delete cascade,
  nome              text not null,
  cognome           text not null,
  codice_fiscale    text,
  telefono          text,
  email             text
);

create index if not exists idx_partecipanti_prenotazione on partecipanti (id_prenotazione);

-- ------------------------------------------------------------------------
-- Contatore numero_prenotazione: PRN-<anno>-<progressivo a 4 cifre>
-- ------------------------------------------------------------------------
create table if not exists prenotazione_contatori (
  anno    integer primary key,
  ultimo  integer not null default 0
);

create or replace function genera_numero_prenotazione()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_anno int := extract(year from now())::int;
  v_seq  int;
begin
  insert into prenotazione_contatori (anno, ultimo)
    values (v_anno, 1)
    on conflict (anno) do update set ultimo = prenotazione_contatori.ultimo + 1
    returning ultimo into v_seq;

  return 'PRN-' || v_anno || '-' || lpad(v_seq::text, 4, '0');
end;
$$;

-- ------------------------------------------------------------------------
-- Posti liberi: calcolati in tempo reale, mai salvati su colonna.
-- SECURITY DEFINER così il pubblico ottiene un conteggio corretto senza
-- avere accesso diretto alla tabella "prenotazioni" (dati personali).
-- ------------------------------------------------------------------------
create or replace function posti_liberi(p_id_escursione uuid)
returns integer
language sql
security definer
stable
set search_path = public
as $$
  select greatest(
    e.posti_totali - coalesce((
      select sum(p.numero_partecipanti)
      from prenotazioni p
      where p.id_escursione = e.id
        and p.stato <> 'annullata'
    ), 0),
    0
  )
  from escursioni e
  where e.id = p_id_escursione;
$$;

grant execute on function posti_liberi(uuid) to anon, authenticated;

-- Vista con disponibilità calcolata. security_invoker: la vista rispetta
-- le RLS di "escursioni" per chi la interroga (il pubblico vede solo le
-- pubblicate); il conteggio posti_liberi resta corretto per chiunque
-- perché la funzione sopra è SECURITY DEFINER.
create or replace view escursioni_con_disponibilita
  with (security_invoker = true)
as
select e.*, posti_liberi(e.id) as posti_liberi
from escursioni e;

grant select on escursioni_con_disponibilita to anon, authenticated;

-- ------------------------------------------------------------------------
-- Prenotazione atomica
-- ------------------------------------------------------------------------
create or replace function crea_prenotazione(
  p_id_escursione uuid,
  p_partecipanti  jsonb,
  p_note          text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_escursione        escursioni%rowtype;
  v_posti_occupati    integer;
  v_posti_liberi      integer;
  v_numero_richiesto  integer;
  v_numero_prenotazione text;
  v_prenotazione_id   uuid;
  v_partecipante      jsonb;
  v_primo             boolean := true;
  v_telefono_primo    text;
  v_email_primo       text;
  v_importo           numeric(10, 2);
  v_cf_regex          text := '^[A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z][0-9LMNPQRSTUV]{2}[A-Za-z][0-9LMNPQRSTUV]{3}[A-Za-z]$';
begin
  if p_partecipanti is null or jsonb_typeof(p_partecipanti) <> 'array'
     or jsonb_array_length(p_partecipanti) < 1 then
    raise exception 'Elenco partecipanti non valido' using errcode = '22023';
  end if;

  -- Blocca la riga dell'escursione: serializza le prenotazioni concorrenti
  -- sulla stessa uscita, evitando overbooking sull'ultimo posto disponibile.
  select * into v_escursione from escursioni where id = p_id_escursione for update;
  if not found then
    raise exception 'Escursione non trovata' using errcode = 'P0002';
  end if;
  if v_escursione.stato <> 'pubblicata' then
    raise exception 'Escursione non prenotabile' using errcode = '22023';
  end if;
  if v_escursione.data_ora <= now() then
    raise exception 'Escursione già conclusa o in corso' using errcode = '22023';
  end if;

  v_numero_richiesto := jsonb_array_length(p_partecipanti);

  select coalesce(sum(numero_partecipanti), 0) into v_posti_occupati
  from prenotazioni
  where id_escursione = p_id_escursione and stato <> 'annullata';

  v_posti_liberi := v_escursione.posti_totali - v_posti_occupati;

  if v_numero_richiesto > v_posti_liberi then
    raise exception 'Posti non sufficienti: disponibili %, richiesti %', v_posti_liberi, v_numero_richiesto
      using errcode = '23514';
  end if;

  for v_partecipante in select * from jsonb_array_elements(p_partecipanti) loop
    if coalesce(trim(both from (v_partecipante->>'nome')), '') = ''
       or coalesce(trim(both from (v_partecipante->>'cognome')), '') = '' then
      raise exception 'Nome e cognome sono obbligatori per ogni partecipante' using errcode = '22023';
    end if;

    if v_primo then
      if coalesce(trim(both from (v_partecipante->>'telefono')), '') = ''
         or coalesce(trim(both from (v_partecipante->>'email')), '') = '' then
        raise exception 'Telefono ed email sono obbligatori per il primo partecipante' using errcode = '22023';
      end if;
      v_telefono_primo := trim(both from (v_partecipante->>'telefono'));
      v_email_primo := trim(both from (v_partecipante->>'email'));
      v_primo := false;
    end if;

    if v_escursione.richiede_codice_fiscale
       and coalesce(trim(both from (v_partecipante->>'codice_fiscale')), '') = '' then
      raise exception 'Il codice fiscale è obbligatorio per questa uscita' using errcode = '22023';
    end if;

    if coalesce(trim(both from (v_partecipante->>'codice_fiscale')), '') <> ''
       and trim(both from (v_partecipante->>'codice_fiscale')) !~* v_cf_regex then
      raise exception 'Formato codice fiscale non valido' using errcode = '22023';
    end if;
  end loop;

  v_importo := v_escursione.prezzo * v_numero_richiesto;
  v_numero_prenotazione := genera_numero_prenotazione();

  insert into prenotazioni (
    numero_prenotazione, id_escursione, numero_partecipanti,
    stato, importo_totale, telefono, email, note
  ) values (
    v_numero_prenotazione, p_id_escursione, v_numero_richiesto,
    'confermata', v_importo, v_telefono_primo, v_email_primo, nullif(trim(both from p_note), '')
  )
  returning id into v_prenotazione_id;

  v_primo := true;
  for v_partecipante in select * from jsonb_array_elements(p_partecipanti) loop
    insert into partecipanti (id_prenotazione, nome, cognome, codice_fiscale, telefono, email)
    values (
      v_prenotazione_id,
      trim(both from (v_partecipante->>'nome')),
      trim(both from (v_partecipante->>'cognome')),
      nullif(upper(trim(both from (v_partecipante->>'codice_fiscale'))), ''),
      nullif(trim(both from (v_partecipante->>'telefono')), ''),
      nullif(trim(both from (v_partecipante->>'email')), '')
    );
    v_primo := false;
  end loop;

  -- Il payload di ritorno include già i dati necessari all'email di
  -- conferma (escursione + partecipanti), così il chiamante (anon) non ha
  -- bisogno di un secondo SELECT che la RLS su prenotazioni/partecipanti
  -- comunque negherebbe.
  return jsonb_build_object(
    'id', v_prenotazione_id,
    'numero_prenotazione', v_numero_prenotazione,
    'importo_totale', v_importo,
    'numero_partecipanti', v_numero_richiesto,
    'telefono', v_telefono_primo,
    'email', v_email_primo,
    'note', nullif(trim(both from p_note), ''),
    'escursione', jsonb_build_object(
      'id', v_escursione.id,
      'titolo', v_escursione.titolo,
      'data_ora', v_escursione.data_ora,
      'punto_di_ritrovo', v_escursione.punto_di_ritrovo,
      'prezzo', v_escursione.prezzo
    ),
    'partecipanti', (
      select coalesce(jsonb_agg(jsonb_build_object('nome', pa.nome, 'cognome', pa.cognome)), '[]'::jsonb)
      from partecipanti pa
      where pa.id_prenotazione = v_prenotazione_id
    )
  );
end;
$$;

grant execute on function crea_prenotazione(uuid, jsonb, text) to anon, authenticated;

-- ------------------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------------------
alter table escursioni enable row level security;
alter table prenotazioni enable row level security;
alter table partecipanti enable row level security;
alter table prenotazione_contatori enable row level security;

-- Pubblico: solo lettura delle escursioni pubblicate.
drop policy if exists "pubblico legge escursioni pubblicate" on escursioni;
create policy "pubblico legge escursioni pubblicate"
  on escursioni for select
  to anon, authenticated
  using (stato = 'pubblicata');

-- Admin (qualsiasi utente autenticato via Supabase Auth: l'area /admin non
-- ha registrazione pubblica, gli account sono creati manualmente).
drop policy if exists "admin gestisce escursioni" on escursioni;
create policy "admin gestisce escursioni"
  on escursioni for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin gestisce prenotazioni" on prenotazioni;
create policy "admin gestisce prenotazioni"
  on prenotazioni for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin gestisce partecipanti" on partecipanti;
create policy "admin gestisce partecipanti"
  on partecipanti for all
  to authenticated
  using (true)
  with check (true);

-- Nessuna policy per anon su prenotazioni/partecipanti: l'unico modo per
-- crearle da pubblico è la funzione crea_prenotazione (SECURITY DEFINER),
-- che gira con i permessi del proprietario della funzione e ignora la RLS.

-- prenotazione_contatori: nessun accesso diretto per nessuno, viene letta
-- e scritta solo da genera_numero_prenotazione() (SECURITY DEFINER).
