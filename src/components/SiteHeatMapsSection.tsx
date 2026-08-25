// src/components/SiteHeatMapsSection.tsx
import React, { useState, useRef, useEffect } from "react";
import { 
  Wifi, 
  Layers, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileSpreadsheet, 
  Radio, 
  Maximize2, 
  Minimize2, 
  Upload,
  Image as ImageIcon,
  Grid,
  FileCode,
  Sparkles,
  Server
} from "lucide-react";
import { getHeatMapPlansForSite, HeatMapAP, HeatMapPlan } from "../data/siteHeatMapsData";
import { SwitchItem } from "../types";

interface SiteHeatMapsSectionProps {
  siteDisplayName?: string;
  siteCode?: string;
  switches?: SwitchItem[];
}

export const SiteHeatMapsSection: React.FC<SiteHeatMapsSectionProps> = ({
  siteDisplayName = "York",
  siteCode = "YORK",
  switches = []
}) => {
  const plans = getHeatMapPlansForSite(siteDisplayName || siteCode, switches);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("ground_floor");
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedAp, setSelectedAp] = useState<HeatMapAP | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Custom uploaded heat map storage per floor plan
  const [customHeatMapUrls, setCustomHeatMapUrls] = useState<Record<string, string>>({});
  const [customHeatMapNames, setCustomHeatMapNames] = useState<Record<string, string>>({});
  const [activeRenderer, setActiveRenderer] = useState<"image" | "vector" | "custom">("image");
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset selected plan if not in current site plans
  useEffect(() => {
    if (!plans.some(p => p.id === selectedPlanId)) {
      setSelectedPlanId(plans[0]?.id || "ground_floor");
    }
  }, [siteDisplayName, siteCode]);

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomHeatMapUrls(prev => ({ ...prev, [selectedPlanId]: url }));
      setCustomHeatMapNames(prev => ({ ...prev, [selectedPlanId]: file.name }));
      setActiveRenderer("custom");
    }
  };

  const handleExportCsv = () => {
    const headers = "Site,Floor Plan,AP ID,AP Hostname,Model,Bands,Channels,TX Power,Signal (dBm),Location,Switch Uplink Port,Active Clients\n";
    const rows = plans.flatMap(plan => 
      plan.aps.map(ap => 
        `"${siteDisplayName}","${plan.title}","${ap.id}","${ap.name}","${ap.model}","${ap.band}","${ap.channel}","${ap.txPower}",${ap.signalDbm},"${ap.location}","${ap.switchPort || 'N/A'}",${ap.connectedClients || 0}`
      )
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `David_Lloyd_${siteDisplayName.replace(/\s+/g, '_')}_Wireless_AP_Heatmap_Audit.csv`;
    link.click();
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([currentPlan.svgContent], { type: "image/svg+xml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${siteDisplayName}_${currentPlan.id}_Vector.svg`;
    link.click();
  };

  const currentImageUrl = customHeatMapUrls[selectedPlanId] || `/diagrams/${currentPlan.fileSource}`;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl transition-all ${isFullscreen ? "fixed inset-2 z-50 overflow-y-auto bg-slate-950 p-4" : ""}`} id={`heat-map-section-${siteCode.toLowerCase()}`}>
      {/* 1. Main Header with Heading "Site Heat Maps" */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 text-lg shadow-sm">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Wi-Fi Signal Heat Maps
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Wi-Fi 6E RF Coverage</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                David Lloyd {siteDisplayName} ({plans.length} Floor Plans)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Architectural RF signal strength heat maps, Extreme Networks AP density, and voice/data SLA contours for {siteDisplayName}.
            </p>
          </div>
        </div>

        {/* Action Controls & Exporters */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`/diagrams/${currentPlan.fileSource}`}
            download={currentPlan.fileSource}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 transition shadow-sm cursor-pointer"
            title="Download original PNG file"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download PNG</span>
          </a>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 transition shadow-sm cursor-pointer"
            title="Export full AP allocation and signal strength audit to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export AP Audit CSV</span>
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 transition shadow-sm cursor-pointer"
            title="Download vector SVG of current floor plan"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download SVG</span>
          </button>
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition shadow-sm cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Floor Plan Selector Tabs & View Toggles */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Floor Plan Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId && viewMode === "single";
            return (
              <button
                key={plan.id}
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setViewMode("single");
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/30"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{plan.title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isSelected ? "bg-emerald-700 text-emerald-100" : "bg-slate-800 text-slate-400"}`}>
                  {plan.aps.length} APs
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setViewMode("grid")}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              viewMode === "grid"
                ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-900/30"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>All {plans.length} Plans (Grid)</span>
          </button>
        </div>

        {/* Rendering Mode Toggles (Image PNG vs Vector Blueprint vs Upload) */}
        {viewMode === "single" && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveRenderer("image")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition cursor-pointer ${
                  activeRenderer === "image"
                    ? "bg-emerald-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="View original architectural high-resolution floor plan image (PNG)"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Floor Plan PNG</span>
              </button>
              <button
                onClick={() => setActiveRenderer("vector")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition cursor-pointer ${
                  activeRenderer === "vector"
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="View interactive SVG blueprint with clickable AP sensors"
              >
                <FileCode className="w-3 h-3" />
                <span>Vector Blueprint</span>
              </button>
              <button
                onClick={() => setActiveRenderer("custom")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition cursor-pointer ${
                  activeRenderer === "custom"
                    ? "bg-purple-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="View or upload custom floor plan file"
              >
                <Upload className="w-3 h-3" />
                <span>{customHeatMapNames[selectedPlanId] ? "Custom PNG" : "Custom"}</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 font-mono text-[11px] transition shadow-sm cursor-pointer"
              title="Upload your exact high-res PNG file for this floor plan"
            >
              <Upload className="w-3 h-3 text-emerald-400" />
              <span>{customHeatMapUrls[selectedPlanId] ? "Replace PNG" : "Upload PNG"}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 font-mono text-[11px]">
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 20, 60))}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-200 px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 20, 240))}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 text-slate-400 hover:text-white border-l border-slate-800 pl-1.5 cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Viewer Body */}
      {viewMode === "single" ? (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Plan Meta Banner */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">{currentPlan.title}</span>
                <span className="text-slate-500 font-mono">|</span>
                <span className="text-slate-300 font-mono">Source: {currentPlan.fileSource}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono">
                  {currentPlan.drawingNumber}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{currentPlan.subtitle}</p>
            </div>

            {/* Coverage SLA Metrics */}
            <div className="flex items-center gap-3 font-mono text-[11px] flex-wrap">
              <div className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                <span className="text-slate-400 mr-1.5">Avg RF:</span>
                <span className="text-emerald-400 font-bold">{currentPlan.coverageStats.avgSignalDbm} dBm</span>
              </div>
              <div className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                <span className="text-slate-400 mr-1.5">Excellent Area:</span>
                <span className="text-emerald-400 font-bold">{currentPlan.coverageStats.excellentAreaPercent}%</span>
              </div>
              <div className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                <span className="text-slate-400 mr-1.5">Active Clients:</span>
                <span className="text-indigo-300 font-bold">{currentPlan.coverageStats.primaryClients}</span>
              </div>
            </div>
          </div>

          {/* Interactive Graphic Canvas / Image / SVG Viewer */}
          <div className="bg-slate-950 rounded-xl p-2 sm:p-4 border border-slate-800 overflow-x-auto flex justify-center items-center relative shadow-inner min-h-[480px]">
            {activeRenderer === "image" || (activeRenderer === "custom" && customHeatMapUrls[selectedPlanId]) ? (
              <div className="w-full flex flex-col items-center justify-center">
                {!imageLoadError[selectedPlanId] ? (
                  <img
                    src={currentImageUrl}
                    alt={currentPlan.title}
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: "top center",
                      transition: "transform 0.15s ease-out",
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "850px"
                    }}
                    className="rounded-lg shadow-2xl border border-slate-800"
                    onError={() => {
                      setImageLoadError(prev => ({ ...prev, [selectedPlanId]: true }));
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "1280px",
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: "top center",
                      transition: "transform 0.15s ease-out"
                    }}
                    dangerouslySetInnerHTML={{ __html: currentPlan.svgContent }}
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  maxWidth: "1280px",
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.15s ease-out"
                }}
                dangerouslySetInnerHTML={{ __html: currentPlan.svgContent }}
              />
            )}
          </div>

          {/* 4. Access Point Inventory & Connected Switch Uplinks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 Cols: AP Table & Ports */}
            <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Deployed Access Points for {currentPlan.title} ({currentPlan.aps.length})
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Extreme Networks AP Series
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentPlan.aps.map((ap) => {
                  const isSelected = selectedAp?.id === ap.id;
                  return (
                    <div
                      key={ap.id}
                      onClick={() => setSelectedAp(isSelected ? null : ap)}
                      className={`p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-950/50"
                          : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-400 ring-2 ring-emerald-300" : "bg-emerald-400"}`} />
                          <span className="font-bold text-slate-100">{ap.id}</span>
                          <span className="text-slate-400 text-[10px]">({ap.model})</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-bold">
                          {ap.signalDbm} dBm
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 mt-1.5 font-sans font-medium">
                        {ap.location}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Ch: <strong className="text-slate-300">{ap.channel}</strong></span>
                        <span>Clients: <strong className="text-indigo-300">{ap.connectedClients || 0}</strong></span>
                      </div>

                      {ap.switchPort && (
                        <div className="mt-1.5 text-[10px] text-purple-300 flex items-center gap-1 truncate font-mono">
                          <span>🔌</span>
                          <span className="truncate">{ap.switchPort}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 1 Col: RF Zone Legend & SLA Compliance */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
              <div className="border-b border-slate-800/80 pb-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  RF Zones &amp; Signal Auditing
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Assigned Extreme AP &amp; predicted SLA RSSI
                </p>
              </div>

              <div className="space-y-2">
                {currentPlan.zones.map((zone, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-slate-200">{zone.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">AP: {zone.apAssigned}</div>
                    </div>
                    <div className={`font-mono text-[11px] font-bold ${zone.signalColor}`}>
                      {zone.signal}
                    </div>
                  </div>
                ))}
              </div>

              {/* RSSI Color Legend */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  RSSI Contour Scale
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                    <span>&ge; -55 dBm (Ultra)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-sm bg-lime-500"></span>
                    <span>-55 to -65 dBm (Good)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500"></span>
                    <span>-65 to -72 dBm (Voice)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-sm bg-orange-500"></span>
                    <span>&lt; -72 dBm (Fair)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View: All Plans Side-by-Side */
        <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition group shadow-lg"
            >
              <div>
                <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-xs">{plan.title}</h3>
                    <p className="text-[10px] text-slate-400">{plan.fileSource}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-mono font-bold">
                    {plan.aps.length} APs
                  </span>
                </div>

                <div 
                  className="p-2 cursor-pointer relative bg-slate-950 flex items-center justify-center min-h-[220px]"
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setViewMode("single");
                  }}
                >
                  <img
                    src={`/diagrams/${plan.fileSource}`}
                    alt={plan.title}
                    className="max-h-[240px] w-auto rounded border border-slate-800 group-hover:scale-[1.02] transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Open Plan</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs">
                <div className="text-[11px] font-mono text-slate-400">
                  <span>Avg RF: <strong className="text-emerald-400">{plan.coverageStats.avgSignalDbm} dBm</strong></span>
                </div>
                <button
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setViewMode("single");
                  }}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export backward compatible alias
export const YorkHeatMapsSection = SiteHeatMapsSection;
