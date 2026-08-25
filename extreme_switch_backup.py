# -*- coding: utf-8 -*-
import socket
import logging
import csv
import json
import subprocess
import configparser
import ipaddress
import time
from datetime import datetime
from pathlib import Path
from netmiko import ConnectHandler, NetmikoTimeoutException, NetmikoAuthenticationException


# =========================
# PATHS
# =========================

SCRIPT_DIR = Path(__file__).resolve().parent

SWITCH_CANDIDATES = [
    SCRIPT_DIR / "Switches.txt",
    SCRIPT_DIR / "switches.txt",
    SCRIPT_DIR / "BackupScriptFiles" / "Switches.txt",
    SCRIPT_DIR / "BackupScriptFiles" / "switches.txt",
    SCRIPT_DIR.parent / "BackupScriptFiles" / "Switches.txt",
    SCRIPT_DIR.parent / "BackupScriptFiles" / "switches.txt",
    Path("/opt/switch-backup/BackupScriptFiles/Switches.txt"),
    Path("/opt/switch-backup/BackupScriptFiles/switches.txt"),
    Path("/opt/switch-backup/Switches.txt"),
    Path("/opt/switch-backup/switches.txt")
]

SWITCH_FILE = next((p for p in SWITCH_CANDIDATES if p.exists()), SCRIPT_DIR / "Switches.txt")

CONFIG_CANDIDATES = [
    SCRIPT_DIR / "conf.ini",
    SCRIPT_DIR / "config.ini",
    SCRIPT_DIR / "BackupScriptFiles" / "conf.ini",
    SCRIPT_DIR / "BackupScriptFiles" / "config.ini",
    SCRIPT_DIR.parent / "BackupScriptFiles" / "conf.ini",
    SCRIPT_DIR.parent / "BackupScriptFiles" / "config.ini",
    Path("/opt/switch-backup/BackupScriptFiles/conf.ini"),
    Path("/opt/switch-backup/BackupScriptFiles/config.ini"),
    Path("/opt/switch-backup/conf.ini"),
    Path("/opt/switch-backup/config.ini")
]

CONFIG_FILE = next((p for p in CONFIG_CANDIDATES if p.exists()), SCRIPT_DIR / "config.ini")

LOG_FOLDER = SCRIPT_DIR / "logs"
REPORT_FOLDER = SCRIPT_DIR / "reports"
STATUS_JSON = SCRIPT_DIR / "status.json"
STATUS_TXT = SCRIPT_DIR / "status.txt"

LOG_FOLDER.mkdir(exist_ok=True)
REPORT_FOLDER.mkdir(exist_ok=True)


