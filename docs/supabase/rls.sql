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

create policy "szuperadmin minden ceget lat"
on public.cegek
for select
using (public.aktualis_szerepkor() = 'szuperadmin');

create policy "ceg admin sajat ceget lat"
on public.cegek
for select
using (
  public.aktualis_szerepkor() in ('szuperadmin', 'ceg_admin')
  and id = public.aktualis_ceg_id()
);

create policy "dolgozo sajat profiljat latja"
on public.profilok
for select
using (
  public.aktualis_szerepkor() = 'szuperadmin'
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

create policy "ertesites csak sajat"
on public.ertesitesek
for select
using (
  public.aktualis_szerepkor() = 'szuperadmin'
  or profil_id = auth.uid()
);
