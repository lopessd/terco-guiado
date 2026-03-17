"use client";

import type { TransitionData } from "@/hooks/useRosaryNavigation";

interface StepTransitionOverlayProps {
  transition: TransitionData | null;
}

export function StepTransitionOverlay({ transition }: StepTransitionOverlayProps) {
  if (!transition) return null;

  // Transição com imagem do mistério (fullscreen zoom)
  if (transition.image) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Imagem com zoom */}
        <img
          src={transition.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-mystery-zoom"
        />
        {/* Gradiente escuro por cima */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

        {/* Texto do mistério */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-[20vh]">
          <div className="text-center px-6 animate-mystery-text-in">
            <div className="w-12 h-0.5 bg-amber-400/60 mx-auto mb-5 rounded-full" />
            <h2 className="text-3xl md:text-5xl font-serif font-light text-white leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] px-4">
              {transition.title}
            </h2>
            <div className="w-12 h-0.5 bg-amber-400/60 mx-auto mt-5 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Transição simples para orações
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md text-white">
      <div className="text-center animate-fadeInUp">
        <div className="w-16 h-1 bg-amber-500 mx-auto mb-6 rounded-full opacity-50" />
        <h2 className="text-4xl md:text-5xl font-serif font-light tracking-widest text-amber-400 drop-shadow-2xl px-4 text-center">
          {transition.title}
        </h2>
        <div className="w-16 h-1 bg-amber-500 mx-auto mt-6 rounded-full opacity-50" />
      </div>
    </div>
  );
}
