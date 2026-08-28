// src/components/SitePageView.tsx
import React, { useState, useMemo } from "react";
import { 
  Building2, 
  ArrowLeft, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  Server, 
  Network, 
  RotateCcw,
  Radio,
  Plus,
  ShieldAlert
} from "lucide-react";
import { SwitchItem, AuthUser, UserRole } from "../types";
import { extractSiteCode, formatSiteDisplayName } from "../utils/siteHierarchy";
import { getUnmanagedSwitchesForSite } from "../data/unmanagedSwitchesData";
import { SiteHeatMapsSection } from "./SiteHeatMapsSection";
import { YorkLiveLldpTopologyMap } from "./YorkLiveLldpTopologyMap";
import { AddSwitchModal } from "./AddSwitchModal";

interface SitePageViewProps {
  siteCode: string;
  switches: SwitchItem[];
  onBackToAll: () => void;
  onSelectSwitch: (sw: SwitchItem) => void;
  onTriggerBackup?: (scriptName: string, targetSwitch: string) => void;
  onOpenDiagramTab?: (siteName: string) => void;
  onSwitchAdded?: (newSwitch: SwitchItem) => void;
  currentUser?: AuthUser | null;
  currentUserRole?: UserRole;
}

export const SitePageView: React.FC<SitePageViewProps> = ({
  siteCode,
  switches,
  onBackToAll,
  onSelectSwitch,
  onTriggerBackup,
  onSwitchAdded,
  currentUser,
  currentUserRole
}) => {
  const displayName = formatSiteDisplayName(siteCode);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Discovered rogue / Netgear unmanaged switches on this site
  const siteRogueDevices = useMemo(() => {
    return getUnmanagedSwitchesForSite(siteCode);
  }, [siteCode]);

  // Filter for only this site's switches with strict deduplication
  const siteSwitches = useMemo(() => {
    const normSiteCode = siteCode.toUpperCase().trim();
    const raw = switches.filter((sw) => {
      const detectedCode = extractSiteCode(sw.site || sw.hostname || sw.ip);
      if (detectedCode === normSiteCode) return true;
      if (sw.site && sw.site.toUpperCase().trim() === normSiteCode) return true;
      if (sw.site && sw.site.toUpperCase().replace(/[^A-Z0-9]/g, "") === normSiteCode.replace(/[^A-Z0-9]/g, "")) return true;
      if (sw.hostname.toUpperCase().includes(normSiteCode)) return true;
      return false;
    });

    const seen = new Set<string>();
    const unique: SwitchItem[] = [];
    for (const sw of raw) {
      const key = sw.ip ? sw.ip.trim() : sw.hostname.trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(sw);
      }
    }
    return unique;
  }, [switches, siteCode]);

  const backedUpCount = siteSwitches.filter((sw) => sw.lastBackupStatus === "SUCCESS" || sw.lastBackupStatus === "Success").length;
  const healthPercent = siteSwitches.length > 0 ? Math.round((backedUpCount / siteSwitches.length) * 100) : 100;

  // Site Page View Mode: Live LLDP Node Graph is the primary drawing view!
  const [siteViewMode, setSiteViewMode] = useState<"graph" | "switches" | "heatmaps" | "replacement" | "rogue">("graph");

  const handleSwitchAdded = (newSwitch: SwitchItem) => {
    if (onSwitchAdded) {
      onSwitchAdded(newSwitch);
    }
  };

  return (
    <div className="space-y-5" id={`site-page-${siteCode.toLowerCase()}`}>
      {/* Add Switch Modal */}
      <AddSwitchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultSite={displayName}
        allSites={[displayName, "Amsterdam", "Aberdeen", "Acton Park", "Antwerp", "Barcelona", "Beckenham", "Belfast", "Birmingham", "Bolton", "Brighton", "Briston Long Ashton", "Bristol Westbury", "Leeds", "York"]}
        onSwitchAdded={handleSwitchAdded}
        currentUser={currentUser}
      />

      {/* Site Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToAll}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 cursor-pointer shadow-sm"
            title="Back to All Sites Fleet"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-wide">{displayName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SITE CODE: {siteCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {siteSwitches.length} Switches
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                <Network className="w-3 h-3" />
                <span>Live LLDP Topology</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Live Extreme Networks Infrastructure &bull; {displayName} Enterprise Campus
            </p>
          </div>
        </div>

        {/* Site Metrics & Action */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <div className="text-right mr-1 hidden lg:block">
            <div className="text-xs text-slate-400">Site Backup Coverage</div>
            <div className="text-sm font-bold font-mono text-emerald-400">{healthPercent}% ({backedUpCount}/{siteSwitches.length || 1})</div>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Switch</span>
          </button>

          {onTriggerBackup && (
            <button
              onClick={() => onTriggerBackup("BackupSave.py", siteSwitches[0]?.ip || "ALL")}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Backup Site Switches</span>
            </button>
          )}
        </div>
      </div>

      {/* Site Views Navigation Pills Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center justify-between gap-2 overflow-x-auto shadow-md">
        <div className="flex items-center gap-2 min-w-max">
          <button
            id="btn-site-tab-graph"
            onClick={() => setSiteViewMode("graph")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              siteViewMode === "graph"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-950/60 border border-slate-800"
            }`}
          >
            <Network className="w-4 h-4 text-indigo-300" />
            <span>🗺️ Live LLDP Topology Map</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time
            </span>
          </button>

          <button
            id="btn-site-tab-switches"
            onClick={() => setSiteViewMode("switches")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              siteViewMode === "switches"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-950/60 border border-slate-800"
            }`}
          >
            <Server className="w-4 h-4 text-cyan-400" />
            <span>🗄️ Switch Fleet ({siteSwitches.length})</span>
          </button>

          <button
            id="btn-site-tab-heatmaps"
            onClick={() => setSiteViewMode("heatmaps")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              siteViewMode === "heatmaps"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-950/60 border border-slate-800"
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>📶 Wireless RF Heatmaps</span>
          </button>

          <button
            id="btn-site-tab-rogue"
            onClick={() => setSiteViewMode("rogue")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              siteViewMode === "rogue"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-950/60 border border-slate-800"
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>🕵️ Rogue / Netgear Discovery</span>
            {siteRogueDevices.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold animate-pulse">
                {siteRogueDevices.length} Detected
              </span>
            )}
          </button>

          <button
            id="btn-site-tab-replacement"
            onClick={() => setSiteViewMode("replacement")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              siteViewMode === "replacement"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-950/60 border border-slate-800"
            }`}
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>🔄 Switch Replacement</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 pr-2">
          <span>Site: <strong className="text-white">{displayName}</strong></span>
          <span>&bull;</span>
          <span>Active Nodes: <strong className="text-indigo-300">{siteSwitches.length} Switches</strong></span>
        </div>
      </div>

      {/* Rogue / Netgear Alert Banner if detected on site */}
      {siteRogueDevices.length > 0 && siteViewMode !== "rogue" && (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <span>{siteRogueDevices.length} Unmanaged / Netgear Switch{siteRogueDevices.length > 1 ? "es" : ""} Discovered at {displayName}</span>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-amber-500/20 text-amber-200 border border-amber-500/30">
                  Multi-MAC Port Detection
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rogue desktop switches detected behind Extreme access drops (e.g. {siteRogueDevices.map(d => `${d.parentSwitchHostname} Port ${d.connectedPort}`).slice(0, 2).join(", ")}).
              </p>
            </div>
          </div>
          <button
            onClick={() => setSiteViewMode("rogue")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1.5 shrink-0 shadow cursor-pointer font-mono"
          >
            <span>Inspect Devices &rarr;</span>
          </button>
        </div>
      )}

      {/* VIEW 1: Interactive Live LLDP Node Topology Map (Default & Primary) */}
      {siteViewMode === "graph" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <YorkLiveLldpTopologyMap
            siteCode={siteCode}
            siteName={displayName}
            switches={siteSwitches.length > 0 ? siteSwitches : switches}
            currentUser={currentUser}
            onTriggerBackup={onTriggerBackup}
            onSelectSwitchForWorkspace={onSelectSwitch}
          />
        </div>
      )}

      {/* VIEW 2: Wireless RF Heatmaps */}
      {siteViewMode === "heatmaps" && (
        <div className="animate-in fade-in duration-200">
          <SiteHeatMapsSection siteCode={siteCode} siteName={displayName} />
        </div>
      )}

      {/* VIEW 3: Switch Fleet Inventory */}
      {(siteViewMode === "switches" || siteViewMode === "graph") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                {displayName} Switch Fleet ({siteSwitches.length} Switches)
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Switch to {displayName}</span>
              </button>
              <div className="text-xs text-slate-400 font-mono hidden sm:block">
                Click any switch card to inspect live ports, LLDP neighbors, or download config.
              </div>
            </div>
          </div>

          {siteSwitches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {siteSwitches.map((sw) => {
                const isExos = sw.os === "EXOS";
                const isSuccess = sw.lastBackupStatus === "SUCCESS" || sw.lastBackupStatus === "Success";

                return (
                  <div
                    key={sw.id}
                    onClick={() => onSelectSwitch(sw)}
                    className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 cursor-pointer transition-all shadow-md group space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex items-start gap-2">
                        <span 
                          className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                            (sw.isReachable ?? isSuccess) ? "bg-emerald-400 shadow-xs shadow-emerald-400/50" : "bg-rose-500 shadow-xs shadow-rose-500/50"
                          }`} 
                          title={(sw.isReachable ?? isSuccess) ? "Reachable" : "Unreachable"}
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
                            {sw.hostname || sw.ip}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>{sw.ip}</span>
                            {!(sw.isReachable ?? isSuccess) && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold font-sans">
                                Unreachable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                        isExos ? "bg-purple-950 text-purple-300 border border-purple-800" : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                      }`}>
                        {sw.os}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Model</span>
                        <span className="text-slate-300 truncate block">{sw.model || "Extreme Switch"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Backup Status</span>
                        <span className={isSuccess ? "text-emerald-400 font-bold" : "text-amber-400"}>
                          {sw.lastBackupStatus || "Ready"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 text-[11px]">
                      <span className="text-slate-500 text-[10px]">
                        {sw.ports?.length || 24} Ports &bull; {sw.uplinkPorts?.join(", ") || "1:49, 1:50"}
                      </span>
                      <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform text-xs">
                        Inspect &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 font-mono space-y-3">
              <div>No switches listed for &ldquo;{displayName}&rdquo; yet.</div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer font-sans"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll First Switch for {displayName}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: Site Switch Replacement Workspace */}
      {siteViewMode === "replacement" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔄</span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {displayName} Switch Replacement &amp; Staging Hub
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Select any switch in {displayName} ({siteCode}) to launch the RMA IP Customizer, generate sanitized .xsf/.cfg configs, or run live console restoration.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 self-start sm:self-auto">
              {siteSwitches.length} Switches in {siteCode}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteSwitches.map((sw) => (
              <div
                key={sw.id}
                className="bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {sw.os}
                      </span>
                      <h4 className="font-mono font-bold text-white text-sm mt-1 truncate">
                        {sw.hostname || sw.ip}
                      </h4>
                      <p className="text-xs font-mono text-emerald-400 mt-0.5">{sw.ip}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {sw.configFormat?.toUpperCase() || "XSF"}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-900 grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Model</span>
                      <span className="text-slate-200 truncate block">{sw.model || "Extreme Switch"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Backup</span>
                      <span className={sw.lastBackupStatus === "SUCCESS" || sw.lastBackupStatus === "Success" ? "text-emerald-400 font-bold" : "text-slate-400"}>
                        {sw.lastBackupStatus || "Available"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                  <button
                    onClick={() => onSelectSwitch(sw)}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <span>🔄 Launch Replacement</span>
                  </button>
                  <button
                    onClick={() => onTriggerBackup && onTriggerBackup("BackupSave.py", sw.ip)}
                    className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 transition cursor-pointer"
                    title="Backup switch now"
                  >
                    <span>⚡ Backup</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: Rogue & Netgear Switch Discovery */}
      {siteViewMode === "rogue" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🕵️</span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {displayName} Unmanaged &amp; Rogue Switch Discovery
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Passive MAC table &amp; multi-host edge port detection across {displayName} Extreme access switches (Netgear, TP-Link, D-Link).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {siteRogueDevices.length} Unmanaged Switch{siteRogueDevices.length === 1 ? "" : "es"} Detected
              </span>
            </div>
          </div>

          {siteRogueDevices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siteRogueDevices.map((dev) => {
                const parentSw = siteSwitches.find(
                  (s) => s.hostname === dev.parentSwitchHostname || s.ip === dev.parentSwitchIp
                );

                return (
                  <div
                    key={dev.id}
                    className="bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-xl p-5 space-y-4 shadow-lg transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          <Radio className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white tracking-wide">{dev.vendor} {dev.model}</h4>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${
                              dev.riskLevel === "High" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                              dev.riskLevel === "Medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                              "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}>
                              {dev.riskLevel} Risk
                            </span>
                          </div>
                          <div className="text-xs font-mono text-slate-400 mt-1">
                            MAC: <span className="text-slate-200">{dev.macAddress}</span> &bull; IP: <span className="text-emerald-400">{dev.ipAddress}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                        {dev.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Connected Parent Switch</span>
                        <span className="text-indigo-300 font-bold truncate block">{dev.parentSwitchHostname}</span>
                        <span className="text-slate-400 text-[10px]">{dev.parentSwitchIp}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Connected Port &amp; Subnet</span>
                        <span className="text-amber-300 font-bold block">Port {dev.connectedPort}</span>
                        <span className="text-slate-400 text-[10px]">{dev.detectedSubnet}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Devices Behind Port</span>
                        <span className="text-slate-200 font-bold block">{dev.detectedDevicesBehindCount} Client MACs</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Detection Confidence</span>
                        <span className="text-emerald-400 font-bold block">{dev.confidenceScore}%</span>
                      </div>
                    </div>

                    {dev.notes && (
                      <div className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                        {dev.notes}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                      {parentSw && (
                        <button
                          onClick={() => onSelectSwitch(parentSw)}
                          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-1.5 shadow cursor-pointer font-mono"
                        >
                          <span>Inspect Parent {parentSw.hostname} &rarr;</span>
                        </button>
                      )}
                      <button
                        onClick={() => onTriggerBackup && onTriggerBackup("port_description_report.py", dev.parentSwitchIp)}
                        className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 transition cursor-pointer font-mono"
                        title="Audit port description and FDB table"
                      >
                        <span>Audit FDB</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 font-mono space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">No Rogue Switches Detected at {displayName}</div>
              <div className="text-slate-500 max-w-md mx-auto">
                All edge access drops are running single-host configurations without unmanaged desktop hubs or unauthorized multi-MAC chaining.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
