-- Starting / Supabase RLS szabályok
-- A service_role kulcs RLS-bypass jogosultsága megmarad; az alábbi szabályok az anon/authenticated klienseket védik.

alter table public.cegek enable row level security;
alter table public.telephelyek enable row level security;
alter table public.teruletek enable row level security;
alter table public.profilok enable row level security;
alter table public.dolgozok enable row level security;
alter table public.meghivok enable row level security;
alter table public.napi_statuszok enable row level security;
alter table public.jelenleti_naplok enable row level security;
alter table public.oktatasi_anyagok enable row level security;
alter table public.oktatasi_teljesitesek enable row level security;
alter table public.dokumentumok enable row level security;
alter table public.dolgozo_dokumentumok enable row level security;
alter table public.dokumentum_elfogadasok enable row level security;
alter table public.esemenyek enable row level security;
alter table public.ertesitesek enable row level security;
alter table public.rendszer_naplok enable row level security;

alter table public.cegek force row level security;
alter table public.telephelyek force row level security;
alter table public.teruletek force row level security;
alter table public.profilok force row level security;
alter table public.dolgozok force row level security;
alter table public.meghivok force row level security;
alter table public.napi_statuszok force row level security;
alter table public.jelenleti_naplok force row level security;
alter table public.oktatasi_anyagok force row level security;
alter table public.oktatasi_teljesitesek force row level security;
alter table public.dokumentumok force row level security;
alter table public.dolgozo_dokumentumok force row level security;
alter table public.dokumentum_elfogadasok force row level security;
alter table public.esemenyek force row level security;
alter table public.ertesitesek force row level security;
alter table public.rendszer_naplok force row level security;

create or replace function public.aktualis_szerepkor()
returns public.felhasznaloi_szerepkor
language sql
stable
security definer
set search_path = public
as $$
  select szerepkor
  from public.profilok
  where id = auth.uid()
$$;

create or replace function public.aktualis_ceg_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select ceg_id
  from public.profilok
  where id = auth.uid()
$$;

create or replace function public.aktualis_telephely_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select telephely_id
  from public.profilok
  where id = auth.uid()
$$;

create or replace function public.aktualis_terulet_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select terulet_id
  from public.profilok
  where id = auth.uid()
$$;

create or replace function public.aktualis_dolgozo_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.dolgozok
  where profil_id = auth.uid()
$$;

create or replace function public.szuperadmin_e()
returns boolean
language sql
stable
as $$
  select coalesce(public.aktualis_szerepkor() = 'szuperadmin', false)
$$;

create or replace function public.ceg_admin_e()
returns boolean
language sql
stable
as $$
  select coalesce(public.aktualis_szerepkor() = 'ceg_admin', false)
$$;

create or replace function public.terulet_vezeto_e()
returns boolean
language sql
stable
as $$
  select coalesce(public.aktualis_szerepkor() = 'terulet_vezeto', false)
$$;

create or replace function public.dolgozo_e()
returns boolean
language sql
stable
as $$
  select coalesce(public.aktualis_szerepkor() = 'dolgozo', false)
$$;

create or replace function public.sajat_profil_e(profil_azonosito uuid)
returns boolean
language sql
stable
as $$
  select auth.uid() = profil_azonosito
$$;

create or replace function public.ceg_hozzaferes_van(ceg_azonosito uuid)
returns boolean
language sql
stable
as $$
  select case
    when ceg_azonosito is null then false
    when public.szuperadmin_e() then true
    else ceg_azonosito = public.aktualis_ceg_id()
  end
$$;

create or replace function public.telephely_hozzaferes_van(telephely_azonosito uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.telephelyek t
    where t.id = telephely_azonosito
      and (
        public.szuperadmin_e()
        or t.ceg_id = public.aktualis_ceg_id()
      )
  )
$$;

