// src/data/yorkHeatMapsData.ts
/**
 * High-fidelity Vector Wireless Signal Strength Heat Maps for David Lloyd York
 * Derived from the three architectural drawings:
 * 1. York - Ground Floor Signal Strength (David Lloyd Clubs - Hadfield Cawkwell Davidson)
 * 2. York - First Floor Signal Strength (David Lloyd Clubs - Hadfield Cawkwell Davidson)
 * 3. York - Site Plan Signal Strength (David Lloyd Clubs - Hadfield Cawkwell Davidson)
 */

export interface HeatMapAP {
  id: string;
  name: string;
  model: string;
  band: string;
  channel: string;
  txPower: string;
  location: string;
  signalDbm: number;
  x: number;
  y: number;
  connectedClients?: number;
  switchPort?: string;
}

export interface HeatMapPlan {
  id: string;
  title: string;
  subtitle: string;
  drawingNumber: string;
  fileSource: string;
  coverageStats: {
    totalAps: number;
    avgSignalDbm: number;
    excellentAreaPercent: number;
    goodAreaPercent: number;
    weakAreaPercent: number;
    primaryClients: number;
  };
  zones: {
    name: string;
    signal: string;
    signalColor: string;
    apAssigned: string;
  }[];
  aps: HeatMapAP[];
  svgContent: string;
}

