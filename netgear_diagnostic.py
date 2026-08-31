import getpass
from netmiko import ConnectHandler

def run_diagnostic():
    print("=== Extreme-OS Network Layout Diagnostic ===")
    
    ip_address = input("Enter Switch IP Address: ").strip()
    username = input("Enter Username: ").strip()
    password = getpass.getpass("Enter Password: ")

    device_profile = {
        'device_type': 'extreme_exos_telnet',
        'host': ip_address,
        'username': username,
        'password': password,
    }

    print(f"\n[*] Connecting to {ip_address}...")
    try:
        net_connect = ConnectHandler(**device_profile)
        net_connect.enable()
        
        print("[*] Connected! Capturing data raw inputs...")
        fdb_output = net_connect.send_command("show fdb")
        lldp_output = net_connect.send_command("show lldp neighbors detailed")
        
        net_connect.disconnect()
        
        print("\n" + "="*40)
        print("DIAGNOSTIC 1: RAW FDB OUTPUT (FIRST 20 LINES)")
        print("="*40)
        fdb_lines = fdb_output.splitlines()
        for line in fdb_lines[:25]:
            print(line)
            
        print("\n" + "="*40)
        print("DIAGNOSTIC 2: RAW LLDP OUTPUT (FIRST 20 LINES)")
        print("="*40)
        lldp_lines = lldp_output.splitlines()
        for line in lldp_lines[:25]:
            print(line)

        # Basic multi-MAC count fallback to check if any port behaves like a switch
        print("\n" + "="*40)
        print("DIAGNOSTIC 3: LINE-BY-LINE PORT COUNT EXTRACTION")
        print("="*40)
        raw_ports = {}
        for line in fdb_lines:
            # Let's see if we can find any integers at the end of lines that look like active data entries
            tokens = line.split()
            if tokens and tokens[-1].isdigit():
                port = tokens[-1]
                raw_ports[port] = raw_ports.get(port, 0) + 1

        multi_mac_found = False
        for p, count in raw_ports.items():
            if count >= 2:
                print(f"👉 Found multi-MAC behavior on Port {p}: {count} total entries listed.")
                multi_mac_found = True
        
        if not multi_mac_found:
            print("❌ No ports on this switch are showing more than 1 MAC address in the FDB text.")

    except Exception as e:
        print(f"\n❌ Error during diagnostic run: {e}")

if __name__ == "__main__":
    run_diagnostic()