create or replace function public.terulet_hozzaferes_van(terulet_azonosito uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.teruletek tr
    join public.telephelyek tp on tp.id = tr.telephely_id
    where tr.id = terulet_azonosito
      and (
        public.szuperadmin_e()
        or tp.ceg_id = public.aktualis_ceg_id()
      )
  )
$$;

create or replace function public.sajat_vagy_szervezeti_profil(profil_azonosito uuid, ceg_azonosito uuid, terulet_azonosito uuid)
returns boolean
language sql
stable
as $$
  select (
    public.sajat_profil_e(profil_azonosito)
    or public.szuperadmin_e()
    or (public.ceg_admin_e() and public.ceg_hozzaferes_van(ceg_azonosito))
    or (public.terulet_vezeto_e() and terulet_azonosito = public.aktualis_terulet_id())
  )
$$;

create or replace function public.dolgozo_hozzaferes_van(dolgozo_azonosito uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.dolgozok d
    where d.id = dolgozo_azonosito
      and (
        public.szuperadmin_e()
        or (public.ceg_admin_e() and d.ceg_id = public.aktualis_ceg_id())
        or (public.terulet_vezeto_e() and d.terulet_id = public.aktualis_terulet_id())
        or (public.dolgozo_e() and d.profil_id = auth.uid())
      )
  )
$$;

grant execute on function public.aktualis_szerepkor() to authenticated;
grant execute on function public.aktualis_ceg_id() to authenticated;
grant execute on function public.aktualis_telephely_id() to authenticated;
grant execute on function public.aktualis_terulet_id() to authenticated;
grant execute on function public.aktualis_dolgozo_id() to authenticated;

-- CÉGEK

drop policy if exists cegek_select on public.cegek;
create policy cegek_select on public.cegek
for select using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and id = public.aktualis_ceg_id())
  or (public.dolgozo_e() and id = public.aktualis_ceg_id())
);

drop policy if exists cegek_mod on public.cegek;
create policy cegek_mod on public.cegek
for all using (
  public.szuperadmin_e() or (public.ceg_admin_e() and id = public.aktualis_ceg_id())
)
with check (
  public.szuperadmin_e() or (public.ceg_admin_e() and id = public.aktualis_ceg_id())
);

-- TELEPHELYEK

drop policy if exists telephelyek_select on public.telephelyek;
create policy telephelyek_select on public.telephelyek
for select using (public.telephely_hozzaferes_van(id));

drop policy if exists telephelyek_mod on public.telephelyek;
create policy telephelyek_mod on public.telephelyek
for all using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
)
with check (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
);

-- TERÜLETEK

drop policy if exists teruletek_select on public.teruletek;
create policy teruletek_select on public.teruletek
for select using (
  public.terulet_hozzaferes_van(id)
  or (public.terulet_vezeto_e() and id = public.aktualis_terulet_id())
);

drop policy if exists teruletek_mod on public.teruletek;
create policy teruletek_mod on public.teruletek
for all using (
  public.szuperadmin_e()
  or exists (
    select 1
    from public.telephelyek tp
    where tp.id = telephely_id
      and public.ceg_admin_e()
      and tp.ceg_id = public.aktualis_ceg_id()
  )
)
with check (
  public.szuperadmin_e()
  or exists (
    select 1
    from public.telephelyek tp
    where tp.id = telephely_id
      and public.ceg_admin_e()
      and tp.ceg_id = public.aktualis_ceg_id()
  )
);

-- PROFILOK

drop policy if exists profilok_select on public.profilok;
create policy profilok_select on public.profilok
for select using (public.sajat_vagy_szervezeti_profil(id, ceg_id, terulet_id));

drop policy if exists profilok_update on public.profilok;
create policy profilok_update on public.profilok
for update using (public.sajat_vagy_szervezeti_profil(id, ceg_id, terulet_id))
with check (public.sajat_vagy_szervezeti_profil(id, ceg_id, terulet_id));

-- DOLGOZÓK

