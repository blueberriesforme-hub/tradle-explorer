import type { CountryData } from "../types";
import { ExportTreemap } from "./ExportTreemap";

interface Props {
  iso: string;
  data: CountryData;
  onClose: () => void;
}

function fmtValue(m: number): string {
  if (m >= 1000000) return `$${(m / 1000000).toFixed(2)}T`;
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${m.toFixed(0)}M`;
}

export function CountrySidebar({ iso, data, onClose }: Props) {
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">{iso.toUpperCase()}</div>
          <h2 className="text-xl font-semibold text-white leading-tight">{data.name}</h2>
          <div className="text-sm text-slate-300 mt-1">
            Total exports: <span className="text-emerald-400 font-medium">{fmtValue(data.total)}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none ml-2 mt-1 shrink-0">✕</button>
      </div>

      {/* Treemap */}
      <div>
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Export Composition</div>
        <ExportTreemap data={data} width={352} height={360} />
      </div>

      {/* Bar list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Top Exports</div>
        <div className="space-y-2 pr-1">
          {data.products.slice(0, 25).map((p, i) => {
            const pct = (p.value / data.products[0].value) * 100;
            return (
              <div key={p.code}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-500 w-5 text-right text-xs shrink-0">{i + 1}</span>
                    <span className="text-sm text-slate-200 truncate">{p.name}</span>
                  </div>
                  <span className="text-xs text-emerald-400 shrink-0 ml-2">{fmtValue(p.value)}</span>
                </div>
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden ml-7">
                  <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
