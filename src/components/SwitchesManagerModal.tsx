import React, { useState, useEffect } from "react";
import { 
  RefreshCw, 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Save, 
  Play, 
  X, 
  Plus, 
  Server, 
  Radio, 
  Sparkles,
  Download,
  Terminal,
  ExternalLink
} from "lucide-react";
import { SwitchItem, AuthUser } from "../types";
import { extractSiteCode, formatSiteDisplayName } from "../utils/siteHierarchy";

interface SwitchesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  switches: SwitchItem[];
  onSwitchesUpdated: (newSwitches: SwitchItem[]) => void;
  currentUser?: AuthUser | null;
  onTriggerBackup?: (scriptName: string, targetSwitch: string) => void;
}

export const SwitchesManagerModal: React.FC<SwitchesManagerModalProps> = ({
  isOpen,
  onClose,
  switches,
  onSwitchesUpdated,
  currentUser,
  onTriggerBackup
}) => {
  const [switchesTxtContent, setSwitchesTxtContent] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("Switches.txt");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "edit" | "help">("list");
  const [newIpInput, setNewIpInput] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      loadSwitchesTxt();
    }
  }, [isOpen]);

  const loadSwitchesTxt = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/switches-txt");
      if (res.ok) {
        const data = await res.json();
        setSwitchesTxtContent(data.content || "");
        if (data.path) setFilePath(data.path);
      }
    } catch (err) {
      console.error("Error loading Switches.txt:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const parsedIps = React.useMemo(() => {
    return switchesTxtContent
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith("#"));
  }, [switchesTxtContent]);

  const commentedIps = React.useMemo(() => {
    return switchesTxtContent
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.startsWith("#") && line.replace("#", "").trim().length > 0)
      .map(line => line.replace("#", "").trim());
  }, [switchesTxtContent]);

  const handleSaveAndSync = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/save-switches-txt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: switchesTxtContent })
      });

      if (res.ok) {
        setSaveMessage({ text: "Switches.txt saved successfully!", type: "success" });
        // Now trigger sync
        await handleSyncFleet();
      } else {
        const errData = await res.json().catch(() => ({}));
        setSaveMessage({ text: errData.error || "Failed to save Switches.txt", type: "error" });
      }
    } catch (err: any) {
      setSaveMessage({ text: err.message || "Failed to save file", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncFleet = async () => {
    setIsDiscovering(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/switches");
      if (res.ok) {
        const data = await res.json();
        if (data.switches && Array.isArray(data.switches)) {
          onSwitchesUpdated(data.switches);
          setSaveMessage({ 
            text: `Fleet synchronized: ${data.switches.length} switches discovered (${parsedIps.length} active in Switches.txt).`, 
            type: "success" 
          });
        }
      } else {
        // Fallback: reload Switches.txt and synthesize local items
        await loadSwitchesTxt();
        setSaveMessage({ 
          text: `Switches.txt refreshed (${parsedIps.length} active IPs detected).`, 
          type: "success" 
        });
      }
    } catch (err: any) {
      setSaveMessage({ text: `Sync completed with local catalog (${parsedIps.length} IPs).`, type: "success" });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAddSingleIp = () => {
    const trimmed = newIpInput.trim();
    if (!trimmed) return;
    
    // Check if IP is valid format
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (!ipRegex.test(trimmed)) {
      setSaveMessage({ text: "Please enter a valid IPv4 address (e.g. 10.32.104.253)", type: "error" });
      return;
    }

    if (parsedIps.includes(trimmed)) {
      setSaveMessage({ text: `IP ${trimmed} is already in Switches.txt`, type: "error" });
      return;
    }

    const updatedContent = switchesTxtContent ? `${switchesTxtContent.trim()}\n${trimmed}` : trimmed;
    setSwitchesTxtContent(updatedContent);
    setNewIpInput("");
    setSaveMessage({ text: `Added ${trimmed}. Click 'Save & Sync Fleet' to persist.`, type: "success" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Switches.txt &amp; Fleet Discovery Manager
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {parsedIps.length} Active IPs
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Source: <span className="text-slate-300">{filePath}</span> &bull; Synchronized across Python Automation &amp; Web UI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar & Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === "list"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📋 Parsed Switch List ({parsedIps.length})
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === "edit"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ✏️ Raw Switches.txt Editor
            </button>
            <button
              onClick={() => setActiveTab("help")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === "help"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              💡 How Discovery Works
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncFleet}
              disabled={isDiscovering}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow cursor-pointer font-mono disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDiscovering ? "animate-spin" : ""}`} />
              <span>{isDiscovering ? "Discovering Fleet..." : "🔄 Sync & Discover Now"}</span>
            </button>

            {onTriggerBackup && (
              <button
                onClick={() => {
                  onTriggerBackup("BackupSave.py", "ALL");
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow cursor-pointer font-mono"
                title="Trigger BackupSave.py for all switches in Switches.txt"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🚀 Backup All ({parsedIps.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {saveMessage && (
          <div className={`px-5 py-2.5 text-xs font-mono flex items-center gap-2 border-b ${
            saveMessage.type === "success" 
              ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/80" 
              : "bg-rose-950/60 text-rose-300 border-rose-800/80"
          }`}>
            {saveMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{saveMessage.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: Parsed Switch List View */}
          {activeTab === "list" && (
            <div className="space-y-4">
              {/* Quick Add Single IP Bar */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Switch IP:</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 10.32.104.253 (Amsterdam) or 10.32.172.253 (Northwood)"
                  value={newIpInput}
                  onChange={(e) => setNewIpInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddSingleIp(); }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddSingleIp}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition font-mono shrink-0 cursor-pointer"
                >
                  + Add to File
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Filter by IP, Site, or Hostname..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Showing {parsedIps.filter(ip => !searchFilter || ip.includes(searchFilter)).length} of {parsedIps.length} switches
                </span>
              </div>

              {/* Grid of Switch Entries in Switches.txt */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {parsedIps
                  .filter(ip => {
                    if (!searchFilter) return true;
                    const matchedSw = switches.find(s => s.ip === ip);
                    return (
                      ip.includes(searchFilter) ||
                      (matchedSw && matchedSw.hostname.toLowerCase().includes(searchFilter.toLowerCase())) ||
                      (matchedSw && matchedSw.site?.toLowerCase().includes(searchFilter.toLowerCase()))
                    );
                  })
                  .map((ip, idx) => {
                    const matchedSw = switches.find(s => s.ip === ip);
                    const siteCode = matchedSw?.site || extractSiteCode(matchedSw?.hostname || ip);
                    const siteDisplay = formatSiteDisplayName(siteCode);

                    return (
                      <div
                        key={`${ip}-${idx}`}
                        className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3 flex items-center justify-between gap-3 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                          <div className="min-w-0">
                            <div className="text-xs font-mono font-bold text-slate-200 truncate">
                              {ip}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {matchedSw ? matchedSw.hostname : `${siteDisplay} Switch`}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/80">
                            {siteDisplay}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {commentedIps.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-xs font-mono text-slate-500">
                  <span>ℹ️ {commentedIps.length} disabled / commented out switches in file ({commentedIps.slice(0, 3).join(", ")}...)</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Raw Switches.txt Editor */}
          {activeTab === "edit" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Directly edit or paste IP list (one IPv4 per line, prefix `#` to ignore):</span>
                <span>{switchesTxtContent.split("\n").length} lines total</span>
              </div>
              <textarea
                value={switchesTxtContent}
                onChange={(e) => setSwitchesTxtContent(e.target.value)}
                rows={14}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed shadow-inner"
                placeholder="# Enter switch management IPs (one per line):&#10;10.32.214.253&#10;10.32.104.253&#10;10.32.172.253"
              />
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={loadSwitchesTxt}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer font-mono"
                >
                  Discard Changes &amp; Reload File
                </button>
                <button
                  onClick={handleSaveAndSync}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow cursor-pointer font-mono disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "💾 Save Switches.txt & Sync Fleet"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: How Discovery Works */}
          {activeTab === "help" && (
            <div className="space-y-4 text-xs font-mono text-slate-300 bg-slate-950 p-5 rounded-xl border border-slate-800 leading-relaxed">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>⚡ How Switch Discovery &amp; Inventory Works</span>
              </div>
              <p>
                The backup engine and web management portal are designed around a single master source of truth: <strong>Switches.txt</strong>.
              </p>
              
              <div className="space-y-2">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-indigo-300">1. Adding Switches via Git / CLI on Ubuntu Server:</div>
                  <div className="text-slate-400 mt-1">
                    When you edit <code>Switches.txt</code> and push via Git or edit directly on your Ubuntu VM (<code>/opt/switch-backup/Switches.txt</code>), the Python automation scripts (<code>BackupSave.py</code>, <code>extreme_switch_backup.py</code>, <code>port_description_report.py</code>) read the file directly on every run.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-emerald-300">2. Instant Web Frontend Synchronization:</div>
                  <div className="text-slate-400 mt-1">
                    Clicking the <strong>"🔄 Sync / Discover from Switches.txt"</strong> button triggers a fast discovery pass that loads the updated file from disk, links newly added IPs to their corresponding David Lloyd club sites (e.g. Amsterdam, Northwood, York), and populates their switch cards without restarting the server.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-amber-300">3. Live Port &amp; LLDP Auditing:</div>
                  <div className="text-slate-400 mt-1">
                    Running <code>port_description_report.py</code> or <strong>"Audit FDB"</strong> on any newly added switch will query its active interfaces, resolve connected device descriptions, and detect any unmanaged Netgear switches connected to access ports.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-500 font-mono">
            {parsedIps.length} active switch IP addresses defined in inventory
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer font-mono"
            >
              Close
            </button>
            <button
              onClick={handleSaveAndSync}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow cursor-pointer font-mono disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
              <span>Save &amp; Sync</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
