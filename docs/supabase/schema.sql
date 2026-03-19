-- Ez a fájl a Starting aktuális Supabase adatbázis sémáját tartalmazza.
-- A struktúra a jelenlegi webes és mobilos kódbázis fogalmaival van összehangolva,
-- és tartalmazza a minimálisan szükséges, valamint a riportokhoz és beléptetéshez hasznos kiegészítő mezőket is.
create extension if not exists pgcrypto;

create type public.felhasznaloi_szerepkor as enum ('szuperadmin', 'ceg_admin', 'terulet_vezeto', 'dolgozo');
create type public.altalanos_statusz as enum ('aktiv', 'inaktiv', 'torolt');
create type public.foglalkoztatasi_statusz as enum ('beleptetes_alatt', 'aktiv', 'inaktiv');
create type public.meghivo_statusz as enum ('fuggoben', 'elfogadva', 'lejart', 'visszavonva');
create type public.ertesites_tipus as enum ('rendszeruzenet', 'kotelezo_oktatas', 'hianyzo_napi_belepes', 'admin_osszefoglalo');
create type public.ertesites_prioritas as enum ('alacsony', 'normal', 'magas', 'kritikus');
create type public.ertesites_allapot as enum ('uj', 'kikuldve', 'olvasott', 'archivalt');
create type public.ertesites_cel as enum ('profil', 'ceg_admin', 'terulet_vezeto', 'globalis_admin');
create type public.ertesites_csatorna as enum ('alkalmazason_belul', 'email', 'push_elokeszitve');
create type public.elfogadas_allapot as enum ('hianyzik', 'folyamatban', 'elfogadva', 'lejart');

create table if not exists public.cegek (
  id uuid primary key default gen_random_uuid(),
  nev text not null,
  domain text,
  adoszam text,
  kapcsolattarto_nev text,
  kapcsolattarto_email text,
  telefon text,
  cim text,
  statusz public.altalanos_statusz not null default 'aktiv',
  logo_url text,
  elofizetesi_csomag text,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone
);

create table if not exists public.telephelyek (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid not null references public.cegek(id) on delete cascade,
  nev text not null,
  cim text,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone,
  unique (ceg_id, nev)
);

create table if not exists public.teruletek (
  id uuid primary key default gen_random_uuid(),
  telephely_id uuid not null references public.telephelyek(id) on delete cascade,
  nev text not null,
  leiras text,
  vezeto_profil_id uuid,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone,
  unique (telephely_id, nev)
);

create table if not exists public.profilok (
  id uuid primary key,
  ceg_id uuid references public.cegek(id) on delete set null,
  telephely_id uuid references public.telephelyek(id) on delete set null,
  terulet_id uuid references public.teruletek(id) on delete set null,
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
  profil_id uuid not null unique references public.profilok(id) on delete cascade,
  ceg_id uuid not null references public.cegek(id) on delete cascade,
  telephely_id uuid references public.telephelyek(id) on delete set null,
  terulet_id uuid references public.teruletek(id) on delete set null,
  pozicio text,
  profilkep_url text,
  foglalkoztatasi_statusz public.foglalkoztatasi_statusz not null default 'beleptetes_alatt',
  munkaviszony_kezdete date,
  munkaviszony_vege date,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone,
  check (munkaviszony_vege is null or munkaviszony_kezdete is null or munkaviszony_vege >= munkaviszony_kezdete)
);

create table if not exists public.meghivok (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid not null references public.cegek(id) on delete cascade,
  telephely_id uuid references public.telephelyek(id) on delete set null,
  terulet_id uuid references public.teruletek(id) on delete set null,
  kuldo_profil_id uuid references public.profilok(id) on delete set null,
  email text not null,
  teljes_nev text,
  telefonszam text,
  pozicio text,
  szerepkor public.felhasznaloi_szerepkor not null,
  statusz public.meghivo_statusz not null default 'fuggoben',
  token text not null unique,
  lejarat timestamp with time zone not null,
  elkuldve timestamp with time zone not null default now(),
  ujrakuldve timestamp with time zone,
  elfogadva boolean not null default false,
  elfogadva_at timestamp with time zone,
  visszavonva_at timestamp with time zone,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone,
  check (lejarat >= elkuldve)
);

