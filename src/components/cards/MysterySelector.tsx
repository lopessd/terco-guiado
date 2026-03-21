"use client";

import { CheckCircle2 } from "lucide-react";
import { MYSTERIES, type MysteryKey } from "@/data/mysteries";

interface MysterySelectorProps {
  selectedKey: MysteryKey;
  onSelect: (key: MysteryKey) => void;
}

export function MysterySelector({ selectedKey, onSelect }: MysterySelectorProps) {
  return (
    <div className="bg-cream-dark/80 rounded-2xl p-4 mb-5 border border-gold/15">
      <h2 className="text-xs font-semibold text-navy/50 uppercase tracking-[0.2em] mb-3 font-sans">
        Mistério de Hoje
      </h2>
      <div className="space-y-2">
        {Object.values(MYSTERIES).map((m) => {
          const isSelected = selectedKey === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between border ${
                isSelected
                  ? "bg-navy text-gold-light shadow-md transform scale-[1.02] border-gold/30"
                  : "bg-white/60 text-navy hover:bg-white hover:border-gold/20 border-transparent"
              }`}
            >
              <div>
                <div className="font-serif font-bold text-base tracking-wide">
                  {m.name}
                </div>
                <div className={`text-xs font-sans ${isSelected ? "text-white/70" : "text-navy/40"}`}>
                  {m.days}
                </div>
              </div>
              {isSelected && <CheckCircle2 size={20} className="text-gold" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
