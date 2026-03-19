-- Ez a fájl a Starting induló Supabase adatbázis sémáját tartalmazza fejlesztési alapként.
create extension if not exists pgcrypto;

create type public.felhasznaloi_szerepkor as enum ('szuperadmin', 'ceg_admin', 'terulet_vezeto', 'dolgozo');
create type public.altalanos_statusz as enum ('aktiv', 'inaktiv', 'torolt');

create table if not exists public.cegek (
  id uuid primary key default gen_random_uuid(),
  nev text not null,
  domain text,
  kapcsolattarto_nev text,
  kapcsolattarto_email text,
  telefon text,
  cim text,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone
);

create table if not exists public.telephelyek (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid not null references public.cegek(id),
  nev text not null,
  cim text,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now()
);

create table if not exists public.teruletek (
  id uuid primary key default gen_random_uuid(),
  telephely_id uuid not null references public.telephelyek(id),
  nev text not null,
  vezeto_profil_id uuid,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now()
);

create table if not exists public.profilok (
  id uuid primary key,
  ceg_id uuid references public.cegek(id),
  telephely_id uuid references public.telephelyek(id),
  terulet_id uuid references public.teruletek(id),
  teljes_nev text not null,
  email text not null unique,
  telefonszam text,
  szerepkor public.felhasznaloi_szerepkor not null default 'dolgozo',
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone
);

create table if not exists public.dolgozok (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null unique references public.profilok(id),
  ceg_id uuid not null references public.cegek(id),
  telephely_id uuid references public.telephelyek(id),
  terulet_id uuid references public.teruletek(id),
  pozicio text,
  profilkep_url text,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone
);

create table if not exists public.meghivok (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid not null references public.cegek(id),
  email text not null,
  szerepkor public.felhasznaloi_szerepkor not null,
  token text not null unique,
  lejarat timestamp with time zone not null,
  elfogadva boolean not null default false,
  letrehozva timestamp with time zone not null default now()
);

create table if not exists public.napi_statuszok (
  id uuid primary key default gen_random_uuid(),
  kod text not null unique,
  megnevezes text not null,
  szin text,
  aktiv boolean not null default true,
  letrehozva timestamp with time zone not null default now()
);

create table if not exists public.jelenleti_naplok (
  id uuid primary key default gen_random_uuid(),
  dolgozo_id uuid not null references public.dolgozok(id),
  ceg_id uuid not null references public.cegek(id),
  telephely_id uuid references public.telephelyek(id),
  terulet_id uuid references public.teruletek(id),
  napi_statusz_id uuid references public.napi_statuszok(id),
  munka_kezdete timestamp with time zone not null,
  munka_vege timestamp with time zone,
  helyadat jsonb,
  foto_url text,
  megjegyzes text,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now()
);

create table if not exists public.oktatasi_anyagok (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid references public.cegek(id),
  cim text not null,
  leiras text,
  tipus text not null,
  fajl_url text,
  kotelezo boolean not null default false,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now()
);

create table if not exists public.oktatasi_teljesitesek (
  id uuid primary key default gen_random_uuid(),
  oktatasi_anyag_id uuid not null references public.oktatasi_anyagok(id),
  profil_id uuid not null references public.profilok(id),
  megtekintve boolean not null default false,
  elfogadva boolean not null default false,
  elfogadas_ideje timestamp with time zone,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  unique(oktatasi_anyag_id, profil_id)
);

create table if not exists public.dokumentumok (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid references public.cegek(id),
  cim text not null,
  leiras text,
  fajl_url text,
  kotelezo boolean not null default false,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now()
);

create table if not exists public.dokumentum_elfogadasok (
  id uuid primary key default gen_random_uuid(),
  dokumentum_id uuid not null references public.dokumentumok(id),
  profil_id uuid not null references public.profilok(id),
  elfogadva boolean not null default false,
  megerosito_nev text,
  elfogadas_ideje timestamp with time zone,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  unique(dokumentum_id, profil_id)
);

create table if not exists public.esemenyek (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid not null references public.cegek(id),
  terulet_id uuid references public.teruletek(id),
  dolgozo_id uuid references public.dolgozok(id),
  kategoria text not null,
  rovid_leiras text not null,
  esemeny_datum timestamp with time zone not null,
  csatolmany_url text,
  admin_lathato boolean not null default true,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now()
);

create table if not exists public.ertesitesek (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references public.profilok(id),
  cim text not null,
  uzenet text not null,
  tipus text not null,
  olvasott boolean not null default false,
  kuldes_csatorna text not null default 'alkalmazason_belul',
  letrehozva timestamp with time zone not null default now()
);

create table if not exists public.rendszer_naplok (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid references public.profilok(id),
  muvelet text not null,
  entitas text not null,
  entitas_azonosito uuid,
  reszletek jsonb,
  letrehozva timestamp with time zone not null default now()
);

create index if not exists idx_telephelyek_ceg_id on public.telephelyek (ceg_id);
create index if not exists idx_teruletek_telephely_id on public.teruletek (telephely_id);
create index if not exists idx_profilok_ceg_id on public.profilok (ceg_id);
create index if not exists idx_dolgozok_ceg_id on public.dolgozok (ceg_id);
create index if not exists idx_jelenleti_naplok_dolgozo_id on public.jelenleti_naplok (dolgozo_id);
create index if not exists idx_ertesitesek_profil_id on public.ertesitesek (profil_id);
