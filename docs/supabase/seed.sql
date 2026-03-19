-- Starting / Supabase fejlesztői seed adatok
-- Ezeket az adatokat kizárólag fejlesztői vagy demo környezetben használd.

insert into public.cegek (
  id, nev, domain, adoszam, kapcsolattarto_nev, kapcsolattarto_email, telefon, cim, logo_url, elofizetesi_csomag
)
values
  ('11111111-1111-1111-1111-111111111111', 'Starting Mintacég', 'starting.hu', '12345678-1-42', 'Minta Admin', 'admin@starting.hu', '+36 30 123 4567', '1111 Budapest, Minta utca 1.', 'https://cdn.starting.hu/logok/mintaceg.png', 'proba'),
  ('11111111-1111-1111-1111-111111111112', 'Partner Logisztika Kft.', 'partnerlogisztika.hu', '87654321-2-13', 'Partner Admin', 'admin@partnerlogisztika.hu', '+36 20 555 0000', '8000 Székesfehérvár, Depó köz 2.', 'https://cdn.starting.hu/logok/partner.png', 'uzleti')
on conflict (id) do nothing;

insert into public.telephelyek (id, ceg_id, nev, cim)
values
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'Budapest központ', '1111 Budapest, Minta utca 1.'),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'Győr üzem', '9021 Győr, Ipari park 7.'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111112', 'Székesfehérvár depó', '8000 Székesfehérvár, Depó köz 2.')
on conflict (id) do nothing;

insert into public.teruletek (id, telephely_id, nev, leiras)
values
  ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 'Raktár', 'Központi raktári működés'),
  ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333331', 'Iroda', 'Adminisztratív és koordinációs terület'),
  ('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333332', 'Gyártás', 'Üzemi gyártóterület'),
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Kiszállítás', 'Logisztikai kiszállítási csapat')
on conflict (id) do nothing;

insert into public.profilok (
  id, ceg_id, telephely_id, terulet_id, teljes_nev, email, telefonszam, szerepkor, statusz, utolso_belepes_at
)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', 'Minta Cégadmin', 'admin@starting.hu', '+36 30 111 1111', 'ceg_admin', 'aktiv', now() - interval '1 hour'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 'Kovács Anna', 'anna.kovacs@starting.hu', '+36 30 222 2222', 'dolgozo', 'aktiv', now() - interval '3 hour'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', 'Szabó Gergely', 'gergely.szabo@starting.hu', '+36 30 333 3333', 'terulet_vezeto', 'aktiv', now() - interval '2 hour'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444443', 'Tóth Mária', 'maria.toth@starting.hu', '+36 30 444 4444', 'dolgozo', 'aktiv', now() - interval '5 hour'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '11111111-1111-1111-1111-111111111112', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Varga Levente', 'levente.varga@partnerlogisztika.hu', '+36 30 555 5555', 'ceg_admin', 'aktiv', now() - interval '4 hour')
on conflict (id) do nothing;

update public.teruletek
set vezeto_profil_id = case id
  when '44444444-4444-4444-4444-444444444442' then 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3'
  else vezeto_profil_id
end
where id in ('44444444-4444-4444-4444-444444444442');

insert into public.dolgozok (
  id, profil_id, ceg_id, telephely_id, terulet_id, pozicio, profilkep_url, foglalkoztatasi_statusz, munkaviszony_kezdete, statusz
)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', 'HR és operációs admin', 'https://cdn.starting.hu/profilok/admin.png', 'aktiv', '2025-01-01', 'aktiv'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 'Raktári operátor', 'https://cdn.starting.hu/profilok/anna.png', 'aktiv', '2025-09-01', 'aktiv'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', 'Irodai koordinátor', 'https://cdn.starting.hu/profilok/gergely.png', 'aktiv', '2024-11-15', 'aktiv'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444443', 'Gépsor kezelő', 'https://cdn.starting.hu/profilok/maria.png', 'beleptetes_alatt', '2026-03-01', 'aktiv'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '11111111-1111-1111-1111-111111111112', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Flottairányító', 'https://cdn.starting.hu/profilok/levente.png', 'aktiv', '2024-06-10', 'aktiv')
on conflict (profil_id) do nothing;

insert into public.meghivok (
  id, ceg_id, telephely_id, terulet_id, kuldo_profil_id, email, teljes_nev, telefonszam, pozicio, szerepkor, statusz, token, lejarat, elkuldve
)
values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'uj.dolgozo@starting.hu', 'Új Dolgozó', '+36 30 666 6666', 'Raktári operátor', 'dolgozo', 'fuggoben', 'INVITE-STARTING-001', now() + interval '7 day', now() - interval '1 day'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', '11111111-1111-1111-1111-111111111112', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'uj.partner@partnerlogisztika.hu', 'Partner Új Belépő', '+36 30 777 7777', 'Sofőr', 'dolgozo', 'fuggoben', 'INVITE-PARTNER-001', now() + interval '10 day', now() - interval '2 hour')
on conflict (id) do nothing;

