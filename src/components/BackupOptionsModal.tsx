import React, { useState } from "react";
import { SwitchItem } from "../types";
import { 
  Zap, 
  HardDrive, 
  Server, 
  Settings2, 
  CheckCircle2, 
  X, 
  Play, 
  Radio, 
  FileSpreadsheet, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  RotateCw,
  Cpu
} from "lucide-react";

interface BackupOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSwitch: SwitchItem | null; // null means "ALL Switches"
  allSwitches: SwitchItem[];
  onExecuteBackup: (options: BackupExecutionOptions) => void;
  isRunning?: boolean;
}

export interface BackupExecutionOptions {
  scriptName: "BackupSave.py" | "extreme_switch_backup.py" | "port_description_report.py";
  targetIp: string; // "ALL", "EXOS_ONLY", "VOSS_ONLY", or specific switch IP
  targetHostname?: string;
  saveBeforeExport: boolean;
  tftpServerIp: string;
  virtualRouter: "VR-Default" | "VR-Mgmt";
  captureLldp: boolean;
  enableJumpBoxHop: boolean;
}

export function BackupOptionsModal({
  isOpen,
  onClose,
  targetSwitch,
  allSwitches,
  onExecuteBackup,
  isRunning = false
}: BackupOptionsModalProps) {
  const [selectedScript, setSelectedScript] = useState<"BackupSave.py" | "extreme_switch_backup.py" | "port_description_report.py">("BackupSave.py");
  const [targetScope, setTargetScope] = useState<string>(targetSwitch ? targetSwitch.ip : "ALL");
  const [saveBeforeExport, setSaveBeforeExport] = useState<boolean>(true);
  const [tftpServerIp, setTftpServerIp] = useState<string>("10.36.226.7");
  const [virtualRouter, setVirtualRouter] = useState<"VR-Default" | "VR-Mgmt">("VR-Default");
  const [captureLldp, setCaptureLldp] = useState<boolean>(true);
  const [enableJumpBoxHop, setEnableJumpBoxHop] = useState<boolean>(true);

  if (!isOpen) return null;

  const isAll = targetScope === "ALL";
  const isExosOnly = targetScope === "EXOS_ONLY";
  const isVossOnly = targetScope === "VOSS_ONLY";
  
  const currentTargetObj = allSwitches.find(s => s.ip === targetScope) || targetSwitch;

  const handleLaunch = () => {
    onExecuteBackup({
      scriptName: selectedScript,
      targetIp: targetScope,
      targetHostname: currentTargetObj?.hostname,
      saveBeforeExport,
      tftpServerIp,
      virtualRouter,
      captureLldp,
      enableJumpBoxHop
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Backup & Export Execution Options</span>
              </h3>
              <p className="text-xs text-slate-400">
                {targetSwitch 
                  ? `Configuring backup parameters for ${targetSwitch.hostname} (${targetSwitch.ip})` 
                  : "Configuring automated backup run for switch fleet"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-sans text-xs">
          
          {/* Target Scope Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              1. Target Switch Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetScope("ALL")}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  targetScope === "ALL"
                    ? "bg-indigo-950/60 border-indigo-500 text-white shadow"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-bold text-slate-200">All Switches ({allSwitches.length})</div>
                    <div className="text-[11px] text-slate-400">Run through Switches.txt</div>
                  </div>
                </div>
                {targetScope === "ALL" && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setTargetScope(targetSwitch ? targetSwitch.ip : allSwitches[0]?.ip || "10.36.226.11")}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  targetScope !== "ALL" && targetScope !== "EXOS_ONLY" && targetScope !== "VOSS_ONLY"
                    ? "bg-emerald-950/60 border-emerald-500 text-white shadow"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold text-slate-200">Single Target Switch</div>
                    <div className="text-[11px] text-slate-400">
                      {currentTargetObj ? `${currentTargetObj.hostname} (${currentTargetObj.ip})` : "Specific IP"}
                    </div>
                  </div>
                </div>
                {targetScope !== "ALL" && targetScope !== "EXOS_ONLY" && targetScope !== "VOSS_ONLY" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>
            </div>

            {/* Individual switch dropdown if single switch is chosen */}
            {targetScope !== "ALL" && targetScope !== "EXOS_ONLY" && targetScope !== "VOSS_ONLY" && (
              <div className="mt-2 pt-2">
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">Select Specific Switch from Inventory:</label>
                <select
                  value={targetScope}
                  onChange={(e) => setTargetScope(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500"
                >
                  {allSwitches.map((sw) => (
                    <option key={sw.id} value={sw.ip}>
                      {sw.hostname} — {sw.ip} ({sw.os} {sw.model})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Backup Method / Script Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              2. Backup Routine & Script
            </label>
            <div className="space-y-2">
              <label
                onClick={() => setSelectedScript("BackupSave.py")}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedScript === "BackupSave.py"
                    ? "bg-emerald-950/40 border-emerald-500 text-slate-100"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="scriptSelection"
                  checked={selectedScript === "BackupSave.py"}
                  onChange={() => setSelectedScript("BackupSave.py")}
                  className="mt-1 accent-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold font-mono text-slate-200">
                    <span>BackupSave.py</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Executes mandatory <code className="text-emerald-300 font-mono">save configuration primary</code> prior to TFTP/SSH export to guarantee zero uncommitted delta loss.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setSelectedScript("extreme_switch_backup.py")}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedScript === "extreme_switch_backup.py"
                    ? "bg-indigo-950/40 border-indigo-500 text-slate-100"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="scriptSelection"
                  checked={selectedScript === "extreme_switch_backup.py"}
                  onChange={() => setSelectedScript("extreme_switch_backup.py")}
                  className="mt-1 accent-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold font-mono text-slate-200">
                    <span>extreme_switch_backup.py</span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded">
                      Multi-Hop Jump-Box
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Full backup engine with automatic jump-box fallback routing when management VLAN direct routes are unreachable.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setSelectedScript("port_description_report.py")}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedScript === "port_description_report.py"
                    ? "bg-purple-950/40 border-purple-500 text-slate-100"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="scriptSelection"
                  checked={selectedScript === "port_description_report.py"}
                  onChange={() => setSelectedScript("port_description_report.py")}
                  className="mt-1 accent-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold font-mono text-slate-200">
                    <span>port_description_report.py</span>
                    <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded">
                      Port Audit & Excel
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Read-only port description audit, PoE draw report, and LLDP neighbor mapping exported to Excel (.xlsx).
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Advanced Switch Options Grid */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Settings2 className="w-4 h-4 text-indigo-400" />
              <span>Advanced Backup Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-mono mb-1">TFTP Server Destination IP</label>
                <input
                  type="text"
                  value={tftpServerIp}
                  onChange={(e) => setTftpServerIp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-mono mb-1">EXOS Virtual Router (VR)</label>
                <select
                  value={virtualRouter}
                  onChange={(e) => setVirtualRouter(e.target.value as "VR-Default" | "VR-Mgmt")}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                >
                  <option value="VR-Default">VR-Default (In-band management)</option>
                  <option value="VR-Mgmt">VR-Mgmt (Dedicated Out-of-band)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={saveBeforeExport}
                  onChange={(e) => setSaveBeforeExport(e.target.checked)}
                  className="accent-emerald-500 rounded"
                />
                <span>Mandatory <code className="text-emerald-400 font-mono">save config</code> before export</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={captureLldp}
                  onChange={(e) => setCaptureLldp(e.target.checked)}
                  className="accent-indigo-500 rounded"
                />
                <span>Capture LLDP neighbor topology table</span>
              </label>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            id="modal-btn-execute-backup"
            onClick={handleLaunch}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold shadow transition-all ${
              isRunning
                ? "bg-amber-600 text-white cursor-not-allowed opacity-80"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
            }`}
          >
            {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>
              {isRunning
                ? "Job Running in Background..."
                : targetScope === "ALL"
                ? "Execute Backup (All Switches)"
                : `Execute Backup (${currentTargetObj?.hostname || targetScope})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
