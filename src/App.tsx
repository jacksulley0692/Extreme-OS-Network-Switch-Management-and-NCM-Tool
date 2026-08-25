/**
 * ============================================================================
 * 📌 DEVELOPER GUIDE: FRONTEND ENTRY POINT (App.tsx)
 * ============================================================================
 * 
 * 1. HOW TO ADD A NEW TAB TO THE TOP NAVIGATION BAR:
 *    Step A: Update the `activeTab` type union on line 38 below (e.g. add `| "my_new_tab"`).
 *    Step B: Add a navigation `<button>` inside `<nav className="flex items-center gap-1.5 ...">` around line 320.
 *    Step C: Add a corresponding view block inside `<main>` around line 375:
 *            `{activeTab === "my_new_tab" && <MyNewComponent />}`
 * 
 * 2. USER AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC):
 *    - Current logged-in user is stored in `currentUser` state (`AuthUser | null`).
 *    - Available roles: `'network_admin'` (Full access) and `'service_desk'` (Read/Diagnostics only).
 *    - Check permissions using `currentUser?.role === 'network_admin'`.
 * 
 * 3. BACKEND API COMMUNICATION:
 *    - All API endpoints are defined in `portal_server.py` and `server.ts`.
 *    - Status endpoint: `GET /api/status`
 *    - Backup trigger: `POST /api/run-backup`
 *    - Script loader/saver: `GET /api/script`, `POST /api/script`
 *    - Authentication: `POST /api/auth/login`, `POST /api/auth/logout`
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { 
  Server, 
  RotateCw, 
  Terminal, 
  BookOpen, 
  Activity, 
  FileCode, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Network, 
  Sparkles,
  ExternalLink,
  Info,
  User,
  LogOut,
  History
} from "lucide-react";
import { SwitchItem, LiveStatusData, AuthUser } from "./types";
import { MOCK_SWITCHES } from "./data/mockSwitches";
import { SwitchReplacementHub } from "./components/SwitchReplacementHub";
import { ReplacementCheatSheet } from "./components/ReplacementCheatSheet";
import { UbuntuMigrationKit } from "./components/UbuntuMigrationKit";
import { LiveOperationsRunner } from "./components/LiveOperationsRunner";
import { ScriptSafetyAuditor } from "./components/ScriptSafetyAuditor";
import { SiteDiagramViewer } from "./components/SiteDiagramViewer";
import { LoginModal } from "./components/LoginModal";
import { AuditTrailViewer } from "./components/AuditTrailViewer";

export default function App() {
  // Navigation tabs state - Add new tab identifiers here:
  const [activeTab, setActiveTab] = useState<"replacement" | "diagrams" | "operations" | "cheatsheet" | "migration" | "auditor" | "audit_trail">("replacement");
  const [switches] = useState<SwitchItem[]>(MOCK_SWITCHES);
  
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = sessionStorage.getItem("extreme_portal_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Live Status State
  const [liveStatus, setLiveStatus] = useState<LiveStatusData | null>(null);

  // Script Auditor State
  const [files, setFiles] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [fileName, setFileName] = useState<string>("BackupSave.py");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    sessionStorage.removeItem("extreme_portal_user");
    sessionStorage.removeItem("extreme_portal_token");
    setCurrentUser(null);
  };

  const fetchLiveStatus = () => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setLiveStatus(data))
      .catch(() => {});
  };

  const loadFile = (targetFile: string) => {
    fetch(`/api/script?file=${encodeURIComponent(targetFile)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          setCode(data.code);
          setFileName(data.fileName);
        }
      })
      .catch((err) => console.error("Error loading file:", err));
  };

  useEffect(() => {
    // Fetch available project files
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => {
        if (data.files && data.files.length > 0) {
          setFiles(data.files);
        }
      })
      .catch(() => {});

    loadFile("BackupSave.py");
    fetchLiveStatus();

    // Poll live status every 3 seconds
    const interval = setInterval(fetchLiveStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveWorkspaceScript = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, fileName }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerBackup = async (scriptName: string, targetSwitch: string) => {
    try {
      const res = await fetch("/api/run-backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          scriptName, 
          targetSwitch,
          username: currentUser?.username,
          fullName: currentUser?.fullName,
          role: currentUser?.role
        }),
      });
      if (res.ok) {
        fetchLiveStatus();
      }
    } catch (err) {
      console.error("Trigger error:", err);
    }
  };

  const isRunning = liveStatus?.status === "RUNNING" || liveStatus?.status?.includes("RUNNING");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* If not logged in, enforce login modal requirement */}
      {!currentUser && (
        <LoginModal onLoginSuccess={(user) => setCurrentUser(user)} />
      )}

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-base tracking-tight">Extreme Switch Hub & Replacement Portal</h1>
                <span className="bg-indigo-950 text-indigo-300 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-800 font-semibold">
                  EXOS & VOSS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enterprise Automated Backup, Configuration Provisioning & Field Restoration Suite
              </p>
            </div>
          </div>

          {/* Right Status Indicator & Logged in User Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
              <span className="text-slate-400">Engine:</span>
              <span className={isRunning ? "text-amber-400 font-bold" : "text-emerald-300 font-bold"}>
                {liveStatus?.status || "IDLE"}
              </span>
              {liveStatus?.progress && (
                <span className="text-slate-400">[{liveStatus.progress}]</span>
              )}
            </div>

            {/* Current User Session Widget */}
            {currentUser && (
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-bold text-slate-200">{currentUser.fullName}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    currentUser.role === "network_admin" 
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" 
                      : "bg-indigo-950/80 text-indigo-300 border-indigo-800"
                  }`}>
                    {currentUser.role === "network_admin" ? "Admin" : "Service Desk"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-400 p-1 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick 1-Click File Downloaders */}
            <div className="relative flex items-center gap-2">
              <button
                id="btn-quick-download-users-txt"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/script?file=users.txt");
                    const data = await res.json();
                    const content = data.code || "";
                    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "users.txt";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    window.open("/api/download/users.txt", "_blank");
                  }
                }}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg shadow transition cursor-pointer"
                title="1-Click Download users.txt file for your Ubuntu VM"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>📥 users.txt</span>
              </button>

              <button
                id="btn-quick-download-portal-server"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/script?file=portal_server.py");
                    const data = await res.json();
                    const content = data.code || "";
                    const blob = new Blob([content], { type: "text/x-python;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "portal_server.py";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    window.open("/api/download/portal_server.py", "_blank");
                  }
                }}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow transition cursor-pointer"
                title="Download updated portal_server.py to your local machine"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>📥 Download portal_server.py</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 text-xs font-medium scrollbar-none">
            <button
              id="nav-tab-replacement"
              onClick={() => setActiveTab("replacement")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "replacement"
                  ? "bg-indigo-600 text-white shadow font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Switch Replacement Hub</span>
            </button>

            <button
              id="nav-tab-diagrams"
              onClick={() => setActiveTab("diagrams")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "diagrams"
                  ? "bg-indigo-600 text-white shadow font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Site Network Diagrams</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                130+ Sites
              </span>
            </button>

            <button
              id="nav-tab-audit-trail"
              onClick={() => setActiveTab("audit_trail")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "audit_trail"
                  ? "bg-indigo-600 text-white shadow font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>Activity Audit Trail</span>
            </button>

            <button
              id="nav-tab-operations"
              onClick={() => setActiveTab("operations")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "operations"
                  ? "bg-indigo-600 text-white shadow font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Operations Runner</span>
            </button>

            <button
              id="nav-tab-cheatsheet"
              onClick={() => setActiveTab("cheatsheet")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "cheatsheet"
                  ? "bg-indigo-600 text-white shadow font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Field Tech Cheat Sheets (EXOS / VOSS)</span>
            </button>

            <button
              id="nav-tab-migration"
              onClick={() => setActiveTab("migration")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "migration"
                  ? "bg-indigo-600 text-white shadow font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Ubuntu VM Migration Kit</span>
            </button>

            <button
              id="nav-tab-auditor"
              onClick={() => setActiveTab("auditor")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "auditor"
                  ? "bg-indigo-600 text-white shadow font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Python Scripts & AI Auditor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === "replacement" && (
          <SwitchReplacementHub 
            switches={switches} 
            onTriggerBackup={handleTriggerBackup} 
            isRunning={isRunning}
            liveStatus={liveStatus}
            currentUserRole={currentUser?.role}
            currentUser={currentUser}
          />
        )}

        {activeTab === "diagrams" && (
          <SiteDiagramViewer 
            initialSiteOrSwitch="Leeds" 
            onSelectSwitchForReplacement={(hostname, ip) => {
              setActiveTab("replacement");
            }}
          />
        )}

        {activeTab === "audit_trail" && (
          <AuditTrailViewer currentUserRole={currentUser?.role} />
        )}

        {activeTab === "operations" && (
          <LiveOperationsRunner 
            liveStatus={liveStatus} 
            switches={switches} 
            onTriggerBackup={handleTriggerBackup} 
          />
        )}

        {activeTab === "cheatsheet" && (
          <ReplacementCheatSheet />
        )}

        {activeTab === "migration" && (
          <UbuntuMigrationKit />
        )}

        {activeTab === "auditor" && (
          <ScriptSafetyAuditor
            files={files}
            code={code}
            fileName={fileName}
            onSelectFile={loadFile}
            onCodeChange={setCode}
            onSaveScript={handleSaveWorkspaceScript}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Extreme Switch Backup & Provisioning Portal &bull; Enterprise Edition</span>
          <span className="font-mono text-[11px]">Ready for Ubuntu Linux Server deployment</span>
        </div>
      </footer>
    </div>
  );
}

