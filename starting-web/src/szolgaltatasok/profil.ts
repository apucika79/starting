// Ez a fájl a belépett felhasználóhoz tartozó profil- és szervezeti rekordok lekérdezését kezeli.
import { supabase } from '@/szolgaltatasok/supabase';
import type { ProfilAdat } from '@/tipusok/profil';

type ProfilSor = {
  id: string;
  teljes_nev: string;
  email: string;
  telefonszam: string | null;
  szerepkor: ProfilAdat['szerepkor'];
  statusz: ProfilAdat['statusz'];
  cegek: {
    id: string;
    nev: string;
    domain: string | null;
  } | null;
  telephelyek: {
    id: string;
    nev: string;
    cim: string | null;
  } | null;
  teruletek: {
    id: string;
    nev: string;
  } | null;
};

export async function profilBetoltese(felhasznaloAzonosito: string) {
  const valasz = await supabase
    .from('profilok')
    .select(
      `
        id,
        teljes_nev,
        email,
        telefonszam,
        szerepkor,
        statusz,
        cegek:ceg_id ( id, nev, domain ),
        telephelyek:telephely_id ( id, nev, cim ),
        teruletek:terulet_id ( id, nev )
      `,
    )
    .eq('id', felhasznaloAzonosito)
    .returns<ProfilSor | null>()
    .maybeSingle();

  if (valasz.error || !valasz.data) {
    return valasz;
  }

  return {
    ...valasz,
    data: atalakitProfilAdatta(valasz.data),
  };
}

function atalakitProfilAdatta(sor: ProfilSor): ProfilAdat {
  return {
    id: sor.id,
    teljes_nev: sor.teljes_nev,
    email: sor.email,
    telefonszam: sor.telefonszam,
    szerepkor: sor.szerepkor,
    statusz: sor.statusz,
    ceg: sor.cegek,
    telephely: sor.telephelyek,
    terulet: sor.teruletek,
  };
}
