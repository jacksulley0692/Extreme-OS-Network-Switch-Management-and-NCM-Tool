// src/components/SiteSidebar.tsx
import React, { useState, useMemo } from "react";
import { 
  Building2, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  ChevronsRight, 
  ChevronsLeft, 
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  Sparkles
} from "lucide-react";
import { SwitchItem } from "../types";
import { getAllEstateSites } from "../utils/siteHierarchy";

interface SiteSidebarProps {
  switches: SwitchItem[];
  activeSite: string | null;
  selectedSwitchId: string | null;
  onSelectSite: (siteCode: string | null) => void;
  onSelectSwitch: (sw: SwitchItem) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SiteSidebar: React.FC<SiteSidebarProps> = ({
  switches,
  activeSite,
  selectedSwitchId,
  onSelectSite,
  onSelectSwitch,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [filterQuery, setFilterQuery] = useState<string>("");
  const siteGroups = useMemo(() => getAllEstateSites(switches), [switches]);
  const allSiteCodes = useMemo(() => Object.keys(siteGroups).sort((a, b) => siteGroups[a].siteName.localeCompare(siteGroups[b].siteName)), [siteGroups]);
  
  // Filter sites based on search input
  const filteredSiteCodes = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return allSiteCodes;
    return allSiteCodes.filter(code => {
      const g = siteGroups[code];
      return (
        code.toLowerCase().includes(q) ||
        g.siteName.toLowerCase().includes(q) ||
        g.switches.some(sw => (sw.hostname || "").toLowerCase().includes(q) || (sw.ip || "").includes(q))
      );
    });
  }, [allSiteCodes, siteGroups, filterQuery]);

  // Track open/closed state per folder
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (siteCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFolders((prev) => ({ ...prev, [siteCode]: !prev[siteCode] }));
  };

