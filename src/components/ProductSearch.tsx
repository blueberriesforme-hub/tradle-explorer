import { useState, useMemo } from "react";
import type { TradeData } from "../types";

interface Props {
  trade: TradeData;
  selectedProduct: string | null;
  onSelect: (code: string) => void;
  onClear: () => void;
}

export function ProductSearch({ trade, selectedProduct, onSelect, onClear }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return Object.entries(trade.products)
      .filter(([code, p]) => p.name.toLowerCase().includes(q) || code.includes(q))
      .sort(([, a], [, b]) => {
        const totA = Object.values(a.exporters).reduce((x, y) => x + y, 0);
        const totB = Object.values(b.exporters).reduce((x, y) => x + y, 0);
        return totB - totA;
      })
      .slice(0, 12);
  }, [query, trade]);

  const selectedName = selectedProduct ? trade.products[selectedProduct]?.name : null;

  return (
    <div className="relative">
      {selectedProduct ? (
        <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-lg px-3 py-2">
          <span className="text-sm text-amber-300 truncate max-w-48">{selectedName}</span>
          <button onClick={onClear} className="text-amber-400 hover:text-white text-sm ml-auto shrink-0">✕</button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            placeholder="Search product (e.g. crude oil, iron ore…)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className="w-64 bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-500 transition-colors"
          />
          {open && results.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden">
              {results.map(([code, product]) => (
                <button
                  key={code}
                  onMouseDown={() => { onSelect(code); setQuery(""); setOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{product.name}</span>
                  <span className="text-slate-500 text-xs ml-2 shrink-0">HS {code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
