-- Starting / Supabase induló séma
-- Cél: többcéges, szerepkör alapú, web + mobil klienssel közös adatmodell.

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

create or replace function public.frissitesi_idobelyeg_beallitasa()
returns trigger
language plpgsql
as $$
begin
  new.frissitve = now();
  return new;
end;
$$;

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
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz,
  constraint cegek_domain_chk check (domain is null or length(trim(domain)) > 0)
);

create table if not exists public.telephelyek (
  id uuid primary key default gen_random_uuid(),
  ceg_id uuid not null references public.cegek(id) on delete cascade,
  nev text not null,
  cim text,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz,
  unique (ceg_id, nev)
);

create table if not exists public.teruletek (
  id uuid primary key default gen_random_uuid(),
  telephely_id uuid not null references public.telephelyek(id) on delete cascade,
  nev text not null,
  leiras text,
  vezeto_profil_id uuid,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz,
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
  utolso_belepes_at timestamptz,
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz
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
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz,
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
  lejarat timestamptz not null,
  elkuldve timestamptz not null default now(),
  ujrakuldve timestamptz,
  elfogadva boolean not null default false,
  elfogadva_at timestamptz,
  visszavonva_at timestamptz,
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz,
  check (lejarat >= elkuldve)
);

create table if not exists public.napi_statuszok (
  id uuid primary key default gen_random_uuid(),
  kod text not null unique,
  megnevezes text not null,
  szin text,
  aktiv boolean not null default true,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now()
);

create table if not exists public.jelenleti_naplok (
  id uuid primary key default gen_random_uuid(),
  dolgozo_id uuid not null references public.dolgozok(id) on delete cascade,
  ceg_id uuid not null references public.cegek(id) on delete cascade,
  telephely_id uuid references public.telephelyek(id) on delete set null,
  terulet_id uuid references public.teruletek(id) on delete set null,
  napi_statusz_id uuid references public.napi_statuszok(id) on delete set null,
  nap date not null default current_date,
  munka_kezdete timestamptz not null,
  munka_vege timestamptz,
  helyadat jsonb not null default '{}'::jsonb,
  foto_url text,
  megjegyzes text,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  check (munka_vege is null or munka_vege >= munka_kezdete),
  unique (dolgozo_id, nap)
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
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz,
  check (ervenyes_ig is null or ervenyes_tol is null or ervenyes_ig >= ervenyes_tol)
);

create table if not exists public.oktatasi_teljesitesek (
  id uuid primary key default gen_random_uuid(),
  oktatasi_anyag_id uuid not null references public.oktatasi_anyagok(id) on delete cascade,
  profil_id uuid not null references public.profilok(id) on delete cascade,
  dolgozo_id uuid references public.dolgozok(id) on delete cascade,
  hatarido date,
  megtekintve boolean not null default false,
  megtekintve_at timestamptz,
  elfogadva boolean not null default false,
  elfogadas_ideje timestamptz,
  teljesitesi_arany numeric(5,2) not null default 0,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
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
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz,
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
  ervenyes_eddig timestamptz,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz
);

create table if not exists public.dokumentum_elfogadasok (
  id uuid primary key default gen_random_uuid(),
  dokumentum_id uuid not null references public.dokumentumok(id) on delete cascade,
  profil_id uuid not null references public.profilok(id) on delete cascade,
  dolgozo_id uuid references public.dolgozok(id) on delete cascade,
  elfogadva boolean not null default false,
  elfogadva_at timestamptz,
  allapot public.elfogadas_allapot not null default 'hianyzik',
  esedekes_datum date,
  verzio text,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
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
  csatolmany_url text,
  admin_lathato boolean not null default true,
  metaadat jsonb not null default '{}'::jsonb,
  esemeny_datum timestamptz not null default now(),
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz
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
  olvasott_at timestamptz,
  admin_listaban_megjelenik boolean not null default false,
  akcio_url text,
  akcio_cimke text,
  forras_tipus text,
  forras_azonosito uuid,
  metaadat jsonb not null default '{}'::jsonb,
  kuldes_csatorna public.ertesites_csatorna not null default 'alkalmazason_belul',
  push_elokeszitve boolean not null default false,
  push_token text,
  push_elokeszitve_at timestamptz,
  push_kuldve_at timestamptz,
  statusz public.altalanos_statusz not null default 'aktiv',
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now(),
  torolve timestamptz
);

