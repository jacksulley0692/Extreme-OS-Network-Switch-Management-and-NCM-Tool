// src/data/siteTopologiesData.ts
/**
 * Vector Topology Generators for Site Network Diagrams
 * Exact 1:1 vector topologies rendered from the official Extreme / Visio network diagrams.
 */

export interface TopologyNode {
  id: string;
  name: string;
  type: "internet" | "firewall" | "core" | "distribution" | "edge";
  x: number;
  y: number;
  width?: number;
  height?: number;
  ip?: string;
  model?: string;
}

export interface TopologyLink {
  fromId: string;
  toId: string;
  fromPort?: string;
  toPort?: string;
  label?: string;
  speed?: string;
}

export interface SiteTopologyDefinition {
  siteId: string;
  siteName: string;
  viewBox: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  uplinkSummary: { name: string; link: string; notes?: string }[];
}

export const SITE_TOPOLOGIES: Record<string, SiteTopologyDefinition> = {
  acton: {
    siteId: "acton",
    siteName: "Acton",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Acton_Park-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Acton_Park-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Acton2", type: "core", x: 700, y: 550 },
      { id: "sw_left", name: "DLC-Acton2", type: "edge", x: 280, y: 780 },
      { id: "sw_right", name: "DLC-Acton-MainComms-3", type: "distribution", x: 1050, y: 780 },
      { id: "sw_lynx", name: "DLC-ActonPark-Lynxight", type: "edge", x: 1050, y: 900 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_left", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw_right", fromPort: "Port 24", toPort: "Port 2" },
      { fromId: "sw_right", toId: "sw_lynx", fromPort: "Port 11", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Acton2 (Subrack)", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Acton-MainComms-3", link: "Core Port 24 ➔ Port 2" },
      { name: "DLC-ActonPark-Lynxight", link: "MainComms-3 Port 11 ➔ Port 24" }
    ]
  },

  "colliers-wood": {
    siteId: "colliers-wood",
    siteName: "Colliers Wood",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "COLLIERS-WOOD-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "COLLIERS-WOOD-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Collierswood-MainComms-1", type: "core", x: 700, y: 560 },
      { id: "sw1", name: "DLC-ColliersWood-Subrack", type: "edge", x: 260, y: 840 },
      { id: "sw2", name: "DLC-ColliersWood-MainComms-2", type: "edge", x: 700, y: 840 },
      { id: "sw3", name: "DLC-ColliersWood-MainComms-2", type: "edge", x: 1080, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 4", toPort: "Port 24" },
      { fromId: "core", toId: "sw2", fromPort: "Port 4", toPort: "Port 24" },
      { fromId: "core", toId: "sw3", fromPort: "Port 41", toPort: "Port 47" }
    ],
    uplinkSummary: [
      { name: "DLC-ColliersWood-Subrack", link: "Core Port 4 ➔ Port 24" },
      { name: "DLC-ColliersWood-MainComms-2 (A)", link: "Core Port 4 ➔ Port 24" },
      { name: "DLC-ColliersWood-MainComms-2 (B)", link: "Core Port 41 ➔ Port 47" }
    ]
  },

  "herne-bay": {
    siteId: "herne-bay",
    siteName: "Herne Bay",
    viewBox: "0 0 1700 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "DLC-HERNE-BAY-MXP", type: "firewall", x: 620, y: 380 },
      { id: "fw2", name: "DLC-HERNE-BAY-MXS", type: "firewall", x: 980, y: 380 },
      { id: "core", name: "DLC-Hernebay-Core-1", type: "core", x: 800, y: 560 },
      { id: "sw1", name: "DLC-HerneBay-MainComms", type: "edge", x: 220, y: 840 },
      { id: "sw2", name: "DLC-Hernebay-Audio", type: "edge", x: 600, y: 840 },
      { id: "sw3", name: "DLC-HerneBay-HiEnergy", type: "edge", x: 1050, y: 840 },
      { id: "sw4", name: "DLC-HerneBay-Gym", type: "edge", x: 1450, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 44", toPort: "Port 48" },
      { fromId: "core", toId: "sw2", fromPort: "Port 46", toPort: "Port 48" },
      { fromId: "core", toId: "sw3", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw4", fromPort: "Port 48", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-HerneBay-MainComms", link: "Core Port 44 ➔ Port 48" },
      { name: "DLC-Hernebay-Audio", link: "Core Port 46 ➔ Port 48" },
      { name: "DLC-HerneBay-HiEnergy", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-HerneBay-Gym", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  aberdeen: {
    siteId: "aberdeen",
    siteName: "Aberdeen",
    viewBox: "0 0 1500 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Aberdeen-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Aberdeen-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-Aberdeen-Comms", type: "core", x: 750, y: 560 },
      { id: "sw1", name: "DLC-Aberdeen-Lynxight", type: "edge", x: 350, y: 840 },
      { id: "sw2", name: "DLC-Aberdeen-Gym", type: "edge", x: 1150, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 32", toPort: "Port 1" },
      { fromId: "core", toId: "sw2", fromPort: "Port 12", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Aberdeen-Lynxight", link: "Core Port 32 ➔ Port 1" },
      { name: "DLC-Aberdeen-Gym", link: "Core Port 12 ➔ Port 1" }
    ]
  },

  "bury-st-edmunds": {
    siteId: "bury-st-edmunds",
    siteName: "Bury St Edmunds",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Bury-St-Edmunds-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Bury-St-Edmunds-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Bury-St-Edmunds-48-1", type: "core", x: 750, y: 550 },
      { id: "sw_sub", name: "DLC-Bury-St-Edmunds-Subrack", type: "distribution", x: 350, y: 740 },
      { id: "sw_edge2", name: "DLC-Bury-St-Edmunds-48-2", type: "distribution", x: 1150, y: 740 },
      { id: "sw_lynx", name: "DLC-Shawfair-Lynxight", type: "edge", x: 350, y: 890 },
      { id: "sw_hi", name: "DLC-Bury-St-Edmunds-HiImpact", type: "edge", x: 1150, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 24" },
      { fromId: "core", toId: "sw_edge2", fromPort: "Port 24", toPort: "Port 47" },
      { fromId: "sw_sub", toId: "sw_lynx", fromPort: "Port 23", toPort: "Port 1" },
      { fromId: "sw_edge2", toId: "sw_hi", fromPort: "Port 12", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Bury-St-Edmunds-Subrack", link: "Core Port 47 ➔ Port 24" },
      { name: "DLC-Shawfair-Lynxight", link: "Subrack Port 23 ➔ Port 1" },
      { name: "DLC-Bury-St-Edmunds-48-2", link: "Core Port 24 ➔ Port 47" },
      { name: "DLC-Bury-St-Edmunds-HiImpact", link: "48-2 Port 12 ➔ Port 1" }
    ]
  },

  "emersons-green": {
    siteId: "emersons-green",
    siteName: "Emersons Green",
    viewBox: "0 0 1200 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 600, y: 130 },
      { id: "fw1", name: "Emerson_Green-MXP", type: "firewall", x: 420, y: 400 },
      { id: "fw2", name: "Emerson_Green-MXS", type: "firewall", x: 780, y: 400 },
      { id: "core", name: "DLC-EmersonsGreen", type: "core", x: 600, y: 580 },
      { id: "sw2", name: "DLC-Emersons-2", type: "edge", x: 600, y: 820 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw2", fromPort: "Port 47", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-Emersons-2", link: "Core Port 47 ➔ Port 48" }
    ]
  },

  "la-finca": {
    siteId: "la-finca",
    siteName: "La Finca",
    viewBox: "0 0 1700 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "LaFinca-MXP", type: "firewall", x: 620, y: 380 },
      { id: "fw2", name: "LaFinca-MXS", type: "firewall", x: 980, y: 380 },
      { id: "sw_kids", name: "DLC-LaFinca-Kids", type: "core", x: 800, y: 530 },
      { id: "sw_lower", name: "DLC-Lafinca-Lower-Comms", type: "distribution", x: 800, y: 690 },
      { id: "sw1", name: "DLC-LaFinca-Kids (Down)", type: "edge", x: 220, y: 880 },
      { id: "sw2", name: "DLC-LaFinca-HO-Comms-24", type: "edge", x: 600, y: 880 },
      { id: "sw3", name: "1st-Floor-Comm-Room", type: "edge", x: 1050, y: 880 },
      { id: "sw4", name: "DLC-Lynxight", type: "edge", x: 1450, y: 880 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "sw_kids", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "sw_kids", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "sw_kids", toId: "sw_lower", fromPort: "Port 48", toPort: "Port 21" },
      { fromId: "sw_lower", toId: "sw1", fromPort: "Port 21", toPort: "Port 48" },
      { fromId: "sw_lower", toId: "sw2", fromPort: "Port 22", toPort: "Port 21" },
      { fromId: "sw_lower", toId: "sw3", fromPort: "Port 23", toPort: "Port 48" },
      { fromId: "sw_lower", toId: "sw4", fromPort: "Port 24", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Lafinca-Lower-Comms", link: "Kids Switch Port 48 ➔ Port 21" },
      { name: "DLC-LaFinca-HO-Comms-24", link: "Lower Comms Port 22 ➔ Port 21" },
      { name: "1st-Floor-Comm-Room", link: "Lower Comms Port 23 ➔ Port 48" },
      { name: "DLC-Lynxight", link: "Lower Comms Port 24 ➔ Port 24" }
    ]
  },

  malaga: {
    siteId: "malaga",
    siteName: "Malaga",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Malaga-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Malaga-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Malaga-48", type: "core", x: 700, y: 560 },
      { id: "sw1", name: "DLC-Malaga-Lynxight", type: "edge", x: 380, y: 840 },
      { id: "sw2", name: "DLC-Malaga-2", type: "edge", x: 1020, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 43", toPort: "Port 24" },
      { fromId: "core", toId: "sw2", fromPort: "Port 48", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-Malaga-Lynxight", link: "Core Port 43 ➔ Port 24" },
      { name: "DLC-Malaga-2", link: "Core Port 48 ➔ Port 48" }
    ]
  },

  modena: {
    siteId: "modena",
    siteName: "Modena",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Modena MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Modena MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Modena-Main", type: "core", x: 700, y: 560 },
      { id: "sw1", name: "DLC-Modena-Core-48", type: "edge", x: 380, y: 840 },
      { id: "sw2", name: "DLC-Modena-Lynxight", type: "edge", x: 1020, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 47", toPort: "Port 47" },
      { fromId: "core", toId: "sw2", fromPort: "Port 48", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Modena-Core-48", link: "Core Port 47 ➔ Port 47" },
      { name: "DLC-Modena-Lynxight", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  rugby: {
    siteId: "rugby",
    siteName: "Rugby",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Rugby-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Rugby-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Rugby-48-1", type: "core", x: 700, y: 560 },
      { id: "sw1", name: "DLC-Rugby-Subrack", type: "edge", x: 350, y: 840 },
      { id: "sw2", name: "DLC-Rugby-48-2", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 9", toPort: "Port 1" },
      { fromId: "core", toId: "sw2", fromPort: "Port 47", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Rugby-Subrack", link: "Core Port 9 ➔ Port 1" },
      { name: "DLC-Rugby-48-2", link: "Core Port 47 ➔ Port 1" }
    ]
  },

  serrano: {
    siteId: "serrano",
    siteName: "Serrano",
    viewBox: "0 0 1700 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Serrano-MXP", type: "firewall", x: 620, y: 380 },
      { id: "fw2", name: "Serrano-MXS", type: "firewall", x: 980, y: 380 },
      { id: "core", name: "DLC-Serrano-Comms-48", type: "core", x: 800, y: 560 },
      { id: "sw1", name: "DLC-Tempoffices", type: "edge", x: 220, y: 840 },
      { id: "sw2", name: "DLC-Serrano-7th-Floor", type: "edge", x: 600, y: 840 },
      { id: "sw3", name: "DLC-Serrano-6th-Floor-48P", type: "edge", x: 1050, y: 840 },
      { id: "sw4", name: "DLC-Serrano-HighImpact", type: "edge", x: 1450, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 47", toPort: "Port 11" },
      { fromId: "core", toId: "sw2", fromPort: "Port 5", toPort: "Port 1" },
      { fromId: "core", toId: "sw3", fromPort: "Port 41", toPort: "Port 24" },
      { fromId: "core", toId: "sw4", fromPort: "Port 33", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Tempoffices", link: "Core Port 47 ➔ Port 11" },
      { name: "DLC-Serrano-7th-Floor", link: "Core Port 5 ➔ Port 1" },
      { name: "DLC-Serrano-6th-Floor-48P", link: "Core Port 41 ➔ Port 24" },
      { name: "DLC-Serrano-HighImpact", link: "Core Port 33 ➔ Port 1" }
    ]
  },

  shawfair: {
    siteId: "shawfair",
    siteName: "Shawfair",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Shawfair-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Shawfair-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Shawfair-Main", type: "core", x: 700, y: 560 },
      { id: "sw1", name: "DLC-Shawfair-48-2", type: "edge", x: 350, y: 840 },
      { id: "sw2", name: "DLC-Shawfair-Subrack", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 23", toPort: "Port 44" },
      { fromId: "core", toId: "sw2", fromPort: "Port 47", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Shawfair-48-2", link: "Core Port 23 ➔ Port 44" },
      { name: "DLC-Shawfair-Subrack", link: "Core Port 47 ➔ Port 1" }
    ]
  },

  shrewsbury: {
    siteId: "shrewsbury",
    siteName: "Shrewsbury",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "DLC-Shrewsbury-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "DLC-Shrewsbury-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Shrewsbury-Main", type: "core", x: 750, y: 560 },
      { id: "sw1", name: "DLC-Shrewsbury-Spa", type: "edge", x: 260, y: 840 },
      { id: "sw2", name: "DLC-Shrewsbury-Gym", type: "edge", x: 750, y: 840 },
      { id: "sw3", name: "DLC-Shrewsbury-Wifi", type: "edge", x: 1240, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 40", toPort: "Port 23" },
      { fromId: "core", toId: "sw2", fromPort: "Port 41", toPort: "Port 47" },
      { fromId: "core", toId: "sw3", fromPort: "Port 42", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Shrewsbury-Spa", link: "Core Port 40 ➔ Port 23" },
      { name: "DLC-Shrewsbury-Gym", link: "Core Port 41 ➔ Port 47" },
      { name: "DLC-Shrewsbury-Wifi", link: "Core Port 42 ➔ Port 1" }
    ]
  },

  woking: {
    siteId: "woking",
    siteName: "Woking",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Woking-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Woking-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Woking", type: "core", x: 750, y: 550 },
      { id: "sw_main2", name: "DLC-Woking-MainComms-2", type: "distribution", x: 380, y: 740 },
      { id: "sw_dll", name: "DLLWoking", type: "edge", x: 1120, y: 740 },
      { id: "sw_lynx", name: "DLC-Woking-Lnyxight", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 47", toPort: "Port 52" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 4", toPort: "Port 13" },
      { fromId: "sw_main2", toId: "sw_lynx", fromPort: "Port 32", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Woking-MainComms-2", link: "Core Port 47 ➔ Port 52" },
      { name: "DLC-Woking-Lnyxight", link: "MainComms-2 Port 32 ➔ Port 1" },
      { name: "DLLWoking", link: "Core Port 4 ➔ Port 13" }
    ]
  },

  worcester: {
    siteId: "worcester",
    siteName: "Worcester",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Worcester-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Worcester-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLL-Worcester-X440", type: "core", x: 700, y: 560 },
      { id: "sw1", name: "DLC-Worcester-Lynxight", type: "edge", x: 350, y: 840 },
      { id: "sw2", name: "DLL-Worcester2", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 9", toPort: "Port 24" },
      { fromId: "core", toId: "sw2", fromPort: "Port 48", toPort: "Port 50" }
    ],
    uplinkSummary: [
      { name: "DLC-Worcester-Lynxight", link: "Core Port 9 ➔ Port 24" },
      { name: "DLL-Worcester2", link: "Core Port 48 ➔ Port 50" }
    ]
  },

  york: {
    siteId: "york",
    siteName: "York",
    viewBox: "0 0 1600 1020",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "York-MXP", type: "firewall", x: 620, y: 380 },
      { id: "fw2", name: "York-MXS", type: "firewall", x: 980, y: 380 },
      { id: "core", name: "DLC-York-Core-VSP4450", type: "core", x: 800, y: 560 },
      { id: "sw1", name: "DLC-York-Spa-SW1", type: "edge", x: 220, y: 840 },
      { id: "sw2", name: "DLC-York-Gym", type: "edge", x: 600, y: 840 },
      { id: "sw3", name: "DLL-York", type: "edge", x: 1050, y: 840 },
      { id: "sw4", name: "DLC-York-MainComms-2", type: "edge", x: 1450, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 9", toPort: "Port 1" },
      { fromId: "core", toId: "sw2", fromPort: "Port 37", toPort: "Port 1" },
      { fromId: "core", toId: "sw3", fromPort: "Port 42", toPort: "Port 17" },
      { fromId: "core", toId: "sw4", fromPort: "Port 41", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-York-Spa-SW1", link: "Core Port 9 ➔ Port 1" },
      { name: "DLC-York-Gym", link: "Core Port 37 ➔ Port 1" },
      { name: "DLL-York", link: "Core Port 42 ➔ Port 17" },
      { name: "DLC-York-MainComms-2", link: "Core Port 41 ➔ Port 48" }
    ]
  },

  worthing: {
    siteId: "worthing",
    siteName: "Worthing",
    viewBox: "0 0 1700 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 850, y: 130 },
      { id: "fw1", name: "Worthing-MXP", type: "firewall", x: 650, y: 380 },
      { id: "fw2", name: "Worthing-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Worthing-Core-1", type: "core", x: 850, y: 550 },
      { id: "sw_main2", name: "DLC-Worthing-MainComms-2", type: "distribution", x: 400, y: 740 },
      { id: "sw_spa", name: "DLC-Worthing-Spa", type: "edge", x: 900, y: 740 },
      { id: "sw_gym", name: "DLC-Worthing-Gym", type: "edge", x: 1350, y: 740 },
      { id: "sw_lynx", name: "DLC-Worthing-Lynxight", type: "edge", x: 400, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 46", toPort: "Port 1" },
      { fromId: "sw_main2", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Worthing-MainComms-2", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Worthing-Lynxight", link: "MainComms-2 Port 24 ➔ Port 24" },
      { name: "DLC-Worthing-Spa", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-Worthing-Gym", link: "Core Port 46 ➔ Port 1" }
    ]
  },

  zaragoza: {
    siteId: "zaragoza",
    siteName: "Zaragoza",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Zaragoza-MXP", type: "firewall", x: 600, y: 380 },
      { id: "fw2", name: "Zaragoza-MXS", type: "firewall", x: 1000, y: 380 },
      { id: "core", name: "DLC-Zaragoza-Core", type: "core", x: 800, y: 560 },
      { id: "sw1", name: "DLC-Zaragoza-Floor1", type: "edge", x: 300, y: 840 },
      { id: "sw2", name: "DLC-Zaragoza-Lynxight", type: "edge", x: 800, y: 840 },
      { id: "sw3", name: "DLC-Zaragoza-Spa", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 47", toPort: "Port 48" },
      { fromId: "core", toId: "sw2", fromPort: "Port 48", toPort: "Port 24" },
      { fromId: "core", toId: "sw3", fromPort: "Port 46", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Zaragoza-Floor1", link: "Core Port 47 ➔ Port 48" },
      { name: "DLC-Zaragoza-Lynxight", link: "Core Port 48 ➔ Port 24" },
      { name: "DLC-Zaragoza-Spa", link: "Core Port 46 ➔ Port 1" }
    ]
  },

  "bad-homburg": {
    siteId: "bad-homburg",
    siteName: "Bad Homburg",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Bad-Homburg-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Bad-Homburg-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Bad-Homburg-Core", type: "core", x: 750, y: 550 },
      { id: "sw_main2", name: "DLC-Bad-Homburg-MainComms-2", type: "distribution", x: 380, y: 740 },
      { id: "sw_fit", name: "DLC-Bad-Homburg-Fitness", type: "edge", x: 1120, y: 740 },
      { id: "sw_lynx", name: "DLC-Bad-Homburg-Lynxight", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw_fit", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "sw_main2", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Bad-Homburg-MainComms-2", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Bad-Homburg-Lynxight", link: "MainComms-2 Port 24 ➔ Port 1" },
      { name: "DLC-Bad-Homburg-Fitness", link: "Core Port 47 ➔ Port 1" }
    ]
  },

  bicester: {
    siteId: "bicester",
    siteName: "Bicester",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Bicester-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Bicester-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Bicester-Main", type: "core", x: 750, y: 550 },
      { id: "sw_sub", name: "DLC-Bicester-Subrack", type: "distribution", x: 380, y: 740 },
      { id: "sw_lynx", name: "DLC-Bicester-Lynxight", type: "edge", x: 1120, y: 740 },
      { id: "sw_spa", name: "DLC-Bicester-Spa", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 48", toPort: "Port 1" },
      { fromId: "sw_sub", toId: "sw_spa", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Bicester-Subrack", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-Bicester-Spa", link: "Subrack Port 24 ➔ Port 1" },
      { name: "DLC-Bicester-Lynxight", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  boadilla: {
    siteId: "boadilla",
    siteName: "Boadilla",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Boadilla-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Boadilla-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Boadilla-Core", type: "core", x: 750, y: 550 },
      { id: "sw_fl1", name: "DLC-Boadilla-Floor1", type: "distribution", x: 380, y: 740 },
      { id: "sw_kids", name: "DLC-Boadilla-Kids", type: "edge", x: 1120, y: 740 },
      { id: "sw_lynx", name: "DLC-Boadilla-Lynxight", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_fl1", fromPort: "Port 47", toPort: "Port 48" },
      { fromId: "core", toId: "sw_kids", fromPort: "Port 48", toPort: "Port 1" },
      { fromId: "sw_fl1", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Boadilla-Floor1", link: "Core Port 47 ➔ Port 48" },
      { name: "DLC-Boadilla-Lynxight", link: "Floor1 Port 24 ➔ Port 24" },
      { name: "DLC-Boadilla-Kids", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  cricklewood: {
    siteId: "cricklewood",
    siteName: "Cricklewood",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Cricklewood-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Cricklewood-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Cricklewood-Core", type: "core", x: 750, y: 550 },
      { id: "sw_main2", name: "DLC-Cricklewood-MainComms-2", type: "distribution", x: 380, y: 740 },
      { id: "sw_gym", name: "DLC-Cricklewood-Gym", type: "edge", x: 1120, y: 740 },
      { id: "sw_lynx", name: "DLC-Cricklewood-Lynxight", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "sw_main2", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Cricklewood-MainComms-2", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Cricklewood-Lynxight", link: "MainComms-2 Port 24 ➔ Port 1" },
      { name: "DLC-Cricklewood-Gym", link: "Core Port 47 ➔ Port 1" }
    ]
  },

  "gava-mar": {
    siteId: "gava-mar",
    siteName: "Gava Mar",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "GavaMar-MXP", type: "firewall", x: 600, y: 380 },
      { id: "fw2", name: "GavaMar-MXS", type: "firewall", x: 1000, y: 380 },
      { id: "core", name: "DLC-GavaMar-Core", type: "core", x: 800, y: 560 },
      { id: "sw1", name: "DLC-GavaMar-Tennis", type: "edge", x: 300, y: 840 },
      { id: "sw2", name: "DLC-GavaMar-Lynxight", type: "edge", x: 800, y: 840 },
      { id: "sw3", name: "DLC-GavaMar-Clubhouse", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw2", fromPort: "Port 48", toPort: "Port 24" },
      { fromId: "core", toId: "sw3", fromPort: "Port 46", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-GavaMar-Tennis", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-GavaMar-Lynxight", link: "Core Port 48 ➔ Port 24" },
      { name: "DLC-GavaMar-Clubhouse", link: "Core Port 46 ➔ Port 1" }
    ]
  },

  "geneva-cc": {
    siteId: "geneva-cc",
    siteName: "Geneva Country Club",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Geneva-CC-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Geneva-CC-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Geneva-CC-Core", type: "core", x: 750, y: 550 },
      { id: "sw_main2", name: "DLC-Geneva-CC-Main-2", type: "distribution", x: 380, y: 740 },
      { id: "sw_lynx", name: "DLC-Geneva-CC-Lynxight", type: "edge", x: 1120, y: 740 },
      { id: "sw_pro", name: "DLC-Geneva-CC-ProShop", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "sw_main2", toId: "sw_pro", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Geneva-CC-Main-2", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Geneva-CC-ProShop", link: "Main-2 Port 24 ➔ Port 1" },
      { name: "DLC-Geneva-CC-Lynxight", link: "Core Port 47 ➔ Port 1" }
    ]
  },

  harlow: {
    siteId: "harlow",
    siteName: "Harlow",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Harlow-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Harlow-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Harlow-Main", type: "core", x: 750, y: 550 },
      { id: "sw_sub", name: "DLC-Harlow-Subrack", type: "distribution", x: 380, y: 740 },
      { id: "sw_lynx", name: "DLC-Harlow-Lynxight", type: "edge", x: 1120, y: 740 },
      { id: "sw_gym", name: "DLC-Harlow-Gym", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 48", toPort: "Port 1" },
      { fromId: "sw_sub", toId: "sw_gym", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Harlow-Subrack", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-Harlow-Gym", link: "Subrack Port 24 ➔ Port 1" },
      { name: "DLC-Harlow-Lynxight", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  sterrebeek: {
    siteId: "sterrebeek",
    siteName: "Sterrebeek",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Sterrebeek-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Sterrebeek-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Sterrebeek-Core", type: "core", x: 750, y: 550 },
      { id: "sw_main2", name: "DLC-Sterrebeek-Main-2", type: "distribution", x: 380, y: 740 },
      { id: "sw_lynx", name: "DLC-Sterrebeek-Lynxight", type: "edge", x: 1120, y: 740 },
      { id: "sw_spa", name: "DLC-Sterrebeek-Spa", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "sw_main2", toId: "sw_spa", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Sterrebeek-Main-2", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Sterrebeek-Spa", link: "Main-2 Port 24 ➔ Port 1" },
      { name: "DLC-Sterrebeek-Lynxight", link: "Core Port 47 ➔ Port 1" }
    ]
  },

  wickwoods: {
    siteId: "wickwoods",
    siteName: "Wickwoods",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Wickwoods-MXP", type: "firewall", x: 600, y: 380 },
      { id: "fw2", name: "Wickwoods-MXS", type: "firewall", x: 1000, y: 380 },
      { id: "core", name: "DLC-Wickwoods-Core", type: "core", x: 800, y: 560 },
      { id: "sw1", name: "DLC-Wickwoods-MainComms-2", type: "edge", x: 300, y: 840 },
      { id: "sw2", name: "DLC-Wickwoods-Lynxight", type: "edge", x: 800, y: 840 },
      { id: "sw3", name: "DLC-Wickwoods-Pavilion", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw2", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw3", fromPort: "Port 46", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Wickwoods-MainComms-2", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Wickwoods-Lynxight", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-Wickwoods-Pavilion", link: "Core Port 46 ➔ Port 1" }
    ]
  },

  enfield: {
    siteId: "enfield",
    siteName: "Enfield",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "DLL-Enfield-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "DLL-Enfield-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-Enfield-Core", type: "core", x: 750, y: 550 },
      { id: "sw_sub", name: "DLL-Enfield-Subrack", type: "distribution", x: 380, y: 740 },
      { id: "sw_lynx", name: "DLL-Enfield-Lynxight", type: "edge", x: 1120, y: 740 },
      { id: "sw_gym", name: "DLL-Enfield-Gym", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 48", toPort: "Port 1" },
      { fromId: "sw_sub", toId: "sw_gym", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLL-Enfield-Subrack", link: "Core Port 47 ➔ Port 1" },
      { name: "DLL-Enfield-Gym", link: "Subrack Port 24 ➔ Port 1" },
      { name: "DLL-Enfield-Lynxight", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  peterborough: {
    siteId: "peterborough",
    siteName: "Peterborough",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Peterborough-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Peterborough-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Peterborough-Core", type: "core", x: 750, y: 550 },
      { id: "sw_main2", name: "DLC-Peterborough-MainComms-2", type: "distribution", x: 380, y: 740 },
      { id: "sw_gym", name: "DLC-Peterborough-Gym", type: "edge", x: 1120, y: 740 },
      { id: "sw_lynx", name: "DLC-Peterborough-Lynxight", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "sw_main2", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Peterborough-MainComms-2", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Peterborough-Lynxight", link: "MainComms-2 Port 24 ➔ Port 1" },
      { name: "DLC-Peterborough-Gym", link: "Core Port 47 ➔ Port 1" }
    ]
  },

  poole: {
    siteId: "poole",
    siteName: "Poole",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Poole-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Poole-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Poole-Core", type: "core", x: 750, y: 550 },
      { id: "sw_sub", name: "DLC-Poole-Subrack", type: "distribution", x: 380, y: 740 },
      { id: "sw_gym", name: "DLC-Poole-Gym", type: "edge", x: 1120, y: 740 },
      { id: "sw_lynx", name: "DLC-Poole-Lynxight", type: "edge", x: 380, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 48", toPort: "Port 1" },
      { fromId: "sw_sub", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Poole-Subrack", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-Poole-Lynxight", link: "Subrack Port 24 ➔ Port 1" },
      { name: "DLC-Poole-Gym", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  ringwood: {
    siteId: "ringwood",
    siteName: "Ringwood",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Ringwood-MXP", type: "firewall", x: 600, y: 380 },
      { id: "fw2", name: "Ringwood-MXS", type: "firewall", x: 1000, y: 380 },
      { id: "core", name: "DLC-Ringwood-SW1", type: "core", x: 800, y: 560 },
      { id: "sw_gym", name: "DLL-Ringwood-Gym", type: "edge", x: 300, y: 840 },
      { id: "sw_lynx", name: "DLC-Ringwood-Lynxight", type: "edge", x: 800, y: 840 },
      { id: "sw_sw2", name: "DLC-Ringwood-SW2", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 4", toPort: "Port 24" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw_sw2", fromPort: "Port 48", toPort: "Port 45" }
    ],
    uplinkSummary: [
      { name: "DLL-Ringwood-Gym", link: "Core Port 4 ➔ Port 24" },
      { name: "DLC-Ringwood-Lynxight", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-Ringwood-SW2", link: "Core Port 48 ➔ Port 45" }
    ]
  },

  "rotterdam-centrum": {
    siteId: "rotterdam-centrum",
    siteName: "Rotterdam Centrum",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Rotterdam_Centrum-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Rotterdam_Centrum-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-RotterdamCentrum", type: "core", x: 700, y: 560 },
      { id: "sw_sub", name: "DLC-Centrum-24port", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 48", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Centrum-24port", link: "Core Port 48 ➔ Port 24" }
    ]
  },

  sidcup: {
    siteId: "sidcup",
    siteName: "Sidcup",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Sidcup-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Sidcup-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Sidcup-MainComms-2", type: "core", x: 750, y: 560 },
      { id: "sw_lynx", name: "DLC-Sidcup-Lynxight", type: "edge", x: 400, y: 840 },
      { id: "sw_dll", name: "DLL-Sidcup", type: "edge", x: 1100, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 46", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 48", toPort: "Port 44" }
    ],
    uplinkSummary: [
      { name: "DLC-Sidcup-Lynxight", link: "Core Port 46 ➔ Port 1" },
      { name: "DLL-Sidcup", link: "Core Port 48 ➔ Port 44" }
    ]
  },

  "solihull-cranmore": {
    siteId: "solihull-cranmore",
    siteName: "Solihull Cranmore",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Solihull_Cranmore-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Solihull_Cranmore-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-SolihullCranmore-MainComms", type: "core", x: 750, y: 560 },
      { id: "sw_lynx", name: "DLC-SolihullCranmore-Lynxight", type: "edge", x: 400, y: 840 },
      { id: "sw_dll", name: "DLLSolihullCranmore", type: "edge", x: 1100, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 31", toPort: "Port 21" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 4", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-SolihullCranmore-Lynxight", link: "Core Port 31 ➔ Port 21" },
      { name: "DLLSolihullCranmore", link: "Core Port 4 ➔ Port 24" }
    ]
  },

  southampton: {
    siteId: "southampton",
    siteName: "Southampton",
    viewBox: "0 0 1500 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Southampton-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Southampton-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-Southampton-Comms", type: "core", x: 750, y: 560 },
      { id: "sw_x440", name: "DLL-Southampton-X440-G2-24t", type: "edge", x: 380, y: 780 },
      { id: "sw_comms2", name: "DLL-Southampton-Comms-2", type: "distribution", x: 1120, y: 780 },
      { id: "sw_plant", name: "DLC-Southampton-Plant", type: "edge", x: 1120, y: 940 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_x440", fromPort: "Port 13", toPort: "Port 1" },
      { fromId: "core", toId: "sw_comms2", fromPort: "Port 48", toPort: "Port 45" },
      { fromId: "sw_comms2", toId: "sw_plant", fromPort: "Port 44", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLL-Southampton-X440-G2-24t", link: "Comms Port 13 ➔ Port 1" },
      { name: "DLL-Southampton-Comms-2", link: "Comms Port 48 ➔ Port 45" },
      { name: "DLC-Southampton-Plant", link: "Comms-2 Port 44 ➔ Port 24" }
    ]
  },

  "southampton-west-end": {
    siteId: "southampton-west-end",
    siteName: "Southampton West End",
    viewBox: "0 0 1500 1150",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Solihull_Cranmore-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Solihull_Cranmore-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-SWE-MainComms-SW2", type: "core", x: 750, y: 550 },
      { id: "sw_sw3", name: "DLC-SWE-MainComms-SW3", type: "edge", x: 1150, y: 680 },
      { id: "sw_sw1", name: "DLC-SWE-MainComms-SW1", type: "distribution", x: 450, y: 680 },
      { id: "sw_cabA", name: "DLC-SWE-CabA-SW1", type: "distribution", x: 450, y: 790 },
      { id: "sw_cabB", name: "DLC-SWE-CabB-SW1", type: "distribution", x: 450, y: 900 },
      { id: "sw_cabC", name: "DLC-SWE-CabC-SW1", type: "edge", x: 450, y: 1010 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sw3", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "core", toId: "sw_sw1", fromPort: "Port 46", toPort: "Port 28" },
      { fromId: "sw_sw1", toId: "sw_cabA", fromPort: "Port 25", toPort: "Port 25" },
      { fromId: "sw_cabA", toId: "sw_cabB", fromPort: "Port 26", toPort: "Port 26" },
      { fromId: "sw_cabB", toId: "sw_cabC", fromPort: "Port 27", toPort: "Port 27" }
    ],
    uplinkSummary: [
      { name: "DLC-SWE-MainComms-SW3", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-SWE-MainComms-SW1", link: "Core Port 46 ➔ Port 28" },
      { name: "DLC-SWE-CabA-SW1", link: "SW1 Port 25 ➔ Port 25" },
      { name: "DLC-SWE-CabB-SW1", link: "CabA Port 26 ➔ Port 26" },
      { name: "DLC-SWE-CabC-SW1", link: "CabB Port 27 ➔ Port 27" }
    ]
  },

  southend: {
    siteId: "southend",
    siteName: "Southend",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Southend-MXP", type: "firewall", x: 600, y: 380 },
      { id: "fw2", name: "Southend-MXS", type: "firewall", x: 1000, y: 380 },
      { id: "core", name: "DLC-Southend", type: "core", x: 800, y: 560 },
      { id: "sw_gym", name: "DLC-Southend-Gym", type: "edge", x: 300, y: 840 },
      { id: "sw_dll", name: "DLL-Southend", type: "edge", x: 800, y: 840 },
      { id: "sw_lynx", name: "DLC-Southend-Lynxight", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 36", toPort: "Port 24" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 46", toPort: "Port 18" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 10", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Southend-Gym", link: "Core Port 36 ➔ Port 24" },
      { name: "DLL-Southend", link: "Core Port 46 ➔ Port 18" },
      { name: "DLC-Southend-Lynxight", link: "Core Port 10 ➔ Port 1" }
    ]
  },

  speke: {
    siteId: "speke",
    siteName: "Speke",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Speke-MXS", type: "firewall", x: 600, y: 380 },
      { id: "fw2", name: "Speke-MXP", type: "firewall", x: 1000, y: 380 },
      { id: "core", name: "DLC-Speke", type: "core", x: 800, y: 560 },
      { id: "sw_lynx", name: "DLC-Speke-Lynxight", type: "edge", x: 300, y: 840 },
      { id: "sw_dll", name: "DLL-Speke", type: "edge", x: 800, y: 840 },
      { id: "sw_spa", name: "DLC-Speke-Spa", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 6", toPort: "Port 23" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 47", toPort: "Port 24" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 44", toPort: "Port 12" }
    ],
    uplinkSummary: [
      { name: "DLC-Speke-Lynxight", link: "Core Port 6 ➔ Port 23" },
      { name: "DLL-Speke", link: "Core Port 47 ➔ Port 24" },
      { name: "DLC-Speke-Spa", link: "Core Port 44 ➔ Port 12" }
    ]
  },

  stevenage: {
    siteId: "stevenage",
    siteName: "Stevenage",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Stevenage-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Stevenage-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Stevenage", type: "core", x: 750, y: 560 },
      { id: "sw_dll", name: "DLL-Stevenage", type: "edge", x: 400, y: 840 },
      { id: "sw_lynx", name: "DLC-Stevenage-Lynxight", type: "edge", x: 1100, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 45", toPort: "Port 23" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLL-Stevenage", link: "Core Port 45 ➔ Port 23" },
      { name: "DLC-Stevenage-Lynxight", link: "Core Port 24 ➔ Port 24" }
    ]
  },

  "sudbury-hill": {
    siteId: "sudbury-hill",
    siteName: "Sudbury Hill",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Sudbury_Hill-MXP", type: "firewall", x: 600, y: 380 },
      { id: "fw2", name: "Sudbury_Hill-MXS", type: "firewall", x: 1000, y: 380 },
      { id: "core", name: "DLC-SudburyHill", type: "core", x: 800, y: 560 },
      { id: "sw_lynx", name: "DLC-SudburyHill-Lynxight", type: "edge", x: 300, y: 840 },
      { id: "sw_dll", name: "DLL-SudburyHill", type: "edge", x: 800, y: 840 },
      { id: "sw_spa", name: "DLC-SudburyHill-Spa", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 36", toPort: "Port 24" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 42", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-SudburyHill-Lynxight", link: "Core Port 36 ➔ Port 24" },
      { name: "DLL-SudburyHill", link: "Core Port 1 ➔ Port 1" },
      { name: "DLC-SudburyHill-Spa", link: "Core Port 42 ➔ Port 1" }
    ]
  },

  sunderland: {
    siteId: "sunderland",
    siteName: "Sunderland",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Sunderland-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Sunderland-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Sunderland-MainComms", type: "core", x: 750, y: 560 },
      { id: "sw_lynx", name: "DLC-Sunderland-Lynxight", type: "edge", x: 400, y: 840 },
      { id: "sw_dll", name: "DLL-Sunderland", type: "edge", x: 1100, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 41", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 47", toPort: "Port 20" }
    ],
    uplinkSummary: [
      { name: "DLC-Sunderland-Lynxight", link: "Core Port 41 ➔ Port 1" },
      { name: "DLL-Sunderland", link: "Core Port 47 ➔ Port 20" }
    ]
  },

  swansea: {
    siteId: "swansea",
    siteName: "Swansea",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Swansea-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Swansea-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DL-Glamorgan", type: "core", x: 750, y: 560 },
      { id: "sw_dll", name: "DLL-Swansea", type: "edge", x: 400, y: 840 },
      { id: "sw_lynx", name: "DLC-Swansea-Lynxight", type: "edge", x: 1100, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 43", toPort: "Port 21" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 29", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLL-Swansea", link: "DL-Glamorgan Port 43 ➔ Port 21" },
      { name: "DLC-Swansea-Lynxight", link: "DL-Glamorgan Port 29 ➔ Port 24" }
    ]
  },

  swindon: {
    siteId: "swindon",
    siteName: "Swindon",
    viewBox: "0 0 1500 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 750, y: 130 },
      { id: "fw1", name: "Swindon-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Swindon-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Swindon", type: "core", x: 750, y: 560 },
      { id: "sw_lynx1", name: "DLC-Swindon-Lynxight-1", type: "edge", x: 400, y: 840 },
      { id: "sw_lynx2", name: "DLC-Swindon-Lynxight-2", type: "edge", x: 1100, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx1", fromPort: "Port 36", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx2", fromPort: "Port 45", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Swindon-Lynxight-1", link: "Core Port 36 ➔ Port 1" },
      { name: "DLC-Swindon-Lynxight-2", link: "Core Port 45 ➔ Port 24" }
    ]
  },

  teesside: {
    siteId: "teesside",
    siteName: "Teesside",
    viewBox: "0 0 1400 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Teesside-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Teesside-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Teeside", type: "core", x: 700, y: 560 },
      { id: "sw_stk1", name: "DLC-Teeside-2", type: "distribution", x: 700, y: 760 },
      { id: "sw_stk2", name: "DLC-Teeside-2 (Stack)", type: "edge", x: 700, y: 940 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_stk1", fromPort: "Port 3", toPort: "Port 1" },
      { fromId: "sw_stk1", toId: "sw_stk2", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Teeside-2", link: "Core Port 3 ➔ Port 1" },
      { name: "DLC-Teeside-2 (Stack)", link: "Teeside-2 Port 24 ➔ Port 1" }
    ]
  },

  blijdorp: {
    siteId: "blijdorp",
    siteName: "Blijdorp Rotterdam",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Blijdorp-MXS", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Blijdorp-MXP", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Blijdorp", type: "core", x: 700, y: 560 },
      { id: "sw_sub", name: "DLC-Blijdorp-Subrack", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 48", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Blijdorp-Subrack", link: "Core Port 48 ➔ Port 24" }
    ]
  },

  norwich: {
    siteId: "norwich",
    siteName: "Norwich",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Norwich-MXS", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Norwich-MXP", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Norwich", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Norwich-Lnyxight", type: "edge", x: 350, y: 840 },
      { id: "sw_dll", name: "DLL-Norwich", type: "edge", x: 700, y: 840 },
      { id: "sw_sub", name: "DLC-NorwichSubRack", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 28", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 43", toPort: "Port 24" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 47" }
    ],
    uplinkSummary: [
      { name: "DLC-Norwich-Lnyxight", link: "Core Port 28 ➔ Port 1" },
      { name: "DLL-Norwich", link: "Core Port 43 ➔ Port 24" },
      { name: "DLC-NorwichSubRack", link: "Core Port 47 ➔ Port 47" }
    ]
  },

  "port-solent": {
    siteId: "port-solent",
    siteName: "Port Solent",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Port_Solent-MXP", type: "firewall", x: 500, y: 420 },
      { id: "fw2", name: "Port_Solent-MXS", type: "firewall", x: 900, y: 420 },
      { id: "sw_core1", name: "DLC-PortSolent", type: "core", x: 500, y: 780 },
      { id: "sw_core2", name: "DLC-PortSolent-2", type: "core", x: 900, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "sw_core1", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "sw_core2", fromPort: "Port 1", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-PortSolent", link: "Port_Solent-MXP ➔ Port 1" },
      { name: "DLC-PortSolent-2", link: "Port_Solent-MXS ➔ Port 1" }
    ]
  },

  purley: {
    siteId: "purley",
    siteName: "Purley",
    viewBox: "0 0 1400 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Purley-MXP", type: "firewall", x: 500, y: 350 },
      { id: "fw2", name: "Purley-MXS", type: "firewall", x: 900, y: 350 },
      { id: "core", name: "DLC-Poole-Main-1", type: "core", x: 700, y: 530 },
      { id: "dist", name: "DLL-Purley", type: "distribution", x: 700, y: 710 },
      { id: "sw_gym", name: "DLC-Purley-Gym", type: "edge", x: 350, y: 920 },
      { id: "sw_dll", name: "DLL-Purley (Sub)", type: "edge", x: 700, y: 920 },
      { id: "sw_dl", name: "DL-Purley", type: "edge", x: 1050, y: 920 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "dist", fromPort: "Port 7", toPort: "Port 48" },
      { fromId: "dist", toId: "sw_gym", fromPort: "Port 24", toPort: "Port 25" },
      { fromId: "dist", toId: "sw_dll", fromPort: "Port 45", toPort: "Port 4" },
      { fromId: "dist", toId: "sw_dl", fromPort: "Port 45", toPort: "Port 45" }
    ],
    uplinkSummary: [
      { name: "DLL-Purley", link: "Core Port 7 ➔ Port 48" },
      { name: "DLC-Purley-Gym", link: "DLL-Purley Port 24 ➔ Port 25" },
      { name: "DLL-Purley (Sub)", link: "DLL-Purley Port 45 ➔ Port 4" },
      { name: "DL-Purley", link: "DLL-Purley Port 45 ➔ Port 45" }
    ]
  },

  "raynes-park": {
    siteId: "raynes-park",
    siteName: "Raynes Park",
    viewBox: "0 0 1400 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Raynes_Park-MXP", type: "firewall", x: 500, y: 350 },
      { id: "fw2", name: "Raynes_Park-MXS", type: "firewall", x: 900, y: 350 },
      { id: "core", name: "DLL-RaynesPark-MainComms", type: "core", x: 700, y: 530 },
      { id: "sw_lynx", name: "DLC-Raynes-Lynxight", type: "edge", x: 300, y: 720 },
      { id: "sw_gym", name: "DLL-RaynesPark-GymX48", type: "distribution", x: 700, y: 720 },
      { id: "sw_spa", name: "DLC-RaynesPark-Spa", type: "edge", x: 1100, y: 720 },
      { id: "sw_office", name: "DLC-RayesPark-Office", type: "edge", x: 700, y: 930 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 39", toPort: "Port 24" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 47", toPort: "Port 47" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 46", toPort: "Port 48" },
      { fromId: "sw_gym", toId: "sw_office", fromPort: "Port 24", toPort: "Port 45" }
    ],
    uplinkSummary: [
      { name: "DLC-Raynes-Lynxight", link: "Core Port 39 ➔ Port 24" },
      { name: "DLL-RaynesPark-GymX48", link: "Core Port 47 ➔ Port 47" },
      { name: "DLC-RaynesPark-Spa", link: "Core Port 46 ➔ Port 48" },
      { name: "DLC-RayesPark-Office", link: "GymX48 Port 24 ➔ Port 45" }
    ]
  },

  reading: {
    siteId: "reading",
    siteName: "Reading",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Reading-MXS (1)", type: "firewall", x: 500, y: 400 },
      { id: "fw2", name: "Reading-MXS (2)", type: "firewall", x: 900, y: 400 },
      { id: "core", name: "DLC-Reading", type: "core", x: 700, y: 640 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" }
    ],
    uplinkSummary: [
      { name: "DLC-Reading", link: "Reading-MXS 1/2 Port 1 & 2" }
    ]
  },

  "royal-berkshire": {
    siteId: "royal-berkshire",
    siteName: "Royal Berkshire",
    viewBox: "0 0 1400 1100",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Royal_Berkshire-MXP", type: "firewall", x: 500, y: 350 },
      { id: "fw2", name: "Royal_Berkshire-MXS", type: "firewall", x: 900, y: 350 },
      { id: "core", name: "DL-RoyalBerkshire", type: "core", x: 700, y: 520 },
      { id: "sw_lynx", name: "DLC-RoyalBerkshire-Lnyxight", type: "edge", x: 300, y: 700 },
      { id: "sw_rbc48", name: "DL-RBC-48-2", type: "distribution", x: 950, y: 700 },
      { id: "sw_gym1", name: "DL-RBC-24-GYM1", type: "distribution", x: 800, y: 880 },
      { id: "sw_gym2", name: "DL-RBC-24-GYM1 (Stack)", type: "edge", x: 800, y: 1040 },
      { id: "sw_edge", name: "DL-RoyalBerkshire (Edge)", type: "edge", x: 1150, y: 880 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 3", toPort: "Port 24" },
      { fromId: "core", toId: "sw_rbc48", fromPort: "Port 51", toPort: "Port 51" },
      { fromId: "sw_rbc48", toId: "sw_gym1", fromPort: "Port 48", toPort: "Port 24" },
      { fromId: "sw_gym1", toId: "sw_gym2", fromPort: "Port 23", toPort: "Port 24" },
      { fromId: "sw_rbc48", toId: "sw_edge", fromPort: "Port 51", toPort: "Port 51" }
    ],
    uplinkSummary: [
      { name: "DLC-RoyalBerkshire-Lnyxight", link: "Core Port 3 ➔ Port 24" },
      { name: "DL-RBC-48-2", link: "Core Port 51 ➔ Port 51" },
      { name: "DL-RBC-24-GYM1", link: "DL-RBC-48-2 Port 48 ➔ Port 24" },
      { name: "DL-RBC-24-GYM1 (Stack)", link: "GYM1 Port 23 ➔ Port 24" },
      { name: "DL-RoyalBerkshire (Edge)", link: "DL-RBC-48-2 Port 51 ➔ Port 51" }
    ]
  },

  warrington: {
    siteId: "warrington",
    siteName: "Warrington",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Warrington-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Warrington-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Warrington", type: "core", x: 700, y: 560 },
      { id: "sw_lynx1", name: "DLC-Warrington-Lynxight", type: "edge", x: 350, y: 840 },
      { id: "sw_dll", name: "DLL-Warrington", type: "edge", x: 700, y: 840 },
      { id: "sw_lynx2", name: "DLC-Warrington-Lynxight-2", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx1", fromPort: "Port 46", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 44", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx2", fromPort: "Port 30", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Warrington-Lynxight", link: "Core Port 46 ➔ Port 1" },
      { name: "DLL-Warrington", link: "Core Port 44 ➔ Port 1" },
      { name: "DLC-Warrington-Lynxight-2", link: "Core Port 30 ➔ Port 1" }
    ]
  },

  "west-bridgford": {
    siteId: "west-bridgford",
    siteName: "West Bridgford",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "West_Bridgford-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "West_Bridgford-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-WestBridgford-MainComms", type: "core", x: 700, y: 560 },
      { id: "sw_sub", name: "DLC-WestBridgford-Subrack", type: "edge", x: 350, y: 840 },
      { id: "sw_dll", name: "DLL-WestBridgeford", type: "edge", x: 700, y: 840 },
      { id: "sw_lynx", name: "DLC-WestBridgeford-Lynxight", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 37", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 4", toPort: "Port 23" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 11", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-WestBridgford-Subrack", link: "Core Port 37 ➔ Port 1" },
      { name: "DLL-WestBridgeford", link: "Core Port 4 ➔ Port 23" },
      { name: "DLC-WestBridgeford-Lynxight", link: "Core Port 11 ➔ Port 1" }
    ]
  },

  aravaca: {
    siteId: "aravaca",
    siteName: "Aravaca Madrid",
    viewBox: "0 0 1400 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Aravaca-MXP", type: "firewall", x: 500, y: 360 },
      { id: "fw2", name: "Aravaca-MXS", type: "firewall", x: 900, y: 360 },
      { id: "core", name: "DLL-Lincoln-MainComms", type: "core", x: 700, y: 530 },
      { id: "sw_mad", name: "DLL-Madrid", type: "distribution", x: 700, y: 720 },
      { id: "sw_lynx", name: "DLC-Madrid-Lynxight", type: "edge", x: 450, y: 920 },
      { id: "sw_bar", name: "DLL-MAD-Bar", type: "edge", x: 950, y: 920 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_mad", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "sw_mad", toId: "sw_lynx", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "sw_mad", toId: "sw_bar", fromPort: "Port 2", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLL-Madrid", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Madrid-Lynxight", link: "DLL-Madrid ➔ Port 1" },
      { name: "DLL-MAD-Bar", link: "DLL-Madrid ➔ Port 1" }
    ]
  },

  "edinburgh-newhaven": {
    siteId: "edinburgh-newhaven",
    siteName: "Edinburgh Newhaven Harbour",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Newhaven-Harbour-MXS", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Newhaven-Harbour-MXP", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Newhaven-48", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Newhaven-Lynxight", type: "edge", x: 450, y: 840 },
      { id: "sw_dll", name: "DLLEdinburghNewhaven", type: "edge", x: 950, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 36", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Newhaven-Lynxight", link: "Core Port 24 ➔ Port 1" },
      { name: "DLLEdinburghNewhaven", link: "Core Port 36 ➔ Port 24" }
    ]
  },

  ipswich: {
    siteId: "ipswich",
    siteName: "Ipswich",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Ipswich-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Ipswich-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Ipswich-Gym.3", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Ipswich-Lnyxight", type: "edge", x: 450, y: 840 },
      { id: "sw_main", name: "DLC-Ipswich-MainComms", type: "edge", x: 950, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 45", toPort: "Port 24" },
      { fromId: "core", toId: "sw_main", fromPort: "Port 47", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-Ipswich-Lnyxight", link: "Core Port 45 ➔ Port 24" },
      { name: "DLC-Ipswich-MainComms", link: "Core Port 47 ➔ Port 48" }
    ]
  },

  kensington: {
    siteId: "kensington",
    siteName: "Kensington",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Kensington-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Kensington-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLL-Kensington-MainRack", type: "core", x: 700, y: 560 },
      { id: "sw_b2", name: "DLL-Kensington-B2", type: "edge", x: 450, y: 840 },
      { id: "sw_sub", name: "DLL-Kensington-MainRack (Sub)", type: "edge", x: 950, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_b2", fromPort: "Port 47", toPort: "Port 21" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 48", toPort: "Port 21" }
    ],
    uplinkSummary: [
      { name: "DLL-Kensington-B2", link: "Core Port 47 ➔ Port 21" },
      { name: "DLL-Kensington-MainRack (Sub)", link: "Core Port 48 ➔ Port 21" }
    ]
  },

  kidbrooke: {
    siteId: "kidbrooke",
    siteName: "Kidbrooke Village",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Kidbrooke_Village-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Kidbrooke_Village-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLL-Kidbrooke-MainRack", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Kidbrooke-Lynxight", type: "edge", x: 350, y: 840 },
      { id: "sw_sub", name: "DLL-Kidbrooke-SubRack", type: "edge", x: 700, y: 840 },
      { id: "sw_main2", name: "DLL-Kidbrooke-MainRack-2", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 45", toPort: "Port 24" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 48" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 48", toPort: "Port 47" }
    ],
    uplinkSummary: [
      { name: "DLC-Kidbrooke-Lynxight", link: "Core Port 45 ➔ Port 24" },
      { name: "DLL-Kidbrooke-SubRack", link: "Core Port 47 ➔ Port 48" },
      { name: "DLL-Kidbrooke-MainRack-2", link: "Core Port 48 ➔ Port 47" }
    ]
  },

  "kings-hill": {
    siteId: "kings-hill",
    siteName: "Kings Hill",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Kings_Hill-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Kings_Hill-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLL-KingsHill-MainRack", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-KingsHill-Lynxight", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 45", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-KingsHill-Lynxight", link: "Core Port 45 ➔ Port 24" }
    ]
  },

  knowsley: {
    siteId: "knowsley",
    siteName: "Knowsley",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Knowsley-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Knowsley-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Knowsley-MainComms-2", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Knowsley-Lynxight", type: "edge", x: 450, y: 840 },
      { id: "sw_dll", name: "DLL-Knowsley-MainComms", type: "edge", x: 950, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 46", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 48", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Knowsley-Lynxight", link: "Core Port 46 ➔ Port 1" },
      { name: "DLL-Knowsley-MainComms", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  narborough: {
    siteId: "narborough",
    siteName: "Narborough",
    viewBox: "0 0 1400 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Narborough-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Narborough-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Narborough", type: "core", x: 700, y: 560 },
      { id: "sw_gym", name: "DLC-Narborough-Gym", type: "distribution", x: 400, y: 780 },
      { id: "sw_lynx", name: "DLC-Narborough-Lynxight", type: "edge", x: 400, y: 920 },
      { id: "sw_dll", name: "DLLNarborough", type: "edge", x: 1000, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 35", toPort: "Port 24" },
      { fromId: "sw_gym", toId: "sw_lynx", fromPort: "Port 17", toPort: "Port 24" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 47", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Narborough-Gym", link: "Core Port 35 ➔ Port 24" },
      { name: "DLC-Narborough-Lynxight", link: "Gym Port 17 ➔ Port 24" },
      { name: "DLLNarborough", link: "Core Port 47 ➔ Port 24" }
    ]
  },

  newbury: {
    siteId: "newbury",
    siteName: "Newbury",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Newbury-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Newbury-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLL-Newbury-Stack.4", type: "core", x: 700, y: 560 },
      { id: "sw_sub1", name: "DLL-Newbury-Stack.4 (Sub 1)", type: "edge", x: 400, y: 840 },
      { id: "sw_sub2", name: "DLL-Newbury-Stack.4 (Sub 2)", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub1", fromPort: "Port 31", toPort: "Port 1" },
      { fromId: "core", toId: "sw_sub2", fromPort: "Port 18", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLL-Newbury-Stack.4 (Sub 1)", link: "Core Port 31 ➔ Port 1" },
      { name: "DLL-Newbury-Stack.4 (Sub 2)", link: "Core Port 18 ➔ Port 24" }
    ]
  },

  northwood: {
    siteId: "northwood",
    siteName: "Northwood",
    viewBox: "0 0 1400 1100",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Northwood-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Northwood-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLL-Northwood", type: "core", x: 700, y: 560 },
      { id: "sw_main2", name: "DLC-Northwood-MainComms-2", type: "distribution", x: 400, y: 720 },
      { id: "sw_gym", name: "DLC-Northwood-Gym", type: "distribution", x: 400, y: 860 },
      { id: "sw_fc1", name: "FemaleChange-X435-24P (Sub)", type: "edge", x: 400, y: 980 },
      { id: "sw_fc2", name: "FemaleChange-X435-24P", type: "edge", x: 1000, y: 720 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 41", toPort: "Port 26" },
      { fromId: "sw_main2", toId: "sw_gym", fromPort: "Port 16", toPort: "Port 24" },
      { fromId: "sw_gym", toId: "sw_fc1", fromPort: "Port 24", toPort: "Port 20" },
      { fromId: "core", toId: "sw_fc2", fromPort: "Port 48", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Northwood-MainComms-2", link: "Core Port 41 ➔ Port 26" },
      { name: "DLC-Northwood-Gym", link: "MainComms-2 Port 16 ➔ Port 24" },
      { name: "FemaleChange-X435-24P (Sub)", link: "Gym Port 24 ➔ Port 20" },
      { name: "FemaleChange-X435-24P", link: "Core Port 48 ➔ Port 24" }
    ]
  },

  "notting-hill": {
    siteId: "notting-hill",
    siteName: "Notting Hill Harbour Club",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Notting_Hill-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Notting_Hill-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "HC-Nottinghill-Maincomms", type: "core", x: 800, y: 560 },
      { id: "sw_dll", name: "DLLNottingHill", type: "edge", x: 200, y: 780 },
      { id: "sw_main2", name: "HC-Nottinghill-Maincomms-2", type: "edge", x: 600, y: 780 },
      { id: "sw_sub", name: "HC-NottingHill-Subrack", type: "edge", x: 1000, y: 780 },
      { id: "sw_lynx", name: "DLC-Nottinghill-Lynxight", type: "edge", x: 1400, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "fw1", toId: "sw_dll", fromPort: "Port 4", toPort: "Port 23" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 7", toPort: "Port 48" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 8", toPort: "Port 12" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 50", toPort: "Port 23" }
    ],
    uplinkSummary: [
      { name: "DLLNottingHill", link: "MXP Port 4 ➔ Port 23" },
      { name: "HC-Nottinghill-Maincomms-2", link: "Core Port 7 ➔ Port 48" },
      { name: "HC-NottingHill-Subrack", link: "Core Port 8 ➔ Port 12" },
      { name: "DLC-Nottinghill-Lynxight", link: "Core Port 50 ➔ Port 23" }
    ]
  },

  kingston: {
    siteId: "kingston",
    siteName: "Kingston",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Kingston-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Kingston-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Kingston", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Kingston-Lynxight", type: "edge", x: 400, y: 840 },
      { id: "sw_gym", name: "DLC-Kingston-Gym", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 47", toPort: "Port 24" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 48", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Kingston-Lynxight", link: "Core Port 47 ➔ Port 24" },
      { name: "DLC-Kingston-Gym", link: "Core Port 48 ➔ Port 24" }
    ]
  },

  lincoln: {
    siteId: "lincoln",
    siteName: "Lincoln",
    viewBox: "0 0 1400 980",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Lincoln-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Lincoln-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLL-Lincoln-MainComms", type: "core", x: 700, y: 560 },
      { id: "sw_main2", name: "DLL-Lincoln-MainComms-2", type: "distribution", x: 700, y: 720 },
      { id: "sw_main3", name: "DLL-Lincoln-MainComms-3", type: "edge", x: 700, y: 880 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 47", toPort: "Port 48" },
      { fromId: "sw_main2", toId: "sw_main3", fromPort: "Port 18", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLL-Lincoln-MainComms-2", link: "Core Port 47 ➔ Port 48" },
      { name: "DLL-Lincoln-MainComms-3", link: "MainComms-2 Port 18 ➔ Port 1" }
    ]
  },

  maidenhead: {
    siteId: "maidenhead",
    siteName: "Maidenhead",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Maidenhead-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Maidenhead-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Maidenhead", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Maidenhead-Lynxight", type: "edge", x: 400, y: 840 },
      { id: "sw_dll", name: "DLLMaidenhead", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 36", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 47", toPort: "Port 2" }
    ],
    uplinkSummary: [
      { name: "DLC-Maidenhead-Lynxight", link: "Core Port 36 ➔ Port 1" },
      { name: "DLLMaidenhead", link: "Core Port 47 ➔ Port 2" }
    ]
  },

  leeds: {
    siteId: "leeds",
    siteName: "Leeds",
    viewBox: "0 0 1400 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Leeds-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Leeds-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Leeds-MainComms-2", type: "core", x: 700, y: 560 },
      { id: "sw_sub", name: "DLL-Leeds-SubRack", type: "distribution", x: 450, y: 740 },
      { id: "sw_sub_x440", name: "DLL-Leeds-Subrack-X440-4", type: "edge", x: 250, y: 900 },
      { id: "sw_lynx", name: "DLC-Leeds-Lynxight", type: "edge", x: 650, y: 900 },
      { id: "sw_dll", name: "DLL-Leeds", type: "edge", x: 1050, y: 740 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 21" },
      { fromId: "sw_sub", toId: "sw_sub_x440", fromPort: "Port 4", toPort: "Port 1" },
      { fromId: "sw_sub", toId: "sw_lynx", fromPort: "Port 16", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 48", toPort: "Port 47" }
    ],
    uplinkSummary: [
      { name: "DLL-Leeds-SubRack", link: "Core Port 47 ➔ Port 21" },
      { name: "DLL-Leeds-Subrack-X440-4", link: "SubRack Port 4 ➔ Port 1" },
      { name: "DLC-Leeds-Lynxight", link: "SubRack Port 16 ➔ Port 1" },
      { name: "DLL-Leeds", link: "Core Port 48 ➔ Port 47" }
    ]
  },

  leicester: {
    siteId: "leicester",
    siteName: "Leicester",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Leicester-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Leicester-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Leicester-MainComms", type: "core", x: 700, y: 560 },
      { id: "sw_gym", name: "DLC-Leicester-Gym", type: "edge", x: 300, y: 840 },
      { id: "sw_dll", name: "DLLLeicester", type: "edge", x: 700, y: 840 },
      { id: "sw_lynx", name: "DLC-Leicester-Lynxight", type: "edge", x: 1100, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 6", toPort: "Port 2" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 46", toPort: "Port 24" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 6", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Leicester-Gym", link: "Core Port 6 ➔ Port 2" },
      { name: "DLLLeicester", link: "Core Port 46 ➔ Port 24" },
      { name: "DLC-Leicester-Lynxight", link: "Core Port 6 ➔ Port 24" }
    ]
  },

  lichfield: {
    siteId: "lichfield",
    siteName: "Lichfield",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Lichfield-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Lichfield-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DL-Lichfield", type: "core", x: 700, y: 560 },
      { id: "sw_sub", name: "DLC-Lichfield-Subrack", type: "edge", x: 300, y: 840 },
      { id: "sw_dll", name: "DLL-Lichfield", type: "edge", x: 700, y: 840 },
      { id: "sw_spa", name: "DLC-Lichfield-Spa", type: "edge", x: 1100, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 5", toPort: "Port 48" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 6", toPort: "Port 23" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 40", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-Lichfield-Subrack", link: "Core Port 5 ➔ Port 48" },
      { name: "DLL-Lichfield", link: "Core Port 6 ➔ Port 23" },
      { name: "DLC-Lichfield-Spa", link: "Core Port 40 ➔ Port 48" }
    ]
  },

  luton: {
    siteId: "luton",
    siteName: "Luton",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Luton-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Luton-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLL-Lincoln-MainComms", type: "core", x: 700, y: 560 },
      { id: "sw_sub1", name: "DLL-Lincoln-MainComms (Sub 1)", type: "edge", x: 400, y: 840 },
      { id: "sw_sub2", name: "DLL-Lincoln-MainComms (Sub 2)", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub1", fromPort: "Port 4", toPort: "Port 44" },
      { fromId: "core", toId: "sw_sub2", fromPort: "Port 48", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLL-Lincoln-MainComms (Sub 1)", link: "Core Port 4 ➔ Port 44" },
      { name: "DLL-Lincoln-MainComms (Sub 2)", link: "Core Port 48 ➔ Port 24" }
    ]
  },

  malaspain: {
    siteId: "malaspain",
    siteName: "Malaspina",
    viewBox: "0 0 1400 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Malaspina-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Malaspina-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DLC-Malaspina-1", type: "core", x: 700, y: 560 },
      { id: "sw_sw2", name: "DLC-Malaspina-2", type: "distribution", x: 400, y: 740 },
      { id: "sw_admin", name: "DLC-Malaspina-AdminOffice", type: "edge", x: 400, y: 920 },
      { id: "sw_spa", name: "DLC-Malaspina-Spa", type: "edge", x: 1000, y: 740 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sw2", fromPort: "Port 41", toPort: "Port 1" },
      { fromId: "sw_sw2", toId: "sw_admin", fromPort: "Port 33", toPort: "Port 1" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 45", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Malaspina-2", link: "Core Port 41 ➔ Port 1" },
      { name: "DLC-Malaspina-AdminOffice", link: "Switch-2 Port 33 ➔ Port 1" },
      { name: "DLC-Malaspina-Spa", link: "Core Port 45 ➔ Port 24" }
    ]
  },

  "manchester-north": {
    siteId: "manchester-north",
    siteName: "Manchester North",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Manchester_North-MXP", type: "firewall", x: 500, y: 380 },
      { id: "fw2", name: "Manchester_North-MXS", type: "firewall", x: 900, y: 380 },
      { id: "core", name: "DL-Manchester-North", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-ManchesterNorth-Lynxight", type: "edge", x: 400, y: 840 },
      { id: "sw_dll", name: "DLL-NorthManchester", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 21", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 46", toPort: "Port 7" }
    ],
    uplinkSummary: [
      { name: "DLC-ManchesterNorth-Lynxight", link: "Core Port 21 ➔ Port 1" },
      { name: "DLL-NorthManchester", link: "Core Port 46 ➔ Port 7" }
    ]
  },

  "milton-keynes": {
    siteId: "milton-keynes",
    siteName: "Milton Keynes",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Milton_Keynes-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Milton_Keynes-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-MiltonKeynes-MC1", type: "core", x: 800, y: 560 },
      { id: "sw_spa", name: "DLC-MiltonKeynes-Spa", type: "edge", x: 200, y: 840 },
      { id: "sw_office", name: "DLC-MiltonKeynes-Office", type: "edge", x: 600, y: 840 },
      { id: "sw_lynx", name: "DLC-MiltonKeynes-Lynxight", type: "edge", x: 1000, y: 840 },
      { id: "sw_hp", name: "DLL-MiltonKeynes-HP", type: "edge", x: 1400, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 15", toPort: "Port 1" },
      { fromId: "core", toId: "sw_office", fromPort: "Port 16", toPort: "Port 24" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 46", toPort: "Port 1" },
      { fromId: "core", toId: "sw_hp", fromPort: "Port 23", toPort: "Port 22" }
    ],
    uplinkSummary: [
      { name: "DLC-MiltonKeynes-Spa", link: "Core Port 15 ➔ Port 1" },
      { name: "DLC-MiltonKeynes-Office", link: "Core Port 16 ➔ Port 24" },
      { name: "DLC-MiltonKeynes-Lynxight", link: "Core Port 46 ➔ Port 1" },
      { name: "DLL-MiltonKeynes-HP", link: "Core Port 23 ➔ Port 22" }
    ]
  },

  "finchley": {
    siteId: "finchley",
    siteName: "Finchley",
    viewBox: "0 0 1600 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Finchley-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Finchley-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Finchley-MainComms-2", type: "core", x: 800, y: 560 },
      { id: "sw_gym", name: "DLC-Finchley-Gym", type: "edge", x: 450, y: 760 },
      { id: "sw_dll", name: "DLL-Finchley", type: "edge", x: 1150, y: 760 },
      { id: "sw_spa", name: "DLC-Finchley-Spa", type: "edge", x: 450, y: 950 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "sw_gym", toId: "sw_spa", fromPort: "Port 2", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Finchley-Gym", link: "Core Port 47 ➔ Port 1" },
      { name: "DLL-Finchley", link: "Core Port 48 ➔ Port 48" },
      { name: "DLC-Finchley-Spa", link: "Gym Port 2 ➔ Port 1" }
    ]
  },

  "fulham": {
    siteId: "fulham",
    siteName: "Fulham",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Fulham-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Fulham-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Fulham", type: "core", x: 700, y: 560 },
      { id: "sw_spa", name: "DLC-Fulham-Spa", type: "edge", x: 400, y: 840 },
      { id: "sw_lynx", name: "DLC-Fulham-Lynxight", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 2" },
      { fromId: "fw2", toId: "core", toPort: "Port 1" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 23", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 23", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Fulham-Spa", link: "Core Port 23 ➔ Port 1" },
      { name: "DLC-Fulham-Lynxight", link: "Core Port 23 ➔ Port 1" }
    ]
  },

  "geneva-city-green": {
    siteId: "geneva-city-green",
    siteName: "Geneva City Green",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Geneva-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Geneva-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Geneva-Top", type: "core", x: 700, y: 560 },
      { id: "sw_bottom", name: "DLC-Geneva-Bottom", type: "edge", x: 400, y: 840 },
      { id: "sw_lynx", name: "DLC-Geneva-CityGreen-Lynxight", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 2" },
      { fromId: "fw2", toId: "core", toPort: "Port 1" },
      { fromId: "core", toId: "sw_bottom", fromPort: "Port 29", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 48", toPort: "Port 21" }
    ],
    uplinkSummary: [
      { name: "DLC-Geneva-Bottom", link: "Core Port 29 ➔ Port 1" },
      { name: "DLC-Geneva-CityGreen-Lynxight", link: "Core Port 48 ➔ Port 21" }
    ]
  },

  "gidea-park": {
    siteId: "gidea-park",
    siteName: "Gidea Park",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Gidea_Park-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Gidea_Park-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-GideaPark-MainComms-2", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-GideaPark-Lynxight", type: "edge", x: 400, y: 840 },
      { id: "sw_dll", name: "DLL-GideaPark-MainComms", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 28", toPort: "Port 24" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 48", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-GideaPark-Lynxight", link: "Core Port 28 ➔ Port 24" },
      { name: "DLL-GideaPark-MainComms", link: "Core Port 48 ➔ Port 48" }
    ]
  },

  "glasgow-renfrew": {
    siteId: "glasgow-renfrew",
    siteName: "Glasgow Renfrew",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Renfrew-MXS", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Renfrew-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-Renfrew", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Renfrew-Lynxight", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 2" },
      { fromId: "fw2", toId: "core", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 38", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Renfrew-Lynxight", link: "Core Port 38 ➔ Port 1" }
    ]
  },

  "glasgow-rouken-glen": {
    siteId: "glasgow-rouken-glen",
    siteName: "Glasgow Rouken Glen",
    viewBox: "0 0 1600 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Rouken_Glen-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Rouken_Glen-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "Rouken-48P", type: "core", x: 800, y: 560 },
      { id: "sw_new", name: "DLL-RoukenGlen-NEW", type: "distribution", x: 450, y: 760 },
      { id: "sw_golf", name: "DLL-Rouken-Golf", type: "edge", x: 450, y: 950 },
      { id: "sw_dll", name: "DLL-Rouken", type: "distribution", x: 1150, y: 760 },
      { id: "sw_lynx", name: "DLC-RoukenGlen-Lynxight", type: "edge", x: 1150, y: 950 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_new", fromPort: "Port 47", toPort: "Port 48" },
      { fromId: "sw_new", toId: "sw_golf", fromPort: "Port 1", toPort: "Port 48" },
      { fromId: "core", toId: "sw_dll" },
      { fromId: "sw_dll", toId: "sw_lynx", fromPort: "Port 14", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLL-RoukenGlen-NEW", link: "Core Port 47 ➔ Port 48" },
      { name: "DLL-Rouken-Golf", link: "RoukenGlen-NEW Port 1 ➔ Port 48" },
      { name: "DLL-Rouken", link: "Core Downlink" },
      { name: "DLC-RoukenGlen-Lynxight", link: "DLL-Rouken Port 14 ➔ Port 1" }
    ]
  },

  "glasgow-west-end": {
    siteId: "glasgow-west-end",
    siteName: "Glasgow West End",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Glasgow_West_End-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Glasgow_West_End-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Glasgow-WE-Main-1", type: "core", x: 800, y: 560 },
      { id: "sw_mem", name: "DLC-Glasgow-WE-Membership", type: "edge", x: 300, y: 840 },
      { id: "sw_main2", name: "DLC-Glasgow-WE-Main-2", type: "edge", x: 800, y: 840 },
      { id: "sw_sales", name: "DLC-Glasgow-WE-Sales", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 2" },
      { fromId: "fw2", toId: "core", toPort: "Port 1" },
      { fromId: "core", toId: "sw_mem", fromPort: "Port 9", toPort: "Port 48" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 11", toPort: "Port 47" },
      { fromId: "core", toId: "sw_sales", fromPort: "Port 32", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Glasgow-WE-Membership", link: "Core Port 9 ➔ Port 48" },
      { name: "DLC-Glasgow-WE-Main-2", link: "Core Port 11 ➔ Port 47" },
      { name: "DLC-Glasgow-WE-Sales", link: "Core Port 32 ➔ Port 24" }
    ]
  },

  "gloucestershire": {
    siteId: "gloucestershire",
    siteName: "Gloucestershire",
    viewBox: "0 0 1600 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Gloucester-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Gloucester-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Gloucester-Main-Comms", type: "core", x: 800, y: 560 },
      { id: "sw_av", name: "DLC-Gloucestershire-AV", type: "distribution", x: 450, y: 760 },
      { id: "sw_spa", name: "DLC-Gloucestershire-Spa", type: "edge", x: 450, y: 950 },
      { id: "sw_mc2", name: "DLC-Gloucester-Main-Comms-2", type: "distribution", x: 1150, y: 760 },
      { id: "sw_lynx", name: "DLC-Gloucester-Lynxight", type: "edge", x: 1150, y: 950 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_av", fromPort: "Port 4", toPort: "Port 24" },
      { fromId: "sw_av", toId: "sw_spa", fromPort: "Port 24", toPort: "Port 4" },
      { fromId: "core", toId: "sw_mc2", fromPort: "Port 43" },
      { fromId: "sw_mc2", toId: "sw_lynx", fromPort: "Port 15", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Gloucestershire-AV", link: "Core Port 4 ➔ Port 24" },
      { name: "DLC-Gloucestershire-Spa", link: "AV Port 24 ➔ Port 4" },
      { name: "DLC-Gloucester-Main-Comms-2", link: "Core Port 43 ➔ Uplink" },
      { name: "DLC-Gloucester-Lynxight", link: "Main-Comms-2 Port 15 ➔ Port 1" }
    ]
  },

  "hamilton": {
    siteId: "hamilton",
    siteName: "Hamilton",
    viewBox: "0 0 1400 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Hamilton-MXP", type: "firewall", x: 450, y: 360 },
      { id: "fw2", name: "Hamilton-MXS", type: "firewall", x: 950, y: 360 },
      { id: "core", name: "DL-Hamilton", type: "core", x: 700, y: 530 },
      { id: "sw_lynx", name: "DLC-Hamilton-Lynxight", type: "distribution", x: 700, y: 720 },
      { id: "sw_mc", name: "DLC-Hamilton-MainComms", type: "edge", x: 700, y: 920 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 11", toPort: "Port 1" },
      { fromId: "sw_lynx", toId: "sw_mc", fromPort: "Port 22", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Hamilton-Lynxight", link: "Core Port 11 ➔ Port 1" },
      { name: "DLC-Hamilton-MainComms", link: "Lynxight Port 22 ➔ Port 1" }
    ]
  },

  "hampton": {
    siteId: "hampton",
    siteName: "Hampton",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Hampton-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Hampton-MXP", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Hampton-1", type: "core", x: 800, y: 560 },
      { id: "sw_br", name: "DLC-Hampton-Boardroom", type: "edge", x: 300, y: 840 },
      { id: "sw_h2", name: "DLC-Hampton-2", type: "edge", x: 800, y: 840 },
      { id: "sw_sub", name: "DLC-Hampton-X440-48p-SubRack", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_br", fromPort: "Port 45", toPort: "Port 1" },
      { fromId: "core", toId: "sw_h2", fromPort: "Port 47", toPort: "Port 24" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 48", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-Hampton-Boardroom", link: "Core Port 45 ➔ Port 1" },
      { name: "DLC-Hampton-2", link: "Core Port 47 ➔ Port 24" },
      { name: "DLC-Hampton-X440-48p-SubRack", link: "Core Port 48 ➔ Port 48" }
    ]
  },

  "harrogate": {
    siteId: "harrogate",
    siteName: "Harrogate",
    viewBox: "0 0 1400 1100",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 110 },
      { id: "fw1", name: "Harrogate-MXP", type: "firewall", x: 450, y: 320 },
      { id: "fw2", name: "Harrogate-MXS", type: "firewall", x: 950, y: 320 },
      { id: "core", name: "DLL-Harrogate", type: "core", x: 700, y: 480 },
      { id: "sw_sub2", name: "DLC-Harrogate-Subrack-2", type: "distribution", x: 700, y: 660 },
      { id: "sw_new", name: "NewComms", type: "distribution", x: 700, y: 840 },
      { id: "sw_lynx", name: "DLC-Harrogate-Lnyxight", type: "edge", x: 700, y: 1000 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub2", fromPort: "Port 41", toPort: "Port 48" },
      { fromId: "sw_sub2", toId: "sw_new", fromPort: "Port 47", toPort: "Port 48" },
      { fromId: "sw_new", toId: "sw_lynx", fromPort: "Port 8", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Harrogate-Subrack-2", link: "Core Port 41 ➔ Port 48" },
      { name: "NewComms", link: "Subrack-2 Port 47 ➔ Port 48" },
      { name: "DLC-Harrogate-Lnyxight", link: "NewComms Port 8 ➔ Port 1" }
    ]
  },

  "newcastle": {
    siteId: "newcastle",
    siteName: "Newcastle",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Newcastle-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Newcastle-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Newcastle", type: "core", x: 800, y: 560 },
      { id: "sw_mc2", name: "DLC-Newcastle-MainComms2", type: "edge", x: 300, y: 840 },
      { id: "sw_dll", name: "DLLNewcastle", type: "edge", x: 800, y: 840 },
      { id: "sw_lynx", name: "DLC-Newcastle-Lynxight", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_mc2", fromPort: "Port 22", toPort: "Port 22" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 44", toPort: "Port 24" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 40", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Newcastle-MainComms2", link: "Core Port 22 ➔ Port 22" },
      { name: "DLLNewcastle", link: "Core Port 44 ➔ Port 24" },
      { name: "DLC-Newcastle-Lynxight", link: "Core Port 40 ➔ Port 1" }
    ]
  },

  "nottingham": {
    siteId: "nottingham",
    siteName: "Nottingham",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Nottingham-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Nottingham-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Nottingham", type: "core", x: 800, y: 560 },
      { id: "sw_wifi", name: "DLC-Nottingham-WiFiSwitch", type: "edge", x: 300, y: 840 },
      { id: "sw_sub", name: "DLC-Nottingham (Subrack)", type: "edge", x: 800, y: 840 },
      { id: "sw_main2", name: "DLC-Nottingham (Main 2)", type: "edge", x: 1300, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_wifi", fromPort: "Port 6", toPort: "Port 24" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 23", toPort: "Port 1" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 37", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-Nottingham-WiFiSwitch", link: "Core Port 6 ➔ Port 24" },
      { name: "DLC-Nottingham (Subrack)", link: "Core Port 23 ➔ Port 1" },
      { name: "DLC-Nottingham (Main 2)", link: "Core Port 37 ➔ Port 48" }
    ]
  },

  "beaconsfield": {
    siteId: "beaconsfield",
    siteName: "Beaconsfield",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Beaconsfield-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Beaconsfield-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Beaconsfield-MainComms-2.4", type: "core", x: 700, y: 560 },
      { id: "sw_spa1", name: "Beaconsfield-Spa (Sub 1)", type: "edge", x: 400, y: 840 },
      { id: "sw_spa2", name: "Beaconsfield-Spa (Sub 2)", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_spa1", fromPort: "Port 47", toPort: "Port 24" },
      { fromId: "core", toId: "sw_spa2", fromPort: "Port 48", toPort: "Port 50" }
    ],
    uplinkSummary: [
      { name: "Beaconsfield-Spa (Sub 1)", link: "Core Port 47 ➔ Port 24" },
      { name: "Beaconsfield-Spa (Sub 2)", link: "Core Port 48 ➔ Port 50" }
    ]
  },

  "farnham": {
    siteId: "farnham",
    siteName: "Farnham",
    viewBox: "0 0 1600 1050",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Farnham-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Farnham-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Farnham-MainComms-2", type: "core", x: 800, y: 560 },
      { id: "sw_lynx", name: "DLC-Farnham-Lynxight", type: "edge", x: 300, y: 760 },
      { id: "sw_sub1", name: "DLC-Farnham-Subrack (Mid 1)", type: "distribution", x: 800, y: 760 },
      { id: "sw_sub2", name: "DLC-Farnham-Subrack (Mid 2)", type: "edge", x: 800, y: 950 },
      { id: "sw_sub3", name: "DLC-Farnham-Subrack (Right)", type: "edge", x: 1300, y: 760 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 21", toPort: "Port 1" },
      { fromId: "core", toId: "sw_sub1", fromPort: "Port 47", toPort: "Port 25" },
      { fromId: "sw_sub1", toId: "sw_sub2" },
      { fromId: "core", toId: "sw_sub3", fromPort: "Port 48", toPort: "Port 45" }
    ],
    uplinkSummary: [
      { name: "DLC-Farnham-Lynxight", link: "Core Port 21 ➔ Port 1" },
      { name: "DLC-Farnham-Subrack (Mid 1)", link: "Core Port 47 ➔ Port 25" },
      { name: "DLC-Farnham-Subrack (Mid 2)", link: "Mid 1 ➔ Mid 2" },
      { name: "DLC-Farnham-Subrack (Right)", link: "Core Port 48 ➔ Port 45" }
    ]
  },

  "heston": {
    siteId: "heston",
    siteName: "Heston",
    viewBox: "0 0 1600 1100",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 120 },
      { id: "fw1", name: "Heston-MXP", type: "firewall", x: 550, y: 340 },
      { id: "fw2", name: "Heston-MXS", type: "firewall", x: 1050, y: 340 },
      { id: "core", name: "DLL-Heston-MainComms", type: "core", x: 800, y: 520 },
      { id: "sw_camp1", name: "DLL-Heston-Campus (1)", type: "distribution", x: 300, y: 750 },
      { id: "sw_camp2", name: "DLL-Heston-Campus (2)", type: "edge", x: 300, y: 940 },
      { id: "sw_gym", name: "DLL-Heston-Gym", type: "edge", x: 800, y: 750 },
      { id: "sw_lynx", name: "DLC-Heston-Lynxight", type: "edge", x: 1300, y: 750 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_camp1", fromPort: "Port 13", toPort: "Port 24" },
      { fromId: "sw_camp1", toId: "sw_camp2", fromPort: "Port 29", toPort: "Port 52" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 13", toPort: "Port 20" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 45", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLL-Heston-Campus (1)", link: "MainComms Port 13 ➔ Port 24" },
      { name: "DLL-Heston-Campus (2)", link: "Campus (1) Port 29 ➔ Port 52" },
      { name: "DLL-Heston-Gym", link: "MainComms Port 13 ➔ Port 20" },
      { name: "DLC-Heston-Lynxight", link: "MainComms Port 45 ➔ Port 24" }
    ]
  },

  "hull": {
    siteId: "hull",
    siteName: "Hull",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Hull-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Hull-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Hull-MainComms-2.4", type: "core", x: 700, y: 560 },
      { id: "sw_down", name: "DLC-Hull-SubComms", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_down", fromPort: "Port 35", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Hull-SubComms", link: "Core Port 35 ➔ Port 1" }
    ]
  },

  "dartford": {
    siteId: "dartford",
    siteName: "Dartford",
    viewBox: "0 0 1400 1200",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 110 },
      { id: "fw1", name: "Dartford-MXP", type: "firewall", x: 450, y: 300 },
      { id: "fw2", name: "Dartford-MXS", type: "firewall", x: 950, y: 300 },
      { id: "core", name: "DLC-Dartford-X440-Main", type: "core", x: 700, y: 470 },
      { id: "sw2", name: "DLC-Dartford-X440-2", type: "distribution", x: 700, y: 650 },
      { id: "sw_gym", name: "DLC-Dartford-Gym", type: "distribution", x: 700, y: 830 },
      { id: "sw3", name: "DLC-Dartford-X440-3", type: "edge", x: 700, y: 1010 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw2", fromPort: "Port 48", toPort: "Port 48" },
      { fromId: "sw2", toId: "sw_gym", fromPort: "Port 47", toPort: "Port 48" },
      { fromId: "sw_gym", toId: "sw3", fromPort: "Port 47", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Dartford-X440-2", link: "Main Port 48 ➔ Port 48" },
      { name: "DLC-Dartford-Gym", link: "X440-2 Port 47 ➔ Port 48" },
      { name: "DLC-Dartford-X440-3", link: "Gym Port 47 ➔ Port 24" }
    ]
  },

  "derby": {
    siteId: "derby",
    siteName: "Derby",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Derby-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Derby-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Derby-MainComms", type: "core", x: 700, y: 560 },
      { id: "sw_sub1", name: "DLC-Derby-Subrack (Left)", type: "edge", x: 400, y: 840 },
      { id: "sw_sub2", name: "DLC-Derby-Subrack (Right)", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub1", fromPort: "Port 45", toPort: "Port 21" },
      { fromId: "core", toId: "sw_sub2", fromPort: "Port 45", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Derby-Subrack (Left)", link: "MainComms Port 45 ➔ Port 21" },
      { name: "DLC-Derby-Subrack (Right)", link: "MainComms Port 45 ➔ Port 1" }
    ]
  },

  "dudley": {
    siteId: "dudley",
    siteName: "Dudley",
    viewBox: "0 0 1600 1100",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 120 },
      { id: "fw1", name: "Dudley-MXP", type: "firewall", x: 550, y: 340 },
      { id: "fw2", name: "Dudley-MXS", type: "firewall", x: 1050, y: 340 },
      { id: "core", name: "DLC-Dudley-MainComms", type: "core", x: 800, y: 520 },
      { id: "sw_gym", name: "DLC-Dudley-Gym", type: "edge", x: 300, y: 750 },
      { id: "sw_wifi", name: "DLL-DudleyWiFiSwitch", type: "edge", x: 800, y: 750 },
      { id: "sw_dudley", name: "dll-dudley", type: "distribution", x: 1300, y: 750 },
      { id: "sw_lynx", name: "DLC-Dudley-Lynxight", type: "edge", x: 1300, y: 940 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 4", toPort: "Port 24" },
      { fromId: "core", toId: "sw_wifi", fromPort: "Port 43", toPort: "Port 45" },
      { fromId: "core", toId: "sw_dudley", fromPort: "Port 48", toPort: "Port 44" },
      { fromId: "sw_dudley", toId: "sw_lynx", fromPort: "Port 44", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Dudley-Gym", link: "MainComms Port 4 ➔ Port 24" },
      { name: "DLL-DudleyWiFiSwitch", link: "MainComms Port 43 ➔ Port 45" },
      { name: "dll-dudley", link: "MainComms Port 48 ➔ Port 44" },
      { name: "DLC-Dudley-Lynxight", link: "dll-dudley Port 44 ➔ Port 24" }
    ]
  },

  "dundee": {
    siteId: "dundee",
    siteName: "Dundee",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Dundee-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Dundee-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-Dundee-MainComms", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Dundee-Lynxight", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 24", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Dundee-Lynxight", link: "MainComms Port 24 ➔ Port 1" }
    ]
  },

  "eastbourne": {
    siteId: "eastbourne",
    siteName: "Eastbourne",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Eastbourne-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Eastbourne-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-Eastbourne", type: "core", x: 700, y: 560 },
      { id: "sw_rec", name: "DLC-Eastbourne-Reception", type: "edge", x: 400, y: 840 },
      { id: "sw_lynx", name: "DLC-Eastbourne-Lynxight", type: "edge", x: 1000, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_rec", fromPort: "Port 7", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 45", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Eastbourne-Reception", link: "DLL-Eastbourne Port 7 ➔ Port 1" },
      { name: "DLC-Eastbourne-Lynxight", link: "DLL-Eastbourne Port 45 ➔ Port 24" }
    ]
  },

  "edinburgh": {
    siteId: "edinburgh",
    siteName: "Edinburgh",
    viewBox: "0 0 1400 1100",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 120 },
      { id: "fw1", name: "Edinburgh-MXP", type: "firewall", x: 450, y: 330 },
      { id: "fw2", name: "Edinburgh-MXS", type: "firewall", x: 950, y: 330 },
      { id: "core", name: "DLC-Edinburgh-MainComms-2", type: "core", x: 700, y: 510 },
      { id: "sw_edin", name: "DLL-Edinburgh", type: "distribution", x: 700, y: 730 },
      { id: "sw_lynx", name: "DLC-Edinburgh-Lynxight", type: "edge", x: 700, y: 950 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_edin", fromPort: "Port 48", toPort: "Port 50" },
      { fromId: "sw_edin", toId: "sw_lynx", fromPort: "Port 43", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLL-Edinburgh", link: "MainComms-2 Port 48 ➔ Port 50" },
      { name: "DLC-Edinburgh-Lynxight", link: "DLL-Edinburgh Port 43 ➔ Port 1" }
    ]
  },

  "eindhoven": {
    siteId: "eindhoven",
    siteName: "Eindhoven",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "NL-Eindhoven-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "NL-Eindhoven-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Veldhoven (Main)", type: "core", x: 700, y: 560 },
      { id: "sw_sub", name: "DLC-Veldhoven (Sub)", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 23", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Veldhoven (Sub)", link: "Main Port 23 ➔ Port 24" }
    ]
  },

  "epsom": {
    siteId: "epsom",
    siteName: "Epsom",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Epsom-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Epsom-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Epsom", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Epsom-Lynxight", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 47", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Epsom-Lynxight", link: "Core Port 47 ➔ Port 24" }
    ]
  },

  "exeter": {
    siteId: "exeter",
    siteName: "Exeter",
    viewBox: "0 0 1400 1150",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 120 },
      { id: "fw1", name: "Epsom-MXP", type: "firewall", x: 450, y: 330 },
      { id: "fw2", name: "Epsom-MXS", type: "firewall", x: 950, y: 330 },
      { id: "core", name: "DLL-Exeter", type: "core", x: 700, y: 510 },
      { id: "sw_main2", name: "DLC-Exeter-MainComms-2", type: "distribution", x: 700, y: 730 },
      { id: "sw_gym", name: "DLC-Exeter-Gym", type: "edge", x: 350, y: 980 },
      { id: "sw_spa", name: "DLC-Exeter-Spa", type: "edge", x: 1050, y: 980 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 3", toPort: "Port 48" },
      { fromId: "sw_main2", toId: "sw_gym" },
      { fromId: "sw_main2", toId: "sw_spa" }
    ],
    uplinkSummary: [
      { name: "DLC-Exeter-MainComms-2", link: "DLL-Exeter Port 3 ➔ Port 48" },
      { name: "DLC-Exeter-Gym", link: "MainComms-2 Downlink" },
      { name: "DLC-Exeter-Spa", link: "MainComms-2 Downlink" }
    ]
  },

  "amsterdam": {
    siteId: "amsterdam",
    siteName: "Amsterdam",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Amsterdam-MXS", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Amsterdam-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Amsterdam-48p.8", type: "core", x: 700, y: 560 },
      { id: "sw_spa", name: "DLC-Amsterdam-Spa", type: "edge", x: 350, y: 840 },
      { id: "sw_main2", name: "DLC-Amsterdam-MainComm-2", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 33", toPort: "Port 24" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 48", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Amsterdam-Spa", link: "DLC-Amsterdam-48p.8 Port 33 ➔ Port 24" },
      { name: "DLC-Amsterdam-MainComm-2", link: "DLC-Amsterdam-48p.8 Port 48 ➔ Port 24" }
    ]
  },

  "barcelona": {
    siteId: "barcelona",
    siteName: "Barcelona",
    viewBox: "0 0 1600 1100",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 120 },
      { id: "fw1", name: "Turo-MXP", type: "firewall", x: 800, y: 340 },
      { id: "core", name: "DLC-Beckenham (Core)", type: "core", x: 800, y: 520 },
      { id: "sw_gym", name: "DLL-Bar-Gym24", type: "edge", x: 250, y: 840 },
      { id: "sw_lynx", name: "DLC-Turo-Lynxight", type: "edge", x: 800, y: 840 },
      { id: "sw_barc", name: "DLLBarcelona", type: "edge", x: 1350, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "fw1", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 50", toPort: "Port 23" },
      { fromId: "core", toId: "sw_lynx" },
      { fromId: "core", toId: "sw_barc", fromPort: "Port 48", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLL-Bar-Gym24", link: "Core Port 50 ➔ Port 23" },
      { name: "DLC-Turo-Lynxight", link: "Core Downlink" },
      { name: "DLLBarcelona", link: "Core Port 48 ➔ Port 1" }
    ]
  },

  "basildon": {
    siteId: "basildon",
    siteName: "Basildon",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Basildon-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Amsterdam-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Basildon.4", type: "core", x: 700, y: 560 },
      { id: "sw_gym", name: "DLC-Basildon-Gym", type: "edge", x: 350, y: 840 },
      { id: "sw_lynx", name: "DLC-Basildon-Lynxight.3", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 43", toPort: "Port 1" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 47", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Basildon-Gym", link: "Core Port 43 ➔ Port 1" },
      { name: "DLC-Basildon-Lynxight.3", link: "Core Port 47 ➔ Port 1" }
    ]
  },

  "beckenham": {
    siteId: "beckenham",
    siteName: "Beckenham",
    viewBox: "0 0 1600 1100",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 110 },
      { id: "fw1", name: "Beckenham-MXP (1)", type: "firewall", x: 450, y: 330 },
      { id: "fw2", name: "Beckenham-MXP (2)", type: "firewall", x: 1150, y: 330 },
      { id: "core", name: "DLC-Beckenham", type: "core", x: 800, y: 520 },
      { id: "sw_dll", name: "DLLBeckenham", type: "edge", x: 250, y: 840 },
      { id: "sw_main2", name: "DLC-Beckenham-MainComms-2", type: "edge", x: 750, y: 840 },
      { id: "sw_spa", name: "DLC-Beckenham-Spa", type: "distribution", x: 1350, y: 840 },
      { id: "sw_lynx", name: "DLC-Beckenham-Lynxight", type: "edge", x: 1350, y: 1010 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 47", toPort: "Port 4" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 45", toPort: "Port 48" },
      { fromId: "core", toId: "sw_spa", fromPort: "Port 7", toPort: "Port 48" },
      { fromId: "sw_spa", toId: "sw_lynx", fromPort: "Port 47", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLLBeckenham", link: "Core Port 47 ➔ Port 4" },
      { name: "DLC-Beckenham-MainComms-2", link: "Core Port 45 ➔ Port 48" },
      { name: "DLC-Beckenham-Spa", link: "Core Port 7 ➔ Port 48" },
      { name: "DLC-Beckenham-Lynxight", link: "DLC-Beckenham-Spa Port 47 ➔ Port 24" }
    ]
  },

  "bolton": {
    siteId: "bolton",
    siteName: "Bolton",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Bolton-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Bolton-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Bolton-MainComms-2", type: "core", x: 700, y: 560 },
      { id: "sw_comms", name: "DLL-Bolton-Comms", type: "edge", x: 350, y: 840 },
      { id: "sw_lynx", name: "DLC-Bolton-Lnyxight", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw_comms", fromPort: "Port 48", toPort: "Port 8" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 1", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLL-Bolton-Comms", link: "Core Port 48 ➔ Port 8" },
      { name: "DLC-Bolton-Lnyxight", link: "Core Port 1 ➔ Port 1" }
    ]
  },

  "brighton": {
    siteId: "brighton",
    siteName: "Brighton",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Brighton-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Brighton-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Brighton", type: "core", x: 700, y: 560 },
      { id: "sw_main2", name: "DLC-Brighton-MainComms-2", type: "edge", x: 350, y: 840 },
      { id: "sw_sub", name: "DLC-Brighton-subrack", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 0", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 0", toPort: "Port 1" },
      { fromId: "core", toId: "sw_main2", fromPort: "Port 24", toPort: "Port 47" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 24", toPort: "Port 23" }
    ],
    uplinkSummary: [
      { name: "DLC-Brighton-MainComms-2", link: "Core Port 24 ➔ Port 47" },
      { name: "DLC-Brighton-subrack", link: "Core Port 24 ➔ Port 23" }
    ]
  },

  "cheshire-oaks": {
    siteId: "cheshire-oaks",
    siteName: "Cheshire Oaks",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 120 },
      { id: "fw1", name: "Cheshire_Oaks-MXP", type: "firewall", x: 550, y: 340 },
      { id: "fw2", name: "Cheadle-MXP", type: "firewall", x: 1050, y: 340 },
      { id: "core", name: "Cheshire_Oaks-MXP (Core Switch)", type: "core", x: 800, y: 520 },
      { id: "sw_lynx", name: "DLC-CheshireOaks-Lynxigh", type: "edge", x: 300, y: 780 },
      { id: "sw_gym", name: "DLC-CheshireOaks-Gym-Sub", type: "edge", x: 800, y: 780 },
      { id: "sw_spa", name: "DLC-CheshireOaks-Spa", type: "edge", x: 1300, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 9", toPort: "Port 24" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 24", toPort: "Port 1" },
      { fromId: "core", toId: "sw_spa" }
    ],
    uplinkSummary: [
      { name: "DLC-CheshireOaks-Lynxigh", link: "Core Port 9 ➔ Port 24" },
      { name: "DLC-CheshireOaks-Gym-Sub", link: "Core Port 24 ➔ Port 1" },
      { name: "DLC-CheshireOaks-Spa", link: "Core Downlink" }
    ]
  },

  "chigwell": {
    siteId: "chigwell",
    siteName: "Chigwell",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Chigwell-MXS", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Chigwell-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-Chigwell-Stack (Top)", type: "core", x: 700, y: 560 },
      { id: "sw_sub", name: "DLL-Chigwell-Stack (Bottom)", type: "edge", x: 700, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 45", toPort: "Port 45" }
    ],
    uplinkSummary: [
      { name: "DLL-Chigwell-Stack (Bottom)", link: "Stack Top Port 45 ➔ Stack Bottom Port 45" }
    ]
  },

  "chorley": {
    siteId: "chorley",
    siteName: "Chorley",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Chorley-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Chorley-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLL-Chorley-MainComms (Core)", type: "core", x: 700, y: 560 },
      { id: "sw_lynx", name: "DLC-Chorley-Lynxight", type: "edge", x: 350, y: 840 },
      { id: "sw_edge", name: "DLL-Chorley-MainComms (Sub)", type: "edge", x: 1050, y: 840 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 18", toPort: "Port 1" },
      { fromId: "core", toId: "sw_edge", fromPort: "Port 48", toPort: "Port 45" }
    ],
    uplinkSummary: [
      { name: "DLC-Chorley-Lynxight", link: "Core Port 18 ➔ Port 1" },
      { name: "DLL-Chorley-MainComms (Sub)", link: "Core Port 48 ➔ Port 45" }
    ]
  },

  "coventry": {
    siteId: "coventry",
    siteName: "Coventry",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 120 },
      { id: "fw1", name: "Coventry-MXP", type: "firewall", x: 550, y: 340 },
      { id: "fw2", name: "Coventry-MXS", type: "firewall", x: 1050, y: 340 },
      { id: "core", name: "DLC-Coventry-X440", type: "core", x: 800, y: 520 },
      { id: "sw_main", name: "DLC-Coventry-Main", type: "edge", x: 300, y: 780 },
      { id: "sw_lynx", name: "DLC-Coventry-Lynxight", type: "edge", x: 800, y: 780 },
      { id: "sw_spa", name: "DLC-Coventry-Spa", type: "edge", x: 1300, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", toPort: "Port 2" },
      { fromId: "core", toId: "sw_main", fromPort: "Port 12", toPort: "Port 47" },
      { fromId: "core", toId: "sw_lynx", fromPort: "Port 25", toPort: "Port 1" },
      { fromId: "core", toId: "sw_spa" }
    ],
    uplinkSummary: [
      { name: "DLC-Coventry-Main", link: "Core Port 12 ➔ Port 47" },
      { name: "DLC-Coventry-Lynxight", link: "Core Port 25 ➔ Port 1" },
      { name: "DLC-Coventry-Spa", link: "Core Downlink" }
    ]
  },


  "belfast": {
    siteId: "belfast",
    siteName: "Belfast",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 120 },
      { id: "fw1", name: "Belfast-MXP", type: "firewall", x: 550, y: 320 },
      { id: "fw2", name: "Belfast-MXS", type: "firewall", x: 1050, y: 320 },
      { id: "core", name: "DLC-Belfast-MainComms-2", type: "core", x: 800, y: 500 },
      { id: "sw1", name: "DLC-Belfast-Lynxight", type: "edge", x: 350, y: 780 },
      { id: "sw2", name: "DLC-Belfast-MainComms-1", type: "edge", x: 1250, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core" },
      { fromId: "fw2", toId: "core" },
      { fromId: "core", toId: "sw1", fromPort: "Port 14", toPort: "Port 24" },
      { fromId: "core", toId: "sw2", fromPort: "Port 48", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLC-Belfast-Lynxight", link: "Core Port 14 ➔ Port 24" },
      { name: "DLC-Belfast-MainComms-1", link: "Core Port 48 ➔ Port 48" }
    ]
  },


  "birmingham": {
    siteId: "birmingham",
    siteName: "Birmingham",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Birmingham-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Birmingham-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLL-Birmingham-Comms", type: "core", x: 800, y: 550 },
      { id: "sw1", name: "DLC-Birmingham-Lynxight", type: "edge", x: 350, y: 800 },
      { id: "sw2", name: "DLLBirmingham", type: "edge", x: 1250, y: 800 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core" },
      { fromId: "fw2", toId: "core" },
      { fromId: "core", toId: "sw1", fromPort: "Port 14", toPort: "Port 1" },
      { fromId: "core", toId: "sw2", fromPort: "Port 3", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLC-Birmingham-Lynxight", link: "Core Port 14 ➔ Port 1" },
      { name: "DLLBirmingham", link: "Core Port 3 ➔ Port 24" }
    ]
  },



  "bristol-la": {
    siteId: "bristol-la",
    siteName: "Bristol Long Ashton",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Bristol_Long_Ashton-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Bristol_Long_Ashton-MXP", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLL-Bristol-LA-MainComms-2", type: "core", x: 800, y: 550 },
      { id: "sw1", name: "DLL-Bristol-LA-MainComms", type: "edge", x: 350, y: 800 },
      { id: "sw2", name: "DLLBristolLongAshton", type: "edge", x: 1250, y: 800 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core" },
      { fromId: "fw2", toId: "core" },
      { fromId: "core", toId: "sw1", fromPort: "Port 48", toPort: "Port 49" },
      { fromId: "core", toId: "sw2", fromPort: "Port 5", toPort: "Port 18" }
    ],
    uplinkSummary: [
      { name: "DLL-Bristol-LA-MainComms", link: "Core Port 48 ➔ Port 49" },
      { name: "DLLBristolLongAshton", link: "Core Port 5 ➔ Port 18" }
    ]
  },

  "bristol-westbury": {
    siteId: "bristol-westbury",
    siteName: "Bristol Westbury",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Bristol_Westbury-MXP", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Bristol_Westbury-MXS", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLL-BristolWestbury", type: "core", x: 800, y: 540 },
      { id: "sw1", name: "DLC-Bristol-Westbury-Gym", type: "edge", x: 280, y: 780 },
      { id: "sw2", name: "DLC-Bristol-Westbury-Gym-2", type: "edge", x: 800, y: 780 },
      { id: "sw3", name: "DLLBristolWestbury-HP", type: "edge", x: 1320, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 44", toPort: "Port 48" },
      { fromId: "core", toId: "sw2", fromPort: "Port 40", toPort: "Port 24" },
      { fromId: "core", toId: "sw3", fromPort: "Port 46", toPort: "Port 7" }
    ],
    uplinkSummary: [
      { name: "DLC-Bristol-Westbury-Gym", link: "Core Port 44 ➔ Port 48" },
      { name: "DLC-Bristol-Westbury-Gym-2", link: "Core Port 40 ➔ Port 24" },
      { name: "DLLBristolWestbury-HP", link: "Core Port 46 ➔ Port 7" }
    ]
  },

  "bromsgrove": {
    siteId: "bromsgrove",
    siteName: "Bromsgrove",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Bromsgrove-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Bromsgrove-MXP", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Bromsgrove", type: "core", x: 800, y: 540 },
      { id: "sw1", name: "DLC-Bromsgrove-Gym-Subrack", type: "edge", x: 280, y: 780 },
      { id: "sw2", name: "DLC-Bromsgrove-Lynxight-1", type: "edge", x: 800, y: 780 },
      { id: "sw3", name: "DLC-Bromsgrove-Lynxight-2", type: "edge", x: 1320, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 21", toPort: "Port 24" },
      { fromId: "core", toId: "sw2", fromPort: "Port 39", toPort: "Port 1" },
      { fromId: "core", toId: "sw3", fromPort: "Port 47", toPort: "Port 19" }
    ],
    uplinkSummary: [
      { name: "DLC-Bromsgrove-Gym-Subrack", link: "Core Port 21 ➔ Port 24" },
      { name: "DLC-Bromsgrove-Lynxight-1", link: "Core Port 39 ➔ Port 1" },
      { name: "DLC-Bromsgrove-Lynxight-2", link: "Core Port 47 ➔ Port 19" }
    ]
  },

  "brooklands": {
    siteId: "brooklands",
    siteName: "Brooklands",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Brooklands-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Brooklands-MXP", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Brooklands", type: "core", x: 800, y: 540 },
      { id: "sw1", name: "DLC-Brooklands-Lynxight", type: "edge", x: 280, y: 780 },
      { id: "sw2", name: "DLC-Brooklands-Spa", type: "edge", x: 800, y: 780 },
      { id: "sw3", name: "DLL-Brooklands", type: "edge", x: 1320, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 21", toPort: "Port 32" },
      { fromId: "core", toId: "sw2", fromPort: "Port 46", toPort: "Port 24" },
      { fromId: "core", toId: "sw3", fromPort: "Port 47", toPort: "Port 18" }
    ],
    uplinkSummary: [
      { name: "DLC-Brooklands-Lynxight", link: "Core Port 21 ➔ Port 32" },
      { name: "DLC-Brooklands-Spa", link: "Core Port 46 ➔ Port 24" },
      { name: "DLL-Brooklands", link: "Core Port 47 ➔ Port 18" }
    ]
  },

  "brussels": {
    siteId: "brussels",
    siteName: "Brussels",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "DLL-Brussels-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "DLL-Brussels-MXP", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLL-Brussels-MAIN", type: "core", x: 800, y: 540 },
      { id: "sw1", name: "DLC-Brussels-Gym", type: "distribution", x: 250, y: 720 },
      { id: "sw2", name: "DLC-Brussels-New", type: "edge", x: 800, y: 720 },
      { id: "sw3", name: "DLC-Brussels-B19-FirstFloor", type: "distribution", x: 1350, y: 720 },
      { id: "sw4", name: "DLC-Brussels-B19", type: "edge", x: 800, y: 890 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 47", toPort: "Port 1" },
      { fromId: "core", toId: "sw2", fromPort: "Port 6", toPort: "Port 1" },
      { fromId: "core", toId: "sw3", toPort: "Port 1" },
      { fromId: "sw1", toId: "sw4", fromPort: "Port 43", toPort: "Port 1" },
      { fromId: "sw3", toId: "sw4", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Brussels-Gym", link: "Core Port 47 ➔ Port 1" },
      { name: "DLC-Brussels-New", link: "Core Port 6 ➔ Port 1" },
      { name: "DLC-Brussels-B19", link: "Gym Port 43 ➔ Port 1 / B19 1st Floor Downlink" }
    ]
  },

  "bushey": {
    siteId: "bushey",
    siteName: "Bushey",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Bushey-MXS", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Bushey-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Bushey-MainComms", type: "core", x: 700, y: 540 },
      { id: "sw1", name: "DLL-Bushey-MainExtreme", type: "distribution", x: 700, y: 700 },
      { id: "sw2", name: "DLC-Bushey-Subrack", type: "edge", x: 700, y: 860 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "fw2", toId: "core", fromPort: "Port 1", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 8", toPort: "Port 47" },
      { fromId: "sw1", toId: "sw2", fromPort: "Port 48", toPort: "Port 48" }
    ],
    uplinkSummary: [
      { name: "DLL-Bushey-MainExtreme", link: "Core Port 8 ➔ Port 47" },
      { name: "DLC-Bushey-Subrack", link: "MainExtreme Port 48 ➔ Port 48" }
    ]
  },

  "cambridge": {
    siteId: "cambridge",
    siteName: "Cambridge",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Cambridge-MXS", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Cambridge-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "BLC-Cambridge-MainComms-2", type: "core", x: 700, y: 550 },
      { id: "sw_gym", name: "DLC-Cambridge-Gym", type: "edge", x: 300, y: 760 },
      { id: "sw_dll", name: "DLL-Cambridge", type: "distribution", x: 1100, y: 760 },
      { id: "sw_lynx", name: "DLC-Cambridge-Lynxight", type: "edge", x: 1100, y: 900 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core" },
      { fromId: "fw2", toId: "core" },
      { fromId: "core", toId: "sw_gym", fromPort: "Port 30", toPort: "Port 1" },
      { fromId: "core", toId: "sw_dll", fromPort: "Port 48", toPort: "Port 50" },
      { fromId: "sw_dll", toId: "sw_lynx", fromPort: "Port 7", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLC-Cambridge-Gym", link: "Core Port 30 ➔ Port 1" },
      { name: "DLL-Cambridge", link: "Core Port 48 ➔ Port 50" },
      { name: "DLC-Cambridge-Lynxight", link: "DLL-Cambridge Port 7 ➔ Port 1" }
    ]
  },

  "capelle": {
    siteId: "capelle",
    siteName: "Capelle",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Capelle-MXP", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Capelle-MXS", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Capelle", type: "core", x: 700, y: 550 },
      { id: "sw1", name: "DLC-Capelle-MainComms-2", type: "edge", x: 700, y: 760 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 23", toPort: "Port 23" }
    ],
    uplinkSummary: [
      { name: "DLC-Capelle-MainComms-2", link: "Core Port 23 ➔ Port 23" }
    ]
  },

  "cardiff": {
    siteId: "cardiff",
    siteName: "Cardiff",
    viewBox: "0 0 1600 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Cardiff-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Cardiff-MXP", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Cardiff-MainComms-2", type: "core", x: 800, y: 550 },
      { id: "sw1", name: "DLL-Cardiff-Maincomms", type: "edge", x: 280, y: 780 },
      { id: "sw2", name: "DLL-Cardiff", type: "edge", x: 800, y: 780 },
      { id: "sw3", name: "DLC-Cardiff-Lynxight", type: "edge", x: 1320, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 48", toPort: "Port 44" },
      { fromId: "core", toId: "sw2", fromPort: "Port 4", toPort: "Port 1" },
      { fromId: "core", toId: "sw3", fromPort: "Port 7", toPort: "Port 24" }
    ],
    uplinkSummary: [
      { name: "DLL-Cardiff-Maincomms", link: "Core Port 48 ➔ Port 44" },
      { name: "DLL-Cardiff", link: "Core Port 4 ➔ Port 1" },
      { name: "DLC-Cardiff-Lynxight", link: "Core Port 7 ➔ Port 24" }
    ]
  },

  "cheadle": {
    siteId: "cheadle",
    siteName: "Cheadle",
    viewBox: "0 0 1600 1000",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 800, y: 130 },
      { id: "fw1", name: "Cheadle-MXS", type: "firewall", x: 550, y: 380 },
      { id: "fw2", name: "Cheadle-MXP", type: "firewall", x: 1050, y: 380 },
      { id: "core", name: "DLC-Cheadle-X440", type: "core", x: 800, y: 550 },
      { id: "sw1", name: "DLL-Cheadle-X440-24P", type: "edge", x: 280, y: 740 },
      { id: "sw_sub", name: "CheadleSubRack", type: "distribution", x: 800, y: 740 },
      { id: "sw_stack", name: "DLL-Cheadle-Stack", type: "edge", x: 1320, y: 740 },
      { id: "sw_lynx", name: "DLC-Cheadle-Lynxight", type: "edge", x: 800, y: 900 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core", fromPort: "Port 1", toPort: "Port 1" },
      { fromId: "fw2", toId: "core", fromPort: "Port 2", toPort: "Port 2" },
      { fromId: "core", toId: "sw1", fromPort: "Port 46", toPort: "Port 1" },
      { fromId: "core", toId: "sw_sub", fromPort: "Port 47", toPort: "Port 24" },
      { fromId: "core", toId: "sw_stack", fromPort: "Port 48", toPort: "Port 44" },
      { fromId: "sw_sub", toId: "sw_lynx", fromPort: "Port 1", toPort: "Port 1" }
    ],
    uplinkSummary: [
      { name: "DLL-Cheadle-X440-24P", link: "Core Port 46 ➔ Port 1" },
      { name: "CheadleSubRack", link: "Core Port 47 ➔ Port 24" },
      { name: "DLC-Cheadle-Lynxight", link: "CheadleSubRack Port 1 ➔ Port 1" },
      { name: "DLL-Cheadle-Stack", link: "Core Port 48 ➔ Port 44" }
    ]
  },

  "cheam": {
    siteId: "cheam",
    siteName: "Cheam",
    viewBox: "0 0 1400 950",
    nodes: [
      { id: "inet", name: "Internet", type: "internet", x: 700, y: 130 },
      { id: "fw1", name: "Cheam-MXS", type: "firewall", x: 450, y: 380 },
      { id: "fw2", name: "Cheam-MXP", type: "firewall", x: 950, y: 380 },
      { id: "core", name: "DLC-Cheam", type: "core", x: 700, y: 550 },
      { id: "sw1", name: "DLL-Cheam", type: "edge", x: 280, y: 780 },
      { id: "sw2", name: "DLC-Cheam-Lynxight", type: "edge", x: 1120, y: 780 }
    ],
    links: [
      { fromId: "inet", toId: "fw1" },
      { fromId: "inet", toId: "fw2" },
      { fromId: "fw1", toId: "core" },
      { fromId: "fw2", toId: "core" },
      { fromId: "core", toId: "sw1", fromPort: "Port 47", toPort: "Port 22" },
      { fromId: "core", toId: "sw2", fromPort: "Port 44", toPort: "Port 21" }
    ],
    uplinkSummary: [
      { name: "DLL-Cheam", link: "Core Port 47 ➔ Port 22" },
      { name: "DLC-Cheam-Lynxight", link: "Core Port 44 ➔ Port 21" }
    ]
  },









};


