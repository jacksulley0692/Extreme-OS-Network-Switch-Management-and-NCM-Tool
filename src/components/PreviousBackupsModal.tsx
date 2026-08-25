import React, { useState, useMemo } from "react";
import { SwitchItem, SwitchBackupRevision } from "../types";
import { 
  History, 
  Download, 
  Copy, 
  Check, 
  Search, 
  FileCode, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeftRight, 
  X, 
  Layers, 
  HardDrive, 
  Sparkles,
  Zap,
  Tag
} from "lucide-react";

interface PreviousBackupsModalProps {
  switchItem: SwitchItem;
  onClose: () => void;
  onSelectRevisionForWorkspace?: (revision: SwitchBackupRevision) => void;
}

export function PreviousBackupsModal({ switchItem, onClose, onSelectRevisionForWorkspace }: PreviousBackupsModalProps) {
  // Synthesize active config as revision 0 if not explicitly in list
  const allRevisions = useMemo(() => {
    const activeRev: SwitchBackupRevision = {
      id: "rev-current-active",
      timestamp: switchItem.lastBackupTime || "Current Active Snapshot",
      filename: `${switchItem.hostname}.${switchItem.configFormat}`,
      fileSizeKb: Math.round((switchItem.activeConfig.length / 1024) * 10) / 10 || 12.5,
      format: switchItem.configFormat,
      author: "BackupSave.py (Latest Run)",
      hash: "sha256:current_active_snapshot",
      changesSummary: "Current running/saved configuration snapshot",
      content: switchItem.activeConfig
    };

    const previous = switchItem.previousRevisions || [];
    return [activeRev, ...previous];
  }, [switchItem]);

  const [selectedRevId, setSelectedRevId] = useState<string>(allRevisions[0]?.id || "rev-current-active");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"content" | "diff">("content");

  const selectedRevision = useMemo(() => {
    return allRevisions.find(r => r.id === selectedRevId) || allRevisions[0];
  }, [allRevisions, selectedRevId]);

  const filteredRevisions = useMemo(() => {
    if (!searchQuery.trim()) return allRevisions;
    const q = searchQuery.toLowerCase().trim();
    return allRevisions.filter(r => 
      r.filename.toLowerCase().includes(q) ||
      r.timestamp.toLowerCase().includes(q) ||
      (r.changesSummary && r.changesSummary.toLowerCase().includes(q)) ||
      r.author.toLowerCase().includes(q)
    );
  }, [allRevisions, searchQuery]);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadRevision = (rev: SwitchBackupRevision) => {
    const blob = new Blob([rev.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = rev.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Extract key sections from selected revision
  const extractedSections = useMemo(() => {
    if (!selectedRevision) return { vlans: "", portDescs: "", management: "" };
    const lines = selectedRevision.content.split("\n");
    
    const vlanLines = lines.filter(l => 
      l.toLowerCase().includes("vlan") || 
      l.toLowerCase().includes("spbm") || 
      l.toLowerCase().includes("i-sid")
    );
    
    const portDescLines = lines.filter(l => 
      l.toLowerCase().includes("description") || 
      l.toLowerCase().includes("name \"")
    );

    const mgmtLines = lines.filter(l => 
      l.toLowerCase().includes("ipaddress") || 
      l.toLowerCase().includes("ip address") || 
      l.toLowerCase().includes("iproute") || 
      l.toLowerCase().includes("default-gateway") ||
      l.toLowerCase().includes("snmp") ||
      l.toLowerCase().includes("ssh")
    );

    return {
      vlans: vlanLines.join("\n"),
      portDescs: portDescLines.join("\n"),
      management: mgmtLines.join("\n")
    };
  }, [selectedRevision]);

  // Diff comparison against active config
  const diffLines = useMemo(() => {
    const activeLines = switchItem.activeConfig.split("\n");
    const revLines = (selectedRevision?.content || "").split("\n");
    
    // Simple line diff
    const maxLength = Math.max(activeLines.length, revLines.length);
    const result: { lineNum: number; active: string; revision: string; isDifferent: boolean }[] = [];

    for (let i = 0; i < maxLength; i++) {
      const a = activeLines[i] || "";
      const b = revLines[i] || "";
      result.push({
        lineNum: i + 1,
        active: a,
        revision: b,
        isDifferent: a !== b
      });
    }

    return result;
  }, [switchItem.activeConfig, selectedRevision]);

  const isCurrentActive = selectedRevision?.id === "rev-current-active";

  return (
    <div id="previous-backups-modal-overlay" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  switchItem.os === "EXOS" ? "bg-indigo-950 text-indigo-300 border border-indigo-800" : "bg-purple-950 text-purple-300 border border-purple-800"
                }`}>
                  {switchItem.os}
                </span>
                <h3 className="text-base font-bold text-white font-mono">{switchItem.hostname}</h3>
                <span className="text-xs text-emerald-400 font-mono font-semibold">({switchItem.ip})</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                <span>Backup History Archive</span>
                <span>•</span>
                <span>{allRevisions.length} Snapshot {allRevisions.length === 1 ? "Revision" : "Revisions"} Available</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadRevision(selectedRevision)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Download selected backup file"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download File</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-lg leading-none px-2.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body: 2-column layout (Revision List & File Viewer) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Column: Revision List */}
          <div className="md:col-span-4 border-r border-slate-800 bg-slate-950/50 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter backups by date or filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredRevisions.map((rev, idx) => {
                const isSelected = rev.id === selectedRevId;
                const isLatest = idx === 0;

                return (
                  <button
                    key={rev.id}
                    onClick={() => setSelectedRevId(rev.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-indigo-950/60 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40"
                        : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FileCode className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                        <span className="font-mono text-xs font-bold text-slate-100 truncate max-w-[170px]">
                          {rev.filename}
                        </span>
                      </div>
                      {isLatest ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          LATEST
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {rev.fileSizeKb} KB
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{rev.timestamp}</span>
                      </span>
                      <span className="text-slate-500 uppercase text-[10px]">.{rev.format}</span>
                    </div>

                    {rev.changesSummary && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                        {rev.changesSummary}
                      </p>
                    )}
                  </button>
                );
              })}

              {filteredRevisions.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  No backup archives matching your filter.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Selected Backup Details & Content View */}
          <div className="md:col-span-8 flex flex-col overflow-hidden bg-slate-900">
            
            {/* Action Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    {selectedRevision.filename}
                  </h4>
                  {isCurrentActive && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      CURRENT ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Saved: <span className="text-slate-200">{selectedRevision.timestamp}</span> | Author: {selectedRevision.author}
                </div>
              </div>

              {/* View Switcher: Full Content vs Diff */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setViewMode("content")}
                    className={`px-3 py-1 rounded transition-colors ${viewMode === "content" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    Configuration Text
                  </button>
                  <button
                    onClick={() => setViewMode("diff")}
                    className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${viewMode === "diff" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>Diff vs Current</span>
                  </button>
                </div>

                {/* Primary Copy Backup Button */}
                <button
                  id="btn-copy-selected-backup"
                  onClick={() => copyToClipboard(selectedRevision.content, "full-backup")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all"
                  title="Copy full configuration text to clipboard"
                >
                  {copiedSection === "full-backup" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === "full-backup" ? "Copied Full Backup!" : "Copy Backup"}</span>
                </button>
              </div>
            </div>

            {/* Quick Section Copier Pill Bar */}
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Quick Copy:</span>
              
              <button
                onClick={() => copyToClipboard(extractedSections.vlans, "rev-vlans")}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 font-mono text-[11px] flex items-center gap-1 transition-colors"
              >
                {copiedSection === "rev-vlans" ? <Check className="w-3 h-3 text-emerald-400" /> : <Tag className="w-3 h-3 text-indigo-400" />}
                <span>VLANs & Tags</span>
              </button>

              <button
                onClick={() => copyToClipboard(extractedSections.portDescs, "rev-ports")}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 font-mono text-[11px] flex items-center gap-1 transition-colors"
              >
                {copiedSection === "rev-ports" ? <Check className="w-3 h-3 text-emerald-400" /> : <Tag className="w-3 h-3 text-indigo-400" />}
                <span>Port Descriptions</span>
              </button>

              <button
                onClick={() => copyToClipboard(extractedSections.management, "rev-mgmt")}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 font-mono text-[11px] flex items-center gap-1 transition-colors"
              >
                {copiedSection === "rev-mgmt" ? <Check className="w-3 h-3 text-emerald-400" /> : <Tag className="w-3 h-3 text-indigo-400" />}
                <span>Management IP & Gateway</span>
              </button>
            </div>

            {/* Content Display Area */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-200">
              {viewMode === "content" ? (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-x-auto shadow-inner leading-relaxed">
                  <pre>{selectedRevision.content}</pre>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 font-sans">
                    Side-by-side line comparison between this revision ({selectedRevision.timestamp}) and the Current Active Configuration:
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                          <th className="py-2 px-3 w-12 text-right">#</th>
                          <th className="py-2 px-4 w-1/2 border-r border-slate-800">Current Active Config</th>
                          <th className="py-2 px-4 w-1/2">Selected Revision ({selectedRevision.timestamp})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {diffLines.slice(0, 150).map((d) => (
                          <tr key={d.lineNum} className={d.isDifferent ? "bg-amber-950/30 text-amber-200" : "hover:bg-slate-900/40"}>
                            <td className="py-1 px-3 text-right text-slate-600 select-none">{d.lineNum}</td>
                            <td className="py-1 px-4 border-r border-slate-800/60 overflow-x-auto whitespace-pre">
                              {d.active || <span className="text-slate-600">—</span>}
                            </td>
                            <td className="py-1 px-4 overflow-x-auto whitespace-pre">
                              {d.revision || <span className="text-slate-600">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Switch:</span>
            <span className="text-white font-mono font-semibold">{switchItem.hostname}</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-mono">{switchItem.ip}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => copyToClipboard(selectedRevision.content, "footer-copy")}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {copiedSection === "footer-copy" ? "✓ Copied!" : "Copy Selected Revision"}
            </button>
            <span>•</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
