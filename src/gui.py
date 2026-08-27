# -*- coding: utf-8 -*-
"""
===============================================================================
src/gui.py - Extreme-OS Rogue & Unmanaged Switch Discovery GUI Panel
===============================================================================

Features:
  - "Discover Unmanaged Switches" action button integrated on the site view panel.
  - Asynchronous background worker thread (threading.Thread) with thread-safe Queue
    so network scanning never freezes the GUI.
  - Tabular results display (Treeview) showing:
      • Severity (High/Medium Alert)
      • Switch Hostname & IP
      • Port Number
      • Number of Learned MACs
      • Identified Consumer Vendor (Netgear, TP-Link, D-Link, Linksys, etc.)
      • Detection Reason & LLDP Signature
      • Remediation Action
  - Real-time Console Log text area with auto-scrolling execution telemetry.
  - Pop-up Dialog Inspector with full MAC table and OUI breakdowns.
  - Hardcoded test target configured for "Northwood" site switches.
===============================================================================
"""

import sys
import os
import json
import threading
import queue
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

try:
    import tkinter as tk
    from tkinter import ttk, messagebox, scrolledtext, filedialog
    HAS_TKINTER = True
except ImportError:
    HAS_TKINTER = False

# Import core discovery engine
from switch_logic import run_unmanaged_switch_discovery, NORTHWOOD_TARGET_SWITCHES

