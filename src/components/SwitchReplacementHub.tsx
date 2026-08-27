import React, { useState, useMemo } from "react";
import { SwitchItem, SwitchOS, SwitchBackupRevision, LiveStatusData, UserRole, AuthUser, BackupScheduleConfig } from "../types";
import { SiteSidebar } from "./SiteSidebar";
import { 
  Search, 
  Download, 
  Copy, 
  Check, 
  Cpu, 
  HardDrive, 
  Server, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Network, 
  Terminal, 
  Zap, 
  Layers, 
  FileCode, 
  ArrowRight, 
  Filter, 
  RefreshCw, 
  Eye, 
  Settings2, 
  Share2, 
  Radio, 
  Sliders, 
  History, 
  Tag, 
  Activity, 
  Wifi, 
  Upload, 
  Image as ImageIcon, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw
} from "lucide-react";
import { LldpNeighborModal } from "./LldpNeighborModal";
import { PortDescriptionModal } from "./PortDescriptionModal";
import { PreviousBackupsModal } from "./PreviousBackupsModal";
import { BackupOptionsModal, BackupExecutionOptions } from "./BackupOptionsModal";
import { BouncePortModal } from "./BouncePortModal";
import { RolloutConfigModal } from "./RolloutConfigModal";
import { EstateBackupScheduleCard } from "./EstateBackupScheduleCard";
import { BackupScheduleModal } from "./BackupScheduleModal";
import { SwitchMonitorModal } from "./SwitchMonitorModal";
import { SwitchPingModal } from "./SwitchPingModal";
import { findDiagramForSiteOrSwitch } from "../data/siteDiagramsData";
import { YORK_DIAGRAM_SVG } from "../data/yorkDiagramSvg";
import { SitePageView } from "./SitePageView";

interface SwitchReplacementHubProps {
  switches: SwitchItem[];
  onTriggerBackup: (scriptName: string, targetSwitch: string) => void;
  isRunning?: boolean;
  liveStatus?: LiveStatusData | null;
  currentUserRole?: UserRole;
  currentUser?: AuthUser | null;
  onOpenTopology?: () => void;
}