// 1. GROUND FLOOR HEAT MAP SVG
const YORK_GROUND_FLOOR_HEATMAP_SVG = `
<svg viewBox="0 0 1600 1100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <!-- RF Radial Heat Gradients for APs -->
    <radialGradient id="gf-rf-ap1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.85" />
      <stop offset="35%" stop-color="#84cc16" stop-opacity="0.65" />
      <stop offset="65%" stop-color="#eab308" stop-opacity="0.4" />
      <stop offset="90%" stop-color="#f97316" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.9" />
      <stop offset="35%" stop-color="#84cc16" stop-opacity="0.7" />
      <stop offset="70%" stop-color="#eab308" stop-opacity="0.4" />
      <stop offset="95%" stop-color="#f97316" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.6" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap4" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.85" />
      <stop offset="35%" stop-color="#84cc16" stop-opacity="0.65" />
      <stop offset="70%" stop-color="#eab308" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap5" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.7" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap6" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.8" />
      <stop offset="45%" stop-color="#84cc16" stop-opacity="0.55" />
      <stop offset="80%" stop-color="#eab308" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap7" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#84cc16" stop-opacity="0.8" />
      <stop offset="45%" stop-color="#eab308" stop-opacity="0.6" />
      <stop offset="80%" stop-color="#f97316" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap8" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.6" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.4" />
      <stop offset="95%" stop-color="#f97316" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap9" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#84cc16" stop-opacity="0.8" />
      <stop offset="45%" stop-color="#eab308" stop-opacity="0.6" />
      <stop offset="80%" stop-color="#f97316" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gf-rf-ap10" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#eab308" stop-opacity="0.75" />
      <stop offset="50%" stop-color="#f97316" stop-opacity="0.5" />
      <stop offset="85%" stop-color="#ef4444" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0" />
    </radialGradient>

    <!-- Signal strength contour blur filter -->
    <filter id="blur-heat" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="28" />
    </filter>

    <!-- Extreme AP Icon -->
    <g id="ap-node">
      <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="2.5" />
      <circle cx="0" cy="0" r="8" fill="#4f46e5" />
      <!-- Star / Cross rays -->
      <path d="M 0 -11 L 0 -5 M 0 5 L 0 11 M -11 0 L -5 0 M 5 0 L 11 0" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="3" fill="#ffffff" />
    </g>
  </defs>

  <!-- Architectural Title Block (Hadfield Cawkwell Davidson) -->
  <rect x="25" y="25" width="1550" height="70" rx="8" fill="#0f172a" />
  <text x="50" y="65" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="1">David Lloyd CLUBS</text>
  <text x="280" y="65" font-size="18" font-weight="700" fill="#38bdf8">YORK GROUND FLOOR PLAN</text>
  <text x="630" y="65" font-size="14" font-weight="500" fill="#94a3b8">HADFIELD CAWKWELL DAVIDSON ARCHITECTS | DRAWING: 10584-001</text>
  <rect x="1330" y="40" width="220" height="40" rx="6" fill="#1e293b" stroke="#334155" />
  <text x="1440" y="65" font-size="13" font-weight="700" fill="#a78bfa" text-anchor="middle">SIGNAL STRENGTH HEAT MAP</text>

  <!-- Ground Floor Boundary & Background -->
  <rect x="40" y="115" width="1520" height="945" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>

  <!-- ==================== 1. HEATMAP RF CONTOUR OVERLAY ==================== -->
  <g filter="url(#blur-heat)" opacity="0.82">
    <!-- Reception / Turnstile AP Heat -->
    <ellipse cx="280" cy="380" rx="220" ry="180" fill="url(#gf-rf-ap1)" />
    <!-- Club Lounge & Bar AP Heat -->
    <ellipse cx="560" cy="360" rx="260" ry="210" fill="url(#gf-rf-ap2)" />
    <!-- Adult Lounge & Meeting Rooms AP Heat -->
    <ellipse cx="840" cy="340" rx="220" ry="170" fill="url(#gf-rf-ap3)" />
    <!-- DL Kids Activity & Playframe AP Heat -->
    <ellipse cx="530" cy="580" rx="230" ry="190" fill="url(#gf-rf-ap4)" />
    <!-- Comms Room & Admin AP Heat -->
    <ellipse cx="270" cy="620" rx="200" ry="170" fill="url(#gf-rf-ap5)" />
    <!-- Spa & Treatment Rooms AP Heat -->
    <ellipse cx="280" cy="850" rx="220" ry="180" fill="url(#gf-rf-ap6)" />
    <!-- Locker & Changing Rooms AP Heat -->
    <ellipse cx="600" cy="840" rx="240" ry="190" fill="url(#gf-rf-ap7)" />
    <!-- Indoor 25m Pool & Spa AP Heat -->
    <ellipse cx="1200" cy="400" rx="340" ry="260" fill="url(#gf-rf-ap8)" />
    <!-- Squash Courts 1-3 AP Heat -->
    <ellipse cx="920" cy="680" rx="210" ry="180" fill="url(#gf-rf-ap9)" />
    <!-- Indoor Tennis Courts 1-3 AP Heat -->
    <ellipse cx="1200" cy="780" rx="320" ry="240" fill="url(#gf-rf-ap10)" />
  </g>

  <!-- ==================== 2. ARCHITECTURAL ROOM WALLS & LABELS ==================== -->
  <!-- Main Entrance / Foyer / Reception -->
  <rect x="80" y="240" width="280" height="220" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="80" y="240" width="120" height="70" fill="#e2e8f0" stroke="#475569" stroke-width="1.5" />
  <text x="140" y="280" font-size="12" font-weight="700" fill="#0f172a" text-anchor="middle">MAIN ENTRANCE</text>
  <rect x="180" y="320" width="130" height="40" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
  <text x="245" y="345" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">RECEPTION DESK</text>
  <text x="245" y="430" font-size="13" font-weight="800" fill="#1e293b" text-anchor="middle">RECEPTION &amp; TURNSTILES</text>

  <!-- Club Lounge & Bar / Servery -->
  <rect x="380" y="240" width="340" height="220" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="420" y="260" width="240" height="45" rx="3" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
  <text x="540" y="288" font-size="12" font-weight="700" fill="#0f172a" text-anchor="middle">BAR / SERVERIES / DINING</text>
  <text x="550" y="420" font-size="15" font-weight="800" fill="#0f172a" text-anchor="middle">CLUB LOUNGE</text>

  <!-- Adult Lounge & Meeting Suite -->
  <rect x="740" y="240" width="220" height="220" fill="none" stroke="#334155" stroke-width="3" />
  <text x="850" y="320" font-size="14" font-weight="800" fill="#0f172a" text-anchor="middle">ADULT LOUNGE</text>
  <rect x="760" y="360" width="180" height="80" rx="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5" />
  <text x="850" y="405" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">BUSINESS / MEETING RM</text>

  <!-- Comms Room & Management -->
  <rect x="80" y="480" width="280" height="220" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="100" y="500" width="120" height="80" rx="3" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" />
  <text x="160" y="535" font-size="11" font-weight="800" fill="#5b21b6" text-anchor="middle">COMMS ROOM</text>
  <text x="160" y="555" font-size="9" font-weight="700" fill="#6d28d9" text-anchor="middle">DLC-York-MainComms-2</text>
  <rect x="230" y="500" width="110" height="80" rx="3" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
  <text x="285" y="545" font-size="10" font-weight="700" fill="#334155" text-anchor="middle">MANAGER OFFICE</text>
  <text x="220" y="660" font-size="13" font-weight="800" fill="#0f172a" text-anchor="middle">ADMIN &amp; SALES SUITE</text>

  <!-- DL Kids Activity Rooms & Playframe -->
  <rect x="380" y="480" width="340" height="220" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="400" y="500" width="140" height="85" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
  <text x="470" y="540" font-size="11" font-weight="800" fill="#92400e" text-anchor="middle">DL KIDS PLAYFRAME</text>
  <text x="470" y="560" font-size="9" font-weight="600" fill="#b45309" text-anchor="middle">Soft Play &amp; Ball Pit</text>
  <rect x="560" y="500" width="140" height="85" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
  <text x="630" y="540" font-size="11" font-weight="800" fill="#92400e" text-anchor="middle">ACTIVITY ROOMS</text>
  <text x="630" y="560" font-size="9" font-weight="600" fill="#b45309" text-anchor="middle">Rooms 1, 2 &amp; 3</text>
  <text x="550" y="665" font-size="14" font-weight="800" fill="#78350f" text-anchor="middle">DL KIDS ADVENTURE ZONE</text>

  <!-- Spa & Treatment Rooms -->
  <rect x="80" y="720" width="280" height="290" fill="none" stroke="#334155" stroke-width="3" />
  <text x="220" y="760" font-size="14" font-weight="800" fill="#0f172a" text-anchor="middle">SPA &amp; BEAUTY SUITE</text>
  <g fill="#e0f2fe" stroke="#0284c7" stroke-width="1">
    <rect x="100" y="780" width="60" height="80" rx="3" />
    <text x="130" y="825" font-size="9" font-weight="700" fill="#0369a1" text-anchor="middle">TREAT 1</text>
    <rect x="170" y="780" width="60" height="80" rx="3" />
    <text x="200" y="825" font-size="9" font-weight="700" fill="#0369a1" text-anchor="middle">TREAT 2</text>
    <rect x="240" y="780" width="60" height="80" rx="3" />
    <text x="270" y="825" font-size="9" font-weight="700" fill="#0369a1" text-anchor="middle">TREAT 3</text>
  </g>
  <text x="220" y="930" font-size="11" font-weight="700" fill="#0369a1" text-anchor="middle">TREATMENT RECEPTION</text>

  <!-- Changing Rooms (Male, Female, Family) -->
  <rect x="380" y="720" width="340" height="290" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="400" y="750" width="140" height="110" rx="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5" />
  <text x="470" y="800" font-size="11" font-weight="800" fill="#1e293b" text-anchor="middle">FEMALE CHANGING</text>
  <text x="470" y="820" font-size="9" font-weight="600" fill="#475569" text-anchor="middle">Lockers, Showers, Vanity</text>
  
  <rect x="560" y="750" width="140" height="110" rx="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5" />
  <text x="630" y="800" font-size="11" font-weight="800" fill="#1e293b" text-anchor="middle">MALE CHANGING</text>
  <text x="630" y="820" font-size="9" font-weight="600" fill="#475569" text-anchor="middle">Lockers, Showers, Sauna</text>
  <text x="550" y="940" font-size="13" font-weight="800" fill="#0f172a" text-anchor="middle">FAMILY &amp; ACCESSIBLE CHANGING</text>

  <!-- Indoor Swimming Pool (25m x 12m) & Poolside Spa -->
  <rect x="980" y="240" width="540" height="360" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="1030" y="270" width="380" height="220" rx="6" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" />
  <text x="1220" y="380" font-size="18" font-weight="900" fill="#0369a1" text-anchor="middle" letter-spacing="1">INDOOR POOL (25m x 12m)</text>
  <text x="1220" y="410" font-size="12" font-weight="600" fill="#0284c7" text-anchor="middle">Heated Lap &amp; Leisure Pool</text>
  <!-- Poolside Spa, Steam, Sauna -->
  <g fill="#cffafe" stroke="#0891b2" stroke-width="1.5">
    <rect x="1430" y="270" width="70" height="60" rx="3" />
    <text x="1465" y="305" font-size="9" font-weight="800" fill="#0e7490" text-anchor="middle">SPA</text>
    <rect x="1430" y="340" width="70" height="60" rx="3" />
    <text x="1465" y="375" font-size="9" font-weight="800" fill="#0e7490" text-anchor="middle">STEAM</text>
    <rect x="1430" y="410" width="70" height="60" rx="3" />
    <text x="1465" y="445" font-size="9" font-weight="800" fill="#0e7490" text-anchor="middle">SAUNA</text>
  </g>
  <text x="1220" y="550" font-size="13" font-weight="800" fill="#075985" text-anchor="middle">POOLSIDE RELAXATION &amp; SPLASH POOL</text>

  <!-- Squash Courts 1, 2, 3 -->
  <rect x="740" y="480" width="220" height="320" fill="none" stroke="#334155" stroke-width="3" />
  <g fill="#fef08a" stroke="#ca8a04" stroke-width="1.5">
    <rect x="760" y="500" width="180" height="70" rx="2" />
    <text x="850" y="540" font-size="11" font-weight="800" fill="#854d0e" text-anchor="middle">SQUASH COURT 1</text>
    <rect x="760" y="580" width="180" height="70" rx="2" />
    <text x="850" y="620" font-size="11" font-weight="800" fill="#854d0e" text-anchor="middle">SQUASH COURT 2</text>
    <rect x="760" y="660" width="180" height="70" rx="2" />
    <text x="850" y="700" font-size="11" font-weight="800" fill="#854d0e" text-anchor="middle">SQUASH COURT 3</text>
  </g>
  <text x="850" y="770" font-size="11" font-weight="700" fill="#854d0e" text-anchor="middle">SPECTATOR GALLERY</text>

  <!-- Indoor Tennis Courts 1-3 -->
  <rect x="980" y="620" width="540" height="390" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="1010" y="660" width="480" height="300" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <!-- Tennis Court Markings -->
  <line x1="1250" y1="660" x2="1250" y2="960" stroke="#ffffff" stroke-width="3" />
  <rect x="1050" y="700" width="400" height="220" fill="none" stroke="#ffffff" stroke-width="2" />
  <text x="1250" y="800" font-size="18" font-weight="900" fill="#15803d" text-anchor="middle">INDOOR TENNIS ARENA</text>
  <text x="1250" y="825" font-size="12" font-weight="700" fill="#166534" text-anchor="middle">Courts 1, 2 &amp; 3 (Championship Acrylic)</text>

  <!-- ==================== 3. ACCESS POINTS (APs) PLACEMENT ==================== -->
  <!-- AP-GF-01 (Reception) -->
  <g transform="translate(280, 380)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#38bdf8" text-anchor="middle">AP-GF-01 (-52dBm)</text>
  </g>

  <!-- AP-GF-02 (Club Lounge & Bar) -->
  <g transform="translate(560, 360)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle">AP-GF-02 (-53dBm)</text>
  </g>

  <!-- AP-GF-03 (Adult Lounge) -->
  <g transform="translate(840, 340)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle">AP-GF-03 (-56dBm)</text>
  </g>

  <!-- AP-GF-04 (DL Kids) -->
  <g transform="translate(530, 580)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle">AP-GF-04 (-52dBm)</text>
  </g>

  <!-- AP-GF-05 (Comms Room / Admin) -->
  <g transform="translate(270, 620)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#22c55e" text-anchor="middle">AP-GF-05 (-48dBm)</text>
  </g>

  <!-- AP-GF-06 (Spa & Treatment) -->
  <g transform="translate(280, 850)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#a3e635" text-anchor="middle">AP-GF-06 (-60dBm)</text>
  </g>

  <!-- AP-GF-07 (Locker Rooms) -->
  <g transform="translate(600, 840)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#facc15" text-anchor="middle">AP-GF-07 (-64dBm)</text>
  </g>

  <!-- AP-GF-08 (Pool Hall & Spa) -->
  <g transform="translate(1200, 400)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#facc15" text-anchor="middle">AP-GF-08 (-66dBm)</text>
  </g>

  <!-- AP-GF-09 (Squash Courts) -->
  <g transform="translate(920, 680)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#fb923c" text-anchor="middle">AP-GF-09 (-68dBm)</text>
  </g>

  <!-- AP-GF-10 (Indoor Tennis) -->
  <g transform="translate(1200, 780)">
    <use href="#ap-node" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#fb923c" text-anchor="middle">AP-GF-10 (-72dBm)</text>
  </g>

  <!-- ==================== 4. SIGNAL STRENGTH COLOR BAR & LEGEND ==================== -->
  <g transform="translate(60, 1030)">
    <rect x="0" y="0" width="1480" height="35" rx="6" fill="#0f172a" stroke="#334155" />
    <text x="15" y="22" font-size="11" font-weight="800" fill="#e2e8f0">RF SIGNAL STRENGTH (dBm):</text>
    
    <!-- Gradient Legend Bar -->
    <rect x="220" y="10" width="80" height="15" fill="#22c55e" rx="2"/>
    <text x="260" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">-50 to -60 (Excellent)</text>

    <rect x="310" y="10" width="80" height="15" fill="#84cc16" rx="2"/>
    <text x="350" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">-60 to -65 (Voice/Data)</text>

    <rect x="400" y="10" width="80" height="15" fill="#eab308" rx="2"/>
    <text x="440" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">-65 to -75 (Good)</text>

    <rect x="490" y="10" width="80" height="15" fill="#f97316" rx="2"/>
    <text x="530" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">-75 to -85 (Fair)</text>

    <rect x="580" y="10" width="80" height="15" fill="#64748b" rx="2"/>
    <text x="620" y="22" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">&lt; -85 (Out of range)</text>

    <!-- AP Marker Legend -->
    <circle cx="730" cy="17" r="7" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
    <circle cx="730" cy="17" r="4" fill="#4f46e5" />
    <text x="745" y="22" font-size="11" font-weight="700" fill="#a5b4fc">Extreme AP3000 / AP4000 (Wi-Fi 6E)</text>

    <text x="1465" y="22" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="end">10 APs Active | Floor Coverage: 96.8%</text>
  </g>
</svg>
`;

