# Project Instructions & Context: Extreme Switch Backup & Management Suite

## 📌 Project Overview
This project is an enterprise-grade automated switch backup, configuration management, and port auditing suite designed for Extreme Networks switches (EXOS & VOSS) and expandable to multi-vendor network environments.

---

## 🚀 Saved Application State & Core Features
1. **Zero-Dependency Python Web Portal (`portal_server.py` & `portal_server_ubuntu.py`)**:
   - Built with pure Python standard libraries (`http.server`, `socketserver`, `subprocess`, `json`) — runs natively on any Windows Server or Linux VM without needing Node.js or `npm`.
   - Listens on port 3000 (`http://localhost:3000`).
   - Features **"🚀 Backup All Switches"** and individual **"⚡ Backup"** buttons for every switch in `Switches.txt`.
   - Real-time polling of `status.json` with live execution progress, active switch display, and counter metrics.

2. **Live Execution Tracking (`status.txt` & `status.json`)**:
   - Every script execution updates `status.json` and `status.txt` in real time with progress `[index/total]`, current switch IP being polled, status (RUNNING, COMPLETED, FAILED), and breakdown counters (Success, Warning, Failed, Skipped, Hopped).
   - Includes `Watch-Status.ps1` for local live monitoring in Windows PowerShell.
   - Server backend (`server.ts` or `portal_server.py`) exposes `/api/status`, feeding a live real-time status monitor header on the web UI.

3. **Core Python Automation Scripts**:
   - `BackupSave.py`: Automated configuration backup with mandatory `save configuration` command prior to TFTP/SSH export. Supports CLI arguments `--switch <IP>` for individual backup or `--all` / default for whole fleet.
   - `extreme_switch_backup.py`: Primary switch configuration backup tool with multi-hop jump-box fallback.
   - `port_description_report.py`: Read-only port description audit & uplink detector tool exporting structured reports to Excel (`.xlsx`).

4. **Live Switch Hardware Monitoring & Diagnostics Engine**:
   - Real-time Telnet/SSH health telemetry querying CPU utilization %, 10-point rolling CPU sparkline history, thermal sensor temperatures (°C / °F), chassis fan RPM speeds, memory usage (Used/Free/Total MB), and live process tables.
   - OS-aware command profiles for EXOS (`show switch`, `show memory`, `show process cpu`) and VOSS (`show sys-info`, `show cpu-utilization`, `show processes`).

5. **Live LLDP Neighbor Discovery & Topology Engine**:
   - Real-time LLDP neighbor discovery with interactive **Structured Table**, **Raw CLI Output**, and **Detected Core Uplinks** views.
   - Parses Local Port, Remote System Name, Model Description, Chassis ID, Remote Port ID, Management IP/MAC, Capabilities (WLAN AP, Bridge, Router, Station), VLAN PVID, and PoE Class/Wattage.
   - 1-click JSON topology export for network documentation.

6. **Web Management & Switch Replacement Portal**:
   - React + TypeScript frontend with Tailwind CSS (Node.js/Vite option) and Standalone Python Portal (`portal_server.py` option).
   - **Switch Replacement Hub**: Instant search across switches by Hostname, IP, Model, OS (EXOS/VOSS), MAC, and Uplinks.
   - **Technician Replacement Workspace**: 1-click download of `.xsf` / `.cfg` files, live IP Customizer & Sanitizer (modifies config on the fly for replacement switch IPs), selective section copying (VLANs, Port Descriptions, Management/Gateway), and port audit tables.
   - **Field Tech Cheat Sheets**: Complete console restoration procedures for EXOS (Summit series) and VOSS (VSP Fabric series).
   - **Ubuntu VM Migration Kit**: Production-ready setup guides for internal Ubuntu LTS deployment (`tftpd-hpa`, `systemd` timers for nightly backups, `switch-portal.service`, and Nginx reverse proxy).
   - **Live Operations Runner**: Triggers `BackupSave.py`, `extreme_switch_backup.py`, or `port_description_report.py` with real-time status polling.
   - **Python Scripts & AI Safety Auditor**: In-browser script inspector, 1-click script downloader, clipboard copier, and Gemini AI code analyzer.

---

## 🎯 Next Priority Features to Implement (When Resuming)

### 1. Visual Config Diff & Change Auditing (Side-by-Side Comparison)
- **Side-by-Side Unified Diff Viewer**: Compare the latest configuration against previous backup revisions or a baseline template with colored line highlights (green for additions, red for deletions).
- **Unauthorized Drift Detection**: Flag unapproved changes (e.g., rogue VLAN creation, modified default gateway, or disabled authentication) and alert network engineers immediately.

### 2. Interactive Topology & Uplink Map (Network Graph)
- **LLDP-Driven Dynamic Graph**: Render an interactive SVG/Canvas node graph linking Core VOSS Fabric engines, IDF distribution stacks, and edge access switches based on discovered LLDP neighbors.
- **Port Utilization & Redundancy Warnings**: Graphically highlight single points of failure (switches with only one active uplink) or congested 10G/40G fiber channels.

### 3. VLAN & Subnet Consistency Matrix
- **Fleet-Wide VLAN Mapper**: Cross-reference VLAN IDs across all switches to ensure standard VLANs (e.g., Management, VoIP, Wi-Fi, Security) are consistently tagged across inter-switch uplinks.
- **Port Conflict Detector**: Identify mismatches between neighboring switch ports (e.g., Port 49 tagged for VLAN 100 on Switch A, but untagged or missing on Switch B).
