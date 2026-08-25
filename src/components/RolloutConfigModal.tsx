import React, { useState, useEffect, useMemo, useRef } from "react";
import { SwitchItem, SwitchOS, RolloutExecutionResponse, SwitchRolloutResult, UserRole, AuthUser } from "../types";
import { 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Check, 
  Copy, 
  Download, 
  Play, 
  RefreshCw, 
  Server, 
  Cpu, 
  HardDrive, 
  Layers, 
  Zap, 
  Sparkles, 
  KeyRound,
  Filter,
  Search,
  CheckSquare,
  Square,
  FileText,
  ShieldX
} from "lucide-react";

interface RolloutConfigModalProps {
  isOpen: boolean;
  switches: SwitchItem[];
  currentUserRole?: UserRole;
  currentUser?: AuthUser | null;
  onClose: () => void;
}

const COMMON_TEMPLATES = [
  {
    name: "Add Voice VLAN (EXOS & VOSS)",
    commands: `# Create and configure Voice VLAN\ncreate vlan Voice tag 100\nconfigure vlan Voice ipaddress 10.100.1.1/24\nconfigure vlan Voice add ports 1-24 untagged\nsave configuration`
  },
  {
    name: "Configure NTP Time Servers",
    commands: `# Set corporate NTP servers\nconfigure sntp server add 10.0.0.10\nconfigure sntp server add 10.0.0.11\nenable sntp\nsave configuration`
  },
  {
    name: "Corporate Syslog Server",
    commands: `# Configure primary syslog target\nconfigure syslog add 10.0.0.50:514 vr VR-Default local0\nenable syslog\nsave configuration`
  },
  {
    name: "Update Banner / MOTD Notice",
    commands: `# Set standard enterprise banner\nconfigure banner before-login "AUTHORIZED ACCESS ONLY - ALL ACTIVITY MONITORED"\nsave configuration`
  },
  {
    name: "Save Running Configuration",
    commands: `# Save active running configuration to non-volatile memory\nsave configuration`
  },
  {
    name: "DNS Server Configuration",
    commands: `# Configure DNS name resolution servers\nconfigure dns-client add nameserver 10.0.0.2\nconfigure dns-client add nameserver 10.0.0.3\nsave configuration`
  }
];

