-- Ez a fájl a Starting induló Row Level Security szabályait készíti elő.
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

create or replace function public.aktualis_szerepkor()
returns public.felhasznaloi_szerepkor
language sql
stable
as $$
  select szerepkor from public.profilok where id = auth.uid()
$$;

create or replace function public.aktualis_ceg_id()
returns uuid
language sql
stable
as $$
  select ceg_id from public.profilok where id = auth.uid()
$$;

create or replace function public.aktualis_terulet_id()
returns uuid
language sql
stable
as $$
  select terulet_id from public.profilok where id = auth.uid()
$$;

create or replace function public.szuperadmin_e()
returns boolean
language sql
stable
as $$
  select public.aktualis_szerepkor() = 'szuperadmin'
$$;

create or replace function public.ceg_hozzaferes_van(ceg_azonosito uuid)
returns boolean
language sql
stable
as $$
  select
    public.szuperadmin_e()
    or (
      public.aktualis_szerepkor() in ('ceg_admin', 'terulet_vezeto', 'dolgozo')
      and ceg_azonosito = public.aktualis_ceg_id()
    )
$$;

create or replace function public.terulet_hozzaferes_van(terulet_azonosito uuid)
returns boolean
language sql
stable
as $$
  select
    public.szuperadmin_e()
    or public.aktualis_szerepkor() = 'ceg_admin'
    or (
      public.aktualis_szerepkor() = 'terulet_vezeto'
      and terulet_azonosito = public.aktualis_terulet_id()
    )
    or (
      public.aktualis_szerepkor() = 'dolgozo'
      and terulet_azonosito = public.aktualis_terulet_id()
    )
$$;

