import React, { useState } from "react";
import { Terminal, Copy, Check, AlertTriangle, ShieldCheck, Cpu, HardDrive, Usb, ArrowRight, BookOpen } from "lucide-react";

export function ReplacementCheatSheet() {
  const [activeOs, setActiveOs] = useState<"EXOS" | "VOSS">("EXOS");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="replacement-cheatsheet-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Field Engineer Reference Guide</span>
            </div>
            <h2 className="text-xl font-bold text-white">Switch Replacement & Configuration Restoration SOP</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Standard Operating Procedure for field workers replacing damaged or RMA network switches. Select the switch operating system below to access console pinouts, factory wipe, and configuration load commands.
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
            <button
              id="tab-btn-exos-guide"
              onClick={() => setActiveOs("EXOS")}
              className={`px-4 py-2 rounded-md font-medium text-xs transition-colors flex items-center gap-2 ${
                activeOs === "EXOS"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ExtremeXOS (EXOS)</span>
            </button>
            <button
              id="tab-btn-voss-guide"
              onClick={() => setActiveOs("VOSS")}
              className={`px-4 py-2 rounded-md font-medium text-xs transition-colors flex items-center gap-2 ${
                activeOs === "VOSS"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Virtual OS (VOSS / VSP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* OS-Specific Cheat Sheet */}
      {activeOs === "EXOS" ? (
        <div className="space-y-6">
          {/* Quick Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-mono mb-1">Console Port Settings</div>
              <div className="text-base font-semibold text-slate-100 font-mono">9600 baud, 8-N-1</div>
              <div className="text-xs text-slate-500 mt-1">No Flow Control, RJ-45 or Micro-USB</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-mono mb-1">Default Factory Credentials</div>
              <div className="text-base font-semibold text-emerald-400 font-mono">admin / &lt;empty&gt;</div>
              <div className="text-xs text-slate-500 mt-1">No password on clean factory reset</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-mono mb-1">Native Config Format</div>
              <div className="text-base font-semibold text-indigo-400 font-mono">.xsf (CLI) or .cfg (XML)</div>
              <div className="text-xs text-slate-500 mt-1">Prefer .xsf for automated replacements</div>
            </div>
          </div>

          {/* Step-by-Step Procedure */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
                Step 1: Clean Factory Wipe & Management IP Setup
              </h3>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">Console CLI</span>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-400">
                Connect your console cable to the new unboxed replacement switch. If the switch has previous testing data, unconfigure it to a known clean state:
              </p>

              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
                <button
                  onClick={() => copyToClipboard(`unconfigure switch all\nreboot\n\n# After reboot login as admin (no password)\nconfigure vlan Default ipaddress 10.36.226.99 255.255.255.0\nconfigure iproute add default 10.36.226.1`, "exos-step-1")}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
                >
                  {copiedId === "exos-step-1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <div className="text-slate-500"># 1. Reset switch to factory default</div>
                <div className="text-slate-200">unconfigure switch all</div>
                <div className="text-slate-200">reboot</div>
                <div className="text-slate-500 mt-2"># 2. Assign temporary IP to reach TFTP server</div>
                <div className="text-slate-200">configure vlan Default ipaddress 10.36.226.99 255.255.255.0</div>
                <div className="text-slate-200">configure iproute add default 10.36.226.1</div>
                <div className="text-slate-200">ping 10.36.226.7</div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                Step 2: Download & Apply .xsf Configuration File via TFTP
              </h3>
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">TFTP Restore</span>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-400">
                Pull the saved switch script directly from the backup server. You can use <code className="text-indigo-300">load configuration &lt;filename&gt;</code> to execute the ASCII command script without overwriting binary database headers.
              </p>

              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
                <button
                  onClick={() => copyToClipboard(`tftp get 10.36.226.7 vr "VR-Default" SW-EDGE-EXOS-02.xsf\nload configuration SW-EDGE-EXOS-02.xsf\nsave configuration\nuse configuration primary`, "exos-step-2")}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
                >
                  {copiedId === "exos-step-2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <div className="text-slate-500"># Pull .xsf script from internal TFTP server (e.g. 10.36.226.7)</div>
                <div className="text-slate-200">tftp get 10.36.226.7 vr "VR-Default" SW-EDGE-EXOS-02.xsf</div>
                <div className="text-slate-500 mt-2"># Execute configuration commands</div>
                <div className="text-slate-200">load configuration SW-EDGE-EXOS-02.xsf</div>
                <div className="text-slate-500 mt-2"># Commit and save to primary NVRAM</div>
                <div className="text-slate-200">save configuration</div>
                <div className="text-slate-200">use configuration primary</div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">3</span>
                Step 3: Verification & Port Uplink Checks
              </h3>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">Verification</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
                <button
                  onClick={() => copyToClipboard(`show vlan\nshow ports description\nshow iproute\nshow stacking`, "exos-step-3")}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
                >
                  {copiedId === "exos-step-3" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <div className="text-slate-200">show vlan</div>
                <div className="text-slate-200">show ports description</div>
                <div className="text-slate-200">show iproute</div>
                <div className="text-slate-200">show inline-power</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Specs VOSS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-mono mb-1">Console Port Settings</div>
              <div className="text-base font-semibold text-slate-100 font-mono">9600 baud, 8-N-1</div>
              <div className="text-xs text-slate-500 mt-1">DB9 or RJ-45 Rollover / Micro-USB</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-mono mb-1">Default Factory Credentials</div>
              <div className="text-base font-semibold text-purple-400 font-mono">rwa / rwa or admin / admin</div>
              <div className="text-xs text-slate-500 mt-1">Read-Write-Admin (rwa) mode</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-mono mb-1">Native Config Format</div>
              <div className="text-base font-semibold text-purple-400 font-mono">config.cfg (ASCII CLI format)</div>
              <div className="text-xs text-slate-500 mt-1">Loaded on boot via boot flags</div>
            </div>
          </div>

          {/* VOSS Procedure */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">1</span>
                Step 1: Enter Privileged Mode & Factory Zeroize
              </h3>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">VOSS CLI</span>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-400">
                Log into the VOSS / VSP switch console, enter EXEC mode with <code className="text-purple-300">enable</code>, and restore factory defaults if reusing hardware:
              </p>

              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
                <button
                  onClick={() => copyToClipboard(`enable\nconfig t\nboot config flags factory-default\nreset -y`, "voss-step-1")}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
                >
                  {copiedId === "voss-step-1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <div className="text-slate-200">enable</div>
                <div className="text-slate-200">config t</div>
                <div className="text-slate-500 mt-2"># Optional factory reset</div>
                <div className="text-slate-200">boot config flags factory-default</div>
                <div className="text-slate-200">reset -y</div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">2</span>
                Step 2: Transfer Saved .cfg & Apply to Boot Flags
              </h3>
              <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-mono">TFTP / USB Copy</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
                <button
                  onClick={() => copyToClipboard(`enable\nconfig t\ninterface Vlan 1\n  ip address 10.36.226.99 255.255.255.0\n  ip default-gateway 10.36.226.1\nexit\n\n# Pull config from internal backup server\ncopy tftp 10.36.226.7 SW-FABRIC-VOSS-01.cfg config.cfg\nboot config flags config-file config.cfg\nreset -y`, "voss-step-2")}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
                >
                  {copiedId === "voss-step-2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <div className="text-slate-500"># Set temporary IP on management vlan</div>
                <div className="text-slate-200">enable</div>
                <div className="text-slate-200">config t</div>
                <div className="text-slate-200">interface Vlan 1</div>
                <div className="text-slate-200">  ip address 10.36.226.99 255.255.255.0</div>
                <div className="text-slate-200">  ip default-gateway 10.36.226.1</div>
                <div className="text-slate-200">exit</div>
                <div className="text-slate-500 mt-2"># Copy backup to local NVRAM config.cfg and reboot</div>
                <div className="text-slate-200">copy tftp 10.36.226.7 SW-FABRIC-VOSS-01.cfg config.cfg</div>
                <div className="text-slate-200">boot config flags config-file config.cfg</div>
                <div className="text-slate-200">reset -y</div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">3</span>
                Step 3: Verify SPBM Fabric & Interfaces
              </h3>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">Fabric Checks</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
                <button
                  onClick={() => copyToClipboard(`show isis spbm\nshow isis adjacency\nshow interfaces gigabitEthernet\nshow ip route`, "voss-step-3")}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
                >
                  {copiedId === "voss-step-3" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <div className="text-slate-200">show isis spbm</div>
                <div className="text-slate-200">show isis adjacency</div>
                <div className="text-slate-200">show vlan i-sid</div>
                <div className="text-slate-200">show interfaces gigabitEthernet</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safety Warnings & Best Practices */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-5 flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-300 text-sm">Critical Field Technician Safety Notice</div>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            Always verify that the replacement switch firmware matches the backup header (e.g. EXOS 31.x vs 30.x or VOSS 8.x) before applying the config. Applying modern configuration tags to older firmware can cause truncated VLAN maps or dropped trunk ports.
          </p>
        </div>
      </div>
    </div>
  );
}
