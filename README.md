# Extreme Switch Backup & Management Suite

Enterprise-grade automated configuration backup, port description auditor, and web-based switch replacement portal for **Extreme Networks (EXOS & VOSS)**.

---

## ⚡ Quick Start: Standalone Web Portal (Zero-Dependencies)

No Node.js or `npm` required. Uses standard Python 3:

```powershell
# 1. Navigate to your backup folder
cd C:\backup

# 2. Start the web portal
python portal_server.py
```

Then open your browser to **`http://localhost:3000`**.

### What you get on the portal:
- **🚀 Backup All Switches**: Triggers `BackupSave.py` across all switches in `Switches.txt`.
- **⚡ Individual Switch Backup**: Dedicated backup buttons for each switch card.
- **Live Telemetry Header**: Real-time progress bar, active switch being polled, and success/warning/failed counters via `status.json`.

---

## 📁 Key Files & Scripts

| File | Description |
| :--- | :--- |
| **`portal_server_ubuntu.py`** | **Ubuntu 64-bit Server Edition**: Standalone Python web portal with built-in background weekly auto-scheduler (Sunday 02:00 AM) + 24/7 on-demand backup buttons. |
| **`portal_server.py`** | Standalone Python HTTP server & web UI controller (port 3000) for Windows / Linux. |
| **`BackupSave.py`** | Extreme switch backup engine with mandatory `save configuration` prior to TFTP/SSH export. |
| **`Switches.txt`** | Target switch IP list (one per line). |
| **`status.json`** | Real-time machine-readable execution telemetry for web UI & monitoring. |
| **`status.txt`** | Human-readable progress log. |
| **`Watch-Status.ps1`** | Live console watcher for PowerShell. |
| **`extreme_switch_backup.py`** | Backup script with jump-box hop fallback. |
| **`port_description_report.py`** | Port audit and uplink detection tool (exports to Excel `.xlsx`). |

---

## 🐧 Ubuntu 64-bit Server VM Deployment & Weekly Automation

The scripts and web portal run natively on **Ubuntu 22.04 / 24.04 LTS (64-bit)** with zero code changes.

### 1. Install Ubuntu Packages & Dependencies
```bash
sudo apt update && sudo apt install -y python3 python3-pip python3-venv tftpd-hpa git
mkdir -p /opt/switch-management /var/tftp/backups
sudo chmod -R 777 /var/tftp/backups

# Setup virtual environment
cd /opt/switch-management
python3 -m venv venv
source venv/bin/activate
pip install netmiko paramiko openpyxl pandas
```

### 2. Automated Weekly Backup (Zero User Input)
To run the backup for all switches automatically once per week (every Sunday at 02:00 AM):

```bash
# Add weekly cron entry:
(crontab -l 2>/dev/null; echo "0 2 * * 0 /opt/switch-management/venv/bin/python /opt/switch-management/BackupSave.py >> /var/log/switch-backup-weekly.log 2>&1") | crontab -
```

### 3. Run Standalone Web Portal on Ubuntu:
```bash
# Direct run:
python3 portal_server.py

# Or as a background systemd service:
# Browse the "Ubuntu VM Migration Kit" tab in the web UI for 1-click systemd & Nginx setup guides!
```
*Note: The **"🚀 Backup All Switches"** and **"⚡ Backup"** buttons remain active 24/7 on the Web Portal alongside the automated weekly cron schedule for on-demand manual triggers.*

---

## 💻 Running via Command Line (PowerShell)

### Single Switch Backup:
```powershell
python BackupSave.py --switch 10.36.226.11
```

### Full Fleet Backup:
```powershell
python BackupSave.py
```

### Live Status Watcher:
```powershell
.\Watch-Status.ps1
```
