/**
 * ============================================================================
 * EXTREME SWITCH BACKUP & MANAGEMENT SUITE - TYPES & DATA CONTRACTS
 * ============================================================================
 * 
 * Central TypeScript interface definitions for the entire web portal,
 * switch inventory, live telemetry engine, RBAC auth, and backup workflows.
 *
 * Supported Switch Operating Systems:
 *  - EXOS: ExtremeXOS (Summit X440, X450, X460, X670, 5000 Series)
 *  - VOSS: Virtual Operating System (VSP 4000, 7000, 8000 Series Fabric Engines)
 *  - Cisco-IOS: Legacy/Hybrid edge interconnects
 */

/** Supported switch network operating systems */
export type SwitchOS = "EXOS" | "VOSS" | "Cisco-IOS";

/** Backup execution state for individual switch jobs */
export type BackupStatus = "Success" | "Warning" | "Failed" | "Pending";

/**
 * Switch Port Entry:
 * Represents a single physical/logical Ethernet port on a switch.
 */
export interface PortEntry {
  /** Physical port label (e.g., "1", "48", "1/1", "1/49") */
  port: string;
  /** Port description/alias (e.g., "UPLINK-CORE-VSP", "AP-SPA-01") */
  name: string;
  /** VLAN ID or Default VLAN Name assigned */
  vlan: string | number;
  /** Operational link status */
  status: "up" | "down" | "disabled";
  /** Administrative enabled/disabled state */
  adminState?: "enabled" | "disabled";
  /** Real-time PHY link state */
  linkState?: "active" | "ready" | "down" | "disabled";
  /** Negotiated speed & duplex (e.g., "1000M/Full", "10G/Full") */
  speed: string;
  /** Flag indicating if this port is an inter-switch uplink */
  isUplink?: boolean;
  /** Power over Ethernet state */
  poeEnabled?: boolean;
  /** Real-time PoE power draw in Watts */
  poeWattage?: number;
}

/**
 * Switch Backup Revision:
 * Represents an archival timestamped snapshot of a switch configuration.
 */
export interface SwitchBackupRevision {
  /** Unique revision ID */
  id: string;
  /** ISO timestamp when backup was generated */
  timestamp: string;
  /** Filename stored on TFTP/SFTP root (e.g., "10.32.81.250-20260824.xsf") */
  filename: string;
  /** Size of configuration file in KB */
  fileSizeKb: number;
  /** Config file extension format: .xsf (EXOS script) or .cfg (VOSS text) */
  format: "xsf" | "cfg" | "cli";
  /** Author or system trigger that ran the backup */
  author: string;
  /** MD5 or SHA256 integrity hash */
  hash: string;
  /** Summary of changes compared to prior revision */
  changesSummary?: string;
  /** Full raw configuration file contents */
  content: string;
}

/**
 * LLDP Discovered Neighbor:
 * Represents a remote device discovered via Link Layer Discovery Protocol.
 */
export interface LldpNeighbor {
  /** Local port on this switch where the neighbor is attached */
  localPort: string;
  /** Discovered remote hostname (e.g., "DLC-York-MainComms-2") */
  remoteSystemName: string;
  /** Remote interface port identifier (e.g., "Port 48" or "1/1") */
  remotePortId: string;
  /** Remote port description string if broadcast */
  remotePortDesc?: string;
  /** Remote chassis MAC or base ID */
  remoteChassisId: string;
  /** Management IP address advertised by neighbor */
  remoteMgmtIp?: string;
  /** Remote OS/Model description string */
  remoteSystemDesc?: string;
  /** LLDP Capabilities (e.g. ["Bridge", "Router", "WLAN AP", "Telephone"]) */
  remoteCapabilities: string[];
  /** Advertised Port VLAN ID (PVID) */
  portVlan?: string | number;
  /** Negotiated LLDP-MED PoE power allocation in Watts */
  poeAllocated?: string;
  /** Discovery timestamp */
  lastDiscovered?: string;
}

/**
 * Master Switch Inventory Record:
 * Full representation of a managed network switch in the fleet.
 */
