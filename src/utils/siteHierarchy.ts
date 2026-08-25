// src/utils/siteHierarchy.ts
import { SwitchItem } from "../types";
import { KNOWN_SITE_DIAGRAMS, SITE_DIAGRAM_FILES, getDiagramPngPathForSite } from "../data/siteDiagramsData";

export interface SiteGroup {
  siteCode: string; // Normalized uppercase key (e.g. "YORK", "ABERDEEN", "SHREWSBURY", "LEEDS")
  siteName: string; // Formatted display name (e.g. "York", "Aberdeen", "Shrewsbury", "Leeds")
  switches: SwitchItem[];
  totalCount: number;
  backedUpCount: number;
  unreachableCount: number;
  hasDiagram: boolean;
  diagramPath?: string | null;
  sourceWorkbook?: string;
  tabName?: string;
}

/**
 * Normalizes any hostname, IP, or site name into a canonical siteCode
 */
export function extractSiteCode(hostnameOrIp: string): string {
  if (!hostnameOrIp) return "UNASSIGNED";
  
  const clean = String(hostnameOrIp).trim();
  
  // Known IP subnet mappings
  if (clean.startsWith("10.32.224.")) return "ABERDEEN";
  if (clean.startsWith("10.32.221.") || clean.startsWith("10.32.81.")) return "YORK";
  if (clean.startsWith("10.32.214.")) return "LICHFIELD";
  if (clean.startsWith("10.32.54.")) return "LEEDS";
  if (clean.startsWith("10.32.61.")) return "LEICESTER";
  if (clean.startsWith("10.32.208.")) return "BRISTOL";
  if (clean.startsWith("10.32.227.")) return "BEACONSFIELD";
  if (clean.startsWith("10.32.52.")) return "LINCOLN";
  if (clean.startsWith("10.32.48.")) return "LUTON";

  // Pure IP address without known mapping
  const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipRegex.test(clean)) {
    return "UNASSIGNED";
  }

  const lower = clean.toLowerCase();
  
  // Specific multi-word or compound site matches first
  if (lower.includes("royalberkshire") || lower.includes("royal-berkshire") || lower.includes("royal berkshire")) return "ROYALBERKSHIRE";
  if (lower.includes("cheshireoaks") || lower.includes("cheshire-oaks") || lower.includes("cheshire oaks")) return "CHESHIREOAKS";
  if (lower.includes("collierswood") || lower.includes("colliers-wood") || lower.includes("colliers wood")) return "COLLIERSWOOD";
  if (lower.includes("emersonsgreen") || lower.includes("emersons-green") || lower.includes("emersons green")) return "EMERSONSGREEN";
  if (lower.includes("gideapark") || lower.includes("gidea-park") || lower.includes("gidea park")) return "GIDEAPARK";
  if (lower.includes("hernebay") || lower.includes("herne-bay") || lower.includes("herne bay")) return "HERNEBAY";
  if (lower.includes("kingshill") || lower.includes("kings-hill") || lower.includes("kings hill")) return "KINGSHILL";
  if (lower.includes("lafinca") || lower.includes("la-finca") || lower.includes("la finca")) return "LAFINCA";
  if (lower.includes("miltonkeynes") || lower.includes("milton-keynes") || lower.includes("milton keynes")) return "MILTONKEYNES";
  if (lower.includes("nottinghill") || lower.includes("notting-hill") || lower.includes("notting hill")) return "NOTTINGHILL";
  if (lower.includes("portsolent") || lower.includes("port-solent") || lower.includes("port solent")) return "PORTSOLENT";
  if (lower.includes("raynespark") || lower.includes("raynes-park") || lower.includes("raynes park")) return "RAYNESPARK";
  if (lower.includes("sudburyhill") || lower.includes("sudbury-hill") || lower.includes("sudbury hill")) return "SUDBURYHILL";
  if (lower.includes("westbridgeford") || lower.includes("westbridgford") || lower.includes("west-bridgeford") || lower.includes("west bridgford")) return "WESTBRIDGFORD";
  if (lower.includes("blijdorp") || lower.includes("rotterdam")) return "ROTTERDAM";
  if (lower.includes("badhomburg") || lower.includes("bad-homburg") || lower.includes("bad homburg")) return "BADHOMBURG";
  if (lower.includes("burystedmunds") || lower.includes("bury-st-edmunds") || lower.includes("bury")) return "BURYSTEDMUNDS";
  if (lower.includes("gavamar") || lower.includes("gava-mar") || lower.includes("gava mar")) return "GAVAMAR";

  // Specific Glasgow Sub-sites
  if (lower.includes("roukenglen") || lower.includes("rouken-glen") || lower.includes("rouken")) return "GLASGOW-ROUKEN-GLEN";
  if (lower.includes("renfrew")) return "GLASGOW-RENFREW";
  if (lower.includes("glasgow-we") || lower.includes("west-end") || lower.includes("westend")) return "GLASGOW-WEST-END";
  if (lower.includes("glasgow")) return "GLASGOW";

  // Specific Geneva sub-sites
  if (lower.includes("citygreen") || lower.includes("city-green") || lower.includes("city green")) return "GENEVA-CITY-GREEN";
  if (lower.includes("genevacc") || lower.includes("geneva-cc") || lower.includes("geneva cc")) return "GENEVA-CC";
  if (lower.includes("geneva")) return "GENEVA-CITY-GREEN";

  // Specific Bristol Sub-sites
  if (lower.includes("bristol-la") || lower.includes("long-ashton") || lower.includes("longashton") || lower.includes("bristolla")) return "BRISTOL-LA";
  if (lower.includes("westbury") || lower.includes("bristolwestbury") || lower.includes("bristol-westbury")) return "BRISTOL-WESTBURY";
  if (lower.includes("bristol")) return "BRISTOL";

  // Specific Southampton Sub-sites
  if (lower.includes("southamptonwestend") || lower.includes("southampton-west-end")) return "SOUTHAMPTON-WEST-END";
  if (lower.includes("southampton")) return "SOUTHAMPTON";

  // Normalizations for typos / variations
  if (lower.includes("sterrebeek") || lower.includes("sterr") || lower.includes("ster")) return "STERREBEEK";
  if (lower.includes("shresbury") || lower.includes("shrewsbury")) return "SHREWSBURY";
  if (lower.includes("solihull")) return "SOLIHULL";
  if (lower.includes("narbourgh") || lower.includes("narborough")) return "NARBOROUGH";
  if (lower.includes("teeside") || lower.includes("teesside")) return "TEESSIDE";
  if (lower.includes("gloucestshire") || lower.includes("gloucestershire") || lower.includes("gloucester")) return "GLOUCESTERSHIRE";
  if (lower.includes("malaspain") || lower.includes("malaspina")) return "MALASPINA";
  if (lower.includes("manchesternorth") || lower.includes("manchester-north")) return "MANCHESTER-NORTH";
  if (lower.includes("manchester")) return "MANCHESTER";
  if (lower.includes("norwhich") || lower.includes("norwich")) return "NORWICH";
  if (lower.includes("brussles") || lower.includes("brussels")) return "BRUSSELS";
  if (lower.includes("edinburghnewhaven") || lower.includes("newhaven")) return "EDINBURGH-NEWHAVEN";
  if (lower.includes("edinburgh")) return "EDINBURGH";

  // Direct single-city keywords
  const directCities = [
    "ABERDEEN", "ACTON", "AMSTERDAM", "ARAVACA", "BARCELONA", "BASILDON", "BEACONSFIELD", 
    "BECKENHAM", "BELFAST", "BICESTER", "BIRMINGHAM", "BOADILLA", "BOLTON", "BRIGHTON", 
    "BROMSGROVE", "BROOKLANDS", "BUSHEY", "CAMBRIDGE", "CAPELLE", "CARDIFF", "CHEADLE", 
    "CHEAM", "CHIGWELL", "CHORLEY", "COLCHESTER", "COVENTRY", "CRICKLEWOOD", "DARTFORD", 
    "DERBY", "DUDLEY", "DUNDEE", "EASTBOURNE", "EINDHOVEN", "ENFIELD", "EPSOM", "EXETER", 
    "FARNHAM", "FINCHLEY", "FULHAM", "HAMILTON", "HAMPTON", "HARLOW", "HARROGATE", "HESTON", 
    "HULL", "IPSWICH", "KENSINGTON", "KIDBROOKE", "KINGSTON", "KNOWSLEY", "LEEDS", "LEICESTER", 
    "LICHFIELD", "LINCOLN", "LUTON", "MAIDENHEAD", "MALAGA", "MODENA", "NEWBURY", "NEWCASTLE", 
    "NORTHWOOD", "NOTTINGHAM", "OXFORD", "PETERBOROUGH", "PLYMOUTH", "POOLE", "PRESTON", 
    "PURLEY", "READING", "RINGWOOD", "ROMFORD", "RUGBY", "SALFORD", "SERRANO", "SHAWFAIR", 
    "SHEFFIELD", "SIDCUP", "SLOUGH", "SOUTHEND", "SPEKE", "STAFFORD", "STEVENAGE", "STOCKPORT", 
    "STOKE", "STRATFORD", "SUNDERLAND", "SUTTON", "SWANSEA", "SWINDON", "TAUNTON", "TELFORD", 
    "TORQUAY", "WAKEFIELD", "WALSALL", "WARRINGTON", "WATFORD", "WICKWOODS", "WIGAN", 
    "WIMBLEDON", "WINCHESTER", "WINDSOR", "WOKING", "WOLVERHAMPTON", "WORCESTER", "WORTHING", 
    "YORK", "ZARAGOZA"
  ];

  for (const city of directCities) {
    if (lower.includes(city.toLowerCase())) {
      return city;
    }
  }

  // Split by hyphens or underscores
  const parts = clean.split(/[-_]/);
  if (parts.length >= 2) {
    const rawCode = parts[1].trim().toUpperCase();
    if (rawCode.length > 0 && !/^\d+$/.test(rawCode)) {
      return rawCode;
    }
  }

  if (parts.length === 1 && parts[0].length > 0) {
    return parts[0].trim().toUpperCase();
  }

  return "GENERAL";
}

