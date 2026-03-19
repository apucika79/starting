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
  select d.id
  from public.dolgozok d
  where d.profil_id = auth.uid()
$$;

create or replace function public.szuperadmin_e()
returns boolean
language sql
stable
as $$
  select public.aktualis_szerepkor() = 'szuperadmin'
$$;

create or replace function public.ceg_admin_e()
returns boolean
language sql
stable
as $$
  select public.aktualis_szerepkor() = 'ceg_admin'
$$;

create or replace function public.terulet_vezeto_e()
returns boolean
language sql
stable
as $$
  select public.aktualis_szerepkor() = 'terulet_vezeto'
$$;

create or replace function public.dolgozo_e()
returns boolean
language sql
stable
as $$
  select public.aktualis_szerepkor() = 'dolgozo'
$$;

create or replace function public.ceg_hozzaferes_van(ceg_azonosito uuid)
returns boolean
language sql
stable
as $$
  select
    ceg_azonosito is not null
    and (
      public.szuperadmin_e()
      or (public.ceg_admin_e() and ceg_azonosito = public.aktualis_ceg_id())
      or (public.terulet_vezeto_e() and ceg_azonosito = public.aktualis_ceg_id())
      or (public.dolgozo_e() and ceg_azonosito = public.aktualis_ceg_id())
    )
$$;

create or replace function public.telephely_hozzaferes_van(telephely_azonosito uuid)
returns boolean
language sql
stable
as $$
  select
    telephely_azonosito is not null
    and (
      public.szuperadmin_e()
      or (public.ceg_admin_e() and exists (
        select 1
        from public.telephelyek t
        where t.id = telephely_azonosito
          and t.ceg_id = public.aktualis_ceg_id()
      ))
      or (public.terulet_vezeto_e() and telephely_azonosito = public.aktualis_telephely_id())
      or (public.dolgozo_e() and telephely_azonosito = public.aktualis_telephely_id())
    )
$$;

create or replace function public.terulet_hozzaferes_van(terulet_azonosito uuid)
returns boolean
language sql
stable
as $$
  select
    terulet_azonosito is not null
    and (
      public.szuperadmin_e()
      or (public.ceg_admin_e() and exists (
        select 1
        from public.teruletek tr
        join public.telephelyek tp on tp.id = tr.telephely_id
        where tr.id = terulet_azonosito
          and tp.ceg_id = public.aktualis_ceg_id()
      ))
      or (public.terulet_vezeto_e() and terulet_azonosito = public.aktualis_terulet_id())
      or (public.dolgozo_e() and terulet_azonosito = public.aktualis_terulet_id())
    )
$$;

create or replace function public.oktatasi_vagy_dokumentum_elerheto(ceg_azonosito uuid, terulet_azonosito uuid)
returns boolean
language sql
stable
as $$
  select
    public.szuperadmin_e()
    or (
      public.ceg_admin_e()
      and (
        ceg_azonosito is null
        or ceg_azonosito = public.aktualis_ceg_id()
      )
    )
    or (
      public.terulet_vezeto_e()
      and ceg_azonosito = public.aktualis_ceg_id()
      and (
        terulet_azonosito is null
        or terulet_azonosito = public.aktualis_terulet_id()
      )
    )
    or (
      public.dolgozo_e()
      and ceg_azonosito = public.aktualis_ceg_id()
      and (
        terulet_azonosito is null
        or terulet_azonosito = public.aktualis_terulet_id()
      )
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

drop policy if exists "ceg szint csak ceg adminnak vagy szuperadminnak" on public.cegek;
create policy "ceg szint csak ceg adminnak vagy szuperadminnak"
on public.cegek
for select
using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and id = public.aktualis_ceg_id())
);

drop policy if exists "telephely szint szerepkor szerint" on public.telephelyek;
create policy "telephely szint szerepkor szerint"
on public.telephelyek
for select
using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and id = public.aktualis_telephely_id())
  or (public.dolgozo_e() and id = public.aktualis_telephely_id())
);

drop policy if exists "terulet szint szerepkor szerint" on public.teruletek;
create policy "terulet szint szerepkor szerint"
on public.teruletek
for select
using (
  public.szuperadmin_e()
  or (
    public.ceg_admin_e()
    and exists (
      select 1
      from public.telephelyek tp
      where tp.id = telephely_id
        and tp.ceg_id = public.aktualis_ceg_id()
    )
  )
  or (public.terulet_vezeto_e() and id = public.aktualis_terulet_id())
  or (public.dolgozo_e() and id = public.aktualis_terulet_id())
);

drop policy if exists "profil olvashato szigoruan szerepkor szerint" on public.profilok;
create policy "profil olvashato szigoruan szerepkor szerint"
on public.profilok
for select
using (
  public.szuperadmin_e()
  or id = auth.uid()
  or (
    public.ceg_admin_e()
    and ceg_id = public.aktualis_ceg_id()
  )
  or (
    public.terulet_vezeto_e()
    and terulet_id = public.aktualis_terulet_id()
  )
);