export interface SwitchItem {
  /** Unique internal identifier */
  id: string;
  /** Fully-qualified hostname (e.g., "DLC-York-Spa-SW1") */
  hostname: string;
  /** IPv4 Management address (e.g., "10.32.81.250") */
  ip: string;
  /** Switch Operating System architecture */
  os: SwitchOS;
  /** Hardware model (e.g., "Summit X440-48p", "VSP 4450GSX-PWR") */
  model: string;
  /** Current operating firmware version */
  firmware: string;
  /** Hardware chassis serial number */
  serialNumber: string;
  /** Base chassis MAC address */
  macAddress: string;
  /** Management VLAN tag (e.g., 81 or 221) */
  primaryVlan: number;
  /** Default gateway IP for management routing */
  gateway: string;
  /** List of uplink ports linking to distribution or core */
  uplinkPorts: string[];
  /** Timestamp of most recent successful backup */
  lastBackupTime: string;
  /** Outcome of most recent backup run */
  lastBackupStatus: BackupStatus;
  /** Jump-box / transit IP if reached via multi-hop SSH/Telnet */
  hopThrough?: string;
  /** Target backup path on TFTP server */
  tftpPath: string;
  /** Native configuration format (.xsf for EXOS, .cfg for VOSS) */
  configFormat: "xsf" | "cfg";
  /** Current active configuration text */
  activeConfig: string;
  /** Archival revision history */
  previousRevisions: SwitchBackupRevision[];
  /** Port status and description table */
  ports: PortEntry[];
  /** Parsed LLDP neighbor topology */
  backupLldpNeighbors?: LldpNeighbor[];
  /** Raw unprocessed CLI output for verification */
  rawBackupLldpOutput?: string;
  /** Custom operator notes or site location tags */
  notes?: string;
  /** ICMP ping reachability status */
  isReachable?: boolean;
  /** Round-trip ping latency in milliseconds */
  latencyMs?: number | null;
  /** Timestamp of last reachability probe */
  lastPingTime?: string;
}

/**
 * Forwarding Database (FDB / MAC Table) Record:
 * Real-time MAC address table learned on switch hardware.
 */
export interface FdbEntry {
  /** MAC address in colon/hyphen notation */
  mac: string;
  /** Physical switch port where MAC was learned */
  port: string;
  /** VLAN identifier where MAC resides */
  vlan: string;
  /** Aging timer in seconds */
  age: string | number;
  /** Flags (e.g., Dynamic, Static, Self, Secure) */
  flags: string;
  /** Dynamic learned flag */
  isDynamic: boolean;
  /** Statically configured flag */
  isStatic: boolean;
  /** Resolved OUI vendor manufacturer (e.g., "Apple", "Extreme", "Cisco") */
  vendor: string;
}

/**
 * Top Running Process Entry:
 * Snapshot of a CPU-consuming task inside EXOS/VOSS kernel.
 */
export interface SwitchProcessEntry {
  /** Operating system Process ID */
  pid: number;
  /** Process daemon name (e.g., "hal", "snmpSubagent", "bgp") */
  name: string;
  /** Instantaneous CPU load percentage */
  cpuPercent: number;
  /** Process state (e.g., "Running", "Sleeping", "Blocked") */
  state: string;
}

/**
 * Real-Time Switch Hardware Health Telemetry:
 * Queried on-demand via Telnet/SSH CLI commands.
 */
export interface SwitchTelemetryData {
  /** Target switch IPv4 address */
  switchIp: string;
  /** Resolved switch hostname */
  hostname: string;
  /** Switch Operating System */
  os: SwitchOS;
  /** Telemetry collection timestamp */
  timestamp: string;
  /** Round-trip query latency in ms */
  rttMs: number;
  /** Current 5-second CPU utilization percentage (0-100) */
  cpuUtilizationPercent: number;
  /** 10-point rolling history for sparkline graphs */
  cpuHistory: Array<{ time: string; cpu: number }>;
  /** Total system RAM utilization percentage */
  memoryUtilizationPercent: number;
  /** Total physical chassis memory in MB */
  memoryTotalMb: number;
  /** Allocated memory in MB */
  memoryUsedMb: number;
  /** Available free memory in MB */
  memoryFreeMb: number;
  /** Core thermal sensor reading in Celsius */
  temperatureCelsius: number;
  /** Temperature converted to Fahrenheit */
  temperatureFahrenheit: number;
  /** Thermal status based on threshold limits */
  temperatureStatus: "Normal" | "Warning" | "Critical";
  /** Shutdown alarm threshold in Celsius */
  tempThresholdCelsius: number;
  /** Overall chassis cooling fan health */
  fanStatus: "OK" | "Warning" | "Failed";
  /** Primary fan tachometer speed in RPM */
  fanRpm: number;
  /** Individual status for each chassis fan tray */
  fans: Array<{ id: string; name: string; rpm: number; status: "OK" | "Warning" | "Failed" }>;
  /** Power supply status and wattage budget */
  powerSupplies: Array<{ id: string; name: string; status: "Online" | "Redundant" | "Offline"; wattage: number }>;
  /** Switch system uptime string */
  uptime: string;
  /** System boot timestamp */
  bootTime?: string;
  /** Top running processes sorted by CPU load */
  topProcesses: SwitchProcessEntry[];
  /** Raw unprocessed CLI responses for diagnostics */
  rawCli: string;
}

