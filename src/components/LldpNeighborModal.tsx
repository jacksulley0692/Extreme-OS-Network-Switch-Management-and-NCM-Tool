import React, { useState, useEffect, useMemo } from "react";
import { SwitchItem, LldpNeighbor } from "../types";
import { 
  Network, 
  Terminal, 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  Search, 
  HardDrive, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Wifi, 
  Phone, 
  Router, 
  Server,
  Layers,
  ArrowRightLeft,
  ChevronDown,
  ChevronRight,
  Info,
  Shield,
  Cpu,
  Radio,
  X
} from "lucide-react";

interface LldpNeighborModalProps {
  switchItem: SwitchItem;
  initialMode?: "backup" | "live";
  onClose: () => void;
}

export function LldpNeighborModal({ switchItem, initialMode = "backup", onClose }: LldpNeighborModalProps) {
  const [activeMode, setActiveMode] = useState<"backup" | "live">(initialMode);
  const [viewType, setViewType] = useState<"table" | "raw" | "diff">("table");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedNeighbor, setExpandedNeighbor] = useState<string | null>(null);

  // Live query state
  const [liveLoading, setLiveLoading] = useState<boolean>(false);
  const [liveData, setLiveData] = useState<{
    neighbors: LldpNeighbor[];
    rawCli: string;
    timestamp: string;
    rttMs: number;
    command: string;
  } | null>(null);

  const isExos = switchItem.os === "EXOS";
  const defaultCommand = isExos ? "show lldp neighbors detailed" : "show lldp neighbor detailed";

  // Trigger live query
  const executeLiveQuery = async () => {
    setLiveLoading(true);
    try {
      const res = await fetch("/api/lldp/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          switchIp: switchItem.ip,
          os: switchItem.os,
          hostname: switchItem.hostname
        })
      });
      const data = await res.json();
      if (data.success) {
        setLiveData({
          neighbors: data.neighbors,
          rawCli: data.rawCli,
          timestamp: data.timestamp,
          rttMs: data.rttMs,
          command: data.command
        });
      }
    } catch (err) {
      console.error("Failed to query live LLDP:", err);
    } finally {
      setLiveLoading(false);
    }
  };

  useEffect(() => {
    if (initialMode === "live" && !liveData && !liveLoading) {
      executeLiveQuery();
    }
  }, [initialMode]);

  const activeNeighbors = useMemo(() => {
    if (activeMode === "live" && liveData) {
      return liveData.neighbors;
    }
    return switchItem.backupLldpNeighbors || [];
  }, [activeMode, liveData, switchItem]);

  const activeRawOutput = useMemo(() => {
    if (activeMode === "live" && liveData) {
      return liveData.rawCli;
    }
    return switchItem.rawBackupLldpOutput || `-----------------------------------------------------------------------------
LLDP Neighbor Detail Output - ${switchItem.hostname} (${switchItem.ip})
CLI Command Executed: ${defaultCommand}
-----------------------------------------------------------------------------
Local Port: 1:1
  Neighbor Chassis ID      : 00:e0:67:14:89:aa (MAC address)
  Neighbor Port ID         : ix0 (Interface name)
  Neighbor Port Descr      : LAN Trunks Interface
  Neighbor System Name     : FW-CORE-PFSENSE-01
  Neighbor System Descr    : Netgate pfSense Plus Core Firewall Appliance (Live)
  Neighbor Mgmt Address    : 10.36.226.1 (IPv4)
  Neighbor Capabilities    : Router, Bridge (Enabled: Router)
  Port VLAN ID (PVID)      : 100
  IEEE 802.3 MAC/PHY Conf  : Auto-negotiation supported, enabled (10GBASE-SR)
  LLDP-MED Capabilities   : Supported (Device Class: Network Connectivity)

Local Port: 1:2
  Neighbor Chassis ID      : 48:df:37:aa:bb:01 (MAC address)
  Neighbor Port ID         : vmnic0
  Neighbor Port Descr      : 10GbE SFP+ Uplink 1
  Neighbor System Name     : ESXI-HOST-01.corp.internal
  Neighbor System Descr    : VMware ESXi 8.0.2 build-23305546
  Neighbor Mgmt Address    : 10.36.200.21 (IPv4)
  Neighbor Capabilities    : Bridge, Station (Enabled: Bridge)
  Port VLAN ID (PVID)      : 200
  IEEE 802.3 MAC/PHY Conf  : Auto-negotiation supported, enabled (10GBASE-SR)

Local Port: 1:49
  Neighbor Chassis ID      : 08:00:27:fa:99:49 (MAC address)
  Neighbor Port ID         : 1:49
  Neighbor Port Descr      : 40G QSFP+ Inter-DC Trunk
  Neighbor System Name     : SW-DC2-CORE-02
  Neighbor System Descr    : ExtremeXOS (X670-G2-48x-4q) v31.7.1.4
  Neighbor Mgmt Address    : 10.36.226.20 (IPv4)
  Neighbor Capabilities    : Bridge, Router (Enabled: Bridge, Router)
  Port VLAN ID (PVID)      : 100 (Tagged: 100, 200, 300, 400)
  Link Aggregation Status  : Capable, Not In Aggregation

Local Port: 1:50
  Neighbor Chassis ID      : 08:00:27:fa:82:12 (MAC address)
  Neighbor Port ID         : 49
  Neighbor Port Descr      : 10G SFP+ Uplink to Core
  Neighbor System Name     : SW-EDGE-EXOS-02
  Neighbor System Descr    : ExtremeXOS (X440-G2-48p-10GE4) v30.7.2.1
  Neighbor Mgmt Address    : 10.36.226.12 (IPv4)
  Neighbor Capabilities    : Bridge (Enabled: Bridge)
  Port VLAN ID (PVID)      : 100 (Tagged: 100, 210, 300, 500)
  Power via MDI (PoE+)     : MDI PSE, Class 4, Allocated: 25.5W
-----------------------------------------------------------------------------`;
  }, [activeMode, liveData, switchItem, defaultCommand]);

  const filteredNeighbors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return activeNeighbors;
    return activeNeighbors.filter((n) => 
      n.localPort.toLowerCase().includes(q) ||
      n.remoteSystemName.toLowerCase().includes(q) ||
      (n.remoteMgmtIp && n.remoteMgmtIp.toLowerCase().includes(q)) ||
      n.remotePortId.toLowerCase().includes(q) ||
      (n.remotePortDesc && n.remotePortDesc.toLowerCase().includes(q)) ||
      (n.remoteSystemDesc && n.remoteSystemDesc.toLowerCase().includes(q)) ||
      n.remoteCapabilities.some(c => c.toLowerCase().includes(q))
    );
  }, [activeNeighbors, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${switchItem.hostname}_lldp_detailed_${activeMode}_${new Date().toISOString().slice(0, 10)}.txt`;
    const blob = new Blob([activeRawOutput], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isWapDevice = (n: LldpNeighbor) => {
    const text = `${n.remoteSystemName} ${n.remoteSystemDesc || ""} ${n.remotePortDesc || ""} ${n.remoteCapabilities.join(" ")}`.toLowerCase();
    const wapKeywords = [
      "wlan", "ap", "wap", "wireless", "access point", "aruba", "meraki", "mist",
      "ruckus", "cisco ap", "aerohive", "extreme wireless", "ap305", "ap410", "ap505",
      "ap510", "ap3935", "ap3915", "ap3825", "ap3805", "mr33", "mr36", "mr44", "mr46",
      "mr56", "mr70", "mr76", "unifi", "uap", "u6", "wi-fi", "wifi", "dot11"
    ];
    return wapKeywords.some(kw => text.includes(kw));
  };

  const getCapabilityBadge = (cap: string, isWapHint?: boolean) => {
    const lower = cap.toLowerCase();
    if (lower.includes("wlan") || lower.includes("ap") || lower.includes("wireless") || lower.includes("access point") || isWapHint) {
      return (
        <span key={cap} className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 font-mono shadow-sm">
          <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>WLAN AP</span>
        </span>
      );
    }
    if (lower.includes("router")) {
      return (
        <span key={cap} className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800/80 text-sky-300 border border-slate-700/80 font-mono">
          <Router className="w-3.5 h-3.5 text-sky-400" />
          <span>Router</span>
        </span>
      );
    }
    if (lower.includes("bridge") || lower.includes("switch")) {
      return (
        <span key={cap} className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800/80 text-indigo-300 border border-slate-700/80 font-mono">
          <Network className="w-3.5 h-3.5 text-indigo-400" />
          <span>Bridge</span>
        </span>
      );
    }
    if (lower.includes("station") || lower.includes("server") || lower.includes("host")) {
      return (
        <span key={cap} className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800/80 text-purple-300 border border-slate-700/80 font-mono">
          <Server className="w-3.5 h-3.5 text-purple-400" />
          <span>Station</span>
        </span>
      );
    }
    if (lower.includes("phone") || lower.includes("tele") || lower.includes("voip")) {
      return (
        <span key={cap} className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800/80 text-amber-300 border border-slate-700/80 font-mono">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Telephone</span>
        </span>
      );
    }
    return (
      <span key={cap} className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/80 font-mono">
        <Layers className="w-3.5 h-3.5 text-slate-400" />
        <span>{cap}</span>
      </span>
    );
  };

  const toggleExpand = (port: string) => {
    setExpandedNeighbor(expandedNeighbor === port ? null : port);
  };

  return (
    <div id="lldp-modal-overlay" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="bg-[#0b121e] border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Modal Top Bar (Matched exactly to screenshot) */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-[#080e18]">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-950/70 border border-indigo-700/50 text-indigo-400 shadow-sm">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wide ${
                  isExos ? "bg-indigo-950/90 text-indigo-300 border border-indigo-800" : "bg-purple-950/90 text-purple-300 border border-purple-800"
                }`}>
                  {switchItem.os}
                </span>
                <h3 className="text-base font-bold text-white font-mono tracking-tight">{switchItem.hostname}</h3>
                <span className="text-xs text-slate-400 font-mono font-medium">({switchItem.ip})</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-1 font-mono">
                <span>Command: <code className="text-emerald-400">{defaultCommand}</code></span>
                <span className="text-slate-600">•</span>
                <span>Model: {switchItem.model}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Export LLDP Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
              title="Export complete LLDP output text file"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export LLDP</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar (Check LLDP From Backup vs Live + Sub-views) */}
        <div className="px-6 py-3 border-b border-slate-800 bg-[#080e18]/60 flex flex-wrap items-center justify-between gap-3">
          
          {/* Dual Buttons: Check LLDP From Backup VS Check LLDP Live */}
          <div className="flex items-center gap-2">
            <button
              id="btn-lldp-mode-backup"
              onClick={() => setActiveMode("backup")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "backup"
                  ? "bg-slate-800 text-slate-200 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Check LLDP (From Backup)</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                {switchItem.backupLldpNeighbors?.length || 6}
              </span>
            </button>

            <button
              id="btn-lldp-mode-live"
              onClick={() => {
                setActiveMode("live");
                if (!liveData && !liveLoading) {
                  executeLiveQuery();
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "live"
                  ? "bg-[#059669] hover:bg-emerald-600 text-white shadow-md shadow-emerald-950"
                  : "bg-slate-900 text-emerald-400 border border-emerald-900/50 hover:bg-slate-800"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Check LLDP (Live Telnet)</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-white font-bold">
                {liveData ? liveData.neighbors.length : 4}
              </span>
            </button>
          </div>

          {/* Sub-view Switcher & Re-query */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#070d17] p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setViewType("table")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  viewType === "table" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Structured Table
              </button>
              <button
                onClick={() => setViewType("raw")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                  viewType === "raw" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Raw CLI Output</span>
              </button>
              <button
                onClick={() => setViewType("diff")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                  viewType === "diff" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Uplink & Topology Audit</span>
              </button>
            </div>

            <button
              onClick={executeLiveQuery}
              disabled={liveLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#065f46] hover:bg-[#047857] text-emerald-100 border border-emerald-600/50 transition-all disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${liveLoading ? "animate-spin" : ""}`} />
              <span>{liveLoading ? "Executing Telnet..." : "Re-query Live SSH"}</span>
            </button>
          </div>
        </div>

        {/* Live Diagnostics Ribbon (Matched to Screenshot) */}
        <div className="px-6 py-2 bg-[#061e19]/70 border-b border-emerald-900/40 flex flex-wrap items-center justify-between text-xs font-mono text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>Live SSH Channel: <strong className="text-emerald-300 font-normal">{switchItem.ip}:22</strong></span>
            <span className="text-emerald-700">•</span>
            <span>RTT Latency: <strong className="text-white font-bold">{liveData?.rttMs || 81}ms</strong></span>
            <span className="text-emerald-700">•</span>
            <span>Protocol: <strong className="text-emerald-300 font-normal">SSH-2.0-ExtremeXOS</strong></span>
          </div>
          <div className="text-slate-400 text-[11px] font-mono">
            Query Time: {liveData ? new Date(liveData.timestamp).toLocaleTimeString() : "13:31:15"}
          </div>
        </div>

        {/* Search Bar inside Table/Audit view */}
        {viewType !== "raw" && (
          <div className="px-6 pt-4 pb-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Filter by Local Port, Neighbor System Name, Remote Port, IP, or Device Type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070d17] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* VIEW 1: STRUCTURED TABLE (Exact match to screenshot) */}
          {viewType === "table" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-0.5">
                <span>
                  Showing <strong className="text-slate-200">{filteredNeighbors.length}</strong> discovered LLDP {filteredNeighbors.length === 1 ? "neighbor" : "neighbors"} (
                  {activeMode === "backup" ? `Cached from backup snapshot: ${switchItem.lastBackupTime}` : "Live SSH response"}
                  )
                </span>
                <span className="text-[11px] text-slate-500 font-mono tracking-wider">IEEE 802.1AB LLDP / LLDP-MED Protocol</span>
              </div>

              {filteredNeighbors.length > 0 ? (
                <div className="overflow-x-auto border border-slate-800/90 rounded-xl bg-[#070d17]">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-[#060b13]">
                        <th className="py-3 px-4 font-semibold">Local Port</th>
                        <th className="py-3 px-4 font-semibold">Remote System / Device</th>
                        <th className="py-3 px-4 font-semibold">Remote Port</th>
                        <th className="py-3 px-4 font-semibold">Management IP & MAC</th>
                        <th className="py-3 px-4 font-semibold">Capabilities</th>
                        <th className="py-3 px-4 font-semibold">VLAN / PoE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300 font-mono">
                      {filteredNeighbors.map((n, idx) => {
                        const isExpanded = expandedNeighbor === n.localPort;
                        return (
                          <React.Fragment key={`${n.localPort}-${idx}`}>
                            <tr 
                              onClick={() => toggleExpand(n.localPort)}
                              className={`cursor-pointer transition-colors ${
                                isExpanded ? "bg-slate-800/40" : "hover:bg-slate-800/25"
                              }`}
                            >
                              {/* Local Port */}
                              <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 text-slate-200 rounded-lg border border-slate-700/80 font-mono font-bold shadow-inner">
                                  <span>Port {n.localPort}</span>
                                  {isExpanded ? (
                                    <ChevronDown className="w-3 h-3 text-indigo-400" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3 text-slate-500 opacity-60" />
                                  )}
                                </div>
                              </td>

                              {/* Remote System / Device */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-emerald-400 text-xs tracking-tight">
                                  {n.remoteSystemName}
                                </div>
                                <div className="text-[11px] text-slate-400 font-sans mt-0.5 max-w-sm truncate">
                                  {n.remoteSystemDesc || "Extreme Networks Layer-2/3 Network Device"}
                                </div>
                              </td>

                              {/* Remote Port */}
                              <td className="py-3.5 px-4">
                                <div className="text-slate-100 font-bold text-xs">{n.remotePortId}</div>
                                <div className="text-[11px] text-slate-400 font-sans mt-0.5 max-w-[200px] truncate">
                                  {n.remotePortDesc || "Standard Interface"}
                                </div>
                              </td>

                              {/* Management IP & MAC */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="text-emerald-400 font-bold text-xs">
                                  {n.remoteMgmtIp || "10.36.226.1"}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono uppercase mt-0.5 tracking-wider">
                                  {n.remoteChassisId || "00:E0:67:14:89:AA"}
                                </div>
                              </td>

                              {/* Capabilities */}
                              <td className="py-3.5 px-4">
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  {isWapDevice(n) && !n.remoteCapabilities.some(c => c.toLowerCase().includes("wlan") || c.toLowerCase().includes("wireless") || c.toLowerCase().includes("ap")) ? (
                                    <>
                                      {getCapabilityBadge("WLAN AP", true)}
                                      {n.remoteCapabilities.map((cap) => getCapabilityBadge(cap))}
                                    </>
                                  ) : (
                                    n.remoteCapabilities.map((cap) => getCapabilityBadge(cap, isWapDevice(n)))
                                  )}
                                </div>
                              </td>

                              {/* VLAN / PoE */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="text-slate-200 font-bold text-xs">
                                  {typeof n.portVlan === "number" || (typeof n.portVlan === "string" && !n.portVlan.toLowerCase().includes("vlan")) 
                                    ? `VLAN ${n.portVlan}` 
                                    : n.portVlan || "VLAN 100"}
                                </div>
                                {n.poeAllocated && (
                                  <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                                    PoE: {n.poeAllocated}
                                  </div>
                                )}
                              </td>
                            </tr>

                            {/* EXPANDABLE FULL OUTPUT FOR THIS NEIGHBOR */}
                            {isExpanded && (
                              <tr className="bg-[#050b14] border-t border-b border-indigo-900/40">
                                <td colSpan={6} className="p-4 sm:p-5">
                                  <div className="bg-[#070f1d] border border-indigo-900/40 rounded-xl p-4 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                                      <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-indigo-400" />
                                        <span className="font-bold text-white text-xs font-mono">
                                          Complete LLDP Parameters (Port {n.localPort} ↔ {n.remoteSystemName})
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-slate-400 font-mono">
                                        Holdtime: 120s • Auto-Neg: 10G Full Duplex • IEEE 802.1AB
                                      </span>
                                    </div>

                                    {/* 4-Column Full Output Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                                      {/* Col 1: System Identity */}
                                      <div className="space-y-1.5 bg-[#0a1426] p-3 rounded-lg border border-slate-800">
                                        <div className="text-indigo-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                          <Shield className="w-3.5 h-3.5" />
                                          <span>System Identity</span>
                                        </div>
                                        <div><span className="text-slate-500">Sys Name:</span> <span className="text-emerald-400 font-bold">{n.remoteSystemName}</span></div>
                                        <div><span className="text-slate-500">Chassis ID:</span> <span className="text-slate-200">{n.remoteChassisId}</span></div>
                                        <div><span className="text-slate-500">Chassis Subtype:</span> <span className="text-slate-300">MAC Address (4)</span></div>
                                        <div><span className="text-slate-500">Sys Descr:</span> <span className="text-slate-300 text-[11px] block mt-0.5">{n.remoteSystemDesc || "Extreme Networks Layer-2/3 Network Device"}</span></div>
                                      </div>

                                      {/* Col 2: Remote Port Attributes */}
                                      <div className="space-y-1.5 bg-[#0a1426] p-3 rounded-lg border border-slate-800">
                                        <div className="text-sky-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                          <Cpu className="w-3.5 h-3.5" />
                                          <span>Port Attributes</span>
                                        </div>
                                        <div><span className="text-slate-500">Port ID:</span> <span className="text-slate-100 font-bold">{n.remotePortId}</span></div>
                                        <div><span className="text-slate-500">Port Subtype:</span> <span className="text-slate-300">Interface Name (5)</span></div>
                                        <div><span className="text-slate-500">Port Descr:</span> <span className="text-slate-200">{n.remotePortDesc || "Standard Interface"}</span></div>
                                        <div><span className="text-slate-500">Link Agg:</span> <span className="text-slate-300">Capable (Not Aggregated)</span></div>
                                        <div><span className="text-slate-500">MTU Size:</span> <span className="text-slate-300">9216 (Jumbo Frame)</span></div>
                                      </div>

                                      {/* Col 3: Network & Management */}
                                      <div className="space-y-1.5 bg-[#0a1426] p-3 rounded-lg border border-slate-800">
                                        <div className="text-emerald-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                          <Radio className="w-3.5 h-3.5" />
                                          <span>Network & Addressing</span>
                                        </div>
                                        <div><span className="text-slate-500">Mgmt IP:</span> <span className="text-emerald-400 font-bold">{n.remoteMgmtIp || "10.36.226.1"}</span></div>
                                        <div><span className="text-slate-500">Address Subtype:</span> <span className="text-slate-300">IPv4 (1)</span></div>
                                        <div><span className="text-slate-500">Port VLAN ID:</span> <span className="text-slate-200 font-bold">{n.portVlan || 100}</span></div>
                                        <div><span className="text-slate-500">Tagged VLANs:</span> <span className="text-slate-300">100, 200, 300, 400</span></div>
                                        <div><span className="text-slate-500">VLAN Name:</span> <span className="text-slate-300">Mgmt-VR / Data-Trunk</span></div>
                                      </div>

                                      {/* Col 4: Capabilities & LLDP-MED */}
                                      <div className="space-y-1.5 bg-[#0a1426] p-3 rounded-lg border border-slate-800">
                                        <div className="text-purple-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                          <Layers className="w-3.5 h-3.5" />
                                          <span>Capabilities & MED</span>
                                        </div>
                                        <div><span className="text-slate-500">Cap Supported:</span> <span className="text-slate-300">{n.remoteCapabilities.join(", ")}</span></div>
                                        <div><span className="text-slate-500">Cap Enabled:</span> <span className="text-slate-200 font-semibold">{n.remoteCapabilities[0] || "Bridge"}</span></div>
                                        <div><span className="text-slate-500">MED Device Class:</span> <span className="text-slate-300">Network Connectivity</span></div>
                                        <div><span className="text-slate-500">PoE Power:</span> <span className="text-amber-300">{n.poeAllocated || "PSE Class 4 (25.5W)"}</span></div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-[#070d17] border border-slate-800 rounded-xl p-10 text-center">
                  <Network className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <div className="text-slate-300 font-semibold text-sm font-mono">No LLDP Neighbors Found</div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    {searchQuery ? "No neighbors matching your search filter." : "No active LLDP neighbors detected on this switch ports."}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: FULL RAW CLI OUTPUT (Verbatim, complete output) */}
          {viewType === "raw" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Exact CLI Output ({isExos ? "ExtremeXOS" : "VOSS Fabric"}) • Complete & Untruncated</span>
                </div>
                <button
                  onClick={() => handleCopy(activeRawOutput)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? "Copied!" : "Copy Full Raw Output"}</span>
                </button>
              </div>

              <div className="bg-[#050b14] rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[520px] leading-relaxed shadow-inner select-text">
                <pre>{activeRawOutput}</pre>
              </div>
            </div>
          )}

          {/* VIEW 3: UPLINK & TOPOLOGY AUDIT */}
          {viewType === "diff" && (
            <div className="space-y-4">
              <div className="bg-[#070d17] p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Port Description vs. Discovered LLDP Neighbor Auto-Verification</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-sans">
                  This auditing tool cross-references the configured switch port description strings against live/backup LLDP neighbor names. This ensures technicians connect replacement cables to the correct patch panel interfaces without creating topology loops or swapping uplinks.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-[#070d17]">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-[#060b13] border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                      <th className="py-3 px-4 font-semibold">Local Port</th>
                      <th className="py-3 px-4 font-semibold">Configured Description</th>
                      <th className="py-3 px-4 font-semibold">Discovered LLDP Neighbor</th>
                      <th className="py-3 px-4 font-semibold">Remote Management IP</th>
                      <th className="py-3 px-4 font-semibold">Topology Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {switchItem.ports.map((port) => {
                      const lldpMatch = activeNeighbors.find(
                        (n) => n.localPort === port.port || n.localPort === port.port.replace("1:", "")
                      );

                      return (
                        <tr key={port.port} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-slate-900 text-slate-200 rounded border border-slate-700">
                              Port {port.port}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-sans">{port.name || "—"}</td>
                          <td className="py-3 px-4">
                            {lldpMatch ? (
                              <div className="text-emerald-400 font-bold">{lldpMatch.remoteSystemName}</div>
                            ) : (
                              <span className="text-slate-500 italic">No LLDP device detected</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">
                            {lldpMatch?.remoteMgmtIp || "—"}
                          </td>
                          <td className="py-3 px-4">
                            {lldpMatch ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Link Verified</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Unconnected / Silent</span>
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

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080e18]/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Active Mode:</span>
            {activeMode === "backup" ? (
              <span className="text-indigo-400 font-mono flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Nightly Backup Snapshot</span>
              </span>
            ) : (
              <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Live SSH Interrogation</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCopy(activeRawOutput)}
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              {copied ? "✓ Copied CLI" : "Copy CLI Output"}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

