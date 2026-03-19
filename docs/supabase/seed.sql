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

insert into public.telephelyek (id, ceg_id, nev, cim)
values
  (
    '33333333-3333-3333-3333-333333333331',
    '11111111-1111-1111-1111-111111111111',
    'Budapest központ',
    '1111 Budapest, Minta utca 1.'
  ),
  (
    '33333333-3333-3333-3333-333333333332',
    '11111111-1111-1111-1111-111111111111',
    'Győr üzem',
    '9021 Győr, Ipari park 7.'
  )
on conflict (id) do nothing;

insert into public.teruletek (id, telephely_id, nev, leiras)
values
  (
    '44444444-4444-4444-4444-444444444441',
    '33333333-3333-3333-3333-333333333331',
    'Raktár',
    'Központi raktári működés'
  ),
  (
    '44444444-4444-4444-4444-444444444442',
    '33333333-3333-3333-3333-333333333331',
    'Iroda',
    'Adminisztratív és koordinációs terület'
  ),
  (
    '44444444-4444-4444-4444-444444444443',
    '33333333-3333-3333-3333-333333333332',
    'Gyártás',
    'Üzemi gyártóterület'
  )
on conflict (id) do nothing;

insert into public.napi_statuszok (id, kod, megnevezes, szin)
values
  ('22222222-2222-2222-2222-222222222221', 'munkaban', 'Munkában', '#0f766e'),
  ('22222222-2222-2222-2222-222222222222', 'keses', 'Késés', '#d97706'),
  ('22222222-2222-2222-2222-222222222223', 'hianyzik', 'Hiányzik', '#dc2626'),
  ('22222222-2222-2222-2222-222222222224', 'szabadsag', 'Szabadság', '#2563eb'),
  ('22222222-2222-2222-2222-222222222225', 'szunet', 'Szünet', '#7c3aed')
on conflict (id) do nothing;

insert into public.oktatasi_anyagok (
  id,
  ceg_id,
  terulet_id,
  cim,
  leiras,
  tipus,
  kategoria,
  fajl_url,
  kotelezo,
  ervenyes_tol,
  ervenyes_ig
)
values
  (
    '55555555-5555-5555-5555-555555555551',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444441',
    'Tűzvédelmi alapok 2026',
    'Kötelező éves tűzvédelmi oktatás.',
    'video',
    'munkavedelem',
    'https://cdn.starting.hu/oktatasok/tuzvedelem-2026.mp4',
    true,
    '2026-01-01',
    '2026-12-31'
  ),
  (
    '55555555-5555-5555-5555-555555555552',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444442',
    'Adatkezelési frissítő tréning',
    'Irodai dolgozóknak szóló adatkezelési ismétlő anyag.',
    'pdf',
    'compliance',
    'https://cdn.starting.hu/oktatasok/adatkezeles-2026.pdf',
    true,
    '2026-01-01',
    '2026-12-31'
  )
on conflict (id) do nothing;

insert into public.dokumentumok (
  id,
  ceg_id,
  terulet_id,
  cim,
  leiras,
  tipus,
  verzio,
  fajl_url,
  kotelezo,
  ervenyes_tol,
  ervenyes_ig
)
values
  (
    '66666666-6666-6666-6666-666666666661',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444442',
    'Adatkezelési tájékoztató',
    'Digitális elfogadást igénylő vállalati dokumentum.',
    'szabalyzat',
    'v2.1',
    'https://cdn.starting.hu/dokumentumok/adatkezeles-v2-1.pdf',
    true,
    '2026-01-01',
    '2026-12-31'
  ),
  (
    '66666666-6666-6666-6666-666666666662',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444443',
    'Munkavédelmi szabályzat 2026',
    'Gyártási területre vonatkozó munkavédelmi anyag.',
    'szabalyzat',
    'v1.0',
    'https://cdn.starting.hu/dokumentumok/munkavedelem-2026.pdf',
    true,
    '2026-01-01',
    '2026-12-31'
  )
on conflict (id) do nothing;

insert into public.ertesitesek (
  id,
  ceg_id,
  terulet_id,
  cel,
  cim,
  uzenet,
  tipus,
  prioritas,
  allapot,
  admin_listaban_megjelenik,
  kuldes_csatorna,
  push_elokeszitve
)
values
  (
    '77777777-7777-7777-7777-777777777771',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444441',
    'ceg_admin',
    'Rendszerüzenet: heti karbantartási ablak',
    'Szombaton 22:00 és 23:00 között rövid karbantartás várható.',
    'rendszeruzenet',
    'normal',
    'uj',
    true,
    'alkalmazason_belul',
    false
  ),
  (
    '77777777-7777-7777-7777-777777777772',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444441',
    'terulet_vezeto',
    'Hiányzó napi belépés figyelmeztetés',
    'A mai naphoz még nincs rögzített munkakezdés.',
    'hianyzo_napi_belepes',
    'kritikus',
    'uj',
    false,
    'push_elokeszitve',
    true
  )
on conflict (id) do nothing;