insert into public.napi_statuszok (id, kod, megnevezes, szin)
values
  ('22222222-2222-2222-2222-222222222221', 'munkaban', 'Munkában', '#0f766e'),
  ('22222222-2222-2222-2222-222222222222', 'keses', 'Késés', '#d97706'),
  ('22222222-2222-2222-2222-222222222223', 'hianyzik', 'Hiányzik', '#dc2626'),
  ('22222222-2222-2222-2222-222222222224', 'szabadsag', 'Szabadság', '#2563eb'),
  ('22222222-2222-2222-2222-222222222225', 'szunet', 'Szünet', '#7c3aed')
on conflict (id) do nothing;

insert into public.jelenleti_naplok (
  id, dolgozo_id, ceg_id, telephely_id, terulet_id, napi_statusz_id, nap, munka_kezdete, munka_vege, helyadat, foto_url, megjegyzes
)
values
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222221', current_date, now() - interval '8 hour', now() - interval '5 minutes', '{"lat":47.4979,"lng":19.0402}'::jsonb, 'https://cdn.starting.hu/jelenlet/anna-20260319.jpg', 'Rendben lezárt műszak'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', current_date, now() - interval '7 hour 35 minutes', null, '{"lat":47.4979,"lng":19.0402}'::jsonb, null, 'Késői érkezés miatti admin megjegyzés'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222223', current_date - 1, now() - interval '1 day 8 hour', null, '{}'::jsonb, null, 'Igazolatlan hiányzás fejlesztői példához')
on conflict (id) do nothing;

insert into public.oktatasi_anyagok (
  id, ceg_id, terulet_id, cim, leiras, tipus, kategoria, fajl_url, kotelezo, letoltheto, ervenyes_tol, ervenyes_ig
)
values
  ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', 'Tűzvédelmi alapok 2026', 'Kötelező éves tűzvédelmi oktatás.', 'video', 'munkavedelem', 'https://cdn.starting.hu/oktatasok/tuzvedelem-2026.mp4', true, true, '2026-01-01', '2026-12-31'),
  ('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444442', 'Adatkezelési frissítő tréning', 'Irodai dolgozóknak szóló adatkezelési ismétlő anyag.', 'pdf', 'compliance', 'https://cdn.starting.hu/oktatasok/adatkezeles-2026.pdf', true, true, '2026-01-01', '2026-12-31'),
  ('55555555-5555-5555-5555-555555555553', '11111111-1111-1111-1111-111111111112', '44444444-4444-4444-4444-444444444444', 'Sofőr indulási protokoll', 'Partner céges opcionális képzési anyag.', 'video', 'logisztika', 'https://cdn.starting.hu/oktatasok/sofor-protokoll.mp4', false, true, '2026-01-01', '2026-12-31')
on conflict (id) do nothing;

insert into public.oktatasi_teljesitesek (
  id, oktatasi_anyag_id, profil_id, dolgozo_id, hatarido, megtekintve, megtekintve_at, elfogadva, elfogadas_ideje, teljesitesi_arany
)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', '55555555-5555-5555-5555-555555555551', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', current_date + 7, true, now() - interval '2 day', true, now() - interval '2 day', 100),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', '55555555-5555-5555-5555-555555555552', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', current_date + 3, true, now() - interval '1 day', false, null, 80),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', '55555555-5555-5555-5555-555555555553', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', current_date + 14, true, now() - interval '5 hour', true, now() - interval '5 hour', 100)
on conflict (id) do nothing;

insert into public.dokumentumok (
  id, ceg_id, terulet_id, cim, leiras, tipus, verzio, fajl_url, kotelezo, ervenyes_tol, ervenyes_ig
)
values
  ('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444442', 'Adatkezelési tájékoztató', 'Digitális elfogadást igénylő vállalati dokumentum.', 'szabalyzat', 'v2.1', 'https://cdn.starting.hu/dokumentumok/adatkezeles-v2-1.pdf', true, '2026-01-01', '2026-12-31'),
  ('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444443', 'Munkavédelmi szabályzat 2026', 'Gyártási területre vonatkozó munkavédelmi anyag.', 'szabalyzat', 'v1.0', 'https://cdn.starting.hu/dokumentumok/munkavedelem-2026.pdf', true, '2026-01-01', '2026-12-31'),
  ('66666666-6666-6666-6666-666666666663', '11111111-1111-1111-1111-111111111112', '44444444-4444-4444-4444-444444444444', 'Flottahasználati nyilatkozat', 'Partner logisztikai folyamatokhoz kötelező dokumentum.', 'nyilatkozat', 'v3.0', 'https://cdn.starting.hu/dokumentumok/flottahasznalat-v3.pdf', true, '2026-01-01', '2026-12-31')
on conflict (id) do nothing;

