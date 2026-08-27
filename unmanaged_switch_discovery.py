#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
unmanaged_switch_discovery.py - Extreme Networks Unmanaged Switch Discovery CLI
===============================================================================

Discovers rogue, unmanaged, or prosumer desktop switches connected to edge ports
across Extreme-OS (EXOS) switches.

Usage:
  python unmanaged_switch_discovery.py                     # Scans Northwood (Default test site)
  python unmanaged_switch_discovery.py --site Northwood    # Scans Northwood explicitly
  python unmanaged_switch_discovery.py --switch 10.32.180.253 # Scans specific switch
  python unmanaged_switch_discovery.py --json              # Outputs pure JSON
===============================================================================
"""

import sys
import os
import argparse
import json
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).resolve().parent / "src"))

from switch_logic import run_unmanaged_switch_discovery, NORTHWOOD_TARGET_SWITCHES

def main():
    parser = argparse.ArgumentParser(description="Extreme-OS Rogue & Unmanaged Switch Discovery Engine")
    parser.add_argument("--site", type=str, default="Northwood", help="Target site name (default: Northwood)")
    parser.add_argument("--switch", type=str, default=None, help="Target specific switch IP")
    parser.add_argument("--json", action="store_true", help="Output pure JSON format")
    args = parser.parse_args()

    switch_list = None
    if args.switch:
        switch_list = [{"hostname": f"SWITCH-{args.switch}", "ip": args.switch, "os": "EXOS"}]

    res = run_unmanaged_switch_discovery(target_site=args.site, switch_list=switch_list)

    if args.json:
        print(json.dumps(res, indent=2))
        return

    print("=" * 80)
    print(f" EXTREME-OS UNMANAGED SWITCH DISCOVERY - SITE: {res['targetSite'].upper()}")
    print("=" * 80)
    print(f" Scan Completed At: {res['scannedAt']} (Execution Time: {res['durationMs']}ms)")
    print(f" Total Ports Scanned: {res['totalPortsScanned']} | High Probability Alerts: {res['highRiskCount']} | Medium Alerts: {res['mediumRiskCount']}")
    print("-" * 80)

    if not res["flaggedSwitches"]:
        print(" [OK] No unmanaged switches or multi-MAC rogue ports detected on edge ports.")
    else:
        print(f"{'ALERT':<8} | {'SWITCH IP':<15} | {'PORT':<6} | {'MACS':<5} | {'IDENTIFIED VENDOR':<18} | {'REASON'}")
        print("-" * 80)
        for item in res["flaggedSwitches"]:
            alert = f"[{item['alertLevel']}]"
            sw_ip = item["switchIp"]
            port = item["port"]
            macs = str(item["macCount"])
            vendor = item["identifiedVendor"][:17]
            reason = item["detectionReason"][:45] + ("..." if len(item["detectionReason"]) > 45 else "")
            print(f"{alert:<8} | {sw_ip:<15} | {port:<6} | {macs:<5} | {vendor:<18} | {reason}")

        print("\n" + "=" * 80)
        print(" DETAILED ACTIONABLE FINDINGS:")
        print("=" * 80)
        for idx, item in enumerate(res["flaggedSwitches"], 1):
            print(f"\n[{idx}] Switch: {item['switchHostname']} ({item['switchIp']}) -> Port {item['port']}")
            print(f"    &bull; Severity       : {item['alertLevel']} PROBABILITY ROGUE SWITCH")
            print(f"    &bull; Vendor / Model : {item['identifiedVendor']}")
            print(f"    &bull; Active MACs    : {item['macCount']} total learned addresses:")
            for m in item["detectedMacs"]:
                tag = f"[{m.get('ouiVendor')}] (Consumer OUI Match)" if m.get("isConsumerOui") else f"[{m.get('ouiVendor') or 'Unknown OUI'}]"
                print(f"        - {m['mac']} (VLAN: {m['vlan']}) -> {tag}")
            print(f"    &bull; LLDP Signature : {item['lldpDetails'].get('systemName', 'None')} ({item['lldpDetails'].get('systemDesc', 'N/A')})")
            print(f"    &bull; Recommendation : {item['recommendedAction']}")

    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()
