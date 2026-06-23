import type { ProductData, TradeData } from "../types";

interface Props {
  code: string;
  data: ProductData;
  trade: TradeData;
  onClose: () => void;
}

function fmtValue(m: number): string {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${m.toFixed(0)}M`;
}

export function ProductSidebar({ code, data, trade, onClose }: Props) {
  const sorted = Object.entries(data.exporters)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 30);

  const max = sorted[0]?.[1] ?? 1;
  const total = Object.values(data.exporters).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">HS {code}</div>
          <h2 className="text-xl font-semibold text-white leading-tight">{data.name}</h2>
          <div className="text-sm text-slate-300 mt-1">
            Global exports: <span className="text-amber-400 font-medium">{fmtValue(total)}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none ml-2 mt-1">✕</button>
      </div>

      <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">Top Exporters</div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {sorted.map(([iso, value], i) => {
          const countryName = trade.countries[iso]?.name ?? iso.toUpperCase();
          const pct = (value / max) * 100;
          const sharePct = ((value / total) * 100).toFixed(1);
          return (
            <div key={iso}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm text-slate-200 flex items-center gap-2">
                  <span className="text-slate-500 w-5 text-right text-xs">{i + 1}</span>
                  <span className="leading-tight">{countryName}</span>
                  <span className="text-slate-500 text-xs">{sharePct}%</span>
                </div>
                <span className="text-xs text-amber-400 shrink-0 ml-2">{fmtValue(value)}</span>
              </div>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden ml-7">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
