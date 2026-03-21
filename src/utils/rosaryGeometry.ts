export interface RosaryNode {
  id: number;
  cx: number;
  cy: number;
  type: "cross" | "large" | "small" | "centerpiece";
}

// Distribui pontos uniformemente ao longo de uma elipse por comprimento de arco
function distributeOnEllipse(
  cxCenter: number,
  cyCenter: number,
  rx: number,
  ry: number,
  count: number,
  startAngle: number,
  gapFraction: number
): { cx: number; cy: number }[] {
  // 1. Amostrar muitos pontos na elipse para calcular comprimento de arco
  const samples = 2000;
  const arcLengths: number[] = [0];
  const angles: number[] = [];

  const angleStart = startAngle - gapFraction * Math.PI * 2;
  const angleEnd = startAngle - (1 - gapFraction) * Math.PI * 2;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angle = angleStart + t * (angleEnd - angleStart);
    angles.push(angle);

    if (i > 0) {
      const prevAngle = angles[i - 1];
      const dx = rx * (Math.cos(angle) - Math.cos(prevAngle));
      const dy = ry * (Math.sin(angle) - Math.sin(prevAngle));
      arcLengths.push(arcLengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
  }

  const totalLength = arcLengths[arcLengths.length - 1];

  // 2. Para cada conta, encontrar o ângulo correspondente à distância uniforme
  const points: { cx: number; cy: number }[] = [];

  for (let i = 0; i < count; i++) {
    const targetLength = ((i + 0.5) / count) * totalLength;

    // Busca binária pelo sample mais próximo
    let lo = 0;
    let hi = samples;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arcLengths[mid] < targetLength) lo = mid + 1;
      else hi = mid;
    }

    // Interpolar entre lo-1 e lo
    const idx = Math.max(1, lo);
    const segLen = arcLengths[idx] - arcLengths[idx - 1];
    const frac = segLen > 0 ? (targetLength - arcLengths[idx - 1]) / segLen : 0;
    const angle = angles[idx - 1] + frac * (angles[idx] - angles[idx - 1]);

    points.push({
      cx: cxCenter + rx * Math.cos(angle),
      cy: cyCenter + ry * Math.sin(angle),
    });
  }

  return points;
}

export function generateRosaryNodes(): RosaryNode[] {
  const nodes: RosaryNode[] = [];

  // Cauda: cruz → pai nosso → 3 aves → glória → medalha
  nodes.push({ id: 0, cx: 50, cy: 142, type: "cross" });
  nodes.push({ id: 1, cx: 50, cy: 130, type: "large" });
  nodes.push({ id: 2, cx: 50, cy: 122, type: "small" });
  nodes.push({ id: 3, cx: 50, cy: 114, type: "small" });
  nodes.push({ id: 4, cx: 50, cy: 106, type: "small" });
  nodes.push({ id: 5, cx: 50, cy: 96, type: "large" });
  nodes.push({ id: 6, cx: 50, cy: 85, type: "centerpiece" });

  // Loop oval distribuído uniformemente por arco
  const points = distributeOnEllipse(50, 46, 28, 38, 55, Math.PI / 2, 0.035);

  for (let i = 0; i < 55; i++) {
    const isLarge = i % 11 === 0;
    nodes.push({
      id: 7 + i,
      cx: points[i].cx,
      cy: points[i].cy,
      type: isLarge ? "large" : "small",
    });
  }

  return nodes;
}

export const ROSARY_NODES = generateRosaryNodes();

// Caminho da cauda (cruz até medalha)
export const TAIL_PATH = "M 50 142 L 50 85";

// Caminho do loop (oval suave)
const loopNodes = ROSARY_NODES.filter((n) => n.id >= 7);
export const LOOP_PATH = `M ${loopNodes[0].cx},${loopNodes[0].cy} ${loopNodes
  .slice(1)
  .map((n) => `L ${n.cx},${n.cy}`)
  .join(" ")} Z`;
