// Ez a fájl a Starting márkajelvényt jeleníti meg a landing oldalon és későbbi navigációkban.
export function MarkaJelveny() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-starting-primer to-starting-kiemelt text-lg font-bold text-white">
        S
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.3em] text-starting-hamvas/70">STARTING</p>
        <p className="text-xs text-starting-hamvas/80">digitális munkakezdési rendszer</p>
      </div>
    </div>
  );
}
