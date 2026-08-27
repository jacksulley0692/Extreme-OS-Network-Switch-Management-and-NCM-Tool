import React, { useState, useMemo } from "react";
import { 
  X, 
  Search, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
  Network, 
  Server, 
  ExternalLink,
  ChevronRight,
  Filter,
  Download
} from "lucide-react";
import { SwitchItem } from "../types";

export interface DiscoveredUnmanagedSwitch {
  id: string;
  vendor: "Netgear" | "TP-Link" | "D-Link" | "Linksys" | "Cisco Small Business" | "Unknown";
  model: string;
  ipAddress: string;
  macAddress: string;
  parentSwitchHostname: string;
  parentSwitchIp: string;
  connectedPort: string;
  detectedSubnet: string;
  firstSeen: string;
  status: "active" | "investigating" | "approved_temporary" | "quarantined";
  siteCode: string;
  confidenceScore: number;
  detectedDevicesBehindCount: number;
  riskLevel: "Low" | "Medium" | "High";
  notes?: string;
}

interface UnmanagedDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  switches: SwitchItem[];
  onSelectParentSwitch?: (sw: SwitchItem) => void;
}

export const UnmanagedDiscoveryModal: React.FC<UnmanagedDiscoveryModalProps> = ({
  isOpen,
  onClose,
  switches,
  onSelectParentSwitch
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string>("ALL");
  const [selectedRisk, setSelectedRisk] = useState<string>("ALL");
  const [selectedSite, setSelectedSite] = useState<string>("ALL");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Generate realistic discovered rogue/unmanaged devices attached to access ports
  const discoveredDevices: DiscoveredUnmanagedSwitch[] = useMemo(() => {
    const devices: DiscoveredUnmanagedSwitch[] = [
      {
        id: "rogue-ng-01",
        vendor: "Netgear",
        model: "ProSAFE GS108E 8-Port Gigabit",
        ipAddress: "10.32.221.188",
        macAddress: "A0:04:60:11:F2:4A",
        parentSwitchHostname: "DLC-York-Gym",
        parentSwitchIp: "10.32.221.250",
        connectedPort: "1:8",
        detectedSubnet: "10.32.221.0/24",
        firstSeen: "Yesterday at 14:22",
        status: "active",
        siteCode: "YORK",
        confidenceScore: 98,
        detectedDevicesBehindCount: 6,
        riskLevel: "High",
        notes: "Multi-MAC flood detected behind port 1:8. 6 MAC addresses registered on single edge port (Fitness Cardio console hub)."
      },
      {
        id: "rogue-tp-02",
        vendor: "TP-Link",
        model: "TL-SG105E Easy Smart",
        ipAddress: "10.32.224.195",
        macAddress: "50:D4:F7:88:31:0C",
        parentSwitchHostname: "DLC-Aberdeen-Gym",
        parentSwitchIp: "10.32.224.251",
        connectedPort: "1:4",
        detectedSubnet: "10.32.224.0/24",
        firstSeen: "3 days ago",
        status: "investigating",
        siteCode: "ABERDEEN",
        confidenceScore: 94,
        detectedDevicesBehindCount: 4,
        riskLevel: "Medium",
        notes: "Unmanaged desktop switch in Gym Admin office. 4 desktop workstations chained through single wall drop."
      },
      {
        id: "rogue-ng-03",
        vendor: "Netgear",
        model: "GS105v5 5-Port Gigabit Desktop",
        ipAddress: "10.32.54.177",
        macAddress: "9C:3D:CF:45:90:12",
        parentSwitchHostname: "DLL-Leeds-SubRack",
        parentSwitchIp: "10.32.54.252",
        connectedPort: "1:12",
        detectedSubnet: "10.32.54.0/24",
        firstSeen: "5 days ago",
        status: "approved_temporary",
        siteCode: "LEEDS",
        confidenceScore: 99,
        detectedDevicesBehindCount: 3,
        riskLevel: "Low",
        notes: "Temporary contractor testing switch in Plantroom B. Approved until end of month."
      },
      {
        id: "rogue-dl-04",
        vendor: "D-Link",
        model: "DGS-108 8-Port Gigabit Metal",
        ipAddress: "10.32.208.164",
        macAddress: "B0:C5:54:19:AA:33",
        parentSwitchHostname: "DLL-Bristol-LA-SubRack",
        parentSwitchIp: "10.32.208.252",
        connectedPort: "1:6",
        detectedSubnet: "10.32.208.0/24",
        firstSeen: "1 week ago",
        status: "quarantined",
        siteCode: "BRISTOL-LA",
        confidenceScore: 91,
        detectedDevicesBehindCount: 5,
        riskLevel: "High",
        notes: "Rogue switch detected in Club Lounge. High broadcast volume causing spanning-tree topology change notifications."
      },
      {
        id: "rogue-cs-05",
        vendor: "Cisco Small Business",
        model: "SG110D-08 8-Port Unmanaged",
        ipAddress: "10.32.61.144",
        macAddress: "00:26:0B:44:81:F0",
        parentSwitchHostname: "DLC-Leicester-Gym",
        parentSwitchIp: "10.32.61.251",
        connectedPort: "1:11",
        detectedSubnet: "10.32.61.0/24",
        firstSeen: "2 weeks ago",
        status: "active",
        siteCode: "LEICESTER",
        confidenceScore: 96,
        detectedDevicesBehindCount: 4,
        riskLevel: "Medium",
        notes: "Membership Sales hub unmanaged switch. 4 sales desktop terminals connected."
      }
    ];

    return devices;
  }, []);

  const handleRunFleetAudit = () => {
    setIsScanning(true);
    setScanProgress(10);
    const timer1 = setTimeout(() => setScanProgress(45), 600);
    const timer2 = setTimeout(() => setScanProgress(80), 1200);
    const timer3 = setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const filteredDevices = useMemo(() => {
    return discoveredDevices.filter(dev => {
      const matchesSearch = 
        !searchQuery ||
        dev.ipAddress.includes(searchQuery) ||
        dev.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.parentSwitchHostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.siteCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVendor = selectedVendor === "ALL" || dev.vendor === selectedVendor;
      const matchesRisk = selectedRisk === "ALL" || dev.riskLevel === selectedRisk;
      const matchesSite = selectedSite === "ALL" || dev.siteCode === selectedSite;

      return matchesSearch && matchesVendor && matchesRisk && matchesSite;
    });
  }, [discoveredDevices, searchQuery, selectedVendor, selectedRisk, selectedSite]);

  const uniqueSites = useMemo(() => {
    return Array.from(new Set(discoveredDevices.map(d => d.siteCode))).sort();
  }, [discoveredDevices]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Rogue &amp; Unmanaged Switch Discovery Engine
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {discoveredDevices.length} Detected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Passive MAC table &amp; CDP/LLDP multi-host analysis across Extreme EXOS &amp; VOSS edge ports (Netgear, TP-Link, D-Link).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Bar / Actions */}
        <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunFleetAudit}
              disabled={isScanning}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                isScanning
                  ? "bg-amber-600/50 text-amber-200 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? `Auditing FDB Tables (${scanProgress}%)...` : "Run Multi-MAC Port Audit"}</span>
            </button>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Audits port forwarding tables for &gt;1 MAC per access drop.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-rose-400 font-mono flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>2 High Risk (Loop / STP Risk)</span>
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search IP, MAC, Model, Port..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 text-xs"
            />
          </div>

          <div>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500 text-xs"
            >
              <option value="ALL">All Hardware Vendors</option>
              <option value="Netgear">Netgear ProSAFE</option>
              <option value="TP-Link">TP-Link EasySmart</option>
              <option value="D-Link">D-Link</option>
              <option value="Cisco Small Business">Cisco Small Business</option>
            </select>
          </div>

          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500 text-xs"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="High">High Risk (Broadcast/STP)</option>
              <option value="Medium">Medium Risk (Multi-MAC)</option>
              <option value="Low">Low Risk (Approved Temp)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500 text-xs"
            >
              <option value="ALL">All Sites ({uniqueSites.length})</option>
              {uniqueSites.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredDevices.length > 0 ? (
            filteredDevices.map(dev => {
              const isHigh = dev.riskLevel === "High";
              const isMed = dev.riskLevel === "Medium";

              return (
                <div
                  key={dev.id}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition shadow-md space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isHigh ? "bg-rose-500 animate-pulse" : isMed ? "bg-amber-400" : "bg-emerald-400"
                      }`} />
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {dev.vendor} {dev.model}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isHigh 
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                          : isMed 
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        {dev.riskLevel} Risk
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        Site: {dev.siteCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">
                        Confidence: <strong className="text-white">{dev.confidenceScore}%</strong>
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                        {dev.detectedDevicesBehindCount} Endpoints Behind
                      </span>
                    </div>
                  </div>

                  {/* Device Spec Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Discovered IP</span>
                      <span className="text-slate-200 font-bold">{dev.ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">OUI / MAC Address</span>
                      <span className="text-slate-300">{dev.macAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Connected Uplink Port</span>
                      <span className="text-amber-300 font-bold">{dev.connectedPort}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Parent Extreme Switch</span>
                      <div className="text-indigo-400 font-bold truncate">{dev.parentSwitchHostname}</div>
                      <div className="text-[10px] text-slate-500">{dev.parentSwitchIp}</div>
                    </div>
                  </div>

                  {/* Notes & Security Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs font-mono">
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {dev.notes}
                    </p>

                    <div className="flex items-center gap-2 shrink-0">
                      {onSelectParentSwitch && (
                        <button
                          onClick={() => {
                            const parent = switches.find(s => s.ip === dev.parentSwitchIp || s.hostname === dev.parentSwitchHostname);
                            if (parent) {
                              onSelectParentSwitch(parent);
                              onClose();
                            }
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                        >
                          <span>Go to Parent Switch</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
              No unmanaged switches match your current filter parameters.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>FDB Multi-MAC &amp; LLDP OUI Engine active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};
