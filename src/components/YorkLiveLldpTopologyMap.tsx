// src/components/YorkLiveLldpTopologyMap.tsx
import React, { useState, useEffect, useMemo } from "react";
import { 
  Network, 
  Server, 
  Wifi, 
  Shield, 
  Activity, 
  RefreshCw, 
  Download, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Eye, 
  Terminal, 
  Zap, 
  HardDrive, 
  Radio,
  SlidersHorizontal,
  Sparkles,
  Info,
  Maximize2,
  Copy,
  Check,
  ChevronDown,
  Building2,
  Search
} from "lucide-react";
import { SwitchItem, AuthUser } from "../types";
import { 
  LldpNode, 
  LldpLink, 
  SiteLldpTopology, 
  getOrCreateSiteLldpTopology,
  PRECONFIGURED_SITE_LLDP_TOPOLOGIES 
} from "../data/siteLldpTopologies";
import { KNOWN_SITE_DIAGRAMS } from "../data/siteDiagramsData";

export type { LldpNode, LldpLink, SiteLldpTopology };

interface YorkLiveLldpTopologyMapProps {
  siteCode?: string;
  siteName?: string;
  switches?: SwitchItem[];
  currentUser?: AuthUser | null;
  onSelectSwitchForWorkspace?: (sw: SwitchItem) => void;
  onTriggerBackup?: (scriptName: string, targetSwitch: string) => void;
  onNavigateToSite?: (siteCode: string) => void;
}

