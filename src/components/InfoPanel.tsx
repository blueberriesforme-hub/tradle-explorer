import { useState, useRef, useEffect } from "react";

export function InfoPanel() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-full border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 text-sm font-semibold transition-colors flex items-center justify-center"
      >
        ?
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl z-50 p-5">
          <h3 className="text-white font-semibold mb-2">About Tradle Explorer</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            An interactive map of global trade data (2024). Explore what every country exports, compare countries by total trade volume, and see where any commodity comes from.
          </p>

          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex gap-2">
              <span className="shrink-0">🌍</span>
              <span><strong className="text-white">Click a country</strong> to see its export breakdown</span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0">🛢️</span>
              <span><strong className="text-white">Browse Products</strong> to see a world heatmap for any commodity</span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0">📊</span>
              <span><strong className="text-white">Rankings</strong> to compare all countries by export volume</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-xs mb-2">Inspired by the original game:</p>
            <a
              href="https://oec.world/en/tradle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              🎮 Play Tradle
              <span className="text-amber-500 text-xs">↗</span>
            </a>
            <p className="text-slate-500 text-xs mt-3">Data: OEC / BACI · 2024</p>
          </div>
        </div>
      )}
    </div>
  );
}
