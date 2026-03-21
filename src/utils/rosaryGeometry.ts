export interface RosaryNode {
  id: number;
  cx: number;
  cy: number;
  type: "cross" | "large" | "small" | "centerpiece";
}

// Calcula comprimento de arco da elipse e retorna interpolador
function buildEllipseArcTable(
  rx: number, ry: number, startAngle: number, endAngle: number, samples: number
) {
  const arcLengths: number[] = [0];
  const angles: number[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angle = startAngle + t * (endAngle - startAngle);
    angles.push(angle);

    if (i > 0) {
      const prevAngle = angles[i - 1];
      const dx = rx * (Math.cos(angle) - Math.cos(prevAngle));
      const dy = ry * (Math.sin(angle) - Math.sin(prevAngle));
      arcLengths.push(arcLengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
  }

  const totalLength = arcLengths[arcLengths.length - 1];

  function pointAtLength(targetLength: number) {
    let lo = 0;
    let hi = samples;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arcLengths[mid] < targetLength) lo = mid + 1;
      else hi = mid;
    }
    const idx = Math.max(1, lo);
    const segLen = arcLengths[idx] - arcLengths[idx - 1];
    const frac = segLen > 0 ? (targetLength - arcLengths[idx - 1]) / segLen : 0;
    return angles[idx - 1] + frac * (angles[idx] - angles[idx - 1]);
  }

  return { totalLength, pointAtLength };
}

// Distribui beads com espaçamento ponderado ao redor das contas grandes
function distributeOnEllipseWeighted(
  cxCenter: number,
  cyCenter: number,
  rx: number,
  ry: number,
  count: number,
  startAngle: number,
  gapFraction: number,
  largeIndices: number[],
  largeGapMultiplier: number
): { cx: number; cy: number }[] {
  const samples = 2000;
  const angleStart = startAngle - gapFraction * Math.PI * 2;
  const angleEnd = startAngle - (1 - gapFraction) * Math.PI * 2;

  const { totalLength, pointAtLength } = buildEllipseArcTable(rx, ry, angleStart, angleEnd, samples);

  const largeSet = new Set(largeIndices);

  const gapWeights: number[] = [];
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    const touchesLarge = largeSet.has(i) || largeSet.has(next);
    gapWeights.push(touchesLarge ? largeGapMultiplier : 1);
  }

  const totalWeight = gapWeights.reduce((a, b) => a + b, 0);

  const cumLengths: number[] = [0];
  for (let i = 0; i < count - 1; i++) {
    const gapLength = (gapWeights[i] / totalWeight) * totalLength;
    cumLengths.push(cumLengths[i] + gapLength);
  }

  const points: { cx: number; cy: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = pointAtLength(cumLengths[i]);
    points.push({
      cx: cxCenter + rx * Math.cos(angle),
      cy: cyCenter + ry * Math.sin(angle),
    });
  }

  return points;
}

export function generateRosaryNodes(): RosaryNode[] {
  const nodes: RosaryNode[] = [];

  // ── Config ──
  const centerpieceY = 85;
  const tailLength = 47;
  const crossToLargeGap = 17;
  const largeToFirstAveGap = 7;
  const lastAveToGloriaGap = 5;
  const gloriaToCenterpieceGap = 10;

  // ── Cauda ──
  const tailBottom = centerpieceY + tailLength;
  const crossY = tailBottom;
  const largeY = tailBottom - crossToLargeGap;
  const gloriaY = centerpieceY + gloriaToCenterpieceGap;

  const aveSpaceStart = largeY - largeToFirstAveGap;
  const aveSpaceEnd = gloriaY + lastAveToGloriaGap;
  const aveSpacing = (aveSpaceStart - aveSpaceEnd) / 2;

  nodes.push({ id: 0, cx: 50, cy: crossY, type: "cross" });
  nodes.push({ id: 1, cx: 50, cy: largeY, type: "large" });
  nodes.push({ id: 2, cx: 50, cy: aveSpaceStart, type: "small" });
  nodes.push({ id: 3, cx: 50, cy: aveSpaceStart - aveSpacing, type: "small" });
  nodes.push({ id: 4, cx: 50, cy: aveSpaceEnd, type: "small" });
  nodes.push({ id: 5, cx: 50, cy: gloriaY, type: "large" });
  nodes.push({ id: 6, cx: 50, cy: centerpieceY, type: "centerpiece" });

  // ── Loop oval: 54 contas (50 small + 4 large) ──
  const largeIndices = [10, 21, 32, 43];
  const startAngleRad = (87 * Math.PI) / 180;
  const points = distributeOnEllipseWeighted(
    50, 48, 27, 36, 54, startAngleRad, 0.021,
    largeIndices, 1.8
  );

  for (let i = 0; i < 54; i++) {
    const isLarge = (i === 10 || i === 21 || i === 32 || i === 43);
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
const crossNode = ROSARY_NODES[0];
const centerpieceNode = ROSARY_NODES[6];
export const TAIL_PATH = `M 50 ${crossNode.cy} L 50 ${centerpieceNode.cy}`;

// Conectores medalha → loop
const loopNodes = ROSARY_NODES.filter((n) => n.id >= 7);
const firstLoop = loopNodes[0];
const lastLoop = loopNodes[loopNodes.length - 1];
export const CONNECTOR_RIGHT = `M 50,${centerpieceNode.cy} L ${firstLoop.cx},${firstLoop.cy}`;
export const CONNECTOR_LEFT = `M 50,${centerpieceNode.cy} L ${lastLoop.cx},${lastLoop.cy}`;

// Caminho do loop
export const LOOP_PATH = `M ${firstLoop.cx},${firstLoop.cy} ${loopNodes
  .slice(1)
  .map((n) => `L ${n.cx},${n.cy}`)
  .join(" ")} Z`;
