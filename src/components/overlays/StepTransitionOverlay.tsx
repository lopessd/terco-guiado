"use client";

import type { TransitionData } from "@/hooks/useRosaryNavigation";

interface StepTransitionOverlayProps {
  transition: TransitionData | null;
}

export function StepTransitionOverlay({ transition }: StepTransitionOverlayProps) {
  if (!transition) return null;

  // Transição de mistério: fundo + imagem do mistério por cima
  if (transition.background) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Imagem de fundo do cenário */}
        <img
          src={transition.background}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-dark/40" />

        {/* Imagem do mistério centralizada por cima */}
        {transition.mysteryImage && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={transition.mysteryImage}
              alt={transition.title}
              className="w-[calc(100%+30%)] max-w-none md:w-full md:max-w-2xl h-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-mystery-zoom"
            />
          </div>
        )}

        {/* Gradiente para o texto embaixo */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-navy-dark/30" />

        {/* Título do mistério */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-[8vh]">
          <div className="text-center px-6 animate-mystery-text-in">
            <div className="w-12 h-0.5 bg-gold/60 mx-auto mb-4 rounded-full" />
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gold-light leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] px-4 tracking-wide">
              {transition.title}
            </h2>
            <div className="w-12 h-0.5 bg-gold/60 mx-auto mt-4 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Transição simples para orações
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/95 backdrop-blur-md text-cream">
      <div className="text-center animate-fadeInUp">
        <div className="w-16 h-1 bg-gold mx-auto mb-6 rounded-full opacity-50" />
        <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-wide text-gold-light drop-shadow-2xl px-4 text-center">
          {transition.title}
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mt-6 rounded-full opacity-50" />
      </div>
    </div>
  );
}