create table if not exists public.rendszer_naplok (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid references public.profilok(id) on delete set null,
  ceg_id uuid references public.cegek(id) on delete set null,
  muvelet text not null,
  entitas text not null,
  entitas_azonosito uuid,
  reszletek jsonb not null default '{}'::jsonb,
  letrehozva timestamptz not null default now(),
  frissitve timestamptz not null default now()
);

alter table public.teruletek
  add constraint teruletek_vezeto_profil_fk
  foreign key (vezeto_profil_id) references public.profilok(id) on delete set null;

create index if not exists idx_cegek_statusz on public.cegek(statusz);
create index if not exists idx_cegek_domain on public.cegek(domain);
create index if not exists idx_telephelyek_ceg_id on public.telephelyek(ceg_id);
create index if not exists idx_telephelyek_statusz on public.telephelyek(statusz);
create index if not exists idx_teruletek_telephely_id on public.teruletek(telephely_id);
create index if not exists idx_teruletek_vezeto_profil_id on public.teruletek(vezeto_profil_id);
create index if not exists idx_profilok_ceg_id on public.profilok(ceg_id);
create index if not exists idx_profilok_telephely_id on public.profilok(telephely_id);
create index if not exists idx_profilok_terulet_id on public.profilok(terulet_id);
create index if not exists idx_profilok_szerepkor on public.profilok(szerepkor);
create index if not exists idx_dolgozok_ceg_id on public.dolgozok(ceg_id);
create index if not exists idx_dolgozok_telephely_id on public.dolgozok(telephely_id);
create index if not exists idx_dolgozok_terulet_id on public.dolgozok(terulet_id);
create index if not exists idx_meghivok_ceg_id on public.meghivok(ceg_id);
create index if not exists idx_meghivok_email on public.meghivok(lower(email));
create index if not exists idx_meghivok_lejarat on public.meghivok(lejarat);
create index if not exists idx_jelenleti_naplok_ceg_nap on public.jelenleti_naplok(ceg_id, nap desc);
create index if not exists idx_jelenleti_naplok_terulet_nap on public.jelenleti_naplok(terulet_id, nap desc);
create index if not exists idx_oktatasi_anyagok_ceg_terulet on public.oktatasi_anyagok(ceg_id, terulet_id);
create index if not exists idx_oktatasi_teljesitesek_profil_hatarido on public.oktatasi_teljesitesek(profil_id, hatarido);
create index if not exists idx_dokumentumok_ceg_terulet on public.dokumentumok(ceg_id, terulet_id);
create index if not exists idx_dolgozo_dokumentumok_dolgozo_id on public.dolgozo_dokumentumok(dolgozo_id);
create index if not exists idx_dokumentum_elfogadasok_profil_allapot on public.dokumentum_elfogadasok(profil_id, allapot);
create index if not exists idx_esemenyek_ceg_datum on public.esemenyek(ceg_id, esemeny_datum desc);
create index if not exists idx_ertesitesek_profil_allapot on public.ertesitesek(profil_id, allapot, letrehozva desc);
create index if not exists idx_ertesitesek_admin_lista on public.ertesitesek(admin_listaban_megjelenik, prioritas, letrehozva desc);
create index if not exists idx_rendszer_naplok_entitas on public.rendszer_naplok(entitas, entitas_azonosito, letrehozva desc);

