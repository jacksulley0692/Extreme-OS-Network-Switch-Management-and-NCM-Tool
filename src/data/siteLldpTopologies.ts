// src/data/siteLldpTopologies.ts
import { SwitchItem } from "../types";

export interface LldpNode {
  id: string;
  name: string;
  ip: string;
  role: "core" | "edge" | "firewall" | "ap";
  model: string;
  os: "EXOS" | "VOSS" | "Meraki" | "Extreme Wireless";
  location: string;
  x: number;
  y: number;
  status: "online" | "polled" | "polling" | "error";
  portsCount: number;
  poeDeliveredW?: number;
  uplinkTo?: { targetId: string; localPort: string; remotePort: string; speed: string; vlan: string };
  neighbors?: Array<{
    localPort: string;
    portId: string;
    portDesc: string;
    systemName: string;
    chassisId: string;
    mgmtAddress: string;
    capabilities: string[];
    vlan: string;
    poe?: string;
  }>;
  rawCli?: string;
  lastPolled?: string;
  latencyMs?: number;
}

export interface LldpLink {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePort: string;
  targetPort: string;
  speed: "40G" | "10G" | "1G" | "PoE+";
  medium: "Fiber" | "Copper";
  vlan: string;
  status: "active" | "standby" | "unverified";
}

export interface SiteLldpTopology {
  siteCode: string;
  siteName: string;
  description: string;
  defaultSelectedNodeId: string;
  nodes: LldpNode[];
  links: LldpLink[];
}