create table if not exists public.napi_statuszok (
  id uuid primary key default gen_random_uuid(),
  kod text not null unique,
  megnevezes text not null,
  szin text,
  aktiv boolean not null default true,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now()
);

create table if not exists public.jelenleti_naplok (
  id uuid primary key default gen_random_uuid(),
  dolgozo_id uuid not null references public.dolgozok(id) on delete cascade,
  ceg_id uuid not null references public.cegek(id) on delete cascade,
  telephely_id uuid references public.telephelyek(id) on delete set null,
  terulet_id uuid references public.teruletek(id) on delete set null,
  napi_statusz_id uuid references public.napi_statuszok(id) on delete set null,
  nap date not null default current_date,
  munka_kezdete timestamp with time zone not null,
  munka_vege timestamp with time zone,
  helyadat jsonb not null default '{}'::jsonb,
  foto_url text,
  megjegyzes text,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  check (munka_vege is null or munka_vege >= munka_kezdete)
);

create table if not exists public.oktatasi_anyagok (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid references public.cegek(id) on delete cascade,
  terulet_id uuid references public.teruletek(id) on delete set null,
  cim text not null,
  leiras text,
  tipus text not null,
  kategoria text,
  fajl_url text,
  kotelezo boolean not null default false,
  letoltheto boolean not null default true,
  ervenyes_tol date,
  ervenyes_ig date,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone,
  check (ervenyes_ig is null or ervenyes_tol is null or ervenyes_ig >= ervenyes_tol)
);

create table if not exists public.oktatasi_teljesitesek (
  id uuid primary key default gen_random_uuid(),
  oktatasi_anyag_id uuid not null references public.oktatasi_anyagok(id) on delete cascade,
  profil_id uuid not null references public.profilok(id) on delete cascade,
  dolgozo_id uuid references public.dolgozok(id) on delete cascade,
  hatarido date,
  megtekintve boolean not null default false,
  megtekintve_at timestamp with time zone,
  elfogadva boolean not null default false,
  elfogadas_ideje timestamp with time zone,
  teljesitesi_arany numeric(5,2) not null default 0,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  unique (oktatasi_anyag_id, profil_id),
  check (teljesitesi_arany >= 0 and teljesitesi_arany <= 100)
);

create table if not exists public.dokumentumok (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid references public.cegek(id) on delete cascade,
  terulet_id uuid references public.teruletek(id) on delete set null,
  cim text not null,
  leiras text,
  tipus text,
  verzio text,
  fajl_url text,
  kotelezo boolean not null default false,
  ervenyes_tol date,
  ervenyes_ig date,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone,
  check (ervenyes_ig is null or ervenyes_tol is null or ervenyes_ig >= ervenyes_tol)
);

create table if not exists public.dolgozo_dokumentumok (
  id uuid primary key default gen_random_uuid(),
  dolgozo_id uuid not null references public.dolgozok(id) on delete cascade,
  ceg_id uuid not null references public.cegek(id) on delete cascade,
  dokumentum_id uuid references public.dokumentumok(id) on delete set null,
  feltolto_profil_id uuid references public.profilok(id) on delete set null,
  cim text not null,
  dokumentum_tipus text not null,
  fajl_url text not null,
  megjegyzes text,
  ervenyes_eddig timestamp with time zone,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone
);

create table if not exists public.dokumentum_elfogadasok (
  id uuid primary key default gen_random_uuid(),
  dokumentum_id uuid not null references public.dokumentumok(id) on delete cascade,
  profil_id uuid not null references public.profilok(id) on delete cascade,
  dolgozo_id uuid references public.dolgozok(id) on delete cascade,
  allapot public.elfogadas_allapot not null default 'hianyzik',
  esedekes_datum date,
  elfogadva boolean not null default false,
  megerosito_nev text,
  elfogadas_ideje timestamp with time zone,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  unique (dokumentum_id, profil_id)
);

