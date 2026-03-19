// Ez a fájl a Starting márkajelvényt jeleníti meg a landing oldalon és későbbi navigációkban.
type MarkaJelvenyTulajdonsagok = {
  vilagos?: boolean;
};

export function MarkaJelveny({ vilagos = false }: MarkaJelvenyTulajdonsagok) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur ${
        vilagos ? 'border border-starting-keret/80 bg-white text-starting-sotet shadow-sm' : 'border border-white/10 bg-white/5'
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-starting-primer to-starting-kiemelt text-lg font-bold text-white">
        S
      </div>
      <div>
        <p className={`text-sm font-semibold tracking-[0.3em] ${vilagos ? 'text-starting-sotet' : 'text-starting-hamvas/70'}`}>STARTING</p>
        <p className={`text-xs ${vilagos ? 'text-slate-600' : 'text-starting-hamvas/80'}`}>digitális munkakezdési rendszer</p>
      </div>
    </div>
  );
}
