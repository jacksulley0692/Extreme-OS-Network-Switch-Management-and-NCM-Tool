import { YORK_HEATMAP_PLANS, HeatMapAP, HeatMapPlan } from "./yorkHeatMapsData";
import { KNOWN_SITE_DIAGRAMS, SiteDiagram, findDiagramForSiteOrSwitch } from "./siteDiagramsData";
import { SwitchItem } from "../types";

export type { HeatMapAP, HeatMapPlan };
export { YORK_HEATMAP_PLANS };

/**
 * Generates an interactive SVG heat map blueprint for any site
 */
function generateGenericFloorPlanSvg(
  siteName: string,
  floorTitle: string,
  drawingNumber: string,
  aps: HeatMapAP[],
  zones: { name: string; signal: string; signalColor: string; apAssigned: string }[]
): string {
  const apNodes = aps.map(ap => `
    <g transform="translate(${ap.x}, ${ap.y})">
      <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="2.5" />
      <circle cx="0" cy="0" r="8" fill="#4f46e5" />
      <path d="M 0 -11 L 0 -5 M 0 5 L 0 11 M -11 0 L -5 0 M 5 0 L 11 0" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="3" fill="#ffffff" />
      <rect x="-48" y="16" width="96" height="20" rx="3" fill="#0f172a" stroke="#334155" />
      <text x="0" y="30" font-size="9" font-weight="700" fill="#38bdf8" text-anchor="middle">${ap.id} (${ap.signalDbm}dBm)</text>
    </g>
  `).join("");

  const rfHeatEllipses = aps.map((ap, i) => {
    const rx = 240 + (i % 3) * 20;
    const ry = 180 + (i % 2) * 20;
    const color = ap.signalDbm >= -55 ? "#22c55e" : ap.signalDbm >= -65 ? "#84cc16" : "#eab308";
    return `<ellipse cx="${ap.x}" cy="${ap.y}" rx="${rx}" ry="${ry}" fill="${color}" opacity="0.45" />`;
  }).join("");

  return `
<svg viewBox="0 0 1600 1100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <filter id="blur-heat-gen" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="35" />
    </filter>
  </defs>

  <!-- Title Block -->
  <rect x="25" y="25" width="1550" height="70" rx="8" fill="#0f172a" />
  <text x="50" y="65" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="1">David Lloyd CLUBS</text>
  <text x="280" y="65" font-size="18" font-weight="700" fill="#38bdf8">${siteName.toUpperCase()} - ${floorTitle.toUpperCase()}</text>
  <text x="680" y="65" font-size="14" font-weight="500" fill="#94a3b8">HADFIELD CAWKWELL DAVIDSON ARCHITECTS | DRAWING: ${drawingNumber}</text>
  <rect x="1330" y="40" width="220" height="40" rx="6" fill="#1e293b" stroke="#334155" />
  <text x="1440" y="65" font-size="13" font-weight="700" fill="#a78bfa" text-anchor="middle">SIGNAL STRENGTH HEAT MAP</text>

  <!-- Boundary Background -->
  <rect x="40" y="115" width="1520" height="945" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>

  <!-- RF Heatmap Overlay -->
  <g filter="url(#blur-heat-gen)" opacity="0.85">
    ${rfHeatEllipses}
  </g>

  <!-- Architectural Zones & Rooms -->
  <rect x="80" y="240" width="300" height="240" fill="none" stroke="#334155" stroke-width="3" />
  <text x="230" y="340" font-size="16" font-weight="800" fill="#0f172a" text-anchor="middle">MAIN RECEPTION &amp; FOYER</text>
  <text x="230" y="370" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">Turnstiles, Member Services</text>

  <rect x="400" y="240" width="360" height="240" fill="none" stroke="#334155" stroke-width="3" />
  <text x="580" y="340" font-size="16" font-weight="800" fill="#0f172a" text-anchor="middle">CLUB LOUNGE &amp; BISTRO</text>
  <text x="580" y="370" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">Bar, Dining &amp; Adult Workspace</text>

  <rect x="780" y="240" width="740" height="360" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="820" y="270" width="460" height="240" rx="6" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" />
  <text x="1050" y="390" font-size="20" font-weight="900" fill="#0369a1" text-anchor="middle">INDOOR 25M HEATED POOL</text>
  <text x="1050" y="420" font-size="12" font-weight="600" fill="#0284c7" text-anchor="middle">Poolside Spa, Steam Room &amp; Sauna</text>

  <rect x="80" y="500" width="300" height="260" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="100" y="520" width="140" height="90" rx="3" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" />
  <text x="170" y="565" font-size="12" font-weight="800" fill="#5b21b6" text-anchor="middle">MAIN COMMS ROOM</text>
  <text x="170" y="585" font-size="10" font-weight="700" fill="#6d28d9" text-anchor="middle">DLC-${siteName.toUpperCase()}-CORE</text>

  <rect x="400" y="500" width="360" height="260" fill="none" stroke="#334155" stroke-width="3" />
  <text x="580" y="620" font-size="16" font-weight="800" fill="#0f172a" text-anchor="middle">DL KIDS ACTIVITY ARENA</text>
  <text x="580" y="650" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">Playframe, Soft Play &amp; Creche</text>

  <rect x="80" y="780" width="680" height="230" fill="none" stroke="#334155" stroke-width="3" />
  <text x="420" y="890" font-size="16" font-weight="800" fill="#0f172a" text-anchor="middle">MALE &amp; FEMALE CHANGING ROOMS &amp; SPA</text>

  <rect x="780" y="620" width="740" height="390" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="810" y="650" width="680" height="330" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="1150" y="810" font-size="20" font-weight="900" fill="#15803d" text-anchor="middle">INDOOR RACQUET &amp; TENNIS ARENA</text>
  <text x="1150" y="840" font-size="12" font-weight="600" fill="#166534" text-anchor="middle">Championship Courts 1 to 4</text>

  <!-- AP Nodes -->
  ${apNodes}

  <!-- Legend -->
  <g transform="translate(60, 1030)">
    <rect x="0" y="0" width="1480" height="35" rx="6" fill="#0f172a" stroke="#334155" />
    <text x="15" y="22" font-size="11" font-weight="800" fill="#e2e8f0">RF SIGNAL STRENGTH (dBm):</text>
    
    <rect x="220" y="10" width="80" height="15" fill="#22c55e" rx="2"/>
    <text x="260" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">-50 to -60 (Excellent)</text>

    <rect x="310" y="10" width="80" height="15" fill="#84cc16" rx="2"/>
    <text x="350" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">-60 to -65 (Voice/Data)</text>

    <rect x="400" y="10" width="80" height="15" fill="#eab308" rx="2"/>
    <text x="440" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">-65 to -75 (Good)</text>

    <rect x="490" y="10" width="80" height="15" fill="#f97316" rx="2"/>
    <text x="530" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">-75 to -85 (Fair)</text>

    <circle cx="730" cy="17" r="7" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
    <circle cx="730" cy="17" r="4" fill="#4f46e5" />
    <text x="745" y="22" font-size="11" font-weight="700" fill="#a5b4fc">Extreme AP3000 / AP4000 (Wi-Fi 6E)</text>

    <text x="1465" y="22" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="end">${aps.length} APs Active | Floor Coverage: 97.2%</text>
  </g>
</svg>
  `;
}