export function SwitchReplacementHub({ switches, onTriggerBackup, isRunning = false, liveStatus = null, currentUserRole, currentUser, onOpenTopology }: SwitchReplacementHubProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOs, setSelectedOs] = useState<"ALL" | SwitchOS>("ALL");
  const [reachabilityFilter, setReachabilityFilter] = useState<"ALL" | "REACHABLE" | "UNREACHABLE">("ALL");
  const [selectedSwitch, setSelectedSwitch] = useState<SwitchItem | null>(null);
  
  // Rollout Configuration Modal state
  const [rolloutModalOpen, setRolloutModalOpen] = useState<boolean>(false);

  // Standalone LLDP modal state
  const [lldpModalSwitch, setLldpModalSwitch] = useState<SwitchItem | null>(null);
  const [lldpModalMode, setLldpModalMode] = useState<"backup" | "live">("backup");

  // Port Description modal state
  const [portModalSwitch, setPortModalSwitch] = useState<SwitchItem | null>(null);
  const [portModalMode, setPortModalMode] = useState<"backup" | "live">("live");

  // Previous Backups modal state
  const [historyModalSwitch, setHistoryModalSwitch] = useState<SwitchItem | null>(null);

  // Bounce Port modal state
  const [bouncePortSwitch, setBouncePortSwitch] = useState<SwitchItem | null>(null);
  const [bouncePortDefault, setBouncePortDefault] = useState<string>("13");

  // Switch Monitor Telemetry Modal state (CPU %, Temperature, Memory %)
  const [monitorModalSwitch, setMonitorModalSwitch] = useState<SwitchItem | null>(null);

  // Backup Schedule Configuration Modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);

  // Ping / Reachability Modal state
  const [pingModalSwitch, setPingModalSwitch] = useState<SwitchItem | null>(null);

  // Backup Options Modal state
  const [backupModalOpen, setBackupModalOpen] = useState<boolean>(false);
  const [backupModalTarget, setBackupModalTarget] = useState<SwitchItem | null>(null);

  // Selected switches for batch backup
  const [selectedSwitchIds, setSelectedSwitchIds] = useState<string[]>([]);

  // 1-Click Card Copy state tracking
  const [copiedCardBackupId, setCopiedCardBackupId] = useState<string | null>(null);
  const [copiedIpId, setCopiedIpId] = useState<string | null>(null);

  // IP Replacement Customizer state
  const [customIp, setCustomIp] = useState<string>("");
  const [customGateway, setCustomGateway] = useState<string>("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"config" | "ports" | "lldp" | "diagram" | "guide">("config");

  // Site Hierarchy Selection State
  const [activeSite, setActiveSite] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [siteDiagramsMap, setSiteDiagramsMap] = useState<Record<string, string>>({});
  const [siteDiagramZoom, setSiteDiagramZoom] = useState<number>(100);

  // Helper to compute stable mock latency or reachability if not already provided
  const getSwitchReachability = (sw: SwitchItem) => {
    // If explicitly defined on switch object:
    if (typeof sw.isReachable === "boolean") {
      return {
        isReachable: sw.isReachable,
        latencyMs: sw.latencyMs ?? (sw.isReachable ? 2.4 : null)
      };
    }
    // High reliability heuristic: Most switches are reachable, sw-03 or failed status can represent unreachable
    const isUnreachable = sw.lastBackupStatus === "Failed" || sw.hostname.includes("OFFLINE") || sw.ip.endsWith(".99");
    const lastIpNum = parseInt(sw.ip.split('.').pop() || "10", 10);
    const latency = isUnreachable ? null : Number((1.5 + (lastIpNum % 7) * 0.8).toFixed(1));
    return {
      isReachable: !isUnreachable,
      latencyMs: latency
    };
  };

  const reachableCount = useMemo(() => {
    return switches.filter(s => getSwitchReachability(s).isReachable).length;
  }, [switches]);

  const unreachableCount = useMemo(() => {
    return switches.filter(s => !getSwitchReachability(s).isReachable).length;
  }, [switches]);

  const filteredSwitches = useMemo(() => {
    return switches.filter((sw) => {
      const matchesOs = selectedOs === "ALL" || sw.os === selectedOs;
      
      // Reachability filter
      const reachability = getSwitchReachability(sw);
      if (reachabilityFilter === "REACHABLE" && !reachability.isReachable) return false;
      if (reachabilityFilter === "UNREACHABLE" && reachability.isReachable) return false;

      // Site filter
      if (activeSite) {
        const parts = sw.hostname.split(/[-_]/);
        const siteCode = parts.length >= 2 ? parts[1].trim().toUpperCase() : parts[0].trim().toUpperCase();
        if (siteCode !== activeSite && !sw.hostname.toUpperCase().includes(activeSite)) {
          return false;
        }
      }

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesOs;

      const matchesText =
        sw.hostname.toLowerCase().includes(q) ||
        sw.ip.toLowerCase().includes(q) ||
        sw.model.toLowerCase().includes(q) ||
        sw.macAddress.toLowerCase().includes(q) ||
        sw.serialNumber.toLowerCase().includes(q) ||
        sw.firmware.toLowerCase().includes(q) ||
        sw.ports.some((p) => p.name.toLowerCase().includes(q) || p.port.toLowerCase().includes(q)) ||
        sw.backupLldpNeighbors?.some(n => n.remoteSystemName.toLowerCase().includes(q) || n.localPort.toLowerCase().includes(q));

      return matchesOs && matchesText;
    });
  }, [switches, searchQuery, selectedOs, reachabilityFilter, activeSite]);

  const handleOpenSwitch = (sw: SwitchItem, defaultTab: "config" | "ports" | "lldp" | "guide" = "config") => {
    setSelectedSwitch(sw);
    setCustomIp(sw.ip);
    setCustomGateway(sw.gateway);
    setActiveSubTab(defaultTab);
  };

  const handleOpenLldpModal = (sw: SwitchItem, mode: "backup" | "live") => {
    setLldpModalSwitch(sw);
    setLldpModalMode(mode);
  };

  const handleOpenPortModal = (sw: SwitchItem, mode: "backup" | "live" = "live") => {
    setPortModalSwitch(sw);
    setPortModalMode(mode);
  };

  const handleOpenHistoryModal = (sw: SwitchItem) => {
    setHistoryModalSwitch(sw);
  };

  const handleCopyCardBackup = (sw: SwitchItem) => {
    navigator.clipboard.writeText(sw.activeConfig);
    setCopiedCardBackupId(sw.id);
    setTimeout(() => setCopiedCardBackupId(null), 2000);
  };

  const handleCopyIp = (ip: string, id: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIpId(id);
    setTimeout(() => setCopiedIpId(null), 1500);
  };

  const handleDownloadConfig = (sw: SwitchItem) => {
    const filename = `${sw.hostname}.${sw.configFormat}`;
    const blob = new Blob([sw.activeConfig], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Generate modified config if custom IP is provided
  const generatedConfig = useMemo(() => {
    if (!selectedSwitch) return "";
    let conf = selectedSwitch.activeConfig;
    if (customIp && customIp !== selectedSwitch.ip) {
      conf = conf.split(selectedSwitch.ip).join(customIp);
    }
    if (customGateway && customGateway !== selectedSwitch.gateway) {
      conf = conf.split(selectedSwitch.gateway).join(customGateway);
    }
    return conf;
  }, [selectedSwitch, customIp, customGateway]);

  // Extract specific sections for selective copying
  const extractedSections = useMemo(() => {
    if (!selectedSwitch) return { vlans: "", portDescs: "", management: "" };
    const lines = generatedConfig.split("\n");
    
    const vlanLines = lines.filter(l => 
      l.toLowerCase().includes("vlan") || 
      l.toLowerCase().includes("spbm") || 
      l.toLowerCase().includes("i-sid")
    );
    
    const portDescLines = lines.filter(l => 
      l.toLowerCase().includes("description") || 
      l.toLowerCase().includes("name \"")
    );

    const mgmtLines = lines.filter(l => 
      l.toLowerCase().includes("ipaddress") || 
      l.toLowerCase().includes("ip address") || 
      l.toLowerCase().includes("iproute") || 
      l.toLowerCase().includes("default-gateway") ||
      l.toLowerCase().includes("snmp") ||
      l.toLowerCase().includes("ssh")
    );

    return {
      vlans: vlanLines.join("\n"),
      portDescs: portDescLines.join("\n"),
      management: mgmtLines.join("\n")
    };
  }, [selectedSwitch, generatedConfig]);

  const handleOpenBounceModal = (sw: SwitchItem, port?: string) => {
    const initialPort = port || (sw.ports && sw.ports.length > 0 ? sw.ports[0].port : "1");
    setBouncePortSwitch(sw);
    setBouncePortDefault(initialPort);
  };

  const handleOpenBackupOptions = (sw: SwitchItem | null = null) => {
    setBackupModalTarget(sw);
    setBackupModalOpen(true);
  };

  const handleExecuteBackup = (options: BackupExecutionOptions) => {
    onTriggerBackup(options.scriptName, options.targetIp);
  };

  const toggleSelectSwitch = (id: string) => {
    setSelectedSwitchIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedSwitchIds.length === filteredSwitches.length) {
      setSelectedSwitchIds([]);
    } else {
      setSelectedSwitchIds(filteredSwitches.map(s => s.id));
    }
  };

  const handleBackupSelected = () => {
    if (selectedSwitchIds.length === 0) return;
    const firstSelected = switches.find(s => s.id === selectedSwitchIds[0]);
    onTriggerBackup("BackupSave.py", selectedSwitchIds.length === 1 && firstSelected ? firstSelected.ip : "ALL");
  };

  const handleSaveSchedule = async (newConfig: BackupScheduleConfig) => {
    const response = await fetch("/api/backup-schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: newConfig })
    });
    if (!response.ok) {
      throw new Error("Failed to persist backup schedule configuration");
    }
  };

  return (
    <div id="switch-replacement-hub-root" className="space-y-6">
      {/* Main Estate Backup Lifecycle & Next Scheduled Banner */}
      <EstateBackupScheduleCard
        liveStatus={liveStatus}
        totalSwitches={switches.length}
        onTriggerBackupAll={() => onTriggerBackup("BackupSave.py", "ALL")}
        isRunning={isRunning}
        onOpenScheduleModal={() => setScheduleModalOpen(true)}
      />

      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="switch-search-input"
              type="text"
              placeholder="Search switch by Hostname, IP, Model, MAC, Uplink, LLDP neighbor, or Port description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active Site Filter Tag (if filtered by sidebar) */}
          {activeSite && (
            <div className="flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/40 px-3 py-1.5 rounded-lg text-xs font-mono text-indigo-300 shrink-0">
              <span>Site: <strong>{activeSite}</strong></span>
              <button
                onClick={() => setActiveSite(null)}
                className="hover:text-white ml-1 text-slate-400 font-bold"
                title="Clear site filter"
              >
                ✕
              </button>
            </div>
          )}

          {/* Reachability & OS Filter Tabs & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Reachability Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
              <button
                id="filter-tab-reachability-all"
                onClick={() => setReachabilityFilter("ALL")}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  reachabilityFilter === "ALL" 
                    ? "bg-slate-800 text-white shadow font-semibold" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All ({switches.length})
              </button>
              <button
                id="filter-tab-reachability-reachable"
                onClick={() => setReachabilityFilter("REACHABLE")}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  reachabilityFilter === "REACHABLE" 
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700/80 shadow font-semibold" 
                    : "text-emerald-400/80 hover:text-emerald-300 hover:bg-slate-900"
                }`}
                title="Filter switches that respond to ICMP Ping and SSH"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Reachable ({reachableCount})</span>
              </button>
              <button
                id="filter-tab-reachability-unreachable"
                onClick={() => setReachabilityFilter("UNREACHABLE")}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  reachabilityFilter === "UNREACHABLE" 
                    ? "bg-rose-950 text-rose-300 border border-rose-700/80 shadow font-semibold" 
                    : "text-rose-400/80 hover:text-rose-300 hover:bg-slate-900"
                }`}
                title="Filter offline or unreachable switches"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Unreachable ({unreachableCount})</span>
              </button>
            </div>

            {/* OS Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
              <button
                onClick={() => setSelectedOs("ALL")}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                  selectedOs === "ALL" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                OS: All
              </button>
              <button
                onClick={() => setSelectedOs("EXOS")}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  selectedOs === "EXOS" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>EXOS ({switches.filter(s => s.os === "EXOS").length})</span>
              </button>
              <button
                onClick={() => setSelectedOs("VOSS")}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  selectedOs === "VOSS" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>VOSS ({switches.filter(s => s.os === "VOSS").length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Configure Multiple Switches Rollout Button (Strictly restricted to Network Admins) */}
              {(currentUserRole === "network_admin" || currentUser?.role === "network_admin") && (
                <button
                  id="btn-hub-rollout-config"
                  onClick={() => setRolloutModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition-all shrink-0 cursor-pointer"
                  title="Configure Multiple Switches (Network Admin Only)"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Multiple Switches</span>
                </button>
              )}

              {onOpenTopology && (
                <button
                  id="btn-hub-open-visual-topology"
                  onClick={onOpenTopology}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all shrink-0 cursor-pointer"
                  title="Open Interactive Visual Node Graph & LLDP Topology"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>🗺️ Visual Node Graph</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                </button>
              )}

              <button
                id="btn-hub-download-portal-py"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/script?file=portal_server.py");
                    const data = await res.json();
                    if (data && data.code) {
                      const blob = new Blob([data.code], { type: "text/x-python;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "portal_server.py";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } else {
                      window.location.href = "/api/download/portal_server.py";
                    }
                  } catch (e) {
                    window.location.href = "/api/download/portal_server.py";
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/80 hover:border-indigo-500 shadow transition-all shrink-0"
                title="1-Click Download updated portal_server.py to overwrite in your Ubuntu / Windows script directory"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>📥 Download portal_server.py</span>
              </button>

              <button
                id="btn-hub-backup-options"
                onClick={() => handleOpenBackupOptions(null)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0"
                title="Open Advanced Backup Options & Parameters dialog"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Backup Options</span>
              </button>

              <button
                id="btn-hub-backup-all"
                onClick={() => onTriggerBackup("BackupSave.py", "ALL")}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all shrink-0 ${
                  isRunning
                    ? "bg-amber-600 text-white cursor-not-allowed opacity-80"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
                title="Run BackupSave.py on all switches in Switches.txt"
              >
                {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
                <span>{isRunning ? "Backup Running..." : "🚀 Backup All Switches"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Panel View: Collapsible Site Sidebar + Switch Grid Area */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Collapsible Left Rail / Hierarchy Sidebar */}
        <SiteSidebar
          switches={switches}
          activeSite={activeSite}
          selectedSwitchId={selectedSwitch?.id || null}
          onSelectSite={(site) => setActiveSite(site)}
          onSelectSwitch={(sw) => handleOpenSwitch(sw)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Right Main Grid & Batch Area */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {activeSite ? (
            <SitePageView
              siteCode={activeSite}
              switches={switches}
              onBackToAll={() => setActiveSite(null)}
              onSelectSwitch={(sw) => handleOpenSwitch(sw)}
              onTriggerBackup={onTriggerBackup}
              currentUser={currentUser}
              currentUserRole={currentUserRole}
            />
          ) : (
            <>
              {/* Batch Selection Bar (if any selected) */}
              {selectedSwitchIds.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/80 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      <strong>{selectedSwitchIds.length}</strong> of {filteredSwitches.length} switches selected
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSelectAllFiltered}
                      className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                    >
                      {selectedSwitchIds.length === filteredSwitches.length ? "Deselect All" : "Select All"}
                    </button>

                    <button
                      onClick={handleBackupSelected}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Backup Selected ({selectedSwitchIds.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Switch Inventory Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSwitches.map((sw) => {
                const isExos = sw.os === "EXOS";
                const neighborCount = sw.backupLldpNeighbors?.length || 0;
                const portCount = sw.ports?.length || 0;
                const revisionCount = (sw.previousRevisions?.length || 0) + 1;
                const isSelected = selectedSwitchIds.includes(sw.id);
                const isCopiedBackup = copiedCardBackupId === sw.id;
                const isCopiedIp = copiedIpId === sw.id;
                const reachability = getSwitchReachability(sw);

          return (
            <div
              key={sw.id}
              id={`switch-card-${sw.id}`}
              className={`bg-slate-900 border transition-all rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-md ${
                isSelected ? "border-indigo-500/80 ring-1 ring-indigo-500/40" : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                {/* Header row: Checkbox, Hostname, Management IP, and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectSwitch(sw.id)}
                      className="mt-1 accent-indigo-500 rounded cursor-pointer"
                      title="Select for batch backup"
                    />
                    <div>
                      {/* Hostname + OS Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          isExos 
                            ? "bg-indigo-950/80 text-indigo-300 border border-indigo-700/50" 
                            : "bg-purple-950/80 text-purple-300 border border-purple-700/50"
                        }`}>
                          {sw.os}
                        </span>
                        <h3 className="font-mono font-bold text-white text-base tracking-tight">{sw.hostname}</h3>
                      </div>

                      {/* Prominent Management IP with 1-click copy */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400 font-mono">IP:</span>
                        <button
                          onClick={() => handleCopyIp(sw.ip, sw.id)}
                          className="font-mono text-sm font-bold text-emerald-400 hover:text-emerald-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 hover:border-emerald-700/60 flex items-center gap-1.5 transition-colors group"
                          title="Click to copy switch IP"
                        >
                          <span>{sw.ip}</span>
                          {isCopiedIp ? (
                            <Check className="w-3 h-3 text-emerald-300" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                          )}
                        </button>
                        <span className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]" title={sw.model}>
                          {sw.model}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {/* Reachability & Ping Latency Badge */}
                    <div className="flex items-center gap-1.5">
                      {reachability.isReachable ? (
                        <div className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 font-mono shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="font-bold">{reachability.latencyMs ?? 2} ms</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-rose-950/90 text-rose-300 border border-rose-800/80 font-mono shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span className="font-bold">Offline</span>
                        </div>
                      )}

                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        sw.lastBackupStatus === "Success"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                          : "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{sw.lastBackupStatus}</span>
                      </span>
                    </div>

                    {/* Historical Revisions count button */}
                    <button
                      onClick={() => handleOpenHistoryModal(sw)}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800 hover:border-indigo-600 transition-colors font-mono"
                      title="Access previous backup revisions"
                    >
                      <History className="w-3 h-3 text-indigo-400" />
                      <span>{revisionCount} {revisionCount === 1 ? "Backup" : "Backups"}</span>
                    </button>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Firmware</span>
                    <span className="text-slate-300 truncate block">{sw.firmware}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">MAC Address</span>
                    <span className="text-slate-300">{sw.macAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Gateway</span>
                    <span className="text-slate-300">{sw.gateway}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Uplinks</span>
                    <span className="text-indigo-400 font-semibold">{sw.uplinkPorts.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Last Saved</span>
                    <span className="text-slate-400">{sw.lastBackupTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Format</span>
                    <span className="text-emerald-400 font-bold uppercase">.{sw.configFormat}</span>
                  </div>
                </div>

                {/* Notes if present */}
                {sw.notes && (
                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 italic">
                    {sw.notes}
                  </p>
                )}
              </div>

              {/* ACTION TOOLBAR: All 5 Requested Core Features on Every Switch */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                
                {/* Row 1: Live Monitoring & Inspection Buttons (Monitor CPU/Temp/Mem, Ports Live, LLDP Live, Ping/Reachability) */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    id={`btn-card-monitor-${sw.id}`}
                    onClick={() => setMonitorModalSwitch(sw)}
                    className="flex items-center justify-center gap-1 px-1.5 py-2 rounded-lg text-xs font-bold bg-indigo-950/90 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 hover:border-indigo-500 transition-all shadow-sm group truncate"
                    title={`Monitor live CPU utilization %, Temperature, and Memory % for ${sw.hostname} (${sw.ip})`}
                  >
                    <Activity className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span>Monitor</span>
                  </button>

                  <button
                    id={`btn-card-ports-live-${sw.id}`}
                    onClick={() => handleOpenPortModal(sw, "live")}
                    className="flex items-center justify-center gap-1 px-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800 hover:border-emerald-600/60 transition-all shadow-sm group truncate"
                    title="Query live port descriptions, PoE, and speed via SSH"
                  >
                    <Network className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span>Ports</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono hidden sm:inline">
                      {portCount}
                    </span>
                  </button>

                  <button
                    id={`btn-card-lldp-live-${sw.id}`}
                    onClick={() => handleOpenLldpModal(sw, "live")}
                    className="flex items-center justify-center gap-1 px-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 hover:border-purple-600/60 transition-all shadow-sm group truncate"
                    title="Execute show lldp neighbors detailed live via SSH"
                  >
                    <Radio className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span>LLDP</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono hidden sm:inline">
                      {neighborCount}
                    </span>
                  </button>

                  <button
                    id={`btn-card-ping-${sw.id}`}
                    onClick={() => setPingModalSwitch(sw)}
                    className="flex items-center justify-center gap-1 px-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-600/60 transition-all shadow-sm group truncate"
                    title={`Ping and check live reachability for ${sw.hostname} (${sw.ip})`}
                  >
                    <Wifi className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span>Ping</span>
                  </button>
                </div>

                {/* Row 2: Backup Operations (Copy Backup, Previous Backups, Backup Switch, Workspace) */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    
                    {/* 1-Click Copy Backup Button */}
                    <button
                      id={`btn-copy-backup-${sw.id}`}
                      onClick={() => handleCopyCardBackup(sw)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
                      title="Copy full active switch configuration to clipboard"
                    >
                      {isCopiedBackup ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{isCopiedBackup ? "Copied Backup!" : "Copy Backup"}</span>
                    </button>

                    {/* Previous Backups History Button */}
                    <button
                      id={`btn-history-backup-${sw.id}`}
                      onClick={() => handleOpenHistoryModal(sw)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                      title="Browse and access previously taken backup archives"
                    >
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>History</span>
                    </button>

                    {/* Direct Backup Switch Button */}
                    <button
                      id={`btn-backup-switch-${sw.id}`}
                      onClick={() => onTriggerBackup("BackupSave.py", sw.ip)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 transition-colors shadow-sm"
                      title={`Trigger BackupSave.py specifically for ${sw.hostname} (${sw.ip})`}
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                      <span>Backup Switch</span>
                    </button>

                    {/* Bounce Port with MAC Confirmation Button */}
                    <button
                      id={`btn-bounce-port-${sw.id}`}
                      onClick={() => handleOpenBounceModal(sw)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/60 transition-colors shadow-sm"
                      title={`Bounce switch port with MAC learning confirmation on ${sw.hostname} (${sw.ip})`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Bounce Port</span>
                    </button>
                  </div>

                  {/* Replacement Workspace button */}
                  <button
                    id={`btn-open-replacement-workspace-${sw.id}`}
                    onClick={() => handleOpenSwitch(sw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all ml-auto"
                    title="Open Replacement Workspace & IP Customizer"
                  >
                    <span>Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSwitches.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h4 className="text-slate-300 font-semibold text-sm">No matching switches found</h4>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or filter.</p>
        </div>
      )}
            </>
          )}
        </div>
      </div>

      {/* Standalone LLDP Neighbor Modal */}
      {lldpModalSwitch && (
        <LldpNeighborModal
          switchItem={lldpModalSwitch}
          initialMode={lldpModalMode}
          onClose={() => setLldpModalSwitch(null)}
        />
      )}

      {/* Standalone Port Description Modal */}
      {portModalSwitch && (
        <PortDescriptionModal
          switchItem={portModalSwitch}
          initialMode={portModalMode}
          onClose={() => setPortModalSwitch(null)}
        />
      )}

      {/* Standalone Previous Backups Modal */}
      {historyModalSwitch && (
        <PreviousBackupsModal
          switchItem={historyModalSwitch}
          onClose={() => setHistoryModalSwitch(null)}
        />
      )}

      {/* Standalone Bounce Port Modal */}
      {bouncePortSwitch && (
        <BouncePortModal
          switchItem={bouncePortSwitch}
          isOpen={!!bouncePortSwitch}
          defaultPort={bouncePortDefault}
          onClose={() => setBouncePortSwitch(null)}
          currentUser={currentUser}
        />
      )}

      {/* Standalone Rollout Configuration Change Modal */}
      <RolloutConfigModal
        isOpen={rolloutModalOpen}
        switches={switches}
        currentUserRole={currentUserRole}
        currentUser={currentUser}
        onClose={() => setRolloutModalOpen(false)}
      />

      {/* Switch Telemetry Monitor Modal (CPU %, Temperature, Memory %) */}
      <SwitchMonitorModal
        isOpen={!!monitorModalSwitch}
        onClose={() => setMonitorModalSwitch(null)}
        switchItem={monitorModalSwitch}
      />

      {/* Network Reachability & Ping Modal */}
      <SwitchPingModal
        isOpen={!!pingModalSwitch}
        onClose={() => setPingModalSwitch(null)}
        switchItem={pingModalSwitch}
        currentUser={currentUser}
      />

      {/* Switch Replacement Modal / Workspace */}
      {selectedSwitch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                  selectedSwitch.os === "EXOS" 
                    ? "bg-indigo-950 text-indigo-300 border border-indigo-800" 
                    : "bg-purple-950 text-purple-300 border border-purple-800"
                }`}>
                  {selectedSwitch.os}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    {selectedSwitch.hostname}
                    <span className="text-xs font-normal text-slate-400 font-sans">({selectedSwitch.model})</span>
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Original IP: <span className="text-emerald-400 font-bold">{selectedSwitch.ip}</span> | Gateway: {selectedSwitch.gateway} | MAC: {selectedSwitch.macAddress}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id={`modal-btn-monitor-switch-${selectedSwitch.id}`}
                  onClick={() => setMonitorModalSwitch(selectedSwitch)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 shadow"
                  title="Monitor live CPU %, Temperature, and Memory %"
                >
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Monitor Live</span>
                </button>

                <button
                  id={`modal-btn-ping-switch-${selectedSwitch.id}`}
                  onClick={() => setPingModalSwitch(selectedSwitch)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 shadow"
                  title="Ping & test live reachability for this switch"
                >
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ping Switch</span>
                </button>

                <button
                  id={`modal-btn-backup-switch-${selectedSwitch.id}`}
                  onClick={() => onTriggerBackup("BackupSave.py", selectedSwitch.ip)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                  title={`Run BackupSave.py for ${selectedSwitch.hostname}`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Backup Switch</span>
                </button>

                <button
                  onClick={() => handleOpenHistoryModal(selectedSwitch)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  title="Access previous backup revisions for this switch"
                >
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Previous Backups</span>
                </button>

                <button
                  onClick={() => handleOpenPortModal(selectedSwitch, "live")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
                  title="Show Port Descriptions Live"
                >
                  <Network className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ports Live</span>
                </button>

                <button
                  onClick={() => handleOpenLldpModal(selectedSwitch, "live")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700"
                  title="Query LLDP Neighbors Detailed Live via SSH"
                >
                  <Radio className="w-3.5 h-3.5 text-indigo-400" />
                  <span>LLDP Live</span>
                </button>

                <button
                  onClick={() => handleDownloadConfig(selectedSwitch)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download .{selectedSwitch.configFormat}</span>
                </button>
                
                <button
                  onClick={() => setSelectedSwitch(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-lg leading-none px-2.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-4 bg-slate-950/30 text-xs font-medium overflow-x-auto">
              <button
                onClick={() => setActiveSubTab("config")}
                className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeSubTab === "config"
                    ? "border-indigo-500 text-indigo-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Config Inspector & IP Customizer</span>
              </button>

              <button
                onClick={() => setActiveSubTab("ports")}
                className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeSubTab === "ports"
                    ? "border-indigo-500 text-indigo-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Network className="w-4 h-4" />
                <span>Port Map & Uplink Audits ({selectedSwitch.ports.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab("lldp")}
                className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeSubTab === "lldp"
                    ? "border-indigo-500 text-indigo-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>LLDP Neighbors Detailed ({selectedSwitch.backupLldpNeighbors?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveSubTab("diagram")}
                className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeSubTab === "diagram"
                    ? "border-indigo-500 text-indigo-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Visio Site Diagram</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {findDiagramForSiteOrSwitch(selectedSwitch.hostname)?.tabName || "Site Diagram"}
                </span>
              </button>

              <button
                onClick={() => setActiveSubTab("guide")}
                className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeSubTab === "guide"
                    ? "border-indigo-500 text-indigo-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Restore Commands Cheat Sheet</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {activeSubTab === "config" && (
                <div className="space-y-4">
                  {/* IP Customizer Box */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <Settings2 className="w-4 h-4 text-indigo-400" />
                        <span>Replacement Switch IP Customizer (Optional)</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Type a new IP to automatically modify configuration lines on the fly
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 font-mono mb-1">Replacement Management IP</label>
                        <input
                          type="text"
                          value={customIp}
                          onChange={(e) => setCustomIp(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 font-mono mb-1">Default Gateway</label>
                        <input
                          type="text"
                          value={customGateway}
                          onChange={(e) => setCustomGateway(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Selective Section Copy Action Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedConfig, "all-conf")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                    >
                      {copiedSection === "all-conf" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Full Configuration</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(extractedSections.vlans, "vlans")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    >
                      {copiedSection === "vlans" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy VLANs & Tags</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(extractedSections.portDescs, "portDescs")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    >
                      {copiedSection === "portDescs" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Port Descriptions</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(extractedSections.management, "mgmt")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    >
                      {copiedSection === "mgmt" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Management & Gateway</span>
                    </button>
                  </div>

                  {/* Syntax Preview Code Area */}
                  <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{selectedSwitch.hostname}.{selectedSwitch.configFormat}</span>
                      <span>{generatedConfig.split("\n").length} lines</span>
                    </div>

                    <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-96 leading-relaxed">
                      {generatedConfig}
                    </pre>
                  </div>
                </div>
              )}

              {activeSubTab === "ports" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Port descriptions and VLAN assignments extracted from the switch audit report.
                    </span>
                    <button
                      onClick={() => handleOpenPortModal(selectedSwitch, "live")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Launch Live Port Auditor</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 px-4 font-semibold">Port</th>
                          <th className="py-2.5 px-4 font-semibold">Description / Label</th>
                          <th className="py-2.5 px-4 font-semibold">Admin (Enable)</th>
                          <th className="py-2.5 px-4 font-semibold">Link State</th>
                          <th className="py-2.5 px-4 font-semibold">VLAN Assignment</th>
                          <th className="py-2.5 px-4 font-semibold">Speed</th>
                          <th className="py-2.5 px-4 font-semibold">PoE Power</th>
                          <th className="py-2.5 px-4 font-semibold">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 text-slate-300">
                        {selectedSwitch.ports.map((port) => {
                          const adminState = port.adminState || (port.status === "disabled" ? "disabled" : "enabled");
                          const linkState = port.linkState || (port.status === "up" ? "active" : port.status === "disabled" ? "disabled" : "ready");
                          const isEnabled = adminState === "enabled";
                          const isActive = linkState === "active" || port.status === "up";
                          const isReady = linkState === "ready" || (!isActive && isEnabled);

                          return (
                            <tr key={port.port} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-4 font-bold text-slate-100">{port.port}</td>
                              <td className="py-2.5 px-4 text-emerald-300">{port.name || "—"}</td>
                              <td className="py-2.5 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isEnabled ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-rose-950 text-rose-300 border border-rose-800"
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${isEnabled ? "bg-emerald-400" : "bg-rose-400"}`} />
                                  {isEnabled ? "ENABLED" : "DISABLED"}
                                </span>
                              </td>
                              <td className="py-2.5 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isActive ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : isReady ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-slate-900 text-slate-400 border border-slate-700"
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${isActive ? "bg-emerald-400" : isReady ? "bg-amber-400 animate-pulse" : "bg-slate-500"}`} />
                                  {isActive ? "ACTIVE (UP)" : isReady ? "READY" : "DOWN"}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-slate-300">{port.vlan}</td>
                              <td className="py-2.5 px-4 text-slate-400">{port.speed}</td>
                              <td className="py-2.5 px-4 text-amber-400">
                                {port.poeEnabled ? `${port.poeWattage}W (Active)` : "—"}
                              </td>
                              <td className="py-2.5 px-4">
                                {port.isUplink ? (
                                  <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                    CRITICAL UPLINK
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">Access</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSubTab === "lldp" && (
                <div className="space-y-4">
                  {/* Subtab Header Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <Radio className="w-4 h-4 text-indigo-400" />
                        <span>LLDP Neighbors Detailed Inspector</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        CLI Command: <code className="text-emerald-400">{selectedSwitch.os === "EXOS" ? "show lldp neighbors detailed" : "show lldp neighbor"}</code>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {onOpenTopology && (
                        <button
                          onClick={onOpenTopology}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                        >
                          <Network className="w-3.5 h-3.5" />
                          <span>🗺️ Open Visual Topology Graph</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenLldpModal(selectedSwitch, "backup")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow"
                      >
                        <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Launch Backup Explorer</span>
                      </button>

                      <button
                        onClick={() => handleOpenLldpModal(selectedSwitch, "live")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Launch Live Telnet Query</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline LLDP table preview */}
                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 px-4 font-semibold">Local Port</th>
                          <th className="py-2.5 px-4 font-semibold">Discovered Remote Device</th>
                          <th className="py-2.5 px-4 font-semibold">Remote Port</th>
                          <th className="py-2.5 px-4 font-semibold">Management IP</th>
                          <th className="py-2.5 px-4 font-semibold">Capabilities</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 text-slate-300">
                        {(selectedSwitch.backupLldpNeighbors || []).map((n) => (
                          <tr key={n.localPort} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 px-4 font-bold text-white">Port {n.localPort}</td>
                            <td className="py-2.5 px-4 font-semibold text-emerald-400">{n.remoteSystemName}</td>
                            <td className="py-2.5 px-4 text-slate-300">{n.remotePortId}</td>
                            <td className="py-2.5 px-4 text-emerald-300">{n.remoteMgmtIp || "—"}</td>
                            <td className="py-2.5 px-4">
                              <span className="text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                {n.remoteCapabilities.join(", ")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSubTab === "diagram" && (
                <div className="space-y-4">
                  {(() => {
                    const matchedDiagram = findDiagramForSiteOrSwitch(selectedSwitch.hostname) || findDiagramForSiteOrSwitch(selectedSwitch.ip);
                    return (
                      <div className="space-y-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                              <Layers className="w-4 h-4 text-emerald-400" />
                              Matched Network Site: <strong className="text-white">{matchedDiagram?.siteName || selectedSwitch.hostname}</strong>
                            </span>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              Visio Source: <span className="text-indigo-300">{matchedDiagram?.sourceFile || "DLC 2.vsdx"}</span> | Tab: <span className="text-emerald-300">{matchedDiagram?.tabName || `DLC - ${selectedSwitch.hostname}`}</span>
                            </div>
                          </div>

                          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                            ✓ Auto-Matched from Switch Hostname
                          </span>
                        </div>

                        {/* Interactive Blueprint Render */}
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                                {matchedDiagram?.siteName.toUpperCase() || selectedSwitch.hostname} - RACK & FIBER TOPOLOGY
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                Switch: {selectedSwitch.hostname} ({selectedSwitch.ip})
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Active Switch Panel */}
                              <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-indigo-300 font-mono">{selectedSwitch.hostname}</span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                                    Target Switch ({selectedSwitch.os})
                                  </span>
                                </div>
                                <div className="text-xs font-mono text-slate-300 space-y-1">
                                  <div>IP: <strong className="text-emerald-400">{selectedSwitch.ip}</strong></div>
                                  <div>Model: <span className="text-slate-400">{selectedSwitch.model}</span></div>
                                  <div>Uplinks: <span className="text-indigo-400">{selectedSwitch.uplinkPorts.join(", ")}</span></div>
                                </div>
                              </div>

                              {/* Core / Peer Uplink Partner */}
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-200 font-mono">
                                    {selectedSwitch.backupLldpNeighbors?.[0]?.remoteSystemName || "CORE-SPINE-01"}
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                                    Discovered Uplink Peer
                                  </span>
                                </div>
                                <div className="text-xs font-mono text-slate-400 space-y-1">
                                  <div>Peer Port: <strong className="text-slate-200">{selectedSwitch.backupLldpNeighbors?.[0]?.remotePortId || "Port 1/1"}</strong></div>
                                  <div>Remote IP: <span className="text-slate-300">{selectedSwitch.backupLldpNeighbors?.[0]?.remoteMgmtIp || "10.36.226.1"}</span></div>
                                  <div>Link Type: <span className="text-emerald-400">10GbE SFP+ Fiber Trunk</span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeSubTab === "guide" && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
                    <div className="text-indigo-400 font-bold">
                      # Console Command Steps for {selectedSwitch.hostname} ({selectedSwitch.os})
                    </div>
                    {selectedSwitch.os === "EXOS" ? (
                      <>
                        <div className="text-slate-400"># 1. Boot replacement switch, connect via console (9600 8-N-1)</div>
                        <div className="text-slate-400"># 2. Reset to factory state:</div>
                        <div className="text-slate-200">unconfigure switch all</div>
                        <div className="text-slate-200">reboot</div>
                        <div className="text-slate-400 mt-2"># 3. Apply temporary IP to download configuration:</div>
                        <div className="text-slate-200">configure vlan Default ipaddress {customIp || selectedSwitch.ip} 255.255.255.0</div>
                        <div className="text-slate-200">configure iproute add default {customGateway || selectedSwitch.gateway}</div>
                        <div className="text-slate-400 mt-2"># 4. Pull script from internal Ubuntu TFTP server:</div>
                        <div className="text-slate-200">tftp get 10.36.226.7 vr "VR-Default" {selectedSwitch.hostname}.xsf</div>
                        <div className="text-slate-200">load configuration {selectedSwitch.hostname}.xsf</div>
                        <div className="text-slate-200">save configuration</div>
                      </>
                    ) : (
                      <>
                        <div className="text-slate-400"># 1. Boot VOSS switch, connect via console (9600 8-N-1)</div>
                        <div className="text-slate-200">enable</div>
                        <div className="text-slate-200">config t</div>
                        <div className="text-slate-400 mt-2"># 2. Copy config to config.cfg from Ubuntu TFTP server:</div>
                        <div className="text-slate-200">copy tftp 10.36.226.7 {selectedSwitch.hostname}.cfg config.cfg</div>
                        <div className="text-slate-200">boot config flags config-file config.cfg</div>
                        <div className="text-slate-200">reset -y</div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Backup Options Modal */}
      <BackupOptionsModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        targetSwitch={backupModalTarget}
        allSwitches={switches}
        onExecuteBackup={handleExecuteBackup}
        isRunning={isRunning}
      />

      {/* Automated Backup Scheduler Modal */}
      <BackupScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        liveStatus={liveStatus || null}
        totalSwitches={switches.length}
        onSaveSchedule={handleSaveSchedule}
        onTriggerBackupNow={() => onTriggerBackup("BackupSave.py", "ALL")}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
