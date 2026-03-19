import type { Session } from '@supabase/supabase-js';

import { kilepes } from '@/szolgaltatasok/auth';

const teendok = [
  'Profil és szerepkör betöltése a belépés után.',
  'Meghívásos regisztráció véglegesítése token validációval.',
  'Jelszó-visszaállítási visszaérkező képernyő kialakítása.',
];

type FiokOldalTulajdonsagok = {
  session: Session;
};

export function FiokOldal({ session }: FiokOldalTulajdonsagok) {
  const email = session.user.email ?? 'ismeretlen felhasználó';

  const kezeliKilepest = async () => {
    await kilepes();
    window.location.href = '/belepes';
  };

  return (
    <main className="min-h-screen bg-halo px-6 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-kartya backdrop-blur sm:p-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">Belső felület</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Sikeres belépés a Starting rendszerbe.</h1>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Ez egy ideiglenes, védett webes oldal, amely igazolja, hogy a Supabase munkamenet létrejött, és a felhasználó elérte a
              belső felület első verzióját.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Vissza a főoldalra
          </button>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-starting-primer/20 bg-starting-primer/10 p-6">
            <p className="text-sm text-slate-300">Bejelentkezett felhasználó</p>
            <p className="mt-3 text-2xl font-semibold text-white">{email}</p>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              A következő iterációban ide kerülhet a szerepkör, cég, telephely és az első belépési kötelező lépések állapota.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-lg font-semibold text-white">Következő auth feladatok</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {teendok.map((teendo) => (
                <li key={teendo}>• {teendo}</li>
              ))}
            </ul>

            <button
              type="button"
              onClick={kezeliKilepest}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-starting-primer px-6 py-3.5 text-base font-semibold text-white transition hover:bg-starting-primerVilagos"
            >
              Kijelentkezés
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
