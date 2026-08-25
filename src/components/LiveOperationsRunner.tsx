import React, { useState } from "react";
import { LiveStatusData, SwitchItem } from "../types";
import { 
  Play, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Terminal, 
  FileSpreadsheet, 
  HardDrive, 
  ShieldCheck, 
  Activity,
  Zap,
  Sliders,
  Server,
  Cpu,
  RefreshCw
} from "lucide-react";
import { BackupOptionsModal, BackupExecutionOptions } from "./BackupOptionsModal";

interface LiveOperationsRunnerProps {
  liveStatus: LiveStatusData | null;
  switches: SwitchItem[];
  onTriggerBackup: (scriptName: string, targetSwitch: string) => void;
}

export function LiveOperationsRunner({ liveStatus, switches, onTriggerBackup }: LiveOperationsRunnerProps) {
  const [selectedScript, setSelectedScript] = useState<string>("BackupSave.py");
  const [selectedTarget, setSelectedTarget] = useState<string>("ALL");
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [backupOptionsOpen, setBackupOptionsOpen] = useState<boolean>(false);
  const [optionsTargetSwitch, setOptionsTargetSwitch] = useState<SwitchItem | null>(null);

  const handleRun = async () => {
    setIsTriggering(true);
    await onTriggerBackup(selectedScript, selectedTarget);
    setTimeout(() => setIsTriggering(false), 800);
  };

  const handleQuickBackupAll = (script: string) => {
    onTriggerBackup(script, "ALL");
  };

  const handleQuickBackupSwitch = (ip: string, script: string = "BackupSave.py") => {
    onTriggerBackup(script, ip);
  };

  const handleOpenOptions = (sw: SwitchItem | null) => {
    setOptionsTargetSwitch(sw);
    setBackupOptionsOpen(true);
  };

  const isRunning = liveStatus?.status === "RUNNING" || liveStatus?.status?.includes("RUNNING");

  return (
    <div id="live-operations-runner-root" className="space-y-6">
      {/* Top Operations Header & Dispatcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              <span>Automated Task Dispatcher & Backup Options</span>
            </div>
            <h2 className="text-xl font-bold text-white">Switch Backup & Port Audit Operations Center</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Execute real-time backups for individual switches or your entire fleet with granular options (Save config, TFTP target, VR selection, and LLDP mapping).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-open-backup-options"
              onClick={() => handleOpenOptions(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Backup Options Dialog</span>
            </button>

            <button
              id="btn-quick-backup-all"
              onClick={() => handleQuickBackupAll("BackupSave.py")}
              disabled={isTriggering || isRunning}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold shadow transition-all ${
                isRunning
                  ? "bg-amber-600 text-white cursor-not-allowed animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40"
              }`}
            >
              {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
              <span>{isRunning ? "Backup Running..." : "Backup All Switches"}</span>
            </button>
          </div>
        </div>

        {/* Quick Backup Preset Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-800">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-mono">BackupSave.py</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                  Default Option
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Executes <code className="text-emerald-400 font-mono">save configuration primary</code> prior to TFTP backup.
              </p>
            </div>
            <button
              onClick={() => handleQuickBackupAll("BackupSave.py")}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/90 hover:bg-emerald-600 text-white transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Run Backup All (Save + Export)</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-mono">extreme_switch_backup.py</span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                  Multi-Hop Option
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Backups with automatic jump-box fallback for switches on isolated VLANs.
              </p>
            </div>
            <button
              onClick={() => handleQuickBackupAll("extreme_switch_backup.py")}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/90 hover:bg-indigo-600 text-white transition-colors"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Run Multi-Hop Backup All</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-mono">port_description_report.py</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded font-semibold">
                  Excel Audit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Gathers port names, descriptions, PoE statistics, and LLDP neighbors to Excel.
              </p>
            </div>
            <button
              onClick={() => handleQuickBackupAll("port_description_report.py")}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600/90 hover:bg-purple-600 text-white transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Generate Fleet Port Audit (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Per-Switch Quick Backup Option Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Individual Switch Backup Options</h3>
            <p className="text-xs text-slate-400">Trigger on-demand backups or customize parameters per switch</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{switches.length} Switches Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-3 py-2">Switch Hostname</th>
                <th className="px-3 py-2">Management IP</th>
                <th className="px-3 py-2">OS / Model</th>
                <th className="px-3 py-2">Last Backup</th>
                <th className="px-3 py-2 text-right">Switch Backup Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {switches.map((sw) => (
                <tr key={sw.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-bold text-white">{sw.hostname}</td>
                  <td className="px-3 py-2.5 text-emerald-400">{sw.ip}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      sw.os === "EXOS" ? "bg-indigo-950 text-indigo-300 border border-indigo-800" : "bg-purple-950 text-purple-300 border border-purple-800"
                    }`}>
                      {sw.os}
                    </span>
                    <span className="ml-1.5 text-slate-400 font-sans text-[11px]">{sw.model}</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 text-[11px]">{sw.lastBackupTime}</td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        id={`btn-backup-switch-table-${sw.id}`}
                        onClick={() => handleQuickBackupSwitch(sw.ip, "BackupSave.py")}
                        disabled={isRunning}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-[11px] font-semibold transition-colors"
                        title={`Run BackupSave.py for ${sw.hostname}`}
                      >
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span>Backup Switch</span>
                      </button>

                      <button
                        id={`btn-options-switch-table-${sw.id}`}
                        onClick={() => handleOpenOptions(sw)}
                        className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                        title="Custom backup options for this switch"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isRunning ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <div>
              <h3 className="font-bold text-white text-sm">
                Engine State: <span className={isRunning ? "text-amber-400 font-mono" : "text-emerald-400 font-mono"}>{liveStatus?.status || "IDLE"}</span>
              </h3>
              <div className="text-xs text-slate-400 font-mono">
                Active Script: {liveStatus?.script || "None"} | Target: {liveStatus?.current_switch || "All"} | Progress: {liveStatus?.progress || "0/0 (0%)"}
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            Last Updated: {liveStatus?.updated_at ? new Date(liveStatus.updated_at).toLocaleTimeString() : "Just now"}
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Completed / Success</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">{liveStatus?.counts?.success ?? 5}</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Warnings / Auto-Saved</div>
            <div className="text-lg font-bold text-amber-400 font-mono">{liveStatus?.counts?.warning ?? 1}</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Multi-Hop Routed</div>
            <div className="text-lg font-bold text-indigo-400 font-mono">{liveStatus?.counts?.hopped ?? 1}</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Failed / Unreachable</div>
            <div className="text-lg font-bold text-slate-400 font-mono">{liveStatus?.counts?.failed ?? 0}</div>
          </div>
        </div>

        {/* Action Ticker */}
        {liveStatus?.latest_action && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="text-slate-500">&gt;</span>
            <span className="text-emerald-300 truncate">{liveStatus.latest_action}</span>
          </div>
        )}

        {/* Real-time Status.txt Terminal Output */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>status.txt / Watch-Status.ps1 stream</span>
            </div>
            <span className="text-[11px] text-slate-500">Live Polling: 3s</span>
          </div>
          <pre className="p-4 text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {liveStatus?.rawText || `==================================================
 Script:         ${liveStatus?.script || "BackupSave.py"}
 Status:         ${liveStatus?.status || "COMPLETED"}
 Progress:       ${liveStatus?.progress || "5/5 (100%)"}
 Current Switch: ${liveStatus?.current_switch || "10.36.226.88"}
 Latest Action:  ${liveStatus?.latest_action || "All 5 switch configurations saved & exported."}
==================================================`}
          </pre>
        </div>
      </div>

      {/* Advanced Backup Options Modal */}
      <BackupOptionsModal
        isOpen={backupOptionsOpen}
        onClose={() => setBackupOptionsOpen(false)}
        targetSwitch={optionsTargetSwitch}
        allSwitches={switches}
        onExecuteBackup={(options) => onTriggerBackup(options.scriptName, options.targetIp)}
        isRunning={isRunning}
      />
    </div>
  );
}
