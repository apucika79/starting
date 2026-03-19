import { supabase } from '@/szolgaltatasok/supabase';

export type RecoveryAllapot = {
  aktiv: boolean;
  hibaUzenet: string;
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