  // --- COLLAPSED SLIM ICON RAIL ---
  if (isCollapsed) {
    return (
      <aside className="w-16 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl flex flex-col items-center py-3 space-y-2 shrink-0 transition-all duration-300">
        {/* Expand Toggle */}
        <button
          onClick={onToggleCollapse}
          className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition group relative"
          title="Expand Sites Hierarchy (130+ Sites)"
        >
          <ChevronsRight className="w-5 h-5" />
          <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
            Expand 130+ Sites
          </span>
        </button>

        {/* All Fleet Quick Button */}
        <button
          onClick={() => onSelectSite(null)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition group relative border ${
            activeSite === null
              ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
              : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
          }`}
          title="All Switches Fleet"
        >
          ALL
          <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
            All Fleet ({switches.length} Switches &bull; {allSiteCodes.length} Sites)
          </span>
        </button>

        <div className="w-8 border-t border-slate-800 my-1" />

        {/* Site Icon Rail */}
        <div className="w-full flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-0.5">
          {allSiteCodes.map((siteCode) => {
            const group = siteGroups[siteCode];
            const isSelected = activeSite === siteCode;
            const initial = siteCode.length <= 3 ? siteCode : siteCode.substring(0, 2);

            return (
              <div key={siteCode} className="relative group flex justify-center">
                <button
                  onClick={() => onSelectSite(siteCode)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400"
                      : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                  }`}
                >
                  {initial}
                </button>

                {/* Floating Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap space-y-0.5">
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-indigo-400" : "bg-emerald-400"}`} />
                    <span>{group.siteName}</span>
                    <span className="text-[10px] text-slate-400">({group.totalCount} switches)</span>
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-purple-400" />
                    <span>Visio Diagram Ready</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    );
  }

  // --- EXPANDED VIEW ---
  return (
    <aside className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-xl flex flex-col h-full select-none text-slate-200 shrink-0 transition-all duration-300">
      {/* Sidebar Header */}
      <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-200">Sites & Locations</div>
            <div className="text-[10px] text-indigo-400 font-mono font-bold flex items-center gap-1">
              <span>{allSiteCodes.length} sites</span>
              <span>&bull;</span>
              <span>{switches.length} switches</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectSite(null)}
            className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg transition border ${
              activeSite === null
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-700/50"
            title="Collapse sidebar into slim rail"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Search Filter */}
      <div className="mt-2.5 relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder={`Search ${allSiteCodes.length} sites...`}
          className="w-full bg-slate-950/90 border border-slate-800 focus:border-indigo-500/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition"
        />
        {filterQuery && (
          <button
            onClick={() => setFilterQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white bg-slate-800 rounded px-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tree View Navigation */}
      <div className="flex-1 overflow-y-auto mt-2 space-y-1 custom-scrollbar pr-0.5 max-h-[calc(100vh-280px)]">
        {filteredSiteCodes.map((siteCode) => {
          const group = siteGroups[siteCode];
          const isOpen = !!openFolders[siteCode];
          const isSelected = activeSite === siteCode;
          const initial = siteCode.length <= 3 ? siteCode : siteCode.substring(0, 2);

          return (
            <div 
              key={siteCode} 
              className={`rounded-xl transition-all border ${
                isSelected 
                  ? "bg-indigo-950/50 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30" 
                  : "bg-slate-950/40 hover:bg-slate-950/80 border-slate-800/60"
              }`}
            >
              {/* Site Row */}
              <div
                onClick={() => onSelectSite(siteCode)}
                className={`px-2.5 py-2 flex items-center justify-between cursor-pointer group rounded-xl transition ${
                  isSelected ? "bg-indigo-900/40 text-white" : "hover:bg-slate-900/90 text-slate-200"
                }`}
                title={`Open ${group.siteName} Site Page & Diagram`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {group.switches.length > 0 ? (
                    <button
                      type="button"
                      onClick={(e) => toggleFolder(siteCode, e)}
                      className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                      title={isOpen ? "Collapse switch list" : "Expand switch list"}
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-90 text-indigo-400" : "text-slate-500"}`} />
                    </button>
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center text-slate-600 shrink-0">
                      &bull;
                    </div>
                  )}

                  <div className={`w-6 h-6 rounded-lg ${isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "bg-slate-900 text-slate-400 group-hover:text-slate-200 border border-slate-800"} flex items-center justify-center text-[10px] font-mono font-bold shrink-0`}>
                    {initial}
                  </div>

                  <a
                    href={`#site-${siteCode.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectSite(siteCode);
                    }}
                    className={`text-xs text-left font-semibold ${
                      isSelected 
                        ? "text-indigo-300 font-bold underline decoration-indigo-400" 
                        : "text-indigo-400 hover:text-indigo-300 hover:underline"
                    } truncate cursor-pointer flex-1 flex items-center gap-1.5`}
                    title={`Open ${group.siteName} Site Page & Diagram`}
                  >
                    <span>{group.siteName}</span>
                    <ExternalLink className="w-3 h-3 text-indigo-400/70 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {group.hasDiagram && (
                    <span 
                      className="text-[10px] text-purple-400 px-1 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 flex items-center" 
                      title="Visio Topology Diagram available"
                    >
                      <ImageIcon className="w-2.5 h-2.5" />
                    </span>
                  )}

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    isSelected 
                      ? "bg-indigo-500/30 text-indigo-200 border border-indigo-500/40" 
                      : group.totalCount > 0
                        ? "bg-slate-800/80 text-slate-300 border border-slate-700/50"
                        : "bg-slate-900/60 text-slate-500 border border-slate-800/50"
                  }`}>
                    {group.totalCount}
                  </span>
                  
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" title="Active Site Page"></span>
                  )}
                </div>
              </div>

              {/* Child Switches List */}
              {isOpen && group.switches.length > 0 && (
                <div className="px-2.5 pb-2 pt-1 border-t border-slate-800/60 space-y-1 bg-slate-950/60">
                  {group.switches.map((sw) => {
                    const isSwActive = selectedSwitchId === sw.id;
                    const isReachable = sw.isReachable ?? (sw.lastBackupStatus === "Success");

                    return (
                      <div
                        key={sw.id}
                        onClick={() => onSelectSwitch(sw)}
                        className={`px-2 py-1 rounded-lg flex items-center justify-between text-[11px] font-mono cursor-pointer transition ${
                          isSwActive
                            ? isReachable 
                              ? "bg-slate-800 text-emerald-300 font-bold border border-emerald-500/30"
                              : "bg-slate-800 text-rose-300 font-bold border border-rose-500/30"
                            : isReachable
                              ? "hover:bg-slate-800/90 text-slate-300 hover:text-emerald-300"
                              : "hover:bg-slate-800/90 text-slate-400 hover:text-rose-300"
                        }`}
                        title={`Select switch ${sw.hostname || sw.ip} (${isReachable ? 'Reachable' : 'Unreachable / Offline'})`}
                      >
                        <div className="flex items-center gap-1.5 truncate mr-2">
                          <span 
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isReachable ? "bg-emerald-400/80 shadow-xs shadow-emerald-400/50" : "bg-rose-500 shadow-xs shadow-rose-500/50"
                            }`} 
                          />
                          <span className={`truncate ${!isReachable ? "text-slate-400" : ""}`}>
                            {sw.hostname || sw.ip}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!isReachable && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                              Unreachable
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">{sw.ip}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredSiteCodes.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-500 font-mono">
            No sites match &ldquo;{filterQuery}&rdquo;
          </div>
        )}
      </div>
    </aside>
  );
};