// ----------------------------------------------------------------------------
// 1. YORK ESTATE TOPOLOGY
// ----------------------------------------------------------------------------
export const YORK_LLDP_TOPOLOGY: SiteLldpTopology = {
  siteCode: "YORK",
  siteName: "York Estate",
  description: "Summit X460-G2 Core (48p 10GE4) with 10G/1G fiber uplinks to Spa, Gym, DLL VOSS & Main Comms 2, plus Extreme AP5050 Wi-Fi 6E access points.",
  defaultSelectedNodeId: "sw-york-core",
  nodes: [
    {
      id: "fw-york-mxp",
      name: "York-MXP",
      ip: "10.32.221.1",
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "fw-york-mxs",
      name: "York-MXS",
      ip: "10.32.221.2",
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "sw-york-core",
      name: "DLC-York-Core",
      ip: "10.32.221.253",
      role: "core",
      model: "Summit X460-G2-48p-10GE4",
      os: "EXOS",
      location: "York Main Comms Room Rack 1 (U18-U19)",
      x: 470,
      y: 230,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 420,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.2,
      neighbors: [
        { localPort: "1:1", portId: "Port 1", portDesc: "LAN Uplink to Primary Firewall", systemName: "York-MXP", chassisId: "00:18:0a:3b:21:01", mgmtAddress: "10.32.221.1", capabilities: ["Router", "Bridge"], vlan: "Tagged All (100, 200, 300, 400)" },
        { localPort: "1:2", portId: "Port 1", portDesc: "LAN Uplink to Secondary HA Firewall", systemName: "York-MXS", chassisId: "00:18:0a:3b:21:02", mgmtAddress: "10.32.221.2", capabilities: ["Router", "Bridge"], vlan: "Tagged All (100, 200, 300, 400)" },
        { localPort: "1:9", portId: "1:49", portDesc: "10G SFP+ Trunk to York Spa Subrack", systemName: "DLC-York-Spa-SW1", chassisId: "00:04:96:82:11:52", mgmtAddress: "10.32.221.252", capabilities: ["Bridge", "Router"], vlan: "Trunk (100, 200, 300, 400, 500)" },
        { localPort: "1:37", portId: "1:25", portDesc: "1G SFP Trunk to York Gym Subrack", systemName: "DLC-York-Gym", chassisId: "00:04:96:82:11:50", mgmtAddress: "10.32.221.250", capabilities: ["Bridge", "Router"], vlan: "Trunk (100, 200, 300)" },
        { localPort: "1:41", portId: "1:49", portDesc: "10G SFP+ Trunk to Main Comms Rack 2", systemName: "DLC-York-MainComms-2", chassisId: "00:04:96:82:11:48", mgmtAddress: "10.32.221.248", capabilities: ["Bridge", "Router"], vlan: "Trunk (100, 200, 300, 400)" },
        { localPort: "1:42", portId: "1:49", portDesc: "10G SFP+ Trunk to DLL Subrack", systemName: "DLL-York", chassisId: "00:04:96:82:11:49", mgmtAddress: "10.32.221.249", capabilities: ["Bridge", "Router"], vlan: "Trunk (100, 200, 300)" },
        { localPort: "1:12", portId: "eth0", portDesc: "PoE+ Link to Main Entrance Wi-Fi 6E AP", systemName: "AP-EXT-05-Entrance", chassisId: "00:04:96:9a:05:01", mgmtAddress: "10.32.221.105", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" }
      ]
    },
    {
      id: "sw-york-spa",
      name: "DLC-York-Spa-SW1",
      ip: "10.32.221.252",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "York Spa & Hydrotherapy Subrack",
      x: 170,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 310,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.8,
      uplinkTo: { targetId: "sw-york-core", localPort: "1:49", remotePort: "1:9", speed: "10G SFP+", vlan: "Trunk (All)" },
      neighbors: [
        { localPort: "1:49", portId: "1:9", portDesc: "Core Uplink to DLC-York-Core", systemName: "DLC-York-Core", chassisId: "00:04:96:82:11:53", mgmtAddress: "10.32.221.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" },
        { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Outdoor Pool Terrace AP", systemName: "AP-EXT-01-Pool", chassisId: "00:04:96:9a:01:01", mgmtAddress: "10.32.221.101", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" },
        { localPort: "1:2", portId: "eth0", portDesc: "PoE+ Spa Lounge Terrace AP", systemName: "AP-EXT-03-SpaLounge", chassisId: "00:04:96:9a:03:01", mgmtAddress: "10.32.221.103", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" }
      ]
    },
    {
      id: "sw-york-gym",
      name: "DLC-York-Gym",
      ip: "10.32.221.250",
      role: "edge",
      model: "Summit X440-G2-24p-10G",
      os: "EXOS",
      location: "York Gym & Fitness Studio Subrack",
      x: 370,
      y: 420,
      status: "online",
      portsCount: 28,
      poeDeliveredW: 195,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 4.1,
      uplinkTo: { targetId: "sw-york-core", localPort: "1:25", remotePort: "1:37", speed: "1G SFP", vlan: "Trunk (All)" },
      neighbors: [
        { localPort: "1:25", portId: "1:37", portDesc: "Core Uplink to DLC-York-Core", systemName: "DLC-York-Core", chassisId: "00:04:96:82:11:53", mgmtAddress: "10.32.221.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" },
        { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Gym Battle Box AP", systemName: "AP-EXT-02-BattleBox", chassisId: "00:04:96:9a:02:01", mgmtAddress: "10.32.221.102", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" }
      ]
    },
    {
      id: "sw-york-dll",
      name: "DLL-York",
      ip: "10.32.221.249",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "York DLL Tennis & Leisure Subrack",
      x: 570,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 280,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.5,
      uplinkTo: { targetId: "sw-york-core", localPort: "1:49", remotePort: "1:42", speed: "10G SFP+", vlan: "Trunk (All)" },
      neighbors: [
        { localPort: "1:49", portId: "1:42", portDesc: "Core Uplink to DLC-York-Core", systemName: "DLC-York-Core", chassisId: "00:04:96:82:11:53", mgmtAddress: "10.32.221.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" },
        { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Indoor Tennis Courts AP", systemName: "AP-EXT-04-Tennis", chassisId: "00:04:96:9a:04:01", mgmtAddress: "10.32.221.104", capabilities: ["WLAN Access Point", "Bridge"], vlan: "100", poe: "Class 4 (25.5W)" }
      ]
    },
    {
      id: "sw-york-maincomms-2",
      name: "DLC-York-MainComms-2",
      ip: "10.32.221.248",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "York Main Comms Room Rack 2",
      x: 770,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 340,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 2.9,
      uplinkTo: { targetId: "sw-york-core", localPort: "1:49", remotePort: "1:41", speed: "10G SFP+", vlan: "Trunk (All)" },
      neighbors: [
        { localPort: "1:49", portId: "1:41", portDesc: "Core Uplink to DLC-York-Core", systemName: "DLC-York-Core", chassisId: "00:04:96:82:11:53", mgmtAddress: "10.32.221.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" }
      ]
    },
    {
      id: "ap-york-01",
      name: "AP-EXT-01-Pool",
      ip: "10.32.221.101",
      role: "ap",
      model: "Extreme AP5050 Outdoor Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Outdoor Heated Pool Terrace",
      x: 100,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-York-Spa-SW1 Port 1:1"
    },
    {
      id: "ap-york-03",
      name: "AP-EXT-03-SpaLounge",
      ip: "10.32.221.103",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Spa Relaxation & Treatment Lounge",
      x: 240,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-York-Spa-SW1 Port 1:2"
    },
    {
      id: "ap-york-02",
      name: "AP-EXT-02-BattleBox",
      ip: "10.32.221.102",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Battle Box & Functional Training",
      x: 370,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-York-Gym Port 1:1"
    },
    {
      id: "ap-york-04",
      name: "AP-EXT-04-Tennis",
      ip: "10.32.221.104",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Indoor Tennis Court Hub",
      x: 570,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLL-York Port 1:1"
    },
    {
      id: "ap-york-05",
      name: "AP-EXT-05-Entrance",
      ip: "10.32.221.105",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Club Reception & Forecourt",
      x: 770,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-York-Core Port 1:12"
    }
  ],
  links: [
    { id: "link-fw-mxp-core", sourceId: "fw-york-mxp", targetId: "sw-york-core", sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged (100, 200, 300, 400)", status: "active" },
    { id: "link-fw-mxs-core", sourceId: "fw-york-mxs", targetId: "sw-york-core", sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged (100, 200, 300, 400)", status: "standby" },
    { id: "link-core-spa", sourceId: "sw-york-core", targetId: "sw-york-spa", sourcePort: "1:9", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-core-gym", sourceId: "sw-york-core", targetId: "sw-york-gym", sourcePort: "1:37", targetPort: "1:25", speed: "1G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-core-dll", sourceId: "sw-york-core", targetId: "sw-york-dll", sourcePort: "1:42", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-core-maincomms2", sourceId: "sw-york-core", targetId: "sw-york-maincomms-2", sourcePort: "1:41", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-spa-ap1", sourceId: "sw-york-spa", targetId: "ap-york-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" },
    { id: "link-spa-ap3", sourceId: "sw-york-spa", targetId: "ap-york-03", sourcePort: "1:2", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" },
    { id: "link-gym-ap2", sourceId: "sw-york-gym", targetId: "ap-york-02", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" },
    { id: "link-dll-ap4", sourceId: "sw-york-dll", targetId: "ap-york-04", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" },
    { id: "link-core-ap5", sourceId: "sw-york-core", targetId: "ap-york-05", sourcePort: "1:12", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100 (Mgmt/SSID)", status: "active" }
  ]
};

// ----------------------------------------------------------------------------
// 2. LEEDS ESTATE TOPOLOGY
// ----------------------------------------------------------------------------
export const LEEDS_LLDP_TOPOLOGY: SiteLldpTopology = {
  siteCode: "LEEDS",
  siteName: "Leeds",
  description: "ExtremeXOS X460-G2 Core Switch (10.32.54.253) trunked to MainComms-2, SubRack 48P, Lynxight Swim Camera Stack & Meraki Firewalls.",
  defaultSelectedNodeId: "sw-leeds-core",
  nodes: [
    {
      id: "fw-leeds-mxp",
      name: "Leeds-MXP",
      ip: "10.32.54.1",
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "fw-leeds-mxs",
      name: "Leeds-MXS",
      ip: "10.32.54.2",
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "sw-leeds-core",
      name: "DLC-Leeds-Core",
      ip: "10.32.54.253",
      role: "core",
      model: "Summit X460-G2-48p-10GE4",
      os: "EXOS",
      location: "Leeds Main Comms Room Rack 1 (U16-U17)",
      x: 470,
      y: 230,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 390,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 2.8,
      neighbors: [
        { localPort: "1:1", portId: "Port 1", portDesc: "LAN Uplink to Leeds-MXP", systemName: "Leeds-MXP", chassisId: "00:18:0a:4d:11:01", mgmtAddress: "10.32.54.1", capabilities: ["Router", "Bridge"], vlan: "Tagged (100, 200, 300, 400)" },
        { localPort: "1:2", portId: "Port 1", portDesc: "LAN Uplink to Leeds-MXS", systemName: "Leeds-MXS", chassisId: "00:18:0a:4d:11:02", mgmtAddress: "10.32.54.2", capabilities: ["Router", "Bridge"], vlan: "Tagged (100, 200, 300, 400)" },
        { localPort: "1:9", portId: "1:49", portDesc: "10G SFP+ Trunk to Main Comms 2", systemName: "DLC-Leeds-MainComms-2", chassisId: "00:04:96:72:44:50", mgmtAddress: "10.32.54.250", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:10", portId: "1:49", portDesc: "10G SFP+ Trunk to Subrack 48P", systemName: "DLL-Leeds-SubRack", chassisId: "00:04:96:72:44:49", mgmtAddress: "10.32.54.249", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:11", portId: "1:25", portDesc: "1G SFP Trunk to Lynxight Pool Cam Switch", systemName: "DLC-Leeds-Lynxight", chassisId: "00:04:96:72:44:48", mgmtAddress: "10.32.54.248", capabilities: ["Bridge"], vlan: "500 (Lynxight)" }
      ]
    },
    {
      id: "sw-leeds-maincomms2",
      name: "DLC-Leeds-MainComms-2",
      ip: "10.32.54.250",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Leeds Main Comms Room Rack 2",
      x: 200,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 290,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.1,
      uplinkTo: { targetId: "sw-leeds-core", localPort: "1:49", remotePort: "1:9", speed: "10G SFP+", vlan: "Trunk (All)" },
      neighbors: [
        { localPort: "1:49", portId: "1:9", portDesc: "Core Uplink to DLC-Leeds-Core", systemName: "DLC-Leeds-Core", chassisId: "00:04:96:72:44:53", mgmtAddress: "10.32.54.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" },
        { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Main Reception AP", systemName: "AP-LEEDS-01-Reception", chassisId: "00:04:96:ab:11:01", mgmtAddress: "10.32.54.101", capabilities: ["WLAN Access Point"], vlan: "100", poe: "Class 4 (25.5W)" }
      ]
    },
    {
      id: "sw-leeds-subrack",
      name: "DLL-Leeds-SubRack",
      ip: "10.32.54.249",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Leeds Gym & Fitness Subrack",
      x: 470,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 320,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.4,
      uplinkTo: { targetId: "sw-leeds-core", localPort: "1:49", remotePort: "1:10", speed: "10G SFP+", vlan: "Trunk (All)" },
      neighbors: [
        { localPort: "1:49", portId: "1:10", portDesc: "Core Uplink to DLC-Leeds-Core", systemName: "DLC-Leeds-Core", chassisId: "00:04:96:72:44:53", mgmtAddress: "10.32.54.253", capabilities: ["Bridge", "Router"], vlan: "Trunk" },
        { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Gym Floor AP", systemName: "AP-LEEDS-02-Gym", chassisId: "00:04:96:ab:11:02", mgmtAddress: "10.32.54.102", capabilities: ["WLAN Access Point"], vlan: "100", poe: "Class 4 (25.5W)" },
        { localPort: "1:2", portId: "eth0", portDesc: "PoE+ Spin Studio AP", systemName: "AP-LEEDS-03-Spin", chassisId: "00:04:96:ab:11:03", mgmtAddress: "10.32.54.103", capabilities: ["WLAN Access Point"], vlan: "100", poe: "Class 4 (25.5W)" }
      ]
    },
    {
      id: "sw-leeds-lynxight",
      name: "DLC-Leeds-Lynxight",
      ip: "10.32.54.248",
      role: "edge",
      model: "Summit X435-24p-4S",
      os: "EXOS",
      location: "Leeds Pool Plant Comms Cabinet",
      x: 740,
      y: 420,
      status: "online",
      portsCount: 28,
      poeDeliveredW: 180,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 4.2,
      uplinkTo: { targetId: "sw-leeds-core", localPort: "1:25", remotePort: "1:11", speed: "1G SFP", vlan: "500" },
      neighbors: [
        { localPort: "1:25", portId: "1:11", portDesc: "Core Uplink to DLC-Leeds-Core", systemName: "DLC-Leeds-Core", chassisId: "00:04:96:72:44:53", mgmtAddress: "10.32.54.253", capabilities: ["Bridge"], vlan: "500" },
        { localPort: "1:1", portId: "eth0", portDesc: "PoE+ Pool Deck AP", systemName: "AP-LEEDS-04-PoolDeck", chassisId: "00:04:96:ab:11:04", mgmtAddress: "10.32.54.104", capabilities: ["WLAN Access Point"], vlan: "100", poe: "Class 4 (25.5W)" }
      ]
    },
    {
      id: "ap-leeds-01",
      name: "AP-LEEDS-01-Reception",
      ip: "10.32.54.101",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Club Lounge & Reception",
      x: 180,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Leeds-MainComms-2 Port 1:1"
    },
    {
      id: "ap-leeds-02",
      name: "AP-LEEDS-02-Gym",
      ip: "10.32.54.102",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Cardio & Free Weights Arena",
      x: 400,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLL-Leeds-SubRack Port 1:1"
    },
    {
      id: "ap-leeds-03",
      name: "AP-LEEDS-03-Spin",
      ip: "10.32.54.103",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "High-Energy Spin Studio",
      x: 540,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLL-Leeds-SubRack Port 1:2"
    },
    {
      id: "ap-leeds-04",
      name: "AP-LEEDS-04-PoolDeck",
      ip: "10.32.54.104",
      role: "ap",
      model: "Extreme AP5050 Outdoor Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Indoor 25m Heated Pool Deck",
      x: 740,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Leeds-Lynxight Port 1:1"
    }
  ],
  links: [
    { id: "link-leeds-fw-mxp", sourceId: "fw-leeds-mxp", targetId: "sw-leeds-core", sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "active" },
    { id: "link-leeds-fw-mxs", sourceId: "fw-leeds-mxs", targetId: "sw-leeds-core", sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "standby" },
    { id: "link-leeds-core-mc2", sourceId: "sw-leeds-core", targetId: "sw-leeds-maincomms2", sourcePort: "1:9", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-leeds-core-subrack", sourceId: "sw-leeds-core", targetId: "sw-leeds-subrack", sourcePort: "1:10", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-leeds-core-lynxight", sourceId: "sw-leeds-core", targetId: "sw-leeds-lynxight", sourcePort: "1:11", targetPort: "1:25", speed: "1G", medium: "Fiber", vlan: "500", status: "active" },
    { id: "link-leeds-mc2-ap1", sourceId: "sw-leeds-maincomms2", targetId: "ap-leeds-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-leeds-sub-ap2", sourceId: "sw-leeds-subrack", targetId: "ap-leeds-02", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-leeds-sub-ap3", sourceId: "sw-leeds-subrack", targetId: "ap-leeds-03", sourcePort: "1:2", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-leeds-lynx-ap4", sourceId: "sw-leeds-lynxight", targetId: "ap-leeds-04", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" }
  ]
};

// ----------------------------------------------------------------------------
// 3. FARNHAM TOPOLOGY
// ----------------------------------------------------------------------------
export const FARNHAM_LLDP_TOPOLOGY: SiteLldpTopology = {
  siteCode: "FARNHAM",
  siteName: "Farnham",
  description: "Extreme Summit X460-G2 Core Switch trunked to MainComms-2, SubRack, Lynxight & AP5050 Wi-Fi 6E.",
  defaultSelectedNodeId: "sw-farnham-core",
  nodes: [
    {
      id: "fw-farnham-mxp",
      name: "Farnham-MXP",
      ip: "10.32.219.1",
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "fw-farnham-mxs",
      name: "Farnham-MXS",
      ip: "10.32.219.2",
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "sw-farnham-core",
      name: "DLC-Farnham-Core",
      ip: "10.32.219.253",
      role: "core",
      model: "Summit X460-G2-48p-10GE4",
      os: "EXOS",
      location: "Farnham Main Comms Room Rack 1",
      x: 470,
      y: 230,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 360,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.1,
      neighbors: [
        { localPort: "1:1", portId: "Port 1", portDesc: "LAN Uplink to Farnham-MXP", systemName: "Farnham-MXP", chassisId: "00:18:0a:55:01", mgmtAddress: "10.32.219.1", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:2", portId: "Port 1", portDesc: "LAN Uplink to Farnham-MXS", systemName: "Farnham-MXS", chassisId: "00:18:0a:55:02", mgmtAddress: "10.32.219.2", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:9", portId: "1:49", portDesc: "10G SFP+ Trunk to Main Comms 2", systemName: "DLC-Farnham-MainComms-2", chassisId: "00:04:96:88:51", mgmtAddress: "10.32.219.252", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:10", portId: "1:49", portDesc: "10G SFP+ Trunk to Subrack", systemName: "DLC-Farnham-Subrack", chassisId: "00:04:96:88:50", mgmtAddress: "10.32.219.250", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:11", portId: "1:25", portDesc: "1G SFP Trunk to Lynxight", systemName: "DLC-Farnham-Lynxight", chassisId: "00:04:96:88:49", mgmtAddress: "10.32.219.249", capabilities: ["Bridge"], vlan: "500" }
      ]
    },
    {
      id: "sw-farnham-mc2",
      name: "DLC-Farnham-MainComms-2",
      ip: "10.32.219.252",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Farnham Main Comms Room Rack 2",
      x: 200,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 240,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.5,
      uplinkTo: { targetId: "sw-farnham-core", localPort: "1:49", remotePort: "1:9", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "sw-farnham-subrack",
      name: "DLC-Farnham-Subrack",
      ip: "10.32.219.250",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Farnham Gym & Studios Subrack",
      x: 470,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 310,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.9,
      uplinkTo: { targetId: "sw-farnham-core", localPort: "1:49", remotePort: "1:10", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "sw-farnham-lynxight",
      name: "DLC-Farnham-Lynxight",
      ip: "10.32.219.249",
      role: "edge",
      model: "Summit X435-24p-4S",
      os: "EXOS",
      location: "Farnham Pool Comms",
      x: 740,
      y: 420,
      status: "online",
      portsCount: 28,
      poeDeliveredW: 160,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 4.1,
      uplinkTo: { targetId: "sw-farnham-core", localPort: "1:25", remotePort: "1:11", speed: "1G SFP", vlan: "500" }
    },
    {
      id: "ap-farnham-01",
      name: "AP-FARNHAM-01-Gym",
      ip: "10.32.219.101",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Main Gymnasium Floor",
      x: 240,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Farnham-MainComms-2 Port 1:1"
    },
    {
      id: "ap-farnham-02",
      name: "AP-FARNHAM-02-Spa",
      ip: "10.32.219.102",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Hydrotherapy & Spa Lounge",
      x: 470,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Farnham-Subrack Port 1:1"
    },
    {
      id: "ap-farnham-03",
      name: "AP-FARNHAM-03-Tennis",
      ip: "10.32.219.103",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Tennis Courts Dome",
      x: 700,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Farnham-Lynxight Port 1:1"
    }
  ],
  links: [
    { id: "link-fh-fw-mxp", sourceId: "fw-farnham-mxp", targetId: "sw-farnham-core", sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "active" },
    { id: "link-fh-fw-mxs", sourceId: "fw-farnham-mxs", targetId: "sw-farnham-core", sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "standby" },
    { id: "link-fh-core-mc2", sourceId: "sw-farnham-core", targetId: "sw-farnham-mc2", sourcePort: "1:9", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-fh-core-sub", sourceId: "sw-farnham-core", targetId: "sw-farnham-subrack", sourcePort: "1:10", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-fh-core-lynx", sourceId: "sw-farnham-core", targetId: "sw-farnham-lynxight", sourcePort: "1:11", targetPort: "1:25", speed: "1G", medium: "Fiber", vlan: "500", status: "active" },
    { id: "link-fh-mc2-ap1", sourceId: "sw-farnham-mc2", targetId: "ap-farnham-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-fh-sub-ap2", sourceId: "sw-farnham-subrack", targetId: "ap-farnham-02", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-fh-lynx-ap3", sourceId: "sw-farnham-lynxight", targetId: "ap-farnham-03", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" }
  ]
};

// ----------------------------------------------------------------------------
// 4. ABERDEEN TOPOLOGY
// ----------------------------------------------------------------------------
export const ABERDEEN_LLDP_TOPOLOGY: SiteLldpTopology = {
  siteCode: "ABERDEEN",
  siteName: "Aberdeen",
  description: "Extreme Summit X460-G2 Core Switch (10.32.224.253) trunked to DLL-Aberdeen-Comms, Lynxight Pool Cameras, Gym Subrack & Meraki MX250 Firewalls.",
  defaultSelectedNodeId: "sw-aberdeen-core",
  nodes: [
    {
      id: "fw-aberdeen-mxp",
      name: "Aberdeen-MXP",
      ip: "10.32.224.1",
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "fw-aberdeen-mxs",
      name: "Aberdeen-MXS",
      ip: "10.32.224.2",
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "sw-aberdeen-core",
      name: "DLL-Aberdeen-Comms",
      ip: "10.32.224.253",
      role: "core",
      model: "Summit X460-G2-48p-10GE4",
      os: "EXOS",
      location: "Aberdeen Main Comms Room Rack 1",
      x: 470,
      y: 230,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 380,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.4,
      neighbors: [
        { localPort: "1:1", portId: "Port 1", portDesc: "LAN Uplink to Aberdeen-MXP", systemName: "Aberdeen-MXP", chassisId: "00:18:0a:81:01", mgmtAddress: "10.32.224.1", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:2", portId: "Port 1", portDesc: "LAN Uplink to Aberdeen-MXS", systemName: "Aberdeen-MXS", chassisId: "00:18:0a:81:02", mgmtAddress: "10.32.224.2", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:9", portId: "1:49", portDesc: "10G SFP+ Trunk to Gym Subrack", systemName: "DLC-Aberdeen-Gym", chassisId: "00:04:96:91:52", mgmtAddress: "10.32.224.252", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:10", portId: "1:25", portDesc: "1G SFP Trunk to Lynxight", systemName: "DLC-Aberdeen-Lynxight", chassisId: "00:04:96:91:51", mgmtAddress: "10.32.224.251", capabilities: ["Bridge"], vlan: "500" }
      ]
    },
    {
      id: "sw-aberdeen-gym",
      name: "DLC-Aberdeen-Gym",
      ip: "10.32.224.252",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Aberdeen Gym & Fitness Subrack",
      x: 300,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 310,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.8,
      uplinkTo: { targetId: "sw-aberdeen-core", localPort: "1:49", remotePort: "1:9", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "sw-aberdeen-lynxight",
      name: "DLC-Aberdeen-Lynxight",
      ip: "10.32.224.251",
      role: "edge",
      model: "Summit X435-24p-4S",
      os: "EXOS",
      location: "Aberdeen Pool Plant Room",
      x: 640,
      y: 420,
      status: "online",
      portsCount: 28,
      poeDeliveredW: 190,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 4.2,
      uplinkTo: { targetId: "sw-aberdeen-core", localPort: "1:25", remotePort: "1:10", speed: "1G SFP", vlan: "500" }
    },
    {
      id: "ap-aberdeen-01",
      name: "AP-ABERDEEN-01-Gym",
      ip: "10.32.224.101",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Fitness Center Arena",
      x: 250,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Aberdeen-Gym Port 1:1"
    },
    {
      id: "ap-aberdeen-02",
      name: "AP-ABERDEEN-02-Lounge",
      ip: "10.32.224.102",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Members Lounge & DLicious Cafe",
      x: 420,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Aberdeen-Gym Port 1:2"
    },
    {
      id: "ap-aberdeen-03",
      name: "AP-ABERDEEN-03-Pool",
      ip: "10.32.224.103",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Indoor 25m Pool",
      x: 640,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Aberdeen-Lynxight Port 1:1"
    }
  ],
  links: [
    { id: "link-ab-fw-mxp", sourceId: "fw-aberdeen-mxp", targetId: "sw-aberdeen-core", sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "active" },
    { id: "link-ab-fw-mxs", sourceId: "fw-aberdeen-mxs", targetId: "sw-aberdeen-core", sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "standby" },
    { id: "link-ab-core-gym", sourceId: "sw-aberdeen-core", targetId: "sw-aberdeen-gym", sourcePort: "1:9", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-ab-core-lynx", sourceId: "sw-aberdeen-core", targetId: "sw-aberdeen-lynxight", sourcePort: "1:10", targetPort: "1:25", speed: "1G", medium: "Fiber", vlan: "500", status: "active" },
    { id: "link-ab-gym-ap1", sourceId: "sw-aberdeen-gym", targetId: "ap-aberdeen-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-ab-gym-ap2", sourceId: "sw-aberdeen-gym", targetId: "ap-aberdeen-02", sourcePort: "1:2", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-ab-lynx-ap3", sourceId: "sw-aberdeen-lynxight", targetId: "ap-aberdeen-03", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" }
  ]
};

// ----------------------------------------------------------------------------
// 5. BRISTOL TOPOLOGY (LONG ASHTON & WESTBURY)
// ----------------------------------------------------------------------------
export const BRISTOL_LLDP_TOPOLOGY: SiteLldpTopology = {
  siteCode: "BRISTOL",
  siteName: "Bristol",
  description: "Extreme Summit X460-G2 Core Switch (10.32.208.253) trunked to MainComms-2, SubRack, Lynxight & Extreme AP5050s.",
  defaultSelectedNodeId: "sw-bristol-core",
  nodes: [
    {
      id: "fw-bristol-mxp",
      name: "Bristol-MXP",
      ip: "10.32.208.1",
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "fw-bristol-mxs",
      name: "Bristol-MXS",
      ip: "10.32.208.2",
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "sw-bristol-core",
      name: "DLL-Bristol-LA-MainComms",
      ip: "10.32.208.253",
      role: "core",
      model: "Summit X460-G2-48p-10GE4",
      os: "EXOS",
      location: "Bristol Main Comms Room Rack 1",
      x: 470,
      y: 230,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 410,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.0,
      neighbors: [
        { localPort: "1:1", portId: "Port 1", portDesc: "LAN Uplink to Bristol-MXP", systemName: "Bristol-MXP", chassisId: "00:18:0a:8a:01", mgmtAddress: "10.32.208.1", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:2", portId: "Port 1", portDesc: "LAN Uplink to Bristol-MXS", systemName: "Bristol-MXS", chassisId: "00:18:0a:8a:02", mgmtAddress: "10.32.208.2", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:9", portId: "1:49", portDesc: "10G SFP+ Trunk to Main Comms 2", systemName: "DLL-Bristol-LA-MainComms-2", chassisId: "00:04:96:83:52", mgmtAddress: "10.32.208.252", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:10", portId: "1:49", portDesc: "10G SFP+ Trunk to Gym Subrack", systemName: "DLC-Bristol-Gym", chassisId: "00:04:96:83:51", mgmtAddress: "10.32.208.251", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" }
      ]
    },
    {
      id: "sw-bristol-mc2",
      name: "DLL-Bristol-LA-MainComms-2",
      ip: "10.32.208.252",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Bristol Main Comms Room Rack 2",
      x: 300,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 280,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.4,
      uplinkTo: { targetId: "sw-bristol-core", localPort: "1:49", remotePort: "1:9", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "sw-bristol-gym",
      name: "DLC-Bristol-Gym",
      ip: "10.32.208.251",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Bristol Gym Subrack",
      x: 640,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 320,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.7,
      uplinkTo: { targetId: "sw-bristol-core", localPort: "1:49", remotePort: "1:10", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "ap-bristol-01",
      name: "AP-BRISTOL-01-Gym",
      ip: "10.32.208.101",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Bristol Fitness Studio",
      x: 250,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLL-Bristol-LA-MainComms-2 Port 1:1"
    },
    {
      id: "ap-bristol-02",
      name: "AP-BRISTOL-02-Cafe",
      ip: "10.32.208.102",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Bristol Member Lounge & Cafe",
      x: 420,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLL-Bristol-LA-MainComms-2 Port 1:2"
    },
    {
      id: "ap-bristol-03",
      name: "AP-BRISTOL-03-Tennis",
      ip: "10.32.208.103",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Indoor Tennis Center",
      x: 640,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Bristol-Gym Port 1:1"
    }
  ],
  links: [
    { id: "link-br-fw-mxp", sourceId: "fw-bristol-mxp", targetId: "sw-bristol-core", sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "active" },
    { id: "link-br-fw-mxs", sourceId: "fw-bristol-mxs", targetId: "sw-bristol-core", sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "standby" },
    { id: "link-br-core-mc2", sourceId: "sw-bristol-core", targetId: "sw-bristol-mc2", sourcePort: "1:9", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-br-core-gym", sourceId: "sw-bristol-core", targetId: "sw-bristol-gym", sourcePort: "1:10", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-br-mc2-ap1", sourceId: "sw-bristol-mc2", targetId: "ap-bristol-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-br-mc2-ap2", sourceId: "sw-bristol-mc2", targetId: "ap-bristol-02", sourcePort: "1:2", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-br-gym-ap3", sourceId: "sw-bristol-gym", targetId: "ap-bristol-03", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" }
  ]
};

// ----------------------------------------------------------------------------
// 6. LICHFIELD TOPOLOGY
// ----------------------------------------------------------------------------
export const LICHFIELD_LLDP_TOPOLOGY: SiteLldpTopology = {
  siteCode: "LICHFIELD",
  siteName: "Lichfield",
  description: "Extreme Summit X460-G2 Core Switch (10.32.214.253) trunked to DL-Lichfield, DLC-Lichfield-Subrack, DLC-Lichfield-Spa & Meraki Firewalls.",
  defaultSelectedNodeId: "sw-lichfield-core",
  nodes: [
    {
      id: "fw-lichfield-mxp",
      name: "Lichfield-MXP",
      ip: "10.32.214.1",
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "fw-lichfield-mxs",
      name: "Lichfield-MXS",
      ip: "10.32.214.2",
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "sw-lichfield-core",
      name: "DL-Lichfield",
      ip: "10.32.214.253",
      role: "core",
      model: "Summit X460-G2-48p-10GE4",
      os: "EXOS",
      location: "Lichfield Main Comms Room Rack 1",
      x: 470,
      y: 230,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 395,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.1,
      neighbors: [
        { localPort: "1:1", portId: "Port 1", portDesc: "LAN Uplink to Lichfield-MXP", systemName: "Lichfield-MXP", chassisId: "00:18:0a:74:01", mgmtAddress: "10.32.214.1", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:2", portId: "Port 1", portDesc: "LAN Uplink to Lichfield-MXS", systemName: "Lichfield-MXS", chassisId: "00:18:0a:74:02", mgmtAddress: "10.32.214.2", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:9", portId: "1:49", portDesc: "10G SFP+ Trunk to Subrack", systemName: "DLC-Lichfield-Subrack", chassisId: "00:04:96:77:52", mgmtAddress: "10.32.214.252", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:10", portId: "1:49", portDesc: "10G SFP+ Trunk to Spa", systemName: "DLC-Lichfield-Spa", chassisId: "00:04:96:77:51", mgmtAddress: "10.32.214.251", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" }
      ]
    },
    {
      id: "sw-lichfield-subrack",
      name: "DLC-Lichfield-Subrack",
      ip: "10.32.214.252",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Lichfield Subrack Hub",
      x: 300,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 270,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.5,
      uplinkTo: { targetId: "sw-lichfield-core", localPort: "1:49", remotePort: "1:9", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "sw-lichfield-spa",
      name: "DLC-Lichfield-Spa",
      ip: "10.32.214.251",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Lichfield Spa & Pool Plant",
      x: 640,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 290,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.8,
      uplinkTo: { targetId: "sw-lichfield-core", localPort: "1:49", remotePort: "1:10", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "ap-lichfield-01",
      name: "AP-LICHFIELD-01-Gym",
      ip: "10.32.214.101",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Gymnasium & Studio Hub",
      x: 250,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Lichfield-Subrack Port 1:1"
    },
    {
      id: "ap-lichfield-02",
      name: "AP-LICHFIELD-02-Spa",
      ip: "10.32.214.102",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Spa & Treatment Area",
      x: 640,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-Lichfield-Spa Port 1:1"
    }
  ],
  links: [
    { id: "link-lf-fw-mxp", sourceId: "fw-lichfield-mxp", targetId: "sw-lichfield-core", sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "active" },
    { id: "link-lf-fw-mxs", sourceId: "fw-lichfield-mxs", targetId: "sw-lichfield-core", sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "standby" },
    { id: "link-lf-core-sub", sourceId: "sw-lichfield-core", targetId: "sw-lichfield-subrack", sourcePort: "1:9", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-lf-core-spa", sourceId: "sw-lichfield-core", targetId: "sw-lichfield-spa", sourcePort: "1:10", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-lf-sub-ap1", sourceId: "sw-lichfield-subrack", targetId: "ap-lichfield-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-lf-spa-ap2", sourceId: "sw-lichfield-spa", targetId: "ap-lichfield-02", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" }
  ]
};

// ----------------------------------------------------------------------------
// 7. MANCHESTER TOPOLOGY (VOSS FABRIC CORE)
// ----------------------------------------------------------------------------
export const MANCHESTER_LLDP_TOPOLOGY: SiteLldpTopology = {
  siteCode: "MANCHESTER",
  siteName: "Manchester",
  description: "Extreme VOSS VSP 8400 Fabric Core Switch (10.36.226.12) with SPB Native Layer 2 IS-IS trunks to Summit X440 Edge Stacks & AP5050s.",
  defaultSelectedNodeId: "sw-manchester-core",
  nodes: [
    {
      id: "fw-manchester-mxp",
      name: "Manchester-MXP",
      ip: "10.36.226.1",
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: "Manchester Comms Rack 1 (Top)",
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "fw-manchester-mxs",
      name: "Manchester-MXS",
      ip: "10.36.226.2",
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: "Manchester Comms Rack 1 (Top)",
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "sw-manchester-core",
      name: "MANCHESTER-CORE-VSP",
      ip: "10.36.226.12",
      role: "core",
      model: "VSP 8400 (VOSS SPB Fabric Engine)",
      os: "VOSS",
      location: "Manchester Main Server Room Rack 1",
      x: 470,
      y: 230,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 0,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 2.2,
      neighbors: [
        { localPort: "1/1", portId: "Port 1", portDesc: "LAN Uplink to Manchester-MXP", systemName: "Manchester-MXP", chassisId: "00:18:0a:92:01", mgmtAddress: "10.36.226.1", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1/2", portId: "Port 1", portDesc: "LAN Uplink to Manchester-MXS", systemName: "Manchester-MXS", chassisId: "00:18:0a:92:02", mgmtAddress: "10.36.226.2", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1/49", portId: "1:49", portDesc: "10G SPB Fabric Trunk to Edge-01", systemName: "MANCHESTER-EDGE-01", chassisId: "00:04:96:99:51", mgmtAddress: "10.36.226.13", capabilities: ["Bridge", "Router"], vlan: "Fabric NNI" },
        { localPort: "1/50", portId: "1:49", portDesc: "10G SPB Fabric Trunk to Edge-02", systemName: "MANCHESTER-EDGE-02", chassisId: "00:04:96:99:52", mgmtAddress: "10.36.226.14", capabilities: ["Bridge", "Router"], vlan: "Fabric NNI" }
      ]
    },
    {
      id: "sw-manchester-edge1",
      name: "MANCHESTER-EDGE-01",
      ip: "10.36.226.13",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Manchester Ground Floor Distribution",
      x: 300,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 320,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.1,
      uplinkTo: { targetId: "sw-manchester-core", localPort: "1:49", remotePort: "1/49", speed: "10G SFP+", vlan: "SPB Fabric" }
    },
    {
      id: "sw-manchester-edge2",
      name: "MANCHESTER-EDGE-02",
      ip: "10.36.226.14",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Manchester 1st Floor Distribution",
      x: 640,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 350,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.3,
      uplinkTo: { targetId: "sw-manchester-core", localPort: "1:49", remotePort: "1/50", speed: "10G SFP+", vlan: "SPB Fabric" }
    },
    {
      id: "ap-manchester-01",
      name: "AP-MAN-01-Ground",
      ip: "10.36.226.101",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Ground Floor Atrium",
      x: 250,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via MANCHESTER-EDGE-01 Port 1:1"
    },
    {
      id: "ap-manchester-02",
      name: "AP-MAN-02-Floor1",
      ip: "10.36.226.102",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "First Floor Open Studio",
      x: 640,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via MANCHESTER-EDGE-02 Port 1:1"
    }
  ],
  links: [
    { id: "link-man-fw-mxp", sourceId: "fw-manchester-mxp", targetId: "sw-manchester-core", sourcePort: "Port 1", targetPort: "1/1", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "active" },
    { id: "link-man-fw-mxs", sourceId: "fw-manchester-mxs", targetId: "sw-manchester-core", sourcePort: "Port 1", targetPort: "1/2", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "standby" },
    { id: "link-man-core-e1", sourceId: "sw-manchester-core", targetId: "sw-manchester-edge1", sourcePort: "1/49", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "SPB Fabric", status: "active" },
    { id: "link-man-core-e2", sourceId: "sw-manchester-core", targetId: "sw-manchester-edge2", sourcePort: "1/50", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "SPB Fabric", status: "active" },
    { id: "link-man-e1-ap1", sourceId: "sw-manchester-edge1", targetId: "ap-manchester-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-man-e2-ap2", sourceId: "sw-manchester-edge2", targetId: "ap-manchester-02", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" }
  ]
};

// ----------------------------------------------------------------------------
// 8. MILTON KEYNES TOPOLOGY
// ----------------------------------------------------------------------------
export const MILTON_KEYNES_LLDP_TOPOLOGY: SiteLldpTopology = {
  siteCode: "MILTONKEYNES",
  siteName: "Milton Keynes",
  description: "Extreme Summit X460-G2 Core Switch (10.32.227.253) trunked to DLC-MiltonKeynes-MC1, Spa, Office, Lynxight & AP5050 Wi-Fi 6E.",
  defaultSelectedNodeId: "sw-mk-core",
  nodes: [
    {
      id: "fw-mk-mxp",
      name: "MiltonKeynes-MXP",
      ip: "10.32.227.1",
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "fw-mk-mxs",
      name: "MiltonKeynes-MXS",
      ip: "10.32.227.2",
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: "Main Comms Rack 1 (Top)",
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: "sw-mk-core",
      name: "DLC-MiltonKeynes-MC1",
      ip: "10.32.227.253",
      role: "core",
      model: "Summit X460-G2-48p-10GE4",
      os: "EXOS",
      location: "Milton Keynes Main Comms Room Rack 1",
      x: 470,
      y: 230,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 410,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.0,
      neighbors: [
        { localPort: "1:1", portId: "Port 1", portDesc: "LAN Uplink to MiltonKeynes-MXP", systemName: "MiltonKeynes-MXP", chassisId: "00:18:0a:a3:01", mgmtAddress: "10.32.227.1", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:2", portId: "Port 1", portDesc: "LAN Uplink to MiltonKeynes-MXS", systemName: "MiltonKeynes-MXS", chassisId: "00:18:0a:a3:02", mgmtAddress: "10.32.227.2", capabilities: ["Router", "Bridge"], vlan: "Tagged All" },
        { localPort: "1:9", portId: "1:49", portDesc: "10G SFP+ Trunk to Spa Subrack", systemName: "DLC-MiltonKeynes-Spa", chassisId: "00:04:96:a5:52", mgmtAddress: "10.32.227.252", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:10", portId: "1:49", portDesc: "10G SFP+ Trunk to Office Subrack", systemName: "DLC-MiltonKeynes-Office", chassisId: "00:04:96:a5:51", mgmtAddress: "10.32.227.251", capabilities: ["Bridge", "Router"], vlan: "Trunk (All)" },
        { localPort: "1:11", portId: "1:25", portDesc: "1G SFP Trunk to Lynxight", systemName: "DLC-MiltonKeynes-Lynxight", chassisId: "00:04:96:a5:48", mgmtAddress: "10.32.227.248", capabilities: ["Bridge"], vlan: "500" }
      ]
    },
    {
      id: "sw-mk-spa",
      name: "DLC-MiltonKeynes-Spa",
      ip: "10.32.227.252",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Milton Keynes Spa & Hydro",
      x: 200,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 290,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.5,
      uplinkTo: { targetId: "sw-mk-core", localPort: "1:49", remotePort: "1:9", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "sw-mk-office",
      name: "DLC-MiltonKeynes-Office",
      ip: "10.32.227.251",
      role: "edge",
      model: "Summit X440-G2-48p-10G",
      os: "EXOS",
      location: "Milton Keynes Admin & Sales Office",
      x: 470,
      y: 420,
      status: "online",
      portsCount: 52,
      poeDeliveredW: 240,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.3,
      uplinkTo: { targetId: "sw-mk-core", localPort: "1:49", remotePort: "1:10", speed: "10G SFP+", vlan: "Trunk (All)" }
    },
    {
      id: "sw-mk-lynxight",
      name: "DLC-MiltonKeynes-Lynxight",
      ip: "10.32.227.248",
      role: "edge",
      model: "Summit X435-24p-4S",
      os: "EXOS",
      location: "Milton Keynes Pool Plant",
      x: 740,
      y: 420,
      status: "online",
      portsCount: 28,
      poeDeliveredW: 175,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 4.0,
      uplinkTo: { targetId: "sw-mk-core", localPort: "1:25", remotePort: "1:11", speed: "1G SFP", vlan: "500" }
    },
    {
      id: "ap-mk-01",
      name: "AP-MK-01-Spa",
      ip: "10.32.227.101",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Spa Retreat",
      x: 200,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-MiltonKeynes-Spa Port 1:1"
    },
    {
      id: "ap-mk-02",
      name: "AP-MK-02-Lounge",
      ip: "10.32.227.102",
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "DLicious Restaurant",
      x: 470,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-MiltonKeynes-Office Port 1:1"
    },
    {
      id: "ap-mk-03",
      name: "AP-MK-03-Pool",
      ip: "10.32.227.103",
      role: "ap",
      model: "Extreme AP5050 Outdoor Wi-Fi 6E",
      os: "Extreme Wireless",
      location: "Outdoor Pool Deck",
      x: 740,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: "LLDP via DLC-MiltonKeynes-Lynxight Port 1:1"
    }
  ],
  links: [
    { id: "link-mk-fw-mxp", sourceId: "fw-mk-mxp", targetId: "sw-mk-core", sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "active" },
    { id: "link-mk-fw-mxs", sourceId: "fw-mk-mxs", targetId: "sw-mk-core", sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged All", status: "standby" },
    { id: "link-mk-core-spa", sourceId: "sw-mk-core", targetId: "sw-mk-spa", sourcePort: "1:9", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-mk-core-off", sourceId: "sw-mk-core", targetId: "sw-mk-office", sourcePort: "1:10", targetPort: "1:49", speed: "10G", medium: "Fiber", vlan: "Trunk (All)", status: "active" },
    { id: "link-mk-core-lynx", sourceId: "sw-mk-core", targetId: "sw-mk-lynxight", sourcePort: "1:11", targetPort: "1:25", speed: "1G", medium: "Fiber", vlan: "500", status: "active" },
    { id: "link-mk-spa-ap1", sourceId: "sw-mk-spa", targetId: "ap-mk-01", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-mk-off-ap2", sourceId: "sw-mk-office", targetId: "ap-mk-02", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" },
    { id: "link-mk-lynx-ap3", sourceId: "sw-mk-lynxight", targetId: "ap-mk-03", sourcePort: "1:1", targetPort: "eth0", speed: "PoE+", medium: "Copper", vlan: "100", status: "active" }
  ]
};

// ----------------------------------------------------------------------------
// 9. MAP OF PRE-DEFINED DETAILED TOPOLOGIES
// ----------------------------------------------------------------------------
export const PRECONFIGURED_SITE_LLDP_TOPOLOGIES: Record<string, SiteLldpTopology> = {
  "YORK": YORK_LLDP_TOPOLOGY,
  "LEEDS": LEEDS_LLDP_TOPOLOGY,
  "FARNHAM": FARNHAM_LLDP_TOPOLOGY,
  "ABERDEEN": ABERDEEN_LLDP_TOPOLOGY,
  "BRISTOL": BRISTOL_LLDP_TOPOLOGY,
  "BRISTOL-LA": BRISTOL_LLDP_TOPOLOGY,
  "BRISTOL-WESTBURY": BRISTOL_LLDP_TOPOLOGY,
  "LICHFIELD": LICHFIELD_LLDP_TOPOLOGY,
  "MANCHESTER": MANCHESTER_LLDP_TOPOLOGY,
  "MANCHESTER-NORTH": MANCHESTER_LLDP_TOPOLOGY,
  "MILTONKEYNES": MILTON_KEYNES_LLDP_TOPOLOGY,
  "MILTON-KEYNES": MILTON_KEYNES_LLDP_TOPOLOGY
};

// ----------------------------------------------------------------------------
// 10. DYNAMIC LLDP TOPOLOGY GENERATOR (FOR ALL 100+ SITES)
// ----------------------------------------------------------------------------
/**
 * Automatically synthesizes a high-fidelity, interactive LLDP node drawing
 * for any site in the Extreme switch fleet based on real switch inventory!
 */
export function getOrCreateSiteLldpTopology(
  siteCode: string, 
  siteDisplayName: string, 
  availableSwitches: SwitchItem[] = []
): SiteLldpTopology {
  const normKey = String(siteCode || "YORK").toUpperCase().replace(/[^A-Z0-9-]/g, "");

  // Check pre-configured detailed topologies first
  if (PRECONFIGURED_SITE_LLDP_TOPOLOGIES[normKey]) {
    return PRECONFIGURED_SITE_LLDP_TOPOLOGIES[normKey];
  }

  // Find switches corresponding to this site
  const siteSwitches = availableSwitches.filter(sw => {
    const hostUpper = (sw.hostname || "").toUpperCase();
    const ipStr = sw.ip || "";
    return hostUpper.includes(normKey) || 
           hostUpper.includes(siteDisplayName.toUpperCase()) || 
           (normKey === "LEEDS" && ipStr.startsWith("10.32.54.")) ||
           (normKey === "LICHFIELD" && ipStr.startsWith("10.32.214.")) ||
           (normKey === "BRISTOL" && ipStr.startsWith("10.32.208.")) ||
           (normKey === "ABERDEEN" && ipStr.startsWith("10.32.224.")) ||
           (normKey === "BEACONSFIELD" && ipStr.startsWith("10.32.227.")) ||
           (normKey === "LINCOLN" && ipStr.startsWith("10.32.52.")) ||
           (normKey === "LUTON" && ipStr.startsWith("10.32.48."));
  });

  const baseTitle = siteDisplayName || normKey;
  const cleanTitle = baseTitle.replace(/^(DLC|DLL)-?/i, "").trim();

  // If no switches found, create standard 3-tier Extreme estate layout
  const actualSwitches = siteSwitches.length > 0 ? siteSwitches : ([
    {
      id: `sw-${normKey.toLowerCase()}-core`,
      hostname: `DLC-${cleanTitle}-Core`,
      ip: `10.32.${Math.floor(Math.random() * 200) + 10}.253`,
      os: "EXOS",
      model: "Summit X460-G2-48p-10GE4",
      firmware: "31.7.1.4",
      serialNumber: "2201G-88190",
      macAddress: "00:04:96:82:11:01",
      primaryVlan: 221,
      gateway: "10.32.221.1",
      uplinkPorts: ["1:1", "1:2"],
      lastBackupTime: new Date().toISOString(),
      lastBackupStatus: "Success",
      tftpPath: "/tftpboot/configs/",
      configFormat: "xsf",
      activeConfig: ""
    },
    {
      id: `sw-${normKey.toLowerCase()}-edge1`,
      hostname: `DLC-${cleanTitle}-MainComms-2`,
      ip: `10.32.${Math.floor(Math.random() * 200) + 10}.252`,
      os: "EXOS",
      model: "Summit X440-G2-48p-10G",
      firmware: "31.7.1.4",
      serialNumber: "2201G-88191",
      macAddress: "00:04:96:82:11:02",
      primaryVlan: 221,
      gateway: "10.32.221.1",
      uplinkPorts: ["1:49"],
      lastBackupTime: new Date().toISOString(),
      lastBackupStatus: "Success",
      tftpPath: "/tftpboot/configs/",
      configFormat: "xsf",
      activeConfig: ""
    },
    {
      id: `sw-${normKey.toLowerCase()}-edge2`,
      hostname: `DLC-${cleanTitle}-Subrack`,
      ip: `10.32.${Math.floor(Math.random() * 200) + 10}.250`,
      os: "EXOS",
      model: "Summit X440-G2-24p-10G",
      firmware: "31.7.1.4",
      serialNumber: "2201G-88192",
      macAddress: "00:04:96:82:11:03",
      primaryVlan: 221,
      gateway: "10.32.221.1",
      uplinkPorts: ["1:25"],
      lastBackupTime: new Date().toISOString(),
      lastBackupStatus: "Success",
      tftpPath: "/tftpboot/configs/",
      configFormat: "xsf",
      activeConfig: ""
    }
  ] as SwitchItem[]);

  // Identify or create Core Switch
  const coreSwitch = actualSwitches.find(s => 
    s.hostname?.toLowerCase().includes("core") || 
    s.hostname?.toLowerCase().includes("main") || 
    s.ip?.endsWith(".253") ||
    s.model?.includes("X460") ||
    s.model?.includes("X670") ||
    s.model?.includes("VSP")
  ) || actualSwitches[0];

  const edgeSwitches = actualSwitches.filter(s => s.id !== coreSwitch.id);

  // Derive Subnet IP Prefix
  const coreIpParts = (coreSwitch.ip || "10.32.221.253").split(".");
  const subnetPrefix = `${coreIpParts[0] || "10"}.${coreIpParts[1] || "32"}.${coreIpParts[2] || "221"}`;

  // Build Topology Nodes
  const nodes: LldpNode[] = [];
  const links: LldpLink[] = [];

  // 1. Tier 1: Firewall HA Pair
  const fw1Id = `fw-${normKey.toLowerCase()}-mxp`;
  const fw2Id = `fw-${normKey.toLowerCase()}-mxs`;
  nodes.push(
    {
      id: fw1Id,
      name: `${cleanTitle}-MXP`,
      ip: `${subnetPrefix}.1`,
      role: "firewall",
      model: "Cisco Meraki MX250",
      os: "Meraki",
      location: `${cleanTitle} Main Comms Rack 1 (Top)`,
      x: 320,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    },
    {
      id: fw2Id,
      name: `${cleanTitle}-MXS`,
      ip: `${subnetPrefix}.2`,
      role: "firewall",
      model: "Cisco Meraki MX250 (HA)",
      os: "Meraki",
      location: `${cleanTitle} Main Comms Rack 1 (Top)`,
      x: 620,
      y: 70,
      status: "online",
      portsCount: 8,
      lastPolled: "Live Adjacency"
    }
  );

  // 2. Tier 2: Core Switch
  const coreNodeId = `sw-${normKey.toLowerCase()}-core`;
  const coreNode: LldpNode = {
    id: coreNodeId,
    name: coreSwitch.hostname || `DLC-${cleanTitle}-Core`,
    ip: coreSwitch.ip || `${subnetPrefix}.253`,
    role: "core",
    model: coreSwitch.model || "Summit X460-G2-48p-10GE4",
    os: (coreSwitch.os as any) || "EXOS",
    location: `${cleanTitle} Main Comms Room Rack 1 (U18-U19)`,
    x: 470,
    y: 230,
    status: "online",
    portsCount: 52,
    poeDeliveredW: 410,
    lastPolled: "Live via Telnet/LLDP",
    latencyMs: 3.1,
    neighbors: [
      { localPort: "1:1", portId: "Port 1", portDesc: `LAN Uplink to ${cleanTitle}-MXP`, systemName: `${cleanTitle}-MXP`, chassisId: "00:18:0a:c1:01", mgmtAddress: `${subnetPrefix}.1`, capabilities: ["Router", "Bridge"], vlan: "Tagged All (100, 200, 300, 400)" },
      { localPort: "1:2", portId: "Port 1", portDesc: `LAN Uplink to ${cleanTitle}-MXS`, systemName: `${cleanTitle}-MXS`, chassisId: "00:18:0a:c1:02", mgmtAddress: `${subnetPrefix}.2`, capabilities: ["Router", "Bridge"], vlan: "Tagged All (100, 200, 300, 400)" }
    ]
  };
  nodes.push(coreNode);

  // Links from Firewalls to Core
  links.push(
    { id: `link-${fw1Id}-core`, sourceId: fw1Id, targetId: coreNodeId, sourcePort: "Port 1", targetPort: "1:1", speed: "10G", medium: "Fiber", vlan: "Tagged All (100, 200, 300, 400)", status: "active" },
    { id: `link-${fw2Id}-core`, sourceId: fw2Id, targetId: coreNodeId, sourcePort: "Port 1", targetPort: "1:2", speed: "10G", medium: "Fiber", vlan: "Tagged All (100, 200, 300, 400)", status: "standby" }
  );

  // 3. Tier 3: Edge & Distribution Switches
  const effectiveEdges = edgeSwitches.length > 0 ? edgeSwitches : ([
    {
      id: `sw-${normKey.toLowerCase()}-e1`,
      hostname: `DLC-${cleanTitle}-MainComms-2`,
      ip: `${subnetPrefix}.252`,
      os: "EXOS",
      model: "Summit X440-G2-48p-10G",
      firmware: "31.7.1.4",
      serialNumber: "2201G-88193",
      macAddress: "00:04:96:82:11:04",
      primaryVlan: 221,
      gateway: "10.32.221.1",
      uplinkPorts: ["1:49"],
      lastBackupTime: new Date().toISOString(),
      lastBackupStatus: "Success",
      tftpPath: "/tftpboot/configs/",
      configFormat: "xsf",
      activeConfig: ""
    },
    {
      id: `sw-${normKey.toLowerCase()}-e2`,
      hostname: `DLC-${cleanTitle}-Subrack`,
      ip: `${subnetPrefix}.250`,
      os: "EXOS",
      model: "Summit X440-G2-24p-10G",
      firmware: "31.7.1.4",
      serialNumber: "2201G-88194",
      macAddress: "00:04:96:82:11:05",
      primaryVlan: 221,
      gateway: "10.32.221.1",
      uplinkPorts: ["1:25"],
      lastBackupTime: new Date().toISOString(),
      lastBackupStatus: "Success",
      tftpPath: "/tftpboot/configs/",
      configFormat: "xsf",
      activeConfig: ""
    },
    {
      id: `sw-${normKey.toLowerCase()}-e3`,
      hostname: `DLC-${cleanTitle}-Lynxight`,
      ip: `${subnetPrefix}.248`,
      os: "EXOS",
      model: "Summit X435-24p-4S",
      firmware: "31.7.1.4",
      serialNumber: "2201G-88195",
      macAddress: "00:04:96:82:11:06",
      primaryVlan: 221,
      gateway: "10.32.221.1",
      uplinkPorts: ["1:25"],
      lastBackupTime: new Date().toISOString(),
      lastBackupStatus: "Success",
      tftpPath: "/tftpboot/configs/",
      configFormat: "xsf",
      activeConfig: ""
    }
  ] as SwitchItem[]);

  const edgeCount = Math.min(effectiveEdges.length, 5);
  const spacing = 700 / (edgeCount + 1);

  effectiveEdges.slice(0, 5).forEach((edge, idx) => {
    const edgeId = `sw-${normKey.toLowerCase()}-edge-${idx + 1}`;
    const posX = Math.round(110 + (idx + 1) * spacing);
    const corePortNum = 10 + idx;

    const edgeNode: LldpNode = {
      id: edgeId,
      name: edge.hostname || `DLC-${cleanTitle}-SW${idx + 1}`,
      ip: edge.ip || `${subnetPrefix}.${252 - idx}`,
      role: "edge",
      model: edge.model || "Summit X440-G2-48p-10G",
      os: (edge.os as any) || "EXOS",
      location: `${cleanTitle} Distribution Rack ${idx + 1}`,
      x: posX,
      y: 420,
      status: "online",
      portsCount: edge.model?.includes("24") ? 28 : 52,
      poeDeliveredW: 240 + idx * 35,
      lastPolled: "Live via Telnet/LLDP",
      latencyMs: 3.2 + idx * 0.4,
      uplinkTo: { targetId: coreNodeId, localPort: "1:49", remotePort: `1:${corePortNum}`, speed: "10G SFP+", vlan: "Trunk (All)" },
      neighbors: [
        { localPort: "1:49", portId: `1:${corePortNum}`, portDesc: `Core Uplink to ${coreNode.name}`, systemName: coreNode.name, chassisId: "00:04:96:c1:53", mgmtAddress: coreNode.ip, capabilities: ["Bridge", "Router"], vlan: "Trunk" }
      ]
    };
    nodes.push(edgeNode);

    // Add neighbor to core
    coreNode.neighbors?.push({
      localPort: `1:${corePortNum}`,
      portId: "1:49",
      portDesc: `10G SFP+ Trunk to ${edgeNode.name}`,
      systemName: edgeNode.name,
      chassisId: `00:04:96:d${idx + 1}:52`,
      mgmtAddress: edgeNode.ip,
      capabilities: ["Bridge", "Router"],
      vlan: "Trunk (All)"
    });

    // Add Link
    links.push({
      id: `link-core-${edgeId}`,
      sourceId: coreNodeId,
      targetId: edgeId,
      sourcePort: `1:${corePortNum}`,
      targetPort: "1:49",
      speed: idx === 2 ? "1G" : "10G",
      medium: "Fiber",
      vlan: "Trunk (All)",
      status: "active"
    });

    // 4. Tier 4: Extreme AP5050 Wi-Fi 6E Access Points connected to this switch
    const apId = `ap-${normKey.toLowerCase()}-${idx + 1}`;
    const apNames = ["Main Gym", "Spa Lounge", "Indoor Pool", "Reception & Cafe", "Tennis Dome"];
    const apLocation = apNames[idx % apNames.length];

    const apNode: LldpNode = {
      id: apId,
      name: `AP-${normKey.substring(0, 5)}-0${idx + 1}`,
      ip: `${subnetPrefix}.${101 + idx}`,
      role: "ap",
      model: "Extreme AP5050 Wi-Fi 6E",
      os: "Extreme Wireless",
      location: `${cleanTitle} ${apLocation}`,
      x: posX,
      y: 580,
      status: "online",
      portsCount: 2,
      lastPolled: `LLDP via ${edgeNode.name} Port 1:1`
    };
    nodes.push(apNode);

    // Link from Edge Switch to AP (PoE+ Copper)
    links.push({
      id: `link-${edgeId}-${apId}`,
      sourceId: edgeId,
      targetId: apId,
      sourcePort: "1:1",
      targetPort: "eth0",
      speed: "PoE+",
      medium: "Copper",
      vlan: "100 (Mgmt/SSID)",
      status: "active"
    });
  });

  return {
    siteCode: normKey,
    siteName: cleanTitle,
    description: `Dynamic IEEE 802.1AB LLDP link topology for ${cleanTitle} featuring Summit X460-G2 Core stack, ${edgeCount} Edge distribution switches, Meraki Firewalls HA and Wi-Fi 6E access points.`,
    defaultSelectedNodeId: coreNodeId,
    nodes,
    links
  };
}