/**
 * Result of a Remote Port Bounce Operation:
 * Disables and re-enables a PoE/Ethernet port to power-cycle connected equipment.
 */
export interface PortBounceResult {
  /** Overall success flag */
  success: boolean;
  /** Switch IP where command was executed */
  switchIp: string;
  /** Target port number */
  port: string;
  /** Timestamp of bounce execution */
  timestamp: string;
  /** CLI command sequence executed */
  commands: string[];
  /** Raw output from Telnet/SSH session */
  rawCli: string;
  /** Human-readable status message */
  message: string;
}

/**
 * Frequency presets for automated backup schedules
 */
export type BackupFrequencyPreset = 
  | "hourly" 
  | "every_2h" 
  | "every_4h" 
  | "every_6h" 
  | "every_12h" 
  | "daily" 
  | "twice_daily" 
  | "weekly" 
  | "custom_cron";

/**
 * User-configurable Backup Schedule Settings
 */
export interface BackupScheduleConfig {
  /** Master schedule enabled flag */
  enabled: boolean;
  /** Frequency preset or cron */
  frequency: BackupFrequencyPreset;
  /** Scheduled execution time in GMT/Local (e.g. "02:00") for daily / weekly runs */
  dailyTimeUtc: string;
  /** Second run time for twice daily runs in GMT (e.g. "14:00") */
  twiceDailySecondTimeUtc?: string;
  /** Selected days of week for weekly runs (e.g. ["SUN", "WED"]) */
  weeklyDays?: string[];
  /** Custom 5-part cron expression (e.g. "0 2 * * *") */
  customCron?: string;
  /** Target scope of switches to back up */
  targetScope: "ALL" | "CORE_DISTRIBUTION" | "EDGE_ONLY" | "CUSTOM";
  /** Mandatory save configuration before TFTP/SSH export */
  autoSaveConfig: boolean;
  /** Archival retention period in days */
  retentionDays: number;
  /** Automation trigger engine */
  engine: "systemd" | "cron" | "windows_task" | "python_daemon";
  /** Script to execute */
  scriptName: "BackupSave.py" | "extreme_switch_backup.py";
  /** Optional webhook or email alerting */
  alertOnFailure?: boolean;
}

/**
 * Background Backup Schedule Telemetry:
 * Fed from systemd timer / Windows scheduled task status.
 */
export interface BackupScheduleInfo {
  /** Master schedule enabled flag */
  isEnabled?: boolean;
  /** Timestamp of the last complete scheduled estate run */
  lastRunTimestamp?: string;
  /** Outcome status of the last run */
  lastRunStatus?: "SUCCESS" | "WARNING" | "FAILED" | "IN_PROGRESS" | "IDLE";
  /** Total execution duration formatted as string */
  lastRunDuration?: string;
  /** Total number of switches processed in last run */
  lastRunTotalSwitches?: number;
  /** Number of switches backed up without errors */
  lastRunSuccessCount?: number;
  /** Method used (e.g. "TFTP + Netmiko SSH") */
  lastRunMethod?: string;
  /** ISO timestamp when next run will trigger */
  nextScheduledTimestamp?: string;
  /** Display label for next run (e.g. "Tonight @ 02:00") */
  nextScheduledLabel?: string;
  /** Real-time countdown string (e.g. "in 8h 15m") */
  nextScheduledCountdown?: string;
  /** Frequency of automatic runs (e.g. "Nightly @ 02:00 AM") */
  scheduleFrequency?: string;
  /** Underlying automation engine (e.g. "switch-backup.timer (systemd)") */
  scheduleEngine?: string;
  /** Retention period in days for archival logs */
  scheduleRetentionDays?: number;
  /** Whether pre-backup configuration save is enabled */
  autoSaveConfigEnabled?: boolean;
  /** Active schedule configuration settings */
  config?: BackupScheduleConfig;
}

