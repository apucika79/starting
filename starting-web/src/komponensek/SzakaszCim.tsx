// Ez a fájl egységes szakaszcímet ad a Starting nyilvános oldal tartalmi blokkjaihoz.
type SzakaszCimTulajdonsagok = {
  felirat: string;
  cim: string;
  leiras: string;
};

export function SzakaszCim({ felirat, cim, leiras }: SzakaszCimTulajdonsagok) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-starting-primerVilagos">{felirat}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{cim}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{leiras}</p>
    </div>
  );
}