create table if not exists public.esemenyek (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid not null references public.cegek(id) on delete cascade,
  telephely_id uuid references public.telephelyek(id) on delete set null,
  terulet_id uuid references public.teruletek(id) on delete set null,
  dolgozo_id uuid references public.dolgozok(id) on delete set null,
  rogzito_profil_id uuid references public.profilok(id) on delete set null,
  kategoria text not null,
  rovid_leiras text not null,
  reszletes_leiras text,
  esemeny_datum timestamp with time zone not null,
  csatolmany_url text,
  admin_lathato boolean not null default true,
  metaadat jsonb not null default '{}'::jsonb,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone
);

create table if not exists public.ertesitesek (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid references public.profilok(id) on delete cascade,
  ceg_id uuid references public.cegek(id) on delete cascade,
  terulet_id uuid references public.teruletek(id) on delete set null,
  cel public.ertesites_cel not null default 'profil',
  cim text not null,
  uzenet text not null,
  tipus public.ertesites_tipus not null,
  prioritas public.ertesites_prioritas not null default 'normal',
  allapot public.ertesites_allapot not null default 'uj',
  olvasott boolean not null default false,
  olvasva_at timestamp with time zone,
  admin_listaban_megjelenik boolean not null default false,
  csoportositas_kulcs text,
  forras_tipus text,
  forras_azonosito uuid,
  akcio_url text,
  metaadat jsonb not null default '{}'::jsonb,
  kuldes_csatorna public.ertesites_csatorna not null default 'alkalmazason_belul',
  push_elokeszitve boolean not null default false,
  push_token text,
  push_elokeszitve_at timestamp with time zone,
  push_kuldve_at timestamp with time zone,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now(),
  torolve timestamp with time zone,
  check (profil_id is not null or cel <> 'profil')
);

create table if not exists public.rendszer_naplok (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid references public.profilok(id) on delete set null,
  ceg_id uuid references public.cegek(id) on delete set null,
  muvelet text not null,
  entitas text not null,
  entitas_azonosito uuid,
  reszletek jsonb not null default '{}'::jsonb,
  letrehozva timestamp with time zone not null default now(),
  frissitve timestamp with time zone not null default now()
);

alter table public.teruletek
  drop constraint if exists teruletek_vezeto_profil_id_fkey;
alter table public.teruletek
  add constraint teruletek_vezeto_profil_id_fkey
  foreign key (vezeto_profil_id) references public.profilok(id) on delete set null;

