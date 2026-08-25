import fs from 'fs';
import path from 'path';

// Load switches from mockSwitches and siteDiagramsData to build comprehensive switches_inventory.json
const inventory = [
  // York Switches (Real 4 switches verified from DLC-York topology)
  { id: "sw-york-spa", hostname: "DLC-York-Spa-SW1", ip: "10.32.221.252", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" },
  { id: "sw-york-gym", hostname: "DLC-York-Gym", ip: "10.32.221.250", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" },
  { id: "sw-york-dll", hostname: "DLL-York", ip: "10.32.221.249", os: "EXOS", model: "Summit X450-G2-48p-10G", format: "xsf" },
  { id: "sw-york-maincomms-2", hostname: "DLC-York-MainComms-2", ip: "10.32.221.248", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },

  // Lichfield Switches
  { id: "sw-lichfield-core", hostname: "DLC-Lichfield-Core", ip: "10.32.214.253", os: "VOSS", model: "VSP 4450GSX-PWR+", format: "cfg" },
  { id: "sw-lichfield-spa", hostname: "DLC-Lichfield-Spa", ip: "10.32.214.252", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },
  { id: "sw-lichfield-gym", hostname: "DLC-Lichfield-Gym", ip: "10.32.214.251", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" },

  // Leeds Switches
  { id: "sw-leeds-core", hostname: "DLC-Leeds-Core", ip: "10.32.54.253", os: "VOSS", model: "VSP 4450GSX-PWR+", format: "cfg" },
  { id: "sw-leeds-spa", hostname: "DLC-Leeds-Spa", ip: "10.32.54.250", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },
  { id: "sw-leeds-edge", hostname: "DLL-Leeds-SubRack", ip: "10.32.54.249", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" },

  // Leicester Switches
  { id: "sw-leicester-core", hostname: "DLC-Leicester-Core", ip: "10.32.61.253", os: "VOSS", model: "VSP 4450GSX-PWR+", format: "cfg" },
  { id: "sw-leicester-gym", hostname: "DLC-Leicester-Gym", ip: "10.32.61.252", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },
  { id: "sw-leicester-spa", hostname: "DLC-Leicester-Spa", ip: "10.32.61.251", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" },

  // Bristol Switches
  { id: "sw-bristol-core", hostname: "DLC-Bristol-Core", ip: "10.32.208.253", os: "VOSS", model: "VSP 4450GSX-PWR+", format: "cfg" },
  { id: "sw-bristol-spa", hostname: "DLC-Bristol-Spa", ip: "10.32.208.252", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },
  { id: "sw-bristol-gym", hostname: "DLC-Bristol-Gym", ip: "10.32.208.251", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" },

  // Beaconsfield Switches
  { id: "sw-beaconsfield-core", hostname: "DLC-Beaconsfield-Core", ip: "10.32.227.253", os: "VOSS", model: "VSP 4450GSX-PWR+", format: "cfg" },
  { id: "sw-beaconsfield-spa", hostname: "DLC-Beaconsfield-Spa", ip: "10.32.227.251", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },
  { id: "sw-beaconsfield-gym", hostname: "DLC-Beaconsfield-Gym", ip: "10.32.227.252", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" },
  { id: "sw-beaconsfield-edge", hostname: "DLL-Beaconsfield", ip: "10.32.227.248", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },

  // Lincoln Switches
  { id: "sw-lincoln-core", hostname: "DLC-Lincoln-Core", ip: "10.32.52.253", os: "VOSS", model: "VSP 4450GSX-PWR+", format: "cfg" },
  { id: "sw-lincoln-spa", hostname: "DLL-Lincoln-MainComms", ip: "10.32.52.252", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },

  // Luton Switches
  { id: "sw-luton-core", hostname: "DLC-Luton-Core", ip: "10.32.48.253", os: "VOSS", model: "VSP 4450GSX-PWR+", format: "cfg" },
  { id: "sw-luton-spa", hostname: "DLC-Luton-Spa", ip: "10.32.48.250", os: "EXOS", model: "Summit X440-G2-48p-10G", format: "xsf" },
  { id: "sw-luton-gym", hostname: "DLC-Luton-Gym", ip: "10.32.48.251", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" },
  { id: "sw-luton-edge", hostname: "DLC-Luton-Subrack", ip: "10.32.48.249", os: "EXOS", model: "Summit X440-G2-24p-10G", format: "xsf" }
];

fs.writeFileSync('switches_inventory.json', JSON.stringify(inventory, null, 2), 'utf-8');
console.log(`Saved ${inventory.length} curated switch entries to switches_inventory.json`);
