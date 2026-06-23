import { useMemo, useState } from "react";
import { treemap, hierarchy } from "d3-hierarchy";
import type { CountryData } from "../types";
import { getSection } from "../data/hsSection";

interface Props {
  data: CountryData;
  width: number;
  height: number;
}

function fmtVal(m: number) {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${m.toFixed(0)}M`;
}

// Lighten a hex color by mixing with white for the value sub-label
function lighten(hex: string, amount = 0.35): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((n >> 16) & 0xff) + (255 - ((n >> 16) & 0xff)) * amount);
  const g = Math.round(((n >> 8) & 0xff) + (255 - ((n >> 8) & 0xff)) * amount);
  const b = Math.round((n & 0xff) + (255 - (n & 0xff)) * amount);
  return `rgb(${r},${g},${b})`;
}

export function ExportTreemap({ data, width, height }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = useMemo(() => {
    const products = data.products.slice(0, 50);
    const root = hierarchy({ children: products } as any)
      .sum((d: any) => d.value ?? 0)
      .sort((a: { value?: number }, b: { value?: number }) => (b.value ?? 0) - (a.value ?? 0));

    const layout = treemap<any>()
      .size([width, height])
      .paddingInner(2)
      .paddingOuter(1)
      .round(true);

    layout(root);

    return (root.leaves() as any[]).map((leaf) => ({
      x0: leaf.x0, y0: leaf.y0, x1: leaf.x1, y1: leaf.y1,
      code: leaf.data.code,
      name: leaf.data.name,
      value: leaf.data.value,
      section: getSection(leaf.data.code),
    }));
  }, [data, width, height]);

  const hoveredNode = hovered ? nodes.find((n) => n.code === hovered) : null;

  return (
    <div className="relative" style={{ width }}>
      <svg width={width} height={height} className="rounded-lg overflow-hidden">
        {nodes.map((n) => {
          const w = n.x1 - n.x0;
          const h = n.y1 - n.y0;
          const isHovered = hovered === n.code;
          const valStr = fmtVal(n.value);

          // Thresholds for what text to show inside the square
          const nameFontSize = Math.min(13, Math.max(9, w / 9));
          const valFontSize  = Math.min(11, Math.max(8, w / 11));
          const showBoth  = w > 70  && h > 44;
          const showName  = w > 52  && h > 22 && !showBoth;
          const showValue = w > 42  && h > 28 && !showBoth && !showName;
          // centre-y for single line vs two lines
          const centerY = n.y0 + h / 2;
          const nameY   = showBoth ? n.y0 + h / 2 - nameFontSize * 0.7 : centerY;
          const valY    = showBoth ? n.y0 + h / 2 + valFontSize * 1.1  : centerY;

          return (
            <g key={n.code}
              onMouseEnter={() => setHovered(n.code)}
              onMouseLeave={() => setHovered(null)}
            >
              <rect
                x={n.x0} y={n.y0} width={w} height={h}
                fill={n.section.color}
                opacity={hovered && !isHovered ? 0.45 : 1}
                stroke={isHovered ? "#ffffff" : "rgba(0,0,0,0.25)"}
                strokeWidth={isHovered ? 2 : 0.5}
                style={{ cursor: "default", transition: "opacity 0.12s" }}
              />

              {/* Section name */}
              {(showBoth || showName) && (
                <text
                  x={n.x0 + w / 2} y={nameY}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.95)"
                  fontSize={nameFontSize} fontWeight="700"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {n.section.name}
                </text>
              )}

              {/* Value */}
              {(showBoth || showValue) && (
                <text
                  x={n.x0 + w / 2} y={valY}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={showBoth ? lighten(n.section.color, 0.55) : "rgba(255,255,255,0.9)"}
                  fontSize={valFontSize} fontWeight="600"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {valStr}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Info row below treemap */}
      <div className="mt-2 h-8 flex items-center">
        {hoveredNode ? (
          <div className="flex items-center gap-2 w-full min-w-0">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: hoveredNode.section.color }} />
            <span className="text-white text-xs font-semibold truncate flex-1">{hoveredNode.name}</span>
            <span className="text-slate-400 text-xs shrink-0 ml-1">{hoveredNode.section.name}</span>
            <span className="text-emerald-400 text-xs font-bold shrink-0 ml-2">{fmtVal(hoveredNode.value)}</span>
          </div>
        ) : (
          <span className="text-slate-600 text-xs">Hover a block for details</span>
        )}
      </div>
    </div>
  );
}
