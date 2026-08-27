/**
 * Master Enterprise Switch Fleet Inventory Data
 * 
 * Contains all 474 switches across all 130+ David Lloyd estate locations,
 * fully populated with reachability status, IP assignments, configs, and ports.
 */

import { SwitchItem } from "../types";
import allFleetJson from "./allFleetSwitches.json";

export const MOCK_SWITCHES: SwitchItem[] = allFleetJson as unknown as SwitchItem[];

// Helper to lookup switch by ID
export function getSwitchById(id: string): SwitchItem | undefined {
  return MOCK_SWITCHES.find(s => s.id === id);
}

// Helper to lookup switches by Site Code
export function getSwitchesBySiteCode(siteCode: string): SwitchItem[] {
  const norm = siteCode.toUpperCase();
  return MOCK_SWITCHES.filter(s => {
    const parts = s.hostname.split(/[-_]/);
    const code = parts.length >= 2 ? parts[1].trim().toUpperCase() : parts[0].trim().toUpperCase();
    return code === norm || s.hostname.toUpperCase().includes(norm);
  });
}
