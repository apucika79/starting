import { supabase } from '@/szolgaltatasok/supabase';
import type { MeghivoAdat } from '@/tipusok/meghivo';

type MeghivoEllenorzesValasz = {
  id: string;
  email: string;
  szerepkor: MeghivoAdat['szerepkor'];
  ceg_id: string;
  ceg_nev: string;
  lejarat: string;
};

export async function meghivoEllenorzese(token: string, email: string) {
  const valasz = await supabase.rpc('ervenyes_meghivo_ellenorzese', {
    meghivo_token: token,
    meghivott_email: email,
  });

  if (valasz.error || !Array.isArray(valasz.data) || !valasz.data[0]) {
    return {
      ...valasz,
      data: null,
    };
  }

  return {
    ...valasz,
    data: atalakitMeghivoAdatta(valasz.data[0] as MeghivoEllenorzesValasz),
  };
}

function atalakitMeghivoAdatta(sor: MeghivoEllenorzesValasz): MeghivoAdat {
  return {
    id: sor.id,
    email: sor.email,
    szerepkor: sor.szerepkor,
    cegId: sor.ceg_id,
    cegNev: sor.ceg_nev,
    lejarat: sor.lejarat,
  };
}
