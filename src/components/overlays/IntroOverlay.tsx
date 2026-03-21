"use client";

interface IntroOverlayProps {
  introState: "idle" | "playing" | "fading" | "done";
}

export function IntroOverlay({ introState }: IntroOverlayProps) {
  if (introState === "idle" || introState === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-dark text-cream transition-opacity duration-1000 ${
        introState === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center animate-pulse">
        <div className="w-1.5 h-32 bg-gradient-to-b from-gold-light via-gold to-gold-dark rounded-full shadow-[0_0_30px_rgba(196,150,46,0.6)]" />
        <div className="w-20 h-1.5 bg-gradient-to-r from-gold-light via-gold to-gold-dark rounded-full shadow-[0_0_30px_rgba(196,150,46,0.6)] absolute top-8" />
      </div>
      <div className="mt-16 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 tracking-wide animate-fade-in-up text-gold-light">
          Faça o Sinal da Cruz
        </h2>
        <p className="text-xl md:text-2xl text-cream/80 italic font-serif leading-relaxed animate-fade-in-up delay-300">
          Em nome do Pai,
          <br /> do Filho
          <br /> e do Espírito Santo.
        </p>
        <p className="text-lg text-gold/50 mt-8 uppercase tracking-[0.3em] animate-fade-in-up delay-700 font-serif font-bold">
          Amém.
        </p>
      </div>
    </div>
  );
}
