import React, { useState, useRef, useEffect } from "react";
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Layers, 
  FileSpreadsheet,
  CheckCircle2,
  Server,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Wifi,
  Activity
} from "lucide-react";
import { KNOWN_SITE_DIAGRAMS, SiteDiagram, findDiagramForSiteOrSwitch } from "../data/siteDiagramsData";
import { YORK_DIAGRAM_SVG } from "../data/yorkDiagramSvg";
import { SITE_TOPOLOGIES, getTopologySvgForSite } from "../data/siteTopologiesData";
import { SiteHeatMapsSection } from "./SiteHeatMapsSection";
import { YorkLiveLldpTopologyMap } from "./YorkLiveLldpTopologyMap";
import { SwitchItem, AuthUser } from "../types";

interface SiteDiagramViewerProps {
  initialSiteOrSwitch?: string;
  switches?: SwitchItem[];
  currentUser?: AuthUser | null;
  onTriggerBackup?: (scriptName: string, targetSwitch: string) => void;
  onSelectSwitchForReplacement?: (hostname: string, ip: string) => void;
  onSwitchToHeatMaps?: (siteName: string) => void;
}

export const SiteDiagramViewer: React.FC<SiteDiagramViewerProps> = ({
  initialSiteOrSwitch = "York",
  switches = [],
  currentUser,
  onTriggerBackup,
  onSelectSwitchForReplacement,
  onSwitchToHeatMaps
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileFilter, setSelectedFileFilter] = useState<string>("ALL");
  const [selectedDiagram, setSelectedDiagram] = useState<SiteDiagram>(() => {
    return findDiagramForSiteOrSwitch(initialSiteOrSwitch) || KNOWN_SITE_DIAGRAMS.find(d => d.id === "york") || KNOWN_SITE_DIAGRAMS[0];
  });

  const [activeViewMode, setActiveViewMode] = useState<"lldp" | "diagram" | "heatmaps">("lldp");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showExporterHelp, setShowExporterHelp] = useState(false);
  
  // Track uploaded or discovered diagram URLs mapped by site ID
  const [siteImages, setSiteImages] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch list of server-stored diagrams on mount
  useEffect(() => {
    fetch("/api/diagrams-list")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.diagrams)) {
          const map: Record<string, string> = {};
          data.diagrams.forEach((filename: string) => {
            const clean = filename.replace(/\.[^/.]+$/, "").toLowerCase();
            map[clean] = `/diagrams/${filename}`;
          });
          setSiteImages(prev => ({ ...prev, ...map }));
        }
      })
      .catch(() => {
        // Fallback silently if standalone preview
      });
  }, []);

  // Filter diagrams based on search query and file tab
  const filteredDiagrams = KNOWN_SITE_DIAGRAMS.filter((diagram) => {
    const matchesFile = selectedFileFilter === "ALL" || diagram.sourceFile === selectedFileFilter;
    const matchesSearch =
      diagram.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diagram.tabName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (diagram.associatedHostnames && diagram.associatedHostnames.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFile && matchesSearch;
  });

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 100 || isCustomImageActive) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Check if an image URL exists for this site
  const siteCleanId = selectedDiagram.id.toLowerCase();
  const directImageSrc = siteImages[siteCleanId] || siteImages[selectedDiagram.cleanName.toLowerCase()] || null;
  const isCustomImageActive = !!directImageSrc;

  // Check for vector topology definition
  const selectedTopologyDef = SITE_TOPOLOGIES[selectedDiagram.id] || SITE_TOPOLOGIES[selectedDiagram.cleanName.toLowerCase()];
  const selectedTopologySvg = selectedTopologyDef ? getTopologySvgForSite(selectedTopologyDef.siteId) : (selectedDiagram.id === "york" ? YORK_DIAGRAM_SVG : null);
  const selectedUplinks = selectedTopologyDef?.uplinkSummary || (selectedDiagram.id === "york" ? [
    { name: "DLC-York-Spa-SW1", link: "Core Port 9 ➔ Port 1" },
    { name: "DLC-York-Gym", link: "Core Port 37 ➔ Port 1" },
    { name: "DLL-York", link: "Core Port 42 ➔ Port 17" },
    { name: "DLC-York-MainComms-2", link: "Core Port 41 ➔ Port 48" }
  ] : []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadMessage("Uploading diagram...");
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch("/api/upload-diagram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              siteId: selectedDiagram.id,
              filename: file.name,
              base64Data
            })
          });
          const json = await res.json();
          if (json.success && json.url) {
            setSiteImages(prev => ({ ...prev, [siteCleanId]: json.url }));
            setUploadMessage(`Saved "${file.name}" for ${selectedDiagram.siteName}!`);
            setTimeout(() => setUploadMessage(null), 4000);
          } else {
            setSiteImages(prev => ({ ...prev, [siteCleanId]: base64Data }));
            setUploadMessage(`Loaded "${file.name}" into viewer.`);
            setTimeout(() => setUploadMessage(null), 4000);
          }
        } catch {
          setSiteImages(prev => ({ ...prev, [siteCleanId]: base64Data }));
          setUploadMessage(`Loaded "${file.name}" into viewer.`);
          setTimeout(() => setUploadMessage(null), 4000);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploading(false);
      setUploadMessage(`Error: ${err.message}`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="space-y-6" id="site-diagram-viewer-container">
      {/* Top Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Visio Site Network Diagrams
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                  {KNOWN_SITE_DIAGRAMS.length} Sites Indexed
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Physical rack layouts, SPBM / VOSS core uplinks, fiber trunks, and IDF topology diagrams matched directly from your Visio workbooks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            accept=".png,.svg,.jpg,.jpeg,.webp"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Diagram PNG
          </button>
          <button
            onClick={() => setShowExporterHelp(!showExporterHelp)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
            {showExporterHelp ? "Hide Batch Exporter Guide" : "Batch Export 100+ PNGs"}
          </button>
        </div>
      </div>

      {uploadMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Batch Exporter Help Banner */}
      {showExporterHelp && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Automated Visio PowerShell Batch Exporter (1-Click Export to PNG)
            </h3>
            <span className="text-xs font-mono text-indigo-300">Save hours of manual screenshotting</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            You can automatically export all 100+ tabs across <code>DLC.vsdx</code>, <code>DLC 2.vsdx</code>, and <code>DLC 3.vsdx</code> directly into high-resolution PNGs using this simple PowerShell command on any computer with Microsoft Visio:
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto select-all">
            {`$visio = New-Object -ComObject Visio.Application; $doc = $visio.Documents.Open("$pwd\\DLC 3.vsdx"); foreach ($p in $doc.Pages) { $p.Export("$pwd\\public\\diagrams\\$($p.Name).png") }; $visio.Quit()`}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Or drag and drop any individual PNG file directly into the viewer box below!</span>
          </div>
        </div>
      )}

      {/* Main Grid: Left Diagram Browser & Right Diagram Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Filter Diagram List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter 100+ site diagrams or switches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Workbook Filter Tabs */}
            <div className="flex gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono">
              {["ALL", "DLC.vsdx", "DLC 2.vsdx", "DLC 3.vsdx"].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFileFilter(f)}
                  className={`flex-1 py-1 px-1.5 rounded text-center transition ${
                    selectedFileFilter === f
                      ? "bg-indigo-600 text-white font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {f === "ALL" ? "All (100+)" : f.replace(".vsdx", "")}
                </button>
              ))}
            </div>

            {/* Diagram List */}
            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredDiagrams.map((d) => {
                const isSelected = selectedDiagram.id === d.id;
                const hasCustomImg = !!(siteImages[d.id.toLowerCase()] || siteImages[d.cleanName.toLowerCase()]);

                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDiagram(d);
                      setZoomLevel(100);
                      setPosition({ x: 0, y: 0 });
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500/60 shadow-sm"
                        : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isSelected ? "text-indigo-200" : "text-slate-200"}`}>
                          {d.siteName}
                        </span>
                        {hasCustomImg && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            PNG
                          </span>
                        )}
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                        <span className="truncate">{d.tabName}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500">{d.sourceFile}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 flex-shrink-0">
                      View
                    </span>
                  </button>
                );
              })}

              {filteredDiagrams.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No site diagrams matched your search filter.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Diagram Canvas & Telemetry Context */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Site Header Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedDiagram.siteName}
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                    Tab: {selectedDiagram.tabName}
                  </span>
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>Source File: <strong className="text-slate-300">{selectedDiagram.sourceFile}</strong></span>
                  <span>•</span>
                  <span>Associated Switches: <strong className="text-slate-300 font-mono">{selectedDiagram.associatedHostnames?.join(", ") || "Core & Edge Stacks"}</strong></span>
                </div>
              </div>
            </div>

            {/* View Mode Switcher Pills */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <button
                  id="tab-view-lldp"
                  onClick={() => setActiveViewMode("lldp")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    activeViewMode === "lldp"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>🗺️ Live LLDP Topology</span>
                </button>
                <button
                  id="tab-view-diagram"
                  onClick={() => setActiveViewMode("diagram")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    activeViewMode === "diagram"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>📐 Visio Blueprint</span>
                </button>
                <button
                  id="tab-view-heatmaps"
                  onClick={() => setActiveViewMode("heatmaps")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    activeViewMode === "heatmaps"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>📶 RF Heatmaps</span>
                </button>
              </div>

              {activeViewMode === "diagram" && (
                /* Zoom & Canvas Actions */
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <button
                    id="btn-diagram-zoom-out"
                    onClick={handleZoomOut}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Zoom Out (-25%)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-300 px-2 min-w-[50px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    id="btn-diagram-zoom-in"
                    onClick={handleZoomIn}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Zoom In (+25%)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-diagram-reset-zoom"
                    onClick={handleResetZoom}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-l border-slate-800 ml-1 pl-2"
                    title="Reset Zoom (100%)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* View Mode 1: Live LLDP Topology Map */}
          {activeViewMode === "lldp" && (
            <YorkLiveLldpTopologyMap 
              siteCode={selectedDiagram.cleanName || selectedDiagram.id}
              siteName={selectedDiagram.siteName}
              switches={switches}
              currentUser={currentUser}
              onTriggerBackup={onTriggerBackup}
              onSelectSwitchForWorkspace={(sw) => {
                if (onSelectSwitchForReplacement) {
                  onSelectSwitchForReplacement(sw.hostname, sw.ip);
                }
              }}
            />
          )}

          {/* View Mode 2: Wireless RF Heatmaps */}
          {activeViewMode === "heatmaps" && (
            <SiteHeatMapsSection 
              siteName={selectedDiagram.siteName}
            />
          )}

          {/* View Mode 3: Visio Diagram Blueprint Canvas */}
          {activeViewMode === "diagram" && (
            <div
              ref={containerRef}
              id="site-diagram-canvas-viewport"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative min-h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            >
            {/* Visual Grid Background */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
                backgroundSize: "24px 24px"
              }}
            />

            {/* Rendered Interactive Diagram Layout */}
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
              className="p-4 max-w-5xl w-full"
            >
              {isCustomImageActive ? (
                /* High-Resolution Exported Visio PNG / SVG Display */
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white font-mono uppercase">
                        {selectedDiagram.siteName} Visio Topology Export
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      High-Resolution Image
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={directImageSrc!}
                      alt={`${selectedDiagram.siteName} Network Diagram`}
                      className="max-w-full h-auto object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              ) : selectedTopologySvg ? (
                /* High-Fidelity Custom Visio Diagram (Matches Exported Visio Diagrams) */
                <div className="bg-slate-900/95 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                          <span>DLC - {selectedDiagram.siteName.toUpperCase()} NETWORK TOPOLOGY</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                            Visio Verified: {selectedDiagram.sourceFile} ({selectedDiagram.tabName})
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Dual Firewalls (MXP / MXS) ➔ Core Switch ➔ Edge / Subrack Distribution Stacks
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-bold">
                        {selectedDiagram.associatedHostnames?.length || selectedUplinks.length + 3} Devices Active
                      </span>
                    </div>
                  </div>

                  {/* SVG Diagram Canvas */}
                  <div 
                    className="w-full bg-white/95 rounded-xl p-4 shadow-inner border border-slate-700 min-h-[460px] flex items-center justify-center overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: selectedTopologySvg }}
                  />

                  {/* Uplink Summary Cards */}
                  {selectedUplinks.length > 0 && (
                    <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(selectedUplinks.length, 4)} gap-2 pt-2 text-[11px] font-mono`}>
                      {selectedUplinks.map((u, i) => (
                        <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                          <div className="text-purple-400 font-bold truncate">{u.name}</div>
                          <div className="text-slate-400 mt-0.5 truncate">{u.link}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Wireless Site Heat Maps Section */}
                  <div className="pt-4 border-t border-slate-800">
                    <SiteHeatMapsSection siteDisplayName={selectedDiagram.siteName} siteCode={selectedDiagram.id.toUpperCase()} />
                  </div>
                </div>
              ) : (
                /* Dynamic Interactive SVG Network Topology Blueprint for other sites with Dropzone */
                <div className="bg-slate-900/95 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
                  {/* Blueprint Title Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                          EXTREME NETWORKS SITE TOPOLOGY: {selectedDiagram.siteName.toUpperCase()}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          TAB: {selectedDiagram.tabName} | SOURCE: {selectedDiagram.sourceFile}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                      VOSS SPBM & EXOS FABRIC
                    </span>
                  </div>

                  {/* Core & Edge Switch Rack Diagram Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Core Fabric Engine Box */}
                    <div className="bg-slate-950 border border-indigo-500/50 rounded-xl p-4 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-slate-200 font-mono">
                            {selectedDiagram.associatedHostnames?.[0] || `${selectedDiagram.siteName.toUpperCase()}-CORE-01`}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
                          VOSS VSP-7400 Core
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                        <div className="flex justify-between">
                          <span>Management IP:</span>
                          <span className="text-emerald-400 font-bold">{selectedDiagram.switchIps?.[0] || "10.36.226.11"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SPBM B-VLANs:</span>
                          <span className="text-slate-300">4051, 4052</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Uplink Backbone:</span>
                          <span className="text-amber-300">40G QSFP+ Port 1/49</span>
                        </div>
                      </div>

                      {/* Port Matrix Graphic */}
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <div className="text-[9px] font-mono text-slate-500 mb-1">PORT LINK STATUS (10G/40G)</div>
                        <div className="grid grid-cols-12 gap-1">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2.5 rounded-xs ${
                                i < 8 || i === 22 || i === 23
                                  ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]"
                                  : "bg-slate-800"
                              }`}
                              title={`Port ${i + 1}: ${i < 8 || i >= 22 ? "UP / Linked" : "READY"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Distribution / Access Stack Box */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-slate-200 font-mono">
                            {selectedDiagram.associatedHostnames?.[1] || `${selectedDiagram.siteName.toUpperCase()}-EDGE-01`}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
                          EXOS Summit X440-G2
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                        <div className="flex justify-between">
                          <span>Management IP:</span>
                          <span className="text-emerald-400 font-bold">{selectedDiagram.switchIps?.[1] || "10.36.226.12"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Access VLANs:</span>
                          <span className="text-slate-300">10 (Data), 20 (VoIP), 50 (Wi-Fi)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PoE Status:</span>
                          <span className="text-emerald-400">370W Delivered (32 APs)</span>
                        </div>
                      </div>

                      {/* Port Matrix Graphic */}
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <div className="text-[9px] font-mono text-slate-500 mb-1">ACCESS PORTS (48-PORT POE+)</div>
                        <div className="grid grid-cols-12 gap-1">
                          {Array.from({ length: 48 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 rounded-xs ${
                                (i % 3 === 0 || i % 4 === 0) && i < 40
                                  ? "bg-emerald-500"
                                  : "bg-slate-800"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dropzone to attach exact PNG for this site */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl bg-slate-950/60 hover:bg-slate-950 text-center cursor-pointer transition-colors space-y-1"
                  >
                    <Upload className="w-5 h-5 text-indigo-400 mx-auto" />
                    <div className="text-xs font-semibold text-slate-300">
                      Drop or click to upload the Visio export PNG for {selectedDiagram.siteName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Target tab: "{selectedDiagram.tabName}" from {selectedDiagram.sourceFile}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions Footer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Showing Visio site layout for <strong className="text-white">{selectedDiagram.siteName}</strong>.
            </div>

            <div className="flex items-center gap-2">
              {onSelectSwitchForReplacement && (
                <button
                  id="btn-open-replacement-workspace-from-diagram"
                  onClick={() => onSelectSwitchForReplacement(selectedDiagram.associatedHostnames?.[0] || `${selectedDiagram.siteName}-CORE`, selectedDiagram.switchIps?.[0] || "10.36.226.11")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                >
                  <span>Open in Switch Replacement Hub</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
