"use client";

import type { MeditationStep } from "@/utils/rosarySteps";
import type { ThemeConfig } from "@/data/themes";

interface MeditationCardProps {
  step: MeditationStep;
  theme: ThemeConfig;
}

export function MeditationCard({ step }: MeditationCardProps) {
  return (
    <div className="animate-fadeIn space-y-6">
      {/* Imagem do mistério */}
      <div className="w-full aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl relative border border-gold/20">
        <img
          src={step.image}
          alt={step.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gold-light leading-tight drop-shadow-lg tracking-wide">
            {step.title}
          </h2>
        </div>
      </div>

      {/* Texto de meditação */}
      <div className="bg-cream/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl border border-gold/20">
        <div className="w-12 h-1 bg-gold opacity-50 mx-auto mb-5 rounded-full" />
        <p className="text-lg text-navy leading-relaxed text-center font-serif">
          {step.text}
        </p>
      </div>
    </div>
  );
}
