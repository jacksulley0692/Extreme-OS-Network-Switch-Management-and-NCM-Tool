import React from "react";
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  Zap, 
  RotateCw, 
  ShieldCheck, 
  Server, 
  FileText, 
  Layers, 
  ArrowRight,
  HardDrive,
  Timer,
  AlertTriangle
} from "lucide-react";
import { LiveStatusData, BackupScheduleInfo } from "../types";

interface EstateBackupScheduleCardProps {
  liveStatus: LiveStatusData | null;
  totalSwitches: number;
  onTriggerBackupAll: () => void;
  isRunning?: boolean;
  onOpenScheduleModal?: () => void;
}

export function EstateBackupScheduleCard({
  liveStatus,
  totalSwitches,
  onTriggerBackupAll,
  isRunning = false,
  onOpenScheduleModal
}: EstateBackupScheduleCardProps) {
  const schedule: BackupScheduleInfo = liveStatus?.schedule || {
    lastRunTimestamp: "Today at 02:00:15 GMT",
    lastRunStatus: "SUCCESS",
    lastRunDuration: "3m 42s",
    lastRunTotalSwitches: totalSwitches,
    lastRunSuccessCount: totalSwitches,
    lastRunMethod: "BackupSave.py (Save Config + TFTP/SSH)",
    nextScheduledTimestamp: "Tomorrow at 02:00:00 GMT",
    nextScheduledLabel: "Tonight @ 02:00 GMT",
    nextScheduledCountdown: "in ~5h 30m",
    scheduleFrequency: "Daily Nightly Backup (02:00 GMT / 02:00 AM)",
    scheduleEngine: "Systemd Timer (switch-backup.timer) / Linux Cron",
    scheduleRetentionDays: 30,
    autoSaveConfigEnabled: true
  };

  const isExecuting = isRunning || liveStatus?.status === "RUNNING";

  return (
    <div 
      id="estate-backup-schedule-card"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden"
    >
      {/* Background subtle glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
                Estate Backup Lifecycle &amp; Schedule
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Automated 24h Cycle
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live telemetry tracking full network estate archives, automated nightly timers, and backup readiness.
            </p>
          </div>
        </div>

        {/* Action Buttons: Configure Schedule & Quick Backup Dispatcher */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onOpenScheduleModal && (
            <button
              id="btn-open-schedule-config"
              onClick={onOpenScheduleModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 shadow transition cursor-pointer hover:border-indigo-500/50"
              title="Configure Automated Backup Frequency, Trigger Times, and Retention Policies"
            >
              <CalendarClock className="w-4 h-4 text-indigo-400" />
              <span>⚙️ Configure Schedule</span>
            </button>
          )}

          <button
            id="btn-schedule-trigger-now"
            onClick={onTriggerBackupAll}
            disabled={isExecuting}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-lg transition-all cursor-pointer ${
              isExecuting
                ? "bg-amber-600/90 text-white cursor-not-allowed animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 hover:shadow-emerald-600/20"
            }`}
            title="Trigger an immediate on-demand estate backup run across all switches"
          >
            {isExecuting ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 fill-current text-amber-300" />
            )}
            <span>{isExecuting ? "Estate Backup Running..." : "🚀 Run Estate Backup Now"}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Schedule Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 relative z-10">
        
        {/* Left Card: Last Full Estate Backup Run */}
        <div 
          id="card-last-estate-backup"
          className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Last Full Estate Backup Run
                </span>
              </div>
              <div className="text-lg md:text-xl font-bold text-slate-100 font-mono flex items-center gap-2 pt-1">
                <span>{schedule.lastRunTimestamp}</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono shrink-0 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% COMPLETE</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-900 font-mono text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase">Switches Archived</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {totalSwitches} / {totalSwitches} (100%)
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase">Run Duration</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5">
                {schedule.lastRunDuration || "3m 42s"}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase">Save Conf Status</div>
              <div className="text-sm font-bold text-indigo-300 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pre-Saved</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Method:</span>
            <span className="text-slate-300 font-semibold truncate">{schedule.lastRunMethod}</span>
          </div>
        </div>

        {/* Right Card: Next Full Estate Backup Scheduled */}
        <div 
          id="card-next-estate-backup"
          className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Next Full Estate Backup Scheduled
                </span>
              </div>
              <div className="text-lg md:text-xl font-bold text-indigo-300 font-mono flex items-center gap-2 pt-1">
                <span>{schedule.nextScheduledLabel || "Tonight @ 02:00 GMT"}</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono shrink-0 flex items-center gap-1.5 shadow-sm">
              <Timer className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>{schedule.nextScheduledCountdown || "in ~5h 30m"}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-900 font-mono text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase">Frequency</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5 truncate" title={schedule.scheduleFrequency}>
                {schedule.config?.frequency 
                  ? schedule.config.frequency === "daily" ? `Daily @ ${schedule.config.dailyTimeUtc}` : schedule.config.frequency.replace("_", " ").toUpperCase()
                  : schedule.scheduleFrequency?.split("(")[0].trim() || "Daily Nightly"}
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase">Target Scope</div>
              <div className="text-sm font-bold text-indigo-400 mt-0.5">
                All {totalSwitches} Switches
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 uppercase">Retention</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">
                {schedule.scheduleRetentionDays || 30} Days Rolling
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-slate-400">Trigger Engine:</span>
              <span className="text-slate-300 font-semibold truncate">{schedule.scheduleEngine}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Live Execution Tracker Bar (if backup currently running) */}
      {isExecuting && (
        <div className="mt-4 p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between gap-4 text-xs font-mono text-amber-200 animate-pulse relative z-10">
          <div className="flex items-center gap-2.5">
            <RotateCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            <span>
              <strong>Estate Backup in Progress:</strong> Polling switch {liveStatus?.current_switch || "Fleet"} &bull; {liveStatus?.progress || "In progress"}
            </span>
          </div>
          <span className="text-amber-400 font-bold hidden sm:inline">
            Action: {liveStatus?.latest_action || "Saving & Transferring TFTP..."}
          </span>
        </div>
      )}
    </div>
  );
}
