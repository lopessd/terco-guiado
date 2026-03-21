"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import type { ThemeConfig } from "@/data/themes";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";

interface FinishedViewProps {
  theme: ThemeConfig;
  onRestart: () => void;
}

export function FinishedView({ theme, onRestart }: FinishedViewProps) {
  return (
    <BackgroundWrapper theme={theme}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-navy/20 p-8 text-center border border-gold/20">
          <div className="mb-6 flex justify-center text-gold animate-bounce">
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-navy mb-4 tracking-wide">
            Terço Concluído!
          </h2>
          <p className="text-navy/60 mb-8 leading-relaxed font-sans">
            Que a Virgem Maria interceda por si e que esta meditação fortaleça a sua fé.
          </p>
          <button
            onClick={onRestart}
            className="w-full bg-navy hover:bg-navy-light text-gold-light font-serif font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 tracking-wide"
          >
            <RotateCcw size={20} /> Voltar ao Início
          </button>

          {/* Créditos */}
          <div className="mt-6 pt-5 border-t border-gold/15 text-sm text-navy/40 font-sans">
            <p>
              Feito com dedicação por{" "}
              <span className="font-semibold text-navy/60">Davi Lopes</span>
              {" "}&mdash;{" "}
              <span className="italic">dev ao cubo</span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a
                href="https://wa.me/5533991269004"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-navy/30 hover:text-navy/60 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/davi.slopess/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-navy/30 hover:text-navy/60 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