create unique index if not exists idx_cegek_adoszam_unique on public.cegek (adoszam) where adoszam is not null;
create unique index if not exists idx_cegek_domain_unique on public.cegek (lower(domain)) where domain is not null;
create index if not exists idx_cegek_statusz on public.cegek (statusz) where torolve is null;
create index if not exists idx_telephelyek_ceg_id on public.telephelyek (ceg_id);
create index if not exists idx_telephelyek_statusz on public.telephelyek (statusz) where torolve is null;
create index if not exists idx_teruletek_telephely_id on public.teruletek (telephely_id);
create index if not exists idx_teruletek_vezeto_profil_id on public.teruletek (vezeto_profil_id);
create index if not exists idx_teruletek_statusz on public.teruletek (statusz) where torolve is null;
create index if not exists idx_profilok_ceg_id on public.profilok (ceg_id);
create index if not exists idx_profilok_telephely_id on public.profilok (telephely_id);
create index if not exists idx_profilok_terulet_id on public.profilok (terulet_id);
create index if not exists idx_profilok_szerepkor on public.profilok (szerepkor);
create index if not exists idx_profilok_statusz on public.profilok (statusz) where torolve is null;
create index if not exists idx_dolgozok_ceg_id on public.dolgozok (ceg_id);
create index if not exists idx_dolgozok_telephely_id on public.dolgozok (telephely_id);
create index if not exists idx_dolgozok_terulet_id on public.dolgozok (terulet_id);
create index if not exists idx_dolgozok_foglalkoztatasi_statusz on public.dolgozok (foglalkoztatasi_statusz);
create index if not exists idx_dolgozok_statusz on public.dolgozok (statusz) where torolve is null;
create index if not exists idx_meghivok_ceg_id on public.meghivok (ceg_id);
create index if not exists idx_meghivok_telephely_id on public.meghivok (telephely_id);
create index if not exists idx_meghivok_terulet_id on public.meghivok (terulet_id);
create index if not exists idx_meghivok_kuldo_profil_id on public.meghivok (kuldo_profil_id);
create index if not exists idx_meghivok_statusz on public.meghivok (statusz);
create index if not exists idx_meghivok_email on public.meghivok (lower(email));
create index if not exists idx_meghivok_lejarat on public.meghivok (lejarat) where torolve is null;
create index if not exists idx_napi_statuszok_statusz on public.napi_statuszok (statusz) where aktiv = true;
create unique index if not exists idx_jelenleti_naplok_dolgozo_nap_unique on public.jelenleti_naplok (dolgozo_id, nap);
create index if not exists idx_jelenleti_naplok_dolgozo_id on public.jelenleti_naplok (dolgozo_id);
create index if not exists idx_jelenleti_naplok_ceg_id on public.jelenleti_naplok (ceg_id, nap desc);
create index if not exists idx_jelenleti_naplok_telephely_id on public.jelenleti_naplok (telephely_id);
create index if not exists idx_jelenleti_naplok_terulet_id on public.jelenleti_naplok (terulet_id);
create index if not exists idx_jelenleti_naplok_napi_statusz_id on public.jelenleti_naplok (napi_statusz_id);
create index if not exists idx_jelenleti_naplok_nap on public.jelenleti_naplok (nap desc);
create index if not exists idx_jelenleti_naplok_statusz on public.jelenleti_naplok (statusz);
create index if not exists idx_oktatasi_anyagok_ceg_id on public.oktatasi_anyagok (ceg_id);
create index if not exists idx_oktatasi_anyagok_terulet_id on public.oktatasi_anyagok (terulet_id);
create index if not exists idx_oktatasi_anyagok_statusz on public.oktatasi_anyagok (statusz) where torolve is null;
create index if not exists idx_oktatasi_teljesitesek_oktatasi_anyag_id on public.oktatasi_teljesitesek (oktatasi_anyag_id);
create index if not exists idx_oktatasi_teljesitesek_profil_id on public.oktatasi_teljesitesek (profil_id);
create index if not exists idx_oktatasi_teljesitesek_dolgozo_id on public.oktatasi_teljesitesek (dolgozo_id);
create index if not exists idx_oktatasi_teljesitesek_hatarido on public.oktatasi_teljesitesek (hatarido);
create index if not exists idx_oktatasi_teljesitesek_statusz on public.oktatasi_teljesitesek (statusz);
create index if not exists idx_dokumentumok_ceg_id on public.dokumentumok (ceg_id);
create index if not exists idx_dokumentumok_terulet_id on public.dokumentumok (terulet_id);
create index if not exists idx_dokumentumok_statusz on public.dokumentumok (statusz) where torolve is null;
create index if not exists idx_dolgozo_dokumentumok_dolgozo_id on public.dolgozo_dokumentumok (dolgozo_id);
create index if not exists idx_dolgozo_dokumentumok_ceg_id on public.dolgozo_dokumentumok (ceg_id);
create index if not exists idx_dolgozo_dokumentumok_dokumentum_id on public.dolgozo_dokumentumok (dokumentum_id);
create index if not exists idx_dolgozo_dokumentumok_feltolto_profil_id on public.dolgozo_dokumentumok (feltolto_profil_id);
create index if not exists idx_dolgozo_dokumentumok_statusz on public.dolgozo_dokumentumok (statusz) where torolve is null;
create index if not exists idx_dokumentum_elfogadasok_dokumentum_id on public.dokumentum_elfogadasok (dokumentum_id);
create index if not exists idx_dokumentum_elfogadasok_profil_id on public.dokumentum_elfogadasok (profil_id);
create index if not exists idx_dokumentum_elfogadasok_dolgozo_id on public.dokumentum_elfogadasok (dolgozo_id);
create index if not exists idx_dokumentum_elfogadasok_allapot on public.dokumentum_elfogadasok (allapot, esedekes_datum);
create index if not exists idx_esemenyek_ceg_id on public.esemenyek (ceg_id, esemeny_datum desc);
create index if not exists idx_esemenyek_telephely_id on public.esemenyek (telephely_id);
create index if not exists idx_esemenyek_terulet_id on public.esemenyek (terulet_id);
create index if not exists idx_esemenyek_dolgozo_id on public.esemenyek (dolgozo_id);
create index if not exists idx_esemenyek_rogzito_profil_id on public.esemenyek (rogzito_profil_id);
create index if not exists idx_esemenyek_kategoria on public.esemenyek (kategoria);
create index if not exists idx_esemenyek_statusz on public.esemenyek (statusz) where torolve is null;
create index if not exists idx_ertesitesek_profil_id on public.ertesitesek (profil_id);
create index if not exists idx_ertesitesek_ceg_id on public.ertesitesek (ceg_id);
create index if not exists idx_ertesitesek_terulet_id on public.ertesitesek (terulet_id);
create index if not exists idx_ertesitesek_allapot_letrehozva on public.ertesitesek (allapot, letrehozva desc) where torolve is null;
create index if not exists idx_ertesitesek_admin_lista on public.ertesitesek (admin_listaban_megjelenik, prioritas, letrehozva desc) where torolve is null;
create index if not exists idx_ertesitesek_tipus_cel on public.ertesitesek (tipus, cel);
create index if not exists idx_rendszer_naplok_ceg_id on public.rendszer_naplok (ceg_id, letrehozva desc);
create index if not exists idx_rendszer_naplok_profil_id on public.rendszer_naplok (profil_id, letrehozva desc);
create index if not exists idx_rendszer_naplok_entitas on public.rendszer_naplok (entitas, entitas_azonosito);

