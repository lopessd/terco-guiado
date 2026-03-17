"use client";

import { CheckCircle2 } from "lucide-react";
import { MYSTERIES, type MysteryKey } from "@/data/mysteries";
import { THEMES } from "@/data/themes";

interface MysterySelectorProps {
  selectedKey: MysteryKey;
  onSelect: (key: MysteryKey) => void;
}

export function MysterySelector({ selectedKey, onSelect }: MysterySelectorProps) {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-6 mb-8 border border-slate-100/50">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Mistério de Hoje
      </h2>
      <div className="space-y-3">
        {Object.values(MYSTERIES).map((m) => {
          const isSelected = selectedKey === m.id;
          const mTheme = THEMES[m.id];
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between border border-transparent ${
                isSelected
                  ? `${mTheme.primaryBg} text-white shadow-md transform scale-[1.02]`
                  : "bg-white/60 text-slate-600 hover:bg-white hover:border-slate-200"
              }`}
            >
              <div>
                <div className="font-medium">{m.name}</div>
                <div className={`text-xs ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                  {m.days}
                </div>
              </div>
              {isSelected && <CheckCircle2 size={20} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
