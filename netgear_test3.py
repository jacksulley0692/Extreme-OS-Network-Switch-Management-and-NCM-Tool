import getpass
import re
from netmiko import ConnectHandler

def run_test():
    print("=== Extreme-OS Netgear Discovery Test Script (Fixed Engine) ===")
    
    ip_address = input("Enter Switch IP Address: ").strip()
    username = input("Enter Username: ").strip()
    password = getpass.getpass("Enter Password: ")

    device_profile = {
        'device_type': 'extreme_exos_telnet',
        'host': ip_address,
        'username': username,
        'password': password,
    }

    print(f"\n[*] Connecting to {ip_address} via Telnet...")
    try:
        net_connect = ConnectHandler(**device_profile)
        net_connect.enable()
        print("[+] Gathering operational table snapshots...")

        fdb_output = net_connect.send_command("show fdb")
        lldp_output = net_connect.send_command("show lldp neighbors detailed")
        sharing_output = net_connect.send_command("show sharing")
        
        net_connect.disconnect()

        # 1. PARSE FDB (Correctly isolates trailing space-padded integer port columns)
        port_mac_map = {}
        for line in fdb_output.splitlines():
            # Match standard 17-char colon layout
            mac_match = re.search(r'([0-9a-fA-F:]{17})', line)
            if mac_match:
                mac_clean = mac_match.group(1).lower()
                tokens = line.split()
                if tokens:
                    port_str = tokens[-1]
                    if port_str.isdigit():
                        if port_str not in port_mac_map:
                            port_mac_map[port_str] = []
                        if mac_clean not in port_mac_map[port_str]:
                            port_mac_map[port_str].append(mac_clean)

        # 2. PARSE LLDP (Fixed: Stitch backslash line continuations into one continuous string block)
        lldp_data = {}
        # Normalize backslash multi-line wraps
        lldp_normalized = lldp_output.replace('\\\n', '').replace('\\\r\n', '')
        
        if "LLDP Port " in lldp_normalized:
            port_sections = lldp_normalized.split("LLDP Port ")
            for section in port_sections[1:]:
                lines = section.splitlines()
                if not lines: continue
                
                # Extract first token (the port number identifier)
                port_match = re.match(r'^(\d+)', lines[0].strip())
                if not port_match: continue
                port = port_match.group(1)
                
                sys_name = ""
                sys_desc = ""
                
                for line in lines:
                    if "System Name:" in line:
                        sys_name = line.split("System Name:")[-1].strip().lower()
                    elif "System Description:" in line:
                        sys_desc = line.split("System Description:")[-1].strip().lower()
                        
                lldp_data[port] = {"name": sys_name, "desc": sys_desc}

        # 3. EVALUATION ENGINE
        netgear_alerts_found = 0
        print("\n" + "="*60)
        print(f"DISCOVERY RESULTS FOR MANAGED SWITCH: {ip_address}")
        print("="*60)

        # Expanded with your active switch OUI (28:94:01)
        NETGEAR_OUIS = ['00:14:6c', '00:26:f2', '84:1b:5e', '28:94:01', '00:18:4d', '00:2b:21', 'bc:05:43']

        # Scan across all active multi-MAC signature allocations from your logs (Ports 1, 20, 24)
        all_active_ports = set(list(port_mac_map.keys()) + list(lldp_data.keys()))

        for port in all_active_ports:
            if port in sharing_output:
                continue

            macs = port_mac_map.get(port, [])
            is_netgear_mac = False
            is_netgear_lldp = False
            reasons = []

            # A. Evaluate MAC OUI Profiles
            for mac in macs:
                if any(mac.startswith(oui) for oui in NETGEAR_OUIS):
                    is_netgear_mac = True
                    reasons.append(f"MAC OUI layout matching active Netgear block structure ({mac[:8]})")
                    break

            # B. Evaluate LLDP Text Strings
            if port in lldp_data:
                info = lldp_data[port]
                if "netgear" in info['name'] or "netgear" in info['desc'] or "gs728" in info['desc']:
                    is_netgear_lldp = True
                    reasons.append(f"LLDP details verify signature footprint: '{info['desc'][:50]}...'")

            # C. Trigger logic if either constraint profile parameters are hit
            if is_netgear_lldp or is_netgear_mac or (len(macs) >= 2 and is_netgear_mac):
                netgear_alerts_found += 1
                print(f"\n🚨 ALERT: Netgear Smart-Switch detected on Access Port {port}!")
                print(f"   -> FDB Footprint: {len(macs)} downstream endpoint targets mapped.")
                for reason in reasons:
                    print(f"   -> {reason}")

        if netgear_alerts_found == 0:
            print("\n[+] Scan finished. No active unmanaged target criteria met.")
        else:
            print(f"\n[!] Complete. Successfully flagged {netgear_alerts_found} Netgear node layout assemblies.")

    except Exception as e:
        print(f"\n❌ Execution failure: {e}")

if __name__ == "__main__":
    run_test()
