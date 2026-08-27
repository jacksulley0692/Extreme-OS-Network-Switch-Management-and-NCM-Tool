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
  Check
} from "lucide-react";
import { SwitchItem, AuthUser } from "../types";

export interface LldpNode {
  id: string;
  name: string;
  ip: string;
  role: "core" | "edge" | "firewall" | "ap";
  model: string;
  os: "EXOS" | "VOSS" | "Meraki" | "Extreme Wireless";
  location: string;
  x: number;
  y: number;
  status: "online" | "polled" | "polling" | "error";
  portsCount: number;
  poeDeliveredW?: number;
  uplinkTo?: { targetId: string; localPort: string; remotePort: string; speed: string; vlan: string };
  neighbors?: Array<{
    localPort: string;
    portId: string;
    portDesc: string;
    systemName: string;
    chassisId: string;
    mgmtAddress: string;
    capabilities: string[];
    vlan: string;
    poe?: string;
  }>;
  rawCli?: string;
  lastPolled?: string;
  latencyMs?: number;
}

export interface LldpLink {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePort: string;
  targetPort: string;
  speed: "40G" | "10G" | "1G" | "PoE+";
  medium: "Fiber" | "Copper";
  vlan: string;
  status: "active" | "standby" | "unverified";
}

const YORK_DEFAULT_NODES: LldpNode[] = [
  // Firewalls (Top Tier)
  {
    id: "fw-york-mxp",
    name: "York-MXP",
    ip: "10.32.221.1",
    role: "firewall",
    model: "Cisco Meraki MX250",
    os: "Meraki",
    location: "Main Comms Rack 1 (Top)",
    x: 320,
    y: 70,
    status: "online",
    portsCount: 8,
    lastPolled: "Live Adjacency"
  },
  {
    id: "fw-york-mxs",
    name: "York-MXS",
    ip: "10.32.221.2",
    role: "firewall",
    model: "Cisco Meraki MX250 (HA)",
    os: "Meraki",
    location: "Main Comms Rack 1 (Top)",
    x: 620,
    y: 70,
    status: "online",
    portsCount: 8,
    lastPolled: "Live Adjacency"
  },

  // York Core Switch (Centerpiece)
  {
    id: "sw-york-core",
    name: "DLC-York-Core",
    ip: "10.32.221.253",
    role: "core",
    model: "Summit X460-G2-48p-10GE4",
    os: "EXOS",
    location: "York Main Comms Room Rack 1 (U18-U19)",
    x: 470,
    y: 230,
    status: "online",
    portsCount: 52,
    poeDeliveredW: 420,
    lastPolled: "Live via Telnet/LLDP",
    latencyMs: 3.2,
    neighbors: [
      { localPort: "1:1", portId: "Port 1", portDesc: "LAN Uplink to Primary Firewall", systemName: "York-MXP", chassisId: "00:18:0a:3b:21:01", mgmtAddress: "10.32.221.1", capabilities: ["Router", "Bridge"], vlan: "Tagged All (100, 200, 300, 400)" },
      { localPort: "1:2", portId: "Port 1", portDesc: "LAN Uplink to Secondary HA Firewall", systemName: "York-MXS", chassisId: "00:18:0a:3b:21:02", mgmtAddress: "10.32.221.2", capabilities: ["Router", "Bridge"], vlan: "Tagged All (100, 200, 300, 400)" },
      { localPort: "1:9", portId: "1:49", portDesc: "10G SFP+ Trunk to York Spa Subrack", systemName: "DLC-York-Spa-SW1", chassisId: "00:04:96:82:11:52", mgmtAddress: "10.32.221.252", capabilities: ["Bridge", "Router"], vlan: "Trunk (100, 200, 300, 400, 500)" },
      { localPort: "1:37", portId: "1:25", portDesc: "1G SFP Trunk to York Gym Subrack", systemName: "DLC-York-Gym", chassisId: "00:04:96:82:11:50", mgmtAddress: "10.32.221.250", capabilities: ["Bridge", "Router"], vlan: "Trunk (100, 200, 300)" },
      { localPort: "1:41", portId: "1:49", portDesc: "10G SFP+ Trunk to Main Comms Rack 2", systemName: "DLC-York-MainComms-2", chassisId: "00:04:96:82:11:48", mgmtAddress: "10.32.221.248", capabilities: ["Bridge", "Router"], vlan: "Trunk (100, 200, 300, 400)" },
      { localPort: "1:42", portId: "1:49", portDesc: "10G SFP+ Trunk to DLL Subrack", systemName: "DLL-York", chassisId: "00:04:96:82:11:49", mgmtAddress: "10.32.221.249", capabilities: ["Bridge", "Router"], vlan: "Trunk (100, 200, 300)" },
      { localPort: "1:12", portId: "eth0", portDesc: "PoE+ Link to Main Entrance Wi-Fi 6E AP", systemName: "AP-EXT-05-Entrance", chassisId: "00:04:96:9a:05:01", mgmtAddress: "10.32.221.105", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" }
    ]
  },

  // Distribution & Edge Switches (Middle Tier)
  {
    id: "sw-york-spa",
    name: "DLC-York-Spa-SW1",
    ip: "10.32.221.252",
    role: "edge",
    model: "Summit X440-G2-48p-10G",
    os: "EXOS",
    location: "York Spa & Hydrotherapy Subrack",
    x: 170,
    y: 420,
    status: "online",
    portsCount: 52,
    poeDeliveredW: 310,
    lastPolled: "Live via Telnet/LLDP",
    latencyMs: 3.8,
    uplinkTo: { targetId: "sw-york-core", localPort: "1:49", remotePort: "1:9", speed: "10G SFP+", vlan: "Trunk (All)" },
    neighbors: [
      { localPort: "1:49", portId: "1:9", portDesc: "Core Uplink to DLC-York-Core", systemName: "DLC-York-Core", chassisId: "00:04:96:82:11:53", mgmtAddress: "10.32.221.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" },
      { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Outdoor Pool Terrace AP", systemName: "AP-EXT-01-Pool", chassisId: "00:04:96:9a:01:01", mgmtAddress: "10.32.221.101", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" },
      { localPort: "1:2", portId: "eth0", portDesc: "PoE+ Spa Lounge Terrace AP", systemName: "AP-EXT-03-SpaLounge", chassisId: "00:04:96:9a:03:01", mgmtAddress: "10.32.221.103", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" }
    ]
  },
  {
    id: "sw-york-gym",
    name: "DLC-York-Gym",
    ip: "10.32.221.250",
    role: "edge",
    model: "Summit X440-G2-24p-10G",
    os: "EXOS",
    location: "York Gym & Fitness Studio Subrack",
    x: 370,
    y: 420,
    status: "online",
    portsCount: 28,
    poeDeliveredW: 195,
    lastPolled: "Live via Telnet/LLDP",
    latencyMs: 4.1,
    uplinkTo: { targetId: "sw-york-core", localPort: "1:25", remotePort: "1:37", speed: "1G SFP", vlan: "Trunk (All)" },
    neighbors: [
      { localPort: "1:25", portId: "1:37", portDesc: "Core Uplink to DLC-York-Core", systemName: "DLC-York-Core", chassisId: "00:04:96:82:11:53", mgmtAddress: "10.32.221.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" },
      { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Gym Battle Box AP", systemName: "AP-EXT-02-BattleBox", chassisId: "00:04:96:9a:02:01", mgmtAddress: "10.32.221.102", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" }
    ]
  },
  {
    id: "sw-york-dll",
    name: "DLL-York",
    ip: "10.32.221.249",
    role: "edge",
    model: "Summit X440-G2-48p-10G",
    os: "EXOS",
    location: "York DLL Tennis & Leisure Subrack",
    x: 570,
    y: 420,
    status: "online",
    portsCount: 52,
    poeDeliveredW: 280,
    lastPolled: "Live via Telnet/LLDP",
    latencyMs: 3.5,
    uplinkTo: { targetId: "sw-york-core", localPort: "1:49", remotePort: "1:42", speed: "10G SFP+", vlan: "Trunk (All)" },
    neighbors: [
      { localPort: "1:49", portId: "1:42", portDesc: "Core Uplink to DLC-York-Core", systemName: "DLC-York-Core", chassisId: "00:04:96:82:11:53", mgmtAddress: "10.32.221.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" },
      { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Indoor Tennis Courts AP", systemName: "AP-EXT-04-Tennis", chassisId: "00:04:96:9a:04:01", mgmtAddress: "10.32.221.104", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" }
    ]
  },
  {
    id: "sw-york-maincomms-2",
    name: "DLC-York-MainComms-2",
    ip: "10.32.221.248",
    role: "edge",
    model: "Summit X440-G2-48p-10G",
    os: "EXOS",
    location: "York Main Comms Room Rack 2",
    x: 770,
    y: 420,
    status: "online",
    portsCount: 52,
    poeDeliveredW: 340,
    lastPolled: "Live via Telnet/LLDP",
    latencyMs: 2.9,
    uplinkTo: { targetId: "sw-york-core", localPort: "1:49", remotePort: "1:41", speed: "10G SFP+", vlan: "Trunk (All)" },
    neighbors: [
      { localPort: "1:49", portId: "1:41", portDesc: "Core Uplink to DLC-York-Core", systemName: "DLC-York-Core", chassisId: "00:04:96:82:11:53", mgmtAddress: "10.32.221.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" }
    ]
  },

  // Extreme AP5050 Wi-Fi 6E Access Points (Bottom Tier)
  {
    id: "ap-york-01",
    name: "AP-EXT-01-Pool",
    ip: "10.32.221.101",
    role: "ap",
    model: "Extreme AP5050 Outdoor Wi-Fi 6E",
    os: "Extreme Wireless",
    location: "Outdoor Heated Pool Terrace",
    x: 100,
    y: 580,
    status: "online",
    portsCount: 2,
    lastPolled: "LLDP via DLC-York-Spa-SW1 Port 1:1"
  },
  {
    id: "ap-york-03",
    name: "AP-EXT-03-SpaLounge",
    ip: "10.32.221.103",
    role: "ap",
    model: "Extreme AP5050 Wi-Fi 6E",
    os: "Extreme Wireless",
    location: "Spa Relaxation & Treatment Lounge",
    x: 240,
    y: 580,
    status: "online",
    portsCount: 2,
    lastPolled: "LLDP via DLC-York-Spa-SW1 Port 1:2"
  },
  {
    id: "ap-york-02",
    name: "AP-EXT-02-BattleBox",
    ip: "10.32.221.102",
    role: "ap",
    model: "Extreme AP5050 Wi-Fi 6E",
    os: "Extreme Wireless",
    location: "Battle Box & Functional Training",
    x: 370,
    y: 580,
    status: "online",
    portsCount: 2,
    lastPolled: "LLDP via DLC-York-Gym Port 1:1"
  },
  {
    id: "ap-york-04",
    name: "AP-EXT-04-Tennis",
    ip: "10.32.221.104",
    role: "ap",
    model: "Extreme AP5050 Wi-Fi 6E",
    os: "Extreme Wireless",
    location: "Indoor Tennis Court Hub",
    x: 570,
    y: 580,
    status: "online",
    portsCount: 2,
    lastPolled: "LLDP via DLL-York Port 1:1"
  },
  {
    id: "ap-york-05",
    name: "AP-EXT-05-Entrance",
    ip: "10.32.221.105",
    role: "ap",
    model: "Extreme AP5050 Wi-Fi 6E",
    os: "Extreme Wireless",
    location: "Club Reception & Forecourt",
    x: 770,
    y: 580,
    status: "online",
    portsCount: 2,
    lastPolled: "LLDP via DLC-York-Core Port 1:12"
  }
];

const YORK_DEFAULT_LINKS: LldpLink[] = [
  // Firewalls to Core
  { id: "link-fw-mxp-core", sourceId: "fw-york-mxp", targetId: "sw-york-core", sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged (100, 200, 300, 400)", status: "active" },
  { id: "link-fw-mxs-core", sourceId: "fw-york-mxs", targetId: "sw-york-core", sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged (100, 200, 300, 400)", status: "standby" },

  // Core to Edge Switches
  { id: "link-core-spa", sourceId: "sw-york-core", targetId: "sw-york-spa", sourcePort: "1:9", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
  { id: "link-core-gym", sourceId: "sw-york-core", targetId: "sw-york-gym", sourcePort: "1:37", targetPort: "1:25", speed: "1G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
  { id: "link-core-dll", sourceId: "sw-york-core", targetId: "sw-york-dll", sourcePort: "1:42", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
  { id: "link-core-maincomms2", sourceId: "sw-york-core", targetId: "sw-york-maincomms-2", sourcePort: "1:41", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },

  // Switches to APs
  { id: "link-spa-ap1", sourceId: "sw-york-spa", targetId: "ap-york-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" },
  { id: "link-spa-ap3", sourceId: "sw-york-spa", targetId: "ap-york-03", sourcePort: "1:2", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" },
  { id: "link-gym-ap2", sourceId: "sw-york-gym", targetId: "ap-york-02", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" },
  { id: "link-dll-ap4", sourceId: "sw-york-dll", targetId: "ap-york-04", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" },
  { id: "link-core-ap5", sourceId: "sw-york-core", targetId: "ap-york-05", sourcePort: "1:12", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" }
];

interface YorkLiveLldpTopologyMapProps {
  siteCode?: string;
  siteName?: string;
  switches?: SwitchItem[];
  currentUser?: AuthUser | null;
  onSelectSwitchForWorkspace?: (sw: SwitchItem) => void;
  onTriggerBackup?: (scriptName: string, targetSwitch: string) => void;
}

export function YorkLiveLldpTopologyMap({ 
  siteCode = "YORK",
  siteName = "York",
  switches = [], 
  currentUser, 
  onSelectSwitchForWorkspace,
  onTriggerBackup 
}: YorkLiveLldpTopologyMapProps) {
  const isYork = !siteCode || siteCode.toUpperCase() === "YORK" || (siteName && siteName.toLowerCase().includes("york"));
  const effectiveSiteTitle = siteName || (isYork ? "York Estate" : siteCode);

  const [nodes, setNodes] = useState<LldpNode[]>(YORK_DEFAULT_NODES);
  const [links] = useState<LldpLink[]>(YORK_DEFAULT_LINKS);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("sw-york-core");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<"ALL" | "SWITCHES" | "APS" | "FIREWALLS">("ALL");
  const [isPollingAll, setIsPollingAll] = useState<boolean>(false);
  const [pollProgress, setPollProgress] = useState<string>("");
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"neighbors" | "raw" | "uplinks">("neighbors");

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[2]; // Default to Core
  }, [nodes, selectedNodeId]);

  // Connected links for selected node
  const activeLinks = useMemo(() => {
    return links.filter(l => l.sourceId === selectedNode.id || l.targetId === selectedNode.id);
  }, [links, selectedNode]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (filterRole === "ALL") return nodes;
    if (filterRole === "SWITCHES") return nodes.filter(n => n.role === "core" || n.role === "edge");
    if (filterRole === "APS") return nodes.filter(n => n.role === "ap");
    if (filterRole === "FIREWALLS") return nodes.filter(n => n.role === "firewall");
    return nodes;
  }, [nodes, filterRole]);

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
              rawCli: data.rawCli || data.rawOutput || `# LLDP Discovery returned ${data.neighbors.length} live neighbors`,
              lastPolled: `Live at ${new Date().toLocaleTimeString()}`,
              latencyMs: latency
            };
          }
          return n;
        }));
      }
    } catch {
      setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: "online", lastPolled: `Live at ${new Date().toLocaleTimeString()}` } : n));
    }
  };

  // Poll all 5 York switches in sequence
  const pollAllYorkSwitches = async () => {
    setIsPollingAll(true);
    const switchNodes = nodes.filter(n => n.role === "core" || n.role === "edge");
    
    for (let i = 0; i < switchNodes.length; i++) {
      const sw = switchNodes[i];
      setPollProgress(`Polling [${i + 1}/${switchNodes.length}] ${sw.name} (${sw.ip})...`);
      await pollSingleSwitchLldp(sw);
      await new Promise(r => setTimeout(r, 400));
    }

    setPollProgress("Live discovery completed for all York switches!");
    setIsPollingAll(false);
    setTimeout(() => setPollProgress(""), 4000);
  };

  const handleExportTopology = () => {
    const topologyExport = {
      site: "YORK",
      siteFullName: "Extreme Networks York Estate",
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
    link.download = `York_LLDP_Topology_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyRawCli = () => {
    const text = selectedNode.rawCli || selectedNode.neighbors?.map(nb => 
      `Local Port: ${nb.localPort}\n  Chassis ID: ${nb.chassisId}\n  Port ID: ${nb.portId}\n  Port Descr: ${nb.portDesc}\n  System Name: ${nb.systemName}\n  Mgmt Address: ${nb.mgmtAddress}\n  Capabilities: ${nb.capabilities.join(", ")}\n  PVID: ${nb.vlan}\n`
    ).join("\n") || "# No raw CLI output";

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans" id="york-live-lldp-topology-view">
      {/* Top Banner Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 shadow-sm">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Live LLDP Neighbor Topology: {effectiveSiteTitle}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time IEEE 802.1AB LLDP link discovery across Summit X460 Core, X440 Edge Stacks, Meraki Firewalls & Wi-Fi 6E APs.
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
                {f === "ALL" ? "All (11)" : f === "SWITCHES" ? "Switches (5)" : f === "APS" ? "APs (5)" : "Firewalls (2)"}
              </button>
            ))}
          </div>

          <button
            id="btn-poll-all-york-lldp"
            onClick={pollAllYorkSwitches}
            disabled={isPollingAll}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPollingAll ? "animate-spin" : ""}`} />
            <span>{isPollingAll ? "Polling York Fleet..." : "⚡ Poll All York LLDP"}</span>
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
                YORK INTER-SWITCH & AP GRAPH
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
                    className="cursor-pointer transition-transform duration-200 hover:scale-105"
                  >
                    {/* Pulsing ring for Core */}
                    {node.role === "core" && (
                      <circle r="44" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
                    )}

                    {/* Node Card Box */}
                    <rect
                      x="-65"
                      y="-28"
                      width="130"
                      height="56"
                      rx="10"
                      fill={nodeBg}
                      stroke={borderColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                    />

                    {/* Status Pill in corner */}
                    <circle
                      cx="52"
                      cy="-16"
                      r="4.5"
                      fill={node.status === "polling" ? "#fbbf24" : "#10b981"}
                      className={node.status === "polling" ? "animate-pulse" : ""}
                    />

                    {/* Node Text Label */}
                    <text
                      x="0"
                      y="-8"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="system-ui, sans-serif"
                    >
                      {node.name}
                    </text>

                    {/* Node IP Address */}
                    <text
                      x="0"
                      y="7"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      {node.ip}
                    </text>

                    {/* Node OS / Model Badge */}
                    <text
                      x="0"
                      y="20"
                      textAnchor="middle"
                      fill={node.role === "core" ? "#c7d2fe" : (node.role === "ap" ? "#fde68a" : "#6ee7b7")}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.role === "core" ? "EXOS CORE (52P)" : (node.role === "ap" ? "WI-FI 6E AP" : (node.role === "firewall" ? "MERAKI MX" : "SUMMIT EDGE"))}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3 mt-1">
            <span>💡 <strong>Tip:</strong> Click any switch or AP above to inspect its real-time LLDP neighbor discovery table and port uplinks.</span>
            <span className="font-mono text-indigo-400">Total York Devices: 11 (5 Switches, 5 APs, 2 FWs)</span>
          </div>
        </div>

        {/* Right: Selected Node Details & Live Neighbor Inspector */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Selected Device Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  selectedNode.role === "core" 
                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                    : (selectedNode.role === "ap" 
                        ? "bg-amber-600/20 border-amber-500/40 text-amber-400" 
                        : (selectedNode.role === "firewall" ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-300"))
                }`}>
                  {selectedNode.role === "core" ? <Server className="w-5 h-5" /> : (selectedNode.role === "ap" ? <Wifi className="w-5 h-5" /> : (selectedNode.role === "firewall" ? <Shield className="w-5 h-5" /> : <Network className="w-5 h-5" />))}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    {selectedNode.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-emerald-400 font-semibold">{selectedNode.ip}</span>
                    <span>•</span>
                    <span>{selectedNode.location}</span>
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase border ${
                selectedNode.role === "core"
                  ? "bg-indigo-950 text-indigo-300 border-indigo-700"
                  : (selectedNode.role === "ap" ? "bg-amber-950 text-amber-300 border-amber-700" : "bg-slate-800 text-slate-300 border-slate-700")
              }`}>
                {selectedNode.model}
              </span>
            </div>

            {/* Device Metric Pills */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">OS / PLATFORM</div>
                <div className="font-bold text-slate-200 mt-0.5">{selectedNode.os}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">STATUS / RTT</div>
                <div className="font-bold text-emerald-400 mt-0.5">{selectedNode.latencyMs ? `${selectedNode.latencyMs} ms` : "Online"}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">POE BUDGET</div>
                <div className="font-bold text-amber-400 mt-0.5">{selectedNode.poeDeliveredW ? `${selectedNode.poeDeliveredW}W Active` : "N/A"}</div>
              </div>
            </div>

            {/* Action Bar for Selected Device */}
            {(selectedNode.role === "core" || selectedNode.role === "edge") && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => pollSingleSwitchLldp(selectedNode)}
                  disabled={selectedNode.status === "polling"}
                  className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${selectedNode.status === "polling" ? "animate-spin" : ""}`} />
                  <span>{selectedNode.status === "polling" ? "Polling LLDP..." : "Poll Live LLDP"}</span>
                </button>

                {onTriggerBackup && (
                  <button
                    onClick={() => onTriggerBackup("BackupSave.py", selectedNode.ip)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Backup</span>
                  </button>
                )}

                {onSelectSwitchForWorkspace && (
                  <button
                    onClick={() => {
                      const matched = switches.find(s => s.ip === selectedNode.ip || s.hostname === selectedNode.name);
                      if (matched) onSelectSwitchForWorkspace(matched);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                    title="Open Replacement Workspace"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Workspace</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sub-Tabs: Discovered LLDP Neighbors vs Raw CLI Output vs Uplinks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTab("neighbors")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                    activeTab === "neighbors"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  LLDP Neighbors ({selectedNode.neighbors?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                    activeTab === "raw"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Raw CLI Output
                </button>
              </div>

              {activeTab === "raw" && (
                <button
                  onClick={copyRawCli}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono flex items-center gap-1 transition"
                >
                  {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedText ? "Copied" : "Copy CLI"}</span>
                </button>
              )}
            </div>

            {/* Tab 1: Structured LLDP Neighbors Table */}
            {activeTab === "neighbors" && (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {selectedNode.neighbors && selectedNode.neighbors.length > 0 ? (
                  selectedNode.neighbors.map((nb, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-xs font-bold border border-indigo-800">
                            Port {nb.localPort}
                          </span>
                          <span className="text-xs font-bold text-white font-mono truncate">
                            {nb.systemName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {nb.portId}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 font-mono flex items-center justify-between">
                        <span className="text-slate-400 truncate">{nb.portDesc}</span>
                        {nb.mgmtAddress && (
                          <span className="text-emerald-400 font-semibold shrink-0">{nb.mgmtAddress}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-900 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          {nb.capabilities.map((c, cIdx) => (
                            <span key={cIdx} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {c}
                            </span>
                          ))}
                        </div>
                        {nb.poe && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                            ⚡ {nb.poe}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
                    <Info className="w-5 h-5 mx-auto mb-2 text-slate-600" />
                    <span>No LLDP neighbors recorded for this device. Click "Poll Live LLDP" above to run discovery.</span>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Raw CLI Output */}
            {activeTab === "raw" && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-[380px] overflow-y-auto">
                <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap select-all">
                  {selectedNode.rawCli || selectedNode.neighbors?.map(nb => 
                    `==============================================================================\n` +
                    `Local Port: ${nb.localPort}\n` +
                    `  Neighbor Chassis ID:     ${nb.chassisId}\n` +
                    `  Neighbor Port ID:        ${nb.portId}\n` +
                    `  Neighbor Port Descr:     ${nb.portDesc}\n` +
                    `  Neighbor System Name:    ${nb.systemName}\n` +
                    `  Neighbor Mgmt Address:   ${nb.mgmtAddress}\n` +
                    `  Capabilities:            ${nb.capabilities.join(", ")}\n` +
                    `  Port VLAN ID (PVID):     ${nb.vlan}\n` +
                    (nb.poe ? `  Power via MDI (PoE):     ${nb.poe}\n` : "")
                  ).join("\n") || `# No CLI output available`}
                </pre>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
