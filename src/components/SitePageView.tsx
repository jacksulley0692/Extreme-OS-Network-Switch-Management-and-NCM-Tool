import React, { useState, useRef, useEffect, useMemo } from "react";
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
  ExternalLink,
  Cpu,
  RefreshCw,
  Radio,
  Sparkles
} from "lucide-react";
import { SwitchItem, AuthUser, UserRole } from "../types";
import { extractSiteCode, formatSiteDisplayName } from "../utils/siteHierarchy";
import { findDiagramForSiteOrSwitch, getDiagramPngPathForSite } from "../data/siteDiagramsData";
import { YORK_DIAGRAM_SVG } from "../data/yorkDiagramSvg";
import { SITE_TOPOLOGIES, getTopologySvgForSite } from "../data/siteTopologiesData";
import { SiteHeatMapsSection } from "./SiteHeatMapsSection";
import { YorkLiveLldpTopologyMap } from "./YorkLiveLldpTopologyMap";

interface SitePageViewProps {
  siteCode: string;
  switches: SwitchItem[];
  onBackToAll: () => void;
  onSelectSwitch: (sw: SwitchItem) => void;
  onTriggerBackup?: (scriptName: string, targetSwitch: string) => void;
  onOpenDiagramTab?: (siteName: string) => void;
  currentUser?: AuthUser | null;
  currentUserRole?: UserRole;
}