// 2. FIRST FLOOR HEAT MAP SVG
const YORK_FIRST_FLOOR_HEATMAP_SVG = `
<svg viewBox="0 0 1600 1100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <!-- RF Radial Gradients for First Floor APs -->
    <radialGradient id="ff-rf-ap1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.65" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ff-rf-ap2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.9" />
      <stop offset="35%" stop-color="#84cc16" stop-opacity="0.7" />
      <stop offset="70%" stop-color="#eab308" stop-opacity="0.4" />
      <stop offset="95%" stop-color="#f97316" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ff-rf-ap3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#22c55e" stop-opacity="0.8" />
      <stop offset="65%" stop-color="#84cc16" stop-opacity="0.5" />
      <stop offset="90%" stop-color="#eab308" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ff-rf-ap4" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.6" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ff-rf-ap5" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.6" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ff-rf-ap6" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#84cc16" stop-opacity="0.8" />
      <stop offset="45%" stop-color="#eab308" stop-opacity="0.55" />
      <stop offset="80%" stop-color="#f97316" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>

    <!-- Void Pattern -->
    <pattern id="void-cross-hatch" width="16" height="16" patternUnits="userSpaceOnUse">
      <path d="M 0 0 L 16 16 M 16 0 L 0 16" stroke="#94a3b8" stroke-width="0.75" />
    </pattern>

    <filter id="blur-heat-ff" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" />
    </filter>

    <g id="ap-node-ff">
      <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="2.5" />
      <circle cx="0" cy="0" r="8" fill="#7c3aed" />
      <path d="M 0 -11 L 0 -5 M 0 5 L 0 11 M -11 0 L -5 0 M 5 0 L 11 0" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="3" fill="#ffffff" />
    </g>
  </defs>

  <!-- Architectural Title Block -->
  <rect x="25" y="25" width="1550" height="70" rx="8" fill="#0f172a" />
  <text x="50" y="65" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="1">David Lloyd CLUBS</text>
  <text x="280" y="65" font-size="18" font-weight="700" fill="#c084fc">YORK FIRST FLOOR PLAN</text>
  <text x="610" y="65" font-size="14" font-weight="500" fill="#94a3b8">HADFIELD CAWKWELL DAVIDSON ARCHITECTS | DRAWING: 10584-002</text>
  <rect x="1330" y="40" width="220" height="40" rx="6" fill="#1e293b" stroke="#334155" />
  <text x="1440" y="65" font-size="13" font-weight="700" fill="#a78bfa" text-anchor="middle">SIGNAL STRENGTH HEAT MAP</text>

  <!-- Boundary -->
  <rect x="40" y="115" width="1520" height="945" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>

  <!-- ==================== 1. RF HEATMAP CONTOURS ==================== -->
  <g filter="url(#blur-heat-ff)" opacity="0.84">
    <!-- Mezzanine Lobby AP Heat -->
    <ellipse cx="320" cy="380" rx="240" ry="200" fill="url(#ff-rf-ap1)" />
    <!-- Main Gym Floor AP Heat -->
    <ellipse cx="640" cy="380" rx="300" ry="240" fill="url(#ff-rf-ap2)" />
    <!-- Blaze Studio (38 Stations) AP Heat -->
    <ellipse cx="320" cy="720" rx="260" ry="220" fill="url(#ff-rf-ap3)" />
    <!-- Mind & Body Studio AP Heat -->
    <ellipse cx="640" cy="720" rx="240" ry="200" fill="url(#ff-rf-ap4)" />
    <!-- High Impact & Spin Studio AP Heat -->
    <ellipse cx="880" cy="540" rx="250" ry="220" fill="url(#ff-rf-ap5)" />
    <!-- Storage & Plant AP Heat -->
    <ellipse cx="880" cy="820" rx="200" ry="160" fill="url(#ff-rf-ap6)" />
  </g>

  <!-- ==================== 2. ROOM ENCLOSURES & VOIDS ==================== -->
  <!-- Mezzanine Lobby & Staircase -->
  <rect x="80" y="240" width="360" height="260" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="100" y="260" width="140" height="80" rx="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5" />
  <text x="170" y="300" font-size="12" font-weight="700" fill="#0f172a" text-anchor="middle">CENTRAL STAIRCASE</text>
  <text x="170" y="320" font-size="10" font-weight="600" fill="#475569" text-anchor="middle">&amp; LIFT LANDING</text>
  <text x="260" y="440" font-size="15" font-weight="800" fill="#0f172a" text-anchor="middle">FIRST FLOOR LOBBY</text>

  <!-- Main Fitness Gym (Cardio, Strength, Free Weights) -->
  <rect x="460" y="240" width="380" height="260" fill="none" stroke="#334155" stroke-width="3" />
  <g fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5">
    <rect x="480" y="260" width="160" height="70" rx="3" />
    <text x="560" y="295" font-size="11" font-weight="800" fill="#1d4ed8" text-anchor="middle">CARDIO MACHINES</text>
    <text x="560" y="315" font-size="9" font-weight="600" fill="#2563eb" text-anchor="middle">Treadmills, Bikes, Rowers</text>
    <rect x="660" y="260" width="160" height="70" rx="3" />
    <text x="740" y="295" font-size="11" font-weight="800" fill="#1d4ed8" text-anchor="middle">FREE WEIGHTS &amp; RIG</text>
    <text x="740" y="315" font-size="9" font-weight="600" fill="#2563eb" text-anchor="middle">Dumbbells &amp; Racks</text>
  </g>
  <text x="650" y="440" font-size="16" font-weight="900" fill="#0f172a" text-anchor="middle">MAIN FITNESS GYM</text>

  <!-- BLAZE Studio (38 Stations) -->
  <rect x="80" y="520" width="360" height="380" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="110" y="550" width="300" height="260" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="2" />
  <text x="260" y="650" font-size="20" font-weight="900" fill="#991b1b" text-anchor="middle" letter-spacing="2">BLAZE STUDIO</text>
  <text x="260" y="685" font-size="13" font-weight="800" fill="#b91c1c" text-anchor="middle">38 STATION ATHLETIC ARENA</text>
  <text x="260" y="715" font-size="11" font-weight="600" fill="#dc2626" text-anchor="middle">Woodway Curved Treadmills, Weight Benches &amp; Punch Bags</text>
  <text x="260" y="865" font-size="12" font-weight="700" fill="#7f1d1d" text-anchor="middle">DEDICATED MYZONE TELEMETRY</text>

  <!-- Mind & Body Studio (Yoga / Pilates / Holistic) -->
  <rect x="460" y="520" width="380" height="240" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="480" y="550" width="340" height="150" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
  <text x="650" y="620" font-size="16" font-weight="800" fill="#92400e" text-anchor="middle">MIND &amp; BODY STUDIO</text>
  <text x="650" y="650" font-size="11" font-weight="600" fill="#b45309" text-anchor="middle">Yoga, Pilates &amp; Sound Bath Studio (Timber Sprung Floor)</text>
  <text x="650" y="730" font-size="12" font-weight="700" fill="#78350f" text-anchor="middle">HOLISTIC SOUND &amp; LIGHTING</text>

  <!-- High Impact Studio & Spin Group Cycling -->
  <rect x="860" y="240" width="220" height="420" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="880" y="260" width="180" height="170" rx="3" fill="#f3e8ff" stroke="#9333ea" stroke-width="1.5" />
  <text x="970" y="335" font-size="13" font-weight="800" fill="#6b21a8" text-anchor="middle">HIGH IMPACT</text>
  <text x="970" y="355" font-size="12" font-weight="800" fill="#6b21a8" text-anchor="middle">STUDIO</text>
  <text x="970" y="380" font-size="9" font-weight="600" fill="#7e22ce" text-anchor="middle">Step &amp; BodyPump</text>

  <rect x="880" y="450" width="180" height="180" rx="3" fill="#fae8ff" stroke="#c026d3" stroke-width="1.5" />
  <text x="970" y="525" font-size="13" font-weight="800" fill="#86198f" text-anchor="middle">SPIN / CYCLING</text>
  <text x="970" y="545" font-size="12" font-weight="800" fill="#86198f" text-anchor="middle">STUDIO</text>
  <text x="970" y="570" font-size="9" font-weight="600" fill="#a21caf" text-anchor="middle">Stages SC3 Power Bikes</text>

  <!-- Storage & Plant Rooms -->
  <rect x="460" y="780" width="620" height="230" fill="none" stroke="#334155" stroke-width="3" />
  <rect x="480" y="800" width="160" height="90" rx="3" fill="#e2e8f0" stroke="#64748b" stroke-width="1" />
  <text x="560" y="845" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">GYM STORAGE</text>
  <rect x="660" y="800" width="180" height="90" rx="3" fill="#cbd5e1" stroke="#64748b" stroke-width="1" />
  <text x="750" y="845" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">PLANT &amp; AHU ROOM</text>
  <text x="770" y="960" font-size="13" font-weight="800" fill="#1e293b" text-anchor="middle">SERVICE CORRIDOR &amp; RISERS</text>

  <!-- Voids over Ground Floor (Indoor Pool, Squash, Tennis) -->
  <g fill="url(#void-cross-hatch)" stroke="#475569" stroke-width="2">
    <!-- Void over Indoor Pool -->
    <rect x="1100" y="240" width="420" height="340" />
    <!-- Void over Squash Courts -->
    <rect x="860" y="680" width="220" height="210" />
    <!-- Void over Tennis Courts -->
    <rect x="1100" y="600" width="420" height="410" />
  </g>
  <rect x="1150" y="380" width="320" height="60" rx="4" fill="#ffffff" stroke="#64748b" stroke-width="1.5" />
  <text x="1310" y="415" font-size="14" font-weight="800" fill="#475569" text-anchor="middle">VOID OVER INDOOR POOL</text>
  
  <rect x="880" y="760" width="180" height="50" rx="4" fill="#ffffff" stroke="#64748b" stroke-width="1.5" />
  <text x="970" y="790" font-size="11" font-weight="800" fill="#475569" text-anchor="middle">VOID OVER SQUASH</text>

  <rect x="1150" y="780" width="320" height="60" rx="4" fill="#ffffff" stroke="#64748b" stroke-width="1.5" />
  <text x="1310" y="815" font-size="14" font-weight="800" fill="#475569" text-anchor="middle">VOID OVER TENNIS COURTS</text>

  <!-- ==================== 3. ACCESS POINTS ==================== -->
  <!-- AP-FF-01 (Lobby) -->
  <g transform="translate(320, 380)">
    <use href="#ap-node-ff" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#38bdf8" text-anchor="middle">AP-FF-01 (-52dBm)</text>
  </g>

  <!-- AP-FF-02 (Main Gym) -->
  <g transform="translate(640, 380)">
    <use href="#ap-node-ff" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#22c55e" text-anchor="middle">AP-FF-02 (-50dBm)</text>
  </g>

  <!-- AP-FF-03 (Blaze Studio) -->
  <g transform="translate(320, 720)">
    <use href="#ap-node-ff" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#22c55e" text-anchor="middle">AP-FF-03 (-48dBm)</text>
  </g>

  <!-- AP-FF-04 (Mind & Body) -->
  <g transform="translate(640, 720)">
    <use href="#ap-node-ff" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle">AP-FF-04 (-56dBm)</text>
  </g>

  <!-- AP-FF-05 (High Impact & Spin) -->
  <g transform="translate(880, 540)">
    <use href="#ap-node-ff" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle">AP-FF-05 (-54dBm)</text>
  </g>

  <!-- AP-FF-06 (Storage / Plant) -->
  <g transform="translate(880, 820)">
    <use href="#ap-node-ff" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#facc15" text-anchor="middle">AP-FF-06 (-65dBm)</text>
  </g>

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
    <circle cx="730" cy="17" r="4" fill="#7c3aed" />
    <text x="745" y="22" font-size="11" font-weight="700" fill="#c4b5fd">Extreme AP4000 (Tri-Band Wi-Fi 6E)</text>

    <text x="1465" y="22" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="end">6 APs Active | Floor Coverage: 98.4%</text>
  </g>
</svg>
`;

