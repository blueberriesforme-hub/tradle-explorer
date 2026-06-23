import { useMemo, useState, useRef, useEffect } from "react";
import type { TradeData } from "../types";
import { HS_SECTIONS, getSectionForHs4 } from "../data/hsSections";

interface Props {
  trade: TradeData;
  selectedProduct: string | null;
  onSelect: (code: string) => void;
  onClear: () => void;
}

function fmtVal(m: number) {
  if (m >= 1000000) return `$${(m / 1000000).toFixed(1)}T`;
  if (m >= 1000) return `$${(m / 1000).toFixed(0)}B`;
  return `$${m.toFixed(0)}M`;
}

export function ProductBrowser({ trade, selectedProduct, onSelect, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveSection(null);
        setSearch("");
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Compute global totals and group products by section
  const productsBySection = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const [code, pd] of Object.entries(trade.products)) {
      totals[code] = Object.values(pd.exporters).reduce((a, b) => a + b, 0);
    }

    const bySec: Record<string, { code: string; name: string; total: number }[]> = {};
    for (const [code, pd] of Object.entries(trade.products)) {
      const sec = getSectionForHs4(code);
      if (!sec) continue;
      if (!bySec[sec.id]) bySec[sec.id] = [];
      bySec[sec.id].push({ code, name: pd.name, total: totals[code] });
    }
    // Sort each section's products by global value desc
    for (const id of Object.keys(bySec)) {
      bySec[id].sort((a, b) => b.total - a.total);
    }
    return bySec;
  }, [trade]);

  // Search results across all products
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return Object.entries(trade.products)
      .filter(([code, p]) => p.name.toLowerCase().includes(q) || code.startsWith(q))
      .map(([code, p]) => ({
        code,
        name: p.name,
        total: Object.values(p.exporters).reduce((a, b) => a + b, 0),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
  }, [search, trade]);

  const selectedName = selectedProduct ? trade.products[selectedProduct]?.name : null;
  const currentSection = activeSection ? HS_SECTIONS.find((s) => s.id === activeSection) : null;

  function handleSelect(code: string) {
    onSelect(code);
    setOpen(false);
    setActiveSection(null);
    setSearch("");
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      {selectedProduct ? (
        <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-lg px-3 py-1.5">
          <span className="text-sm text-amber-300 max-w-44 truncate">{selectedName}</span>
          <button onClick={onClear} className="text-amber-400 hover:text-white text-sm ml-1 shrink-0">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
            open
              ? "bg-slate-700 border-slate-500 text-white"
              : "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/60"
          }`}
        >
          <span>Browse Products</span>
          <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
        </button>
      )}

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-slate-700">
            <input
              autoFocus
              type="text"
              placeholder="Search any product…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveSection(null); }}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Search results */}
          {search && (
            <div className="max-h-72 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-slate-500 text-sm">No results</div>
              ) : searchResults.map((p) => {
                const sec = getSectionForHs4(p.code);
                return (
                  <button
                    key={p.code}
                    onClick={() => handleSelect(p.code)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {sec && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: sec.color }} />}
                      <span className="text-sm text-slate-200 group-hover:text-white truncate">{p.name}</span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 ml-2">{fmtVal(p.total)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Section browser */}
          {!search && !activeSection && (
            <div className="max-h-80 overflow-y-auto py-1">
              {HS_SECTIONS.map((sec) => {
                const count = productsBySection[sec.id]?.length ?? 0;
                if (count === 0) return null;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: sec.color }} />
                    <span className="text-sm text-slate-200 group-hover:text-white flex-1">{sec.name}</span>
                    <span className="text-xs text-slate-500">{count} →</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Product list within a section */}
          {!search && activeSection && currentSection && (
            <>
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-white transition-colors border-b border-slate-700 w-full"
              >
                <span>←</span>
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: currentSection.color }} />
                <span>{currentSection.name}</span>
              </button>
              <div className="max-h-72 overflow-y-auto py-1">
                {(productsBySection[activeSection] ?? []).map((p, i) => (
                  <button
                    key={p.code}
                    onClick={() => handleSelect(p.code)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition-colors text-left group"
                  >
                    <span className="text-slate-600 text-xs w-4 shrink-0">{i + 1}</span>
                    <span className="text-sm text-slate-200 group-hover:text-white flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-amber-400 shrink-0">{fmtVal(p.total)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