export function RolloutConfigModal({ isOpen, switches, currentUserRole, currentUser, onClose }: RolloutConfigModalProps) {
  // Password Authentication State
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authAttempts, setAuthAttempts] = useState<number>(0);

  // Rollout Configuration State
  const [commandsText, setCommandsText] = useState<string>("");
  const [selectedSwitchIds, setSelectedSwitchIds] = useState<string[]>([]);
  const [osFilter, setOsFilter] = useState<"ALL" | SwitchOS>("ALL");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [autoSaveConfig, setAutoSaveConfig] = useState<boolean>(true);
  const [stopOnError, setStopOnError] = useState<boolean>(false);

  // Execution State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResponse, setExecutionResponse] = useState<RolloutExecutionResponse | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [copiedLog, setCopiedLog] = useState<boolean>(false);
  const [activeLogTab, setActiveLogTab] = useState<string>("summary");

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Reset or initialize when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPasswordInput("");
      setAuthError(null);
      setIsUnlocked(false);
      setExecutionResponse(null);
      setExecutionError(null);
      // Select all switches by default once unlocked
      setSelectedSwitchIds(switches.map(s => s.id));
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    } else {
      setIsUnlocked(false);
      setPasswordInput("");
      setAuthError(null);
      setExecutionResponse(null);
    }
  }, [isOpen, switches]);

  // Handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "password") {
      setIsUnlocked(true);
      setAuthError(null);
    } else {
      setAuthError("Incorrect password. Access denied. Returning to main page...");
      setAuthAttempts(prev => prev + 1);
      // Return to main page immediately on wrong password as requested
      setTimeout(() => {
        onClose();
      }, 900);
    }
  };

  // Filtered switches in the selection list
  const filteredSwitches = useMemo(() => {
    return switches.filter(sw => {
      const matchesOs = osFilter === "ALL" || sw.os === osFilter;
      const q = searchFilter.toLowerCase().trim();
      const matchesSearch = !q || 
        sw.hostname.toLowerCase().includes(q) || 
        sw.ip.toLowerCase().includes(q) || 
        sw.model.toLowerCase().includes(q);
      return matchesOs && matchesSearch;
    });
  }, [switches, osFilter, searchFilter]);

  // Handle Select All / Apply to All
  const handleSelectAll = () => {
    setSelectedSwitchIds(switches.map(s => s.id));
  };

  // Handle Deselect All
  const handleDeselectAll = () => {
    setSelectedSwitchIds([]);
  };

  // Handle Individual Checkbox Toggle
  const handleToggleSwitch = (switchId: string) => {
    setSelectedSwitchIds(prev => 
      prev.includes(switchId) 
        ? prev.filter(id => id !== switchId) 
        : [...prev, switchId]
    );
  };

  // Insert Command Template
  const handleInsertTemplate = (tplCommands: string) => {
    setCommandsText(tplCommands);
  };

  // Execute Rollout
  const handleExecuteRollout = async () => {
    if (selectedSwitchIds.length === 0) {
      alert("Please select at least one target switch.");
      return;
    }
    const cleanCmds = commandsText.trim();
    if (!cleanCmds) {
      alert("Please enter one or more CLI commands to roll out.");
      return;
    }

    const targetSwitches = switches
      .filter(s => selectedSwitchIds.includes(s.id))
      .map(s => ({
        switchId: s.id,
        hostname: s.hostname,
        ip: s.ip,
        os: s.os
      }));

    setIsExecuting(true);
    setExecutionError(null);
    setExecutionResponse(null);

    try {
      const response = await fetch("/api/rollout-config-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commands: cleanCmds,
          targetSwitches,
          autoSave: autoSaveConfig,
          stopOnError,
          username: currentUser?.username || "netadmin",
          fullName: currentUser?.fullName || "IT Network Team",
          role: currentUser?.role || currentUserRole || "network_admin"
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: RolloutExecutionResponse = await response.json();
      setExecutionResponse(data);
      if (data.results && data.results.length > 0) {
        setActiveLogTab("summary");
      }
    } catch (err: any) {
      setExecutionError(err.message || "Failed to execute configuration rollout.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyLogs = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!executionResponse) return;
    const content = executionResponse.rawCliSummary || "No log content";
    const filename = `rollout-report-${new Date().toISOString().slice(0, 10)}.txt`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // Block Service Desk users specifically from multi-switch rollouts
  if (currentUserRole === "service_desk") {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <ShieldX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Access Restricted</h3>
                <p className="text-xs text-rose-400 font-mono">Service Desk Policy Enforcement</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Your account is assigned to the <strong>Service Desk</strong> role. Mass multi-switch configuration rollouts are restricted to the <strong>IT / Network Engineering Team</strong> for network safety.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="text-slate-400">Allowed Service Desk Capabilities:</div>
              <div className="text-emerald-400">✓ Single Switch Backups & Fleet Backups</div>
              <div className="text-emerald-400">✓ Individual Port Bouncing (with audit logging)</div>
              <div className="text-emerald-400">✓ Config Search, Customizer & Field Guides</div>
              <div className="text-emerald-400">✓ Live Telemetry & Visio Site Diagrams</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* 1. PASSWORD AUTHENTICATION STEP */}
      {!isUnlocked ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Helpdesk Security Verification</h3>
                <p className="text-xs text-slate-400 font-mono">Authorization Required</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              You are accessing the <strong>Rollout Configuration Change</strong> engine. This tool executes live CLI commands across multiple production Extreme switches simultaneously.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter Administrator Password:</span>
                </label>
                <input
                  ref={passwordInputRef}
                  type="password"
                  id="input-rollout-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-rollout-auth"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Verify &amp; Unlock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (

        /* 2. UNLOCKED ROLLOUT WORKSPACE */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Rollout Configuration Change to Multiple Switches</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    UNLOCKED
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Batch CLI Automation &bull; Telnet / SSH Execution &bull; ExtremeXOS &amp; VOSS Supported
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              title="Close and return to dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* View A: Rollout Composer Form (When not executing or displaying final results) */}
            {!executionResponse && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Command Entry & Templates (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      <span>1. CLI Commands to Roll Out</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {commandsText.split("\n").filter(l => l.trim() && !l.trim().startsWith("#")).length} commands entered
                    </span>
                  </div>

                  {/* Multi-line Command Input */}
                  <div className="relative">
                    <textarea
                      id="input-rollout-commands"
                      rows={10}
                      value={commandsText}
                      onChange={(e) => setCommandsText(e.target.value)}
                      placeholder={`# Enter CLI commands line-by-line. Example:\ndisable clipaging\ncreate vlan Voice tag 100\nconfigure vlan Voice ipaddress 10.100.1.1/24\nsave configuration`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-emerald-400 font-mono leading-relaxed placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Quick Templates Picker */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-slate-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Quick Command Templates:</span>
                      </span>
                      <span>Click to load</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {COMMON_TEMPLATES.map((tpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleInsertTemplate(tpl.commands)}
                          className="text-left px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition flex items-center justify-between group"
                        >
                          <span className="truncate">{tpl.name}</span>
                          <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">Insert →</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Safety Switches */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSaveConfig}
                        onChange={(e) => setAutoSaveConfig(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span>Automatically execute <code className="text-emerald-400 font-bold">save configuration</code> after commands</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stopOnError}
                        onChange={(e) => setStopOnError(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span>Abort fleet rollout if any switch reports a syntax error</span>
                    </label>
                  </div>
                </div>

                {/* Right Column: Target Switch Selector (5 cols) */}
                <div className="lg:col-span-5 space-y-4 flex flex-col">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-indigo-400" />
                      <span>2. Target Devices ({selectedSwitchIds.length}/{switches.length})</span>
                    </label>
                  </div>

                  {/* Selection Toolbar: Apply to All / Deselect / Search */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id="btn-rollout-select-all"
                        onClick={handleSelectAll}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white font-mono transition shadow-sm"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Apply to All ({switches.length})</span>
                      </button>

                      <button
                        type="button"
                        id="btn-rollout-deselect-all"
                        onClick={handleDeselectAll}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition"
                      >
                        Deselect All
                      </button>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          placeholder="Filter switches..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      
                      {/* OS filter toggle */}
                      <select
                        value={osFilter}
                        onChange={(e) => setOsFilter(e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
                      >
                        <option value="ALL">All OS</option>
                        <option value="EXOS">EXOS</option>
                        <option value="VOSS">VOSS</option>
                      </select>
                    </div>
                  </div>

                  {/* Switch Checklist Box */}
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto max-h-[300px] space-y-2">
                    {filteredSwitches.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500 font-mono">
                        No switches match the filter.
                      </div>
                    ) : (
                      filteredSwitches.map((sw) => {
                        const isChecked = selectedSwitchIds.includes(sw.id);
                        return (
                          <div
                            key={sw.id}
                            onClick={() => handleToggleSwitch(sw.id)}
                            className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                              isChecked
                                ? "bg-slate-900 border-indigo-500/70 text-white shadow-sm"
                                : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // Handled by container click
                                className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0 pointer-events-none"
                              />
                              <div className="font-mono text-xs">
                                <div className="font-bold text-slate-200">{sw.hostname}</div>
                                <div className="text-[11px] text-slate-400">{sw.ip} &bull; {sw.model}</div>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              sw.os === "EXOS" 
                                ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60" 
                                : "bg-purple-950/80 text-purple-300 border border-purple-800/60"
                            }`}>
                              {sw.os}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* View B: Active Execution Loader */}
            {isExecuting && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 bg-slate-950 rounded-2xl border border-slate-800 p-8">
                <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-white">Rolling Out Configuration Changes...</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Connecting to {selectedSwitchIds.length} switches sequentially &bull; Telnet / SSH Port 23/22
                  </p>
                </div>
              </div>
            )}

            {/* View C: Execution Results Dashboard */}
            {executionResponse && (
              <div className="space-y-6">
                
                {/* Summary Banner */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Rollout Execution Completed</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Targeted: {executionResponse.totalSwitches} switches &bull; Success: <span className="text-emerald-400 font-bold">{executionResponse.successCount}</span> &bull; Failed: <span className="text-rose-400 font-bold">{executionResponse.failedCount}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLogs(executionResponse.rawCliSummary)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
                    >
                      {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLog ? "Copied" : "Copy Full Log"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Audit Report</span>
                    </button>
                  </div>
                </div>

                {/* Switch Breakdown Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Individual Switch Rollout Telemetry
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {executionResponse.results.map((res, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-xl border font-mono text-xs space-y-2.5 ${
                          res.status === "success" 
                            ? "bg-slate-950 border-emerald-900/60" 
                            : "bg-slate-950 border-rose-900/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{res.hostname}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({res.ip})</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            res.status === "success" 
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80" 
                              : "bg-rose-950 text-rose-300 border border-rose-800/80"
                          }`}>
                            {res.status.toUpperCase()} ({res.executionTimeMs}ms)
                          </span>
                        </div>

                        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                          <div className="text-slate-400 text-[10px]">Commands Executed:</div>
                          <div className="text-emerald-400 font-semibold">{res.commandsExecuted.join(" &bull; ")}</div>
                        </div>

                        <details className="text-[11px] text-slate-400 cursor-pointer">
                          <summary className="hover:text-slate-200">View CLI Output Transcript</summary>
                          <pre className="mt-2 p-2.5 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                            {res.output}
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {executionError && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{executionError}</span>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              {executionResponse ? "Close" : "Cancel & Return"}
            </button>

            {!executionResponse ? (
              <button
                type="button"
                id="btn-execute-fleet-rollout"
                onClick={handleExecuteRollout}
                disabled={isExecuting || selectedSwitchIds.length === 0 || !commandsText.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all ${
                  isExecuting || selectedSwitchIds.length === 0 || !commandsText.trim()
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                }`}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Rollout...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute Rollout on {selectedSwitchIds.length} Switches</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setExecutionResponse(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow"
              >
                + Start Another Rollout
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