def update_status(script_name, status, current_switch="", index=0, total=0, action="", counts=None, started_at=None):
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pct = round((index / total) * 100, 1) if total > 0 else 0
    progress_str = f"{index}/{total} ({pct}%)" if total > 0 else "0%"

    data = {
        "script": script_name,
        "status": status,
        "started_at": started_at or now_str,
        "updated_at": now_str,
        "progress": progress_str,
        "current_switch": current_switch,
        "latest_action": action,
        "counts": counts or {}
    }

    try:
        with open(STATUS_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        txt_content = (
            "==================================================\n"
            f" Script:         {script_name}\n"
            f" Status:         {status}\n"
            f" Started At:     {data['started_at']}\n"
            f" Updated At:     {data['updated_at']}\n"
            f" Progress:       {progress_str}\n"
            f" Current Switch: {current_switch or 'N/A'}\n"
            f" Latest Action:  {action or 'N/A'}\n"
        )
        if counts:
            txt_content += " Counts:         " + ", ".join(f"{k}={v}" for k, v in counts.items()) + "\n"
        txt_content += "==================================================\n"

        with open(STATUS_TXT, "w", encoding="utf-8") as f:
            f.write(txt_content)
    except Exception as e:
        logging.debug(f"Failed to write status file: {e}")


# =========================
# LOAD CONFIG
# =========================

config = configparser.ConfigParser()

if not CONFIG_FILE.exists():
    raise FileNotFoundError(f"Missing config file: {CONFIG_FILE}. Looked in: {[str(p) for p in CONFIG_CANDIDATES]}")

config.read(CONFIG_FILE)

def get_cfg(section, key, fallback=None):
    if config.has_section(section) and config.has_option(section, key):
        return config.get(section, key)
    for s in [section.lower(), section.capitalize(), section.upper(), "DEFAULT", "default", "settings", "Settings", "credentials", "backup", "connection"]:
        if config.has_section(s) and config.has_option(s, key):
            return config.get(s, key)
    if config.has_option("DEFAULT", key):
        return config.get("DEFAULT", key)
    return fallback

USERNAME = get_cfg("credentials", "username", fallback="admin")
PASSWORD = get_cfg("credentials", "password", fallback="")

TFTP_SERVER = get_cfg("backup", "tftp_server", fallback="")
TFTP_VR = get_cfg("backup", "tftp_vr", fallback="VR-Default")
TFTP_ROOT = Path(get_cfg("backup", "tftp_root", fallback="") or "").expanduser()

METHOD = (get_cfg("connection", "method", fallback="telnet") or "telnet").lower()
try:
    TIMEOUT = int(get_cfg("connection", "timeout", fallback="20") or "20")
except Exception:
    TIMEOUT = 20

if METHOD not in ["telnet", "ssh"]:
    raise ValueError("connection method must be either 'telnet' or 'ssh'")

try:
    ping_val = get_cfg("connection", "ping_check", fallback="false")
    PING_CHECK = str(ping_val).lower() in ["true", "1", "yes", "on"]
except Exception:
    PING_CHECK = False

# --- Hop (second-hop telnet) settings ---
HOP_ENABLED = config.getboolean("hop", "enabled", fallback=True)
HOP_SUBNET_PREFIX = config.getint("hop", "subnet_prefix", fallback=24)
HOP_MGMT_VR = config.get("hop", "mgmt_vr", fallback=TFTP_VR)
HOP_TIMEOUT = config.getint("hop", "timeout", fallback=25)
RETRY_DELAY = config.getint("backup", "retry_delay", fallback=5)
VERIFY_WAIT = config.getint("backup", "verify_wait", fallback=30)

# CLI patterns for ExtremeXOS
LOGIN_PATTERN = r"login:\s*$"
PASSWORD_PATTERN = r"assword:\s*$"
CLI_PROMPT_PATTERN = r"\.\d+\s*#\s*$"


# =========================
# LOGGING
# =========================

run_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
today = datetime.now().strftime("%Y-%m-%d")

log_file = LOG_FOLDER / f"switch_backup_{today}.log"
csv_report = REPORT_FOLDER / f"switch_backup_report_{run_timestamp}.csv"

logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

console = logging.StreamHandler()
console.setLevel(logging.INFO)
console.setFormatter(logging.Formatter("%(message)s"))
logging.getLogger().addHandler(console)


# =========================
# HELPER FUNCTIONS
# =========================

def read_switches(filename):
    try:
        with open(filename, "r") as file:
            return [
                line.strip()
                for line in file
                if line.strip() and not line.strip().startswith("#")
            ]
    except FileNotFoundError:
        logging.error(f"Switches.txt not found here: {filename}")
        return []


def ping_host(ip):
    try:
        cmd = ["ping", "-n", "1", "-w", "1000", ip] if os.name == 'nt' else ["ping", "-c", "1", "-W", "1", ip]
        result = subprocess.run(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return result.returncode == 0
    except Exception:
        return False


def draw_progress_bar(current, total, bar_length=25):
    percent = float(current) / total
    filled = int(round(percent * bar_length))
    bar = "#" * filled + "-" * (bar_length - filled)
    return f"[{bar}] {int(round(percent * 100))}% ({current}/{total})"


def tcp_port_open(ip, port):
    try:
        with socket.create_connection((ip, port), timeout=3):
            return True
    except Exception:
        return False


def get_hostname(output, fallback_ip):
    for line in output.splitlines():
        line = line.strip()

        if line.lower().startswith("sysname:"):
            return line.split(":", 1)[1].strip().replace(" ", "_")

        if line.lower().startswith("system name:"):
            return line.split(":", 1)[1].strip().replace(" ", "_")

        if line.lower().startswith("switch:"):
            return line.split(":", 1)[1].strip().replace(" ", "_")

    return fallback_ip.replace(".", "_")


def clean_filename(name):
    bad_chars = [":", "/", "\\", " ", "*", "?", '"', "<", ">", "|"]
    for char in bad_chars:
        name = name.replace(char, "_")
    return name


def build_backup_filename(hostname, ip):
    date_folder = datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean_name = clean_filename(f"{hostname}_{ip}_{timestamp}_primary.cfg")
    
    # Create the dated subfolder inside TFTP_ROOT if configured
    if TFTP_ROOT:
        try:
            target_dir = TFTP_ROOT / date_folder
            target_dir.mkdir(parents=True, exist_ok=True)
            try:
                os.chmod(target_dir, 0o777)
            except Exception:
                pass
        except Exception as err:
            logging.warning(f"Could not ensure TFTP date folder '{date_folder}': {err}")

    # Returns relative path for TFTP command (e.g. 2026-07-23/Switch_10.0.0.1_20260723_120000_primary.cfg)
    return f"{date_folder}/{clean_name}"


def get_device_type():
    if METHOD == "ssh":
        return "extreme_exos"
    return "extreme_exos_telnet"


def get_connection_port():
    if METHOD == "ssh":
        return 22
    return 23


def backup_file_exists(filename):
    if not TFTP_ROOT:
        return "Not checked"

    expected_file = TFTP_ROOT / filename

    if expected_file.exists():
        return "Yes"

    return "No"


def has_bad_words(output):
    bad_words = ["error", "failed", "failure", "timeout", "denied", "unable"]
    return any(word in output.lower() for word in bad_words)


def prompt_shows_unsaved(prompt_text):
    if not prompt_text:
        return False

    lines = [line.strip() for line in prompt_text.splitlines() if line.strip()]
    if not lines:
        return False

    return lines[-1].startswith("*")


def base_result(ip, **overrides):
    result = {
        "ip": ip,
        "hostname": "",
        "ping": "",
        "port_open": "",
        "method": METHOD,
        "hop_via": "",
        "backup_status": "",
        "backup_file": "",
        "file_verified": "No",
        "unsaved_changes": "Not checked",
        "message": ""
    }
    result.update(overrides)
    return result


def backup_switch(ip):
    port = get_connection_port()

    device = {
        "device_type": get_device_type(),
        "host": ip,
        "username": USERNAME,
        "password": PASSWORD,
        "timeout": TIMEOUT,
    }

    try:
        logging.info(f"[{ip}] Connecting with Netmiko using {METHOD.upper()}...")

        connection = ConnectHandler(**device)

        current_prompt = connection.find_prompt()
        unsaved = "Yes" if prompt_shows_unsaved(current_prompt) else "No"
        if unsaved == "Yes":
            logging.warning(
                f"[{ip}] Switch has unsaved configuration changes "
                f"(running-config differs from saved config)"
            )

        switch_info = connection.send_command("show switch")
        hostname = get_hostname(switch_info, ip)

        backup_filename = build_backup_filename(hostname, ip)

        backup_command = f"upload configuration {TFTP_SERVER} {backup_filename} vr {TFTP_VR}"

        logging.info(f"[{ip}] Hostname detected: {hostname}")
        logging.info(f"[{ip}] Backup filename: {backup_filename}")
        logging.info(f"[{ip}] Running command: {backup_command}")

        output = connection.send_command_timing(
            backup_command,
            delay_factor=3,
            strip_prompt=False,
            strip_command=False
        )

        time.sleep(VERIFY_WAIT)

        retried = False
        if has_bad_words(output):
            logging.warning(
                f"[{ip}] Backup command returned an error-like response - "
                f"waiting {RETRY_DELAY}s and retrying once before giving up"
            )
            time.sleep(RETRY_DELAY)
            retried = True
            output = connection.send_command_timing(
                backup_command,
                delay_factor=3,
                strip_prompt=False,
                strip_command=False
            )
            time.sleep(VERIFY_WAIT)

        connection.disconnect()

        logging.info(f"[{ip}] Backup command output:")
        logging.info(output)

        if has_bad_words(output):
            return base_result(
                ip,
                hostname=hostname,
                ping="Yes",
                port_open="Yes",
                backup_status="Failed",
                backup_file=backup_filename,
                file_verified=backup_file_exists(backup_filename),
                unsaved_changes=unsaved,
                message="Backup command returned an error-like response"
                        + (" (after 1 retry)" if retried else "")
            )

        verified = backup_file_exists(backup_filename)

        if verified == "No":
            status = "Warning"
            message = "Switch reported success, but file was not found in configured TFTP root"
        else:
            status = "Success"
            message = "Backup completed" + (" (succeeded on retry)" if retried else "")

        return base_result(
            ip,
            hostname=hostname,
            ping="Yes",
            port_open="Yes",
            backup_status=status,
            backup_file=backup_filename,
            file_verified=verified,
            unsaved_changes=unsaved,
            message=message
        )

    except NetmikoTimeoutException:
        return base_result(
            ip, ping="Yes", port_open="Yes",
            backup_status="Failed", message="Netmiko timeout"
        )

    except NetmikoAuthenticationException:
        return base_result(
            ip, ping="Yes", port_open="Yes",
            backup_status="Failed", message="Authentication failed"
        )

    except Exception as error:
        return base_result(
            ip, ping="Yes", port_open="Yes",
            backup_status="Failed", message=str(error)
        )


# =========================
# HOP (SECOND-HOP TELNET) FUNCTIONS
# =========================

def build_subnet_map(results, prefix):
    subnet_map = {}

    for r in results:
        if r["backup_status"] not in ("Success", "Warning"):
            continue
        try:
            network = ipaddress.ip_network(f"{r['ip']}/{prefix}", strict=False)
        except ValueError:
            continue
        subnet_map.setdefault(str(network), []).append(r["ip"])

    return subnet_map


def find_hop_candidates(target_ip, subnet_map, prefix):
    try:
        network = ipaddress.ip_network(f"{target_ip}/{prefix}", strict=False)
    except ValueError:
        return []
    return [ip for ip in subnet_map.get(str(network), []) if ip != target_ip]


def _expect(connection, pattern, timeout, label):
    try:
        return connection.read_until_pattern(pattern=pattern, read_timeout=timeout)
    except Exception as error:
        raise TimeoutError(f"Timed out waiting for {label} (pattern: {pattern}): {error}")


def backup_switch_via_hop(target_ip, intermediary_ip):
    device = {
        "device_type": get_device_type(),
        "host": intermediary_ip,
        "username": USERNAME,
        "password": PASSWORD,
        "timeout": TIMEOUT,
    }

    connection = None

    try:
        logging.info(f"[{target_ip}] Hopping via {intermediary_ip}...")
        connection = ConnectHandler(**device)

        connection.write_channel(f'telnet vr "{HOP_MGMT_VR}" {target_ip}\n')

        _expect(connection, LOGIN_PATTERN, HOP_TIMEOUT, "nested login prompt")
        connection.write_channel(USERNAME + "\n")

        _expect(connection, PASSWORD_PATTERN, HOP_TIMEOUT, "nested password prompt")
        connection.write_channel(PASSWORD + "\n")

        nested_prompt = _expect(connection, CLI_PROMPT_PATTERN, HOP_TIMEOUT, "nested CLI prompt after login")
        unsaved = "Yes" if prompt_shows_unsaved(nested_prompt) else "No"
        if unsaved == "Yes":
            logging.warning(
                f"[{target_ip}] (via {intermediary_ip}) Switch has unsaved "
                f"configuration changes (running-config differs from saved config)"
            )

        connection.write_channel("show switch\n")
        switch_info = _expect(connection, CLI_PROMPT_PATTERN, HOP_TIMEOUT, "show switch output")
        hostname = get_hostname(switch_info, target_ip)

        backup_filename = build_backup_filename(hostname, target_ip)
        backup_command = f"upload configuration {TFTP_SERVER} {backup_filename} vr {TFTP_VR}"

        logging.info(f"[{target_ip}] (via {intermediary_ip}) Hostname detected: {hostname}")
        logging.info(f"[{target_ip}] (via {intermediary_ip}) Running command: {backup_command}")

        connection.write_channel(backup_command + "\n")
        time.sleep(VERIFY_WAIT)
        output = _expect(connection, CLI_PROMPT_PATTERN, HOP_TIMEOUT, "backup command output")

        retried = False
        if has_bad_words(output):
            logging.warning(
                f"[{target_ip}] (via {intermediary_ip}) Backup command returned an "
                f"error-like response - waiting {RETRY_DELAY}s and retrying once before giving up"
            )
            time.sleep(RETRY_DELAY)
            retried = True
            connection.write_channel(backup_command + "\n")
            time.sleep(VERIFY_WAIT)
            output = _expect(connection, CLI_PROMPT_PATTERN, HOP_TIMEOUT, "backup command output (retry)")

        logging.info(f"[{target_ip}] (via {intermediary_ip}) Backup command output:")
        logging.info(output)

        _close_nested_session(connection)
        connection.disconnect()

        if has_bad_words(output):
            return base_result(
                target_ip,
                hostname=hostname,
                ping="No (direct)",
                port_open="No (direct)",
                method=f"{METHOD} (hop)",
                hop_via=intermediary_ip,
                backup_status="Failed",
                backup_file=backup_filename,
                file_verified=backup_file_exists(backup_filename),
                unsaved_changes=unsaved,
                message="Backup command returned an error-like response (via hop)"
                        + (" (after 1 retry)" if retried else "")
            )

        verified = backup_file_exists(backup_filename)

        if verified == "No":
            status = "Warning"
            message = f"Backup completed via hop through {intermediary_ip}, but file not found in TFTP root"
        else:
            status = "Success"
            message = f"Backup completed via hop through {intermediary_ip}" + (" (succeeded on retry)" if retried else "")

        return base_result(
            target_ip,
            hostname=hostname,
            ping="No (direct)",
            port_open="No (direct)",
            method=f"{METHOD} (hop)",
            hop_via=intermediary_ip,
            backup_status=status,
            backup_file=backup_filename,
            file_verified=verified,
            unsaved_changes=unsaved,
            message=message
        )

    except Exception as error:
        logging.error(f"[{target_ip}] Hop via {intermediary_ip} failed: {error}")
        if connection is not None:
            try:
                connection.disconnect()
            except Exception:
                pass
        return base_result(
            target_ip,
            ping="No (direct)",
            port_open="No (direct)",
            method=f"{METHOD} (hop)",
            hop_via=intermediary_ip,
            backup_status="Failed",
            message=f"Hop via {intermediary_ip} failed: {error}"
        )


def _close_nested_session(connection):
    try:
        connection.write_channel("logout\n")
        _expect(connection, CLI_PROMPT_PATTERN, 10, "prompt after logout")
        return
    except Exception:
        pass

    try:
        connection.write_channel("\x1d")
        time.sleep(1)
        connection.write_channel("quit\n")
        _expect(connection, CLI_PROMPT_PATTERN, 10, "prompt after forced quit")
    except Exception as error:
        logging.warning(f"Could not confirm clean return from nested session: {error}")


def attempt_hop_backups(results):
    subnet_map = build_subnet_map(results, HOP_SUBNET_PREFIX)
    skipped = [r for r in results if r["backup_status"] == "Skipped"]

    if not skipped:
        return results

    logging.info("=" * 60)
    logging.info(f"Starting hop pass for {len(skipped)} unreachable device(s)")
    logging.info("=" * 60)

    for index, r in enumerate(skipped, start=1):
        target_ip = r["ip"]
        pbar = draw_progress_bar(index, len(skipped))
        logging.info("-" * 60)
        logging.info(f"HOP PROGRESS {pbar} | Target: {target_ip}")
        candidates = find_hop_candidates(target_ip, subnet_map, HOP_SUBNET_PREFIX)

        if not candidates:
            r["message"] = r["message"] + " | No reachable hop candidate found in same subnet"
            logging.warning(f"[{target_ip}] No hop candidates available. Leaving as Skipped.")
            continue

        logging.info(f"[{target_ip}] Hop candidates: {candidates}")

        hop_result = None
        for candidate_ip in candidates:
            hop_result = backup_switch_via_hop(target_ip, candidate_ip)

            if hop_result["backup_status"] in ("Success", "Warning"):
                break
            logging.warning(
                f"[{target_ip}] Hop via {candidate_ip} did not succeed: {hop_result['message']}"
            )

        if hop_result is not None:
            r.update(hop_result)

    return results


def write_csv_report(results):
    fieldnames = [
        "ip",
        "hostname",
        "ping",
        "port_open",
        "method",
        "hop_via",
        "backup_status",
        "backup_file",
        "file_verified",
        "unsaved_changes",
        "message"
    ]

    with open(csv_report, "w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)


# =========================
# MAIN
# =========================

def main():
    start_time = datetime.now()
    started_at_str = start_time.strftime("%Y-%m-%d %H:%M:%S")

    switches = read_switches(SWITCH_FILE)

    if not switches:
        logging.error("No switches found. Check Switches.txt.")
        update_status("extreme_switch_backup.py", "FAILED", action="No switches found in Switches.txt", started_at=started_at_str)
        return

    total = len(switches)
    port = get_connection_port()
    results = []

    update_status("extreme_switch_backup.py", "RUNNING", index=0, total=total, action="Starting backup process", started_at=started_at_str)

    logging.info("=" * 60)
    logging.info("Starting Extreme switch backup")
    logging.info(f"Script folder: {SCRIPT_DIR}")
    logging.info(f"Switch file:   {SWITCH_FILE}")
    logging.info(f"Log file:      {log_file}")
    logging.info(f"CSV report:    {csv_report}")
    logging.info(f"TFTP server:   {TFTP_SERVER}")
    logging.info(f"TFTP root:     {TFTP_ROOT if TFTP_ROOT else 'Not configured'}")
    logging.info(f"Method:        {METHOD.upper()}")
    logging.info(f"Hop enabled:   {HOP_ENABLED} (subnet /{HOP_SUBNET_PREFIX}, mgmt vr '{HOP_MGMT_VR}')")
    logging.info("=" * 60)

    for index, ip in enumerate(switches, start=1):
        pbar = draw_progress_bar(index, total)
        logging.info("-" * 60)
        logging.info(f"PROGRESS {pbar} | Switch: {ip}")

        current_counts = {
            "success": sum(1 for r in results if r["backup_status"] == "Success"),
            "warning": sum(1 for r in results if r["backup_status"] == "Warning"),
            "failed": sum(1 for r in results if r["backup_status"] == "Failed"),
            "skipped": sum(1 for r in results if r["backup_status"] == "Skipped")
        }
        update_status(
            "extreme_switch_backup.py", "RUNNING", current_switch=ip, index=index, total=total,
            action=f"Processing switch {ip}", counts=current_counts, started_at=started_at_str
        )

        ping_ok = ping_host(ip) if PING_CHECK else True
        port_ok = tcp_port_open(ip, port)

        if not port_ok:
            logging.error(f"[{index}/{total}] {ip} - TCP/{port} ({METHOD.upper()}) closed or unreachable. Skipping.")
            results.append(base_result(
                ip, ping="Yes" if ping_ok else "No", port_open="No",
                backup_status="Skipped", message=f"TCP/{port} closed or unreachable"
            ))
            continue

        logging.info(f"[{index}/{total}] {ip} - TCP/{port} open. Attempting backup.")

        result = backup_switch(ip)
        results.append(result)

        if result["backup_status"] == "Success":
            logging.info(f"[{index}/{total}] {ip} - Backup success.")
        elif result["backup_status"] == "Warning":
            logging.warning(f"[{index}/{total}] {ip} - Backup warning: {result['message']}")
        else:
            logging.error(f"[{index}/{total}] {ip} - Backup failed: {result['message']}")

    if HOP_ENABLED:
        update_status(
            "extreme_switch_backup.py", "RUNNING - HOP PASS", index=total, total=total,
            action="Attempting hop backups for unreachable switches",
            counts={
                "success": sum(1 for r in results if r["backup_status"] == "Success"),
                "warning": sum(1 for r in results if r["backup_status"] == "Warning"),
                "failed": sum(1 for r in results if r["backup_status"] == "Failed"),
                "skipped": sum(1 for r in results if r["backup_status"] == "Skipped")
            }, started_at=started_at_str
        )
        results = attempt_hop_backups(results)
    else:
        logging.info("Hop pass disabled (hop.enabled = false in config.ini). Skipping.")

    write_csv_report(results)

    end_time = datetime.now()
    runtime = end_time - start_time

    success_count = sum(1 for r in results if r["backup_status"] == "Success")
    warning_count = sum(1 for r in results if r["backup_status"] == "Warning")
    failed_count = sum(1 for r in results if r["backup_status"] == "Failed")
    skipped_count = sum(1 for r in results if r["backup_status"] == "Skipped")
    hopped_count = sum(1 for r in results if r["hop_via"])
    unsaved_count = sum(1 for r in results if r["unsaved_changes"] == "Yes")

    final_counts = {
        "total": total,
        "success": success_count,
        "warning": warning_count,
        "failed": failed_count,
        "skipped": skipped_count,
        "hopped": hopped_count,
        "unsaved_configs": unsaved_count
    }

    update_status(
        "extreme_switch_backup.py", "COMPLETED", index=total, total=total,
        action=f"Finished in {runtime}", counts=final_counts, started_at=started_at_str
    )

    logging.info("=" * 60)
    logging.info("Run complete")
    logging.info(f"Total switches:      {total}")
    logging.info(f"Successful:          {success_count}")
    logging.info(f"Warnings:            {warning_count}")
    logging.info(f"Failed:              {failed_count}")
    logging.info(f"Skipped (unreachable, no hop found): {skipped_count}")
    logging.info(f"Backed up via hop:   {hopped_count}")
    logging.info(f"Switches with UNSAVED config changes: {unsaved_count}")
    if unsaved_count:
        unsaved_ips = [r["ip"] for r in results if r["unsaved_changes"] == "Yes"]
        logging.info(f"  -> {', '.join(unsaved_ips)}")
    logging.info(f"Runtime:             {runtime}")
    logging.info(f"Log file:            {log_file}")
    logging.info(f"CSV report:          {csv_report}")
    logging.info("=" * 60)


if __name__ == "__main__":
    main()