drop policy if exists dolgozok_select on public.dolgozok;
create policy dolgozok_select on public.dolgozok
for select using (public.dolgozo_hozzaferes_van(id));

drop policy if exists dolgozok_mod on public.dolgozok;
create policy dolgozok_mod on public.dolgozok
for all using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
)
with check (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
);

-- MEGHÍVÓK

drop policy if exists meghivok_select on public.meghivok;
create policy meghivok_select on public.meghivok
for select using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
);

drop policy if exists meghivok_mod on public.meghivok;
create policy meghivok_mod on public.meghivok
for all using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
)
with check (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
);

-- NAPI STÁTUSZOK

drop policy if exists napi_statuszok_select on public.napi_statuszok;
create policy napi_statuszok_select on public.napi_statuszok
for select using (auth.role() = 'authenticated');

drop policy if exists napi_statuszok_mod on public.napi_statuszok;
create policy napi_statuszok_mod on public.napi_statuszok
for all using (public.szuperadmin_e() or public.ceg_admin_e())
with check (public.szuperadmin_e() or public.ceg_admin_e());

-- JELENLÉTI NAPLÓK

drop policy if exists jelenleti_naplok_select on public.jelenleti_naplok;
create policy jelenleti_naplok_select on public.jelenleti_naplok
for select using (
  public.dolgozo_hozzaferes_van(dolgozo_id)
  or public.ceg_hozzaferes_van(ceg_id)
);

drop policy if exists jelenleti_naplok_insert on public.jelenleti_naplok;
create policy jelenleti_naplok_insert on public.jelenleti_naplok
for insert with check (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
  or (public.dolgozo_e() and dolgozo_id = public.aktualis_dolgozo_id())
);

drop policy if exists jelenleti_naplok_update on public.jelenleti_naplok;
create policy jelenleti_naplok_update on public.jelenleti_naplok
for update using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
  or (public.dolgozo_e() and dolgozo_id = public.aktualis_dolgozo_id())
)
with check (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
  or (public.dolgozo_e() and dolgozo_id = public.aktualis_dolgozo_id())
);

-- OKTATÁSI ANYAGOK

drop policy if exists oktatasi_anyagok_select on public.oktatasi_anyagok;
create policy oktatasi_anyagok_select on public.oktatasi_anyagok
for select using (
  public.szuperadmin_e()
  or public.ceg_hozzaferes_van(ceg_id)
  or (ceg_id is null and auth.role() = 'authenticated')
);

drop policy if exists oktatasi_anyagok_mod on public.oktatasi_anyagok;
create policy oktatasi_anyagok_mod on public.oktatasi_anyagok
for all using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
)
with check (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
);

-- OKTATÁSI TELJESÍTÉSEK

drop policy if exists oktatasi_teljesitesek_select on public.oktatasi_teljesitesek;
create policy oktatasi_teljesitesek_select on public.oktatasi_teljesitesek
for select using (
  public.sajat_profil_e(profil_id)
  or public.dolgozo_hozzaferes_van(dolgozo_id)
  or public.szuperadmin_e()
  or public.ceg_admin_e()
);

drop policy if exists oktatasi_teljesitesek_mod on public.oktatasi_teljesitesek;
create policy oktatasi_teljesitesek_mod on public.oktatasi_teljesitesek
for all using (
  public.sajat_profil_e(profil_id)
  or public.szuperadmin_e()
  or public.ceg_admin_e()
  or (public.terulet_vezeto_e() and dolgozo_id = public.aktualis_dolgozo_id())
)
with check (
  public.sajat_profil_e(profil_id)
  or public.szuperadmin_e()
  or public.ceg_admin_e()
  or public.terulet_vezeto_e()
);

-- DOKUMENTUMOK

