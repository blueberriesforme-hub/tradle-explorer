import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Globe from "react-globe.gl";
import type { TradeData } from "./types";
import { CountrySidebar } from "./components/CountrySidebar";
import { ProductSidebar } from "./components/ProductSidebar";
import { RankingPanel } from "./components/RankingPanel";
import { ProductBrowser } from "./components/ProductBrowser";
import { InfoPanel } from "./components/InfoPanel";
import { CENTROIDS } from "./data/centroids";

function exportColor(value: number, max: number): string {
  if (!value) return "rgba(38, 55, 80, 0.82)";
  const t = Math.log1p(value) / Math.log1p(max);
  const r = Math.round(30 + t * 20);
  const g = Math.round(60 + t * 160);
  const b = Math.round(120 + t * 135);
  return `rgba(${r},${g},${b},0.85)`;
}

function heatColor(value: number, max: number): string {
  if (!value) return "rgba(38, 55, 80, 0.82)";
  const t = Math.log1p(value) / Math.log1p(max);
  const r = Math.round(30 + t * 225);
  const g = Math.round(30 + t * 140 * (1 - t * 0.6));
  const b = 30;
  return `rgba(${r},${g},${b},0.9)`;
}

function fmtBig(m: number): string {
  if (m >= 1000000) return `$${(m / 1000000).toFixed(2)}T`;
  if (m >= 1000) return `$${(m / 1000).toFixed(0)}B`;
  return `$${m.toFixed(0)}M`;
}