// 3. SITE PLAN HEAT MAP SVG
const YORK_SITE_HEATMAP_SVG = `
<svg viewBox="0 0 1600 1100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <!-- Radial Gradients for Outdoor APs -->
    <radialGradient id="ext-rf-ap1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.7" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ext-rf-ap2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.6" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ext-rf-ap3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#84cc16" stop-opacity="0.65" />
      <stop offset="75%" stop-color="#eab308" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ext-rf-ap4" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#84cc16" stop-opacity="0.8" />
      <stop offset="45%" stop-color="#eab308" stop-opacity="0.6" />
      <stop offset="80%" stop-color="#f97316" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ext-rf-ap5" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#84cc16" stop-opacity="0.8" />
      <stop offset="45%" stop-color="#eab308" stop-opacity="0.6" />
      <stop offset="80%" stop-color="#f97316" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>

    <!-- Parking Lines Pattern -->
    <pattern id="car-park-pattern" width="40" height="24" patternUnits="userSpaceOnUse">
      <rect width="40" height="24" fill="#e2e8f0" />
      <line x1="0" y1="0" x2="0" y2="24" stroke="#94a3b8" stroke-width="1.5" />
      <line x1="20" y1="0" x2="20" y2="24" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2 2" />
    </pattern>

    <filter id="blur-heat-ext" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="34" />
    </filter>

    <g id="ap-node-ext">
      <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="2.5" />
      <circle cx="0" cy="0" r="8" fill="#0284c7" />
      <path d="M 0 -11 L 0 -5 M 0 5 L 0 11 M -11 0 L -5 0 M 5 0 L 11 0" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="3" fill="#ffffff" />
    </g>
  </defs>

  <!-- Architectural Title Block -->
  <rect x="25" y="25" width="1550" height="70" rx="8" fill="#0f172a" />
  <text x="50" y="65" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="1">David Lloyd CLUBS</text>
  <text x="280" y="65" font-size="18" font-weight="700" fill="#38bdf8">YORK SITE &amp; EXTERNAL PLAN</text>
  <text x="630" y="65" font-size="14" font-weight="500" fill="#94a3b8">HADFIELD CAWKWELL DAVIDSON ARCHITECTS | DRAWING: 10584-000</text>
  <rect x="1330" y="40" width="220" height="40" rx="6" fill="#1e293b" stroke="#334155" />
  <text x="1440" y="65" font-size="13" font-weight="700" fill="#a78bfa" text-anchor="middle">SIGNAL STRENGTH HEAT MAP</text>

  <!-- Site Boundary Background -->
  <rect x="40" y="115" width="1520" height="945" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>

  <!-- ==================== 1. RF HEATMAP CONTOURS ==================== -->
  <g filter="url(#blur-heat-ext)" opacity="0.84">
    <!-- Outdoor Pool AP Heat -->
    <ellipse cx="440" cy="400" rx="280" ry="220" fill="url(#ext-rf-ap1)" />
    <!-- Outdoor Battle Box AP Heat -->
    <ellipse cx="260" cy="680" rx="240" ry="200" fill="url(#ext-rf-ap2)" />
    <!-- Lounge Terrace AP Heat -->
    <ellipse cx="680" cy="400" rx="260" ry="210" fill="url(#ext-rf-ap3)" />
    <!-- Outdoor Tennis Hub AP Heat -->
    <ellipse cx="460" cy="850" rx="270" ry="220" fill="url(#ext-rf-ap4)" />
    <!-- Entrance & Forecourt AP Heat -->
    <ellipse cx="980" cy="380" rx="250" ry="200" fill="url(#ext-rf-ap5)" />
  </g>

  <!-- ==================== 2. SITE ZONES & GROUNDS ==================== -->
  <!-- Car Parking Zone (239 spaces) -->
  <rect x="920" y="240" width="580" height="760" fill="url(#car-park-pattern)" stroke="#334155" stroke-width="3" rx="6"/>
  <rect x="960" y="270" width="500" height="80" rx="4" fill="#0f172a" />
  <text x="1210" y="310" font-size="16" font-weight="800" fill="#ffffff" text-anchor="middle">MAIN CAR PARK (239 TOTAL SPACES)</text>
  <text x="1210" y="335" font-size="12" font-weight="600" fill="#94a3b8" text-anchor="middle">10 Accessible Disabled Bays | 8 Parent &amp; Child Bays | EV Rapid Charging</text>

  <!-- Substation & Service Compound -->
  <rect x="1320" y="820" width="160" height="150" fill="#e2e8f0" stroke="#475569" stroke-width="2" rx="3"/>
  <text x="1400" y="890" font-size="12" font-weight="800" fill="#334155" text-anchor="middle">SUB-STATION</text>
  <text x="1400" y="915" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">&amp; COMPOUND</text>

  <!-- Main Club House Building Footprint -->
  <rect x="580" y="240" width="320" height="420" fill="#f8fafc" stroke="#1e293b" stroke-width="3.5" rx="4"/>
  <text x="740" y="340" font-size="16" font-weight="900" fill="#0f172a" text-anchor="middle">MAIN CLUB BUILDING</text>
  <text x="740" y="370" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">Reception, Lounges, Gym &amp; Indoor Pools</text>
  <rect x="620" y="420" width="240" height="60" rx="3" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5" />
  <text x="740" y="455" font-size="12" font-weight="800" fill="#4338ca" text-anchor="middle">OUTDOOR LOUNGE TERRACE</text>

  <!-- Outdoor Swimming Pool (25m x 10m) & Poolside Terrace -->
  <rect x="220" y="240" width="340" height="320" fill="#f0fdf4" stroke="#334155" stroke-width="3" rx="4"/>
  <rect x="250" y="270" width="280" height="160" rx="6" fill="#7dd3fc" stroke="#0284c7" stroke-width="3" />
  <text x="390" y="355" font-size="17" font-weight="900" fill="#0369a1" text-anchor="middle" letter-spacing="1">OUTDOOR POOL (25m x 10m)</text>
  <text x="390" y="385" font-size="11" font-weight="700" fill="#0284c7" text-anchor="middle">Heated Year-Round Luxury Pool</text>
  <rect x="250" y="450" width="280" height="80" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
  <text x="390" y="495" font-size="12" font-weight="800" fill="#92400e" text-anchor="middle">POOLSIDE SUN TERRACE &amp; BAR</text>

  <!-- Outdoor Battle Box (Functional Fitness Zone) -->
  <rect x="80" y="580" width="280" height="200" fill="#fef2f2" stroke="#334155" stroke-width="3" rx="4"/>
  <rect x="100" y="600" width="240" height="150" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="2" />
  <text x="220" y="665" font-size="15" font-weight="900" fill="#991b1b" text-anchor="middle" letter-spacing="1">OUTDOOR BATTLE BOX</text>
  <text x="220" y="695" font-size="11" font-weight="700" fill="#b91c1c" text-anchor="middle">Functional Training Rig &amp; Turf Tracks</text>

  <!-- DL Kids External Adventure Play -->
  <rect x="380" y="580" width="180" height="200" fill="#fefce8" stroke="#334155" stroke-width="3" rx="4"/>
  <text x="470" y="670" font-size="13" font-weight="800" fill="#854d0e" text-anchor="middle">DL KIDS</text>
  <text x="470" y="695" font-size="12" font-weight="800" fill="#854d0e" text-anchor="middle">EXTERNAL PLAY</text>

  <!-- Outdoor Tennis Courts (Courts 1 to 6) -->
  <rect x="80" y="800" width="820" height="210" fill="#f0fdf4" stroke="#334155" stroke-width="3" rx="4"/>
  <g fill="#dcfce7" stroke="#16a34a" stroke-width="1.5">
    <rect x="100" y="820" width="240" height="160" rx="3" />
    <text x="220" y="905" font-size="13" font-weight="800" fill="#15803d" text-anchor="middle">OUTDOOR COURTS 1 &amp; 2</text>
    <rect x="370" y="820" width="240" height="160" rx="3" />
    <text x="490" y="905" font-size="13" font-weight="800" fill="#15803d" text-anchor="middle">OUTDOOR COURTS 3 &amp; 4</text>
    <rect x="640" y="820" width="240" height="160" rx="3" />
    <text x="760" y="905" font-size="13" font-weight="800" fill="#15803d" text-anchor="middle">OUTDOOR COURTS 5 &amp; 6</text>
  </g>

  <!-- ==================== 3. ACCESS POINTS ==================== -->
  <!-- AP-EXT-01 (Outdoor Pool Terrace) -->
  <g transform="translate(440, 400)">
    <use href="#ap-node-ext" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#38bdf8" text-anchor="middle">AP-EXT-01 (-54dBm)</text>
  </g>

  <!-- AP-EXT-02 (Battle Box) -->
  <g transform="translate(260, 680)">
    <use href="#ap-node-ext" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle">AP-EXT-02 (-58dBm)</text>
  </g>

  <!-- AP-EXT-03 (Lounge Terrace) -->
  <g transform="translate(680, 400)">
    <use href="#ap-node-ext" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle">AP-EXT-03 (-56dBm)</text>
  </g>

  <!-- AP-EXT-04 (Outdoor Tennis Hub) -->
  <g transform="translate(460, 850)">
    <use href="#ap-node-ext" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#facc15" text-anchor="middle">AP-EXT-04 (-66dBm)</text>
  </g>

  <!-- AP-EXT-05 (Entrance & Forecourt) -->
  <g transform="translate(980, 380)">
    <use href="#ap-node-ext" />
    <rect x="-45" y="16" width="90" height="20" rx="3" fill="#0f172a" stroke="#334155" />
    <text x="0" y="30" font-size="9" font-weight="700" fill="#facc15" text-anchor="middle">AP-EXT-05 (-62dBm)</text>
  </g>

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
    <circle cx="730" cy="17" r="4" fill="#0284c7" />
    <text x="745" y="22" font-size="11" font-weight="700" fill="#7dd3fc">Extreme AP5050 Outdoor IP67 (Wi-Fi 6E)</text>

    <text x="1465" y="22" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="end">5 APs Active | Outdoor Grounds Coverage: 92.4%</text>
  </g>
</svg>
`;

