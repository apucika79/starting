-- Ez a fájl a Starting fejlesztői mintaadatainak induló készletét tartalmazza.
insert into public.cegek (
  id,
  nev,
  domain,
  adoszam,
  kapcsolattarto_nev,
  kapcsolattarto_email,
  telefon,
  cim,
  logo_url,
  elofizetesi_csomag
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Starting Mintacég',
    'starting.hu',
    '12345678-1-42',
    'Minta Admin',
    'admin@starting.hu',
    '+36 30 123 4567',
    '1111 Budapest, Minta utca 1.',
    'https://cdn.starting.hu/logok/mintaceg.png',
    'proba'
  )
on conflict (id) do nothing;

insert into public.napi_statuszok (id, kod, megnevezes, szin)
values
  ('22222222-2222-2222-2222-222222222221', 'munkaban', 'Munkában', '#0f766e'),
  ('22222222-2222-2222-2222-222222222222', 'szunet', 'Szünet', '#d97706'),
  ('22222222-2222-2222-2222-222222222223', 'hianyzik', 'Hiányzik', '#dc2626')
on conflict (id) do nothing;
