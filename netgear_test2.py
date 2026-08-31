import getpass
import re
from netmiko import ConnectHandler

def run_test():
    print("=== Extreme-OS Netgear Discovery Test Script ===")
    
    ip_address = input("Enter Switch IP Address: ").strip()
    username = input("Enter Username: ").strip()
    password = getpass.getpass("Enter Password: ")

    device_profile = {
        'device_type': 'extreme_exos_telnet',
        'host': ip_address,
        'username': username,
        'password': password,
    }

    print(f"\n[*] Attempting Telnet connection to {ip_address}...")
    try:
        net_connect = ConnectHandler(**device_profile)
        net_connect.enable()
        print("[+] Connected! Gathering raw switch outputs...")

        # Run commands
        fdb_output = net_connect.send_command("show fdb")
        lldp_output = net_connect.send_command("show lldp neighbors detailed")
        sharing_output = net_connect.send_command("show sharing")
        
        net_connect.disconnect()
        
        # --- DEBUG DUMPS ---
        # Un-comment these lines if you want to inspect exactly what the switch responds with
        # print("\n--- DEBUG: RAW FDB OUTPUT ---")
        # print(fdb_output)
        # -------------------

        # Optimized regex parser for EXOS FDB
        # Matches any 17-char colon/dash MAC string and finds the integer port at the end of the text line
        port_mac_map = {}
        for line in fdb_output.splitlines():
            # Standard EXOS FDB entry layout scanner
            mac_match = re.search(r'([0-9a-fA-F[:punct:]]{14,19})', line)
            if mac_match:
                mac_str = re.sub(r'[^0-9a-fA-F]', '', mac_match.group(1)).lower()
                # Format to a standard clean format without delimiter variance
                if len(mac_str) == 12:
                    mac_clean = ":".join(mac_str[i:i+2] for i in range(0, 12, 2))
                    
                    # Split line into tokens to extract the trailing port identifier securely
                    tokens = line.split()
                    if tokens:
                        port_str = tokens[-1] # Port number is traditionally the final token in EXOS FDB
                        if port_str.isdigit():
                            if port_str not in port_mac_map:
                                port_mac_map[port_str] = []
                            if mac_clean not in port_mac_map[port_str]:
                                port_mac_map[port_str].append(mac_clean)

        # Basic LLDP tracking dictionary
        lldp_data = {}
        if "Port:" in lldp_output:
            port_sections = lldp_output.split("Port:")
            for section in port_sections[1:]:
                lines = section.splitlines()
                if not lines: continue
                port = lines[0].strip().split()[0]
                sys_name = ""
                sys_desc = ""
                for line in lines:
                    if "System Name:" in line:
                        sys_name = line.split("System Name:")[-1].strip().lower()
                    elif "System Description:" in line:
                        sys_desc = line.split("System Description:")[-1].strip().lower()
                lldp_data[port] = {"name": sys_name, "desc": sys_desc}

        netgear_alerts_found = 0
        print("\n============================================================")
        print(f"DISCOVERY RESULTS FOR MANAGED SWITCH: {ip_address}")
        print("============================================================")

        netgear_ouis = ['00146c', '0026f2', '841b5e', '00184d', '002b21', 'bc0543', 'c0ffd4']

        for port, macs in port_mac_map.items():
            if port in sharing_output:
                continue

            is_netgear_mac = False
            is_netgear_lldp = False
            reasons = []

            # Check MAC arrays
            for mac in macs:
                mac_stripped = mac.replace(":", "")
                if any(mac_stripped.startswith(oui) for oui in netgear_ouis):
                    is_netgear_mac = True
                    reasons.append(f"MAC Profile Match ({mac}) found on port mapping.")
                    break

            # Check LLDP strings
            if port in lldp_data:
                info = lldp_data[port]
                if "netgear" in info['name'] or "netgear" in info['desc']:
                    is_netgear_lldp = True
                    reasons.append(f"LLDP text data identified: '{info['name'] or info['desc'][:30]}'")

            # --- CORRECTION BREAKDOWN ---
            # If the Netgear is entirely unmanaged, it might only have ONE device active 
            # downstream right now. We remove the hard requirement for >=2 MACs IF the MAC 
            # explicitly belongs to a Netgear factory OUI.
            
            if is_netgear_lldp or is_netgear_mac or (len(macs) >= 2 and ("netgear" in str(reasons))):
                netgear_alerts_found += 1
                print(f"\n🚨 ALERT: Netgear Signature identified on Access Port {port}!")
                print(f"   -> Total MAC addresses logged on this port: {len(macs)}")
                for r in reasons:
                    print(f"   -> {r}")

        if netgear_alerts_found == 0:
            print("\n[+] Clean run! No rogue Netgear switch indicators flagged.")
            print("💡 TIP: If you know it is connected, check if the switch port has link, or un-comment the FDB dump block to view the raw output layout.")
        else:
            print(f"\n[!] Audit finished. Flagged {netgear_alerts_found} anomalous link layouts.")

    except Exception as e:
        print(f"\n❌ Execution failure: {e}")

if __name__ == "__main__":
    run_test()
