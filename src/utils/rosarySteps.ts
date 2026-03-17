import { PRAYERS } from "@/data/prayers";
import { MYSTERIES, type MysteryKey } from "@/data/mysteries";

export interface RosaryStepBase {
  title: string;
  text: string;
  pause: number;
  mysteryImage?: string;
  mysteryTitle?: string;
}

export interface PrayerStep extends RosaryStepBase {
  type: "prayer";
  activeId: number;
}

export interface BeadsStep extends RosaryStepBase {
  type: "beads";
  beadIds: number[];
  subtitle?: string;
}

export interface MeditationStep extends RosaryStepBase {
  type: "meditation";
  activeId: number;
  image: string;
  theme: string;
}

export type RosaryStep = PrayerStep | BeadsStep | MeditationStep;

export function buildRosarySteps(mysteryKey: MysteryKey): RosaryStep[] {
  const mysteryData = MYSTERIES[mysteryKey];
  const steps: RosaryStep[] = [];

  // 1 – Oferecimento do Terço
  steps.push({
    type: "prayer",
    title: "Oferecimento do Terço",
    text: PRAYERS.oferecimento,
    activeId: 0,
    pause: 2000,
  });

  // 3 – Creio (no crucifixo)
  steps.push({
    type: "prayer",
    title: "Creio em Deus Pai",
    text: PRAYERS.credo,
    activeId: 0,
    pause: 1000,
  });

  // 4 – Primeiro Pai Nosso (primeira conta grande)
  steps.push({
    type: "prayer",
    title: "Pai Nosso",
    text: PRAYERS.paiNosso,
    activeId: 1,
    pause: 2000,
  });

  // 5 – 3 Ave Marias (contas pequenas iniciais)
  steps.push({
    type: "beads",
    title: "3 Ave Marias",
    text: PRAYERS.aveMaria,
    beadIds: [2, 3, 4],
    pause: 1000,
  });

  // 6 – Glória ao Pai + Ó meu Jesus
  steps.push({
    type: "prayer",
    title: "Glória ao Pai",
    text: PRAYERS.gloria,
    activeId: 5,
    pause: 1000,
  });

  steps.push({
    type: "prayer",
    title: "Ó meu Jesus",
    text: PRAYERS.oMeuJesus,
    activeId: 5,
    pause: 1000,
  });

  // 7 – 5 dezenas do Terço
  let loopId = 7;
  mysteryData.mysteries.forEach((mystery, index) => {
    const largeBeadId = loopId;
    const smallBeadIds = Array.from({ length: 10 }, (_, i) => loopId + 1 + i);

    // Campos compartilhados por todos os passos desta dezena
    const decadeCommon = {
      mysteryImage: mystery.image,
      mysteryTitle: `${index + 1}º Mistério: ${mystery.title}`,
    };

    // Meditação do mistério
    steps.push({
      type: "meditation",
      title: `${index + 1}º Mistério: ${mystery.title}`,
      text: mystery.meditation,
      image: mystery.image,
      theme: mysteryData.theme,
      activeId: index === 0 ? 6 : largeBeadId,
      pause: 3000,
      ...decadeCommon,
    });

    // Pai Nosso (conta grande)
    steps.push({
      type: "prayer",
      title: "Pai Nosso",
      text: PRAYERS.paiNosso,
      activeId: largeBeadId,
      pause: 2000,
      ...decadeCommon,
    });

    // 10 Ave Marias (contas pequenas)
    steps.push({
      type: "beads",
      title: "10 Ave Marias",
      subtitle: `${index + 1}º Mistério: ${mystery.title}`,
      text: PRAYERS.aveMaria,
      beadIds: smallBeadIds,
      pause: 1000,
      ...decadeCommon,
    });

    // Glória ao Pai (ao final de cada dezena)
    steps.push({
      type: "prayer",
      title: "Glória ao Pai",
      text: PRAYERS.gloria,
      activeId: smallBeadIds[9],
      pause: 1000,
      ...decadeCommon,
    });

    // Ó meu Jesus
    steps.push({
      type: "prayer",
      title: "Ó meu Jesus",
      text: PRAYERS.oMeuJesus,
      activeId: smallBeadIds[9],
      pause: 1000,
      ...decadeCommon,
    });

    loopId += 11;
  });

  // 8 – Agradecimento
  steps.push({
    type: "prayer",
    title: "Agradecimento do Terço",
    text: PRAYERS.agradecimento,
    activeId: 6,
    pause: 1000,
  });

  // 9 – Salve Rainha
  steps.push({
    type: "prayer",
    title: "Salve Rainha",
    text: PRAYERS.salveRainha,
    activeId: 6,
    pause: 2000,
  });

  return steps;
}
