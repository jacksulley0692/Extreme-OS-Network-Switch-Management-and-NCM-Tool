import React, { useState } from "react";
import { Server, Terminal, Copy, Check, Shield, FileText, Clock, RefreshCw, Cpu, Layers, HardDrive, CheckCircle2 } from "lucide-react";

export function UbuntuMigrationKit() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const steps = [
    { id: 1, title: "1. OS Packages & Python Venv", icon: Terminal },
    { id: 2, title: "2. Linux TFTP Daemon Setup", icon: HardDrive },
    { id: 3, title: "3. Automated Cron / Systemd Timers", icon: Clock },
    { id: 4, title: "4. Web Portal Service (systemd)", icon: Server },
    { id: 5, title: "5. Nginx Reverse Proxy & Security", icon: Shield },
  ];

  return (
    <div id="ubuntu-migration-kit-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Server className="w-4 h-4" />
              <span>Enterprise Linux Migration Kit</span>
            </div>
            <h2 className="text-xl font-bold text-white">Customer VM to Internal Ubuntu Server Migration</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Complete step-by-step production deployment guide requested by your engineering lead. Deploy the Python backup engines, internal Linux TFTP server, and this web portal onto a dedicated internal Ubuntu 22.04 / 24.04 LTS VM.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">Target: Ubuntu 22.04 / 24.04 LTS</span>
          </div>
        </div>
      </div>

      {/* Step Selector Pills */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Step 1: Install System Dependencies & Python Virtual Environment</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set up the clean Python 3 runtime and required network libraries on Ubuntu.
                </p>
              </div>
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">Bash Script</span>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
              <button
                onClick={() => copyToClipboard(`# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Python 3, venv, TFTP daemon, Node.js, and Git
sudo apt install -y python3 python3-pip python3-venv tftpd-hpa nginx git curl

# 3. Create dedicated application user and directory
sudo useradd -m -s /bin/bash netops
sudo mkdir -p /opt/switch-management /var/backups/switches /var/tftp/backups
sudo chown -R netops:netops /opt/switch-management /var/backups/switches /var/tftp/backups

# 4. Clone or copy project files into /opt/switch-management
cd /opt/switch-management

# 5. Initialize Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install netmiko paramiko openpyxl pandas`, "ubuntu-step-1")}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
              >
                {copiedId === "ubuntu-step-1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <div className="text-slate-500"># 1. Update system packages</div>
              <div className="text-slate-200">sudo apt update && sudo apt upgrade -y</div>
              <div className="text-slate-500 mt-2"># 2. Install Python, TFTP daemon, Nginx, Node.js</div>
              <div className="text-slate-200">sudo apt install -y python3 python3-pip python3-venv tftpd-hpa nginx git curl</div>
              <div className="text-slate-500 mt-2"># 3. Create dedicated application service user</div>
              <div className="text-slate-200">sudo useradd -m -s /bin/bash netops</div>
              <div className="text-slate-200">sudo mkdir -p /opt/switch-management /var/backups/switches /var/tftp/backups</div>
              <div className="text-slate-200">sudo chown -R netops:netops /opt/switch-management /var/backups/switches /var/tftp/backups</div>
              <div className="text-slate-500 mt-2"># 4. Set up Python virtual environment</div>
              <div className="text-slate-200">cd /opt/switch-management</div>
              <div className="text-slate-200">python3 -m venv venv</div>
              <div className="text-slate-200">source venv/bin/activate</div>
              <div className="text-slate-200">pip install netmiko paramiko openpyxl pandas</div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Step 2: Configure Linux TFTP Daemon (`tftpd-hpa`)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Allows Extreme switches to upload .xsf / .cfg backups and download configs during replacements.
                </p>
              </div>
              <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-mono">/etc/default/tftpd-hpa</span>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
              <button
                onClick={() => copyToClipboard(`cat << 'EOF' | sudo tee /etc/default/tftpd-hpa
# /etc/default/tftpd-hpa
TFTP_USERNAME="tftp"
TFTP_DIRECTORY="/var/tftp/backups"
TFTP_ADDRESS=":69"
TFTP_OPTIONS="--secure --create --umask 000"
EOF

# Ensure writable permissions for TFTP service
sudo chmod -R 777 /var/tftp/backups
sudo systemctl restart tftpd-hpa
sudo systemctl enable tftpd-hpa`, "ubuntu-step-2")}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
              >
                {copiedId === "ubuntu-step-2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <div className="text-slate-500"># Write tftpd-hpa configuration</div>
              <div className="text-slate-200">cat &lt;&lt; 'EOF' | sudo tee /etc/default/tftpd-hpa</div>
              <div className="text-emerald-300">TFTP_USERNAME="tftp"</div>
              <div className="text-emerald-300">TFTP_DIRECTORY="/var/tftp/backups"</div>
              <div className="text-emerald-300">TFTP_ADDRESS=":69"</div>
              <div className="text-emerald-300">TFTP_OPTIONS="--secure --create --umask 000"</div>
              <div className="text-slate-200">EOF</div>
              <div className="text-slate-500 mt-2"># Enable and start TFTP service</div>
              <div className="text-slate-200">sudo chmod -R 777 /var/tftp/backups</div>
              <div className="text-slate-200">sudo systemctl restart tftpd-hpa</div>
              <div className="text-slate-200">sudo systemctl enable tftpd-hpa</div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Step 3: Automated Weekly Backups (systemd Timer or Cron)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Schedules `BackupSave.py` to run automatically once per week (e.g. every Sunday at 02:00 AM) with zero user input required, while retaining full manual on-demand backups via the Web Portal.
                </p>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">Weekly Automation</span>
            </div>

            {/* Option A: Cron */}
            <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-bold">Option A: Standard Linux Crontab (Recommended & Simplest)</span>
                <button
                  onClick={() => copyToClipboard(`(crontab -l 2>/dev/null; echo "0 2 * * 0 /opt/switch-management/venv/bin/python /opt/switch-management/BackupSave.py >> /var/log/switch-backup-weekly.log 2>&1") | crontab -`, "ubuntu-cron")}
                  className="text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700 flex items-center gap-1 text-[11px]"
                >
                  {copiedId === "ubuntu-cron" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Cron Command</span>
                </button>
              </div>
              <div className="text-slate-500"># Edit crontab for user netops (or root):</div>
              <div className="text-slate-200">crontab -e</div>
              <div className="text-slate-500 mt-2"># Add this single line (Runs every Sunday at 02:00 AM):</div>
              <div className="text-emerald-300 font-bold">0 2 * * 0 /opt/switch-management/venv/bin/python /opt/switch-management/BackupSave.py &gt;&gt; /var/log/switch-backup-weekly.log 2&gt;&amp;1</div>
            </div>

            {/* Option B: systemd Timer */}
            <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-indigo-400 font-bold">Option B: Enterprise systemd Timer</span>
                <button
                  onClick={() => copyToClipboard(`cat << 'EOF' | sudo tee /etc/systemd/system/extreme-backup.service
[Unit]
Description=Extreme Switch Automated Weekly Backup Engine
After=network.target

[Service]
Type=oneshot
User=netops
WorkingDirectory=/opt/switch-management
ExecStart=/opt/switch-management/venv/bin/python /opt/switch-management/BackupSave.py

[Install]
WantedBy=multi-user.target
EOF

cat << 'EOF' | sudo tee /etc/systemd/system/extreme-backup.timer
[Unit]
Description=Run Extreme Switch Backup Weekly Every Sunday at 02:00 AM

[Timer]
OnCalendar=Sun *-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now extreme-backup.timer`, "ubuntu-step-3")}
                  className="text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700 flex items-center gap-1 text-[11px]"
                >
                  {copiedId === "ubuntu-step-3" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy systemd Setup</span>
                </button>
              </div>
              <div className="text-slate-500"># 1. Create systemd service & weekly Sunday timer</div>
              <div className="text-slate-200">cat &lt;&lt; 'EOF' | sudo tee /etc/systemd/system/extreme-backup.timer</div>
              <div className="text-slate-300">[Timer]</div>
              <div className="text-emerald-300 font-bold">OnCalendar=Sun *-*-* 02:00:00</div>
              <div className="text-slate-300">Persistent=true</div>
              <div className="text-slate-200">EOF</div>
              <div className="text-slate-500 mt-2"># 2. Enable the timer:</div>
              <div className="text-slate-200">sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now extreme-backup.timer</div>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-lg text-xs text-indigo-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Dual Operation:</strong> The weekly automated cron/timer runs completely headless in the background, updating <code>status.json</code> and logs. The <strong>"🚀 Backup All Switches"</strong> and <strong>"⚡ Backup"</strong> buttons on the Web Portal remain active 24/7 for immediate on-demand backups whenever needed.</span>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Step 4: Run Switch Management Web Portal as a systemd Service</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Keeps the standalone Python Web Portal (<code className="text-emerald-400">portal_server_ubuntu.py</code>) running 24/7 in the background with auto-restart on reboot.
                </p>
              </div>
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">switch-portal.service</span>
            </div>

            {/* Option A: Pure Python portal_server_ubuntu.py */}
            <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-bold">Recommended: Pure Python Portal (`portal_server_ubuntu.py`)</span>
                <button
                  onClick={() => copyToClipboard(`cat << 'EOF' | sudo tee /etc/systemd/system/switch-portal.service
[Unit]
Description=Extreme Switch Management & Backup Web Portal (Ubuntu Edition)
After=network.target

[Service]
Type=simple
User=netops
WorkingDirectory=/opt/switch-management
ExecStart=/usr/bin/python3 /opt/switch-management/portal_server_ubuntu.py
Restart=always
RestartSec=5
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now switch-portal.service`, "ubuntu-step-4-py")}
                  className="text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700 flex items-center gap-1 text-[11px]"
                >
                  {copiedId === "ubuntu-step-4-py" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Service File</span>
                </button>
              </div>
              <div className="text-slate-200">cat &lt;&lt; 'EOF' | sudo tee /etc/systemd/system/switch-portal.service</div>
              <div className="text-slate-300">[Unit]</div>
              <div className="text-slate-300">Description=Extreme Switch Management & Backup Web Portal (Ubuntu Edition)</div>
              <div className="text-slate-300">[Service]</div>
              <div className="text-slate-300">User=netops</div>
              <div className="text-slate-300">WorkingDirectory=/opt/switch-management</div>
              <div className="text-emerald-300 font-bold">ExecStart=/usr/bin/python3 /opt/switch-management/portal_server_ubuntu.py</div>
              <div className="text-slate-300">Restart=always</div>
              <div className="text-slate-300">RestartSec=5</div>
              <div className="text-slate-200">EOF</div>
              <div className="text-slate-500 mt-2"># Enable and start on boot:</div>
              <div className="text-slate-200">sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now switch-portal.service</div>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Step 5: Configure Nginx Reverse Proxy for Internal Technicians</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Allows technicians to access the portal at <code className="text-indigo-300">http://switches.internal</code> or <code className="text-indigo-300">http://&lt;ubuntu-ip&gt;</code> without port numbers.
                </p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">/etc/nginx/sites-available/</span>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 relative">
              <button
                onClick={() => copyToClipboard(`cat << 'EOF' | sudo tee /etc/nginx/sites-available/switch-management
server {
    listen 80;
    server_name _;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/switch-management /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx`, "ubuntu-step-5")}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800/80 border border-slate-700"
              >
                {copiedId === "ubuntu-step-5" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <div className="text-slate-200">cat &lt;&lt; 'EOF' | sudo tee /etc/nginx/sites-available/switch-management</div>
              <div className="text-slate-300">server &#123;</div>
              <div className="text-slate-300">    listen 80;</div>
              <div className="text-slate-300">    server_name _;</div>
              <div className="text-slate-300">    location / &#123;</div>
              <div className="text-slate-300">        proxy_pass http://127.0.0.1:3000;</div>
              <div className="text-slate-300">    &#125;</div>
              <div className="text-slate-300">&#125;</div>
              <div className="text-slate-200">EOF</div>
              <div className="text-slate-500 mt-2"># Enable site and reload Nginx</div>
              <div className="text-slate-200">sudo ln -sf /etc/nginx/sites-available/switch-management /etc/nginx/sites-enabled/</div>
              <div className="text-slate-200">sudo nginx -t && sudo systemctl reload nginx</div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison: Customer VM vs Internal Ubuntu VM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Architecture Comparison: Customer Windows VM vs. Internal Ubuntu Server
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Aspect</th>
                <th className="py-2.5 px-3 font-semibold text-rose-400">Customer Temporary VM</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-400">Internal Dedicated Ubuntu Server</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-200">Data Sovereignty & Access</td>
                <td className="py-2.5 px-3 text-slate-400">Locked to customer environment / jumpbox</td>
                <td className="py-2.5 px-3 text-emerald-300">Owned internally by your engineering team</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-200">Worker Config Grab Time</td>
                <td className="py-2.5 px-3 text-slate-400">Must RDP into customer VM, find folder</td>
                <td className="py-2.5 px-3 text-emerald-300">Instant web UI search & 1-click download</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-200">TFTP Reliability</td>
                <td className="py-2.5 px-3 text-slate-400">Windows TFTP GUI tools prone to sleep/freeze</td>
                <td className="py-2.5 px-3 text-emerald-300">Headless Linux kernel `tftpd-hpa` daemon</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-200">Automated Scheduling</td>
                <td className="py-2.5 px-3 text-slate-400">Windows Task Scheduler with manual log files</td>
                <td className="py-2.5 px-3 text-emerald-300">Standard Linux `systemd` timers with syslog</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