drop policy if exists dokumentumok_select on public.dokumentumok;
create policy dokumentumok_select on public.dokumentumok
for select using (
  public.szuperadmin_e()
  or public.ceg_hozzaferes_van(ceg_id)
  or (terulet_id is not null and terulet_id = public.aktualis_terulet_id())
);

drop policy if exists dokumentumok_mod on public.dokumentumok;
create policy dokumentumok_mod on public.dokumentumok
for all using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
)
with check (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
);

-- DOLGOZÓ DOKUMENTUMOK

drop policy if exists dolgozo_dokumentumok_select on public.dolgozo_dokumentumok;
create policy dolgozo_dokumentumok_select on public.dolgozo_dokumentumok
for select using (public.dolgozo_hozzaferes_van(dolgozo_id));

drop policy if exists dolgozo_dokumentumok_mod on public.dolgozo_dokumentumok;
create policy dolgozo_dokumentumok_mod on public.dolgozo_dokumentumok
for all using (
  public.dolgozo_hozzaferes_van(dolgozo_id)
  or public.szuperadmin_e()
)
with check (
  public.dolgozo_hozzaferes_van(dolgozo_id)
  or public.szuperadmin_e()
);

-- DOKUMENTUM ELFOGADÁSOK

drop policy if exists dokumentum_elfogadasok_select on public.dokumentum_elfogadasok;
create policy dokumentum_elfogadasok_select on public.dokumentum_elfogadasok
for select using (
  public.sajat_profil_e(profil_id)
  or public.dolgozo_hozzaferes_van(dolgozo_id)
  or public.szuperadmin_e()
  or public.ceg_admin_e()
);

drop policy if exists dokumentum_elfogadasok_mod on public.dokumentum_elfogadasok;
create policy dokumentum_elfogadasok_mod on public.dokumentum_elfogadasok
for all using (
  public.sajat_profil_e(profil_id)
  or public.szuperadmin_e()
  or public.ceg_admin_e()
  or public.terulet_vezeto_e()
)
with check (
  public.sajat_profil_e(profil_id)
  or public.szuperadmin_e()
  or public.ceg_admin_e()
  or public.terulet_vezeto_e()
);

-- ESEMÉNYEK

drop policy if exists esemenyek_select on public.esemenyek;
create policy esemenyek_select on public.esemenyek
for select using (
  public.szuperadmin_e()
  or public.ceg_hozzaferes_van(ceg_id)
  or (dolgozo_id is not null and public.dolgozo_hozzaferes_van(dolgozo_id))
);

drop policy if exists esemenyek_mod on public.esemenyek;
create policy esemenyek_mod on public.esemenyek
for all using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
)
with check (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
);

-- ÉRTESÍTÉSEK

drop policy if exists ertesitesek_select on public.ertesitesek;
create policy ertesitesek_select on public.ertesitesek
for select using (
  public.szuperadmin_e()
  or (profil_id is not null and public.sajat_profil_e(profil_id))
  or (ceg_id is not null and public.ceg_hozzaferes_van(ceg_id))
  or (terulet_id is not null and terulet_id = public.aktualis_terulet_id())
);

drop policy if exists ertesitesek_mod on public.ertesitesek;
create policy ertesitesek_mod on public.ertesitesek
for all using (
  public.szuperadmin_e()
  or (profil_id is not null and public.sajat_profil_e(profil_id))
  or (ceg_id is not null and public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (terulet_id is not null and public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
)
with check (
  public.szuperadmin_e()
  or (profil_id is not null and public.sajat_profil_e(profil_id))
  or (ceg_id is not null and public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (terulet_id is not null and public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
);

-- RENDSZER NAPLÓK

drop policy if exists rendszer_naplok_select on public.rendszer_naplok;
create policy rendszer_naplok_select on public.rendszer_naplok
for select using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
);

drop policy if exists rendszer_naplok_insert on public.rendszer_naplok;
create policy rendszer_naplok_insert on public.rendszer_naplok
for insert with check (
  auth.role() = 'authenticated'
);