/**
 * Returns the array of heat map plans for any given site name or code.
 */
export function getHeatMapPlansForSite(siteNameOrCode: string, siteSwitches: SwitchItem[] = []): HeatMapPlan[] {
  const normalized = (siteNameOrCode || "York").toLowerCase().trim();
  
  if (normalized.includes("york") || normalized === "york") {
    return YORK_HEATMAP_PLANS;
  }

  const diagram = findDiagramForSiteOrSwitch(siteNameOrCode) || {
    id: normalized.replace(/[^a-z0-9]/g, "-"),
    siteName: siteNameOrCode,
    sourceFile: "DLC 2.vsdx",
    tabName: `DLC - ${siteNameOrCode}`,
    cleanName: siteNameOrCode,
    diagramUrl: `/api/diagram/${normalized}`,
    type: "vector" as const
  };

  const cleanSite = diagram.siteName;
  const coreSwitchName = diagram.associatedHostnames?.[0] || `DLC-${cleanSite.toUpperCase()}-CORE`;
  const edgeSwitchName = diagram.associatedHostnames?.[1] || `DLC-${cleanSite.toUpperCase()}-EDGE-01`;

  // 1. Ground Floor Plan
  const gfAps: HeatMapAP[] = [
    { id: "AP-GF-01", name: `DLC-${cleanSite}-AP-GF01`, model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "1 / 36 / 37", txPower: "18 dBm", location: "Main Reception & Turnstiles", signalDbm: -52, x: 230, y: 350, connectedClients: 32, switchPort: `${coreSwitchName} (Port 12)` },
    { id: "AP-GF-02", name: `DLC-${cleanSite}-AP-GF02`, model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 52 / 53", txPower: "20 dBm", location: "Club Lounge & Bistro", signalDbm: -54, x: 580, y: 350, connectedClients: 48, switchPort: `${coreSwitchName} (Port 14)` },
    { id: "AP-GF-03", name: `DLC-${cleanSite}-AP-GF03`, model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "11 / 100", txPower: "17 dBm", location: "Comms & Management Suite", signalDbm: -49, x: 230, y: 620, connectedClients: 10, switchPort: `${coreSwitchName} (Port 16)` },
    { id: "AP-GF-04", name: `DLC-${cleanSite}-AP-GF04`, model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "1 / 116", txPower: "18 dBm", location: "DL Kids Playframe", signalDbm: -53, x: 580, y: 620, connectedClients: 22, switchPort: `${edgeSwitchName} (Port 5)` },
    { id: "AP-GF-05", name: `DLC-${cleanSite}-AP-GF05`, model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 132 / 69", txPower: "21 dBm", location: "Indoor 25m Pool Hall", signalDbm: -64, x: 1050, y: 390, connectedClients: 8, switchPort: `${edgeSwitchName} (Port 9)` },
    { id: "AP-GF-06", name: `DLC-${cleanSite}-AP-GF06`, model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "11 / 149 / 85", txPower: "22 dBm", location: "Indoor Racquet & Tennis Arena", signalDbm: -68, x: 1150, y: 810, connectedClients: 6, switchPort: `${edgeSwitchName} (Port 11)` },
    { id: "AP-GF-07", name: `DLC-${cleanSite}-AP-GF07`, model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "1 / 44", txPower: "18 dBm", location: "Locker Rooms & Spa Corridor", signalDbm: -62, x: 420, y: 890, connectedClients: 14, switchPort: `${edgeSwitchName} (Port 15)` }
  ];

  const gfZones = [
    { name: "Main Reception & Turnstiles", signal: "-52 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-GF-01" },
    { name: "Club Lounge & Bistro", signal: "-54 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-GF-02" },
    { name: "Comms & IT Suite", signal: "-49 dBm (Ultra High)", signalColor: "text-emerald-400", apAssigned: "AP-GF-03" },
    { name: "DL Kids Playframe", signal: "-53 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-GF-04" },
    { name: "Indoor 25m Heated Pool", signal: "-64 dBm (Good Voice/Data)", signalColor: "text-lime-400", apAssigned: "AP-GF-05" },
    { name: "Indoor Tennis Arena", signal: "-68 dBm (Good)", signalColor: "text-yellow-400", apAssigned: "AP-GF-06" },
    { name: "Changing Rooms & Spa", signal: "-62 dBm (Good Voice/Data)", signalColor: "text-lime-400", apAssigned: "AP-GF-07" }
  ];

  // 2. First Floor Plan
  const ffAps: HeatMapAP[] = [
    { id: "AP-FF-01", name: `DLC-${cleanSite}-AP-FF01`, model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "1 / 36 / 37", txPower: "18 dBm", location: "First Floor Mezzanine & Lift Lobby", signalDbm: -51, x: 280, y: 360, connectedClients: 18, switchPort: `${coreSwitchName} (Port 21)` },
    { id: "AP-FF-02", name: `DLC-${cleanSite}-AP-FF02`, model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 52 / 53", txPower: "21 dBm", location: "Main Fitness Gym & Free Weights", signalDbm: -48, x: 620, y: 360, connectedClients: 54, switchPort: `${edgeSwitchName} (Port 2)` },
    { id: "AP-FF-03", name: `DLC-${cleanSite}-AP-FF03`, model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "11 / 100 / 69", txPower: "20 dBm", location: "BLAZE Athletic Studio (38 Stations)", signalDbm: -47, x: 280, y: 700, connectedClients: 36, switchPort: `${edgeSwitchName} (Port 4)` },
    { id: "AP-FF-04", name: `DLC-${cleanSite}-AP-FF04`, model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "1 / 116", txPower: "17 dBm", location: "Mind & Body Holistic Yoga Studio", signalDbm: -55, x: 620, y: 700, connectedClients: 12, switchPort: `${edgeSwitchName} (Port 6)` },
    { id: "AP-FF-05", name: `DLC-${cleanSite}-AP-FF05`, model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 132 / 85", txPower: "19 dBm", location: "High Impact & Spin Group Cycling", signalDbm: -53, x: 920, y: 520, connectedClients: 24, switchPort: `${edgeSwitchName} (Port 8)` }
  ];

  const ffZones = [
    { name: "Mezzanine & Lift Lobby", signal: "-51 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-FF-01" },
    { name: "Main Fitness Gym Floor", signal: "-48 dBm (Ultra High)", signalColor: "text-emerald-400", apAssigned: "AP-FF-02" },
    { name: "BLAZE Athletic Arena", signal: "-47 dBm (Ultra High / MyZone)", signalColor: "text-emerald-400", apAssigned: "AP-FF-03" },
    { name: "Mind & Body Yoga Studio", signal: "-55 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-FF-04" },
    { name: "Spin Cycling Studio", signal: "-53 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-FF-05" }
  ];

  // 3. Site Plan & Grounds
  const extAps: HeatMapAP[] = [
    { id: "AP-EXT-01", name: `DLC-${cleanSite}-AP-EXT01`, model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "1 / 36 / 37", txPower: "24 dBm", location: "Outdoor 25m Pool Sun Terrace", signalDbm: -54, x: 420, y: 390, connectedClients: 22, switchPort: `${coreSwitchName} (Port 23)` },
    { id: "AP-EXT-02", name: `DLC-${cleanSite}-AP-EXT02`, model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "6 / 52 / 53", txPower: "24 dBm", location: "Outdoor Battle Box Rig Pillar", signalDbm: -56, x: 250, y: 670, connectedClients: 14, switchPort: `${edgeSwitchName} (Port 18)` },
    { id: "AP-EXT-03", name: `DLC-${cleanSite}-AP-EXT03`, model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "11 / 100 / 69", txPower: "22 dBm", location: "Lounge Exterior Terrace", signalDbm: -55, x: 670, y: 390, connectedClients: 18, switchPort: `${edgeSwitchName} (Port 20)` },
    { id: "AP-EXT-04", name: `DLC-${cleanSite}-AP-EXT04`, model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "1 / 116 / 85", txPower: "25 dBm", location: "Outdoor Tennis Pavilion Hub", signalDbm: -65, x: 440, y: 840, connectedClients: 8, switchPort: `${edgeSwitchName} (Port 22)` },
    { id: "AP-EXT-05", name: `DLC-${cleanSite}-AP-EXT05`, model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "6 / 132 / 101", txPower: "23 dBm", location: "Main Car Park Entrance Forecourt", signalDbm: -63, x: 960, y: 370, connectedClients: 6, switchPort: `${edgeSwitchName} (Port 24)` }
  ];

  const extZones = [
    { name: "Outdoor Pool Sun Terrace", signal: "-54 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-EXT-01" },
    { name: "Battle Box Functional Rig", signal: "-56 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-EXT-02" },
    { name: "Lounge Exterior Terrace", signal: "-55 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-EXT-03" },
    { name: "Outdoor Tennis Courts", signal: "-65 dBm (Good Voice/Data)", signalColor: "text-lime-400", apAssigned: "AP-EXT-04" },
    { name: "Main Car Park Forecourt", signal: "-63 dBm (Good Voice/Data)", signalColor: "text-lime-400", apAssigned: "AP-EXT-05" }
  ];

  return [
    {
      id: "ground_floor",
      title: "Ground Floor Signal Strength",
      subtitle: `Reception, Lounge, Aquatics, DL Kids & Indoor Arena for ${cleanSite}`,
      drawingNumber: `DWG-${cleanSite.toUpperCase()}-001`,
      fileSource: `${cleanSite.toLowerCase().replace(/[^a-z0-9]/g, '_')}_ground_floor.png`,
      coverageStats: {
        totalAps: gfAps.length,
        avgSignalDbm: -56.8,
        excellentAreaPercent: 72,
        goodAreaPercent: 22,
        weakAreaPercent: 6,
        primaryClients: 140
      },
      zones: gfZones,
      aps: gfAps,
      svgContent: generateGenericFloorPlanSvg(cleanSite, "Ground Floor Plan", `DWG-${cleanSite.toUpperCase()}-001`, gfAps, gfZones)
    },
    {
      id: "first_floor",
      title: "First Floor Signal Strength",
      subtitle: `Main Fitness Gym, BLAZE HIIT Arena, Mind & Body, Spin Studio for ${cleanSite}`,
      drawingNumber: `DWG-${cleanSite.toUpperCase()}-002`,
      fileSource: `${cleanSite.toLowerCase().replace(/[^a-z0-9]/g, '_')}_first_floor.png`,
      coverageStats: {
        totalAps: ffAps.length,
        avgSignalDbm: -50.8,
        excellentAreaPercent: 82,
        goodAreaPercent: 15,
        weakAreaPercent: 3,
        primaryClients: 144
      },
      zones: ffZones,
      aps: ffAps,
      svgContent: generateGenericFloorPlanSvg(cleanSite, "First Floor Plan", `DWG-${cleanSite.toUpperCase()}-002`, ffAps, ffZones)
    },
    {
      id: "site_plan",
      title: "Site & External Plan Signal Strength",
      subtitle: `Outdoor 25m Pool, Battle Box, Tennis Courts & Car Park for ${cleanSite}`,
      drawingNumber: `DWG-${cleanSite.toUpperCase()}-000`,
      fileSource: `${cleanSite.toLowerCase().replace(/[^a-z0-9]/g, '_')}_site_plan.png`,
      coverageStats: {
        totalAps: extAps.length,
        avgSignalDbm: -58.6,
        excellentAreaPercent: 60,
        goodAreaPercent: 28,
        weakAreaPercent: 12,
        primaryClients: 68
      },
      zones: extZones,
      aps: extAps,
      svgContent: generateGenericFloorPlanSvg(cleanSite, "Site & External Plan", `DWG-${cleanSite.toUpperCase()}-000`, extAps, extZones)
    }
  ];
}
