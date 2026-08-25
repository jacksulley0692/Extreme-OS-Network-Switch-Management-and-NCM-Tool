// src/utils/siteHierarchy.ts
import { SwitchItem } from "../types";

export interface SiteGroup {
  siteCode: string; // e.g. "LEEDS", "LEICESTER", "LICHFIELD", "LINCOLN", "MADRID"
  siteName: string; // Formatted display name
  switches: SwitchItem[];
  totalCount: number;
  backedUpCount: number;
  unreachableCount: number;
}

/**
 * Extracts the site identifier from the 2nd hyphenated segment of any length.
 * Examples matching real switch fleet:
 * - 'DLL-Leeds-SubRack'       -> 'LEEDS'
 * - 'DLC-Leeds-Lynxight'      -> 'LEEDS'
 * - 'DLC-Leicester-Gym'       -> 'LEICESTER'
 * - 'DL-Lichfield'            -> 'LICHFIELD'
 * - 'DLC-Lichfield-Spa'       -> 'LICHFIELD'
 * - 'DLL-Lincoln-MainComms'   -> 'LINCOLN'
 * - 'DLC-Luton-Subrack'       -> 'LUTON'
 * - 'DLL-Madrid-MainComms'    -> 'MADRID'
 * - 'DLC-Malaspina-Spa'       -> 'MALASPINA'
 * - '10.32.214.253'           -> 'UNASSIGNED' (fallback)
 */
export function extractSiteCode(hostnameOrIp: string): string {
  if (!hostnameOrIp) return "UNASSIGNED";
  
  const clean = hostnameOrIp.trim();
  
  // Known IP subnet mappings
  if (clean.startsWith("10.32.221.") || clean.startsWith("10.32.81.")) return "YORK";
  if (clean.startsWith("10.32.214.")) return "LICHFIELD";
  if (clean.startsWith("10.32.54.")) return "LEEDS";
  if (clean.startsWith("10.32.61.")) return "LEICESTER";
  if (clean.startsWith("10.32.208.")) return "BRISTOL";
  if (clean.startsWith("10.32.227.")) return "BEACONSFIELD";
  if (clean.startsWith("10.32.52.")) return "LINCOLN";
  if (clean.startsWith("10.32.48.")) return "LUTON";

  // Check if it's purely an IP address without known mapping
  const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipRegex.test(clean)) {
    return "UNASSIGNED";
  }

  const lower = clean.toLowerCase();
  if (lower.includes("york")) return "YORK";
  if (lower.includes("lichfield")) return "LICHFIELD";
  if (lower.includes("leeds")) return "LEEDS";
  if (lower.includes("leicester")) return "LEICESTER";
  if (lower.includes("bristol")) return "BRISTOL";
  if (lower.includes("beaconsfield")) return "BEACONSFIELD";
  if (lower.includes("lincoln")) return "LINCOLN";
  if (lower.includes("luton")) return "LUTON";

  // Split by hyphens or underscores
  const parts = clean.split(/[-_]/);
  
  if (parts.length >= 2) {
    const rawCode = parts[1].trim().toUpperCase();
    if (rawCode.length > 0) {
      return rawCode;
    }
  }

  // If only 1 segment (e.g. "LICHFIELD"), use the first segment
  if (parts.length === 1 && parts[0].length > 0) {
    return parts[0].trim().toUpperCase();
  }

  return "GENERAL";
}

/**
 * Formats a site code into a clean, human-readable site title
 * Example: 'LICHFIELD' -> 'Lichfield'
 */
export function formatSiteDisplayName(siteCode: string): string {
  if (!siteCode || siteCode === "UNASSIGNED") return "Unassigned / IP Only";
  // Capitalize first letter of each word
  return siteCode.charAt(0).toUpperCase() + siteCode.slice(1).toLowerCase();
}

/**
 * Groups switches dynamically into site buckets
 */
export function groupSwitchesBySite(switches: SwitchItem[]): Record<string, SiteGroup> {
  const groups: Record<string, SiteGroup> = {};

  for (const sw of switches) {
    const siteCode = extractSiteCode(sw.hostname || sw.ip);
    if (!groups[siteCode]) {
      groups[siteCode] = {
        siteCode,
        siteName: formatSiteDisplayName(siteCode),
        switches: [],
        totalCount: 0,
        backedUpCount: 0,
        unreachableCount: 0,
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