export const YORK_HEATMAP_PLANS: HeatMapPlan[] = [
  {
    id: "ground_floor",
    title: "Ground Floor Signal Strength",
    subtitle: "Reception, Club Lounge, DL Kids, Aquatics & Indoor Arena",
    drawingNumber: "10584-001",
    fileSource: "York_-_Ground_Floor_Signal_Strength.png",
    coverageStats: {
      totalAps: 10,
      avgSignalDbm: -58.4,
      excellentAreaPercent: 68,
      goodAreaPercent: 24,
      weakAreaPercent: 8,
      primaryClients: 142
    },
    zones: [
      { name: "Reception & Turnstiles", signal: "-52 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-GF-01" },
      { name: "Club Lounge & Bar / Dining", signal: "-53 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-GF-02" },
      { name: "Adult Lounge & Business Meeting", signal: "-56 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-GF-03" },
      { name: "DL Kids Playframe & Activity", signal: "-52 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-GF-04" },
      { name: "Comms Room & Management Suite", signal: "-48 dBm (Ultra High)", signalColor: "text-emerald-400", apAssigned: "AP-GF-05" },
      { name: "Spa & Treatment Rooms", signal: "-60 dBm (Good Voice/Data)", signalColor: "text-lime-400", apAssigned: "AP-GF-06" },
      { name: "Male / Female Changing Lockers", signal: "-64 dBm (Good Voice/Data)", signalColor: "text-lime-400", apAssigned: "AP-GF-07" },
      { name: "Indoor 25m Heated Pool & Spa", signal: "-66 dBm (Good)", signalColor: "text-yellow-400", apAssigned: "AP-GF-08" },
      { name: "Squash Courts 1-3 Spectators", signal: "-68 dBm (Good)", signalColor: "text-yellow-400", apAssigned: "AP-GF-09" },
      { name: "Indoor Tennis Courts Arena", signal: "-72 dBm (Fair Coverage)", signalColor: "text-amber-400", apAssigned: "AP-GF-10" }
    ],
    aps: [
      { id: "AP-GF-01", name: "DLC-York-AP-GF01", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "1 / 36 / 37", txPower: "18 dBm", location: "Main Reception Foyer", signalDbm: -52, x: 280, y: 380, connectedClients: 28, switchPort: "DLC-York-MainComms-2 (Port 12)" },
      { id: "AP-GF-02", name: "DLC-York-AP-GF02", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 52 / 53", txPower: "20 dBm", location: "Club Lounge Servery", signalDbm: -53, x: 560, y: 360, connectedClients: 45, switchPort: "DLC-York-MainComms-2 (Port 14)" },
      { id: "AP-GF-03", name: "DLC-York-AP-GF03", model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "11 / 100", txPower: "17 dBm", location: "Adult Lounge Suite", signalDbm: -56, x: 840, y: 340, connectedClients: 14, switchPort: "DLC-York-MainComms-2 (Port 16)" },
      { id: "AP-GF-04", name: "DLC-York-AP-GF04", model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "1 / 116", txPower: "18 dBm", location: "DL Kids Playframe", signalDbm: -52, x: 530, y: 580, connectedClients: 19, switchPort: "DLC-York-MainComms-2 (Port 18)" },
      { id: "AP-GF-05", name: "DLC-York-AP-GF05", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 132 / 69", txPower: "17 dBm", location: "Comms & Manager Office", signalDbm: -48, x: 270, y: 620, connectedClients: 8, switchPort: "DLC-York-MainComms-2 (Port 20)" },
      { id: "AP-GF-06", name: "DLC-York-AP-GF06", model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "11 / 149", txPower: "18 dBm", location: "Treatment Suite Foyer", signalDbm: -60, x: 280, y: 850, connectedClients: 6, switchPort: "DLC-York-Spa-SW1 (Port 5)" },
      { id: "AP-GF-07", name: "DLC-York-AP-GF07", model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "1 / 44", txPower: "19 dBm", location: "Changing Locker Corridor", signalDbm: -64, x: 600, y: 840, connectedClients: 11, switchPort: "DLC-York-Spa-SW1 (Port 7)" },
      { id: "AP-GF-08", name: "DLC-York-AP-GF08", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 60 / 85", txPower: "21 dBm", location: "Indoor 25m Pool Hall", signalDbm: -66, x: 1200, y: 400, connectedClients: 5, switchPort: "DLC-York-Spa-SW1 (Port 11)" },
      { id: "AP-GF-09", name: "DLC-York-AP-GF09", model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "11 / 108", txPower: "18 dBm", location: "Squash Gallery", signalDbm: -68, x: 920, y: 680, connectedClients: 3, switchPort: "DLL-York (Port 4)" },
      { id: "AP-GF-10", name: "DLC-York-AP-GF10", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "1 / 124 / 101", txPower: "22 dBm", location: "Indoor Tennis Arena", signalDbm: -72, x: 1200, y: 780, connectedClients: 3, switchPort: "DLL-York (Port 8)" }
    ],
    svgContent: YORK_GROUND_FLOOR_HEATMAP_SVG
  },
  {
    id: "first_floor",
    title: "First Floor Signal Strength",
    subtitle: "Main Fitness Gym, BLAZE HIIT Arena, Mind & Body, Spin Studio",
    drawingNumber: "10584-002",
    fileSource: "York_-_First_Floor_Signal_Strength.png",
    coverageStats: {
      totalAps: 6,
      avgSignalDbm: -53.8,
      excellentAreaPercent: 78,
      goodAreaPercent: 18,
      weakAreaPercent: 4,
      primaryClients: 94
    },
    zones: [
      { name: "First Floor Mezzanine & Lift Lobby", signal: "-52 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-FF-01" },
      { name: "Main Fitness Gym & Free Weights", signal: "-50 dBm (Ultra High)", signalColor: "text-emerald-400", apAssigned: "AP-FF-02" },
      { name: "BLAZE Studio (38 Stations)", signal: "-48 dBm (Ultra High / MyZone)", signalColor: "text-emerald-400", apAssigned: "AP-FF-03" },
      { name: "Mind & Body Holistic Studio", signal: "-56 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-FF-04" },
      { name: "High Impact & Spin Group Cycling", signal: "-54 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-FF-05" },
      { name: "Gym Storage & AHU Plant Service", signal: "-65 dBm (Good Voice/Data)", signalColor: "text-lime-400", apAssigned: "AP-FF-06" }
    ],
    aps: [
      { id: "AP-FF-01", name: "DLC-York-AP-FF01", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "1 / 36 / 37", txPower: "18 dBm", location: "Mezzanine Lobby", signalDbm: -52, x: 320, y: 380, connectedClients: 12, switchPort: "DLC-York-Gym (Port 3)" },
      { id: "AP-FF-02", name: "DLC-York-AP-FF02", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 52 / 53", txPower: "21 dBm", location: "Main Gym Cardio Floor", signalDbm: -50, x: 640, y: 380, connectedClients: 42, switchPort: "DLC-York-Gym (Port 5)" },
      { id: "AP-FF-03", name: "DLC-York-AP-FF03", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "11 / 100 / 69", txPower: "20 dBm", location: "BLAZE Arena Rig", signalDbm: -48, x: 320, y: 720, connectedClients: 26, switchPort: "DLC-York-Gym (Port 7)" },
      { id: "AP-FF-04", name: "DLC-York-AP-FF04", model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "1 / 116", txPower: "17 dBm", location: "Mind & Body Studio", signalDbm: -56, x: 640, y: 720, connectedClients: 8, switchPort: "DLC-York-Gym (Port 9)" },
      { id: "AP-FF-05", name: "DLC-York-AP-FF05", model: "Extreme AP4000", band: "Tri-Band (2.4/5/6 GHz)", channel: "6 / 132 / 85", txPower: "19 dBm", location: "High Impact & Spin Tier", signalDbm: -54, x: 880, y: 540, connectedClients: 6, switchPort: "DLC-York-Gym (Port 11)" },
      { id: "AP-FF-06", name: "DLC-York-AP-FF06", model: "Extreme AP3000", band: "Dual-Band (2.4/5 GHz)", channel: "11 / 149", txPower: "18 dBm", location: "Storage Service Hall", signalDbm: -65, x: 880, y: 820, connectedClients: 0, switchPort: "DLC-York-Gym (Port 13)" }
    ],
    svgContent: YORK_FIRST_FLOOR_HEATMAP_SVG
  },
  {
    id: "site_plan",
    title: "Site & External Plan Signal Strength",
    subtitle: "Outdoor 25m Pool, Battle Box, Tennis Courts & 239-Bay Car Park",
    drawingNumber: "10584-000",
    fileSource: "York_-_Site_Signal_Strength.png",
    coverageStats: {
      totalAps: 5,
      avgSignalDbm: -61.2,
      excellentAreaPercent: 54,
      goodAreaPercent: 32,
      weakAreaPercent: 14,
      primaryClients: 38
    },
    zones: [
      { name: "Outdoor 25m Pool & Sun Terrace", signal: "-54 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-EXT-01" },
      { name: "Outdoor Battle Box Rig & Turf", signal: "-58 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-EXT-02" },
      { name: "Club Lounge Outdoor Terrace", signal: "-56 dBm (Excellent)", signalColor: "text-emerald-400", apAssigned: "AP-EXT-03" },
      { name: "Outdoor Tennis Courts (Courts 1-6)", signal: "-66 dBm (Good)", signalColor: "text-yellow-400", apAssigned: "AP-EXT-04" },
      { name: "Main Entrance Forecourt & Cycle Bays", signal: "-62 dBm (Good Voice/Data)", signalColor: "text-lime-400", apAssigned: "AP-EXT-05" },
      { name: "Main Car Park (239 Bays Perimeter)", signal: "-78 dBm (Fair / Outlying)", signalColor: "text-amber-400", apAssigned: "AP-EXT-05" }
    ],
    aps: [
      { id: "AP-EXT-01", name: "DLC-York-AP-EXT01", model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "1 / 36 / 37", txPower: "24 dBm", location: "Outdoor Pool Sun Terrace", signalDbm: -54, x: 440, y: 400, connectedClients: 16, switchPort: "DLC-York-Spa-SW1 (Port 15)" },
      { id: "AP-EXT-02", name: "DLC-York-AP-EXT02", model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "6 / 52 / 53", txPower: "24 dBm", location: "Battle Box Rig Pillar", signalDbm: -58, x: 260, y: 680, connectedClients: 9, switchPort: "DLC-York-Gym (Port 17)" },
      { id: "AP-EXT-03", name: "DLC-York-AP-EXT03", model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "11 / 100 / 69", txPower: "22 dBm", location: "Lounge Exterior Terrace", signalDbm: -56, x: 680, y: 400, connectedClients: 7, switchPort: "DLC-York-MainComms-2 (Port 22)" },
      { id: "AP-EXT-04", name: "DLC-York-AP-EXT04", model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "1 / 116 / 85", txPower: "25 dBm", location: "Outdoor Tennis Pavilion", signalDbm: -66, x: 460, y: 850, connectedClients: 4, switchPort: "DLL-York (Port 12)" },
      { id: "AP-EXT-05", name: "DLC-York-AP-EXT05", model: "Extreme AP5050 IP67", band: "Tri-Band Outdoor (2.4/5/6 GHz)", channel: "6 / 132 / 101", txPower: "23 dBm", location: "Forecourt Lamp Column", signalDbm: -62, x: 980, y: 380, connectedClients: 2, switchPort: "DLC-York-MainComms-2 (Port 24)" }
    ],
    svgContent: YORK_SITE_HEATMAP_SVG
  }
];
