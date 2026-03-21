"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

interface RosaryNode {
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
// O gap entre uma pequena e uma grande é `largeGapMultiplier` vezes o gap entre duas pequenas
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

  // Gap i = espaço entre bead i e bead (i+1) % count
  // Se qualquer dos dois é grande, o gap tem peso multiplicado
  const gapWeights: number[] = [];
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    const touchesLarge = largeSet.has(i) || largeSet.has(next);
    gapWeights.push(touchesLarge ? largeGapMultiplier : 1);
  }

  const totalWeight = gapWeights.reduce((a, b) => a + b, 0);

  // Posição acumulada — cada bead fica posicionada após a soma dos gaps anteriores
  // Bead 0 fica no comprimento 0
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

function generateNodes(config: Config): RosaryNode[] {
  const nodes: RosaryNode[] = [];

  // Cauda
  const tailTop = config.centerpieceY;
  const tailBottom = tailTop + config.tailLength;
  const crossY = tailBottom;
  const largeY = tailBottom - config.crossToLargeGap;
  const gloriaY = tailTop + config.gloriaToCenterpieceGap;

  // Posições das 3 Ave Marias distribuídas entre large e gloria
  const aveSpaceStart = largeY - config.largeToFirstAveGap;
  const aveSpaceEnd = gloriaY + config.lastAveToGloriaGap;
  const aveSpacing = (aveSpaceStart - aveSpaceEnd) / 2;

  nodes.push({ id: 0, cx: 50, cy: crossY, type: "cross" });
  nodes.push({ id: 1, cx: 50, cy: largeY, type: "large" });
  nodes.push({ id: 2, cx: 50, cy: aveSpaceStart, type: "small" });
  nodes.push({ id: 3, cx: 50, cy: aveSpaceStart - aveSpacing, type: "small" });
  nodes.push({ id: 4, cx: 50, cy: aveSpaceEnd, type: "small" });
  nodes.push({ id: 5, cx: 50, cy: gloriaY, type: "large" });
  nodes.push({ id: 6, cx: 50, cy: tailTop, type: "centerpiece" });

  // Loop com distribuição ponderada
  const largeIndices = [10, 21, 32, 43];
  const startAngleRad = (config.startAngleDeg * Math.PI) / 180;
  const points = distributeOnEllipseWeighted(
    50, config.ellipseCy, config.ellipseRx, config.ellipseRy,
    54, startAngleRad, config.gapFraction,
    largeIndices, config.largeGapMultiplier
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

interface Config {
  // Ellipse
  ellipseCy: number;
  ellipseRx: number;
  ellipseRy: number;
  gapFraction: number;
  largeGapMultiplier: number;
  // Tail
  centerpieceY: number;
  tailLength: number;
  crossToLargeGap: number;
  largeToFirstAveGap: number;
  lastAveToGloriaGap: number;
  gloriaToCenterpieceGap: number;
  // Beads
  smallRadius: number;
  largeRadius: number;
  centerpieceRadius: number;
  // Angulação
  startAngleDeg: number;
}

const DEFAULT_CONFIG: Config = {
  ellipseCy: 49,
  ellipseRx: 30,
  ellipseRy: 37.5,
  gapFraction: 0.021,
  largeGapMultiplier: 2,
  centerpieceY: 86,
  tailLength: 47,
  crossToLargeGap: 12,
  largeToFirstAveGap: 6,
  lastAveToGloriaGap: 7,
  gloriaToCenterpieceGap: 8,
  smallRadius: 0.9,
  largeRadius: 1.8,
  centerpieceRadius: 3,
  startAngleDeg: 90,
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-sm font-mono w-52 shrink-0 text-white/80">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1"
      />
      <span className="text-sm font-mono w-14 text-right text-yellow-300">{value}</span>
    </div>
  );
}

export default function AjustePage() {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(6);

  useEffect(() => setMounted(true), []);

  const update = useCallback((key: keyof Config, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const nodes = useMemo(() => generateNodes(config), [config]);

  const loopNodes = nodes.filter((n) => n.id >= 7);
  const firstLoop = loopNodes[0]; // bead mais perto do gap, lado direito (sentido horário)
  const lastLoop = loopNodes[loopNodes.length - 1]; // bead mais perto do gap, lado esquerdo
  const loopPath = `M ${firstLoop.cx},${firstLoop.cy} ${loopNodes
    .slice(1)
    .map((n) => `L ${n.cx},${n.cy}`)
    .join(" ")} Z`;

  // Cordão da cauda (cruz até medalha)
  const tailPath = `M 50 ${nodes[0].cy} L 50 ${nodes[6].cy}`;

  // Conectores medalha → beads da abertura do loop
  // firstLoop fica à direita, lastLoop fica à esquerda
  const connectorRight = `M 50,${nodes[6].cy} L ${firstLoop.cx},${firstLoop.cy}`;
  const connectorLeft = `M 50,${nodes[6].cy} L ${lastLoop.cx},${lastLoop.cy}`;

  const viewBoxBottom = nodes[0].cy + 15;

  const configText = JSON.stringify(config, null, 2);

  const copyConfig = () => {
    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRadius = (type: string) => {
    if (type === "large") return config.largeRadius;
    if (type === "small") return config.smallRadius;
    if (type === "centerpiece") return config.centerpieceRadius;
    return 0;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#0F2340] flex items-center justify-center text-white">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0F2340] flex">
      {/* Painel de controles */}
      <div className="w-[420px] shrink-0 bg-[#0a1a30] p-4 overflow-y-auto h-screen border-r border-white/10">
        <h2 className="text-lg font-bold text-yellow-300 mb-4">Ajuste do Terço</h2>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-yellow-200/70 mb-2 uppercase tracking-wider">Elipse (Loop)</h3>
          <Slider label="Centro Y" value={config.ellipseCy} min={20} max={70} step={1} onChange={(v) => update("ellipseCy", v)} />
          <Slider label="Raio X (largura)" value={config.ellipseRx} min={15} max={40} step={0.5} onChange={(v) => update("ellipseRx", v)} />
          <Slider label="Raio Y (altura)" value={config.ellipseRy} min={20} max={50} step={0.5} onChange={(v) => update("ellipseRy", v)} />
          <Slider label="Gap (abertura)" value={config.gapFraction} min={0.01} max={0.08} step={0.001} onChange={(v) => update("gapFraction", v)} />
          <Slider label="Espaço grande (mult)" value={config.largeGapMultiplier} min={1} max={4} step={0.1} onChange={(v) => update("largeGapMultiplier", v)} />
          <Slider label="Angulação (graus)" value={config.startAngleDeg} min={0} max={360} step={1} onChange={(v) => update("startAngleDeg", v)} />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-yellow-200/70 mb-2 uppercase tracking-wider">Cauda</h3>
          <Slider label="Medalha Y" value={config.centerpieceY} min={75} max={95} step={1} onChange={(v) => update("centerpieceY", v)} />
          <Slider label="Comprimento cauda" value={config.tailLength} min={30} max={70} step={1} onChange={(v) => update("tailLength", v)} />
          <Slider label="Cruz → Pai Nosso" value={config.crossToLargeGap} min={5} max={20} step={0.5} onChange={(v) => update("crossToLargeGap", v)} />
          <Slider label="Pai Nosso → 1ª Ave" value={config.largeToFirstAveGap} min={3} max={15} step={0.5} onChange={(v) => update("largeToFirstAveGap", v)} />
          <Slider label="3ª Ave → Glória" value={config.lastAveToGloriaGap} min={3} max={15} step={0.5} onChange={(v) => update("lastAveToGloriaGap", v)} />
          <Slider label="Glória → Medalha" value={config.gloriaToCenterpieceGap} min={3} max={20} step={0.5} onChange={(v) => update("gloriaToCenterpieceGap", v)} />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-yellow-200/70 mb-2 uppercase tracking-wider">Tamanho das Contas</h3>
          <Slider label="Pequena (raio)" value={config.smallRadius} min={0.5} max={2.5} step={0.1} onChange={(v) => update("smallRadius", v)} />
          <Slider label="Grande (raio)" value={config.largeRadius} min={1.5} max={4} step={0.1} onChange={(v) => update("largeRadius", v)} />
          <Slider label="Medalha (raio)" value={config.centerpieceRadius} min={2} max={6} step={0.1} onChange={(v) => update("centerpieceRadius", v)} />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-yellow-200/70 mb-2 uppercase tracking-wider">Simular conta ativa</h3>
          <Slider label="Node ativo (ID)" value={activeNodeId} min={0} max={60} step={1} onChange={(v) => setActiveNodeId(v)} />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-yellow-200/70 mb-2 uppercase tracking-wider">Configuração</h3>
          <pre className="text-xs text-white/60 bg-black/30 rounded p-2 mb-2 overflow-x-auto">{configText}</pre>
          <button
            onClick={copyConfig}
            className="w-full py-2 rounded bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-sm transition-colors"
          >
            {copied ? "Copiado!" : "Copiar Configuração"}
          </button>
          <button
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="w-full py-2 mt-2 rounded bg-white/10 hover:bg-white/20 text-white/70 font-bold text-sm transition-colors"
          >
            Resetar para padrão
          </button>
        </div>
      </div>

      {/* Preview do terço */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <svg viewBox={`10 0 80 ${viewBoxBottom + 5}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="bead-inactive" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#4A6FA5" />
                <stop offset="40%" stopColor="#2A4A7F" />
                <stop offset="100%" stopColor="#0F2340" />
              </radialGradient>
              <radialGradient id="bead-completed" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#E8C86A" />
                <stop offset="40%" stopColor="#C4962E" />
                <stop offset="100%" stopColor="#8B6914" />
              </radialGradient>
              <radialGradient id="bead-active" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF3C4" />
                <stop offset="30%" stopColor="#F5D56A" />
                <stop offset="70%" stopColor="#D4AD4A" />
                <stop offset="100%" stopColor="#A67B1E" />
              </radialGradient>
              <radialGradient id="glow-active" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D4AD4A" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D4AD4A" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="bead-highlight" cx="30%" cy="25%" r="30%">
                <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <filter id="bead-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0.3" dy="0.5" stdDeviation="0.4" floodColor="#000" floodOpacity="0.35" />
              </filter>
              <filter id="glow-filter" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Cordão da cauda */}
            <path d={tailPath} stroke="#8B7355" strokeWidth="0.5" fill="none" opacity="0.7" />

            {/* Conectores medalha → loop */}
            <path d={connectorLeft} stroke="#8B7355" strokeWidth="0.5" fill="none" opacity="0.7" />
            <path d={connectorRight} stroke="#8B7355" strokeWidth="0.5" fill="none" opacity="0.7" />

            {/* Cordão do loop */}
            <path d={loopPath} stroke="#8B7355" strokeWidth="0.5" fill="none" opacity="0.7" />

            {/* Nodes */}
            {nodes.map((node) => {
              const isActive = node.id === activeNodeId;
              const isCompleted = node.id < activeNodeId;
              const gradientId = isActive ? "bead-active" : isCompleted ? "bead-completed" : "bead-inactive";

              if (node.type === "cross") {
                const crossFill = isActive ? "url(#bead-active)" : isCompleted ? "url(#bead-completed)" : "#8B7355";
                const crossStroke = isActive ? "#D4AD4A" : isCompleted ? "#A67B1E" : "#6B5B3E";
                return (
                  <g key={node.id} filter="url(#bead-shadow)">
                    {isActive && <circle cx={node.cx} cy={node.cy} r="9" fill="url(#glow-active)" filter="url(#glow-filter)" />}
                    <rect x={node.cx - 1} y={node.cy - 7} width="2" height="14" rx="0.5" fill={crossFill} stroke={crossStroke} strokeWidth="0.3" />
                    <rect x={node.cx - 4.5} y={node.cy - 3.5} width="9" height="2" rx="0.5" fill={crossFill} stroke={crossStroke} strokeWidth="0.3" />
                    <circle cx={node.cx} cy={node.cy - 6} r="0.6" fill={crossStroke} opacity="0.5" />
                    <circle cx={node.cx} cy={node.cy + 6} r="0.6" fill={crossStroke} opacity="0.5" />
                    <circle cx={node.cx - 3.5} cy={node.cy - 2.5} r="0.6" fill={crossStroke} opacity="0.5" />
                    <circle cx={node.cx + 3.5} cy={node.cy - 2.5} r="0.6" fill={crossStroke} opacity="0.5" />
                    <text x={node.cx} y={node.cy + 12} textAnchor="middle" fontSize="2.5" fill="white" opacity="0.4">{node.id}</text>
                  </g>
                );
              }

              if (node.type === "centerpiece") {
                const r = config.centerpieceRadius;
                return (
                  <g key={node.id} filter="url(#bead-shadow)">
                    {isActive && <circle cx={node.cx} cy={node.cy} r={r * 2.5} fill="url(#glow-active)" filter="url(#glow-filter)" />}
                    <circle cx={node.cx} cy={node.cy} r={r} fill={`url(#${gradientId})`} stroke={isActive ? "#D4AD4A" : isCompleted ? "#A67B1E" : "#4A6FA5"} strokeWidth="0.5" />
                    <circle cx={node.cx} cy={node.cy} r={r - 1} fill="none" stroke={isActive || isCompleted ? "#FFF3C4" : "#6B8FC4"} strokeWidth="0.3" opacity="0.4" />
                    <line x1={node.cx} y1={node.cy - 1.5} x2={node.cx} y2={node.cy + 1.5} stroke={isActive || isCompleted ? "#FFF3C4" : "#8BADD4"} strokeWidth="0.5" opacity="0.6" />
                    <line x1={node.cx - 1.2} y1={node.cy - 0.5} x2={node.cx + 1.2} y2={node.cy - 0.5} stroke={isActive || isCompleted ? "#FFF3C4" : "#8BADD4"} strokeWidth="0.5" opacity="0.6" />
                    <circle cx={node.cx - 0.8} cy={node.cy - 1} r={r * 0.4} fill="url(#bead-highlight)" />
                    <text x={node.cx + r + 2} y={node.cy + 1} fontSize="2.5" fill="white" opacity="0.4">{node.id}</text>
                  </g>
                );
              }

              const r = getRadius(node.type);
              return (
                <g key={node.id} filter="url(#bead-shadow)">
                  {isActive && <circle cx={node.cx} cy={node.cy} r={r * 3} fill="url(#glow-active)" filter="url(#glow-filter)" />}
                  <circle cx={node.cx} cy={node.cy} r={r} fill={`url(#${gradientId})`} stroke={isActive ? "#D4AD4A44" : "rgba(0,0,0,0.15)"} strokeWidth="0.2" />
                  <circle cx={node.cx - r * 0.25} cy={node.cy - r * 0.3} r={r * 0.45} fill="url(#bead-highlight)" />
                  {node.type === "large" && (
                    <text x={node.cx} y={node.cy + r + 3} textAnchor="middle" fontSize="2" fill="yellow" opacity="0.5">{node.id}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