create or replace function public.frissitve_idobelyeg_beallitasa()
returns trigger
language plpgsql
as $$
begin
  new.frissitve = now();
  return new;
end;
$$;

create or replace function public.profil_letrehozasa_meghivobol()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meghivo public.meghivok%rowtype;
  teljes_nev_ertek text;
begin
  select *
  into meghivo
  from public.meghivok
  where lower(token) = lower(coalesce(new.raw_user_meta_data ->> 'meghivo_token', ''))
    and lower(email) = lower(new.email)
    and elfogadva = false
    and statusz = 'fuggoben'
    and lejarat > now()
  limit 1;

  if not found then
    raise exception 'Érvénytelen vagy lejárt meghívó.';
  end if;

  teljes_nev_ertek := nullif(trim(coalesce(new.raw_user_meta_data ->> 'teljes_nev', '')), '');

  insert into public.profilok (id, ceg_id, telephely_id, terulet_id, teljes_nev, email, telefonszam, szerepkor, statusz)
  values (
    new.id,
    meghivo.ceg_id,
    meghivo.telephely_id,
    meghivo.terulet_id,
    coalesce(teljes_nev_ertek, meghivo.teljes_nev, split_part(new.email, '@', 1)),
    new.email,
    meghivo.telefonszam,
    meghivo.szerepkor,
    'aktiv'
  )
  on conflict (id) do update
  set
    ceg_id = excluded.ceg_id,
    telephely_id = excluded.telephely_id,
    terulet_id = excluded.terulet_id,
    teljes_nev = excluded.teljes_nev,
    email = excluded.email,
    telefonszam = excluded.telefonszam,
    szerepkor = excluded.szerepkor,
    frissitve = now();

  insert into public.dolgozok (
    profil_id,
    ceg_id,
    telephely_id,
    terulet_id,
    pozicio,
    foglalkoztatasi_statusz,
    statusz,
    munkaviszony_kezdete
  )
  values (
    new.id,
    meghivo.ceg_id,
    meghivo.telephely_id,
    meghivo.terulet_id,
    meghivo.pozicio,
    'beleptetes_alatt',
    'aktiv',
    current_date
  )
  on conflict (profil_id) do update
  set
    ceg_id = excluded.ceg_id,
    telephely_id = excluded.telephely_id,
    terulet_id = excluded.terulet_id,
    pozicio = excluded.pozicio,
    frissitve = now();

  update public.meghivok
  set
    elfogadva = true,
    elfogadva_at = now(),
    statusz = 'elfogadva'
  where id = meghivo.id;

  return new;
