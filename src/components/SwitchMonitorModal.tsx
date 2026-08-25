import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Cpu, 
  Thermometer, 
  HardDrive, 
  RotateCw, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Copy, 
  Check, 
  Server, 
  Fan, 
  ShieldCheck, 
  Terminal, 
  Layers,
  Flame,
  Gauge
} from "lucide-react";
import { SwitchItem, SwitchTelemetryData, SwitchProcessEntry } from "../types";

interface SwitchMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  switchItem: SwitchItem | null;
}

export function SwitchMonitorModal({ isOpen, onClose, switchItem }: SwitchMonitorModalProps) {
  const [telemetry, setTelemetry] = useState<SwitchTelemetryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"overview" | "processes" | "cli">("overview");
  const [isCopiedCli, setIsCopiedCli] = useState<boolean>(false);
  const pollIntervalRef = useRef<any>(null);

  const fetchTelemetry = async (silent = false) => {
    if (!switchItem) return;
    if (!silent) setLoading(true);
    setError(null);

    try {
      let res = null;
      try {
        res = await fetch("/api/switch/monitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            switchIp: switchItem.ip,
            hostname: switchItem.hostname,
            os: switchItem.os
          })
        });
      } catch (e) {
        res = null;
      }

      if (!res || !res.ok) {
        const query = new URLSearchParams({
          switchIp: switchItem.ip,
          hostname: switchItem.hostname || "Switch",
          os: switchItem.os || "EXOS"
        });
        res = await fetch(`/api/switch/monitor?${query.toString()}`);
      }

      if (!res || !res.ok) {
        throw new Error(`Server responded with status ${res ? res.status : "Network Error"}`);
      }

      const data: SwitchTelemetryData = await res.json();
      setTelemetry(data);
    } catch (err: any) {
      console.error("Failed to fetch switch telemetry:", err);
      setError(err.message || "Failed to query switch telemetry");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && switchItem) {
      fetchTelemetry(false);
    } else {
      setTelemetry(null);
    }
  }, [isOpen, switchItem]);

  // Auto-refresh interval
  useEffect(() => {
    if (isOpen && autoRefresh && switchItem) {
      pollIntervalRef.current = setInterval(() => {
        fetchTelemetry(true);
      }, 3000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isOpen, autoRefresh, switchItem]);

  const handleCopyCli = () => {
    if (!telemetry?.rawCli) return;
    navigator.clipboard.writeText(telemetry.rawCli);
    setIsCopiedCli(true);
    setTimeout(() => setIsCopiedCli(false), 2000);
  };

  if (!isOpen || !switchItem) return null;

  const cpuPercent = telemetry?.cpuUtilizationPercent ?? 0;
  const memPercent = telemetry?.memoryUtilizationPercent ?? 0;
  const tempC = telemetry?.temperatureCelsius ?? 0;
  const tempF = telemetry?.temperatureFahrenheit ?? 0;

  // Colors based on thresholds
  const getCpuColor = (cpu: number) => {
    if (cpu >= 80) return { text: "text-rose-400", bg: "bg-rose-500", ring: "border-rose-500/40", badge: "bg-rose-950/80 text-rose-300 border-rose-800/60" };
    if (cpu >= 50) return { text: "text-amber-400", bg: "bg-amber-500", ring: "border-amber-500/40", badge: "bg-amber-950/80 text-amber-300 border-amber-800/60" };
    return { text: "text-emerald-400", bg: "bg-emerald-500", ring: "border-emerald-500/40", badge: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60" };
  };

  const getMemColor = (mem: number) => {
    if (mem >= 85) return { text: "text-rose-400", bg: "bg-rose-500", badge: "bg-rose-950/80 text-rose-300 border-rose-800/60" };
    if (mem >= 65) return { text: "text-amber-400", bg: "bg-amber-500", badge: "bg-amber-950/80 text-amber-300 border-amber-800/60" };
    return { text: "text-indigo-400", bg: "bg-indigo-500", badge: "bg-indigo-950/80 text-indigo-300 border-indigo-800/60" };
  };

  const getTempColor = (temp: number) => {
    if (temp >= 65) return { text: "text-rose-400", bg: "bg-rose-500", badge: "bg-rose-950/80 text-rose-300 border-rose-800/60", status: "Critical" };
    if (temp >= 50) return { text: "text-amber-400", bg: "bg-amber-500", badge: "bg-amber-950/80 text-amber-300 border-amber-800/60", status: "Warning" };
    return { text: "text-emerald-400", bg: "bg-emerald-500", badge: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60", status: "Normal" };
  };

  const cpuColor = getCpuColor(cpuPercent);
  const memColor = getMemColor(memPercent);
  const tempColor = getTempColor(tempC);

  return (
    <div 
      id="modal-switch-monitor-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="modal-switch-monitor-content"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30 text-indigo-400 shadow">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-tight flex items-center gap-2">
                  <span>{switchItem.hostname}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {switchItem.ip}
                  </span>
                </h2>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  switchItem.os === "EXOS"
                    ? "bg-indigo-950/80 text-indigo-300 border border-indigo-700/50"
                    : "bg-purple-950/80 text-purple-300 border border-purple-700/50"
                }`}>
                  {switchItem.os}
                </span>
                <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
                  {switchItem.model}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Switch Telemetry
                </span>
                <span>&bull;</span>
                <span>Port 23 / SSH Connected</span>
                {telemetry && <span>&bull; Latency: {telemetry.rttMs}ms</span>}
              </p>
            </div>
          </div>

          {/* Action controls & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors flex items-center gap-1.5 ${
                autoRefresh 
                  ? "bg-indigo-950 text-indigo-300 border-indigo-700/60" 
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
              title="Toggle 3-second live auto-refresh"
            >
              <RotateCw className={`w-3 h-3 ${autoRefresh ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Auto (3s)</span>
            </button>

            <button
              onClick={() => fetchTelemetry(false)}
              disabled={loading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Manual refresh"
            >
              <RotateCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800/80 bg-slate-950/50 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-xs font-bold font-mono border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Health &amp; Utilization Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("processes")}
            className={`px-4 py-2.5 text-xs font-bold font-mono border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "processes"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Process Breakdown ({telemetry?.topProcesses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("cli")}
            className={`px-4 py-2.5 text-xs font-bold font-mono border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "cli"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Raw CLI Telemetry Output</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong>Telemetry Query Failed:</strong> {error}
              </div>
            </div>
          )}

          {loading && !telemetry ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <RotateCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <div className="text-sm font-mono text-slate-300">Connecting to {switchItem.hostname} ({switchItem.ip})...</div>
              <div className="text-xs font-mono text-slate-500">Querying CPU utilization, thermals, and memory allocations</div>
            </div>
          ) : (
            <>
              {activeTab === "overview" && telemetry && (
                <div className="space-y-6">
                  
                  {/* 3 CORE REQUESTED KPI GAUGES (CPU %, Temperature, Memory %) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* KPI 1: CPU Utilization % */}
                    <div 
                      id="card-monitor-cpu"
                      className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                              CPU Utilization
                            </span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white flex items-baseline gap-1 pt-1">
                            <span className={cpuColor.text}>{cpuPercent.toFixed(1)}%</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono border ${cpuColor.badge}`}>
                          {cpuPercent < 50 ? "Healthy" : cpuPercent < 80 ? "Elevated" : "High Load"}
                        </span>
                      </div>

                      {/* CPU Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${cpuColor.bg}`}
                            style={{ width: `${Math.min(100, Math.max(2, cpuPercent))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>0%</span>
                          <span>Threshold: 80%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Mini Sparkline of CPU History */}
                      <div className="pt-2 border-t border-slate-900">
                        <div className="text-[10px] text-slate-400 font-mono uppercase mb-1.5 flex justify-between">
                          <span>Rolling 5-Min History</span>
                          <span className="text-slate-500">10 samples</span>
                        </div>
                        <div className="h-10 flex items-end gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-850">
                          {telemetry.cpuHistory.map((item, idx) => {
                            const barHeight = Math.max(12, Math.min(100, item.cpu));
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                <div 
                                  className={`w-full rounded-t transition-all duration-300 ${
                                    item.cpu >= 80 ? "bg-rose-500" : item.cpu >= 50 ? "bg-amber-500" : "bg-indigo-500/80"
                                  }`}
                                  style={{ height: `${barHeight}%` }}
                                />
                                <div className="hidden group-hover:block absolute -top-7 bg-slate-950 border border-slate-700 px-1.5 py-0.5 rounded text-[9px] font-mono text-white whitespace-nowrap z-20 shadow-md">
                                  {item.cpu}% @ {item.time}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* KPI 2: Temperature */}
                    <div 
                      id="card-monitor-temperature"
                      className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                              Temperature
                            </span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white flex items-baseline gap-2 pt-1">
                            <span className={tempColor.text}>{tempC.toFixed(1)}°C</span>
                            <span className="text-sm font-normal text-slate-400 font-mono">({tempF.toFixed(1)}°F)</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono border ${tempColor.badge}`}>
                          {tempColor.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Temperature Thermal Bar */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${tempColor.bg}`}
                            style={{ width: `${Math.min(100, Math.max(5, (tempC / telemetry.tempThresholdCelsius) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>0°C</span>
                          <span>Max Threshold: {telemetry.tempThresholdCelsius}°C</span>
                          <span>100°C</span>
                        </div>
                      </div>

                      {/* Fans and Thermals Summary */}
                      <div className="pt-2 border-t border-slate-900 font-mono text-xs space-y-2">
                        <div className="text-[10px] text-slate-400 uppercase">Chassis Fan Trays</div>
                        <div className="grid grid-cols-2 gap-2">
                          {telemetry.fans.map((fan) => (
                            <div key={fan.id} className="bg-slate-900/80 p-2 rounded border border-slate-800/80 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Fan className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                                <span className="text-slate-300 text-[11px]">{fan.name}</span>
                              </div>
                              <span className="text-emerald-400 font-bold text-[11px]">{fan.rpm} RPM</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* KPI 3: Memory Utilization % */}
                    <div 
                      id="card-monitor-memory"
                      className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                              Memory Utilization
                            </span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white flex items-baseline gap-1 pt-1">
                            <span className={memColor.text}>{memPercent.toFixed(1)}%</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono border ${memColor.badge}`}>
                          {telemetry.memoryUsedMb} MB Used
                        </span>
                      </div>

                      {/* Memory Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${memColor.bg}`}
                            style={{ width: `${Math.min(100, Math.max(2, memPercent))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>0 MB</span>
                          <span>Total: {telemetry.memoryTotalMb} MB</span>
                        </div>
                      </div>

                      {/* Memory Breakdown Stats */}
                      <div className="pt-2 border-t border-slate-900 font-mono text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                            <div className="text-[10px] text-slate-400 uppercase">Allocated RAM</div>
                            <div className="text-slate-200 font-bold text-xs mt-0.5">
                              {telemetry.memoryUsedMb} MB ({memPercent}%)
                            </div>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                            <div className="text-[10px] text-slate-400 uppercase">Available Free</div>
                            <div className="text-emerald-400 font-bold text-xs mt-0.5">
                              {telemetry.memoryFreeMb} MB ({(100 - memPercent).toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* System & Hardware Health Strip */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 font-mono text-xs space-y-4 shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white uppercase tracking-wider text-xs">
                          Hardware Environment &amp; Chassis Subsystems
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        Last Telemetry Poll: {telemetry.timestamp.split(" ")[1] || telemetry.timestamp}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      
                      {/* Uptime */}
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>System Uptime</span>
                        </div>
                        <div className="text-white font-bold text-xs mt-1 truncate" title={telemetry.uptime}>
                          {telemetry.uptime}
                        </div>
                      </div>

                      {/* Power Supplies */}
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Power Supplies (PSU)</span>
                        </div>
                        <div className="text-emerald-400 font-bold text-xs mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>2 / 2 Online (Redundant)</span>
                        </div>
                      </div>

                      {/* Primary Gateway & Subnet */}
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                          <Server className="w-3 h-3 text-purple-400" />
                          <span>Management Gateway</span>
                        </div>
                        <div className="text-slate-200 font-bold text-xs mt-1">
                          {switchItem.gateway || "10.32.54.1"}
                        </div>
                      </div>

                      {/* Firmware & Kernel */}
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-emerald-400" />
                          <span>OS Version</span>
                        </div>
                        <div className="text-indigo-300 font-bold text-xs mt-1 truncate" title={switchItem.firmware}>
                          {switchItem.firmware}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: Process Breakdown */}
              {activeTab === "processes" && telemetry && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">Active Switch CPU Processes</h3>
                      <p className="text-xs text-slate-400 font-mono">Live process scheduler utilization polled from kernel</p>
                    </div>
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-800">
                      Total CPU: {cpuPercent}%
                    </span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-4">PID</th>
                          <th className="py-2.5 px-4">Process Name</th>
                          <th className="py-2.5 px-4">State</th>
                          <th className="py-2.5 px-4 text-right">CPU Load (%)</th>
                          <th className="py-2.5 px-4">Utilization Bar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-slate-200">
                        {telemetry.topProcesses.map((proc) => (
                          <tr key={proc.pid} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-2.5 px-4 text-slate-400">{proc.pid}</td>
                            <td className="py-2.5 px-4 font-bold text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-indigo-400" />
                              <span>{proc.name}</span>
                            </td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                proc.state === "Running" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-slate-900 text-slate-400 border border-slate-800"
                              }`}>
                                {proc.state}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right font-bold text-indigo-300">
                              {proc.cpuPercent.toFixed(1)}%
                            </td>
                            <td className="py-2.5 px-4 w-40">
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${Math.min(100, Math.max(3, proc.cpuPercent * 4))}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: Raw CLI Output */}
              {activeTab === "cli" && telemetry && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">Live CLI Commands Output</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Direct CLI transcript of <code className="text-indigo-300">show cpu-utilization</code>, <code className="text-indigo-300">show temperature</code>, and <code className="text-indigo-300">show memory</code>
                      </p>
                    </div>

                    <button
                      onClick={handleCopyCli}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow"
                    >
                      {isCopiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>{isCopiedCli ? "Copied Output!" : "Copy CLI Log"}</span>
                    </button>
                  </div>

                  <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[420px] shadow-inner">
                    {telemetry.rawCli}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Target IP: <strong className="text-white">{switchItem.ip}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
          >
            Close Monitor
          </button>
        </div>

      </div>
    </div>
  );
}