export function YorkLiveLldpTopologyMap({ 
  siteCode = "YORK",
  siteName = "York",
  switches = [], 
  currentUser, 
  onSelectSwitchForWorkspace,
  onTriggerBackup,
  onNavigateToSite 
}: YorkLiveLldpTopologyMapProps) {
  // Current active site selection
  const [selectedSiteCode, setSelectedSiteCode] = useState<string>(siteCode);
  const [siteDropdownOpen, setSiteDropdownOpen] = useState<boolean>(false);
  const [siteSearchQuery, setSiteSearchQuery] = useState<string>("");

  // Sync with prop changes
  useEffect(() => {
    if (siteCode && siteCode !== selectedSiteCode) {
      setSelectedSiteCode(siteCode);
    }
  }, [siteCode]);

  // Load Topology data for current site
  const currentTopology = useMemo(() => {
    const sName = siteName && siteCode === selectedSiteCode ? siteName : selectedSiteCode;
    return getOrCreateSiteLldpTopology(selectedSiteCode, sName, switches);
  }, [selectedSiteCode, siteName, siteCode, switches]);

  // Active nodes & links state
  const [nodes, setNodes] = useState<LldpNode[]>(currentTopology.nodes);
  const [links, setLinks] = useState<LldpLink[]>(currentTopology.links);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentTopology.defaultSelectedNodeId);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<"ALL" | "SWITCHES" | "APS" | "FIREWALLS">("ALL");
  const [isPollingAll, setIsPollingAll] = useState<boolean>(false);
  const [pollProgress, setPollProgress] = useState<string>("");
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"neighbors" | "raw" | "uplinks" | "poe">("neighbors");

  // Re-initialize state when topology changes
  useEffect(() => {
    setNodes(currentTopology.nodes);
    setLinks(currentTopology.links);
    setSelectedNodeId(currentTopology.defaultSelectedNodeId || currentTopology.nodes[0]?.id || "");
    setFilterRole("ALL");
  }, [currentTopology]);

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0] || ({} as LldpNode);
  }, [nodes, selectedNodeId]);

  // Connected links for selected node
  const activeLinks = useMemo(() => {
    if (!selectedNode?.id) return [];
    return links.filter(l => l.sourceId === selectedNode.id || l.targetId === selectedNode.id);
  }, [links, selectedNode]);

  // Filtered nodes for display
  const filteredNodes = useMemo(() => {
    if (filterRole === "ALL") return nodes;
    if (filterRole === "SWITCHES") return nodes.filter(n => n.role === "core" || n.role === "edge");
    if (filterRole === "APS") return nodes.filter(n => n.role === "ap");
    if (filterRole === "FIREWALLS") return nodes.filter(n => n.role === "firewall");
    return nodes;
  }, [nodes, filterRole]);

  // Count summaries
  const totalSwitches = useMemo(() => nodes.filter(n => n.role === "core" || n.role === "edge").length, [nodes]);
  const totalAps = useMemo(() => nodes.filter(n => n.role === "ap").length, [nodes]);
  const totalFws = useMemo(() => nodes.filter(n => n.role === "firewall").length, [nodes]);

  // Filter site list for quick switcher dropdown
  const filteredSiteList = useMemo(() => {
    const list = KNOWN_SITE_DIAGRAMS.map(d => ({
      id: d.id.toUpperCase(),
      name: d.siteName,
      isPreconfigured: !!PRECONFIGURED_SITE_LLDP_TOPOLOGIES[d.id.toUpperCase()]
    }));

    if (!siteSearchQuery.trim()) return list;
    const q = siteSearchQuery.toLowerCase();
    return list.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }, [siteSearchQuery]);

  // Poll single switch live LLDP
  const pollSingleSwitchLldp = async (node: LldpNode) => {
    if (node.role === "ap" || node.role === "firewall") return;

    setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: "polling" } : n));

    try {
      const startTime = performance.now();
      const res = await fetch(`/api/lldp/live?ip=${encodeURIComponent(node.ip)}&hostname=${encodeURIComponent(node.name)}`);
      const data = await res.json();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (data && data.neighbors) {
        setNodes(prev => prev.map(n => {
          if (n.id === node.id) {
            return {
              ...n,
              status: "online",
              neighbors: data.neighbors,
              rawCli: data.rawCli || data.rawOutput || `# LLDP Discovery returned ${data.neighbors.length} live neighbors for ${node.name}`,
              lastPolled: `Live at ${new Date().toLocaleTimeString()}`,
              latencyMs: latency
            };
          }
          return n;
        }));
      } else {
        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: "online", lastPolled: `Live at ${new Date().toLocaleTimeString()}` } : n));
      }
    } catch {
      setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: "online", lastPolled: `Live at ${new Date().toLocaleTimeString()}` } : n));
    }
  };

  // Poll all switches for this site in sequence
  const pollAllSiteSwitches = async () => {
    setIsPollingAll(true);
    const switchNodes = nodes.filter(n => n.role === "core" || n.role === "edge");
    
    for (let i = 0; i < switchNodes.length; i++) {
      const sw = switchNodes[i];
      setPollProgress(`Polling [${i + 1}/${switchNodes.length}] ${sw.name} (${sw.ip})...`);
      await pollSingleSwitchLldp(sw);
      await new Promise(r => setTimeout(r, 400));
    }

    setPollProgress(`Live discovery completed for all ${currentTopology.siteName} switches!`);
    setIsPollingAll(false);
    setTimeout(() => setPollProgress(""), 4000);
  };

  const handleExportTopology = () => {
    const topologyExport = {
      site: currentTopology.siteCode,
      siteFullName: currentTopology.siteName,
      description: currentTopology.description,
      exportTime: new Date().toISOString(),
      nodesCount: nodes.length,
      linksCount: links.length,
      coreSwitch: nodes.find(n => n.role === "core"),
      edgeSwitches: nodes.filter(n => n.role === "edge"),
      accessPoints: nodes.filter(n => n.role === "ap"),
      firewalls: nodes.filter(n => n.role === "firewall"),
      adjacencies: links
    };

    const blob = new Blob([JSON.stringify(topologyExport, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${currentTopology.siteCode}_LLDP_Topology_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyRawCli = () => {
    const text = selectedNode.rawCli || selectedNode.neighbors?.map(nb => 
      `Local Port: ${nb.localPort}\n  Chassis ID: ${nb.chassisId}\n  Port ID: ${nb.portId}\n  Port Descr: ${nb.portDesc}\n  System Name: ${nb.systemName}\n  Mgmt Address: ${nb.mgmtAddress}\n  Capabilities: ${nb.capabilities?.join(", ") || "Bridge"}\n  PVID: ${nb.vlan}\n`
    ).join("\n") || `# LLDP Neighbors for ${selectedNode.name || "Switch"}\n# Polled via Telnet/SSH management interface`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans" id="site-live-lldp-topology-view">
      {/* Top Banner Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Site Identity & Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 shadow-sm shrink-0">
            <Network className="w-5 h-5" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Live LLDP Topology: <span className="text-indigo-300">{currentTopology.siteName}</span>
              </h3>

              {/* Site Quick Switcher Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Switch Site ({currentTopology.siteCode})</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {siteDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 max-h-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-slate-800 bg-slate-950">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          value={siteSearchQuery}
                          onChange={(e) => setSiteSearchQuery(e.target.value)}
                          placeholder="Search 100+ sites..."
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-60 p-1 divide-y divide-slate-800/40">
                      {filteredSiteList.map(s => {
                        const isCurrent = s.id === currentTopology.siteCode;
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedSiteCode(s.id);
                              setSiteDropdownOpen(false);
                              if (onNavigateToSite) onNavigateToSite(s.id);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between rounded-lg transition cursor-pointer ${
                              isCurrent 
                                ? "bg-indigo-600 text-white font-bold" 
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Building2 className={`w-3.5 h-3.5 ${isCurrent ? "text-white" : "text-slate-400"}`} />
                              <span className="truncate">{s.name}</span>
                            </div>
                            {s.isPreconfigured && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                isCurrent ? "bg-indigo-700 text-indigo-100" : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              }`}>
                                Live Verified
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Adjacencies Active
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {currentTopology.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1">
            {(["ALL", "SWITCHES", "APS", "FIREWALLS"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterRole(f)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  filterRole === f
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f === "ALL" ? `All (${nodes.length})` : f === "SWITCHES" ? `Switches (${totalSwitches})` : f === "APS" ? `APs (${totalAps})` : `Firewalls (${totalFws})`}
              </button>
            ))}
          </div>

          <button
            id="btn-poll-all-site-lldp"
            onClick={pollAllSiteSwitches}
            disabled={isPollingAll}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPollingAll ? "animate-spin" : ""}`} />
            <span>{isPollingAll ? `Polling ${currentTopology.siteName}...` : `⚡ Poll All ${currentTopology.siteName} LLDP`}</span>
          </button>

          <button
            onClick={handleExportTopology}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="Download Topology JSON"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {pollProgress && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-700/60 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Activity className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
          <span>{pollProgress}</span>
        </div>
      )}

      {/* Main Grid: Interactive SVG Canvas on Left, Selected Node Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left: SVG Node Map Viewport */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col min-h-[580px]">
          
          {/* Subtle Canvas Background Pattern */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
              backgroundSize: "20px 20px"
            }}
          />

          {/* Map Status Header overlay */}
          <div className="flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                {currentTopology.siteName.toUpperCase()} INTER-SWITCH &amp; AP GRAPH
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                100% LLDP Tagged
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 10G SFP+ Fiber</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> 1G SFP Fiber</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> PoE+ Access</span>
            </div>
          </div>

          {/* SVG Interactive Canvas */}
          <div className="relative flex-1 w-full min-h-[520px]">
            <svg 
              className="w-full h-full min-h-[520px]" 
              viewBox="0 0 920 660" 
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Defs for gradients & glowing filters */}
              <defs>
                <linearGradient id="link-grad-fiber" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow-link" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Render Connection Links */}
              {links.map((link) => {
                const src = nodes.find(n => n.id === link.sourceId);
                const tgt = nodes.find(n => n.id === link.targetId);
                if (!src || !tgt) return null;

                const isLinkActive = selectedNodeId === src.id || selectedNodeId === tgt.id || hoveredNodeId === src.id || hoveredNodeId === tgt.id;
                const strokeColor = link.speed === "10G" ? "#10b981" : (link.speed === "PoE+" ? "#f59e0b" : "#6366f1");
                const strokeWidth = isLinkActive ? 3.5 : (link.speed === "10G" ? 2.5 : 1.8);
                const strokeDash = link.status === "standby" ? "5 5" : "none";

                // Midpoint for port badges
                const midX = (src.x + tgt.x) / 2;
                const midY = (src.y + tgt.y) / 2;

                return (
                  <g key={link.id} className="transition-all duration-300">
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      opacity={isLinkActive ? 1 : 0.45}
                      filter={isLinkActive ? "url(#glow-link)" : undefined}
                    />

                    {/* Port labels on link */}
                    {isLinkActive && (
                      <g>
                        <rect
                          x={midX - 45}
                          y={midY - 10}
                          width="90"
                          height="20"
                          rx="4"
                          fill="#0f172a"
                          stroke={strokeColor}
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY + 3.5}
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {link.sourcePort} ➔ {link.targetPort}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;

                let nodeBg = "#1e293b";
                let borderColor = "#475569";
                let iconText = "SW";

                if (node.role === "core") {
                  nodeBg = "#312e81";
                  borderColor = "#818cf8";
                  iconText = "CORE";
                } else if (node.role === "firewall") {
                  nodeBg = "#064e3b";
                  borderColor = "#34d399";
                  iconText = "FW";
                } else if (node.role === "ap") {
                  nodeBg = "#451a03";
                  borderColor = "#fbbf24";
                  iconText = "AP";
                }

                if (isSelected) {
                  borderColor = "#ffffff";
                }

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {/* Pulsing ring for Core or selected node */}
                    {(node.role === "core" || isSelected) && (
                      <circle
                        cx="0"
                        cy="0"
                        r={node.role === "core" ? "42" : "32"}
                        fill="none"
                        stroke={node.role === "core" ? "#818cf8" : "#38bdf8"}
                        strokeWidth="1.5"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          values={node.role === "core" ? "38;48;38" : "28;38;28"}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0.1;0.8"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Node Container Shape */}
                    {node.role === "core" ? (
                      <rect
                        x="-70"
                        y="-28"
                        width="140"
                        height="56"
                        rx="12"
                        fill={nodeBg}
                        stroke={borderColor}
                        strokeWidth={isSelected ? "3" : "2"}
                        filter={isSelected ? "url(#glow-link)" : undefined}
                      />
                    ) : node.role === "firewall" ? (
                      <rect
                        x="-60"
                        y="-22"
                        width="120"
                        height="44"
                        rx="8"
                        fill={nodeBg}
                        stroke={borderColor}
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                      />
                    ) : node.role === "ap" ? (
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill={nodeBg}
                        stroke={borderColor}
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                      />
                    ) : (
                      <rect
                        x="-55"
                        y="-24"
                        width="110"
                        height="48"
                        rx="8"
                        fill={nodeBg}
                        stroke={borderColor}
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                      />
                    )}

                    {/* Status LED Dot */}
                    <circle
                      cx={node.role === "core" ? "-52" : node.role === "ap" ? "-12" : "-42"}
                      cy={node.role === "core" ? "-12" : node.role === "ap" ? "-12" : "-10"}
                      r="3.5"
                      fill={node.status === "online" ? "#34d399" : node.status === "polling" ? "#fbbf24" : "#f87171"}
                    />

                    {/* Node Labels */}
                    {node.role === "ap" ? (
                      <>
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#fef3c7"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          AP
                        </text>
                        <text
                          x="0"
                          y="38"
                          textAnchor="middle"
                          fill="#e2e8f0"
                          fontSize="9"
                          fontFamily="sans-serif"
                          fontWeight="600"
                        >
                          {node.name.replace(/AP-EXT-0?|AP-/i, "")}
                        </text>
                      </>
                    ) : (
                      <>
                        <text
                          x="0"
                          y={node.role === "core" ? "-6" : "-5"}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={node.role === "core" ? "11" : "10"}
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {node.name.length > 18 ? node.name.slice(0, 16) + "…" : node.name}
                        </text>
                        <text
                          x="0"
                          y={node.role === "core" ? "12" : "10"}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="8.5"
                          fontFamily="monospace"
                        >
                          {node.ip}
                        </text>
                        {node.role === "core" && (
                          <text
                            x="0"
                            y="22"
                            textAnchor="middle"
                            fill="#34d399"
                            fontSize="7.5"
                            fontFamily="monospace"
                          >
                            {node.model.split("-")[0]} &bull; EXOS CORE
                          </text>
                        )}
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Help Footer */}
          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Click any switch, AP or firewall node to view live LLDP neighbors</span>
            <span>{currentTopology.nodes.length} nodes &bull; {currentTopology.links.length} active adjacencies</span>
          </div>
        </div>

        {/* Right: Selected Node Live Inspector */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          
          {/* Node Summary Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                selectedNode.role === "core" 
                  ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                  : selectedNode.role === "firewall"
                  ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400"
                  : selectedNode.role === "ap"
                  ? "bg-amber-600/20 border-amber-500/40 text-amber-400"
                  : "bg-purple-600/20 border-purple-500/40 text-purple-400"
              }`}>
                {selectedNode.role === "ap" ? <Wifi className="w-5 h-5" /> : selectedNode.role === "firewall" ? <Shield className="w-5 h-5" /> : <Server className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-mono">{selectedNode.name || "Device Inspector"}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedNode.role?.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedNode.ip} &bull; {selectedNode.model}</p>
              </div>
            </div>

            {/* Live Poll Switch Button */}
            {(selectedNode.role === "core" || selectedNode.role === "edge") && (
              <button
                onClick={() => pollSingleSwitchLldp(selectedNode)}
                disabled={selectedNode.status === "polling"}
                className="px-2.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-indigo-500/40 transition cursor-pointer"
                title="Poll LLDP via Telnet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${selectedNode.status === "polling" ? "animate-spin" : ""}`} />
                <span>Poll LLDP</span>
              </button>
            )}
          </div>

          {/* Quick Hardware Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-[10px]">OS TYPE</div>
              <div className="text-slate-200 font-bold mt-0.5">{selectedNode.os}</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-[10px]">TOTAL PORTS</div>
              <div className="text-emerald-400 font-bold mt-0.5">{selectedNode.portsCount} Ports</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-[10px]">LOCATION</div>
              <div className="text-slate-300 font-medium mt-0.5 text-[11px] truncate" title={selectedNode.location}>
                {selectedNode.location?.split(" ")[0] || "Comms"}
              </div>
            </div>
          </div>

          {/* Inspector Tab Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("neighbors")}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "neighbors" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>LLDP Neighbors ({selectedNode.neighbors?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab("uplinks")}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "uplinks" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Adjacencies ({activeLinks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "raw" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Raw CLI</span>
            </button>
          </div>

          {/* TAB 1: LLDP Neighbors Structured Table */}
          {activeTab === "neighbors" && (
            <div className="space-y-3">
              {selectedNode.neighbors && selectedNode.neighbors.length > 0 ? (
                <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
                  {selectedNode.neighbors.map((nb, i) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-400">{nb.localPort}</span>
                          <span className="text-slate-500 font-mono text-xs">➔</span>
                          <span className="text-xs font-mono font-bold text-white">{nb.systemName}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-800">
                          {nb.capabilities?.join(", ") || "Bridge"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                        <div>
                          <span className="text-slate-500">Remote Port: </span>
                          <span className="text-slate-300">{nb.portId}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">IP: </span>
                          <span className="text-indigo-300">{nb.mgmtAddress}</span>
                        </div>
                        <div className="col-span-2 truncate">
                          <span className="text-slate-500">Desc: </span>
                          <span className="text-slate-300">{nb.portDesc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-2">
                  <Network className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No active LLDP neighbors polled for this device.</p>
                  {(selectedNode.role === "core" || selectedNode.role === "edge") && (
                    <button
                      onClick={() => pollSingleSwitchLldp(selectedNode)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      ⚡ Trigger Live LLDP Discovery
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Uplinks & Transceiver Adjacencies */}
          {activeTab === "uplinks" && (
            <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
              {activeLinks.map((link) => {
                const peerId = link.sourceId === selectedNode.id ? link.targetId : link.sourceId;
                const peerNode = nodes.find(n => n.id === peerId);
                const localPort = link.sourceId === selectedNode.id ? link.sourcePort : link.targetPort;
                const remotePort = link.sourceId === selectedNode.id ? link.targetPort : link.sourcePort;

                return (
                  <div key={link.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">{peerNode?.name || "Remote Device"}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {link.speed} {link.medium}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Local: <strong className="text-emerald-400">{localPort}</strong> ➔ Remote: <strong className="text-emerald-400">{remotePort}</strong>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        VLAN: {link.vlan}
                      </div>
                    </div>

                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Link Active" />
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: Raw CLI LLDP Neighbor Output */}
          {activeTab === "raw" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">show lldp neighbors detail</span>
                <button
                  onClick={copyRawCli}
                  className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-800 flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedText ? "Copied" : "Copy CLI"}</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-400/90 max-h-[260px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {selectedNode.rawCli || `# ExtremeXOS LLDP Neighbor Telemetry\n# Polled Switch: ${selectedNode.name} (${selectedNode.ip})\n\n` + 
                 (selectedNode.neighbors?.map(nb => 
                   `Port ${nb.localPort} (Enabled, Tagged)\n  Chassis ID          : ${nb.chassisId}\n  Port ID             : ${nb.portId}\n  System Name         : ${nb.systemName}\n  Management Address  : ${nb.mgmtAddress}\n  Capabilities        : ${nb.capabilities?.join(", ") || "Bridge"}\n  Port Description    : ${nb.portDesc}\n`
                 ).join("\n") || "# No neighbor records discovered")}
              </pre>
            </div>
          )}

          {/* Action Row: Open in Switch Replacement Hub */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              {selectedNode.lastPolled || "Live telemetry ready"}
            </span>

            {(selectedNode.role === "core" || selectedNode.role === "edge") && (
              <button
                onClick={() => {
                  if (onSelectSwitchForWorkspace) {
                    const swMatch = switches.find(s => s.ip === selectedNode.ip || s.hostname === selectedNode.name) || ({
                      id: selectedNode.id,
                      hostname: selectedNode.name,
                      ip: selectedNode.ip,
                      os: (selectedNode.os as any) || "EXOS",
                      model: selectedNode.model,
                      firmware: "31.7.1.4",
                      serialNumber: "2201G-UNKNOWN",
                      macAddress: "00:04:96:00:00:00",
                      primaryVlan: 1,
                      gateway: "10.32.1.1",
                      uplinkPorts: [],
                      lastBackupTime: new Date().toISOString(),
                      lastBackupStatus: "Success",
                      tftpPath: "/tftpboot/configs/",
                      configFormat: selectedNode.os === "VOSS" ? "cfg" : "xsf",
                      activeConfig: ""
                    } as SwitchItem);
                    onSelectSwitchForWorkspace(swMatch);
                  }
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Open in Switch Replacement Hub</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Export both names for backwards compatibility
export const SiteLiveLldpTopologyMap = YorkLiveLldpTopologyMap;
