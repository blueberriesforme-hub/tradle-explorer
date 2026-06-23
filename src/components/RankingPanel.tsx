import type { TradeData } from "../types";

interface Props {
  trade: TradeData;
  selectedProduct: string | null;
  onSelectCountry: (iso: string) => void;
  onClose: () => void;
}

function fmtValue(m: number): string {
  if (m >= 1000000) return `$${(m / 1000000).toFixed(1)}T`;
  if (m >= 1000) return `$${(m / 1000).toFixed(0)}B`;
  return `$${m.toFixed(0)}M`;
}

export function RankingPanel({ trade, selectedProduct, onSelectCountry, onClose }: Props) {
  const productData = selectedProduct ? trade.products[selectedProduct] : null;

  const ranked = productData
    ? Object.entries(productData.exporters)
        .map(([iso, value]) => ({ iso, name: trade.countries[iso]?.name ?? iso.toUpperCase(), total: value }))
        .sort((a, b) => b.total - a.total)
    : Object.entries(trade.countries)
        .map(([iso, c]) => ({ iso, name: c.name, total: c.total }))
        .sort((a, b) => b.total - a.total);

  const max = ranked[0]?.total ?? 1;
  const barColor = productData ? "#f59e0b" : "#3b82f6";
  const valueColor = productData ? "text-amber-400" : "text-blue-400";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-white">
          {productData ? "Top Exporters" : "Country Rankings"}
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
      </div>
      <div className="text-xs text-slate-400 mb-3">
        {productData
          ? `${trade.products[selectedProduct!]?.name} · 2024`
          : "By total exports · 2024"}
      </div>
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {ranked.map(({ iso, name, total }, i) => (
          <button
            key={iso}
            onClick={() => onSelectCountry(iso)}
            className="w-full text-left group"
          >
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs w-5 text-right">{i + 1}</span>
                <span className="text-sm text-slate-200 group-hover:text-white transition-colors">{name}</span>
              </div>
              <span className={`text-xs ${valueColor}`}>{fmtValue(total)}</span>
            </div>
            <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden ml-7">
              <div
                className="h-full rounded-full transition-colors group-hover:brightness-125"
                style={{ width: `${(total / max) * 100}%`, background: barColor }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