insert into public.dolgozo_dokumentumok (
  id, dolgozo_id, ceg_id, dokumentum_id, feltolto_profil_id, cim, dokumentum_tipus, fajl_url, megjegyzes, ervenyes_eddig
)
values
  ('ffffffff-ffff-ffff-ffff-fffffffffff1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Anna alkalmassági igazolása', 'alkalmassagi', 'https://cdn.starting.hu/dolgozo-dokumentumok/anna-alkalmassagi.pdf', 'Fejlesztői példa fájl', now() + interval '365 day'),
  ('ffffffff-ffff-ffff-ffff-fffffffffff2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666662', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Mária munkaruha átvételi lap', 'atveteli_lap', 'https://cdn.starting.hu/dolgozo-dokumentumok/maria-munkaruha.pdf', 'Beléptetési csomag része', now() + interval '180 day')
on conflict (id) do nothing;

insert into public.dokumentum_elfogadasok (
  id, dokumentum_id, profil_id, dolgozo_id, elfogadva, elfogadva_at, allapot, esedekes_datum, verzio
)
values
  ('12121212-1212-1212-1212-121212121211', '66666666-6666-6666-6666-666666666661', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', false, null, 'folyamatban', current_date + 3, 'v2.1'),
  ('12121212-1212-1212-1212-121212121212', '66666666-6666-6666-6666-666666666662', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', false, null, 'hianyzik', current_date + 1, 'v1.0'),
  ('12121212-1212-1212-1212-121212121213', '66666666-6666-6666-6666-666666666663', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', true, now() - interval '7 day', 'elfogadva', current_date - 7, 'v3.0')
on conflict (id) do nothing;

insert into public.esemenyek (
  id, ceg_id, telephely_id, terulet_id, dolgozo_id, rogzito_profil_id, kategoria, rovid_leiras, reszletes_leiras, csatolmany_url, admin_lathato, metaadat, esemeny_datum
)
values
  ('13131313-1313-1313-1313-131313131311', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'jelenlet', 'Műszakzárás rendben', 'A dolgozó időben lezárta a műszakot, eltérés nem volt.', null, true, '{"forras":"seed"}'::jsonb, now() - interval '6 hour'),
  ('13131313-1313-1313-1313-131313131312', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444443', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'hr', 'Beléptetési csomag hiányos', 'A dolgozó még nem fogadta el a munkavédelmi szabályzatot.', 'https://cdn.starting.hu/esemenyek/maria-hiany.pdf', true, '{"prioritas":"magas"}'::jsonb, now() - interval '1 day')
on conflict (id) do nothing;

insert into public.ertesitesek (
  id, profil_id, ceg_id, terulet_id, cel, cim, uzenet, tipus, prioritas, allapot, olvasott, olvasott_at, admin_listaban_megjelenik, akcio_url, akcio_cimke, forras_tipus, forras_azonosito, metaadat, kuldes_csatorna, push_elokeszitve, push_token, push_elokeszitve_at
)
values
  ('77777777-7777-7777-7777-777777777771', null, '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', 'ceg_admin', 'Rendszerüzenet: heti karbantartási ablak', 'Szombaton 22:00 és 23:00 között rövid karbantartás várható.', 'rendszeruzenet', 'normal', 'uj', false, null, true, '/fiok', 'Részletek', 'rendszer', null, '{"modul":"admin"}'::jsonb, 'alkalmazason_belul', false, null, null),
  ('77777777-7777-7777-7777-777777777772', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444443', 'profil', 'Hiányzó napi belépés figyelmeztetés', 'A mai naphoz még nincs rögzített munkakezdés.', 'hianyzo_napi_belepes', 'kritikus', 'uj', false, null, false, '/fiok', 'Belépés rögzítése', 'jelenlet', 'dddddddd-dddd-dddd-dddd-ddddddddddd3', '{"push":"elokeszitett"}'::jsonb, 'push_elokeszitve', true, 'expo-token-demo', now() - interval '10 minute'),
  ('77777777-7777-7777-7777-777777777773', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444442', 'profil', 'Kötelező dokumentum jóváhagyás vár', 'Az adatkezelési tájékoztató elfogadása még nem végleges.', 'admin_osszefoglalo', 'magas', 'kikuldve', false, null, true, '/fiok', 'Elfogadás megnyitása', 'dokumentum', '12121212-1212-1212-1212-121212121211', '{"riport":"hianyzo_elfogadas"}'::jsonb, 'email', false, null, null)
on conflict (id) do nothing;

insert into public.rendszer_naplok (
  id, profil_id, ceg_id, muvelet, entitas, entitas_azonosito, reszletek
)
values
  ('14141414-1414-1414-1414-141414141411', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'seed_insert', 'profilok', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '{"leiras":"Mintaprofil létrehozva fejlesztői seedből"}'::jsonb),
  ('14141414-1414-1414-1414-141414141412', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', 'seed_insert', 'dokumentum_elfogadasok', '12121212-1212-1212-1212-121212121212', '{"leiras":"Hiányzó elfogadás riport példája"}'::jsonb)
on conflict (id) do nothing;
