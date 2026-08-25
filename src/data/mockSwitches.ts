import { SwitchItem } from "../types";

export const MOCK_SWITCHES: SwitchItem[] = [
  {
    id: "sw-01-core",
    hostname: "SW-CORE-EXOS-01",
    ip: "10.36.226.11",
    os: "EXOS",
    model: "Summit X670-G2-48x-4q",
    firmware: "EXOS 31.7.1.4-patch1-8",
    serialNumber: "2145N-89102",
    macAddress: "08:00:27:FA:82:11",
    primaryVlan: 100,
    gateway: "10.36.226.1",
    uplinkPorts: ["1:49", "1:50"],
    lastBackupTime: "Today at 04:15 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/SW-CORE-EXOS-01.xsf",
    configFormat: "xsf",
    notes: "Core Aggregation Switch. Has 10G/40G uplinks to DC routers.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Generated automatically by Extreme Switch Backup Engine
# Switch: SW-CORE-EXOS-01 (Summit X670-G2-48x-4q)
# MAC: 08:00:27:FA:82:11 | Primary Mgmt IP: 10.36.226.11/24

# Module configuration
configure snmp sysName "SW-CORE-EXOS-01"
configure snmp sysContact "Network Operations <noc@company.internal>"
configure snmp sysLocation "Main Datacenter"
configure timezone name GMT 0 autodst

# VLAN Definitions
create vlan "Mgmt-VR"
configure vlan "Mgmt-VR" tag 100
configure vlan "Mgmt-VR" ipaddress 10.36.226.11 255.255.255.0

create vlan "Data-Corp"
configure vlan "Data-Corp" tag 200
configure vlan "Data-Corp" ipaddress 10.36.200.1 255.255.255.0

create vlan "Voice-VoIP"
configure vlan "Voice-VoIP" tag 300
configure vlan "Voice-VoIP" ipaddress 10.36.300.1 255.255.255.0
configure vlan "Voice-VoIP" qosprofile qp6

create vlan "Security-Cameras"
configure vlan "Security-Cameras" tag 400

# Port tagging & Uplinks
configure vlan "Mgmt-VR" add ports 1:1-1:48 untagged
configure vlan "Data-Corp" add ports 1:1-1:24 untagged
configure vlan "Data-Corp" add ports 1:49,1:50 tagged
configure vlan "Voice-VoIP" add ports 1:1-1:48 tagged
configure vlan "Security-Cameras" add ports 1:25-1:48 untagged
configure vlan "Security-Cameras" add ports 1:49,1:50 tagged

# Port Descriptions
configure port 1:1 description-string "UPLINK-FIREWALL-01"
configure port 1:2 description-string "SERVER-HYPERVISOR-A"
configure port 1:3 description-string "SERVER-HYPERVISOR-B"
configure port 1:4 description-string "STORAGE-SAN-MGMT"
configure port 1:49 description-string "CORE-TRUNK-TO-DC2"
configure port 1:50 description-string "BACKUP-LINK-TO-DIS"

# Routing & Default Gateway
configure iproute add default 10.36.226.1

# SSH & Access Security
enable ssh2
disable telnet
configure banner before-login "AUTHORIZED PERSONNEL ONLY - ALL SESSIONS LOGGED"
`,
    previousRevisions: [
      {
        id: "rev-01-01",
        timestamp: "Yesterday at 04:00 AM",
        filename: "SW-CORE-EXOS-01_2026-08-13.xsf",
        fileSizeKb: 14.2,
        format: "xsf",
        author: "BackupSave.py (Automated)",
        hash: "sha256:e3b0c44298fc1c149afbf4c8996fb924",
        changesSummary: "Baseline daily backup",
        content: `# Previous Revision 2026-08-13\nconfigure snmp sysName "SW-CORE-EXOS-01"\ncreate vlan "Mgmt-VR"\nconfigure vlan "Mgmt-VR" ipaddress 10.36.226.11 255.255.255.0\n`
      }
    ],
    ports: [
      { port: "1:1", name: "UPLINK-FIREWALL-01", vlan: "100", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "1:2", name: "SERVER-HYPERVISOR-A", vlan: "200", status: "up", speed: "10 Gbps" },
      { port: "1:3", name: "SERVER-HYPERVISOR-B", vlan: "200", status: "up", speed: "10 Gbps" },
      { port: "1:4", name: "STORAGE-SAN-MGMT", vlan: "100", status: "up", speed: "1 Gbps" },
      { port: "1:49", name: "CORE-TRUNK-TO-DC2", vlan: "Trunk (All)", status: "up", speed: "40 Gbps", isUplink: true },
      { port: "1:50", name: "BACKUP-LINK-TO-DIS", vlan: "Trunk (All)", status: "up", speed: "40 Gbps", isUplink: true }
    ],
    backupLldpNeighbors: [
      {
        localPort: "1:1",
        remoteSystemName: "FW-CORE-PFSENSE-01",
        remotePortId: "ix0",
        remotePortDesc: "LAN Trunks Interface",
        remoteChassisId: "00:e0:67:14:89:aa",
        remoteMgmtIp: "10.36.226.1",
        remoteSystemDesc: "Netgate pfSense Plus Core Firewall Appliance",
        remoteCapabilities: ["Router", "Bridge"],
        portVlan: 100,
        lastDiscovered: "Backup Run 04:15 AM"
      },
      {
        localPort: "1:2",
        remoteSystemName: "ESXI-HOST-01.corp.internal",
        remotePortId: "vmnic0",
        remotePortDesc: "10GbE SFP+ Uplink 1",
        remoteChassisId: "48:df:37:aa:bb:01",
        remoteMgmtIp: "10.36.200.21",
        remoteSystemDesc: "VMware ESXi 8.0.2 build-23305546",
        remoteCapabilities: ["Bridge", "Station"],
        portVlan: 200,
        lastDiscovered: "Backup Run 04:15 AM"
      },
      {
        localPort: "1:3",
        remoteSystemName: "ESXI-HOST-02.corp.internal",
        remotePortId: "vmnic0",
        remotePortDesc: "10GbE SFP+ Uplink 1",
        remoteChassisId: "48:df:37:aa:bb:02",
        remoteMgmtIp: "10.36.200.22",
        remoteSystemDesc: "VMware ESXi 8.0.2 build-23305546",
        remoteCapabilities: ["Bridge", "Station"],
        portVlan: 200,
        lastDiscovered: "Backup Run 04:15 AM"
      },
      {
        localPort: "1:4",
        remoteSystemName: "SAN-STORAGE-ISILON",
        remotePortId: "mgmt0",
        remotePortDesc: "Management 1GbE RJ45",
        remoteChassisId: "00:60:48:11:22:33",
        remoteMgmtIp: "10.36.226.50",
        remoteSystemDesc: "Dell PowerScale OneFS Storage Cluster",
        remoteCapabilities: ["Station"],
        portVlan: 100,
        lastDiscovered: "Backup Run 04:15 AM"
      },
      {
        localPort: "1:49",
        remoteSystemName: "SW-DC2-CORE-02",
        remotePortId: "1:49",
        remotePortDesc: "40G QSFP+ Inter-DC Trunk",
        remoteChassisId: "08:00:27:fa:99:49",
        remoteMgmtIp: "10.36.226.20",
        remoteSystemDesc: "ExtremeXOS (X670-G2-48x-4q) v31.7.1.4",
        remoteCapabilities: ["Bridge", "Router"],
        portVlan: "Trunk",
        lastDiscovered: "Backup Run 04:15 AM"
      },
      {
        localPort: "1:50",
        remoteSystemName: "SW-EDGE-EXOS-02",
        remotePortId: "49",
        remotePortDesc: "10G SFP+ Uplink to Core",
        remoteChassisId: "08:00:27:fa:82:12",
        remoteMgmtIp: "10.36.226.12",
        remoteSystemDesc: "ExtremeXOS (X440-G2-48p-10GE4) v30.7.2.1",
        remoteCapabilities: ["Bridge"],
        portVlan: "Trunk",
        lastDiscovered: "Backup Run 04:15 AM"
      }
    ],
    rawBackupLldpOutput: `-----------------------------------------------------------------------------
LLDP Neighbor Detail Output - SW-CORE-EXOS-01 (Cached from Nightly Backup)
CLI Command Executed: show lldp neighbors detailed
-----------------------------------------------------------------------------
Local Port: 1:1
  Neighbor Chassis ID      : 00:e0:67:14:89:aa (MAC address)
  Neighbor Port ID         : ix0 (Interface name)
  Neighbor Port Descr      : LAN Trunks Interface
  Neighbor System Name     : FW-CORE-PFSENSE-01
  Neighbor System Descr    : Netgate pfSense Plus Core Firewall Appliance
  Neighbor Mgmt Address    : 10.36.226.1 (IPv4)
  Neighbor Capabilities    : Router, Bridge (Enabled: Router)
  Port VLAN ID (PVID)      : 100

Local Port: 1:2
  Neighbor Chassis ID      : 48:df:37:aa:bb:01 (MAC address)
  Neighbor Port ID         : vmnic0
  Neighbor Port Descr      : 10GbE SFP+ Uplink 1
  Neighbor System Name     : ESXI-HOST-01.corp.internal
  Neighbor System Descr    : VMware ESXi 8.0.2 build-23305546
  Neighbor Mgmt Address    : 10.36.200.21 (IPv4)
  Neighbor Capabilities    : Bridge, Station (Enabled: Bridge)
  Port VLAN ID (PVID)      : 200

Local Port: 1:49
  Neighbor Chassis ID      : 08:00:27:fa:99:49 (MAC address)
  Neighbor Port ID         : 1:49
  Neighbor Port Descr      : 40G QSFP+ Inter-DC Trunk
  Neighbor System Name     : SW-DC2-CORE-02
  Neighbor System Descr    : ExtremeXOS (X670-G2-48x-4q) v31.7.1.4
  Neighbor Mgmt Address    : 10.36.226.20 (IPv4)
  Neighbor Capabilities    : Bridge, Router (Enabled: Bridge, Router)
  Port VLAN ID (PVID)      : 100 (Tagged: 100, 200, 300, 400)

Local Port: 1:50
  Neighbor Chassis ID      : 08:00:27:fa:82:12 (MAC address)
  Neighbor Port ID         : 49
  Neighbor Port Descr      : 10G SFP+ Uplink to Core
  Neighbor System Name     : SW-EDGE-EXOS-02
  Neighbor System Descr    : ExtremeXOS (X440-G2-48p-10GE4) v30.7.2.1
  Neighbor Mgmt Address    : 10.36.226.12 (IPv4)
  Neighbor Capabilities    : Bridge (Enabled: Bridge)
  Port VLAN ID (PVID)      : 100 (Tagged: 100, 210, 300, 500)
-----------------------------------------------------------------------------`
  },
  {
    id: "sw-02-edge",
    hostname: "SW-EDGE-EXOS-02",
    ip: "10.36.226.12",
    os: "EXOS",
    model: "Summit X440-G2-48p-10GE4",
    firmware: "EXOS 30.7.2.1-patch1-4",
    serialNumber: "1923N-44910",
    macAddress: "08:00:27:FA:82:12",
    primaryVlan: 100,
    gateway: "10.36.226.1",
    uplinkPorts: ["49", "50"],
    lastBackupTime: "Today at 04:18 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/SW-EDGE-EXOS-02.xsf",
    configFormat: "xsf",
    notes: "Edge Access Switch with PoE+ for VoIP phones and Wireless APs.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: SW-EDGE-EXOS-02 (Summit X440-G2-48p-10GE4)
# Management IP: 10.36.226.12/24

configure snmp sysName "SW-EDGE-EXOS-02"
configure snmp sysLocation "Building A - Floor 2 IDF"

create vlan "Mgmt-VR"
configure vlan "Mgmt-VR" tag 100
configure vlan "Mgmt-VR" ipaddress 10.36.226.12 255.255.255.0

create vlan "Workstations"
configure vlan "Workstations" tag 210

create vlan "Voice-VoIP"
configure vlan "Voice-VoIP" tag 300

create vlan "WiFi-Access"
configure vlan "WiFi-Access" tag 500

# Access Ports
configure vlan "Workstations" add ports 1-40 untagged
configure vlan "Voice-VoIP" add ports 1-40 tagged
configure vlan "WiFi-Access" add ports 41-48 untagged

# Uplink to Core
configure vlan "Mgmt-VR" add ports 49,50 tagged
configure vlan "Workstations" add ports 49,50 tagged
configure vlan "Voice-VoIP" add ports 49,50 tagged
configure vlan "WiFi-Access" add ports 49,50 tagged

# Port Descriptions
configure port 1 description-string "DESK-HR-01 (VoIP + PC)"
configure port 2 description-string "DESK-HR-02 (VoIP + PC)"
configure port 41 description-string "WAP-EXTREME-AP305C-01"
configure port 42 description-string "WAP-EXTREME-AP305C-02"
configure port 49 description-string "UPLINK-TO-CORE-X670"

# PoE Settings
enable inline-power ports 1-48
configure inline-power max-power 740

configure iproute add default 10.36.226.1
enable ssh2
`,
    previousRevisions: [
      {
        id: "rev-02-01",
        timestamp: "3 days ago",
        filename: "SW-EDGE-EXOS-02_2026-08-11.xsf",
        fileSizeKb: 11.8,
        format: "xsf",
        author: "BackupSave.py",
        hash: "sha256:88fa7b221098231c",
        content: `configure snmp sysName "SW-EDGE-EXOS-02"\ncreate vlan "Workstations"\n`
      }
    ],
    ports: [
      { port: "1", name: "DESK-HR-01 (VoIP + PC)", vlan: "210 (Voice: 300)", status: "up", speed: "1 Gbps", poeEnabled: true, poeWattage: 6.5 },
      { port: "2", name: "DESK-HR-02 (VoIP + PC)", vlan: "210 (Voice: 300)", status: "up", speed: "1 Gbps", poeEnabled: true, poeWattage: 6.8 },
      { port: "41", name: "WAP-EXTREME-AP305C-01", vlan: "500", status: "up", speed: "2.5 Gbps", poeEnabled: true, poeWattage: 14.2 },
      { port: "42", name: "WAP-EXTREME-AP305C-02", vlan: "500", status: "up", speed: "2.5 Gbps", poeEnabled: true, poeWattage: 13.9 },
      { port: "49", name: "UPLINK-TO-CORE-X670", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true }
    ],
    backupLldpNeighbors: [
      {
        localPort: "1",
        remoteSystemName: "SEP002497B1A2C3",
        remotePortId: "Port 1",
        remotePortDesc: "SW Port",
        remoteChassisId: "00:24:97:b1:a2:c3",
        remoteMgmtIp: "10.36.300.101",
        remoteSystemDesc: "Cisco IP Phone 8845 SIP Phone",
        remoteCapabilities: ["Telephone", "Bridge"],
        portVlan: "300 (Voice)",
        poeAllocated: "6.5W (Class 2)",
        lastDiscovered: "Backup Run 04:18 AM"
      },
      {
        localPort: "2",
        remoteSystemName: "SEP002497B1A2D4",
        remotePortId: "Port 1",
        remotePortDesc: "SW Port",
        remoteChassisId: "00:24:97:b1:a2:d4",
        remoteMgmtIp: "10.36.300.102",
        remoteSystemDesc: "Cisco IP Phone 8845 SIP Phone",
        remoteCapabilities: ["Telephone", "Bridge"],
        portVlan: "300 (Voice)",
        poeAllocated: "6.8W (Class 2)",
        lastDiscovered: "Backup Run 04:18 AM"
      },
      {
        localPort: "41",
        remoteSystemName: "WAP-EXTREME-AP305C-01",
        remotePortId: "eth0",
        remotePortDesc: "2.5GbE PoE+ Uplink",
        remoteChassisId: "20:c0:47:91:80:41",
        remoteMgmtIp: "10.36.500.21",
        remoteSystemDesc: "ExtremeCloud IQ AP305C Indoor Wi-Fi 6 AP",
        remoteCapabilities: ["WLAN Access Point", "Bridge", "Router"],
        portVlan: 500,
        poeAllocated: "14.2W (802.3at)",
        lastDiscovered: "Backup Run 04:18 AM"
      },
      {
        localPort: "42",
        remoteSystemName: "WAP-EXTREME-AP305C-02",
        remotePortId: "eth0",
        remotePortDesc: "2.5GbE PoE+ Uplink",
        remoteChassisId: "20:c0:47:91:80:42",
        remoteMgmtIp: "10.36.500.22",
        remoteSystemDesc: "ExtremeCloud IQ AP305C Indoor Wi-Fi 6 AP",
        remoteCapabilities: ["WLAN Access Point", "Bridge", "Router"],
        portVlan: 500,
        poeAllocated: "13.9W (802.3at)",
        lastDiscovered: "Backup Run 04:18 AM"
      },
      {
        localPort: "49",
        remoteSystemName: "SW-CORE-EXOS-01",
        remotePortId: "1:50",
        remotePortDesc: "BACKUP-LINK-TO-DIS",
        remoteChassisId: "08:00:27:fa:82:11",
        remoteMgmtIp: "10.36.226.11",
        remoteSystemDesc: "ExtremeXOS (Summit X670-G2-48x-4q) v31.7.1.4",
        remoteCapabilities: ["Bridge", "Router"],
        portVlan: "Trunk",
        lastDiscovered: "Backup Run 04:18 AM"
      }
    ],
    rawBackupLldpOutput: `-----------------------------------------------------------------------------
LLDP Neighbor Detail Output - SW-EDGE-EXOS-02 (Cached from Nightly Backup)
CLI Command Executed: show lldp neighbors detailed
-----------------------------------------------------------------------------
Local Port: 1
  Neighbor Chassis ID      : 00:24:97:b1:a2:c3 (MAC address)
  Neighbor Port ID         : Port 1 (Local)
  Neighbor Port Descr      : SW Port
  Neighbor System Name     : SEP002497B1A2C3
  Neighbor System Descr    : Cisco IP Phone 8845 SIP Phone
  Neighbor Mgmt Address    : 10.36.300.101 (IPv4)
  Neighbor Capabilities    : Telephone, Bridge (Enabled: Telephone)
  Port VLAN ID (PVID)      : 210 (Voice VLAN: 300)
  PoE Power Allocated      : 6.5W (IEEE 802.3af Class 2)

Local Port: 41
  Neighbor Chassis ID      : 20:c0:47:91:80:41 (MAC address)
  Neighbor Port ID         : eth0
  Neighbor Port Descr      : 2.5GbE PoE+ Uplink
  Neighbor System Name     : WAP-EXTREME-AP305C-01
  Neighbor System Descr    : ExtremeCloud IQ AP305C Indoor Wi-Fi 6 AP
  Neighbor Mgmt Address    : 10.36.500.21 (IPv4)
  Neighbor Capabilities    : WLAN Access Point, Bridge (Enabled: WLAN AP)
  Port VLAN ID (PVID)      : 500
  PoE Power Allocated      : 14.2W (IEEE 802.3at PoE+)

Local Port: 49
  Neighbor Chassis ID      : 08:00:27:fa:82:11 (MAC address)
  Neighbor Port ID         : 1:50
  Neighbor Port Descr      : BACKUP-LINK-TO-DIS
  Neighbor System Name     : SW-CORE-EXOS-01
  Neighbor System Descr    : ExtremeXOS (Summit X670-G2-48x-4q) v31.7.1.4
  Neighbor Mgmt Address    : 10.36.226.11 (IPv4)
  Neighbor Capabilities    : Bridge, Router (Enabled: Bridge, Router)
  Port VLAN ID (PVID)      : 100 (Tagged: 100, 210, 300, 500)
-----------------------------------------------------------------------------`
  },
  {
    id: "sw-03-voss-fabric",
    hostname: "SW-FABRIC-VOSS-01",
    ip: "10.36.226.25",
    os: "VOSS",
    model: "VSP 4450GSX-PWR+",
    firmware: "VOSS 8.4.1.0",
    serialNumber: "1850E-10023",
    macAddress: "70:30:18:22:9A:01",
    primaryVlan: 100,
    gateway: "10.36.226.1",
    uplinkPorts: ["1/49", "1/50"],
    lastBackupTime: "Today at 04:22 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/SW-FABRIC-VOSS-01.cfg",
    configFormat: "cfg",
    notes: "Fabric Connect VSP Switch running SPBM (Shortest Path Bridging MAC).",
    activeConfig: `! VOSS Configuration File (.cfg)
! Generated for Switch: SW-FABRIC-VOSS-01
! OS: Extreme Virtual OS (VOSS / VSP Series)
! Management IP: 10.36.226.25/24

prompt "SW-FABRIC-VOSS-01"
snmp-server location "Datacenter Row 3"
snmp-server contact "NOC Fabric Team"

! Global SPBM Fabric Engine
spbm
spbm nick-name 1.10.01
spbm b-vlan 4051,4052
spbm is-is enable

! VLAN & I-SID (Fabric Service) Configurations
vlan create 100 type port-mstprstp 0
vlan name 100 "Mgmt-VLAN"

vlan create 200 type port-mstprstp 0
vlan name 200 "Data-Fabric-ISID"
vlan i-sid 200 20000

vlan create 300 type port-mstprstp 0
vlan name 300 "Voice-Fabric-ISID"
vlan i-sid 300 30000

! Interface IP Management
interface Vlan 100
  ip address 10.36.226.25 255.255.255.0
  ip default-gateway 10.36.226.1
exit

! Port Configurations & NNI Fabric Links
interface GigabitEthernet 1/1
  name "UPLINK-TO-FABRIC-SPINE-01"
  no shutdown
  isis
  isis spbm 1
  isis enable
exit

interface GigabitEthernet 1/2
  name "UPLINK-TO-FABRIC-SPINE-02"
  no shutdown
  isis
  isis spbm 1
  isis enable
exit

interface GigabitEthernet 1/10
  name "ACCESS-SERVER-BLADE-01"
  untagged-traffic-vlan 200
  no shutdown
exit

! Management Access
ssh
no telnet
banner "Extreme VOSS Enterprise Fabric Node - Authorized Access Only"
`,
    previousRevisions: [
      {
        id: "rev-03-01",
        timestamp: "5 days ago",
        filename: "SW-FABRIC-VOSS-01_2026-08-09.cfg",
        fileSizeKb: 18.4,
        format: "cfg",
        author: "extreme_switch_backup.py",
        hash: "sha256:71982bca881",
        content: `! VOSS Revision\nprompt "SW-FABRIC-VOSS-01"\nspbm\n`
      }
    ],
    ports: [
      { port: "1/1", name: "UPLINK-TO-FABRIC-SPINE-01", vlan: "SPBM-NNI", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "1/2", name: "UPLINK-TO-FABRIC-SPINE-02", vlan: "SPBM-NNI", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "1/10", name: "ACCESS-SERVER-BLADE-01", vlan: "200 (I-SID 20000)", status: "up", speed: "1 Gbps" },
      { port: "1/11", name: "ACCESS-SERVER-BLADE-02", vlan: "200 (I-SID 20000)", status: "up", speed: "1 Gbps" }
    ],
    backupLldpNeighbors: [
      {
        localPort: "1/1",
        remoteSystemName: "VSP-7400-SPINE-01",
        remotePortId: "1/1",
        remotePortDesc: "SPBM Backbone NNI Trunk",
        remoteChassisId: "70:30:18:99:aa:01",
        remoteMgmtIp: "10.36.226.31",
        remoteSystemDesc: "Extreme VOSS VSP 7400 Series Fabric Core",
        remoteCapabilities: ["Bridge", "Router"],
        portVlan: "SPBM-4051/4052",
        lastDiscovered: "Backup Run 04:22 AM"
      },
      {
        localPort: "1/2",
        remoteSystemName: "VSP-7400-SPINE-02",
        remotePortId: "1/1",
        remotePortDesc: "SPBM Backbone NNI Trunk",
        remoteChassisId: "70:30:18:99:aa:02",
        remoteMgmtIp: "10.36.226.32",
        remoteSystemDesc: "Extreme VOSS VSP 7400 Series Fabric Core",
        remoteCapabilities: ["Bridge", "Router"],
        portVlan: "SPBM-4051/4052",
        lastDiscovered: "Backup Run 04:22 AM"
      },
      {
        localPort: "1/10",
        remoteSystemName: "HPE-SYNERGY-BLADE-01",
        remotePortId: "Bay1-Mgmt",
        remotePortDesc: "HPE Virtual Connect SE 100Gb F32 Module",
        remoteChassisId: "2c:54:91:20:11:80",
        remoteMgmtIp: "10.36.200.41",
        remoteSystemDesc: "HPE Synergy Compute Node Enclosure",
        remoteCapabilities: ["Bridge", "Station"],
        portVlan: 200,
        lastDiscovered: "Backup Run 04:22 AM"
      }
    ],
    rawBackupLldpOutput: `-----------------------------------------------------------------------------
LLDP Neighbor Detail Output - SW-FABRIC-VOSS-01 (Cached from Nightly Backup)
CLI Command Executed: show lldp neighbor
-----------------------------------------------------------------------------
Port: 1/1
  Chassis Id: 70:30:18:99:aa:01
  Port Id: 1/1
  Port Description: SPBM Backbone NNI Trunk
  System Name: VSP-7400-SPINE-01
  System Description: Extreme VOSS VSP 7400 Series Fabric Core
  Management Address: 10.36.226.31
  Capabilities Supported: Bridge, Router
  Capabilities Enabled: Bridge, Router

Port: 1/2
  Chassis Id: 70:30:18:99:aa:02
  Port Id: 1/1
  Port Description: SPBM Backbone NNI Trunk
  System Name: VSP-7400-SPINE-02
  System Description: Extreme VOSS VSP 7400 Series Fabric Core
  Management Address: 10.36.226.32
  Capabilities Supported: Bridge, Router
  Capabilities Enabled: Bridge, Router
-----------------------------------------------------------------------------`
  },
  {
    id: "sw-04-remote-hop",
    hostname: "SW-REMOTE-EXOS-04",
    ip: "10.45.10.5",
    os: "EXOS",
    model: "Summit X460-G2-24t-24p",
    firmware: "EXOS 31.5.1.8",
    serialNumber: "2041N-11983",
    macAddress: "08:00:27:FA:82:44",
    primaryVlan: 50,
    gateway: "10.45.10.1",
    uplinkPorts: ["25", "26"],
    lastBackupTime: "Today at 04:30 AM",
    lastBackupStatus: "Success",
    hopThrough: "10.36.226.11", // Second hop / jump box
    tftpPath: "10.36.226.7:/backup/SW-REMOTE-EXOS-04.xsf",
    configFormat: "xsf",
    notes: "Isolated Remote Subnet. Backed up via hop transit through 10.36.226.11.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: SW-REMOTE-EXOS-04 (Summit X460-G2-24t-24p)
# Subnet: 10.45.10.5/24 (Accessed via Hop: 10.36.226.11)

configure snmp sysName "SW-REMOTE-EXOS-04"
configure snmp sysLocation "Remote Branch Office"

create vlan "Branch-Mgmt"
configure vlan "Branch-Mgmt" tag 50
configure vlan "Branch-Mgmt" ipaddress 10.45.10.5 255.255.255.0

create vlan "Branch-LAN"
configure vlan "Branch-LAN" tag 150

configure vlan "Branch-LAN" add ports 1-24 untagged
configure vlan "Branch-Mgmt" add ports 25,26 tagged
configure vlan "Branch-LAN" add ports 25,26 tagged

configure port 1 description-string "PRINTER-OFFICE"
configure port 2 description-string "WAP-OFFICE"
configure port 25 description-string "WAN-ROUTER-IPSEC-TUNNEL"

configure iproute add default 10.45.10.1
enable ssh2
`,
    previousRevisions: [],
    ports: [
      { port: "1", name: "PRINTER-OFFICE", vlan: "150", status: "up", speed: "100 Mbps" },
      { port: "2", name: "WAP-OFFICE", vlan: "150", status: "up", speed: "1 Gbps", poeEnabled: true, poeWattage: 11.4 },
      { port: "25", name: "WAN-ROUTER-IPSEC-TUNNEL", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true }
    ],
    backupLldpNeighbors: [
      {
        localPort: "2",
        remoteSystemName: "WAP-BRANCH-01",
        remotePortId: "eth0",
        remotePortDesc: "GigabitEthernet Uplink",
        remoteChassisId: "20:c0:47:88:12:05",
        remoteMgmtIp: "10.45.10.20",
        remoteSystemDesc: "Extreme Wireless AP3915i Branch Access Point",
        remoteCapabilities: ["WLAN Access Point", "Bridge"],
        portVlan: 150,
        poeAllocated: "11.4W",
        lastDiscovered: "Backup Run 04:30 AM"
      },
      {
        localPort: "25",
        remoteSystemName: "ROUTER-BRANCH-WAN",
        remotePortId: "GigabitEthernet0/0/0",
        remotePortDesc: "LAN Trunks Interface",
        remoteChassisId: "5c:5b:35:99:01:25",
        remoteMgmtIp: "10.45.10.1",
        remoteSystemDesc: "Cisco ISR 4331 Router IOS-XE 17.06.03a",
        remoteCapabilities: ["Router", "Bridge"],
        portVlan: 50,
        lastDiscovered: "Backup Run 04:30 AM"
      }
    ],
    rawBackupLldpOutput: `-----------------------------------------------------------------------------
LLDP Neighbor Detail Output - SW-REMOTE-EXOS-04 (Hop Transit via 10.36.226.11)
CLI Command Executed: show lldp neighbors detailed
-----------------------------------------------------------------------------
Local Port: 2
  Neighbor System Name     : WAP-BRANCH-01
  Neighbor Mgmt Address    : 10.45.10.20
  Neighbor Capabilities    : WLAN Access Point, Bridge
  PoE Power Allocated      : 11.4W

Local Port: 25
  Neighbor System Name     : ROUTER-BRANCH-WAN
  Neighbor Port ID         : GigabitEthernet0/0/0
  Neighbor Mgmt Address    : 10.45.10.1
  Neighbor Capabilities    : Router, Bridge
-----------------------------------------------------------------------------`
  },
  {
    id: "sw-05-warning-stack",
    hostname: "SW-WAREHOUSE-5520",
    ip: "10.36.226.88",
    os: "EXOS",
    model: "Extreme 5520-48W-4X-4Y",
    firmware: "EXOS 32.2.1.5",
    serialNumber: "2201N-99401",
    macAddress: "08:00:27:BB:33:88",
    primaryVlan: 100,
    gateway: "10.36.226.1",
    uplinkPorts: ["1:51", "1:52"],
    lastBackupTime: "Yesterday at 04:45 AM",
    lastBackupStatus: "Warning",
    tftpPath: "10.36.226.7:/backup/SW-WAREHOUSE-5520.xsf",
    configFormat: "xsf",
    notes: "Warning: Unsaved configuration detected on switch during last run. Auto-saved before TFTP export.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: SW-WAREHOUSE-5520 (Extreme 5520 Universal Switch)
# Management IP: 10.36.226.88/24

configure snmp sysName "SW-WAREHOUSE-5520"
configure snmp sysLocation "Logistics Warehouse IDF 1"

create vlan "Mgmt-VR"
configure vlan "Mgmt-VR" tag 100
configure vlan "Mgmt-VR" ipaddress 10.36.226.88 255.255.255.0

create vlan "Logistics-Scanners"
configure vlan "Logistics-Scanners" tag 600

configure vlan "Logistics-Scanners" add ports 1:1-1:48 untagged
configure vlan "Mgmt-VR" add ports 1:51,1:52 tagged
configure vlan "Logistics-Scanners" add ports 1:51,1:52 tagged

configure port 1:1 description-string "BARCODE-SCANNER-CRADLE-01"
configure port 1:2 description-string "BARCODE-SCANNER-CRADLE-02"
configure port 1:51 description-string "FIBER-UPLINK-TO-CORE"

configure iproute add default 10.36.226.1
enable ssh2
`,
    previousRevisions: [],
    ports: [
      { port: "1:1", name: "BARCODE-SCANNER-CRADLE-01", vlan: "600", status: "up", speed: "100 Mbps" },
      { port: "1:2", name: "BARCODE-SCANNER-CRADLE-02", vlan: "600", status: "up", speed: "100 Mbps" },
      { port: "1:51", name: "FIBER-UPLINK-TO-CORE", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true }
    ],
    backupLldpNeighbors: [
      {
        localPort: "1:1",
        remoteSystemName: "ZEBRA-CRADLE-STATION-01",
        remotePortId: "eth0",
        remotePortDesc: "Ethernet Cradle Base",
        remoteChassisId: "00:07:4d:19:90:01",
        remoteMgmtIp: "10.36.600.11",
        remoteSystemDesc: "Zebra Technologies TC57 Handheld Scanner Base Station",
        remoteCapabilities: ["Station"],
        portVlan: 600,
        lastDiscovered: "Yesterday at 04:45 AM"
      },
      {
        localPort: "1:51",
        remoteSystemName: "SW-CORE-EXOS-01",
        remotePortId: "1:48",
        remotePortDesc: "10G Fiber Link to Warehouse IDF",
        remoteChassisId: "08:00:27:fa:82:11",
        remoteMgmtIp: "10.36.226.11",
        remoteSystemDesc: "ExtremeXOS (Summit X670-G2-48x-4q) v31.7.1.4",
        remoteCapabilities: ["Bridge", "Router"],
        portVlan: "Trunk",
        lastDiscovered: "Yesterday at 04:45 AM"
      }
    ],
    rawBackupLldpOutput: `-----------------------------------------------------------------------------
LLDP Neighbor Detail Output - SW-WAREHOUSE-5520 (Cached from Backup)
CLI Command Executed: show lldp neighbors detailed
-----------------------------------------------------------------------------
Local Port: 1:1
  Neighbor System Name     : ZEBRA-CRADLE-STATION-01
  Neighbor Chassis ID      : 00:07:4d:19:90:01
  Neighbor Mgmt Address    : 10.36.600.11
  Neighbor Capabilities    : Station
  Port VLAN ID (PVID)      : 600

Local Port: 1:51
  Neighbor System Name     : SW-CORE-EXOS-01
  Neighbor Port ID         : 1:48
  Neighbor Mgmt Address    : 10.36.226.11
  Neighbor Capabilities    : Bridge, Router
  Port VLAN ID (PVID)      : 100 (Tagged: 100, 600)
-----------------------------------------------------------------------------`
  },
  {
    id: "sw-york-core",
    hostname: "DLC-York-Core",
    ip: "10.32.221.253",
    os: "EXOS",
    model: "Summit X670-G2-48x-4q",
    firmware: "EXOS 31.7.1.4",
    serialNumber: "2148N-88120",
    macAddress: "08:00:27:EA:91:01",
    primaryVlan: 10,
    gateway: "10.32.221.1",
    uplinkPorts: ["1:1", "1:2", "1:9", "1:37", "1:41", "1:42"],
    lastBackupTime: "Today at 04:00 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/DLC-York-Core.xsf",
    configFormat: "xsf",
    notes: "York Core Aggregation Switch. Fiber trunks to Firewalls (York-MXP, York-MXS) and edge distribution switches.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: DLC-York-Core (Summit X670-G2-48x-4q)
# Site: YORK | Mgmt IP: 10.32.221.253/24

configure snmp sysName "DLC-York-Core"
configure snmp sysLocation "York Main Comms Room Rack 1"

create vlan "Mgmt-VR"
configure vlan "Mgmt-VR" tag 10
configure vlan "Mgmt-VR" ipaddress 10.32.221.253 255.255.255.0

create vlan "Data-Corp"
configure vlan "Data-Corp" tag 20
configure vlan "Voice-VoIP" tag 30

configure vlan "Mgmt-VR" add ports 1:1-1:48 tagged
configure vlan "Data-Corp" add ports 1:1-1:48 tagged
configure vlan "Voice-VoIP" add ports 1:1-1:48 tagged

# Port Descriptions & Uplink Assignments
configure port 1:1 description-string "UPLINK-YORK-MXP-FW-PRIMARY"
configure port 1:2 description-string "UPLINK-YORK-MXS-FW-SECONDARY"
configure port 1:9 description-string "TRUNK-TO-DLC-YORK-SPA-SW1"
configure port 1:37 description-string "TRUNK-TO-DLC-YORK-GYM"
configure port 1:41 description-string "TRUNK-TO-DLC-YORK-MAINCOMMS-2"
configure port 1:42 description-string "TRUNK-TO-DLL-YORK"

configure iproute add default 10.32.221.1
enable ssh2
`,
    previousRevisions: [
      {
        id: "rev-york-01",
        timestamp: "Yesterday at 04:00 AM",
        filename: "DLC-York-Core_2026-08-13.xsf",
        fileSizeKb: 16.4,
        format: "xsf",
        author: "BackupSave.py (Automated)",
        hash: "sha256:8899aabbccdd1122",
        changesSummary: "Nightly automated baseline backup",
        content: `configure snmp sysName "DLC-York-Core"\ncreate vlan "Mgmt-VR"\n`
      }
    ],
    ports: [
      { port: "1:1", name: "UPLINK-YORK-MXP-FW-PRIMARY", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "1:2", name: "UPLINK-YORK-MXS-FW-SECONDARY", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "1:9", name: "TRUNK-TO-DLC-YORK-SPA-SW1", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "1:37", name: "TRUNK-TO-DLC-YORK-GYM", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "1:41", name: "TRUNK-TO-DLC-YORK-MAINCOMMS-2", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "1:42", name: "TRUNK-TO-DLL-YORK", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true }
    ],
    backupLldpNeighbors: [
      {
        localPort: "1:1",
        remoteSystemName: "York-MXP",
        remotePortId: "Port 1",
        remotePortDesc: "LAN Interface",
        remoteChassisId: "58:21:7f:10:01:01",
        remoteMgmtIp: "10.32.221.1",
        remoteSystemDesc: "Meraki MX Primary Firewall",
        remoteCapabilities: ["Router", "Bridge"],
        portVlan: 10,
        lastDiscovered: "Today at 04:00 AM"
      },
      {
        localPort: "1:2",
        remoteSystemName: "York-MXS",
        remotePortId: "Port 2",
        remotePortDesc: "LAN Interface",
        remoteChassisId: "58:21:7f:10:01:02",
        remoteMgmtIp: "10.32.221.2",
        remoteSystemDesc: "Meraki MX Secondary Firewall",
        remoteCapabilities: ["Router", "Bridge"],
        portVlan: 10,
        lastDiscovered: "Today at 04:00 AM"
      },
      {
        localPort: "1:9",
        remoteSystemName: "DLC-York-Spa-SW1",
        remotePortId: "1",
        remotePortDesc: "Uplink to Core",
        remoteChassisId: "08:00:27:ea:91:02",
        remoteMgmtIp: "10.32.221.252",
        remoteSystemDesc: "ExtremeXOS (X440-G2-24p)",
        remoteCapabilities: ["Bridge"],
        portVlan: "Trunk",
        lastDiscovered: "Today at 04:00 AM"
      },
      {
        localPort: "1:37",
        remoteSystemName: "DLC-York-Gym",
        remotePortId: "1",
        remotePortDesc: "Uplink to Core",
        remoteChassisId: "08:00:27:ea:91:03",
        remoteMgmtIp: "10.32.221.250",
        remoteSystemDesc: "ExtremeXOS (X440-G2-24p)",
        remoteCapabilities: ["Bridge"],
        portVlan: "Trunk",
        lastDiscovered: "Today at 04:00 AM"
      },
      {
        localPort: "1:41",
        remoteSystemName: "DLC-York-MainComms-2",
        remotePortId: "48",
        remotePortDesc: "Uplink to Core",
        remoteChassisId: "08:00:27:ea:91:04",
        remoteMgmtIp: "10.32.221.248",
        remoteSystemDesc: "ExtremeXOS (X440-G2-48p)",
        remoteCapabilities: ["Bridge"],
        portVlan: "Trunk",
        lastDiscovered: "Today at 04:00 AM"
      },
      {
        localPort: "1:42",
        remoteSystemName: "DLL-York",
        remotePortId: "17",
        remotePortDesc: "Uplink to Core",
        remoteChassisId: "08:00:27:ea:91:05",
        remoteMgmtIp: "10.32.221.249",
        remoteSystemDesc: "ExtremeXOS (X450-G2-48p)",
        remoteCapabilities: ["Bridge"],
        portVlan: "Trunk",
        lastDiscovered: "Today at 04:00 AM"
      }
    ]
  },
  {
    id: "sw-york-spa",
    hostname: "DLC-York-Spa-SW1",
    ip: "10.32.221.252",
    os: "EXOS",
    model: "Summit X440-G2-24p-10GE4",
    firmware: "EXOS 31.5.1.8",
    serialNumber: "2019N-44102",
    macAddress: "08:00:27:EA:91:02",
    primaryVlan: 10,
    gateway: "10.32.221.1",
    uplinkPorts: ["1"],
    lastBackupTime: "Today at 04:02 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/DLC-York-Spa-SW1.xsf",
    configFormat: "xsf",
    notes: "York Spa Edge Switch. Uplink Port 1 connects to Core Port 9.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: DLC-York-Spa-SW1
configure snmp sysName "DLC-York-Spa-SW1"
configure snmp sysLocation "York Spa Subrack"
configure port 1 description-string "UPLINK-TO-DLC-YORK-CORE-PORT-9"
configure port 2 description-string "SPA-RECEPTION-PC"
configure port 3 description-string "SPA-TILL-PRINTER"
enable inline-power ports 1-24
enable ssh2
`,
    previousRevisions: [],
    ports: [
      { port: "1", name: "UPLINK-TO-DLC-YORK-CORE-PORT-9", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true },
      { port: "2", name: "SPA-RECEPTION-PC", vlan: "20", status: "up", speed: "1 Gbps" },
      { port: "3", name: "SPA-TILL-PRINTER", vlan: "20", status: "up", speed: "100 Mbps" }
    ]
  },
  {
    id: "sw-york-gym",
    hostname: "DLC-York-Gym",
    ip: "10.32.221.250",
    os: "EXOS",
    model: "Summit X440-G2-24p-10GE4",
    firmware: "EXOS 31.5.1.8",
    serialNumber: "2019N-44103",
    macAddress: "08:00:27:EA:91:03",
    primaryVlan: 10,
    gateway: "10.32.221.1",
    uplinkPorts: ["1"],
    lastBackupTime: "Today at 04:04 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/DLC-York-Gym.xsf",
    configFormat: "xsf",
    notes: "York Gym Edge Switch. Uplink Port 1 connects to Core Port 37.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: DLC-York-Gym
configure snmp sysName "DLC-York-Gym"
configure snmp sysLocation "York Gym Subrack"
configure port 1 description-string "UPLINK-TO-DLC-YORK-CORE-PORT-37"
configure port 2 description-string "GYM-ACCESS-POINT-AP505"
enable inline-power ports 1-24
enable ssh2
`,
    previousRevisions: [],
    ports: [
      { port: "1", name: "UPLINK-TO-DLC-YORK-CORE-PORT-37", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true },
      { port: "2", name: "GYM-ACCESS-POINT-AP505", vlan: "20", status: "up", speed: "1 Gbps", poeEnabled: true, poeWattage: 12.8 }
    ]
  },
  {
    id: "sw-york-dll",
    hostname: "DLL-York",
    ip: "10.32.221.249",
    os: "EXOS",
    model: "Summit X450-G2-48p-10GE4",
    firmware: "EXOS 31.6.2.3",
    serialNumber: "2021N-55104",
    macAddress: "08:00:27:EA:91:05",
    primaryVlan: 10,
    gateway: "10.32.221.1",
    uplinkPorts: ["17"],
    lastBackupTime: "Today at 04:06 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/DLL-York.xsf",
    configFormat: "xsf",
    notes: "York DLL Distribution Switch. Uplink Port 17 connects to Core Port 42.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: DLL-York
configure snmp sysName "DLL-York"
configure snmp sysLocation "York DLL Communications Room"
configure port 17 description-string "UPLINK-TO-DLC-YORK-CORE-PORT-42"
enable inline-power ports 1-48
enable ssh2
`,
    previousRevisions: [],
    ports: [
      { port: "17", name: "UPLINK-TO-DLC-YORK-CORE-PORT-42", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true },
      { port: "1", name: "OFFICE-DESK-01", vlan: "20", status: "up", speed: "1 Gbps" }
    ]
  },
  {
    id: "sw-york-maincomms-2",
    hostname: "DLC-York-MainComms-2",
    ip: "10.32.221.248",
    os: "EXOS",
    model: "Summit X440-G2-48p-10GE4",
    firmware: "EXOS 31.5.1.8",
    serialNumber: "2019N-44105",
    macAddress: "08:00:27:EA:91:04",
    primaryVlan: 10,
    gateway: "10.32.221.1",
    uplinkPorts: ["48"],
    lastBackupTime: "Today at 04:08 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/DLC-York-MainComms-2.xsf",
    configFormat: "xsf",
    notes: "York Main Comms 2 Switch. Uplink Port 48 connects to Core Port 41.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: DLC-York-MainComms-2
configure snmp sysName "DLC-York-MainComms-2"
configure snmp sysLocation "York Main Comms Room Rack 2"
configure port 48 description-string "UPLINK-TO-DLC-YORK-CORE-PORT-41"
enable inline-power ports 1-48
enable ssh2
`,
    previousRevisions: [],
    ports: [
      { port: "48", name: "UPLINK-TO-DLC-YORK-CORE-PORT-41", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true },
      { port: "1", name: "SERVER-ILO-MGMT", vlan: "10", status: "up", speed: "1 Gbps" }
    ]
  },
  {
    id: "sw-aberdeen-core",
    hostname: "DLL-Aberdeen-Comms",
    ip: "10.32.224.253",
    os: "EXOS",
    model: "Summit X460-G2-48p-10GE4",
    firmware: "EXOS 31.7.1.4",
    serialNumber: "2148N-88129",
    macAddress: "08:00:27:EA:92:01",
    primaryVlan: 10,
    gateway: "10.32.224.1",
    uplinkPorts: ["1", "2", "12", "32"],
    lastBackupTime: "Today at 04:12 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/DLL-Aberdeen-Comms.xsf",
    configFormat: "xsf",
    notes: "Aberdeen Core Switch. Trunks to Firewalls (Aberdeen-MXP, Aberdeen-MXS) and distribution switches.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: DLL-Aberdeen-Comms (Summit X460-G2-48p)
# Site: ABERDEEN | Mgmt IP: 10.32.224.253/24

configure snmp sysName "DLL-Aberdeen-Comms"
configure snmp sysLocation "Aberdeen Main Comms Room Rack 1"

create vlan "Mgmt-VR"
configure vlan "Mgmt-VR" tag 10
configure vlan "Mgmt-VR" ipaddress 10.32.224.253 255.255.255.0

create vlan "Data-Corp"
configure vlan "Data-Corp" tag 20
configure vlan "Voice-VoIP" tag 30

configure vlan "Mgmt-VR" add ports 1-48 tagged
configure vlan "Data-Corp" add ports 1-48 tagged
configure vlan "Voice-VoIP" add ports 1-48 tagged

configure port 1 description-string "UPLINK-ABERDEEN-MXP-PRIMARY"
configure port 2 description-string "UPLINK-ABERDEEN-MXS-SECONDARY"
configure port 12 description-string "TRUNK-TO-DLC-ABERDEEN-GYM"
configure port 32 description-string "TRUNK-TO-DLC-ABERDEEN-LYNXIGHT"

configure iproute add default 10.32.224.1
enable ssh2
`,
    previousRevisions: [
      {
        id: "rev-aberdeen-01",
        timestamp: "Yesterday at 04:00 AM",
        filename: "DLL-Aberdeen-Comms_2026-08-13.xsf",
        fileSizeKb: 15.1,
        format: "xsf",
        author: "BackupSave.py (Automated)",
        hash: "sha256:778899aabbcc0011",
        changesSummary: "Nightly baseline automated backup",
        content: `configure snmp sysName "DLL-Aberdeen-Comms"\ncreate vlan "Mgmt-VR"\n`
      }
    ],
    ports: [
      { port: "1", name: "UPLINK-ABERDEEN-MXP-PRIMARY", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "2", name: "UPLINK-ABERDEEN-MXS-SECONDARY", vlan: "Trunk", status: "up", speed: "10 Gbps", isUplink: true },
      { port: "12", name: "TRUNK-TO-DLC-ABERDEEN-GYM", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true },
      { port: "32", name: "TRUNK-TO-DLC-ABERDEEN-LYNXIGHT", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true }
    ],
    backupLldpNeighbors: [
      {
        localPort: "1",
        remoteSystemName: "Aberdeen-MXP",
        remotePortId: "Port 1",
        remotePortDesc: "LAN Interface",
        remoteChassisId: "58:21:7f:20:01:01",
        remoteMgmtIp: "10.32.224.1",
        remoteSystemDesc: "Meraki MX Primary Firewall",
        remoteCapabilities: ["Router", "Bridge"],
        portVlan: 10,
        lastDiscovered: "Today at 04:12 AM"
      },
      {
        localPort: "2",
        remoteSystemName: "Aberdeen-MXS",
        remotePortId: "Port 2",
        remotePortDesc: "LAN Interface",
        remoteChassisId: "58:21:7f:20:01:02",
        remoteMgmtIp: "10.32.224.2",
        remoteSystemDesc: "Meraki MX Secondary Firewall",
        remoteCapabilities: ["Router", "Bridge"],
        portVlan: 10,
        lastDiscovered: "Today at 04:12 AM"
      },
      {
        localPort: "12",
        remoteSystemName: "DLC-Aberdeen-Gym",
        remotePortId: "1",
        remotePortDesc: "Uplink to Core",
        remoteChassisId: "08:00:27:ea:92:03",
        remoteMgmtIp: "10.32.224.251",
        remoteSystemDesc: "ExtremeXOS (X440-G2-24p)",
        remoteCapabilities: ["Bridge"],
        portVlan: "Trunk",
        lastDiscovered: "Today at 04:12 AM"
      },
      {
        localPort: "32",
        remoteSystemName: "DLC-Aberdeen-Lynxight",
        remotePortId: "1",
        remotePortDesc: "Uplink to Core",
        remoteChassisId: "08:00:27:ea:92:02",
        remoteMgmtIp: "10.32.224.252",
        remoteSystemDesc: "ExtremeXOS (X440-G2-24p)",
        remoteCapabilities: ["Bridge"],
        portVlan: "Trunk",
        lastDiscovered: "Today at 04:12 AM"
      }
    ]
  },
  {
    id: "sw-aberdeen-lynxight",
    hostname: "DLC-Aberdeen-Lynxight",
    ip: "10.32.224.252",
    os: "EXOS",
    model: "Summit X440-G2-24p-10GE4",
    firmware: "EXOS 31.5.1.8",
    serialNumber: "2019N-44122",
    macAddress: "08:00:27:EA:92:02",
    primaryVlan: 10,
    gateway: "10.32.224.1",
    uplinkPorts: ["1"],
    lastBackupTime: "Today at 04:14 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/DLC-Aberdeen-Lynxight.xsf",
    configFormat: "xsf",
    notes: "Aberdeen Lynxight Pool Monitoring Switch. Uplink Port 1 connects to Core Port 32.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: DLC-Aberdeen-Lynxight
configure snmp sysName "DLC-Aberdeen-Lynxight"
configure snmp sysLocation "Aberdeen Pool Plant Room"
configure port 1 description-string "UPLINK-TO-DLL-ABERDEEN-COMMS-PORT-32"
enable inline-power ports 1-24
enable ssh2
`,
    previousRevisions: [],
    ports: [
      { port: "1", name: "UPLINK-TO-DLL-ABERDEEN-COMMS-PORT-32", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true },
      { port: "2", name: "LYNXIGHT-CAMERA-01", vlan: "40", status: "up", speed: "100 Mbps", poeEnabled: true, poeWattage: 14.2 },
      { port: "3", name: "LYNXIGHT-CAMERA-02", vlan: "40", status: "up", speed: "100 Mbps", poeEnabled: true, poeWattage: 13.8 }
    ]
  },
  {
    id: "sw-aberdeen-gym",
    hostname: "DLC-Aberdeen-Gym",
    ip: "10.32.224.251",
    os: "EXOS",
    model: "Summit X440-G2-24p-10GE4",
    firmware: "EXOS 31.5.1.8",
    serialNumber: "2019N-44123",
    macAddress: "08:00:27:EA:92:03",
    primaryVlan: 10,
    gateway: "10.32.224.1",
    uplinkPorts: ["1"],
    lastBackupTime: "Today at 04:16 AM",
    lastBackupStatus: "Success",
    tftpPath: "10.36.226.7:/backup/DLC-Aberdeen-Gym.xsf",
    configFormat: "xsf",
    notes: "Aberdeen Gym Distribution Switch. Uplink Port 1 connects to Core Port 12.",
    activeConfig: `# ExtremeXOS Configuration File (.xsf)
# Switch: DLC-Aberdeen-Gym
configure snmp sysName "DLC-Aberdeen-Gym"
configure snmp sysLocation "Aberdeen Gym Subrack"
configure port 1 description-string "UPLINK-TO-DLL-ABERDEEN-COMMS-PORT-12"
enable inline-power ports 1-24
enable ssh2
`,
    previousRevisions: [],
    ports: [
      { port: "1", name: "UPLINK-TO-DLL-ABERDEEN-COMMS-PORT-12", vlan: "Trunk", status: "up", speed: "1 Gbps", isUplink: true },
      { port: "2", name: "GYM-WIFI-AP505", vlan: "20", status: "up", speed: "1 Gbps", poeEnabled: true, poeWattage: 12.5 }
    ]
  }
];