class UnmanagedSwitchDiscoveryGui:
    """
    Tkinter-based Site Discovery Panel with Asynchronous Worker Threading.
    """
    def __init__(self, master=None, site_name: str = "Northwood"):
        if not HAS_TKINTER:
            print("[WARN] Tkinter is not installed in this environment. Use Web GUI or CLI mode.")
            return

        self.root = master or tk.Tk()
        self.site_name = site_name
        self.root.title(f"Extreme-OS Network Management - {self.site_name} Site Discovery")
        self.root.geometry("1100x720")
        self.root.minsize(850, 550)

        # Apply dark theme styling
        self.bg_dark = "#0f172a"      # slate-900
        self.bg_panel = "#1e293b"     # slate-800
        self.fg_text = "#f8fafc"      # slate-50
        self.accent_indigo = "#6366f1"# indigo-500
        self.accent_red = "#ef4444"   # red-500
        self.accent_amber = "#f59e0b" # amber-500
        self.accent_green = "#10b981" # emerald-500

        self.root.configure(bg=self.bg_dark)

        # Task queue for thread-safe UI updates
        self.msg_queue = queue.Queue()
        self.is_scanning = False
        self.current_results: Optional[Dict[str, Any]] = None

        self._build_ui()
        self._poll_queue()

    def _build_ui(self):
        # 1. Top Header Banner
        header_frame = tk.Frame(self.root, bg=self.bg_panel, padx=16, pady=12)
        header_frame.pack(fill=tk.X, padx=12, pady=(12, 6))

        title_label = tk.Label(
            header_frame,
            text=f"🏢 Site Management: {self.site_name.upper()} ESTATE",
            font=("Helvetica", 14, "bold"),
            fg=self.fg_text,
            bg=self.bg_panel
        )
        title_label.pack(side=tk.LEFT)

        test_badge = tk.Label(
            header_frame,
            text="[Hardcoded Test Target: Northwood Core & Distribution]",
            font=("Courier", 10, "bold"),
            fg="#a5b4fc",
            bg="#312e81",
            padx=8,
            pady=3
        )
        test_badge.pack(side=tk.LEFT, padx=12)

        # Primary Action Button: "Discover Unmanaged Switches"
        self.btn_discover = tk.Button(
            header_frame,
            text="🔍 Discover Unmanaged Switches",
            font=("Helvetica", 11, "bold"),
            bg=self.accent_indigo,
            fg="white",
            activebackground="#4f46e5",
            activeforeground="white",
            padx=14,
            pady=6,
            relief=tk.FLAT,
            cursor="hand2",
            command=self.start_discovery_async
        )
        self.btn_discover.pack(side=tk.RIGHT)

        # 2. Metric Counters Bar
        self.stats_frame = tk.Frame(self.root, bg=self.bg_dark, padx=12, pady=6)
        self.stats_frame.pack(fill=tk.X)

        self.lbl_status = tk.Label(
            self.stats_frame,
            text="Ready. Click 'Discover Unmanaged Switches' to scan edge ports for rogue hubs.",
            font=("Helvetica", 10),
            fg="#94a3b8",
            bg=self.bg_dark
        )
        self.lbl_status.pack(side=tk.LEFT)

        self.lbl_stats = tk.Label(
            self.stats_frame,
            text="High Alerts: 0 | Medium Alerts: 0 | Scanned Ports: 0",
            font=("Courier", 10, "bold"),
            fg="#e2e8f0",
            bg=self.bg_dark
        )
        self.lbl_stats.pack(side=tk.RIGHT)

        # Progress bar (Indeterminate during background scan)
        self.progress = ttk.Progressbar(self.root, mode="indeterminate", length=400)

        # 3. Main Split Notebook (Tabs: Tabular Findings | Execution Console | Raw CLI)
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=12, pady=6)

        # Tab 1: Tabular Findings
        tab_table = tk.Frame(self.notebook, bg=self.bg_panel)
        self.notebook.add(tab_table, text="  📊 Discovered Unmanaged Switches  ")

        # Treeview for tabular output
        columns = ("alert", "switch", "port", "mac_count", "vendor", "reason", "action")
        self.tree = ttk.Treeview(tab_table, columns=columns, show="headings", selectmode="browse")

        self.tree.heading("alert", text="Severity Alert")
        self.tree.heading("switch", text="Switch IP / Hostname")
        self.tree.heading("port", text="Port")
        self.tree.heading("mac_count", text="MACs")
        self.tree.heading("vendor", text="Identified Vendor")
        self.tree.heading("reason", text="Detection Reason / Signature")
        self.tree.heading("action", text="Recommended Remediation")

        self.tree.column("alert", width=120, anchor=tk.CENTER)
        self.tree.column("switch", width=180, anchor=tk.W)
        self.tree.column("port", width=70, anchor=tk.CENTER)
        self.tree.column("mac_count", width=60, anchor=tk.CENTER)
        self.tree.column("vendor", width=140, anchor=tk.W)
        self.tree.column("reason", width=260, anchor=tk.W)
        self.tree.column("action", width=220, anchor=tk.W)

        tree_scroll_y = ttk.Scrollbar(tab_table, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=tree_scroll_y.set)

        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=8, pady=8)
        tree_scroll_y.pack(side=tk.RIGHT, fill=tk.Y, pady=8)

        self.tree.bind("<Double-1>", self._on_row_double_click)

        # Tab 2: Execution Console Logs
        tab_console = tk.Frame(self.notebook, bg=self.bg_panel)
        self.notebook.add(tab_console, text="  📜 Live Console Output  ")

        self.txt_console = scrolledtext.ScrolledText(
            tab_console,
            wrap=tk.WORD,
            bg="#020617",
            fg="#38bdf8",
            insertbackground="white",
            font=("Courier", 9)
        )
        self.txt_console.pack(fill=tk.BOTH, expand=True, padx=8, pady=8)

        # Tab 3: Raw Extreme-OS CLI Telemetry
        tab_raw = tk.Frame(self.notebook, bg=self.bg_panel)
        self.notebook.add(tab_raw, text="  🖥️ Raw Extreme-OS CLI Dump  ")

        self.txt_raw = scrolledtext.ScrolledText(
            tab_raw,
            wrap=tk.NONE,
            bg="#020617",
            fg="#4ade80",
            insertbackground="white",
            font=("Courier", 9)
        )
        self.txt_raw.pack(fill=tk.BOTH, expand=True, padx=8, pady=8)

        # 4. Bottom Footer Toolbar
        footer_frame = tk.Frame(self.root, bg=self.bg_dark, padx=12, pady=8)
        footer_frame.pack(fill=tk.X)

        btn_inspect = tk.Button(
            footer_frame,
            text="🔎 Inspect Selected Port Details",
            bg="#334155",
            fg="white",
            padx=10,
            pady=4,
            relief=tk.FLAT,
            command=self._inspect_selected
        )
        btn_inspect.pack(side=tk.LEFT, padx=4)

        btn_export = tk.Button(
            footer_frame,
            text="💾 Export Findings (JSON)",
            bg="#334155",
            fg="white",
            padx=10,
            pady=4,
            relief=tk.FLAT,
            command=self._export_json
        )
        btn_export.pack(side=tk.LEFT, padx=4)

        lbl_hint = tk.Label(
            footer_frame,
            text="Tip: Double-click any row to view individual MAC addresses, OUIs, and LLDP frame details.",
            font=("Helvetica", 9, "italic"),
            fg="#64748b",
            bg=self.bg_dark
        )
        lbl_hint.pack(side=tk.RIGHT)

    def start_discovery_async(self):
        """
        Launches unmanaged switch discovery in an asynchronous background worker thread.
        Prevents freezing or locking up the Tkinter main window.
        """
        if self.is_scanning:
            messagebox.showinfo("Scan Running", "Discovery scan is already in progress. Please wait.")
            return

        self.is_scanning = True
        self.btn_discover.config(state=tk.DISABLED, text="⏳ Scanning Northwood Switches...")
        self.lbl_status.config(text="Connecting to Extreme-OS switches via Netmiko / Telnet / SSH...", fg="#38bdf8")
        self.progress.pack(fill=tk.X, padx=12, pady=(0, 4))
        self.progress.start(10)

        # Clear previous findings
        for item in self.tree.get_children():
            self.tree.delete(item)
        self.txt_console.delete("1.0", tk.END)
        self.txt_raw.delete("1.0", tk.END)

        # Spawn non-blocking background worker thread
        worker_thread = threading.Thread(
            target=self._worker_run_discovery,
            daemon=True,
            name="UnmanagedDiscoveryWorker"
        )
        worker_thread.start()

    def _worker_run_discovery(self):
        """
        Background worker task running in separate thread.
        """
        try:
            # Force target to Northwood site switches as per requirement
            res = run_unmanaged_switch_discovery(
                target_site="Northwood",
                switch_list=NORTHWOOD_TARGET_SWITCHES,
                use_live_netmiko=True
            )
            self.msg_queue.put(("SUCCESS", res))
        except Exception as e:
            self.msg_queue.put(("ERROR", str(e)))

    def _poll_queue(self):
        """
        Thread-safe queue poller executed by the Tkinter mainloop.
        """
        try:
            while True:
                msg_type, payload = self.msg_queue.get_nowait()
                if msg_type == "SUCCESS":
                    self._handle_discovery_success(payload)
                elif msg_type == "ERROR":
                    self._handle_discovery_error(payload)
        except queue.Empty:
            pass
        finally:
            if HAS_TKINTER:
                self.root.after(100, self._poll_queue)

    def _handle_discovery_success(self, res: Dict[str, Any]):
        """
        Updates UI with completed discovery findings.
        """
        self.is_scanning = False
        self.current_results = res
        self.progress.stop()
        self.progress.pack_forget()
        self.btn_discover.config(state=tk.NORMAL, text="🔍 Discover Unmanaged Switches")

        # 1. Update Logs
        for line in res.get("executionLogs", []):
            self.txt_console.insert(tk.END, line + "\n")
        self.txt_console.see(tk.END)

        # 2. Update Raw CLI
        self.txt_raw.insert(tk.END, res.get("rawCliOutput", ""))

        # 3. Update Table
        flagged = res.get("flaggedSwitches", [])
        for item in flagged:
            alert = f"🚨 {item['alertLevel']}" if item["alertLevel"] == "HIGH" else f"⚠️ {item['alertLevel']}"
            sw_label = f"{item['switchHostname']} ({item['switchIp']})"
            self.tree.insert(
                "",
                tk.END,
                values=(
                    alert,
                    sw_label,
                    item["port"],
                    item["macCount"],
                    item["identifiedVendor"],
                    item["detectionReason"],
                    item["recommendedAction"]
                ),
                tags=(item["alertLevel"],)
            )

        # Tag colors
        self.tree.tag_configure("HIGH", foreground="#f87171")
        self.tree.tag_configure("MEDIUM", foreground="#fcd34d")

        # 4. Update Header Metrics
        high_cnt = res.get("highRiskCount", 0)
        med_cnt = res.get("mediumRiskCount", 0)
        ports_cnt = res.get("totalPortsScanned", 0)
        dur = res.get("durationMs", 0)

        self.lbl_stats.config(
            text=f"High Alerts: {high_cnt} | Medium Alerts: {med_cnt} | Ports Audited: {ports_cnt} ({dur}ms)"
        )
        self.lbl_status.config(
            text=f"Scan Complete for Northwood. Found {len(flagged)} suspect multi-MAC ports.",
            fg="#4ade80"
        )

        # Show alert dialog if high-risk rogue switches are caught
        if high_cnt > 0:
            messagebox.showwarning(
                "Rogue Switches Detected",
                f"Discovery Engine flagged {high_cnt} HIGH PROBABILITY consumer switch(es) on Northwood edge ports!\n\n"
                f"Check the findings table to inspect connected MAC addresses and isolate rogue devices."
            )

    def _handle_discovery_error(self, err_msg: str):
        self.is_scanning = False
        self.progress.stop()
        self.progress.pack_forget()
        self.btn_discover.config(state=tk.NORMAL, text="🔍 Discover Unmanaged Switches")
        self.lbl_status.config(text=f"Discovery Error: {err_msg}", fg="#f87171")
        messagebox.showerror("Discovery Failed", f"An error occurred while scanning switches:\n{err_msg}")

    def _on_row_double_click(self, event):
        self._inspect_selected()

    def _inspect_selected(self):
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showinfo("Select Port", "Please select a row in the table to inspect details.")
            return

        values = self.tree.item(selected_item[0], "values")
        if not values or not self.current_results:
            return

        port_str = values[2]
        # Match from results
        match = None
        for item in self.current_results.get("flaggedSwitches", []):
            if item["port"] == port_str:
                match = item
                break

        if not match:
            return

        # Pop-up detail dialog
        dialog = tk.Toplevel(self.root)
        dialog.title(f"Port Inspector - {match['switchHostname']} (Port {match['port']})")
        dialog.geometry("700x550")
        dialog.configure(bg="#0f172a")

        header = tk.Label(
            dialog,
            text=f"🔍 Port {match['port']} Rogue Switch Telemetry",
            font=("Helvetica", 12, "bold"),
            fg="#f8fafc",
            bg="#0f172a",
            pady=10
        )
        header.pack()

        info_frame = tk.Frame(dialog, bg="#1e293b", padx=12, pady=10)
        info_frame.pack(fill=tk.X, padx=12, pady=6)

        tk.Label(info_frame, text=f"Switch: {match['switchHostname']} ({match['switchIp']})", font=("Helvetica", 10, "bold"), fg="white", bg="#1e293b").pack(anchor=tk.W)
        tk.Label(info_frame, text=f"Severity: {match['alertLevel']} PROBABILITY ALERT", font=("Helvetica", 10, "bold"), fg="#f87171" if match['alertLevel']=="HIGH" else "#fcd34d", bg="#1e293b").pack(anchor=tk.W)
        tk.Label(info_frame, text=f"Identified Vendor: {match['identifiedVendor']}", font=("Helvetica", 10), fg="#38bdf8", bg="#1e293b").pack(anchor=tk.W)
        tk.Label(info_frame, text=f"Detection Reason: {match['detectionReason']}", font=("Helvetica", 9), fg="#94a3b8", bg="#1e293b").pack(anchor=tk.W)
        tk.Label(info_frame, text=f"LLDP Advertised: {match['lldpDetails'].get('systemName', 'None')} ({match['lldpDetails'].get('systemDesc', 'N/A')})", font=("Helvetica", 9), fg="#cbd5e1", bg="#1e293b").pack(anchor=tk.W)

        # MAC breakdown table
        mac_label = tk.Label(dialog, text=f"Active Learned MACs ({match['macCount']}):", font=("Helvetica", 10, "bold"), fg="white", bg="#0f172a")
        mac_label.pack(anchor=tk.W, padx=14, pady=(8, 2))

        mac_text = scrolledtext.ScrolledText(dialog, wrap=tk.WORD, height=10, bg="#020617", fg="#4ade80", font=("Courier", 9))
        mac_text.pack(fill=tk.BOTH, expand=True, padx=12, pady=4)

        for m in match.get("detectedMacs", []):
            oui_info = f"[{m.get('ouiVendor')}] (Consumer OUI Match)" if m.get("isConsumerOui") else f"[{m.get('ouiVendor') or 'Unknown OUI'}]"
            mac_text.insert(tk.END, f"  • MAC: {m['mac']:<18} | VLAN: {m['vlan']:<15} | Vendor: {oui_info}\n")

        tk.Button(dialog, text="Close", command=dialog.destroy, bg="#475569", fg="white", padx=12, pady=4).pack(pady=10)

    def _export_json(self):
        if not self.current_results:
            messagebox.showinfo("No Data", "Run a discovery scan first before exporting.")
            return

        file_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json")],
            initialfile=f"unmanaged_switches_northwood_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )
        if file_path:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(self.current_results, f, indent=2)
            messagebox.showinfo("Export Saved", f"Discovery findings saved to:\n{file_path}")

    def run(self):
        if HAS_TKINTER:
            self.root.mainloop()


if __name__ == "__main__":
    app = UnmanagedSwitchDiscoveryGui(site_name="Northwood")
    app.run()
