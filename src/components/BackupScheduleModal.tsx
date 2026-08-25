import React, { useState, useEffect, useMemo } from "react";
import { 
  X, 
  CalendarClock, 
  Clock, 
  CheckCircle2, 
  Zap, 
  RotateCw, 
  ShieldCheck, 
  Server, 
  HardDrive, 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle, 
  Play, 
  Save, 
  Sliders, 
  Layers, 
  Calendar,
  Terminal,
  Info
} from "lucide-react";
import { BackupScheduleConfig, BackupFrequencyPreset, LiveStatusData, UserRole } from "../types";

interface BackupScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveStatus: LiveStatusData | null;
  totalSwitches: number;
  onSaveSchedule: (newConfig: BackupScheduleConfig) => Promise<void>;
  onTriggerBackupNow: () => void;
  currentUserRole?: UserRole;
}

const DEFAULT_SCHEDULE_CONFIG: BackupScheduleConfig = {
  enabled: true,
  frequency: "daily",
  dailyTimeUtc: "02:00",
  twiceDailySecondTimeUtc: "14:00",
  weeklyDays: ["SUN"],
  customCron: "0 2 * * *",
  targetScope: "ALL",
  autoSaveConfig: true,
  retentionDays: 30,
  engine: "systemd",
  scriptName: "BackupSave.py",
  alertOnFailure: true
};