create or replace function public.ervenyes_meghivo_ellenorzese(meghivo_token text, meghivott_email text)
returns table (
  id uuid,
  email text,
  szerepkor public.felhasznaloi_szerepkor,
  ceg_id uuid,
  ceg_nev text,
  lejarat timestamp with time zone
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
    and m.elfogadva = false
    and m.statusz = 'fuggoben'
    and m.lejarat > now()
  limit 1
$$;

grant execute on function public.ervenyes_meghivo_ellenorzese(text, text) to anon, authenticated;

drop policy if exists "szuperadmin minden ceget lat" on public.cegek;
create policy "szuperadmin minden ceget lat"
on public.cegek
for select
using (public.szuperadmin_e());

drop policy if exists "sajat ceg elerheto" on public.cegek;
create policy "sajat ceg elerheto"
on public.cegek
for select
using (public.ceg_hozzaferes_van(id));

drop policy if exists "sajat ceg telephelyei" on public.telephelyek;
create policy "sajat ceg telephelyei"
on public.telephelyek
for select
using (public.ceg_hozzaferes_van(ceg_id));

drop policy if exists "sajat ceg teruletei" on public.teruletek;
create policy "sajat ceg teruletei"
on public.teruletek
for select
using (
  exists (
    select 1
    from public.telephelyek t
    where t.id = telephely_id
      and public.ceg_hozzaferes_van(t.ceg_id)
  )
);

drop policy if exists "profil olvashato sajat szervezetben" on public.profilok;
create policy "profil olvashato sajat szervezetben"
on public.profilok
for select
using (
  public.szuperadmin_e()
  or id = auth.uid()
  or (
    public.aktualis_szerepkor() = 'ceg_admin'
    and ceg_id = public.aktualis_ceg_id()
  )
  or (
    public.aktualis_szerepkor() = 'terulet_vezeto'
    and terulet_id = public.aktualis_terulet_id()
  )
);

drop policy if exists "dolgozo olvashato sajat szervezetben" on public.dolgozok;
create policy "dolgozo olvashato sajat szervezetben"
on public.dolgozok
for select
using (
  public.ceg_hozzaferes_van(ceg_id)
  and (
    public.aktualis_szerepkor() in ('szuperadmin', 'ceg_admin')
    or profil_id = auth.uid()
    or terulet_id = public.aktualis_terulet_id()
  )
);

drop policy if exists "meghivo ceg adminnak lathato" on public.meghivok;
create policy "meghivo ceg adminnak lathato"
on public.meghivok
for select
using (
  public.szuperadmin_e()
  or (
    public.aktualis_szerepkor() = 'ceg_admin'
    and ceg_id = public.aktualis_ceg_id()
  )
);

drop policy if exists "napi statusz minden bejelentkezettnek" on public.napi_statuszok;
create policy "napi statusz minden bejelentkezettnek"
on public.napi_statuszok
for select
using (auth.role() = 'authenticated');

drop policy if exists "jelenleti naplo sajat cegben" on public.jelenleti_naplok;
create policy "jelenleti naplo sajat cegben"
on public.jelenleti_naplok
for select
using (
  public.ceg_hozzaferes_van(ceg_id)
  and (
    public.aktualis_szerepkor() in ('szuperadmin', 'ceg_admin')
    or dolgozo_id in (select d.id from public.dolgozok d where d.profil_id = auth.uid())
    or terulet_id = public.aktualis_terulet_id()
  )
);

drop policy if exists "oktatasi anyag sajat cegben" on public.oktatasi_anyagok;
create policy "oktatasi anyag sajat cegben"
on public.oktatasi_anyagok
for select
using (
  ceg_id is null
  or public.ceg_hozzaferes_van(ceg_id)
);

drop policy if exists "oktatasi teljesites sajat profilhoz vagy ceghez" on public.oktatasi_teljesitesek;
create policy "oktatasi teljesites sajat profilhoz vagy ceghez"
on public.oktatasi_teljesitesek
for select
using (
  profil_id = auth.uid()
  or exists (
    select 1
    from public.profilok p
    where p.id = oktatasi_teljesitesek.profil_id
      and public.ceg_hozzaferes_van(p.ceg_id)
      and (
        public.aktualis_szerepkor() in ('szuperadmin', 'ceg_admin')
        or p.terulet_id = public.aktualis_terulet_id()
      )
  )
);

drop policy if exists "dokumentum sajat cegben" on public.dokumentumok;
create policy "dokumentum sajat cegben"
on public.dokumentumok
for select
using (
  ceg_id is null
  or public.ceg_hozzaferes_van(ceg_id)
);

drop policy if exists "dolgozo dokumentum sajat cegben" on public.dolgozo_dokumentumok;
create policy "dolgozo dokumentum sajat cegben"
on public.dolgozo_dokumentumok
for select
using (
  public.ceg_hozzaferes_van(ceg_id)
  and (
    public.aktualis_szerepkor() in ('szuperadmin', 'ceg_admin')
    or dolgozo_id in (select d.id from public.dolgozok d where d.profil_id = auth.uid())
  )
);

drop policy if exists "dokumentum elfogadas sajat profilhoz vagy ceghez" on public.dokumentum_elfogadasok;
create policy "dokumentum elfogadas sajat profilhoz vagy ceghez"
on public.dokumentum_elfogadasok
for select
using (
  profil_id = auth.uid()
  or exists (
    select 1
    from public.profilok p
    where p.id = dokumentum_elfogadasok.profil_id
      and public.ceg_hozzaferes_van(p.ceg_id)
      and (
        public.aktualis_szerepkor() in ('szuperadmin', 'ceg_admin')
        or p.terulet_id = public.aktualis_terulet_id()
      )
  )
);

drop policy if exists "esemeny sajat cegben" on public.esemenyek;
create policy "esemeny sajat cegben"
on public.esemenyek
for select
using (
  public.ceg_hozzaferes_van(ceg_id)
  and (
    public.aktualis_szerepkor() in ('szuperadmin', 'ceg_admin')
    or (public.aktualis_szerepkor() = 'terulet_vezeto' and terulet_id = public.aktualis_terulet_id())
    or (public.aktualis_szerepkor() = 'dolgozo' and admin_lathato = false and dolgozo_id in (select d.id from public.dolgozok d where d.profil_id = auth.uid()))
  )
);

drop policy if exists "ertesites sajat vagy admin listabol" on public.ertesitesek;
create policy "ertesites sajat vagy admin listabol"
on public.ertesitesek
for select
using (
  public.szuperadmin_e()
  or profil_id = auth.uid()
  or (
    public.aktualis_szerepkor() = 'ceg_admin'
    and ceg_id = public.aktualis_ceg_id()
    and admin_listaban_megjelenik = true
  )
  or (
    public.aktualis_szerepkor() = 'terulet_vezeto'
    and terulet_id = public.aktualis_terulet_id()
    and cel in ('terulet_vezeto', 'globalis_admin')
  )
);

drop policy if exists "rendszer naplo csak adminnak" on public.rendszer_naplok;
create policy "rendszer naplo csak adminnak"
on public.rendszer_naplok
for select
using (
  public.szuperadmin_e()
  or (
    public.aktualis_szerepkor() = 'ceg_admin'
    and public.ceg_hozzaferes_van(ceg_id)
  )
);
