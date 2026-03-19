import { supabase } from '@/szolgaltatasok/supabase';
import type { MeghivoAdat } from '@/tipusok/meghivo';

export type RecoveryAllapot = {
  aktiv: boolean;
  hibaUzenet: string;
};

type MeghivasosRegisztracioAdat = {
  email: string;
  jelszo: string;
  teljesNev: string;
  meghivoToken: string;
  meghivo: MeghivoAdat;
};

function keresesiParameterekBetoltese() {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;

  return {
    keres: new URLSearchParams(window.location.search),
    hash: new URLSearchParams(hash),
  };
}

export function recoveryAllapotAzUrlbol(): RecoveryAllapot {
  const { keres, hash } = keresesiParameterekBetoltese();
  const recoveryTipus = hash.get('type') ?? keres.get('type');
  const hibaLeiras = hash.get('error_description') ?? keres.get('error_description') ?? '';

  return {
    aktiv: recoveryTipus === 'recovery',
    hibaUzenet: hibaLeiras ? decodeURIComponent(hibaLeiras.replace(/\+/g, ' ')) : '',
  };
}

export function authParameterekAzUrlbol() {
  const { keres } = keresesiParameterekBetoltese();

  return {
    email: keres.get('email') ?? '',
    meghivoToken: keres.get('token') ?? '',
  };
}

export function torliAuthVisszateroParametereket() {
  const ujUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, document.title, ujUrl);
}

export async function belepesEmailJelszoval(email: string, jelszo: string) {
  return supabase.auth.signInWithPassword({
    email,
    password: jelszo,
  });
}

export async function meghivasosRegisztracio({
  email,
  jelszo,
  teljesNev,
  meghivoToken,
  meghivo,
}: MeghivasosRegisztracioAdat) {
  return supabase.auth.signUp({
    email,
    password: jelszo,
    options: {
      emailRedirectTo: `${window.location.origin}/belepes`,
      data: {
        teljes_nev: teljesNev,
        meghivo_token: meghivoToken,
        szerepkor: meghivo.szerepkor,
        ceg_id: meghivo.cegId,
        ceg_nev: meghivo.cegNev,
      },
    },
  });
}

export async function jelszoVisszaallitasKerese(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/belepes`,
  });
}

export async function jelszoFrissitese(ujJelszo: string) {
  return supabase.auth.updateUser({
    password: ujJelszo,
  });
}

export async function kilepes() {
  return supabase.auth.signOut();
}

export async function aktualisMunkamenet() {
  return supabase.auth.getSession();
}