export const SitePageView: React.FC<SitePageViewProps> = ({
  siteCode,
  switches,
  onBackToAll,
  onSelectSwitch,
  onTriggerBackup,
  onOpenDiagramTab,
  currentUser,
  currentUserRole
}) => {
  const displayName = formatSiteDisplayName(siteCode);

  const siteDiagram = useMemo(() => {
    return findDiagramForSiteOrSwitch(siteCode) || findDiagramForSiteOrSwitch(displayName);
  }, [siteCode, displayName]);

  // Filter for only this site's switches with strict deduplication
  const siteSwitches = useMemo(() => {
    const raw = switches.filter((sw) => {
      const detectedCode = extractSiteCode(sw.hostname || sw.ip);
      if (detectedCode === siteCode) return true;
      if (siteDiagram?.associatedHostnames?.includes(sw.hostname)) return true;
      if (siteDiagram?.switchIps?.includes(sw.ip)) return true;
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
  }, [switches, siteCode, siteDiagram]);

  const backedUpCount = siteSwitches.filter((sw) => sw.lastBackupStatus === "Success").length;
  const healthPercent = siteSwitches.length > 0 ? Math.round((backedUpCount / siteSwitches.length) * 100) : 100;

  // Site Page View Mode: Visual Node Graph is primary default!
  const [siteViewMode, setSiteViewMode] = useState<"graph" | "blueprint" | "heatmaps" | "switches" | "replacement">("graph");

  const [diagramOpen, setDiagramOpen] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  
  // Custom uploaded diagram state (supports PNG / SVG / JPG)
  const [customDiagramUrl, setCustomDiagramUrl] = useState<string | null>(null);
  const [customDiagramName, setCustomDiagramName] = useState<string>("");
  
  // Automatically discover if we have a bundled PNG file for this site
  const bundledPngUrl = useMemo(() => {
    return getDiagramPngPathForSite(siteCode) || getDiagramPngPathForSite(displayName);
  }, [siteCode, displayName]);

  const isYorkSite = siteCode.toUpperCase() === "YORK" || displayName.toLowerCase().includes("york");

  // Find matching vector topology definition if any
  const topologyDef = siteDiagram ? (SITE_TOPOLOGIES[siteDiagram.id] || SITE_TOPOLOGIES[siteDiagram.cleanName.toLowerCase()]) : SITE_TOPOLOGIES[siteCode.toLowerCase()];
  const topologySvg = topologyDef ? getTopologySvgForSite(topologyDef.siteId) : (isYorkSite ? YORK_DIAGRAM_SVG : null);
  const uplinkList = topologyDef?.uplinkSummary || (isYorkSite ? [
    { name: "DLC-York-Spa-SW1", link: "Core Port 9 ➔ Port 1" },
    { name: "DLC-York-Gym", link: "Core Port 37 ➔ Port 1" },
    { name: "DLL-York", link: "Core Port 42 ➔ Port 17" },
    { name: "DLC-York-MainComms-2", link: "Core Port 41 ➔ Port 48" }
  ] : []);

  const [activeDiagramMode, setActiveDiagramMode] = useState<"vector" | "image">("image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset states whenever active siteCode changes
  useEffect(() => {
    setCustomDiagramUrl(null);
    setCustomDiagramName("");
    setImageLoadError(false);
    setZoomLevel(100);
    // If bundled PNG exists, default to image mode; otherwise if topologySvg exists, vector mode
    if (bundledPngUrl) {
      setActiveDiagramMode("image");
    } else if (topologySvg) {
      setActiveDiagramMode("vector");
    } else {
      setActiveDiagramMode("image");
    }
  }, [siteCode, bundledPngUrl, topologySvg]);

  const effectiveImageUrl = customDiagramUrl || bundledPngUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomDiagramUrl(url);
      setCustomDiagramName(file.name);
      setImageLoadError(false);
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
      setImageLoadError(false);
      setActiveDiagramMode("image");
    }
  };

  return (
    <div className="space-y-5" id={`site-page-${siteCode.toLowerCase()}`}>
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
              {bundledPngUrl && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/80 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>Visio Verified Diagram</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {siteDiagram ? `Visio Workbook: ${siteDiagram.sourceFile} (${siteDiagram.tabName})` : `David Lloyd Estate Network Topology for ${displayName}`}
            </p>
          </div>
        </div>

        {/* Site Metrics & Action */}
        <div className="flex items-center space-x-4">
          <div className="text-right mr-2 hidden sm:block">
            <div className="text-xs text-slate-400">Site Backup Coverage</div>
            <div className="text-sm font-bold font-mono text-emerald-400">{healthPercent}% ({backedUpCount}/{siteSwitches.length || 1})</div>
          </div>
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
            <span>🗺️ Visual Node Graph</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live LLDP
            </span>
          </button>

          <button
            id="btn-site-tab-blueprint"
            onClick={() => setSiteViewMode("blueprint")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              siteViewMode === "blueprint"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-950/60 border border-slate-800"
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>📐 Visio Blueprint</span>
            {bundledPngUrl && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                Verified
              </span>
            )}
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
          <span>Core: <strong className="text-indigo-300">EXOS X460-G2</strong></span>
        </div>
      </div>

      {/* VIEW 1: Interactive Visual Node Graph */}
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

      {/* VIEW 2: Visio Blueprint Section */}
      {siteViewMode === "blueprint" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-200">
          <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white">
                    {displayName} Visio Engineering Blueprint &amp; Diagrams
                  </h3>
                  {isYorkSite ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      Visio Verified: DLC 3.vsdx (DLC - York)
                    </span>
                  ) : bundledPngUrl ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      Visio Diagram: {bundledPngUrl.split('/').pop()}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Network Blueprint
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted from verified Visio master workbooks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View Mode Toggle if image AND vector are available */}
              {effectiveImageUrl && topologySvg && (
                <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setActiveDiagramMode("image")}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                      activeDiagramMode === "image"
                        ? "bg-purple-600 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Verified PNG</span>
                  </button>
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
              {/* 1. Verified PNG Image Diagram View */}
              {activeDiagramMode === "image" && effectiveImageUrl && !imageLoadError ? (
                <div className="space-y-3">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Loaded Topology Diagram: <strong className="text-white">{customDiagramName || effectiveImageUrl.split('/').pop()}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={effectiveImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                        title="Open full resolution in new browser tab"
                      >
                        <span>Full Resolution</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={effectiveImageUrl}
                        download={`${displayName}_Topology_Diagram.png`}
                        className="text-purple-400 hover:underline flex items-center gap-1 text-[11px]"
                        title="Download PNG to disk"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>

                  <div 
                    className="bg-slate-900/40 rounded-xl p-4 shadow-inner border border-slate-800/80 overflow-x-auto flex justify-center items-center"
                    style={{ minHeight: "480px" }}
                  >
                    <img
                      src={effectiveImageUrl}
                      alt={`${displayName} Network Topology Diagram`}
                      onError={() => setImageLoadError(true)}
                      style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: "top center",
                        transition: "transform 0.15s ease-out",
                        maxWidth: "100%",
                        height: "auto",
                        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.5)",
                        borderRadius: "8px"
                      }}
                      className="select-none"
                    />
                  </div>
                </div>
              ) : topologySvg && (activeDiagramMode === "vector" || imageLoadError) ? (
                /* 2. High-fidelity Vector SVG Topology (York & Custom Blueprint) */
                <div className="space-y-4">
                  <div 
                    className="bg-white/95 rounded-xl p-4 shadow-inner border border-slate-800 overflow-x-auto flex justify-center items-center"
                    style={{ minHeight: "450px" }}
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
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
                /* 3. Drag & Drop Upload Fallback Area */
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-xl p-10 text-center space-y-3 cursor-pointer bg-slate-900/30 hover:bg-slate-900/60 transition"
                >
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl w-12 h-12 flex items-center justify-center mx-auto text-indigo-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Drop {displayName} Visio PNG diagram here</h4>
                    <p className="text-xs text-slate-400 mt-1">or click to browse from your computer (PNG, JPG, or SVG)</p>
                  </div>
                  <div className="inline-block px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono font-semibold">
                    Select {displayName} Diagram
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: Wireless RF Heatmaps */}
      {siteViewMode === "heatmaps" && (
        <div className="animate-in fade-in duration-200">
          <SiteHeatMapsSection siteCode={siteCode} siteName={displayName} />
        </div>
      )}

      {/* VIEW 4 or Always-available Switch Fleet Inventory */}
      {(siteViewMode === "switches" || siteViewMode === "graph") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                {displayName} Switch Fleet ({siteSwitches.length} Switches)
              </h3>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Click any switch card below to inspect live ports, LLDP neighbors, or download config.
            </div>
          </div>

          {siteSwitches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {siteSwitches.map((sw) => {
                const isExos = sw.os === "EXOS";
                const isSuccess = sw.lastBackupStatus === "Success";

                return (
                  <div
                    key={sw.id}
                    onClick={() => onSelectSwitch(sw)}
                    className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 cursor-pointer transition-all shadow-md group space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
                          {sw.hostname || sw.ip}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {sw.ip}
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
                          {sw.lastBackupStatus || "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 text-[11px]">
                      <span className="text-slate-500 text-[10px]">
                        {sw.ports?.length || 0} Ports &bull; {sw.backupLldpNeighbors?.length || 0} LLDP Neighbors
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
            <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 font-mono space-y-2">
              <div>No individual switch records detected with prefix &ldquo;{siteCode}&rdquo; in Switches.txt yet.</div>
              <div className="text-slate-500">Topology diagram and architectural blueprints are loaded above for engineering reference.</div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 5: Site Switch Replacement Workspace */}
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
                      {sw.format?.toUpperCase() || "XSF"}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-900 grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Model</span>
                      <span className="text-slate-200 truncate block">{sw.model || "Extreme Switch"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Backup</span>
                      <span className={sw.lastBackupStatus === "Success" ? "text-emerald-400 font-bold" : "text-slate-400"}>
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
    </div>
  );
};