end;
$$;

drop trigger if exists trig_profil_letrehozasa_meghivobol on auth.users;

create trigger trig_profil_letrehozasa_meghivobol
after insert on auth.users
for each row execute function public.profil_letrehozasa_meghivobol();

drop trigger if exists trig_cegek_frissitve on public.cegek;
create trigger trig_cegek_frissitve
before update on public.cegek
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_telephelyek_frissitve on public.telephelyek;
create trigger trig_telephelyek_frissitve
before update on public.telephelyek
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_teruletek_frissitve on public.teruletek;
create trigger trig_teruletek_frissitve
before update on public.teruletek
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_profilok_frissitve on public.profilok;
create trigger trig_profilok_frissitve
before update on public.profilok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_dolgozok_frissitve on public.dolgozok;
create trigger trig_dolgozok_frissitve
before update on public.dolgozok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_meghivok_frissitve on public.meghivok;
create trigger trig_meghivok_frissitve
before update on public.meghivok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_napi_statuszok_frissitve on public.napi_statuszok;
create trigger trig_napi_statuszok_frissitve
before update on public.napi_statuszok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_jelenleti_naplok_frissitve on public.jelenleti_naplok;
create trigger trig_jelenleti_naplok_frissitve
before update on public.jelenleti_naplok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_oktatasi_anyagok_frissitve on public.oktatasi_anyagok;
create trigger trig_oktatasi_anyagok_frissitve
before update on public.oktatasi_anyagok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_oktatasi_teljesitesek_frissitve on public.oktatasi_teljesitesek;
create trigger trig_oktatasi_teljesitesek_frissitve
before update on public.oktatasi_teljesitesek
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_dokumentumok_frissitve on public.dokumentumok;
create trigger trig_dokumentumok_frissitve
before update on public.dokumentumok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_dolgozo_dokumentumok_frissitve on public.dolgozo_dokumentumok;
create trigger trig_dolgozo_dokumentumok_frissitve
before update on public.dolgozo_dokumentumok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_dokumentum_elfogadasok_frissitve on public.dokumentum_elfogadasok;
create trigger trig_dokumentum_elfogadasok_frissitve
before update on public.dokumentum_elfogadasok
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_esemenyek_frissitve on public.esemenyek;
create trigger trig_esemenyek_frissitve
before update on public.esemenyek
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_ertesitesek_frissitve on public.ertesitesek;
create trigger trig_ertesitesek_frissitve
before update on public.ertesitesek
for each row execute function public.frissitve_idobelyeg_beallitasa();

drop trigger if exists trig_rendszer_naplok_frissitve on public.rendszer_naplok;
create trigger trig_rendszer_naplok_frissitve
before update on public.rendszer_naplok
for each row execute function public.frissitve_idobelyeg_beallitasa();