/**
 * Real-Time Engine Status Data:
 * Polled from status.json to update live progress bars and counters.
 */
export interface LiveStatusData {
  /** Active automation script (e.g. "BackupSave.py") */
  script?: string;
  /** Execution state: RUNNING, COMPLETED, FAILED, or IDLE */
  status?: string;
  /** Run start timestamp */
  started_at?: string;
  /** Last update timestamp */
  updated_at?: string;
  /** Formatted progress string (e.g., "45/222 (20.3%)") */
  progress?: string;
  /** IP address currently being queried */
  current_switch?: string;
  /** Current operation description */
  latest_action?: string;
  /** Summary breakdown metrics */
  counts?: {
    success?: number;
    warning?: number;
    failed?: number;
    skipped?: number;
    hopped?: number;
    total?: number;
  };
  /** Next scheduled run metadata */
  schedule?: BackupScheduleInfo;
  /** Raw text representation for terminal display */
  rawText?: string;
}

/** Target definition for multi-switch batch configuration rollouts */
export interface RolloutSwitchTarget {
  switchId: string;
  hostname: string;
  ip: string;
  os: SwitchOS;
}

/** Result for an individual switch in a batch rollout run */
export interface SwitchRolloutResult {
  switchId: string;
  hostname: string;
  ip: string;
  os: SwitchOS;
  status: "success" | "warning" | "failed" | "skipped";
  executionTimeMs: number;
  commandsExecuted: string[];
  output: string;
  error?: string;
}

/** Batch Rollout Response */
export interface RolloutExecutionResponse {
  success: boolean;
  timestamp: string;
  totalSwitches: number;
  successCount: number;
  failedCount: number;
  commands: string[];
  results: SwitchRolloutResult[];
  rawCliSummary: string;
}

/** Role-Based Access Control (RBAC) user permission roles */
export type UserRole = "network_admin" | "service_desk";

/** Authenticated user session object */
export interface AuthUser {
  username: string;
  fullName: string;
  role: UserRole;
  token?: string;
  loginTime?: string;
}

/** Enterprise Audit Trail Log Entry */
export interface AuditLogItem {
  id: string;
  timestamp: string;
  username: string;
  fullName: string;
  role: UserRole;
  action: string;
  category: "PORT_BOUNCE" | "BACKUP" | "CONFIG_CUSTOMIZE" | "ROLLOUT_CONFIG" | "AUTH" | "DIAGNOSTIC";
  switchIp?: string;
  switchHostname?: string;
  details: string;
  clientIp?: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
}

/** Detected Unmanaged / Rogue Switch on Edge Port */
export interface DetectedMacEntry {
  mac: string;
  vlan: string | number;
  ouiVendor?: string;
  isConsumerOui?: boolean;
  flags?: string;
}

export interface DiscoveredUnmanagedSwitch {
  id: string;
  switchIp: string;
  switchHostname: string;
  port: string;
  macCount: number;
  detectedMacs: DetectedMacEntry[];
  identifiedVendor: string;
  alertLevel: "HIGH" | "MEDIUM" | "LOW";
  detectionReason: string;
  isConsumerOui: boolean;
  consumerMatchReason: string;
  lldpDetails?: {
    systemName?: string;
    systemDesc?: string;
    chassisId?: string;
    portId?: string;
    capabilities?: string[];
  };
  sharingStatus: "Access Port (No LAG)" | "Excluded LAG";
  vlan: string | number;
  recommendedAction: string;
  timestamp: string;
}

export interface UnmanagedDiscoveryResult {
  success: boolean;
  targetSite: string;
  targetSwitches: { ip: string; hostname: string; status: string }[];
  scannedAt: string;
  durationMs: number;
  totalPortsScanned: number;
  highRiskCount: number;
  mediumRiskCount: number;
  flaggedSwitches: DiscoveredUnmanagedSwitch[];
  rawCliOutput: string;
  executionLogs: string[];
}
