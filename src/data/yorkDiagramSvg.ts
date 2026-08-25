// src/data/yorkDiagramSvg.ts
/**
 * Exact 1:1 Vector Topology Diagram for York
 * Traced and mapped directly from the uploaded DLC_-_York.png Visio drawing:
 * 
 * Topology:
 * - Top: Internet cloud (black stroke with bold "Internet" text)
 * - Interconnects to 2 Firewalls:
 *     - York-MXP (Purple brick texture) -> Link to DLC-York Core on Port 1
 *     - York-MXS (Purple brick texture) -> Link to DLC-York Core on Port 2
 * - Center: DLC-York Core Switch (Purple switch chassis with port LEDs and 4-way arrows)
 * - Edge Switches (Bottom):
 *     - DLC-York-Spa-SW1        (Uplink to Core Port 9 -> Edge Port 1)
 *     - DLC-York-Gym            (Uplink to Core Port 37 -> Edge Port 1)
 *     - DLL-York                (Uplink to Core Port 42 -> Edge Port 17)
 *     - DLC-York-MainComms-2    (Uplink to Core Port 41 -> Edge Port 48)
 */

export const YORK_DIAGRAM_SVG = `
<svg viewBox="0 0 1600 1020" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <defs>
    <!-- Purple brick pattern for York-MXP and York-MXS Firewalls -->
    <pattern id="fw-brick-pattern" width="18" height="9" patternUnits="userSpaceOnUse">
      <rect width="18" height="9" fill="#58217f" />
      <path d="M 0 0 L 18 0 M 0 4.5 L 18 4.5 M 0 9 L 18 9 M 0 0 L 0 4.5 M 9 4.5 L 9 9 M 18 0 L 18 4.5" stroke="#7e43a8" stroke-width="0.75" fill="none" />
    </pattern>

    <!-- Purple Switch Graphic definition matching Extreme / Visio stencil -->
    <g id="extreme-switch-chassis">
      <!-- Shadow baseline -->
      <path d="M 12 28 L 188 28 L 175 33 L 25 33 Z" fill="#3b1156" opacity="0.6"/>
      <!-- Main Chassis Body -->
      <rect x="0" y="0" width="200" height="28" rx="2" fill="#58217f" stroke="#3b1156" stroke-width="1.5"/>
      <!-- Left Port Blocks (Top row & Bottom row) -->
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

        <!-- Middle Port Block -->
        <rect x="74" y="6" width="6" height="5" rx="0.5"/>
        <rect x="83" y="6" width="6" height="5" rx="0.5"/>
        <rect x="92" y="6" width="6" height="5" rx="0.5"/>
        <rect x="101" y="6" width="6" height="5" rx="0.5"/>

        <rect x="74" y="15" width="6" height="5" rx="0.5"/>
        <rect x="83" y="15" width="6" height="5" rx="0.5"/>
        <rect x="92" y="15" width="6" height="5" rx="0.5"/>
        <rect x="101" y="15" width="6" height="5" rx="0.5"/>

        <!-- Right Port Block -->
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

  <!-- ==================== 1. INTERNET CLOUD ==================== -->
  <g transform="translate(970, 160)">
    <!-- Fluffy cloud silhouette matching Visio cloud -->
    <path d="M -100 0
             C -130 -30, -110 -80, -60 -80
             C -50 -120, 10 -130, 50 -100
             C 90 -120, 140 -80, 120 -30
             C 160 -10, 160 50, 110 70
             C 100 100, 20 110, -20 80
             C -60 100, -110 80, -100 40
             C -140 30, -130 -10, -100 0 Z"
          fill="#ffffff" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
    <text x="5" y="5" text-anchor="middle" font-size="34" font-weight="bold" fill="#000000">Internet</text>
  </g>

  <!-- ==================== 2. INTERNET TO FIREWALL TRUNKS ==================== -->
  <line x1="820" y1="180" x2="820" y2="440" stroke="#7e43a8" stroke-width="1.5" />
  <line x1="1115" y1="180" x2="1115" y2="440" stroke="#7e43a8" stroke-width="1.5" />

  <!-- ==================== 3. FIREWALLS ==================== -->
  <!-- Firewall 1: York-MXP -->
  <g transform="translate(785, 440)">
    <rect x="0" y="0" width="70" height="80" fill="url(#fw-brick-pattern)" stroke="#3b1156" stroke-width="1.5" rx="1"/>
    <text x="-12" y="45" text-anchor="end" font-size="16" font-weight="bold" fill="#58217f">York-MXP</text>
  </g>

  <!-- Firewall 2: York-MXS -->
  <g transform="translate(1080, 440)">
    <rect x="0" y="0" width="70" height="80" fill="url(#fw-brick-pattern)" stroke="#3b1156" stroke-width="1.5" rx="1"/>
    <text x="82" y="45" text-anchor="start" font-size="16" font-weight="bold" fill="#58217f">York-MXS</text>
  </g>

  <!-- ==================== 4. FIREWALL TO CORE SWITCH TRUNKS ==================== -->
  <!-- Line from York-MXP to DLC-York (Port 1) -->
  <line x1="820" y1="520" x2="945" y2="700" stroke="#7e43a8" stroke-width="1.5" />
  <text x="875" y="605" transform="rotate(55 875 605)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 1</text>

  <!-- Line from York-MXS to DLC-York (Port 2) -->
  <line x1="1090" y1="520" x2="965" y2="700" stroke="#7e43a8" stroke-width="1.5" />
  <text x="1035" y="605" transform="rotate(-55 1035 605)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 2</text>

  <!-- ==================== 5. CORE SWITCH: DLC-York ==================== -->
  <g transform="translate(855, 700)">
    <use href="#extreme-switch-chassis" />
    <text x="-12" y="20" text-anchor="end" font-size="15" font-weight="bold" fill="#58217f">DLC-York</text>
  </g>

  <!-- ==================== 6. CORE TO ACCESS SWITCH UPLINKS ==================== -->
  
  <!-- Uplink 1: DLC-York (Port 9) -> DLC-York-Spa-SW1 (Port 1) -->
  <line x1="880" y1="730" x2="260" y2="920" stroke="#7e43a8" stroke-width="1.5" />
  <text x="820" y="755" transform="rotate(17 820 755)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 9</text>
  <text x="315" y="905" transform="rotate(17 315 905)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 1</text>

  <!-- Uplink 2: DLC-York (Port 37) -> DLC-York-Gym (Port 1) -->
  <line x1="910" y1="730" x2="600" y2="920" stroke="#7e43a8" stroke-width="1.5" />
  <text x="830" y="785" transform="rotate(31.5 830 785)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 37</text>
  <text x="635" y="905" transform="rotate(31.5 635 905)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 1</text>

  <!-- Uplink 3: DLC-York (Port 42) -> DLL-York (Port 17) -->
  <line x1="955" y1="730" x2="940" y2="920" stroke="#7e43a8" stroke-width="1.5" />
  <text x="965" y="775" transform="rotate(90 965 775)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 42</text>
  <text x="965" y="890" transform="rotate(90 965 890)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 17</text>

  <!-- Uplink 4: DLC-York (Port 41) -> DLC-York-MainComms-2 (Port 48) -->
  <line x1="990" y1="730" x2="1360" y2="920" stroke="#7e43a8" stroke-width="1.5" />
  <text x="1055" y="775" transform="rotate(27 1055 775)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 41</text>
  <text x="1295" y="895" transform="rotate(27 1295 895)" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">Port 48</text>

  <!-- ==================== 7. EDGE ACCESS SWITCHES ==================== -->
  
  <!-- Switch 1: DLC-York-Spa-SW1 -->
  <g transform="translate(160, 920)">
    <use href="#extreme-switch-chassis" />
    <text x="-12" y="20" text-anchor="end" font-size="15" font-weight="bold" fill="#58217f">DLC-York-Spa-SW1</text>
  </g>

  <!-- Switch 2: DLC-York-Gym -->
  <g transform="translate(500, 920)">
    <use href="#extreme-switch-chassis" />
    <text x="-12" y="20" text-anchor="end" font-size="15" font-weight="bold" fill="#58217f">DLC-York-Gym</text>
  </g>

  <!-- Switch 3: DLL-York -->
  <g transform="translate(840, 920)">
    <use href="#extreme-switch-chassis" />
    <text x="212" y="20" text-anchor="start" font-size="15" font-weight="bold" fill="#58217f">DLL-York</text>
  </g>

  <!-- Switch 4: DLC-York-MainComms-2 -->
  <g transform="translate(1260, 920)">
    <use href="#extreme-switch-chassis" />
    <text x="212" y="20" text-anchor="start" font-size="15" font-weight="bold" fill="#58217f">DLC-York-MainComms-2</text>
  </g>
</svg>
`;