export default function App() {
  const [trade, setTrade] = useState<TradeData | null>(null);
  const [geoData, setGeoData] = useState<object | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showRanking, setShowRanking] = useState(false);
  const [hoverIso, setHoverIso] = useState<string | null>(null);
  const [hoverName, setHoverName] = useState<string>("");
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    fetch("/trade.json").then((r) => r.json()).then(setTrade);
    fetch(
      "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
    )
      .then((r) => r.json())
      .then(setGeoData);
  }, []);

  const maxTotal = useMemo(() => {
    if (!trade) return 1;
    return Math.max(...Object.values(trade.countries).map((c) => c.total));
  }, [trade]);

  const maxProduct = useMemo(() => {
    if (!trade || !selectedProduct) return 1;
    const exp = trade.products[selectedProduct]?.exporters ?? {};
    return Math.max(...Object.values(exp));
  }, [trade, selectedProduct]);

  // Top-20 exporters for the selected product, with lat/lng for globe labels
  const top20Labels = useMemo(() => {
    if (!trade || !selectedProduct) return [];
    return Object.entries(trade.products[selectedProduct]?.exporters ?? {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([iso, value], i) => {
        const centroid = CENTROIDS[iso];
        if (!centroid) return null;
        return {
          iso,
          rank: i + 1,
          value,
          lat: centroid[0],
          lng: centroid[1],
          name: trade.countries[iso]?.name ?? iso.toUpperCase(),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [trade, selectedProduct]);

  const getCountryColor = useCallback(
    (feat: any) => {
      const iso = feat.properties?.ISO_A3?.toLowerCase();
      if (!trade || !iso) return "rgba(38,55,80,0.82)";
      if (selectedProduct) {
        const val = trade.products[selectedProduct]?.exporters[iso] ?? 0;
        return heatColor(val, maxProduct);
      }
      const val = trade.countries[iso]?.total ?? 0;
      return exportColor(val, maxTotal);
    },
    [trade, selectedProduct, maxTotal, maxProduct]
  );

  const handleCountryClick = useCallback(
    (feat: any) => {
      const iso = feat.properties?.ISO_A3?.toLowerCase();
      if (!iso || !trade?.countries[iso]) return;
      setSelectedCountry(iso);
      setShowRanking(false);
    },
    [trade]
  );

  const handleCountryHover = useCallback((feat: any) => {
    if (!feat) { setHoverIso(null); setHoverName(""); setTooltipPos(null); return; }
    const iso = feat.properties?.ISO_A3?.toLowerCase() ?? "";
    const name = feat.properties?.ADMIN ?? iso.toUpperCase();
    setHoverIso(iso);
    setHoverName(name);
    setTooltipPos({ ...mousePos.current });
  }, []);

  // mousemove on the wrapper: update ref silently, update tooltip pos if hovering
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    setTooltipPos((prev) => prev ? { x: e.clientX, y: e.clientY } : prev);
  }, []);

  const flyToCountry = useCallback((iso: string) => {
    setSelectedCountry(iso);
    setShowRanking(false);
  }, []);

  // HTML element factory for top-20 rank badges
  const buildRankLabel = useCallback((d: any) => {
    const el = document.createElement("div");
    el.style.cssText = `
      display: flex; align-items: center; gap: 4px;
      background: rgba(8,8,24,0.85);
      border: 1.5px solid rgba(251,191,36,0.7);
      border-radius: 20px;
      padding: 2px 7px 2px 3px;
      cursor: default;
      white-space: nowrap;
      pointer-events: none;
      font-family: system-ui, sans-serif;
    `;
    el.innerHTML = `
      <span style="
        background: #f59e0b; color: #000; font-size: 10px; font-weight: 800;
        border-radius: 50%; width: 18px; height: 18px;
        display: flex; align-items: center; justify-content: center; shrink: 0;
      ">${d.rank}</span>
      <span style="color: #fff; font-size: 11px; font-weight: 600;">${d.name}</span>
    `;
    return el;
  }, []);

  if (!trade || !geoData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#080818]">
        <div className="text-center">
          <div className="text-slate-400 text-sm mb-2">Loading trade data…</div>
          <div className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const sidebarOpen = !!(selectedCountry || (selectedProduct && !showRanking));

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#080818]"
      onMouseMove={handleMouseMove}
    >
      <Globe
        ref={globeRef}
        width={window.innerWidth}
        height={window.innerHeight}
        backgroundColor="#080818"
        globeImageUrl={null as any}
        atmosphereColor="#1e40af"
        atmosphereAltitude={0.15}
        polygonsData={(geoData as any).features}
        polygonCapColor={getCountryColor}
        polygonSideColor={() => "rgba(15,23,42,0.4)"}
        polygonStrokeColor={(feat: any) => {
          const iso = feat.properties?.ISO_A3?.toLowerCase();
          return iso === hoverIso ? "rgba(255,255,255,1)" : "rgba(148,163,184,0.55)";
        }}
        polygonAltitude={0.005}
        onPolygonClick={handleCountryClick}
        onPolygonHover={handleCountryHover}
        polygonLabel={() => ""}
        // Top-20 rank badges
        htmlElementsData={top20Labels}
        htmlElement={buildRankLabel}
        htmlLat={(d: any) => d.lat}
        htmlLng={(d: any) => d.lng}
        htmlAltitude={0.07}
      />

      {/* Top bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-3">
          <span className="text-white font-semibold text-sm tracking-wide">🌐 Tradle Explorer</span>
          <div className="w-px h-4 bg-slate-600" />
          <ProductBrowser
            trade={trade}
            selectedProduct={selectedProduct}
            onSelect={(code) => { setSelectedProduct(code); setSelectedCountry(null); }}
            onClear={() => setSelectedProduct(null)}
          />
          <div className="w-px h-4 bg-slate-600" />
          <button
            onClick={() => { setShowRanking(!showRanking); setSelectedCountry(null); }}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              showRanking ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            {selectedProduct ? "Product Rankings" : "Rankings"}
          </button>
          <div className="w-px h-4 bg-slate-600" />
          <InfoPanel />
        </div>
      </div>

      {/* Left sidebar */}
      {sidebarOpen && (
        <div className="absolute left-4 top-4 bottom-4 w-96 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-2xl p-5 z-10 overflow-hidden flex flex-col">
          {selectedCountry && trade.countries[selectedCountry] && (
            <CountrySidebar
              iso={selectedCountry}
              data={trade.countries[selectedCountry]}
              onClose={() => setSelectedCountry(null)}
            />
          )}
          {selectedProduct && trade.products[selectedProduct] && !selectedCountry && (
            <ProductSidebar
              code={selectedProduct}
              data={trade.products[selectedProduct]}
              trade={trade}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </div>
      )}

      {/* Right ranking panel */}
      {showRanking && (
        <div className="absolute right-4 top-4 bottom-4 w-72 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-2xl p-5 z-10 overflow-hidden flex flex-col">
          <RankingPanel
            trade={trade}
            selectedProduct={selectedProduct}
            onSelectCountry={flyToCountry}
            onClose={() => setShowRanking(false)}
          />
        </div>
      )}

      {/* Legend — only in product heatmap mode */}
      {selectedProduct && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-3">
            <span className="text-xs text-slate-400">Less</span>
            <div className="w-32 h-2 rounded-full" style={{ background: "linear-gradient(to right, #1e1e1e, #f59e0b, #ef4444)" }} />
            <span className="text-xs text-slate-400">More</span>
            <span className="text-xs text-slate-500 ml-2">· Export intensity · 2024</span>
          </div>
        </div>
      )}

      {/* Cursor label — country name follows pointer */}
      {tooltipPos && hoverIso && (
        <div
          className="pointer-events-none fixed z-50"
          style={{ left: tooltipPos.x + 14, top: tooltipPos.y - 42 }}
        >
          <div className="bg-slate-900/95 backdrop-blur border border-white/20 rounded-lg px-3 py-2 shadow-2xl">
            <div className="text-white font-semibold text-sm leading-tight">
              {trade.countries[hoverIso]?.name ?? hoverName}
            </div>
            {trade.countries[hoverIso] && (
              <div className="text-slate-400 text-xs mt-0.5">
                {selectedProduct
                  ? fmtBig(trade.products[selectedProduct]?.exporters[hoverIso] ?? 0)
                  : `${fmtBig(trade.countries[hoverIso].total)} total exports`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
