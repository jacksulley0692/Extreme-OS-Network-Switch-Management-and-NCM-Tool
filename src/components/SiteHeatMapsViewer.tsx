// src/components/SiteHeatMapsViewer.tsx
import React, { useState, useMemo } from "react";
import { 
  Wifi, 
  Search, 
  Building2, 
  Layers, 
  Sparkles, 
  Download, 
  Upload, 
  CheckCircle2, 
  Network, 
  RotateCw,
  Server,
  FileSpreadsheet
} from "lucide-react";
import { KNOWN_SITE_DIAGRAMS, SiteDiagram } from "../data/siteDiagramsData";
import { SiteHeatMapsSection } from "./SiteHeatMapsSection";
import { SwitchItem } from "../types";

interface SiteHeatMapsViewerProps {
  switches?: SwitchItem[];
  initialSite?: string;
  onSelectSwitchForReplacement?: (hostname: string, ip: string) => void;
  onSwitchToDiagram?: (siteName: string) => void;
}

export const SiteHeatMapsViewer: React.FC<SiteHeatMapsViewerProps> = ({
  switches = [],
  initialSite = "York",
  onSelectSwitchForReplacement,
  onSwitchToDiagram
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedWorkbook, setSelectedWorkbook] = useState<string>("ALL");
  
  // Find initial site diagram or default to York
  const defaultDiagram = useMemo(() => {
    const found = KNOWN_SITE_DIAGRAMS.find(d => 
      d.cleanName.toLowerCase() === initialSite.toLowerCase() ||
      d.siteName.toLowerCase().includes(initialSite.toLowerCase())
    );
    return found || KNOWN_SITE_DIAGRAMS.find(d => d.siteName.toLowerCase().includes("york")) || KNOWN_SITE_DIAGRAMS[0];
  }, [initialSite]);

  const [selectedSite, setSelectedSite] = useState<SiteDiagram>(defaultDiagram);

  // Filter site list based on search and workbook
  const filteredSites = useMemo(() => {
    return KNOWN_SITE_DIAGRAMS.filter((site) => {
      const matchesSearch = 
        site.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.cleanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.tabName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.switchIps?.some(ip => ip.includes(searchQuery)) ||
        site.associatedHostnames?.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesWorkbook = selectedWorkbook === "ALL" || site.sourceFile === selectedWorkbook;

      return matchesSearch && matchesWorkbook;
    });
  }, [searchQuery, selectedWorkbook]);

  const workbooks = ["ALL", "DLC.vsdx", "DLC 2.vsdx", "DLC 3.vsdx"];

  return (
    <div className="space-y-6" id="site-heat-maps-viewer-container">
      {/* Top Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Wi-Fi Signal Heat Maps
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  {KNOWN_SITE_DIAGRAMS.length} Sites Indexed
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                  Wi-Fi 6E RF Coverage
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-floor architectural signal strength heat maps, Extreme Networks AP density, and voice/data SLA contours for all club sites.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {onSelectSwitchForReplacement && (
            <button
              onClick={() => onSelectSwitchForReplacement(
                selectedSite.associatedHostnames?.[0] || `${selectedSite.siteName}-CORE`,
                selectedSite.switchIps?.[0] || "10.36.226.11"
              )}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Switch Replacement Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Site Directory & Right Heat Map Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Filter Site Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter 130+ site heat maps or switches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Workbook Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar">
              {workbooks.map((wb) => (
                <button
                  key={wb}
                  onClick={() => setSelectedWorkbook(wb)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition cursor-pointer ${
                    selectedWorkbook === wb
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {wb === "ALL" ? "All Volumes" : wb.replace(".vsdx", "")}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 font-mono flex justify-between items-center pt-1 border-t border-slate-800/80">
              <span>Showing {filteredSites.length} of {KNOWN_SITE_DIAGRAMS.length} Sites</span>
              <span className="text-emerald-400">Wi-Fi 6E RF Ready</span>
            </div>
          </div>

          {/* Scrollable Site List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md max-h-[640px] flex flex-col">
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
              <span>Select Club Site</span>
              <span className="text-[10px] text-slate-500 font-normal">Click to load Heat Maps</span>
            </div>

            <div className="divide-y divide-slate-800/60 overflow-y-auto custom-scrollbar">
              {filteredSites.map((site) => {
                const isSelected = selectedSite.id === site.id;
                const isYork = site.cleanName.toLowerCase() === "york";
                return (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className={`w-full text-left p-3.5 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-950/40 border-l-4 border-emerald-500 text-white"
                        : "hover:bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-xs ${isSelected ? "text-emerald-300" : "text-slate-100"}`}>
                          {site.siteName}
                        </span>
                        {isYork && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-mono font-bold">
                            3 Floor Plans Verified
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                          {site.sourceFile.replace(".vsdx", "")}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        Tab: <span className="text-slate-300">{site.tabName}</span>
                      </div>

                      {site.switchIps && site.switchIps.length > 0 && (
                        <div className="text-[10px] font-mono text-emerald-400/80 flex items-center gap-1.5">
                          <Server className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>Core: {site.switchIps[0]}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <span className={`p-1.5 rounded-lg flex items-center justify-center ${isSelected ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"}`}>
                        <Wifi className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredSites.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs font-mono">
                  No sites matched "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Site Heat Map Section */}
        <div className="lg:col-span-8 space-y-4">
          <SiteHeatMapsSection
            siteDisplayName={selectedSite.cleanName || selectedSite.siteName}
            siteCode={selectedSite.cleanName || selectedSite.siteName}
            switches={switches}
          />
        </div>
      </div>
    </div>
  );
};
