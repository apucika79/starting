import { supabase } from '@/szolgaltatasok/supabase';

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

export async function kilepes() {
  return supabase.auth.signOut();
}

export async function aktualisMunkamenet() {
  return supabase.auth.getSession();
}
