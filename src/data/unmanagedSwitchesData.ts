// src/data/unmanagedSwitchesData.ts
export interface DiscoveredUnmanagedSwitch {
  id: string;
  vendor: "Netgear" | "TP-Link" | "D-Link" | "Linksys" | "Cisco Small Business" | "Unknown";
  model: string;
  ipAddress: string;
  macAddress: string;
  parentSwitchHostname: string;
  parentSwitchIp: string;
  connectedPort: string;
  detectedSubnet: string;
  firstSeen: string;
  status: "active" | "investigating" | "approved_temporary" | "quarantined";
  siteCode: string;
  confidenceScore: number;
  detectedDevicesBehindCount: number;
  riskLevel: "Low" | "Medium" | "High";
  notes?: string;
}

export const DISCOVERED_UNMANAGED_SWITCHES: DiscoveredUnmanagedSwitch[] = [
  // --- NORTHWOOD NETGEAR & ROGUE DEVICES ---
  {
    id: "rogue-ng-nw-01",
    vendor: "Netgear",
    model: "ProSAFE GS108PE 8-Port Gigabit PoE",
    ipAddress: "10.32.172.188",
    macAddress: "A0:04:60:22:9E:1A",
    parentSwitchHostname: "DLL-Northwood",
    parentSwitchIp: "10.32.172.253",
    connectedPort: "1:14",
    detectedSubnet: "10.32.172.0/24",
    firstSeen: "Yesterday at 16:40",
    status: "active",
    siteCode: "NORTHWOOD",
    confidenceScore: 99,
    detectedDevicesBehindCount: 6,
    riskLevel: "High",
    notes: "Northwood Gym Cardio / MyZone telemetry drop. Multi-MAC table flood detected (6 MAC addresses learned on single edge port 1:14)."
  },
  {
    id: "rogue-ng-nw-02",
    vendor: "Netgear",
    model: "GS105v5 5-Port Gigabit Desktop",
    ipAddress: "10.32.172.192",
    macAddress: "9C:3D:CF:88:14:02",
    parentSwitchHostname: "DLC-Northwood-MainComms-2",
    parentSwitchIp: "10.32.172.252",
    connectedPort: "1:7",
    detectedSubnet: "10.32.172.0/24",
    firstSeen: "3 days ago",
    status: "investigating",
    siteCode: "NORTHWOOD",
    confidenceScore: 96,
    detectedDevicesBehindCount: 4,
    riskLevel: "Medium",
    notes: "Northwood Reception Kiosk & Self-Service check-in desk drop. 4 desktop tablet kiosks chained through unmanaged 5-port Netgear."
  },
  {
    id: "rogue-ng-nw-03",
    vendor: "Netgear",
    model: "GS308P 8-Port PoE Switch",
    ipAddress: "10.32.172.195",
    macAddress: "28:80:88:41:BB:09",
    parentSwitchHostname: "DLC-Northwood-Gym",
    parentSwitchIp: "10.32.172.250",
    connectedPort: "1:12",
    detectedSubnet: "10.32.172.0/24",
    firstSeen: "4 days ago",
    status: "active",
    siteCode: "NORTHWOOD",
    confidenceScore: 98,
    detectedDevicesBehindCount: 5,
    riskLevel: "High",
    notes: "Northwood Spin Studio / FitMetrix heart rate display console. High broadcast traffic generating frequent BPDU topology alerts."
  },
  {
    id: "rogue-ng-nw-04",
    vendor: "Netgear",
    model: "ProSAFE Plus GS116E 16-Port Smart",
    ipAddress: "10.32.172.198",
    macAddress: "C4:04:15:33:45:67",
    parentSwitchHostname: "FemaleChange-X435-24P",
    parentSwitchIp: "10.32.172.251",
    connectedPort: "1:4",
    detectedSubnet: "10.32.172.0/24",
    firstSeen: "1 week ago",
    status: "approved_temporary",
    siteCode: "NORTHWOOD",
    confidenceScore: 95,
    detectedDevicesBehindCount: 8,
    riskLevel: "Medium",
    notes: "Northwood Spa & Wellness Treatment Room Kiosks. 8 IoT controllers connected through unmanaged desktop switch."
  },

  // --- AMSTERDAM NETGEAR / ROGUE DEVICES ---
  {
    id: "rogue-ng-ams-01",
    vendor: "Netgear",
    model: "GS108T Smart Managed 8-Port",
    ipAddress: "10.32.104.184",
    macAddress: "A0:04:60:55:C3:77",
    parentSwitchHostname: "DLC-Amsterdam-Spa",
    parentSwitchIp: "10.32.104.252",
    connectedPort: "1:8",
    detectedSubnet: "10.32.104.0/24",
    firstSeen: "2 days ago",
    status: "active",
    siteCode: "AMSTERDAM",
    confidenceScore: 97,
    detectedDevicesBehindCount: 5,
    riskLevel: "Medium",
    notes: "Amsterdam Spa Reception & Hydro Pool telemetry hub. 5 endpoints connected via Netgear GS108T."
  },

  // --- YORK ROGUE DEVICES ---
  {
    id: "rogue-ng-01",
    vendor: "Netgear",
    model: "ProSAFE GS108E 8-Port Gigabit",
    ipAddress: "10.32.221.188",
    macAddress: "A0:04:60:11:F2:4A",
    parentSwitchHostname: "DLC-York-Gym",
    parentSwitchIp: "10.32.221.250",
    connectedPort: "1:8",
    detectedSubnet: "10.32.221.0/24",
    firstSeen: "Yesterday at 14:22",
    status: "active",
    siteCode: "YORK",
    confidenceScore: 98,
    detectedDevicesBehindCount: 6,
    riskLevel: "High",
    notes: "Multi-MAC flood detected behind port 1:8. 6 MAC addresses registered on single edge port (Fitness Cardio console hub)."
  },

  // --- ABERDEEN ---
  {
    id: "rogue-tp-02",
    vendor: "TP-Link",
    model: "TL-SG105E Easy Smart",
    ipAddress: "10.32.224.195",
    macAddress: "50:D4:F7:88:31:0C",
    parentSwitchHostname: "DLC-Aberdeen-Gym",
    parentSwitchIp: "10.32.224.251",
    connectedPort: "1:4",
    detectedSubnet: "10.32.224.0/24",
    firstSeen: "3 days ago",
    status: "investigating",
    siteCode: "ABERDEEN",
    confidenceScore: 94,
    detectedDevicesBehindCount: 4,
    riskLevel: "Medium",
    notes: "Unmanaged desktop switch in Gym Admin office. 4 desktop workstations chained through single wall drop."
  },

  // --- LEEDS ---
  {
    id: "rogue-ng-03",
    vendor: "Netgear",
    model: "GS105v5 5-Port Gigabit Desktop",
    ipAddress: "10.32.54.177",
    macAddress: "9C:3D:CF:45:90:12",
    parentSwitchHostname: "DLL-Leeds-SubRack",
    parentSwitchIp: "10.32.54.252",
    connectedPort: "1:12",
    detectedSubnet: "10.32.54.0/24",
    firstSeen: "5 days ago",
    status: "approved_temporary",
    siteCode: "LEEDS",
    confidenceScore: 99,
    detectedDevicesBehindCount: 3,
    riskLevel: "Low",
    notes: "Temporary contractor testing switch in Plantroom B. Approved until end of month."
  },

  // --- BRISTOL LA ---
  {
    id: "rogue-dl-04",
    vendor: "D-Link",
    model: "DGS-108 8-Port Gigabit Metal",
    ipAddress: "10.32.208.164",
    macAddress: "B0:C5:54:19:AA:33",
    parentSwitchHostname: "DLL-Bristol-LA-SubRack",
    parentSwitchIp: "10.32.208.252",
    connectedPort: "1:6",
    detectedSubnet: "10.32.208.0/24",
    firstSeen: "1 week ago",
    status: "quarantined",
    siteCode: "BRISTOL-LA",
    confidenceScore: 91,
    detectedDevicesBehindCount: 5,
    riskLevel: "High",
    notes: "Rogue switch detected in Club Lounge. High broadcast volume causing spanning-tree topology change notifications."
  },

  // --- LEICESTER ---
  {
    id: "rogue-cs-05",
    vendor: "Cisco Small Business",
    model: "SG110D-08 8-Port Unmanaged",
    ipAddress: "10.32.61.144",
    macAddress: "00:26:0B:44:81:F0",
    parentSwitchHostname: "DLC-Leicester-Gym",
    parentSwitchIp: "10.32.61.251",
    connectedPort: "1:11",
    detectedSubnet: "10.32.61.0/24",
    firstSeen: "2 weeks ago",
    status: "active",
    siteCode: "LEICESTER",
    confidenceScore: 96,
    detectedDevicesBehindCount: 4,
    riskLevel: "Medium",
    notes: "Membership Sales hub unmanaged switch. 4 sales desktop terminals connected."
  }
];

export function getUnmanagedSwitchesForSite(siteCode: string): DiscoveredUnmanagedSwitch[] {
  if (!siteCode) return [];
  const norm = siteCode.toUpperCase().trim();
  return DISCOVERED_UNMANAGED_SWITCHES.filter(d => 
    d.siteCode === norm || 
    d.parentSwitchHostname.toUpperCase().includes(norm) ||
    norm.includes(d.siteCode)
  );
}

export function getUnmanagedSwitchesForSwitch(switchIdentifier: string): DiscoveredUnmanagedSwitch[] {
  if (!switchIdentifier) return [];
  const norm = switchIdentifier.toLowerCase().trim();
  return DISCOVERED_UNMANAGED_SWITCHES.filter(d => 
    d.parentSwitchHostname.toLowerCase() === norm ||
    d.parentSwitchIp.toLowerCase() === norm ||
    d.parentSwitchHostname.toLowerCase().includes(norm)
  );
}
