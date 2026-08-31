import getpass
import re
from netmiko import ConnectHandler

def run_test():
    print("=== Extreme-OS Netgear Discovery Test Script (EDP Guardrail) ===")
    
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
        edp_output = net_connect.send_command("show edp neighbors")
        
        net_connect.disconnect()

        # 1. PARSE EDP NEIGHBORS
        edp_ports = set()
        for line in edp_output.splitlines():
            port_match = re.match(r'^\s*(\d+(?::\d+)?)', line)
            if port_match:
                raw_port = port_match.group(1)
                clean_port = raw_port.split(':')[-1]
                edp_ports.add(clean_port)

        # 2. PARSE FDB 
        port_mac_map = {}
        for line in fdb_output.splitlines():
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

        # 3. PARSE LLDP
        lldp_data = {}
        lldp_normalized = lldp_output.replace('\\\n', '').replace('\\\r\n', '')
        
        if "LLDP Port " in lldp_normalized:
            port_sections = lldp_normalized.split("LLDP Port ")
            for section in port_sections[1:]:
                lines = section.splitlines()
                if not lines: 
                    continue
                
                first_line = lines[0].strip()
                port_match = re.match(r'^(\d+)', first_line)
                if not port_match: 
                    continue
                port = port_match.group(1)
                
                sys_name = ""
                sys_desc = ""
                
                for line in lines:
                    if "System Name:" in line:
                        sys_name = line.split("System Name:")[-1].strip().lower()
                    elif "System Description:" in line:
                        sys_desc = line.split("System Description:")[-1].strip().lower()
                        
                lldp_data[port] = {"name": sys_name, "desc": sys_desc}

        # 4. ADVANCED VERDICT ENGINE
        netgear_alerts_found = 0
        print("\n" + "="*60)
        print(f"DISCOVERY RESULTS FOR MANAGED SWITCH: {ip_address}")
        print("="*60)

        NETGEAR_OUIS = ['00:14:6c', '00:26:f2', '84:1b:5e', '28:94:01', '00:18:4d', '00:2b:21', 'bc:05:43']
        all_active_ports = set(list(port_mac_map.keys()) + list(lldp_data.keys()))

        for port in all_active_ports:
            if port in sharing_output:
                continue

            # THE EDP GUARDRAIL
            if port in edp_ports:
                continue

            macs = port_mac_map.get(port, [])
            total_mac_count = len(macs)
            
            is_netgear_mac = False
            is_netgear_lldp = False
            reasons = []

            # Check Netgear OUIs
            for mac in macs:
                if any(mac.startswith(oui) for oui in NETGEAR_OUIS):
                    is_netgear_mac = True
                    reasons.append(f"MAC OUI identifies a Netgear address block ({mac[:8]})")
                    break

            # Parse verified LLDP payloads
            if port in lldp_data:
                info = lldp_data[port]
                if "netgear" in info['name'] or "netgear" in info['desc'] or "gs728" in info['desc']:
                    is_netgear_lldp = True
                    reasons.append(f"LLDP Data confirmed vendor text match: '{info['desc'][:45]}...'")

            # Final classification checks
            if (total_mac_count >= 2 and is_netgear_mac) or is_netgear_lldp:
                netgear_alerts_found += 1
                print(f"\n🚨 ALERT: Direct Unmanaged Netgear Switch Found on Access Port {port}!")
                print(f"   -> FDB Footprint: {total_mac_count} local devices connected downstream.")
                for reason in reasons:
                    print(f"   -> {reason}")

        if netgear_alerts_found == 0:
            print("\n[+] Scan finished cleanly. Core uplinks safely filtered via EDP mapping.")
        else:
            print(f"\n[!] Complete. Isolated {netgear_alerts_found} unmanaged switch edge installations.")

    except Exception as e:
        print(f"\n❌ Execution failure: {e}")

if __name__ == "__main__":
    run_test()
