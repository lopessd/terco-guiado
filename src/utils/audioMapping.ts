import type { RosaryStep } from "@/utils/rosarySteps";
import type { MysteryKey } from "@/data/mysteries";

const PRAYER_AUDIO_MAP: Record<string, string> = {
  "Oferecimento do Terço": "/audio/oracoes/divino-jesus.mp3",
  "Creio em Deus Pai": "/audio/oracoes/creio.mp3",
  "Pai Nosso": "/audio/oracoes/pai-nosso.mp3",
  "Glória ao Pai": "/audio/oracoes/gloria.mp3",
  "Ó meu Jesus": "/audio/oracoes/o-meu-jesus.mp3",
  "Agradecimento do Terço": "/audio/oracoes/agradecimento.mp3",
  "Salve Rainha": "/audio/oracoes/salve-rainha.mp3",
};

const ORDINAL_MAP: Record<number, string> = {
  1: "primeiro",
  2: "segundo",
  3: "terceiro",
  4: "quarto",
  5: "quinto",
};

const BEAD_AVE_MAP: Record<number, string> = {
  0: "/audio/oracoes/primeira-ave.mp3",
  1: "/audio/oracoes/segunda-ave.mp3",
  2: "/audio/oracoes/terceira-ave.mp3",
};

export function getAudioPath(
  step: RosaryStep,
  beadCount: number,
  mysteryKey: MysteryKey,
): string {
  if (step.type === "meditation") {
    const match = step.title.match(/^(\d+)º/);
    const index = match ? parseInt(match[1]) : 1;
    return `/audio/misterios/${mysteryKey}/${ORDINAL_MAP[index]}-misterio.mp3`;
  }

  if (step.type === "beads") {
    if (step.beadIds.length === 3) {
      return BEAD_AVE_MAP[beadCount] ?? "/audio/oracoes/ave-maria.mp3";
    }
    return "/audio/oracoes/ave-maria.mp3";
  }

  return PRAYER_AUDIO_MAP[step.title] ?? "/audio/oracoes/pai-nosso.mp3";
}