/**
 * Formats a site code into a clean, human-readable site title
 */
export function formatSiteDisplayName(siteCode: string): string {
  if (!siteCode || siteCode === "UNASSIGNED") return "Unassigned / IP Only";
  
  // Custom display overrides for compound names
  const customNames: Record<string, string> = {
    "ROYALBERKSHIRE": "Royal Berkshire",
    "CHESHIREOAKS": "Cheshire Oaks",
    "COLLIERSWOOD": "Colliers Wood",
    "EMERSONSGREEN": "Emersons Green",
    "GIDEAPARK": "Gidea Park",
    "HERNEBAY": "Herne Bay",
    "KINGSHILL": "Kings Hill",
    "LAFINCA": "La Finca",
    "MILTONKEYNES": "Milton Keynes",
    "NOTTINGHILL": "Notting Hill Harbour Club",
    "PORTSOLENT": "Port Solent",
    "RAYNESPARK": "Raynes Park",
    "SUDBURYHILL": "Sudbury Hill",
    "WESTBRIDGFORD": "West Bridgford",
    "BADHOMBURG": "Bad Homburg",
    "BURYSTEDMUNDS": "Bury St Edmunds",
    "GAVAMAR": "Gava Mar",
    "GLASGOW-ROUKEN-GLEN": "Glasgow Rouken Glen",
    "GLASGOW-RENFREW": "Glasgow Renfrew",
    "GLASGOW-WEST-END": "Glasgow West End",
    "GENEVA-CITY-GREEN": "Geneva City Green",
    "GENEVA-CC": "Geneva CC",
    "BRISTOL-LA": "Bristol Long Ashton",
    "BRISTOL-WESTBURY": "Bristol Westbury",
    "SOUTHAMPTON-WEST-END": "Southampton West End",
    "EDINBURGH-NEWHAVEN": "Edinburgh Newhaven Harbour",
    "STERREBEEK": "Sterrebeek",
    "SOLIHULL": "Solihull Cranmore",
    "TEESSIDE": "Teesside",
    "GLOUCESTERSHIRE": "Gloucestershire",
    "MANCHESTER-NORTH": "Manchester North",
    "BLIJDORP": "Rotterdam Blijdorp",
    "ROTTERDAM": "Rotterdam (Akragon)",
  };

  if (customNames[siteCode]) {
    return customNames[siteCode];
  }

  // General formatting: Replace hyphens with space and Title Case
  return siteCode
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Returns ALL 130+ estate sites from KNOWN_SITE_DIAGRAMS, diagrams folder, and switch inventory
 */
export function getAllEstateSites(switches: SwitchItem[] = []): Record<string, SiteGroup> {
  const groups: Record<string, SiteGroup> = {};

  // 1. First seed with all known site diagram definitions (130+ Visio workbooks)
  for (const item of KNOWN_SITE_DIAGRAMS) {
    const code = extractSiteCode(item.id || item.cleanName || item.siteName);
    if (!groups[code]) {
      const diagPath = getDiagramPngPathForSite(code) || getDiagramPngPathForSite(item.siteName);
      groups[code] = {
        siteCode: code,
        siteName: formatSiteDisplayName(code),
        switches: [],
        totalCount: 0,
        backedUpCount: 0,
        unreachableCount: 0,
        hasDiagram: Boolean(diagPath),
        diagramPath: diagPath,
        sourceWorkbook: item.sourceFile,
        tabName: item.tabName
      };
    }
  }

  // 2. Also ensure all diagram PNG files have a corresponding site
  for (const [slug, filename] of Object.entries(SITE_DIAGRAM_FILES)) {
    const code = extractSiteCode(slug);
    if (!groups[code]) {
      groups[code] = {
        siteCode: code,
        siteName: formatSiteDisplayName(code),
        switches: [],
        totalCount: 0,
        backedUpCount: 0,
        unreachableCount: 0,
        hasDiagram: true,
        diagramPath: `/diagrams/${filename}`,
        sourceWorkbook: "DLC Visio Network Archive",
        tabName: `DLC - ${formatSiteDisplayName(code)}`
      };
    } else {
      groups[code].hasDiagram = true;
      if (!groups[code].diagramPath) {
        groups[code].diagramPath = `/diagrams/${filename}`;
      }
    }
  }

  // 3. Populate switches from the active inventory
  for (const sw of switches) {
    const siteCode = extractSiteCode(sw.hostname || sw.ip);
    if (!groups[siteCode]) {
      const diagPath = getDiagramPngPathForSite(siteCode);
      groups[siteCode] = {
        siteCode,
        siteName: formatSiteDisplayName(siteCode),
        switches: [],
        totalCount: 0,
        backedUpCount: 0,
        unreachableCount: 0,
        hasDiagram: Boolean(diagPath),
        diagramPath: diagPath,
      };
    }
    groups[siteCode].switches.push(sw);
    groups[siteCode].totalCount += 1;
    if (sw.lastBackupStatus === "Success") {
      groups[siteCode].backedUpCount += 1;
    } else {
      groups[siteCode].unreachableCount += 1;
    }
  }

  return groups;
}

/**
 * Backward compatibility wrapper
 */
export function groupSwitchesBySite(switches: SwitchItem[]): Record<string, SiteGroup> {
  return getAllEstateSites(switches);
}