export function BackupScheduleModal({
  isOpen,
  onClose,
  liveStatus,
  totalSwitches,
  onSaveSchedule,
  onTriggerBackupNow,
  currentUserRole
}: BackupScheduleModalProps) {
  const [config, setConfig] = useState<BackupScheduleConfig>(DEFAULT_SCHEDULE_CONFIG);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"frequency" | "engine" | "advanced">("frequency");
  const [currentGmtTime, setCurrentGmtTime] = useState<string>("");

  // Update current GMT time every second for live accurate scheduling
  useEffect(() => {
    const updateGmt = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setCurrentGmtTime(`${hh}:${mm}:${ss} GMT`);
    };
    updateGmt();
    const interval = setInterval(updateGmt, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick Future Time Helper (e.g. +1 minute for fast testing)
  const setQuickFutureTime = (minutesToAdd: number) => {
    const d = new Date();
    const target = new Date(d.getTime() + minutesToAdd * 60 * 1000);
    const hh = String(target.getUTCHours()).padStart(2, "0");
    const mm = String(target.getUTCMinutes()).padStart(2, "0");
    setConfig(prev => ({ ...prev, dailyTimeUtc: `${hh}:${mm}` }));
  };

  // Load existing schedule config from liveStatus or API when modal opens
  useEffect(() => {
    if (isOpen) {
      if (liveStatus?.schedule?.config) {
        setConfig(liveStatus.schedule.config);
      } else {
        // Fetch from API
        fetch("/api/backup-schedule")
          .then(res => res.json())
          .then(data => {
            if (data && data.config) {
              setConfig(data.config);
            }
          })
          .catch(() => {});
      }
    }
  }, [isOpen, liveStatus]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Calculate upcoming 5 execution preview timestamps
  const upcomingRuns = useMemo(() => {
    if (!config.enabled) {
      return ["Schedule is currently paused (disabled)."];
    }

    const runs: string[] = [];
    const now = new Date();

    const [targetHour, targetMin] = config.dailyTimeUtc.split(":").map(Number);

    if (config.frequency === "hourly") {
      for (let i = 1; i <= 5; i++) {
        const next = new Date(now.getTime() + i * 60 * 60 * 1000);
        next.setMinutes(0, 0, 0);
        runs.push(next.toUTCString());
      }
    } else if (config.frequency === "every_2h") {
      for (let i = 1; i <= 5; i++) {
        const next = new Date(now.getTime() + i * 2 * 60 * 60 * 1000);
        next.setMinutes(0, 0, 0);
        runs.push(next.toUTCString());
      }
    } else if (config.frequency === "every_4h") {
      for (let i = 1; i <= 5; i++) {
        const next = new Date(now.getTime() + i * 4 * 60 * 60 * 1000);
        next.setMinutes(0, 0, 0);
        runs.push(next.toUTCString());
      }
    } else if (config.frequency === "every_6h") {
      for (let i = 1; i <= 5; i++) {
        const next = new Date(now.getTime() + i * 60 * 60 * 1000 * 6);
        next.setMinutes(0, 0, 0);
        runs.push(next.toUTCString());
      }
    } else if (config.frequency === "every_12h") {
      for (let i = 1; i <= 5; i++) {
        const next = new Date(now.getTime() + i * 12 * 60 * 60 * 1000);
        next.setMinutes(0, 0, 0);
        runs.push(next.toUTCString());
      }
    } else if (config.frequency === "daily") {
      for (let i = 0; i < 5; i++) {
        const runDate = new Date(now);
        runDate.setUTCDate(runDate.getUTCDate() + i);
        runDate.setUTCHours(targetHour, targetMin || 0, 0, 0);
        if (runDate.getTime() > now.getTime() || i > 0) {
          runs.push(runDate.toUTCString());
        }
      }
    } else if (config.frequency === "twice_daily") {
      const [secondHour, secondMin] = (config.twiceDailySecondTimeUtc || "14:00").split(":").map(Number);
      for (let dayOffset = 0; dayOffset < 4 && runs.length < 5; dayOffset++) {
        const t1 = new Date(now);
        t1.setUTCDate(t1.getUTCDate() + dayOffset);
        t1.setUTCHours(targetHour, targetMin || 0, 0, 0);

        const t2 = new Date(now);
        t2.setUTCDate(t2.getUTCDate() + dayOffset);
        t2.setUTCHours(secondHour, secondMin || 0, 0, 0);

        if (t1.getTime() > now.getTime()) runs.push(t1.toUTCString());
        if (t2.getTime() > now.getTime() && runs.length < 5) runs.push(t2.toUTCString());
      }
    } else if (config.frequency === "weekly") {
      const dayMap: Record<string, number> = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
      const selectedDayNums = (config.weeklyDays && config.weeklyDays.length > 0 ? config.weeklyDays : ["SUN"])
        .map(d => dayMap[d] ?? 0);

      let cur = new Date(now);
      let attempts = 0;
      while (runs.length < 5 && attempts < 30) {
        attempts++;
        cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
        if (selectedDayNums.includes(cur.getUTCDay())) {
          const runDate = new Date(cur);
          runDate.setUTCHours(targetHour, targetMin || 0, 0, 0);
          runs.push(runDate.toUTCString());
        }
      }
    } else {
      runs.push(`Evaluated from Cron "${config.customCron || "0 2 * * *"}" (e.g. Daily @ ${config.dailyTimeUtc} GMT)`);
    }

    return runs.slice(0, 5);
  }, [config]);

  // Generated Systemd Unit files
  const systemdServiceCode = useMemo(() => {
    return `[Unit]
Description=Extreme Switch Automated Configuration Backup Runner (Save & TFTP/SSH)
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=root
WorkingDirectory=/opt/extreme-backup
ExecStart=/usr/bin/python3 /opt/extreme-backup/${config.scriptName || "BackupSave.py"}
StandardOutput=append:/var/log/extreme-backup.log
StandardError=append:/var/log/extreme-backup-err.log
TimeoutStartSec=1800

[Install]
WantedBy=multi-user.target`;
  }, [config.scriptName]);

  const systemdTimerCode = useMemo(() => {
    let onCalendar = "*-*-* 02:00:00";
    if (config.frequency === "hourly") onCalendar = "*-*-* *:00:00";
    else if (config.frequency === "every_2h") onCalendar = "*-*-* 0/2:00:00";
    else if (config.frequency === "every_4h") onCalendar = "*-*-* 0/4:00:00";
    else if (config.frequency === "every_6h") onCalendar = "*-*-* 0/6:00:00";
    else if (config.frequency === "every_12h") onCalendar = "*-*-* 0/12:00:00";
    else if (config.frequency === "daily") onCalendar = `*-*-* ${config.dailyTimeUtc}:00`;
    else if (config.frequency === "twice_daily") onCalendar = `*-*-* ${config.dailyTimeUtc},${config.twiceDailySecondTimeUtc || "14:00"}:00`;
    else if (config.frequency === "weekly") onCalendar = `${(config.weeklyDays || ["SUN"]).join(",")} *-*-* ${config.dailyTimeUtc}:00`;

    return `[Unit]
Description=Extreme Switch Automated Backup Trigger (${config.frequency.toUpperCase()} - GMT)
Requires=switch-backup.service

[Timer]
OnCalendar=${onCalendar}
Persistent=true
RandomizedDelaySec=60

[Install]
WantedBy=timers.target`;
  }, [config]);

  const crontabLine = useMemo(() => {
    const [h, m] = config.dailyTimeUtc.split(":");
    let schedulePattern = `${m || "0"} ${h || "2"} * * *`;
    if (config.frequency === "hourly") schedulePattern = "0 * * * *";
    else if (config.frequency === "every_2h") schedulePattern = "0 */2 * * *";
    else if (config.frequency === "every_4h") schedulePattern = "0 */4 * * *";
    else if (config.frequency === "every_6h") schedulePattern = "0 */6 * * *";
    else if (config.frequency === "every_12h") schedulePattern = "0 */12 * * *";
    else if (config.frequency === "twice_daily") {
      const [h2] = (config.twiceDailySecondTimeUtc || "14:00").split(":");
      schedulePattern = `${m || "0"} ${h || "2"},${h2 || "14"} * * *`;
    } else if (config.frequency === "weekly") {
      const dayMap: Record<string, string> = { SUN: "0", MON: "1", TUE: "2", WED: "3", THU: "4", FRI: "5", SAT: "6" };
      const days = (config.weeklyDays || ["SUN"]).map(d => dayMap[d] || "0").join(",");
      schedulePattern = `${m || "0"} ${h || "2"} * * ${days}`;
    } else if (config.frequency === "custom_cron") {
      schedulePattern = config.customCron || "0 2 * * *";
    }

    return `${schedulePattern} root /usr/bin/python3 /opt/extreme-backup/${config.scriptName || "BackupSave.py"} >> /var/log/extreme-backup.log 2>&1`;
  }, [config]);

  const windowsTaskCmd = useMemo(() => {
    return `$Action = New-ScheduledTaskAction -Execute "python.exe" -Argument "C:\\ExtremeBackup\\${config.scriptName || "BackupSave.py"}" -WorkingDirectory "C:\\ExtremeBackup"
$Trigger = New-ScheduledTaskTrigger -Daily -At "${config.dailyTimeUtc}:00"
$Principal = New-ScheduledTaskPrincipal -UserId "NT AUTHORITY\\SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "ExtremeSwitchBackup" -Action $Action -Trigger $Trigger -Principal $Principal -Description "Automated Extreme Switch fleet backups" -Force`;
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveSchedule(config);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Save schedule error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="backup-schedule-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Automated Fleet Backup Scheduler
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border flex items-center gap-1 ${
                  config.enabled 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${config.enabled ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  {config.enabled ? "ACTIVE (ENABLED)" : "PAUSED (DISABLED)"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure execution frequency, trigger timing, auto pre-save flags, and generate background systemd/cron automation timers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="Close Schedule Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab("frequency")}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "frequency"
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Frequency &amp; Timing</span>
          </button>

          <button
            onClick={() => setActiveTab("engine")}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "engine"
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Engine &amp; Setup Code</span>
          </button>

          <button
            onClick={() => setActiveTab("advanced")}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "advanced"
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Retention &amp; Scope Policies</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-sm">
          
          {/* TAB 1: FREQUENCY & TIMING */}
          {activeTab === "frequency" && (
            <div className="space-y-6">
              
              {/* Enable / Disable Master Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-100 flex items-center gap-2">
                    <span>Automated Backup Schedule Status</span>
                    {config.enabled && (
                      <span className="px-2 py-0.2 text-[10px] rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                        Running Automatically
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    When active, backups are automatically triggered fleet-wide according to your selected frequency cycle.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    config.enabled ? "bg-indigo-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      config.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Frequency Selector Buttons */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Backup Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "daily", label: "Daily (Nightly)", desc: "Standard 24h Cycle (Recommended)", badge: "Recommended" },
                    { id: "hourly", label: "Every 1 Hour", desc: "High-frequency critical drift tracking" },
                    { id: "every_2h", label: "Every 2 Hours", desc: "Frequent updates for active projects" },
                    { id: "every_4h", label: "Every 4 Hours", desc: "Quarter-day synchronization" },
                    { id: "every_6h", label: "Every 6 Hours", desc: "4 times daily snapshot" },
                    { id: "every_12h", label: "Every 12 Hours", desc: "Twice daily sync (Morning & Night)" },
                    { id: "twice_daily", label: "Twice Daily (Custom)", desc: "e.g. 02:00 AM & 14:00 PM" },
                    { id: "weekly", label: "Weekly (Select Days)", desc: "Weekly consolidation run" },
                    { id: "custom_cron", label: "Custom Cron", desc: "Advanced crontab expression" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, frequency: item.id as BackupFrequencyPreset }))}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        config.frequency === item.id
                          ? "bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-950/50 text-white"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs text-slate-200">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {item.badge}
                          </span>
                        )}
                        {config.frequency === item.id && !item.badge && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Configuration Based on Frequency */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Execution Trigger Timing (GMT Timezone)</span>
                  </div>
                  {currentGmtTime && (
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Current System Time: <strong>{currentGmtTime}</strong></span>
                    </div>
                  )}
                </div>

                {/* Daily / Twice Daily / Weekly Target Time */}
                {config.frequency !== "hourly" && 
                 config.frequency !== "every_2h" && 
                 config.frequency !== "every_4h" && 
                 config.frequency !== "every_6h" && 
                 config.frequency !== "every_12h" && 
                 config.frequency !== "custom_cron" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 font-medium">
                          Primary Scheduled Execution Time (GMT)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            step="60"
                            value={config.dailyTimeUtc}
                            onChange={(e) => setConfig(prev => ({ ...prev, dailyTimeUtc: e.target.value }))}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500 font-bold"
                          />
                          <span className="text-xs text-slate-400 font-mono">GMT (Default: 02:00)</span>
                        </div>
                      </div>

                      {config.frequency === "twice_daily" && (
                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-medium">
                            Secondary Scheduled Execution Time (GMT)
                          </label>
                          <input
                            type="time"
                            step="60"
                            value={config.twiceDailySecondTimeUtc || "14:00"}
                            onChange={(e) => setConfig(prev => ({ ...prev, twiceDailySecondTimeUtc: e.target.value }))}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>
                      )}
                    </div>

                    {/* Quick 1-Minute Testing Preset Bar */}
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Quick Timing Tester (Test Schedule in Future):</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Instant 1-Click Trigger Setup</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setQuickFutureTime(1)}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition cursor-pointer flex items-center gap-1 shadow-sm"
                          title="Sets schedule to run exactly 1 minute in the future for instant testing"
                        >
                          <span>⚡ +1 Min (Fast Test)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickFutureTime(2)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                        >
                          +2 Min
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickFutureTime(5)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                        >
                          +5 Min
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickFutureTime(15)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                        >
                          +15 Min
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfig(prev => ({ ...prev, dailyTimeUtc: "02:00" }))}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition cursor-pointer ml-auto"
                        >
                          Reset to 02:00 (Nightly Default)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weekly Day Picker */}
                {config.frequency === "weekly" && (
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <label className="block text-xs text-slate-400">
                      Days of the Week to Execute:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => {
                        const isSelected = (config.weeklyDays || ["SUN"]).includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const current = config.weeklyDays || ["SUN"];
                              const next = isSelected 
                                ? current.filter(d => d !== day)
                                : [...current, day];
                              if (next.length === 0) next.push(day);
                              setConfig(prev => ({ ...prev, weeklyDays: next }));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow"
                                : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Custom Cron Input */}
                {config.frequency === "custom_cron" && (
                  <div className="space-y-2">
                    <label className="block text-xs text-slate-400">
                      Custom 5-Part Cron Expression (Minute Hour Dom Month Dow):
                    </label>
                    <input
                      type="text"
                      value={config.customCron || "0 2 * * *"}
                      onChange={(e) => setConfig(prev => ({ ...prev, customCron: e.target.value }))}
                      placeholder="e.g. 0 2 * * *"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[11px] text-slate-500 font-mono">
                      Example: <code>0 2 * * *</code> (Every day at 02:00), <code>0 */6 * * *</code> (Every 6 hours)
                    </p>
                  </div>
                )}
              </div>

              {/* Live Preview: Upcoming 5 Execution Timestamps */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Projected Next 5 Scheduled Executions
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Calculated from Active Rules</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {upcomingRuns.map((run, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between text-xs font-mono bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800/80 text-slate-300"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-400 font-bold">#{idx + 1}</span>
                        <span>{run}</span>
                      </div>
                      {idx === 0 && (
                        <span className="px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                          Next Run
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ENGINE & SETUP CODE */}
          {activeTab === "engine" && (
            <div className="space-y-6">
              
              {/* Engine Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Automation Host Engine Platform
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "systemd", label: "Systemd Timer (Ubuntu / Linux)", desc: "Production Recommended on Ubuntu VM" },
                    { id: "cron", label: "Linux Crontab (/etc/cron.d)", desc: "Standard UNIX Cron service" },
                    { id: "windows_task", label: "Windows Task Scheduler", desc: "PowerShell & Windows Server" }
                  ].map((engineItem) => (
                    <button
                      key={engineItem.id}
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, engine: engineItem.id as any }))}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        config.engine === engineItem.id
                          ? "bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-950/50 text-white"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs text-slate-200">{engineItem.label}</span>
                        {config.engine === engineItem.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {engineItem.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Setup Code Display */}
              {config.engine === "systemd" && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-300">
                        1. /etc/systemd/system/switch-backup.service
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(systemdServiceCode, "service")}
                        className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        {copiedKey === "service" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "service" ? "Copied!" : "Copy Unit"}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-900/90 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto border border-slate-800">
                      {systemdServiceCode}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-300">
                        2. /etc/systemd/system/switch-backup.timer
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(systemdTimerCode, "timer")}
                        className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        {copiedKey === "timer" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "timer" ? "Copied!" : "Copy Timer"}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-900/90 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto border border-slate-800">
                      {systemdTimerCode}
                    </pre>
                  </div>

                  <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs font-mono text-indigo-300 flex items-center justify-between">
                    <span>sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now switch-backup.timer</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("sudo systemctl daemon-reload && sudo systemctl enable --now switch-backup.timer", "cmd")}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                      title="Copy activation command"
                    >
                      {copiedKey === "cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {config.engine === "cron" && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      Crontab Line (/etc/crontab or crontab -e)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(crontabLine, "cron")}
                      className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      {copiedKey === "cron" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "cron" ? "Copied!" : "Copy Cron Line"}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900/90 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                    {crontabLine}
                  </pre>
                </div>
              )}

              {config.engine === "windows_task" && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      PowerShell Task Registration Command
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(windowsTaskCmd, "win")}
                      className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      {copiedKey === "win" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "win" ? "Copied!" : "Copy PowerShell"}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900/90 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                    {windowsTaskCmd}
                  </pre>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: POLICIES & SCOPE */}
          {activeTab === "advanced" && (
            <div className="space-y-6">
              
              {/* Pre-save config toggle */}
              <div className="flex items-start justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Mandatory Pre-Backup Save Configuration</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Automatically issues <code>save configuration</code> on EXOS and <code>save config</code> on VOSS switches prior to TFTP/SSH export to guarantee uncommitted runtime changes are preserved.
                  </p>
                </div>
                
                <input
                  type="checkbox"
                  checked={config.autoSaveConfig}
                  onChange={(e) => setConfig(prev => ({ ...prev, autoSaveConfig: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 shrink-0 cursor-pointer mt-1"
                />
              </div>

              {/* Retention Policy Window */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-amber-400" />
                    <span>Archival Retention Period (Days)</span>
                  </label>
                  <span className="text-sm font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/60">
                    {config.retentionDays} Days Rolling
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Archived configuration snapshots older than this threshold will be pruned automatically to preserve storage.
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-1">
                  {[7, 14, 30, 60, 90, 180, 365].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, retentionDays: days }))}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        config.retentionDays === days
                          ? "bg-amber-600 text-white shadow"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Scope */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Target Backup Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "ALL", label: `All Estate Switches (${totalSwitches} devices in Switches.txt)` },
                    { id: "CORE_DISTRIBUTION", label: "Core & Distribution Fabric Only (VOSS / VSP)" },
                    { id: "EDGE_ONLY", label: "Edge Access Switches Only (EXOS Summit Series)" },
                    { id: "CUSTOM", label: "Custom Filter / Selected Subnets" }
                  ].map((scopeItem) => (
                    <button
                      key={scopeItem.id}
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, targetScope: scopeItem.id as any }))}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                        config.targetScope === scopeItem.id
                          ? "bg-indigo-950/80 border-indigo-500 text-white font-semibold shadow"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span>{scopeItem.label}</span>
                      {config.targetScope === scopeItem.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          
          <button
            type="button"
            onClick={() => {
              onTriggerBackupNow();
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 shadow transition w-full sm:w-auto justify-center cursor-pointer"
            title="Execute an on-demand immediate backup job now"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>⚡ Run Test Backup Now</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition border border-transparent cursor-pointer w-full sm:w-auto text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              id="btn-save-backup-schedule"
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all w-full sm:w-auto cursor-pointer ${
                saveSuccess
                  ? "bg-emerald-600 text-white"
                  : isSaving
                  ? "bg-indigo-600/70 text-white cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50 hover:shadow-indigo-600/20"
              }`}
            >
              {isSaving ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saveSuccess ? "Schedule Applied!" : isSaving ? "Saving..." : "Save & Apply Schedule"}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
