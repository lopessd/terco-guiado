"use client";

interface PauseIndicatorProps {
  isWaiting: boolean;
}

export function PauseIndicator({ isWaiting }: PauseIndicatorProps) {
  return (
    <div
      className={`mt-6 mx-auto transition-opacity duration-300 ${
        isWaiting ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="bg-slate-950/40 text-white backdrop-blur px-4 py-2 rounded-full text-sm tracking-widest uppercase flex items-center gap-2 shadow-inner border border-white/10">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        Momento de Pausa...
      </span>
    </div>
  );
}
