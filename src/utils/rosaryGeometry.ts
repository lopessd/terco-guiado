export interface RosaryNode {
  id: number;
  cx: number;
  cy: number;
  type: "cross" | "large" | "small" | "centerpiece";
}

export function generateRosaryNodes(): RosaryNode[] {
  const nodes: RosaryNode[] = [];

  // Cauda: cruz → pai nosso → 3 aves → glória → medalha
  nodes.push({ id: 0, cx: 50, cy: 138, type: "cross" });
  nodes.push({ id: 1, cx: 50, cy: 127, type: "large" });
  nodes.push({ id: 2, cx: 50, cy: 120, type: "small" });
  nodes.push({ id: 3, cx: 50, cy: 113, type: "small" });
  nodes.push({ id: 4, cx: 50, cy: 106, type: "small" });
  nodes.push({ id: 5, cx: 50, cy: 97, type: "large" });
  nodes.push({ id: 6, cx: 50, cy: 87, type: "centerpiece" });

  // Loop circular (quase redondo)
  const cxCenter = 50;
  const cyCenter = 50;
  const rx = 33;
  const ry = 34;

  // Começa de baixo (na medalha) e vai no sentido horário
  const startAngle = Math.PI / 2;
  const totalAngle = -(Math.PI * 2);

  // Gerar posições para gap na base (onde conecta na medalha)
  const gapFraction = 0.04; // pequeno gap embaixo

  for (let i = 0; i < 55; i++) {
    const t = (i + 0.5) / 55;
    const angle = startAngle + (gapFraction + t * (1 - 2 * gapFraction)) * totalAngle;
    const cx = cxCenter + rx * Math.cos(angle);
    const cy = cyCenter + ry * Math.sin(angle);
    const isLarge = i % 11 === 0;
    nodes.push({ id: 7 + i, cx, cy, type: isLarge ? "large" : "small" });
  }

  return nodes;
}

export const ROSARY_NODES = generateRosaryNodes();

// Caminho da cauda (cruz até medalha)
export const TAIL_PATH = "M 50 138 L 50 87";

// Caminho do loop (oval fechada)
const loopNodes = ROSARY_NODES.filter((n) => n.id >= 7);
export const LOOP_PATH = `M ${loopNodes[0].cx},${loopNodes[0].cy} ${loopNodes
  .slice(1)
  .map((n) => `L ${n.cx},${n.cy}`)
  .join(" ")} Z`;
