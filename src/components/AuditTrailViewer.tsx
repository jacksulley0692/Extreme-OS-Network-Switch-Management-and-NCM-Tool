import React, { useState, useEffect, useMemo } from "react";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  Zap, 
  Sliders, 
  KeyRound,
  Layers,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  FileText,
  ExternalLink
} from "lucide-react";
import { AuditLogItem, UserRole } from "../types";

interface AuditTrailViewerProps {
  currentUserRole?: UserRole;
}

export function AuditTrailViewer({ currentUserRole }: AuditTrailViewerProps) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [userFilter, setUserFilter] = useState<string>("ALL");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/audit/logs");
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setLogs(data.logs);
        }
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const uniqueUsers = useMemo(() => {
    const users = new Set(logs.map(l => l.username));
    return Array.from(users);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        (log.username || "").toLowerCase().includes(q) ||
        (log.fullName || "").toLowerCase().includes(q) ||
        (log.details || "").toLowerCase().includes(q) ||
        (log.action || "").toLowerCase().includes(q) ||
        (log.category || "").toLowerCase().includes(q) ||
        (log.switchIp && log.switchIp.includes(searchQuery)) ||
        (log.switchHostname && log.switchHostname.toLowerCase().includes(q));

      let matchesCat = true;
      if (categoryFilter === "ALL") {
        matchesCat = true;
      } else if (categoryFilter === "DIAGNOSTIC") {
        matchesCat = log.category === "DIAGNOSTIC" || log.action === "PING_TEST" || log.action === "PING";
      } else if (categoryFilter === "PORT_OPERATIONS") {
        matchesCat = log.category === "PORT_OPERATIONS" || log.category === "PORT_BOUNCE" || log.action === "BOUNCE_PORT" || log.action === "PORT_BOUNCE";
      } else if (categoryFilter === "CONFIGURATION_MANAGEMENT") {
        matchesCat = log.category === "CONFIGURATION_MANAGEMENT" || log.action === "ROLLOUT_CONFIG" || log.action === "FLEET_CONFIG_ROLLOUT" || log.action === "UPDATE_INVENTORY";
      } else if (categoryFilter === "BACKUP") {
        matchesCat = log.category === "BACKUP" || log.category === "BACKUP_OPERATIONS" || log.action === "TRIGGER_BACKUP" || log.action === "BACKUP_ALL";
      } else if (categoryFilter === "CONFIG_CUSTOMIZE") {
        matchesCat = log.category === "CONFIG_CUSTOMIZE" || log.action === "CUSTOMIZE_CONFIG" || log.action === "SANITIZE_CONFIG";
      } else if (categoryFilter === "AUTH") {
        matchesCat = log.category === "AUTH" || log.action === "LOGIN" || log.action === "LOGOUT";
      } else {
        matchesCat = log.category === categoryFilter || log.action === categoryFilter;
      }

      const matchesUser = userFilter === "ALL" || log.username === userFilter;

      return matchesSearch && matchesCat && matchesUser;
    });
  }, [logs, searchQuery, categoryFilter, userFilter]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (expandedIds.size === filteredLogs.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredLogs.map(l => l.id)));
    }
  };

  const handleCopyDetails = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = ["Timestamp", "Username", "Full Name", "Role", "Category", "Switch IP", "Hostname", "Details", "Status", "Client IP"];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.username}"`,
      `"${l.fullName}"`,
      `"${l.role}"`,
      `"${l.category}"`,
      `"${l.switchIp || ''}"`,
      `"${l.switchHostname || ''}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.clientIp || ''}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Switch_Portal_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryBadge = (cat: string, action?: string) => {
    if (action === "PING_TEST" || cat === "DIAGNOSTIC") {
      return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">PING / DIAGNOSTIC</span>;
    }
    if (action === "PORT_BOUNCE" || cat === "PORT_OPERATIONS" || cat === "PORT_BOUNCE") {
      return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-950/80 text-amber-300 border border-amber-800">PORT BOUNCE</span>;
    }
    if (cat === "CONFIGURATION_MANAGEMENT" || action === "ROLLOUT_CONFIG" || action === "FLEET_CONFIG_ROLLOUT") {
      return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-950/80 text-purple-300 border border-purple-800">MULTI ROLLOUT</span>;
    }
    if (cat === "BACKUP" || action === "TRIGGER_BACKUP" || action === "BACKUP_ALL") {
      return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">BACKUP TRIGGER</span>;
    }
    if (cat === "CONFIG_CUSTOMIZE" || action === "CUSTOMIZE_CONFIG" || action === "SANITIZE_CONFIG") {
      return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800">CONFIG SANITIZE</span>;
    }
    if (cat === "AUTH" || action === "LOGIN" || action === "LOGOUT") {
      return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-blue-950/80 text-blue-300 border border-blue-800">LOGIN / AUTH</span>;
    }
    return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">{cat || action}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Service Desk & Admin Activity Audit Log</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {filteredLogs.length} Records
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable accountability record tracking all configuration changes, backups, port bounces, diagnostics, and user sessions. Click any record or use the expand button to read full details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            disabled={filteredLogs.length === 0}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title={expandedIds.size === filteredLogs.length ? "Collapse all details" : "Expand all details in full"}
          >
            {expandedIds.size === filteredLogs.length && filteredLogs.length > 0 ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Collapse All</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Expand All ({filteredLogs.length})</span>
              </>
            )}
          </button>

          <button
            onClick={fetchAuditLogs}
            disabled={isLoading}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={logs.length === 0}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username, switch IP, hostname, or action details..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="DIAGNOSTIC">Ping & Reachability Tests</option>
            <option value="PORT_OPERATIONS">Port Bounces</option>
            <option value="CONFIGURATION_MANAGEMENT">Multi-Switch Rollouts</option>
            <option value="BACKUP">Backup Triggers</option>
            <option value="CONFIG_CUSTOMIZE">Config Customizations</option>
            <option value="AUTH">Logins & Sessions</option>
          </select>
        </div>

        {/* User Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">User:</span>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Users</option>
            {uniqueUsers.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table with Expandable Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3 w-8"></th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target Switch</th>
                <th className="py-3 px-4">Action Details</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No activity logs recorded matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedIds.has(log.id);
                  const isSuccess = (log.status || "").toUpperCase() === "SUCCESS";
                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        onClick={() => toggleExpand(log.id)}
                        className={`hover:bg-slate-800/60 transition cursor-pointer ${isExpanded ? "bg-slate-800/40" : ""}`}
                      >
                        <td className="py-3 px-3 text-center text-slate-400">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-indigo-400 mx-auto transition-transform" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500 mx-auto transition-transform" />
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{log.fullName || log.username}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            @{log.username} ({(log.role === "network_admin" || log.role === "Admin") ? "Admin" : "Service Desk"})
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getCategoryBadge(log.category, log.action)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                          {log.switchIp ? (
                            <div>
                              <span className="text-indigo-300 font-bold">{log.switchHostname || "Switch"}</span>
                              <span className="text-slate-500 text-[10px] ml-1.5">({log.switchIp})</span>
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-xs max-w-md">
                          <div className="flex items-center justify-between gap-2">
                            <span className={isExpanded ? "" : "truncate block"}>
                              {log.details}
                            </span>
                            <span className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 underline shrink-0 whitespace-nowrap">
                              {isExpanded ? "Collapse" : "Expand"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap font-mono">
                          {isSuccess ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              SUCCESS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              {log.status || "FAILED"}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-500 whitespace-nowrap">
                          {log.clientIp || "127.0.0.1"}
                        </td>
                      </tr>

                      {/* Full Expanded Details Panel */}
                      {isExpanded && (
                        <tr className="bg-slate-950/80 border-b border-indigo-500/20">
                          <td colSpan={8} className="p-4 pl-12">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-inner">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-indigo-400" />
                                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                                    Full Activity Detail Record
                                  </span>
                                  <span className="font-mono text-[11px] text-slate-400">
                                    [{log.action || log.category}]
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyDetails(log.details, log.id);
                                    }}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                                  >
                                    {copiedId === log.id ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Copy Details</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyDetails(JSON.stringify(log, null, 2), `${log.id}-json`);
                                    }}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                                  >
                                    {copiedId === `${log.id}-json` ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">JSON Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                                        <span>Copy Raw JSON</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Detailed Text Box */}
                              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap break-words leading-relaxed select-text">
                                {log.details}
                              </div>

                              {/* Meta Info Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[11px] font-mono">
                                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                                  <div className="text-slate-500 text-[10px] uppercase">Operator Identity</div>
                                  <div className="text-slate-200 font-bold truncate">{log.fullName || log.username} (@{log.username})</div>
                                </div>
                                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                                  <div className="text-slate-500 text-[10px] uppercase">Target Switch</div>
                                  <div className="text-indigo-300 font-bold truncate">{log.switchHostname || "Fleet-Wide"} {log.switchIp ? `(${log.switchIp})` : ""}</div>
                                </div>
                                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                                  <div className="text-slate-500 text-[10px] uppercase">Timestamp &amp; Client</div>
                                  <div className="text-slate-300 truncate">{log.timestamp} | {log.clientIp || "127.0.0.1"}</div>
                                </div>
                                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                                  <div className="text-slate-500 text-[10px] uppercase">Status &amp; Category</div>
                                  <div className="text-slate-300 font-bold flex items-center gap-1.5">
                                    <span className={isSuccess ? "text-emerald-400" : "text-rose-400"}>{log.status || "SUCCESS"}</span>
                                    <span className="text-slate-600">/</span>
                                    <span className="text-slate-400">{log.category}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