drop policy if exists "dolgozo olvashato szigoruan szerepkor szerint" on public.dolgozok;
create policy "dolgozo olvashato szigoruan szerepkor szerint"
on public.dolgozok
for select
using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
  or profil_id = auth.uid()
);

drop policy if exists "meghivo olvashato szervezeti scope szerint" on public.meghivok;
create policy "meghivo olvashato szervezeti scope szerint"
on public.meghivok
for select
using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (
    public.terulet_vezeto_e()
    and terulet_id = public.aktualis_terulet_id()
    and ceg_id = public.aktualis_ceg_id()
  )
);

drop policy if exists "napi statusz minden bejelentkezettnek" on public.napi_statuszok;
create policy "napi statusz minden bejelentkezettnek"
on public.napi_statuszok
for select
using (auth.role() = 'authenticated');

drop policy if exists "jelenleti naplo olvashato szigoruan szerepkor szerint" on public.jelenleti_naplok;
create policy "jelenleti naplo olvashato szigoruan szerepkor szerint"
on public.jelenleti_naplok
for select
using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
  or dolgozo_id = public.aktualis_dolgozo_id()
);

drop policy if exists "oktatasi anyag olvashato szigoruan szerepkor szerint" on public.oktatasi_anyagok;
create policy "oktatasi anyag olvashato szigoruan szerepkor szerint"
on public.oktatasi_anyagok
for select
using (
  public.oktatasi_vagy_dokumentum_elerheto(ceg_id, terulet_id)
);

drop policy if exists "oktatasi teljesites olvashato szigoruan szerepkor szerint" on public.oktatasi_teljesitesek;
create policy "oktatasi teljesites olvashato szigoruan szerepkor szerint"
on public.oktatasi_teljesitesek
for select
using (
  public.szuperadmin_e()
  or profil_id = auth.uid()
  or exists (
    select 1
    from public.profilok p
    where p.id = oktatasi_teljesitesek.profil_id
      and (
        (public.ceg_admin_e() and p.ceg_id = public.aktualis_ceg_id())
        or (public.terulet_vezeto_e() and p.terulet_id = public.aktualis_terulet_id())
      )
  )
);

drop policy if exists "dokumentum olvashato szigoruan szerepkor szerint" on public.dokumentumok;
create policy "dokumentum olvashato szigoruan szerepkor szerint"
on public.dokumentumok
for select
using (
  public.oktatasi_vagy_dokumentum_elerheto(ceg_id, terulet_id)
);

drop policy if exists "dolgozo dokumentum olvashato szigoruan szerepkor szerint" on public.dolgozo_dokumentumok;
create policy "dolgozo dokumentum olvashato szigoruan szerepkor szerint"
on public.dolgozo_dokumentumok
for select
using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (
    public.terulet_vezeto_e()
    and exists (
      select 1
      from public.dolgozok d
      where d.id = dolgozo_dokumentumok.dolgozo_id
        and d.terulet_id = public.aktualis_terulet_id()
    )
  )
  or dolgozo_id = public.aktualis_dolgozo_id()
);

drop policy if exists "dokumentum elfogadas olvashato szigoruan szerepkor szerint" on public.dokumentum_elfogadasok;
create policy "dokumentum elfogadas olvashato szigoruan szerepkor szerint"
on public.dokumentum_elfogadasok
for select
using (
  public.szuperadmin_e()
  or profil_id = auth.uid()
  or exists (
    select 1
    from public.profilok p
    where p.id = dokumentum_elfogadasok.profil_id
      and (
        (public.ceg_admin_e() and p.ceg_id = public.aktualis_ceg_id())
        or (public.terulet_vezeto_e() and p.terulet_id = public.aktualis_terulet_id())
      )
  )
);

drop policy if exists "esemeny olvashato szigoruan szerepkor szerint" on public.esemenyek;
create policy "esemeny olvashato szigoruan szerepkor szerint"
on public.esemenyek
for select
using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
  or (public.terulet_vezeto_e() and terulet_id = public.aktualis_terulet_id())
  or (
    public.dolgozo_e()
    and dolgozo_id = public.aktualis_dolgozo_id()
    and admin_lathato = false
  )
);

drop policy if exists "ertesites olvashato szigoruan szerepkor szerint" on public.ertesitesek;
create policy "ertesites olvashato szigoruan szerepkor szerint"
on public.ertesitesek
for select
using (
  public.szuperadmin_e()
  or profil_id = auth.uid()
  or (
    public.ceg_admin_e()
    and ceg_id = public.aktualis_ceg_id()
    and admin_listaban_megjelenik = true
  )
  or (
    public.terulet_vezeto_e()
    and terulet_id = public.aktualis_terulet_id()
    and admin_listaban_megjelenik = true
  )
);

drop policy if exists "rendszer naplo csak megfelelo admin scopeban" on public.rendszer_naplok;
create policy "rendszer naplo csak megfelelo admin scopeban"
on public.rendszer_naplok
for select
using (
  public.szuperadmin_e()
  or (public.ceg_admin_e() and ceg_id = public.aktualis_ceg_id())
);