/**
 * Generate full SVG markup string for any site topology
 */
export function generateTopologySvg(topology: SiteTopologyDefinition): string {
  const nodeMap = new Map<string, TopologyNode>();
  topology.nodes.forEach(n => nodeMap.set(n.id, n));

  const linkElements: string[] = [];
  const linkLabelElements: string[] = [];

  topology.links.forEach((l, idx) => {
    const from = nodeMap.get(l.fromId);
    const to = nodeMap.get(l.toId);
    if (!from || !to) return;

    let x1 = from.x;
    let y1 = from.y;
    let x2 = to.x;
    let y2 = to.y;

    if (from.type === "internet") {
      y1 += 30;
      x1 = to.x;
    }
    if (from.type === "firewall") y1 += 35;
    if (from.type === "core" || from.type === "distribution") y1 += 16;
    if (to.type === "firewall") y2 -= 35;
    if (to.type === "core" || to.type === "distribution" || to.type === "edge") y2 -= 16;

    // Draw line
    linkElements.push(
      `<line id="link-${idx}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#7e43a8" stroke-width="1.8" stroke-linecap="round" />`
    );

    // Port tags along link
    if (l.fromPort) {
      const portX = x1 + (x2 - x1) * 0.28;
      const portY = y1 + (y2 - y1) * 0.28;
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      const rotation = angle > 90 || angle < -90 ? angle + 180 : angle;

      linkLabelElements.push(
        `<g transform="translate(${portX}, ${portY}) rotate(${rotation})">
          <rect x="-30" y="-12" width="60" height="15" rx="3" fill="#ffffff" fill-opacity="0.9" stroke="#58217f" stroke-width="0.8" />
          <text x="0" y="-1" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#000000" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, monospace">${l.fromPort}</text>
        </g>`
      );
    }

    if (l.toPort) {
      const portX = x1 + (x2 - x1) * 0.72;
      const portY = y1 + (y2 - y1) * 0.72;
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      const rotation = angle > 90 || angle < -90 ? angle + 180 : angle;

      linkLabelElements.push(
        `<g transform="translate(${portX}, ${portY}) rotate(${rotation})">
          <rect x="-30" y="-12" width="60" height="15" rx="3" fill="#ffffff" fill-opacity="0.9" stroke="#58217f" stroke-width="0.8" />
          <text x="0" y="-1" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#000000" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, monospace">${l.toPort}</text>
        </g>`
      );
    }
  });

  const nodeElements: string[] = [];

  topology.nodes.forEach(n => {
    if (n.type === "internet") {
      nodeElements.push(`
        <g id="node-${n.id}" transform="translate(${n.x}, ${n.y})">
          <path d="M -90 0 C -120 -30, -100 -75, -55 -75 C -45 -110, 10 -120, 45 -95 C 85 -110, 130 -75, 110 -30 C 150 -10, 150 45, 105 65 C 95 90, 20 100, -20 75 C -55 90, -100 75, -90 35 C -130 25, -120 -10, -90 0 Z"
                fill="#ffffff" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
          <text x="0" y="5" text-anchor="middle" font-size="32" font-weight="bold" fill="#000000">Internet</text>
        </g>
      `);
    } else if (n.type === "firewall") {
      nodeElements.push(`
        <g id="node-${n.id}" transform="translate(${n.x - 35}, ${n.y - 40})">
          <rect x="0" y="0" width="70" height="80" fill="url(#fw-brick-pattern)" stroke="#3b1156" stroke-width="1.5" rx="1"/>
          <text x="-12" y="45" text-anchor="end" font-size="15" font-weight="bold" fill="#58217f">${n.name}</text>
        </g>
      `);
    } else {
      // Switch Chassis
      nodeElements.push(`
        <g id="node-${n.id}" transform="translate(${n.x - 100}, ${n.y - 14})" class="switch-node-group" style="cursor: pointer;">
          <use href="#extreme-switch-chassis" />
          <text x="-12" y="20" text-anchor="end" font-size="15" font-weight="bold" fill="#58217f">${n.name}</text>
        </g>
      `);
    }
  });

  return `
<svg viewBox="${topology.viewBox}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <defs>
    <!-- Purple brick pattern for Firewalls -->
    <pattern id="fw-brick-pattern" width="18" height="9" patternUnits="userSpaceOnUse">
      <rect width="18" height="9" fill="#58217f" />
      <path d="M 0 0 L 18 0 M 0 4.5 L 18 4.5 M 0 9 L 18 9 M 0 0 L 0 4.5 M 9 4.5 L 9 9 M 18 0 L 18 4.5" stroke="#7e43a8" stroke-width="0.75" fill="none" />
    </pattern>

    <!-- Purple Switch Graphic matching Extreme / Visio stencil -->
    <g id="extreme-switch-chassis">
      <!-- Shadow baseline -->
      <path d="M 12 28 L 188 28 L 175 33 L 25 33 Z" fill="#3b1156" opacity="0.6"/>
      <!-- Main Chassis Body -->
      <rect x="0" y="0" width="200" height="28" rx="2" fill="#58217f" stroke="#3b1156" stroke-width="1.5"/>
      <!-- Port LEDs -->
      <g fill="#ffffff">
        <rect x="14" y="6" width="6" height="5" rx="0.5"/>
        <rect x="23" y="6" width="6" height="5" rx="0.5"/>
        <rect x="32" y="6" width="6" height="5" rx="0.5"/>
        <rect x="41" y="6" width="6" height="5" rx="0.5"/>
        <rect x="50" y="6" width="6" height="5" rx="0.5"/>
        <rect x="59" y="6" width="6" height="5" rx="0.5"/>

        <rect x="14" y="15" width="6" height="5" rx="0.5"/>
        <rect x="23" y="15" width="6" height="5" rx="0.5"/>
        <rect x="32" y="15" width="6" height="5" rx="0.5"/>
        <rect x="41" y="15" width="6" height="5" rx="0.5"/>
        <rect x="50" y="15" width="6" height="5" rx="0.5"/>
        <rect x="59" y="15" width="6" height="5" rx="0.5"/>

        <rect x="74" y="6" width="6" height="5" rx="0.5"/>
        <rect x="83" y="6" width="6" height="5" rx="0.5"/>
        <rect x="92" y="6" width="6" height="5" rx="0.5"/>
        <rect x="101" y="6" width="6" height="5" rx="0.5"/>

        <rect x="74" y="15" width="6" height="5" rx="0.5"/>
        <rect x="83" y="15" width="6" height="5" rx="0.5"/>
        <rect x="92" y="15" width="6" height="5" rx="0.5"/>
        <rect x="101" y="15" width="6" height="5" rx="0.5"/>

        <rect x="116" y="6" width="6" height="5" rx="0.5"/>
        <rect x="125" y="6" width="6" height="5" rx="0.5"/>
        <rect x="116" y="15" width="6" height="5" rx="0.5"/>
        <rect x="125" y="15" width="6" height="5" rx="0.5"/>
      </g>
      <!-- Switch Icon Box with 4 directional arrows -->
      <rect x="150" y="3" width="44" height="22" rx="1.5" fill="#240738" stroke="#7e43a8" stroke-width="1"/>
      <g stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M 158 14 L 172 14 M 166 9 L 172 14 L 166 19"/>
        <path d="M 186 14 L 172 14 M 178 9 L 172 14 L 178 19"/>
      </g>
    </g>
  </defs>

  <!-- 1. Interconnect Lines -->
  <g id="topology-links">
    ${linkElements.join("\n    ")}
  </g>

  <!-- 2. Port Labels -->
  <g id="topology-port-labels">
    ${linkLabelElements.join("\n    ")}
  </g>

  <!-- 3. Hardware Nodes -->
  <g id="topology-nodes">
    ${nodeElements.join("\n    ")}
  </g>
</svg>
  `.trim();
}

/**
 * Helper to fetch or generate SVG for a site
 */
export function getTopologySvgForSite(siteIdOrName: string): string | null {
  if (!siteIdOrName) return null;
  const clean = siteIdOrName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Match against known topologies
  for (const [key, topology] of Object.entries(SITE_TOPOLOGIES)) {
    const keyClean = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    const nameClean = topology.siteName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.includes(keyClean) || keyClean.includes(clean) || clean.includes(nameClean)) {
      return generateTopologySvg(topology);
    }
  }

  return null;
}
