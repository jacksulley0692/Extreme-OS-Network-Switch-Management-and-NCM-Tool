// src/components/SitePageView.tsx
import React, { useState, useRef } from "react";
import { 
  Building2, 
  ArrowLeft, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Server, 
  Network, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
  Check,
  Eye,
  FileCode2,
  ExternalLink
} from "lucide-react";
import { SwitchItem } from "../types";
import { extractSiteCode, formatSiteDisplayName } from "../utils/siteHierarchy";
import { findDiagramForSiteOrSwitch, getDiagramPngPathForSite } from "../data/siteDiagramsData";
import { YORK_DIAGRAM_SVG } from "../data/yorkDiagramSvg";
import { SITE_TOPOLOGIES, getTopologySvgForSite } from "../data/siteTopologiesData";
import { SiteHeatMapsSection } from "./SiteHeatMapsSection";

interface SitePageViewProps {
  siteCode: string;
  switches: SwitchItem[];
  onBackToAll: () => void;
  onSelectSwitch: (sw: SwitchItem) => void;
  onTriggerBackup?: (scriptName: string, targetSwitch: string) => void;
  onOpenDiagramTab?: (siteName: string) => void;
}

export const SitePageView: React.FC<SitePageViewProps> = ({
  siteCode,
  switches,
  onBackToAll,
  onSelectSwitch,
  onTriggerBackup,
  onOpenDiagramTab
}) => {
  // Filter for only this site's switches
  const siteSwitches = switches.filter((sw) => extractSiteCode(sw.hostname || sw.ip) === siteCode);
  const backedUpCount = siteSwitches.filter((sw) => sw.lastBackupStatus === "Success").length;
  const healthPercent = siteSwitches.length > 0 ? Math.round((backedUpCount / siteSwitches.length) * 100) : 0;
  const displayName = formatSiteDisplayName(siteCode);

  const [diagramOpen, setDiagramOpen] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  
  // Custom uploaded diagram state (supports PNG / SVG / JPG)
  const [customDiagramUrl, setCustomDiagramUrl] = useState<string | null>(null);
  const [customDiagramName, setCustomDiagramName] = useState<string>("");
  
  // Automatically discover if we have an uploaded PNG file for this site
  const bundledPngUrl = getDiagramPngPathForSite(siteCode) || getDiagramPngPathForSite(displayName);
  
  const [activeDiagramMode, setActiveDiagramMode] = useState<"vector" | "image">(bundledPngUrl ? "image" : "vector");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const siteDiagram = findDiagramForSiteOrSwitch(siteCode) || findDiagramForSiteOrSwitch(displayName);
  const isYorkSite = siteCode.toUpperCase() === "YORK" || displayName.toLowerCase().includes("york");
  
  // Find matching vector topology definition
  const topologyDef = siteDiagram ? (SITE_TOPOLOGIES[siteDiagram.id] || SITE_TOPOLOGIES[siteDiagram.cleanName.toLowerCase()]) : SITE_TOPOLOGIES[siteCode.toLowerCase()];
  const topologySvg = topologyDef ? getTopologySvgForSite(topologyDef.siteId) : (isYorkSite ? YORK_DIAGRAM_SVG : null);
  const uplinkList = topologyDef?.uplinkSummary || (isYorkSite ? [
    { name: "DLC-York-Spa-SW1", link: "Core Port 9 ➔ Port 1" },
    { name: "DLC-York-Gym", link: "Core Port 37 ➔ Port 1" },
    { name: "DLL-York", link: "Core Port 42 ➔ Port 17" },
    { name: "DLC-York-MainComms-2", link: "Core Port 41 ➔ Port 48" }
  ] : []);

  const effectiveImageUrl = customDiagramUrl || bundledPngUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomDiagramUrl(url);
      setCustomDiagramName(file.name);
      setActiveDiagramMode("image");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomDiagramUrl(url);
      setCustomDiagramName(file.name);
      setActiveDiagramMode("image");
    }
  };

  return (
    <div className="space-y-6">
      {/* Site Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToAll}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition border border-slate-700 cursor-pointer"
            title="Back to All Sites"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-wide">{displayName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SITE CODE: {siteCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {siteSwitches.length} Switches
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Showing all switches matching identifier <code className="text-indigo-300 font-mono">*-{siteCode.toLowerCase()}-*</code>
            </p>
          </div>
        </div>

        {/* Site Metrics & Action */}
        <div className="flex items-center space-x-4">
          <div className="text-right mr-2 hidden sm:block">
            <div className="text-xs text-slate-400">Site Backup Coverage</div>
            <div className="text-sm font-bold font-mono text-emerald-400">{healthPercent}% ({backedUpCount}/{siteSwitches.length})</div>
          </div>
          {onTriggerBackup && (
            <button
              onClick={() => onTriggerBackup("BackupSave.py", siteSwitches[0]?.ip || "ALL")}
              className="flex items-center space-x-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Backup Site Switches</span>
            </button>
          )}
        </div>
      </div>

      {/* Embedded Site Network Diagram Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Site Physical &amp; Logical Topology Diagram
                </h3>
                {isYorkSite ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    Visio Verified: DLC 3.vsdx (DLC - York)
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Network Blueprint
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Core switch uplinks, firewall interconnects, and edge IDF distribution layouts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle if image or vector is available */}
            {(effectiveImageUrl || topologySvg) && (
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                {effectiveImageUrl && (
                  <button
                    onClick={() => setActiveDiagramMode("image")}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                      activeDiagramMode === "image"
                        ? "bg-purple-600 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Diagram PNG</span>
                  </button>
                )}
                {topologySvg && (
                  <button
                    onClick={() => setActiveDiagramMode("vector")}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                      activeDiagramMode === "vector"
                        ? "bg-indigo-600 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileCode2 className="w-3 h-3" />
                    <span>Vector Layout</span>
                  </button>
                )}
              </div>
            )}

            {/* Upload/Replace PNG Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 transition"
              title={`Upload or replace PNG diagram for ${displayName}`}
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>{effectiveImageUrl ? "Replace PNG" : "Upload PNG"}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 20, 60))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-200 text-[11px] px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 20, 200))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 text-slate-400 hover:text-white border-l border-slate-800 pl-1.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setDiagramOpen(!diagramOpen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title={diagramOpen ? "Collapse Diagram" : "Expand Diagram"}
            >
              {diagramOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {diagramOpen && (
          <div className="p-4 bg-slate-950">
            {/* PNG Diagram View */}
            {activeDiagramMode === "image" && effectiveImageUrl ? (
              <div className="space-y-3">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Loaded Site Diagram: <strong className="text-white">{customDiagramName || (effectiveImageUrl.split('/').pop())}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={effectiveImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Full Resolution</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-slate-400 hover:text-white text-[11px]"
                    >
                      Replace File
                    </button>
                  </div>
                </div>

                <div 
                  className="bg-slate-900/50 rounded-xl p-4 shadow-inner border border-slate-800/80 overflow-x-auto flex justify-center items-center"
                  style={{ minHeight: "450px" }}
                >
                  <img
                    src={effectiveImageUrl}
                    alt={`${displayName} Topology Diagram`}
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: "top center",
                      transition: "transform 0.15s ease-out",
                      maxWidth: "100%",
                      height: "auto"
                    }}
                    className="rounded-lg shadow-md border border-slate-800"
                  />
                </div>
              </div>
            ) : activeDiagramMode === "image" && !effectiveImageUrl ? (
              /* Drag and Drop Prompt for PNG */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition space-y-3"
              >
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl w-12 h-12 flex items-center justify-center mx-auto text-indigo-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Drop your {displayName} PNG diagram file here</h4>
                  <p className="text-xs text-slate-400 mt-1">or click to browse from your computer (PNG, JPG, or SVG)</p>
                </div>
                <div className="inline-block px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono font-semibold">
                  Select {displayName} PNG File
                </div>
              </div>
            ) : topologySvg ? (
              /* High-fidelity Vector Topology */
              <div className="space-y-4">
                <div 
                  className="bg-white/95 rounded-xl p-4 shadow-inner border border-slate-800 overflow-x-auto flex justify-center items-center"
                  style={{ minHeight: "420px" }}
                >
                  <div 
                    style={{ 
                      width: "100%", 
                      maxWidth: "1100px", 
                      transform: `scale(${zoomLevel / 100})`, 
                      transformOrigin: "top center",
                      transition: "transform 0.15s ease-out" 
                    }}
                    dangerouslySetInnerHTML={{ __html: topologySvg }}
                  />
                </div>

                {/* Uplink Ports Legend */}
                {uplinkList.length > 0 && (
                  <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(uplinkList.length, 4)} gap-2 text-xs font-mono`}>
                    {uplinkList.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                        <div className="text-purple-400 font-bold">{item.name}</div>
                        <div className="text-slate-400 mt-1">{item.link}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Generic Site Topology Blueprint */
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 text-center space-y-3">
                <Layers className="w-10 h-10 text-indigo-400 mx-auto opacity-70" />
                <h4 className="text-sm font-bold text-white font-mono">
                  {displayName.toUpperCase()} SITE NETWORK SCHEMATIC
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {siteDiagram 
                    ? `Matching Visio workbook: ${siteDiagram.sourceFile} (${siteDiagram.tabName})` 
                    : `Showing physical switch assignments and backup telemetry for ${displayName}.`}
                </p>
                {onOpenDiagramTab && (
                  <button
                    onClick={() => onOpenDiagramTab(displayName)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Open in Fullscreen Diagram Viewer</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wireless Site Heat Maps Section (Dynamic for all 130+ clubs, with full architectural blueprints) */}
      <SiteHeatMapsSection siteDisplayName={displayName} siteCode={siteCode} switches={siteSwitches} />

      {/* Grid of Switch Cards for this site */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-400" />
          <span>Switches Assigned to {displayName} ({siteSwitches.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {siteSwitches.map((sw) => {
            const isBackedUp = sw.lastBackupStatus === "Success";
            return (
              <div
                key={sw.id}
                onClick={() => onSelectSwitch(sw)}
                className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/5 group flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                      <span className="font-bold text-sm text-white font-mono">{sw.hostname || sw.ip}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                        isBackedUp
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {isBackedUp ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {isBackedUp ? "Backed Up" : "Unsaved / Pending"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1 flex items-center justify-between">
                    <span>IP: {sw.ip}</span>
                    <span className="text-slate-500">{sw.model || sw.os}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate">Last: {sw.lastBackupTime || "Recent"}</span>
                  <span className="text-indigo-400 group-hover:underline text-[11px]">View Config &amp; Tech Tools →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