create or replace function public.ervenyes_meghivo_ellenorzese(meghivo_token text, meghivott_email text)
returns table (
  id uuid,
  email text,
  szerepkor public.felhasznaloi_szerepkor,
  ceg_id uuid,
  ceg_nev text,
  lejarat timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    m.id,
    m.email,
    m.szerepkor,
    m.ceg_id,
    c.nev as ceg_nev,
    m.lejarat
  from public.meghivok m
  join public.cegek c on c.id = m.ceg_id
  where lower(m.token) = lower(meghivo_token)
    and lower(m.email) = lower(meghivott_email)
    and m.statusz = 'fuggoben'
    and m.elfogadva = false
    and m.lejarat > now()
  limit 1
$$;

grant execute on function public.ervenyes_meghivo_ellenorzese(text, text) to anon, authenticated;

create or replace function public.profil_letrehozasa_meghivobol()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meghivo_rekord public.meghivok%rowtype;
  cel_telephely_id uuid;
  cel_terulet_id uuid;
  teljes_nev_ertek text;
begin
  if new.raw_user_meta_data ->> 'meghivo_token' is null then
    return new;
  end if;

  select *
  into meghivo_rekord
  from public.meghivok
  where lower(token) = lower(new.raw_user_meta_data ->> 'meghivo_token')
    and lower(email) = lower(coalesce(new.email, ''))
    and statusz = 'fuggoben'
    and elfogadva = false
    and lejarat > now()
  limit 1;

  if meghivo_rekord.id is null then
    return new;
  end if;

  cel_telephely_id := meghivo_rekord.telephely_id;
  cel_terulet_id := meghivo_rekord.terulet_id;
  teljes_nev_ertek := coalesce(new.raw_user_meta_data ->> 'teljes_nev', meghivo_rekord.teljes_nev, split_part(coalesce(new.email, ''), '@', 1));

  insert into public.profilok (
    id,
    ceg_id,
    telephely_id,
    terulet_id,
    teljes_nev,
    email,
    telefonszam,
    szerepkor,
    statusz,
    utolso_belepes_at
  )
  values (
    new.id,
    meghivo_rekord.ceg_id,
    cel_telephely_id,
    cel_terulet_id,
    teljes_nev_ertek,
    coalesce(new.email, meghivo_rekord.email),
    meghivo_rekord.telefonszam,
    meghivo_rekord.szerepkor,
    'aktiv',
    now()
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
    statusz = 'aktiv',
    utolso_belepes_at = now();

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
    meghivo_rekord.ceg_id,
    cel_telephely_id,
    cel_terulet_id,
    meghivo_rekord.pozicio,
    'beleptetes_alatt',
    'aktiv',
    current_date
  )
  on conflict (profil_id) do update
  set
    ceg_id = excluded.ceg_id,
    telephely_id = excluded.telephely_id,
    terulet_id = excluded.terulet_id,
    pozicio = coalesce(excluded.pozicio, public.dolgozok.pozicio),
    statusz = 'aktiv';

  update public.meghivok
  set
    elfogadva = true,
    elfogadva_at = now(),
    statusz = 'elfogadva',
    frissitve = now()
  where id = meghivo_rekord.id;

  return new;
end;
$$;

drop trigger if exists auth_user_profil_letrehozasa on auth.users;
create trigger auth_user_profil_letrehozasa
  after insert on auth.users
  for each row execute function public.profil_letrehozasa_meghivobol();

drop trigger if exists tr_cegek_frissitve on public.cegek;
create trigger tr_cegek_frissitve before update on public.cegek for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_telephelyek_frissitve on public.telephelyek;
create trigger tr_telephelyek_frissitve before update on public.telephelyek for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_teruletek_frissitve on public.teruletek;
create trigger tr_teruletek_frissitve before update on public.teruletek for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_profilok_frissitve on public.profilok;
create trigger tr_profilok_frissitve before update on public.profilok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_dolgozok_frissitve on public.dolgozok;
create trigger tr_dolgozok_frissitve before update on public.dolgozok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_meghivok_frissitve on public.meghivok;
create trigger tr_meghivok_frissitve before update on public.meghivok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_napi_statuszok_frissitve on public.napi_statuszok;
create trigger tr_napi_statuszok_frissitve before update on public.napi_statuszok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_jelenleti_naplok_frissitve on public.jelenleti_naplok;
create trigger tr_jelenleti_naplok_frissitve before update on public.jelenleti_naplok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_oktatasi_anyagok_frissitve on public.oktatasi_anyagok;
create trigger tr_oktatasi_anyagok_frissitve before update on public.oktatasi_anyagok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_oktatasi_teljesitesek_frissitve on public.oktatasi_teljesitesek;
create trigger tr_oktatasi_teljesitesek_frissitve before update on public.oktatasi_teljesitesek for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_dokumentumok_frissitve on public.dokumentumok;
create trigger tr_dokumentumok_frissitve before update on public.dokumentumok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_dolgozo_dokumentumok_frissitve on public.dolgozo_dokumentumok;
create trigger tr_dolgozo_dokumentumok_frissitve before update on public.dolgozo_dokumentumok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_dokumentum_elfogadasok_frissitve on public.dokumentum_elfogadasok;
create trigger tr_dokumentum_elfogadasok_frissitve before update on public.dokumentum_elfogadasok for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_esemenyek_frissitve on public.esemenyek;
create trigger tr_esemenyek_frissitve before update on public.esemenyek for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_ertesitesek_frissitve on public.ertesitesek;
create trigger tr_ertesitesek_frissitve before update on public.ertesitesek for each row execute function public.frissitesi_idobelyeg_beallitasa();
drop trigger if exists tr_rendszer_naplok_frissitve on public.rendszer_naplok;
create trigger tr_rendszer_naplok_frissitve before update on public.rendszer_naplok for each row execute function public.frissitesi_idobelyeg_beallitasa();
