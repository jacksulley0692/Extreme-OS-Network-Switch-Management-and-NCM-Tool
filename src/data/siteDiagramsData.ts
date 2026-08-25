/**
 * ============================================================================
 * 📌 DEVELOPER GUIDE: HOW TO ADD OR UPDATE SITE DIAGRAMS & TOPOLOGY MAPPINGS
 * ============================================================================
 * 
 * 1. ADDING A NEW SITE TO THE REGISTRY:
 *    Add an entry to `KNOWN_SITE_DIAGRAMS` below with the following fields:
 *    - `id`: Unique lowercase URL-safe slug (e.g. 'leeds', 'birmingham-central')
 *    - `siteName`: Human-readable name (e.g. 'Leeds', 'Birmingham Central')
 *    - `sourceFile`: Visio file name ('DLC.vsdx', 'DLC 2.vsdx', or 'DLC 3.vsdx')
 *    - `tabName`: Exact tab name in the Visio workbook
 *    - `cleanName`: Normalized name for searching and breadcrumbs
 *    - `diagramUrl`: Image or SVG route ('/api/diagram/leeds')
 *    - `type`: 'vector' | 'svg' | 'png' | 'pdf'
 *    - `associatedHostnames`: Array of switch hostnames mapped to this site
 *    - `switchIps`: (Optional) Array of management IP addresses
 * 
 * 2. ADDING A CUSTOM 1:1 SVG TOPOLOGY DIAGRAM (Like York):
 *    - Create a new file in `/src/data/<site>DiagramSvg.ts` (e.g. `leedsDiagramSvg.ts`).
 *    - Export a constant with the SVG string: `export const LEEDS_DIAGRAM_SVG = \`<svg>...</svg>\`;`
 *    - Import and render it in `SiteDiagramViewer.tsx` and `SitePageView.tsx`.
 * ============================================================================
 */

export interface SiteDiagram {
  id: string;
  siteName: string;
  sourceFile: string;
  tabName: string;
  cleanName: string;
  diagramUrl: string;
  type: "svg" | "png" | "pdf" | "vector";
  switchIps?: string[];
  associatedHostnames?: string[];
}

export const KNOWN_SITE_DIAGRAMS: SiteDiagram[] = [
  // DLC 1
  { id: "shrewsbury", siteName: "Shrewsbury", sourceFile: "DLC.vsdx", tabName: "DLC - Shrewsbury", cleanName: "Shrewsbury", diagramUrl: "/api/diagram/shrewsbury", type: "vector", associatedHostnames: ["DLC-Shrewsbury-Main", "DLC-Shrewsbury-Spa", "DLC-Shrewsbury-Gym", "DLC-Shrewsbury-Wifi", "DLC-Shrewsbury-MXP", "DLC-Shrewsbury-MXS"] },
  { id: "amsterdam", siteName: "Amsterdam", sourceFile: "DLC.vsdx", tabName: "DLC - Amsterdam", cleanName: "Amsterdam", diagramUrl: "/api/diagram/amsterdam", type: "vector", associatedHostnames: ["DLC-Amsterdam-48p.8", "DLC-Amsterdam-Spa", "DLC-Amsterdam-MainComm-2", "Amsterdam-MXP", "Amsterdam-MXS"] },
  { id: "basildon", siteName: "Basildon", sourceFile: "DLC.vsdx", tabName: "DLC - Basildon", cleanName: "Basildon", diagramUrl: "/api/diagram/basildon", type: "vector", associatedHostnames: ["DLC-Basildon.4", "DLC-Basildon-Gym", "DLC-Basildon-Lynxight.3", "Basildon-MXP", "Amsterdam-MXP"] },
  { id: "barcelona", siteName: "Barcelona", sourceFile: "DLC.vsdx", tabName: "DLC - Barcelona", cleanName: "Barcelona", diagramUrl: "/api/diagram/barcelona", type: "vector", associatedHostnames: ["DLC-Beckenham", "DLL-Bar-Gym24", "DLC-Turo-Lynxight", "DLLBarcelona", "Turo-MXP"] },
  { id: "beckenham", siteName: "Beckenham", sourceFile: "DLC.vsdx", tabName: "DLC - Beckenham", cleanName: "Beckenham", diagramUrl: "/api/diagram/beckenham", type: "vector", associatedHostnames: ["DLC-Beckenham", "DLC-Beckenham-MainComms-2", "DLC-Beckenham-Spa", "DLLBeckenham", "DLC-Beckenham-Lynxight", "Beckenham-MXP"] },
  { id: "belfast", siteName: "Belfast", sourceFile: "DLC.vsdx", tabName: "DLC-Belfast", cleanName: "Belfast", diagramUrl: "/api/diagram/belfast", type: "vector", associatedHostnames: ["DLC-Belfast-MainComms-2", "DLC-Belfast-Lynxight", "DLC-Belfast-MainComms-1", "Belfast-MXP", "Belfast-MXS"] },
  { id: "birmingham", siteName: "Birmingham", sourceFile: "DLC.vsdx", tabName: "DLC-Birmingham", cleanName: "Birmingham", diagramUrl: "/api/diagram/birmingham", type: "vector", associatedHostnames: ["DLL-Birmingham-Comms", "DLC-Birmingham-Lynxight", "DLLBirmingham", "Birmingham-MXP", "Birmingham-MXS"] },
  { id: "bolton", siteName: "Bolton", sourceFile: "DLC.vsdx", tabName: "DLC - Bolton", cleanName: "Bolton", diagramUrl: "/api/diagram/bolton", type: "vector", associatedHostnames: ["DLC-Bolton-MainComms-2", "DLL-Bolton-Comms", "DLC-Bolton-Lnyxight", "Bolton-MXP", "Bolton-MXS"] },
  { id: "brighton", siteName: "Brighton", sourceFile: "DLC.vsdx", tabName: "DLC - Brighton", cleanName: "Brighton", diagramUrl: "/api/diagram/brighton", type: "vector", associatedHostnames: ["DLC-Brighton", "DLC-Brighton-MainComms-2", "DLC-Brighton-subrack", "Brighton-MXP", "Brighton-MXS"] },
  { id: "bristol-la", siteName: "Bristol LA", sourceFile: "DLC.vsdx", tabName: "DLC-Bristol-LA", cleanName: "Bristol-LA", diagramUrl: "/api/diagram/bristol-la", type: "vector", associatedHostnames: ["DLL-Bristol-LA-MainComms-2", "DLL-Bristol-LA-MainComms", "DLLBristolLongAshton", "Bristol_Long_Ashton-MXS", "Bristol_Long_Ashton-MXP"] },
  { id: "bristol-westbury", siteName: "Bristol Westbury", sourceFile: "DLC.vsdx", tabName: "DLC-Bristol-Westbury", cleanName: "Bristol-Westbury", diagramUrl: "/api/diagram/bristol-westbury", type: "vector", associatedHostnames: ["DLL-BristolWestbury", "DLC-Bristol-Westbury-Gym", "DLC-Bristol-Westbury-Gym-2", "DLLBristolWestbury-HP", "Bristol_Westbury-MXP", "Bristol_Westbury-MXS"] },
  { id: "bromsgrove", siteName: "Bromsgrove", sourceFile: "DLC.vsdx", tabName: "DLC-Bromsgrove", cleanName: "Bromsgrove", diagramUrl: "/api/diagram/bromsgrove", type: "vector", associatedHostnames: ["DLC-Bromsgrove", "DLC-Bromsgrove-Gym-Subrack", "DLC-Bromsgrove-Lynxight", "Bromsgrove-MXS", "Bromsgrove-MXP"] },
  { id: "brooklands", siteName: "Brooklands", sourceFile: "DLC.vsdx", tabName: "DLC-Brooklands", cleanName: "Brooklands", diagramUrl: "/api/diagram/brooklands", type: "vector", associatedHostnames: ["DLC-Brooklands", "DLC-Brooklands-Lynxight", "DLC-Brooklands-Spa", "DLL-Brooklands", "Brooklands-MXS", "Brooklands-MXP"] },
  { id: "brussels", siteName: "Brussels", sourceFile: "DLC.vsdx", tabName: "DLC-Brussles", cleanName: "Brussels", diagramUrl: "/api/diagram/brussels", type: "vector", associatedHostnames: ["DLL-Brussels-MAIN", "DLC-Brussels-Gym", "DLC-Brussels-New", "DLC-Brussels-B19-FirstFloor", "DLC-Brussels-B19", "DLL-Brussels-MXS", "DLL-Brussels-MXP"] },
  { id: "bushey", siteName: "Bushey", sourceFile: "DLC.vsdx", tabName: "DLC-Bushey", cleanName: "Bushey", diagramUrl: "/api/diagram/bushey", type: "vector", associatedHostnames: ["DLC-Bushey-MainComms", "DLL-Bushey-MainExtreme", "DLC-Bushey-Subrack", "Bushey-MXS", "Bushey-MXP"] },
  { id: "cambridge", siteName: "Cambridge", sourceFile: "DLC.vsdx", tabName: "DLC-Cambridge", cleanName: "Cambridge", diagramUrl: "/api/diagram/cambridge", type: "vector", associatedHostnames: ["BLC-Cambridge-MainComms-2", "DLC-Cambridge-Gym", "DLL-Cambridge", "DLC-Cambridge-Lynxight", "Cambridge-MXS", "Cambridge-MXP"] },
  { id: "capelle", siteName: "Capelle", sourceFile: "DLC.vsdx", tabName: "DLC-Capelle", cleanName: "Capelle", diagramUrl: "/api/diagram/capelle", type: "vector", associatedHostnames: ["DLC-Capelle", "DLC-Capelle-MainComms-2", "Capelle-MXP", "Capelle-MXS"] },
  { id: "cardiff", siteName: "Cardiff", sourceFile: "DLC.vsdx", tabName: "DLC-Cardiff", cleanName: "Cardiff", diagramUrl: "/api/diagram/cardiff", type: "vector", associatedHostnames: ["DLC-Cardiff-MainComms-2", "DLL-Cardiff-Maincomms", "DLL-Cardiff", "DLC-Cardiff-Lynxight", "Cardiff-MXS", "Cardiff-MXP"] },
  { id: "cheadle", siteName: "Cheadle", sourceFile: "DLC.vsdx", tabName: "DLC-Cheadle", cleanName: "Cheadle", diagramUrl: "/api/diagram/cheadle", type: "vector", associatedHostnames: ["DLC-Cheadle-X440", "DLL-Cheadle-X440-24P", "CheadleSubRack", "DLL-Cheadle-Stack", "DLC-Cheadle-Lynxight", "Cheadle-MXS", "Cheadle-MXP"] },
  { id: "cheam", siteName: "Cheam", sourceFile: "DLC.vsdx", tabName: "DLC-Cheam", cleanName: "Cheam", diagramUrl: "/api/diagram/cheam", type: "vector", associatedHostnames: ["DLC-Cheam", "DLL-Cheam", "DLC-Cheam-Lynxight", "Cheam-MXS", "Cheam-MXP"] },
  { id: "cheshire-oaks", siteName: "Cheshire Oaks", sourceFile: "DLC.vsdx", tabName: "DLC - Cheshire Oaks", cleanName: "Cheshire-Oaks", diagramUrl: "/api/diagram/cheshire-oaks", type: "vector", associatedHostnames: ["Cheshire_Oaks-MXP", "DLC-CheshireOaks-Lynxigh", "DLC-CheshireOaks-Gym-Sub", "DLC-CheshireOaks-Spa", "Cheadle-MXP"] },
  { id: "chigwell", siteName: "Chigwell", sourceFile: "DLC.vsdx", tabName: "DLC-Chigwell", cleanName: "Chigwell", diagramUrl: "/api/diagram/chigwell", type: "vector", associatedHostnames: ["DLL-Chigwell-Stack", "Chigwell-MXS", "Chigwell-MXP"] },
  { id: "chorley", siteName: "Chorley", sourceFile: "DLC.vsdx", tabName: "DLC-Chorley", cleanName: "Chorley", diagramUrl: "/api/diagram/chorley", type: "vector", associatedHostnames: ["DLL-Chorley-MainComms", "DLC-Chorley-Lynxight", "Chorley-MXP", "Chorley-MXS"] },
  { id: "colchester", siteName: "Colchester", sourceFile: "DLC.vsdx", tabName: "DLC- Colchester", cleanName: "Colchester", diagramUrl: "/api/diagram/colchester", type: "vector", associatedHostnames: ["COLCHESTER-SW01"] },
  { id: "coventry", siteName: "Coventry", sourceFile: "DLC.vsdx", tabName: "DLC-Coventry", cleanName: "Coventry", diagramUrl: "/api/diagram/coventry", type: "vector", associatedHostnames: ["DLC-Coventry-X440", "DLC-Coventry-Main", "DLC-Coventry-Lynxight", "DLC-Coventry-Spa", "Coventry-MXP", "Coventry-MXS"] },
  { id: "dartford", siteName: "Dartford", sourceFile: "DLC.vsdx", tabName: "DLC-Dartford", cleanName: "Dartford", diagramUrl: "/api/diagram/dartford", type: "vector", associatedHostnames: ["DLC-Dartford-X440-Main", "DLC-Dartford-X440-2", "DLC-Dartford-Gym", "DLC-Dartford-X440-3", "Dartford-MXP", "Dartford-MXS"] },
  { id: "derby", siteName: "Derby", sourceFile: "DLC.vsdx", tabName: "DLC-Derby", cleanName: "Derby", diagramUrl: "/api/diagram/derby", type: "vector", associatedHostnames: ["DLC-Derby-MainComms", "DLC-Derby-Subrack", "Derby-MXP", "Derby-MXS"] },
  { id: "dudley", siteName: "Dudley", sourceFile: "DLC.vsdx", tabName: "DLC-Dudley", cleanName: "Dudley", diagramUrl: "/api/diagram/dudley", type: "vector", associatedHostnames: ["DLC-Dudley-MainComms", "DLC-Dudley-Gym", "DLL-DudleyWiFiSwitch", "dll-dudley", "DLC-Dudley-Lynxight", "Dudley-MXP", "Dudley-MXS"] },
  { id: "dundee", siteName: "Dundee", sourceFile: "DLC.vsdx", tabName: "DLC-Dundee", cleanName: "Dundee", diagramUrl: "/api/diagram/dundee", type: "vector", associatedHostnames: ["DLL-Dundee-MainComms", "DLC-Dundee-Lynxight", "Dundee-MXP", "Dundee-MXS"] },
  { id: "eastbourne", siteName: "Eastbourne", sourceFile: "DLC.vsdx", tabName: "DLC-Eastbourne", cleanName: "Eastbourne", diagramUrl: "/api/diagram/eastbourne", type: "vector", associatedHostnames: ["DLL-Eastbourne", "DLC-Eastbourne-Reception", "DLC-Eastbourne-Lynxight", "Eastbourne-MXP", "Eastbourne-MXS"] },
  { id: "edinburgh", siteName: "Edinburgh", sourceFile: "DLC.vsdx", tabName: "DLC-Edinburgh", cleanName: "Edinburgh", diagramUrl: "/api/diagram/edinburgh", type: "vector", associatedHostnames: ["DLC-Edinburgh-MainComms-2", "DLL-Edinburgh", "DLC-Edinburgh-Lynxight", "Edinburgh-MXP", "Edinburgh-MXS"] },
  { id: "eindhoven", siteName: "Eindhoven", sourceFile: "DLC.vsdx", tabName: "DLC-Eindhoven", cleanName: "Eindhoven", diagramUrl: "/api/diagram/eindhoven", type: "vector", associatedHostnames: ["DLC-Veldhoven", "NL-Eindhoven-MXP", "NL-Eindhoven-MXS"] },
  { id: "emersons-green", siteName: "Emersons Green", sourceFile: "DLC.vsdx", tabName: "DLC-EmersonsGreen", cleanName: "Emersons-Green", diagramUrl: "/api/diagram/emersons-green", type: "vector", associatedHostnames: ["DLC-EmersonsGreen", "Emerson_Green-MXP", "Emerson_Green-MXS"] },
  { id: "epsom", siteName: "Epsom", sourceFile: "DLC.vsdx", tabName: "DLC-Epsom", cleanName: "Epsom", diagramUrl: "/api/diagram/epsom", type: "vector", associatedHostnames: ["DLC-Epsom", "DLC-Epsom-Lynxight", "Epsom-MXP", "Epsom-MXS"] },
  { id: "exeter", siteName: "Exeter", sourceFile: "DLC.vsdx", tabName: "DLC-Exeter", cleanName: "Exeter", diagramUrl: "/api/diagram/exeter", type: "vector", associatedHostnames: ["DLL-Exeter", "DLC-Exeter-MainComms-2", "DLC-Exeter-Gym", "DLC-Exeter-Spa", "Epsom-MXP", "Epsom-MXS"] },
  { id: "finchley", siteName: "Finchley", sourceFile: "DLC.vsdx", tabName: "DLC - Finchley", cleanName: "Finchley", diagramUrl: "/api/diagram/finchley", type: "vector", associatedHostnames: ["DLC-Finchley-MainComms-2", "DLC-Finchley-Gym", "DLC-Finchley-Spa", "DLL-Finchley", "Finchley-MXP", "Finchley-MXS"] },
  { id: "farnham", siteName: "Farnham", sourceFile: "DLC.vsdx", tabName: "DLC - Farnham", cleanName: "Farnham", diagramUrl: "/api/diagram/farnham", type: "vector", associatedHostnames: ["DLC-Farnham-MainComms-2", "DLC-Farnham-Lynxight", "DLC-Farnham-Subrack", "Farnham-MXP", "Farnham-MXS"] },
  { id: "fulham", siteName: "Fulham", sourceFile: "DLC.vsdx", tabName: "DLC - Fulham", cleanName: "Fulham", diagramUrl: "/api/diagram/fulham", type: "vector", associatedHostnames: ["DLC-Fulham", "DLC-Fulham-Spa", "DLC-Fulham-Lynxight", "Fulham-MXP", "Fulham-MXS"] },
  { id: "geneva-city-green", siteName: "Geneva City Green", sourceFile: "DLC.vsdx", tabName: "DLC - Geneva City Green", cleanName: "Geneva-City-Green", diagramUrl: "/api/diagram/geneva-city-green", type: "vector", associatedHostnames: ["DLC-Geneva-Top", "DLC-Geneva-Bottom", "DLC-Geneva-CityGreen-Lynxight", "Geneva-MXP", "Geneva-MXS"] },
  { id: "gidea-park", siteName: "Gidea Park", sourceFile: "DLC.vsdx", tabName: "DLC - Gidea Park", cleanName: "Gidea-Park", diagramUrl: "/api/diagram/gidea-park", type: "vector", associatedHostnames: ["DLC-GideaPark-MainComms-2", "DLC-GideaPark-Lynxight", "DLL-GideaPark-MainComms", "Gidea_Park-MXP", "Gidea_Park-MXS"] },
  { id: "glasgow-west-end", siteName: "Glasgow West End", sourceFile: "DLC.vsdx", tabName: "DLC - Glasgow West End", cleanName: "Glasgow-West-End", diagramUrl: "/api/diagram/glasgow-west-end", type: "vector", associatedHostnames: ["DLC-Glasgow-WE-Main-1", "DLC-Glasgow-WE-Membership", "DLC-Glasgow-WE-Main-2", "DLC-Glasgow-WE-Sales", "Glasgow_West_End-MXP", "Glasgow_West_End-MXS"] },
  { id: "glasgow-rouken-glen", siteName: "Glasgow Rouken Glen", sourceFile: "DLC.vsdx", tabName: "DLC - Glasgow Rouken Glen", cleanName: "Glasgow-Rouken-Glen", diagramUrl: "/api/diagram/glasgow-rouken-glen", type: "vector", associatedHostnames: ["Rouken-48P", "DLL-RoukenGlen-NEW", "DLL-Rouken-Golf", "DLL-Rouken", "DLC-RoukenGlen-Lynxight", "Rouken_Glen-MXP", "Rouken_Glen-MXS"] },
  { id: "glasgow-renfrew", siteName: "Glasgow Renfrew", sourceFile: "DLC.vsdx", tabName: "DLC - Glasgow Renfrew", cleanName: "Glasgow-Renfrew", diagramUrl: "/api/diagram/glasgow-renfrew", type: "vector", associatedHostnames: ["DLL-Renfrew", "DLC-Renfrew-Lynxight", "Renfrew-MXP", "Renfrew-MXS"] },
  { id: "gloucestershire", siteName: "Gloucestershire", sourceFile: "DLC.vsdx", tabName: "DLC - Gloucestshire", cleanName: "Gloucestershire", diagramUrl: "/api/diagram/gloucestershire", type: "vector", associatedHostnames: ["DLC-Gloucester-Main-Comms", "DLC-Gloucestershire-AV", "DLC-Gloucestershire-Spa", "DLC-Gloucester-Main-Comms-2", "DLC-Gloucester-Lynxight", "Gloucester-MXP", "Gloucester-MXS"] },
  { id: "hamilton", siteName: "Hamilton", sourceFile: "DLC.vsdx", tabName: "DLC - Hamilton", cleanName: "Hamilton", diagramUrl: "/api/diagram/hamilton", type: "vector", associatedHostnames: ["DL-Hamilton", "DLC-Hamilton-Lynxight", "DLC-Hamilton-MainComms", "Hamilton-MXP", "Hamilton-MXS"] },
  { id: "hampton", siteName: "Hampton", sourceFile: "DLC.vsdx", tabName: "DLC - Hampton", cleanName: "Hampton", diagramUrl: "/api/diagram/hampton", type: "vector", associatedHostnames: ["DLC-Hampton-1", "DLC-Hampton-Boardroom", "DLC-Hampton-2", "DLC-Hampton-X440-48p-SubRack", "Hampton-MXP", "Hampton-MXS"] },
  { id: "harrogate", siteName: "Harrogate", sourceFile: "DLC.vsdx", tabName: "DLC - Harrogate", cleanName: "Harrogate", diagramUrl: "/api/diagram/harrogate", type: "vector", associatedHostnames: ["DLL-Harrogate", "DLC-Harrogate-Subrack-2", "NewComms", "DLC-Harrogate-Lnyxight", "Harrogate-MXP", "Harrogate-MXS"] },
  { id: "heston", siteName: "Heston", sourceFile: "DLC.vsdx", tabName: "DLC - Heston", cleanName: "Heston", diagramUrl: "/api/diagram/heston", type: "vector", associatedHostnames: ["DLL-Heston-MainComms", "DLL-Heston-Campus", "DLL-Heston-Gym", "DLC-Heston-Lynxight", "Heston-MXP", "Heston-MXS"] },
  { id: "beaconsfield", siteName: "Beaconsfield", sourceFile: "DLC.vsdx", tabName: "DLC - Beaconsfield", cleanName: "Beaconsfield", diagramUrl: "/api/diagram/beaconsfield", type: "vector", associatedHostnames: ["DLC-Beaconsfield-MainComms-2.4", "Beaconsfield-Spa", "Beaconsfield-MXP", "Beaconsfield-MXS"] },
  { id: "hull", siteName: "Hull", sourceFile: "DLC.vsdx", tabName: "DLC - Hull", cleanName: "Hull", diagramUrl: "/api/diagram/hull", type: "vector", associatedHostnames: ["DLC-Beaconsfield-MainComms-2.4", "Hull-MXP", "Hull-MXS"] },

  // DLC 2
  { id: "ipswich", siteName: "Ipswich", sourceFile: "DLC 2.vsdx", tabName: "DLC - Ipswich", cleanName: "Ipswich", diagramUrl: "/api/diagram/ipswich", type: "vector", associatedHostnames: ["DLC-Ipswich-Gym.3", "DLC-Ipswich-Lnyxight", "DLC-Ipswich-MainComms", "Ipswich-MXP", "Ipswich-MXS"] },
  { id: "newbury", siteName: "Newbury", sourceFile: "DLC 2.vsdx", tabName: "DLC - Newbury", cleanName: "Newbury", diagramUrl: "/api/diagram/newbury", type: "vector", associatedHostnames: ["DLL-Newbury-Stack.4", "Newbury-MXP", "Newbury-MXS"] },
  { id: "kensington", siteName: "Kensington", sourceFile: "DLC 2.vsdx", tabName: "DLC - Kensington", cleanName: "Kensington", diagramUrl: "/api/diagram/kensington", type: "vector", associatedHostnames: ["DLL-Kensington-MainRack", "DLL-Kensington-B2", "DLL-Kensington-MainRack-2", "Kensington-MXP", "Kensington-MXS"] },
  { id: "kidbrooke", siteName: "Kidbrooke", sourceFile: "DLC 2.vsdx", tabName: "DLC - Kidbrooke", cleanName: "Kidbrooke", diagramUrl: "/api/diagram/kidbrooke", type: "vector", associatedHostnames: ["DLL-Kidbrooke-MainRack", "DLC-Kidbrooke-Lynxight", "DLL-Kidbrooke-SubRack", "DLL-Kidbrooke-MainRack-2", "Kidbrooke_Village-MXP", "Kidbrooke_Village-MXS"] },
  { id: "kings-hill", siteName: "Kings Hill", sourceFile: "DLC 2.vsdx", tabName: "DLC - KingsHill", cleanName: "Kings-Hill", diagramUrl: "/api/diagram/kings-hill", type: "vector", associatedHostnames: ["DLL-KingsHill-MainRack", "DLC-KingsHill-Lynxight", "Kings_Hill-MXP", "Kings_Hill-MXS"] },
  { id: "kingston", siteName: "Kingston", sourceFile: "DLC 2.vsdx", tabName: "DLC-Kingston", cleanName: "Kingston", diagramUrl: "/api/diagram/kingston", type: "vector", associatedHostnames: ["DLC-Kingston", "DLC-Kingston-Lynxight", "DLC-Kingston-Gym", "Kingston-MXP", "Kingston-MXS"] },
  { id: "knowsley", siteName: "Knowsley", sourceFile: "DLC 2.vsdx", tabName: "DLC - Knowsley", cleanName: "Knowsley", diagramUrl: "/api/diagram/knowsley", type: "vector", associatedHostnames: ["DLC-Knowsley-MainComms-2", "DLC-Knowsley-Lynxight", "DLL-Knowsley-MainComms", "Knowsley-MXP", "Knowsley-MXS"] },
  { id: "leeds", siteName: "Leeds", sourceFile: "DLC 2.vsdx", tabName: "DLC - Leeds", cleanName: "Leeds", diagramUrl: "/api/diagram/leeds", type: "vector", switchIps: ["10.36.226.11", "10.32.54.249"], associatedHostnames: ["DLC-Leeds-MainComms-2", "DLL-Leeds-SubRack", "DLL-Leeds-Subrack-X440-4", "DLC-Leeds-Lynxight", "DLL-Leeds", "Leeds-MXP", "Leeds-MXS"] },
  { id: "leicester", siteName: "Leicester", sourceFile: "DLC 2.vsdx", tabName: "DLC - Leicester", cleanName: "Leicester", diagramUrl: "/api/diagram/leicester", type: "vector", associatedHostnames: ["DLC-Leicester-MainComms", "DLC-Leicester-Gym", "DLLLeicester", "DLC-Leicester-Lynxight", "Leicester-MXP", "Leicester-MXS"] },
  { id: "lichfield", siteName: "Lichfield", sourceFile: "DLC 2.vsdx", tabName: "DLC - Lichfield", cleanName: "Lichfield", diagramUrl: "/api/diagram/lichfield", type: "vector", associatedHostnames: ["DL-Lichfield", "DLC-Lichfield-Subrack", "DLL-Lichfield", "DLC-Lichfield-Spa", "Lichfield-MXP", "Lichfield-MXS"] },
  { id: "lincoln", siteName: "Lincoln", sourceFile: "DLC 2.vsdx", tabName: "DLC-Lincoln", cleanName: "Lincoln", diagramUrl: "/api/diagram/lincoln", type: "vector", associatedHostnames: ["DLL-Lincoln-MainComms", "DLL-Lincoln-MainComms-2", "DLL-Lincoln-MainComms-3", "Lincoln-MXP", "Lincoln-MXS"] },
  { id: "luton", siteName: "Luton", sourceFile: "DLC 2.vsdx", tabName: "DLC - Luton", cleanName: "Luton", diagramUrl: "/api/diagram/luton", type: "vector", associatedHostnames: ["DLL-Lincoln-MainComms", "Luton-MXP", "Luton-MXS"] },
  { id: "aravaca", siteName: "Aravaca", sourceFile: "DLC 2.vsdx", tabName: "DLC - Aravaca", cleanName: "Aravaca", diagramUrl: "/api/diagram/aravaca", type: "vector", associatedHostnames: ["DLL-Lincoln-MainComms", "DLL-Madrid", "DLC-Madrid-Lynxight", "DLL-MAD-Bar", "Aravaca-MXP", "Aravaca-MXS"] },
  { id: "malaspain", siteName: "Malaspain", sourceFile: "DLC 2.vsdx", tabName: "DLC - Malaspain", cleanName: "Malaspain", diagramUrl: "/api/diagram/malaspain", type: "vector", associatedHostnames: ["DLC-Malaspina-1", "DLC-Malaspina-2", "DLC-Malaspina-AdminOffice", "DLC-Malaspina-Spa", "Malaspina-MXP", "Malaspina-MXS"] },
  { id: "maidenhead", siteName: "Maidenhead", sourceFile: "DLC 2.vsdx", tabName: "DLC-Maidenhead", cleanName: "Maidenhead", diagramUrl: "/api/diagram/maidenhead", type: "vector", associatedHostnames: ["DLC-Maidenhead", "DLC-Maidenhead-Lynxight", "DLLMaidenhead", "Maidenhead-MXP", "Maidenhead-MXS"] },
  { id: "manchester", siteName: "Manchester", sourceFile: "DLC 2.vsdx", tabName: "DLC - Manchester", cleanName: "Manchester", diagramUrl: "/api/diagram/manchester", type: "vector", switchIps: ["10.36.226.12"], associatedHostnames: ["MANCHESTER-CORE-VSP", "MANCHESTER-EDGE-01"] },
  { id: "manchester-north", siteName: "Manchester North", sourceFile: "DLC 2.vsdx", tabName: "DLC - Manchester-North", cleanName: "Manchester-North", diagramUrl: "/api/diagram/manchester-north", type: "vector", associatedHostnames: ["DL-Manchester-North", "DLC-ManchesterNorth-Lynxight", "DLL-NorthManchester", "Manchester_North-MXP", "Manchester_North-MXS"] },
  { id: "northwood", siteName: "Northwood", sourceFile: "DLC 2.vsdx", tabName: "DLC - Northwood", cleanName: "Northwood", diagramUrl: "/api/diagram/northwood", type: "vector", associatedHostnames: ["DLL-Northwood", "DLC-Northwood-MainComms-2", "DLC-Northwood-Gym", "FemaleChange-X435-24P", "Northwood-MXP", "Northwood-MXS"] },
  { id: "milton-keynes", siteName: "Milton Keynes", sourceFile: "DLC 2.vsdx", tabName: "DLC - Milton Keynes", cleanName: "Milton-Keynes", diagramUrl: "/api/diagram/milton-keynes", type: "vector", associatedHostnames: ["DLC-MiltonKeynes-MC1", "DLC-MiltonKeynes-Spa", "DLC-MiltonKeynes-Office", "DLC-MiltonKeynes-Lynxight", "DLL-MiltonKeynes-HP", "Milton_Keynes-MXP", "Milton_Keynes-MXS"] },
  { id: "narborough", siteName: "Narborough", sourceFile: "DLC 2.vsdx", tabName: "DLC - Narbourgh", cleanName: "Narborough", diagramUrl: "/api/diagram/narborough", type: "vector", associatedHostnames: ["DLC-Narborough", "DLC-Narborough-Gym", "DLC-Narborough-Lynxight", "DLLNarborough", "Narborough-MXP", "Narborough-MXS"] },
  { id: "newcastle", siteName: "Newcastle", sourceFile: "DLC 2.vsdx", tabName: "DLC-Newcastle", cleanName: "Newcastle", diagramUrl: "/api/diagram/newcastle", type: "vector", associatedHostnames: ["DLC-Newcastle", "DLC-Newcastle-MainComms2", "DLLNewcastle", "DLC-Newcastle-Lynxight", "Newcastle-MXP", "Newcastle-MXS"] },
  { id: "edinburgh-newhaven", siteName: "Edinburgh Newhaven Harbour", sourceFile: "DLC 2.vsdx", tabName: "DLC - Edinburgh Newhaven Harbour", cleanName: "Edinburgh-Newhaven", diagramUrl: "/api/diagram/edinburgh-newhaven", type: "vector", associatedHostnames: ["DLC-Newhaven-48", "DLC-Newhaven-Lynxight", "DLLEdinburghNewhaven", "Newhaven-Harbour-MXS", "Newhaven-Harbour-MXP"] },
  { id: "notting-hill", siteName: "Notting Hill Harbour Club", sourceFile: "DLC 2.vsdx", tabName: "DLC - Notting Hill Harbour Club", cleanName: "Notting-Hill", diagramUrl: "/api/diagram/notting-hill", type: "vector", associatedHostnames: ["HC-Nottinghill-Maincomms", "DLLNottingHill", "HC-Nottinghill-Maincomms-2", "HC-NottingHill-Subrack", "DLC-Nottinghill-Lynxight", "Notting_Hill-MXP", "Notting_Hill-MXS"] },
  { id: "nottingham", siteName: "Nottingham", sourceFile: "DLC 2.vsdx", tabName: "DLC-Nottingham", cleanName: "Nottingham", diagramUrl: "/api/diagram/nottingham", type: "vector", associatedHostnames: ["DLC-Nottingham", "DLC-Nottingham-WiFiSwitch", "Nottingham-MXP", "Nottingham-MXS"] },
  { id: "oxford", siteName: "Oxford", sourceFile: "DLC 2.vsdx", tabName: "DLC - Oxford", cleanName: "Oxford", diagramUrl: "/api/diagram/oxford", type: "vector", associatedHostnames: ["OXFORD-CORE"] },
  { id: "peterborough", siteName: "Peterborough", sourceFile: "DLC 2.vsdx", tabName: "DLC - Peterborough", cleanName: "Peterborough", diagramUrl: "/api/diagram/peterborough", type: "vector", associatedHostnames: ["DLC-Peterborough-Core", "DLC-Peterborough-MainComms-2", "DLC-Peterborough-Gym", "DLC-Peterborough-Lynxight", "Peterborough-MXP", "Peterborough-MXS"] },
  { id: "poole", siteName: "Poole", sourceFile: "DLC 2.vsdx", tabName: "DLC - Poole", cleanName: "Poole", diagramUrl: "/api/diagram/poole", type: "vector", associatedHostnames: ["DLC-Poole-Core", "DLC-Poole-Subrack", "DLC-Poole-Gym", "DLC-Poole-Lynxight", "Poole-MXP", "Poole-MXS"] },
  { id: "port-solent", siteName: "Port Solent", sourceFile: "DLC 2.vsdx", tabName: "DLC-PortSolent", cleanName: "Port-Solent", diagramUrl: "/api/diagram/port-solent", type: "vector", associatedHostnames: ["DLC-PortSolent", "DLC-PortSolent-2", "Port_Solent-MXP", "Port_Solent-MXS"] },
  { id: "purley", siteName: "Purley", sourceFile: "DLC 2.vsdx", tabName: "DLC-Purley", cleanName: "Purley", diagramUrl: "/api/diagram/purley", type: "vector", associatedHostnames: ["DLC-Poole-Main-1", "DLL-Purley", "DLC-Purley-Gym", "DLL-Purley-Sub", "DL-Purley", "Purley-MXP", "Purley-MXS"] },
  { id: "raynes-park", siteName: "Raynes Park", sourceFile: "DLC 2.vsdx", tabName: "DLC-Raynes Park", cleanName: "Raynes-Park", diagramUrl: "/api/diagram/raynes-park", type: "vector", associatedHostnames: ["DLL-RaynesPark-MainComms", "DLC-Raynes-Lynxight", "DLL-RaynesPark-GymX48", "DLC-RaynesPark-Spa", "DLC-RayesPark-Office", "Raynes_Park-MXP", "Raynes_Park-MXS"] },
  { id: "reading", siteName: "Reading", sourceFile: "DLC 2.vsdx", tabName: "DLC-Reading", cleanName: "Reading", diagramUrl: "/api/diagram/reading", type: "vector", associatedHostnames: ["DLC-Reading", "Reading-MXP", "Reading-MXS"] },
  { id: "ringwood", siteName: "Ringwood", sourceFile: "DLC 2.vsdx", tabName: "DLC - Ringwood", cleanName: "Ringwood", diagramUrl: "/api/diagram/ringwood", type: "vector", associatedHostnames: ["DLC-Ringwood-SW1", "DLC-Ringwood-SW2", "DLL-Ringwood-Gym", "DLC-Ringwood-Lynxight", "Ringwood-MXP", "Ringwood-MXS"] },
  { id: "royal-berkshire", siteName: "Royal Berkshire", sourceFile: "DLC 2.vsdx", tabName: "DL-RoyalBerkshire", cleanName: "Royal-Berkshire", diagramUrl: "/api/diagram/royal-berkshire", type: "vector", associatedHostnames: ["DL-RoyalBerkshire", "DLC-RoyalBerkshire-Lnyxight", "DL-RBC-48-2", "DL-RBC-24-GYM1", "Royal_Berkshire-MXP", "Royal_Berkshire-MXS"] },
  { id: "blijdorp", siteName: "Rotterdam Blijdorp", sourceFile: "DLC 2.vsdx", tabName: "DLC-Blijdorp Rotterdam", cleanName: "Rotterdam-Blijdorp", diagramUrl: "/api/diagram/blijdorp", type: "vector", associatedHostnames: ["DLC-Blijdorp", "DLC-Blijdorp-Subrack", "Blijdorp-MXS", "Blijdorp-MXP"] },
  { id: "rotterdam-centrum", siteName: "Rotterdam Akragon", sourceFile: "DLC 2.vsdx", tabName: "DLC - Rotterdam - Akragon", cleanName: "Rotterdam-Akragon", diagramUrl: "/api/diagram/rotterdam-centrum", type: "vector", associatedHostnames: ["DLC-RotterdamCentrum", "DLC-Centrum-24port", "Rotterdam_Centrum-MXP", "Rotterdam_Centrum-MXS"] },
  { id: "sidcup", siteName: "Sidcup", sourceFile: "DLC 2.vsdx", tabName: "DLC - Sidcup", cleanName: "Sidcup", diagramUrl: "/api/diagram/sidcup", type: "vector", associatedHostnames: ["DLC-Sidcup-MainComms-2", "DLC-Sidcup-Lynxight", "DLL-Sidcup", "Sidcup-MXP", "Sidcup-MXS"] },
  { id: "solihull-cranmore", siteName: "Solihull Cranmore", sourceFile: "DLC 2.vsdx", tabName: "DLC - Solihull Cranmore", cleanName: "Solihull", diagramUrl: "/api/diagram/solihull-cranmore", type: "vector", associatedHostnames: ["DLL-SolihullCranmore-MainComms", "DLC-SolihullCranmore-Lynxight", "DLLSolihullCranmore", "Solihull_Cranmore-MXS", "Solihull_Cranmore-MXP"] },
  { id: "southampton", siteName: "Southampton", sourceFile: "DLC 2.vsdx", tabName: "DLC - Southampton", cleanName: "Southampton", diagramUrl: "/api/diagram/southampton", type: "vector", associatedHostnames: ["DLL-Southampton-Comms", "DLL-Southampton-Comms-2", "DLC-Southampton-Plant", "DLL-Southampton-X440-G2-24t", "Southampton-MXP", "Southampton-MXS"] },
  { id: "southampton-west-end", siteName: "Southampton West End", sourceFile: "DLC 2.vsdx", tabName: "DLC - Southampton West End", cleanName: "Southampton-West-End", diagramUrl: "/api/diagram/southampton-west-end", type: "vector", associatedHostnames: ["DLC-SWE-MainComms-SW2", "DLC-SWE-MainComms-SW3", "DLC-SWE-MainComms-SW1", "DLC-SWE-CabA-SW1", "DLC-SWE-CabB-SW1", "DLC-SWE-CabC-SW1"] },
  { id: "swansea", siteName: "Swansea", sourceFile: "DLC 2.vsdx", tabName: "DLC - Swansea", cleanName: "Swansea", diagramUrl: "/api/diagram/swansea", type: "vector", associatedHostnames: ["DL-Glamorgan", "DLL-Swansea", "DLC-Swansea-Lynxight", "Swansea-MXP", "Swansea-MXS"] },
  { id: "norwich", siteName: "Norwich", sourceFile: "DLC 2.vsdx", tabName: "DLC-Norwhich", cleanName: "Norwich", diagramUrl: "/api/diagram/norwich", type: "vector", associatedHostnames: ["DLC-Norwich", "DLC-Norwich-Lnyxight", "DLL-Norwich", "DLC-NorwichSubRack", "Norwich-MXS", "Norwich-MXP"] },
  { id: "southend", siteName: "Southend", sourceFile: "DLC 2.vsdx", tabName: "DLC - Southend", cleanName: "Southend", diagramUrl: "/api/diagram/southend", type: "vector", associatedHostnames: ["DLC-Southend", "DLC-Southend-Gym", "DLL-Southend", "DLC-Southend-Lynxight", "Southend-MXP", "Southend-MXS"] },
  { id: "speke", siteName: "Speke", sourceFile: "DLC 2.vsdx", tabName: "DLC - Speke", cleanName: "Speke", diagramUrl: "/api/diagram/speke", type: "vector", associatedHostnames: ["DLC-Speke", "DLC-Speke-Lynxight", "DLL-Speke", "DLC-Speke-Spa", "Speke-MXS", "Speke-MXP"] },
  { id: "stevenage", siteName: "Stevenage", sourceFile: "DLC 2.vsdx", tabName: "DLC - Stevenage", cleanName: "Stevenage", diagramUrl: "/api/diagram/stevenage", type: "vector", associatedHostnames: ["DLC-Stevenage", "DLL-Stevenage", "DLC-Stevenage-Lynxight", "Stevenage-MXP", "Stevenage-MXS"] },
  { id: "sudbury-hill", siteName: "Sudbury Hill", sourceFile: "DLC 2.vsdx", tabName: "DLC - Sudbury Hill", cleanName: "Sudbury-Hill", diagramUrl: "/api/diagram/sudbury-hill", type: "vector", associatedHostnames: ["DLC-SudburyHill", "DLC-SudburyHill-Lynxight", "DLL-SudburyHill", "DLC-SudburyHill-Spa", "Sudbury_Hill-MXP", "Sudbury_Hill-MXS"] },
  { id: "sunderland", siteName: "Sunderland", sourceFile: "DLC 2.vsdx", tabName: "DLC - Sunderland", cleanName: "Sunderland", diagramUrl: "/api/diagram/sunderland", type: "vector", associatedHostnames: ["DLC-Sunderland-MainComms", "DLC-Sunderland-Lynxight", "DLL-Sunderland", "Sunderland-MXP", "Sunderland-MXS"] },
  { id: "swindon", siteName: "Swindon", sourceFile: "DLC 2.vsdx", tabName: "DLC - Swindon", cleanName: "Swindon", diagramUrl: "/api/diagram/swindon", type: "vector", associatedHostnames: ["DLC-Swindon", "DLC-Swindon-Lynxight-1", "DLC-Swindon-Lynxight-2", "Swindon-MXP", "Swindon-MXS"] },
  { id: "teesside", siteName: "Teesside", sourceFile: "DLC 2.vsdx", tabName: "DLC - Teeside", cleanName: "Teesside", diagramUrl: "/api/diagram/teesside", type: "vector", associatedHostnames: ["DLC-Teeside", "DLC-Teeside-2", "DLC-Teeside-3", "Teesside-MXP", "Teesside-MXS"] },
  { id: "warrington", siteName: "Warrington", sourceFile: "DLC 2.vsdx", tabName: "DLC - Warrington", cleanName: "Warrington", diagramUrl: "/api/diagram/warrington", type: "vector", associatedHostnames: ["DLC-Warrington", "DLC-Warrington-Lynxight", "DLL-Warrington", "DLC-Warrington-Lynxight-2", "Warrington-MXP", "Warrington-MXS"] },
  { id: "west-bridgford", siteName: "West Bridgford", sourceFile: "DLC 2.vsdx", tabName: "DLC - West Bridgeford", cleanName: "West-Bridgford", diagramUrl: "/api/diagram/west-bridgford", type: "vector", associatedHostnames: ["DLC-WestBridgford-MainComms", "DLC-WestBridgford-Subrack", "DLL-WestBridgeford", "DLC-WestBridgeford-Lynxight", "West_Bridgford-MXP", "West_Bridgford-MXS"] },

  // DLC 3
  { id: "woking", siteName: "Woking", sourceFile: "DLC 3.vsdx", tabName: "DLC - Woking", cleanName: "Woking", diagramUrl: "/api/diagram/woking", type: "vector", associatedHostnames: ["DLC-Woking", "DLC-Woking-MainComms-2", "DLC-Woking-Lnyxight", "DLLWoking", "Woking-MXP", "Woking-MXS"] },
  { id: "worcester", siteName: "Worcester", sourceFile: "DLC 3.vsdx", tabName: "DLC - Worcester", cleanName: "Worcester", diagramUrl: "/api/diagram/worcester", type: "vector", associatedHostnames: ["DLL-Worcester-X440", "DLC-Worcester-Lynxight", "DLL-Worcester2", "Worcester-MXP"] },
  { id: "worthing", siteName: "Worthing", sourceFile: "DLC 3.vsdx", tabName: "DLC - Worthing", cleanName: "Worthing", diagramUrl: "/api/diagram/worthing", type: "vector", associatedHostnames: ["DLC-Worthing-Core-1", "DLC-Worthing-MainComms-2", "DLC-Worthing-Spa", "DLC-Worthing-Gym", "DLC-Worthing-Lynxight", "Worthing-MXP", "Worthing-MXS"] },
  { id: "york", siteName: "York", sourceFile: "DLC 3.vsdx", tabName: "DLC - York", cleanName: "York", diagramUrl: "/api/diagram/york", type: "vector", associatedHostnames: ["DLC-York-Spa-SW1", "DLC-York-Gym", "DLL-York", "DLC-York-MainComms-2", "York-MXP", "York-MXS"], switchIps: ["10.32.221.252", "10.32.221.250", "10.32.221.249", "10.32.221.248"] },
  { id: "bad-homburg", siteName: "Bad Homburg", sourceFile: "DLC 3.vsdx", tabName: "DLC-Bad-Homburg", cleanName: "Bad-Homburg", diagramUrl: "/api/diagram/bad-homburg", type: "vector", associatedHostnames: ["DLC-Bad-Homburg-Core", "DLC-Bad-Homburg-MainComms-2", "DLC-Bad-Homburg-Fitness", "DLC-Bad-Homburg-Lynxight", "Bad-Homburg-MXP", "Bad-Homburg-MXS"] },
  { id: "hatfield", siteName: "Hatfield", sourceFile: "DLC 3.vsdx", tabName: "DLC - Hatfield***Not Completed Yet", cleanName: "Hatfield", diagramUrl: "/api/diagram/hatfield", type: "vector", associatedHostnames: ["HATFIELD-SW01"] },
  { id: "bicester", siteName: "Bicester", sourceFile: "DLC 3.vsdx", tabName: "DLC-Bicester", cleanName: "Bicester", diagramUrl: "/api/diagram/bicester", type: "vector", associatedHostnames: ["DLC-Bicester-Main", "DLC-Bicester-Subrack", "DLC-Bicester-Lynxight", "DLC-Bicester-Spa", "Bicester-MXP", "Bicester-MXS"] },
  { id: "rugby", siteName: "Rugby", sourceFile: "DLC 3.vsdx", tabName: "DLC - Rugby", cleanName: "Rugby", diagramUrl: "/api/diagram/rugby", type: "vector", associatedHostnames: ["DLC-Rugby-48-1", "DLC-Rugby-Subrack", "DLC-Rugby-48-2", "Rugby-MXP"] },
  { id: "bury-st-edmunds", siteName: "Bury St Edmunds", sourceFile: "DLC 3.vsdx", tabName: "DLC - Bury St Edmunds", cleanName: "Bury-St-Edmunds", diagramUrl: "/api/diagram/bury-st-edmunds", type: "vector", associatedHostnames: ["DLC-Bury-St-Edmunds-48-1", "DLC-Bury-St-Edmunds-Subrack", "DLC-Bury-St-Edmunds-48-2", "DLC-Shawfair-Lynxight", "DLC-Bury-St-Edmunds-HiImpact", "Bury-St-Edmunds-MXP", "Bury-St-Edmunds-MXS"] },
  { id: "serrano", siteName: "Serrano", sourceFile: "DLC 3.vsdx", tabName: "DLC - Serrano", cleanName: "Serrano", diagramUrl: "/api/diagram/serrano", type: "vector", associatedHostnames: ["DLC-Serrano-Comms-48", "DLC-Tempoffices", "DLC-Serrano-7th-Floor", "DLC-Serrano-6th-Floor-48P", "DLC-Serrano-HighImpact", "Serrano-MXP", "Serrano-MXS"] },
  { id: "la-finca", siteName: "La Finca", sourceFile: "DLC 3.vsdx", tabName: "DLC - La Finca", cleanName: "La-Finca", diagramUrl: "/api/diagram/la-finca", type: "vector", associatedHostnames: ["DLC-LaFinca-Kids", "DLC-Lafinca-Lower-Comms", "DLC-LaFinca-HO-Comms-24", "1st-Floor-Comm-Room", "DLC-Lynxight", "LaFinca-MXP", "LaFinca-MXS"] },
  { id: "gava-mar", siteName: "Gava Mar", sourceFile: "DLC 3.vsdx", tabName: "DLC-GavaMar", cleanName: "Gava-Mar", diagramUrl: "/api/diagram/gava-mar", type: "vector", associatedHostnames: ["DLC-GavaMar-Core", "DLC-GavaMar-Tennis", "DLC-GavaMar-Lynxight", "DLC-GavaMar-Clubhouse", "GavaMar-MXP", "GavaMar-MXS"] },
  { id: "malaga", siteName: "Malaga", sourceFile: "DLC 3.vsdx", tabName: "DLC - Malaga", cleanName: "Malaga", diagramUrl: "/api/diagram/malaga", type: "vector", associatedHostnames: ["DLC-Malaga-48", "DLC-Malaga-Lynxight", "DLC-Malaga-2", "Malaga-MXP", "Malaga-MXS"] },
  { id: "zaragoza", siteName: "Zaragoza", sourceFile: "DLC 3.vsdx", tabName: "DLC - Zaragoza", cleanName: "Zaragoza", diagramUrl: "/api/diagram/zaragoza", type: "vector", associatedHostnames: ["DLC-Zaragoza-Core", "DLC-Zaragoza-Floor1", "DLC-Zaragoza-Lynxight", "DLC-Zaragoza-Spa", "Zaragoza-MXP", "Zaragoza-MXS"] },
  { id: "sterrebeek", siteName: "Sterrebeek", sourceFile: "DLC 3.vsdx", tabName: "DLC-Sterrebeek", cleanName: "Sterrebeek", diagramUrl: "/api/diagram/sterrebeek", type: "vector", associatedHostnames: ["DLC-Sterrebeek-Core", "DLC-Sterrebeek-Main-2", "DLC-Sterrebeek-Lynxight", "DLC-Sterrebeek-Spa", "Sterrebeek-MXP", "Sterrebeek-MXS"] },
  { id: "wickwoods", siteName: "Wickwoods", sourceFile: "DLC 3.vsdx", tabName: "DLC-Wickwoods", cleanName: "Wickwoods", diagramUrl: "/api/diagram/wickwoods", type: "vector", associatedHostnames: ["DLC-Wickwoods-Core", "DLC-Wickwoods-MainComms-2", "DLC-Wickwoods-Lynxight", "DLC-Wickwoods-Pavilion", "Wickwoods-MXP", "Wickwoods-MXS"] },
  { id: "cricklewood", siteName: "Cricklewood", sourceFile: "DLC 3.vsdx", tabName: "DLC-Cricklewood", cleanName: "Cricklewood", diagramUrl: "/api/diagram/cricklewood", type: "vector", associatedHostnames: ["DLC-Cricklewood-Core", "DLC-Cricklewood-MainComms-2", "DLC-Cricklewood-Gym", "DLC-Cricklewood-Lynxight", "Cricklewood-MXP", "Cricklewood-MXS"] },
  { id: "modena", siteName: "Modena", sourceFile: "DLC 3.vsdx", tabName: "DLC - Modena", cleanName: "Modena", diagramUrl: "/api/diagram/modena", type: "vector", associatedHostnames: ["DLC-Modena-Main", "DLC-Modena-Core-48", "DLC-Modena-Lynxight", "Modena MXP", "Modena MXS"] },
  { id: "enfield", siteName: "Enfield", sourceFile: "DLC 3.vsdx", tabName: "DLL-Enfield", cleanName: "Enfield", diagramUrl: "/api/diagram/enfield", type: "vector", associatedHostnames: ["DLL-Enfield-Core", "DLL-Enfield-Subrack", "DLL-Enfield-Lynxight", "DLL-Enfield-Gym", "DLL-Enfield-MXP", "DLL-Enfield-MXS"] },
  { id: "boadilla", siteName: "Boadilla", sourceFile: "DLC 3.vsdx", tabName: "DLC-Boadilla", cleanName: "Boadilla", diagramUrl: "/api/diagram/boadilla", type: "vector", associatedHostnames: ["DLC-Boadilla-Core", "DLC-Boadilla-Floor1", "DLC-Boadilla-Kids", "DLC-Boadilla-Lynxight", "Boadilla-MXP", "Boadilla-MXS"] },
  { id: "geneva-cc", siteName: "Geneva Country Club", sourceFile: "DLC 3.vsdx", tabName: "DLC-Geneva-CC", cleanName: "Geneva-CC", diagramUrl: "/api/diagram/geneva-cc", type: "vector", associatedHostnames: ["DLC-Geneva-CC-Core", "DLC-Geneva-CC-Main-2", "DLC-Geneva-CC-Lynxight", "DLC-Geneva-CC-ProShop", "Geneva-CC-MXP", "Geneva-CC-MXS"] },
  { id: "harlow", siteName: "Harlow", sourceFile: "DLC 3.vsdx", tabName: "DLC-Harlow", cleanName: "Harlow", diagramUrl: "/api/diagram/harlow", type: "vector", associatedHostnames: ["DLC-Harlow-Main", "DLC-Harlow-Subrack", "DLC-Harlow-Lynxight", "DLC-Harlow-Gym", "Harlow-MXP", "Harlow-MXS"] },
  { id: "colliers-wood", siteName: "Colliers Wood", sourceFile: "DLC 3.vsdx", tabName: "DLC - Colliers Wood", cleanName: "Colliers-Wood", diagramUrl: "/api/diagram/colliers-wood", type: "vector", associatedHostnames: ["DLC-Collierswood-MainComms-1", "DLC-ColliersWood-Subrack", "DLC-ColliersWood-MainComms-2", "COLLIERS-WOOD-MXP", "COLLIERS-WOOD-MXS"] },
  { id: "herne-bay", siteName: "Herne Bay", sourceFile: "DLC 3.vsdx", tabName: "DLC - Herne Bay", cleanName: "Herne-Bay", diagramUrl: "/api/diagram/herne-bay", type: "vector", associatedHostnames: ["DLC-Hernebay-Core-1", "DLC-HerneBay-MainComms", "DLC-Hernebay-Audio", "DLC-HerneBay-HiEnergy", "DLC-HerneBay-Gym", "DLC-HERNE-BAY-MXP", "DLC-HERNE-BAY-MXS"] },
  { id: "aberdeen", siteName: "Aberdeen", sourceFile: "DLC 3.vsdx", tabName: "DLC-Aberdeen", cleanName: "Aberdeen", diagramUrl: "/api/diagram/aberdeen", type: "vector", associatedHostnames: ["DLL-Aberdeen-Comms", "DLC-Aberdeen-Lynxight", "DLC-Aberdeen-Gym", "Aberdeen-MXP", "Aberdeen-MXS"] },
  { id: "acton", siteName: "Acton", sourceFile: "DLC 3.vsdx", tabName: "DLC - Acton", cleanName: "Acton", diagramUrl: "/api/diagram/acton", type: "vector", associatedHostnames: ["DLC-Acton2", "DLC-Acton-MainComms-3", "DLC-ActonPark-Lynxight", "Acton_Park-MXP", "Acton_Park-MXS"] },
  { id: "shawfair", siteName: "Shawfair", sourceFile: "DLC 3.vsdx", tabName: "DLC - Shawfair NOT COMPLETED", cleanName: "Shawfair", diagramUrl: "/api/diagram/shawfair", type: "vector", associatedHostnames: ["DLC-Shawfair-Main", "DLC-Shawfair-48-2", "DLC-Shawfair-Subrack", "Shawfair-MXP"] },
  { id: "plymouth", siteName: "Plymouth", sourceFile: "DLC 3.vsdx", tabName: "DLC - Plymouth", cleanName: "Plymouth", diagramUrl: "/api/diagram/plymouth", type: "vector", associatedHostnames: ["PLYMOUTH-CORE", "PLYMOUTH-EDGE-01"] },
  { id: "portsmouth", siteName: "Portsmouth", sourceFile: "DLC 3.vsdx", tabName: "DLC - Portsmouth", cleanName: "Portsmouth", diagramUrl: "/api/diagram/portsmouth", type: "vector", associatedHostnames: ["PORTSMOUTH-SW01"] },
  { id: "preston", siteName: "Preston", sourceFile: "DLC 3.vsdx", tabName: "DLC - Preston", cleanName: "Preston", diagramUrl: "/api/diagram/preston", type: "vector", associatedHostnames: ["PRESTON-CORE", "PRESTON-EDGE"] },
  { id: "romford", siteName: "Romford", sourceFile: "DLC 3.vsdx", tabName: "DLC - Romford", cleanName: "Romford", diagramUrl: "/api/diagram/romford", type: "vector", associatedHostnames: ["ROMFORD-SW01"] },
  { id: "salford", siteName: "Salford", sourceFile: "DLC 3.vsdx", tabName: "DLC - Salford", cleanName: "Salford", diagramUrl: "/api/diagram/salford", type: "vector", associatedHostnames: ["SALFORD-SW01"] },
  { id: "sheffield", siteName: "Sheffield", sourceFile: "DLC 3.vsdx", tabName: "DLC - Sheffield", cleanName: "Sheffield", diagramUrl: "/api/diagram/sheffield", type: "vector", associatedHostnames: ["SHEFFIELD-CORE", "SHEFFIELD-EDGE-01"] },
  { id: "slough", siteName: "Slough", sourceFile: "DLC 3.vsdx", tabName: "DLC - Slough", cleanName: "Slough", diagramUrl: "/api/diagram/slough", type: "vector", associatedHostnames: ["SLOUGH-SW01"] },
  { id: "stafford", siteName: "Stafford", sourceFile: "DLC 3.vsdx", tabName: "DLC - Stafford", cleanName: "Stafford", diagramUrl: "/api/diagram/stafford", type: "vector", associatedHostnames: ["STAFFORD-SW01"] },
  { id: "stockport", siteName: "Stockport", sourceFile: "DLC 3.vsdx", tabName: "DLC - Stockport", cleanName: "Stockport", diagramUrl: "/api/diagram/stockport", type: "vector", associatedHostnames: ["STOCKPORT-SW01"] },
  { id: "stoke", siteName: "Stoke-on-Trent", sourceFile: "DLC 3.vsdx", tabName: "DLC - Stoke", cleanName: "Stoke", diagramUrl: "/api/diagram/stoke", type: "vector", associatedHostnames: ["STOKE-SW01"] },
  { id: "stratford", siteName: "Stratford", sourceFile: "DLC 3.vsdx", tabName: "DLC - Stratford", cleanName: "Stratford", diagramUrl: "/api/diagram/stratford", type: "vector", associatedHostnames: ["STRATFORD-SW01"] },
  { id: "sutton", siteName: "Sutton", sourceFile: "DLC 3.vsdx", tabName: "DLC - Sutton", cleanName: "Sutton", diagramUrl: "/api/diagram/sutton", type: "vector", associatedHostnames: ["SUTTON-SW01"] },
  { id: "taunton", siteName: "Taunton", sourceFile: "DLC 3.vsdx", tabName: "DLC - Taunton", cleanName: "Taunton", diagramUrl: "/api/diagram/taunton", type: "vector", associatedHostnames: ["TAUNTON-SW01"] },
  { id: "telford", siteName: "Telford", sourceFile: "DLC 3.vsdx", tabName: "DLC - Telford", cleanName: "Telford", diagramUrl: "/api/diagram/telford", type: "vector", associatedHostnames: ["TELFORD-SW01"] },
  { id: "torquay", siteName: "Torquay", sourceFile: "DLC 3.vsdx", tabName: "DLC - Torquay", cleanName: "Torquay", diagramUrl: "/api/diagram/torquay", type: "vector", associatedHostnames: ["TORQUAY-SW01"] },
  { id: "wakefield", siteName: "Wakefield", sourceFile: "DLC 3.vsdx", tabName: "DLC - Wakefield", cleanName: "Wakefield", diagramUrl: "/api/diagram/wakefield", type: "vector", associatedHostnames: ["WAKEFIELD-SW01"] },
  { id: "walsall", siteName: "Walsall", sourceFile: "DLC 3.vsdx", tabName: "DLC - Walsall", cleanName: "Walsall", diagramUrl: "/api/diagram/walsall", type: "vector", associatedHostnames: ["WALSALL-SW01"] },
  { id: "watford", siteName: "Watford", sourceFile: "DLC 3.vsdx", tabName: "DLC - Watford", cleanName: "Watford", diagramUrl: "/api/diagram/watford", type: "vector", associatedHostnames: ["WATFORD-SW01"] },
  { id: "wigan", siteName: "Wigan", sourceFile: "DLC 3.vsdx", tabName: "DLC - Wigan", cleanName: "Wigan", diagramUrl: "/api/diagram/wigan", type: "vector", associatedHostnames: ["WIGAN-SW01"] },
  { id: "wimbledon", siteName: "Wimbledon", sourceFile: "DLC 3.vsdx", tabName: "DLC - Wimbledon", cleanName: "Wimbledon", diagramUrl: "/api/diagram/wimbledon", type: "vector", associatedHostnames: ["WIMBLEDON-CORE"] },
  { id: "winchester", siteName: "Winchester", sourceFile: "DLC 3.vsdx", tabName: "DLC - Winchester", cleanName: "Winchester", diagramUrl: "/api/diagram/winchester", type: "vector", associatedHostnames: ["WINCHESTER-SW01"] },
  { id: "windsor", siteName: "Windsor", sourceFile: "DLC 3.vsdx", tabName: "DLC - Windsor", cleanName: "Windsor", diagramUrl: "/api/diagram/windsor", type: "vector", associatedHostnames: ["WINDSOR-CORE"] },
  { id: "wolverhampton", siteName: "Wolverhampton", sourceFile: "DLC 3.vsdx", tabName: "DLC - Wolverhampton", cleanName: "Wolverhampton", diagramUrl: "/api/diagram/wolverhampton", type: "vector", associatedHostnames: ["WOLVERHAMPTON-CORE"] }
];

// Direct mapping table of uploaded PNG topology diagrams for all sites
export const SITE_DIAGRAM_FILES: Record<string, string> = {
  "royalberkshire": "DL-RoyalBerkshire.png",
  "aberdeen": "DLC-Aberdeen.png",
  "badhomburg": "DLC-Bad-Homburg.png",
  "belfast": "DLC-Belfast.png",
  "bicester": "DLC-Bicester.png",
  "birmingham": "DLC-Birmingham.png",
  "blijdorprotterdam": "DLC-Blijdorp_Rotterdam.png",
  "boadilla": "DLC-Boadilla.png",
  "bristolla": "DLC-Bristol-LA.png",
  "bristolwestbury": "DLC-Bristol-Westbury.png",
  "bromsgrove": "DLC-Bromsgrove.png",
  "brooklands": "DLC-Brooklands.png",
  "brussles": "DLC-Brussles.png",
  "brussels": "DLC-Brussles.png",
  "bushey": "DLC-Bushey.png",
  "cambridge": "DLC-Cambridge.png",
  "capelle": "DLC-Capelle.png",
  "cardiff": "DLC-Cardiff.png",
  "cheadle": "DLC-Cheadle.png",
  "cheam": "DLC-Cheam.png",
  "chigwell": "DLC-Chigwell.png",
  "chorley": "DLC-Chorley.png",
  "coventry": "DLC-Coventry.png",
  "cricklewood": "DLC-Cricklewood.png",
  "dartford": "DLC-Dartford.png",
  "derby": "DLC-Derby.png",
  "dudley": "DLC-Dudley.png",
  "dundee": "DLC-Dundee.png",
  "eastbourne": "DLC-Eastbourne.png",
  "edinburgh": "DLC-Edinburgh.png",
  "edinburghnewhaven": "DLC_-_Edinburgh_Newhaven_Harbour.png",
  "eindhoven": "DLC-Eindhoven.png",
  "emersonsgreen": "DLC-EmersonsGreen.png",
  "emersongreen": "DLC_-_Emersons_Green.png",
  "epsom": "DLC-Epsom.png",
  "exeter": "DLC-Exeter.png",
  "gavamar": "DLC-GavaMar.png",
  "genevacc": "DLC-Geneva-CC.png",
  "genevacitygreen": "DLC_-_Geneva_City_Green.png",
  "harlow": "DLC-Harlow.png",
  "kingston": "DLC-Kingston.png",
  "lincoln": "DLC-Lincoln.png",
  "maidenhead": "DLC-Maidenhead.png",
  "newcastle": "DLC-Newcastle.png",
  "norwhich": "DLC-Norwhich.png",
  "norwich": "DLC-Norwhich.png",
  "nottingham": "DLC-Nottingham.png",
  "portsolent": "DLC-PortSolent.png",
  "purley": "DLC-Purley.png",
  "raynespark": "DLC-Raynes_Park.png",
  "reading": "DLC-Reading.png",
  "sterrebeek": "DLC-Sterrebeek.png",
  "ster": "DLC-Sterrebeek.png",
  "sterr": "DLC-Sterrebeek.png",
  "wickwoods": "DLC-Wickwoods.png",
  "colchester": "DLC-_Colchester.png",
  "acton": "DLC_-_Acton.png",
  "amsterdam": "DLC_-_Amsterdam.png",
  "aravaca": "DLC_-_Aravaca.png",
  "barcelona": "DLC_-_Barcelona.png",
  "basildon": "DLC_-_Basildon.png",
  "beaconsfield": "DLC_-_Beaconsfield.png",
  "beckenham": "DLC_-_Beckenham.png",
  "blijdorp": "DLC-Blijdorp_Rotterdam.png",
  "bolton": "DLC_-_Bolton.png",
  "brighton": "DLC_-_Brighton.png",
  "burystedmunds": "DLC_-_Bury_St_Edmunds.png",
  "cheshireoaks": "DLC_-_Cheshire_Oaks.png",
  "collierswood": "DLC_-_Colliers_Wood.png",
  "edinburghnewhavenharbour": "DLC_-_Edinburgh_Newhaven_Harbour.png",
  "farnham": "DLC_-_Farnham.png",
  "finchley": "DLC_-_Finchley.png",
  "fulham": "DLC_-_Fulham.png",
  "gideapark": "DLC_-_Gidea_Park.png",
  "glasgow": "DLC_-_Glasgow_Renfrew.png",
  "glasgowrenfrew": "DLC_-_Glasgow_Renfrew.png",
  "glasgowroukenglen": "DLC_-_Glasgow_Rouken_Glen.png",
  "roukenglen": "DLC_-_Glasgow_Rouken_Glen.png",
  "glasgowwestend": "DLC_-_Glasgow_West_End.png",
  "gloucestshire": "DLC_-_Gloucestshire.png",
  "gloucestershire": "DLC_-_Gloucestshire.png",
  "gloucester": "DLC_-_Gloucestshire.png",
  "hamilton": "DLC_-_Hamilton.png",
  "hampton": "DLC_-_Hampton.png",
  "harrogate": "DLC_-_Harrogate.png",
  "hernebay": "DLC_-_Herne_Bay.png",
  "heston": "DLC_-_Heston.png",
  "hull": "DLC_-_Hull.png",
  "ipswich": "DLC_-_Ipswich.png",
  "kensington": "DLC_-_Kensington.png",
  "kidbrooke": "DLC_-_Kidbrooke.png",
  "kingshill": "DLC_-_KingsHill.png",
  "knowsley": "DLC_-_Knowsley.png",
  "lafinca": "DLC_-_La_Finca.png",
  "lafica": "DLC_-_La_Finca.png",
  "leeds": "DLC_-_Leeds.png",
  "leicester": "DLC_-_Leicester.png",
  "lichfield": "DLC_-_Lichfield.png",
  "luton": "DLC_-_Luton.png",
  "malaga": "DLC_-_Malaga.png",
  "malaspain": "DLC_-_Malaspain.png",
  "malaspina": "DLC_-_Malaspain.png",
  "manchesternorth": "DLC_-_Manchester-North.png",
  "manchester": "DLC_-_Manchester.png",
  "miltonkeynes": "DLC_-_Milton_Keynes.png",
  "modena": "DLC_-_Modena.png",
  "narbourgh": "DLC_-_Narbourgh.png",
  "narborough": "DLC_-_Narbourgh.png",
  "newbury": "DLC_-_Newbury.png",
  "northwood": "DLC_-_Northwood.png",
  "nottinghillharbourclub": "DLC_-_Notting_Hill_Harbour_Club.png",
  "nottinghill": "DLC_-_Notting_Hill_Harbour_Club.png",
  "peterborough": "DLC_-_Peterborough.png",
  "poole": "DLC_-_Poole.png",
  "ringwood": "DLC_-_Ringwood.png",
  "rotterdamakragon": "DLC_-_Rotterdam_-_Akragon.png",
  "rotterdam": "DLC_-_Rotterdam_-_Akragon.png",
  "rugby": "DLC_-_Rugby.png",
  "serrano": "DLC_-_Serrano.png",
  "shawfairnotcompleted": "DLC_-_Shawfair_NOT_COMPLETED.png",
  "shawfair": "DLC_-_Shawfair_NOT_COMPLETED.png",
  "shresbury": "DLC_-_Shresbury.png",
  "shrewsbury": "DLC_-_Shrewsbury.png",
  "sidcup": "DLC_-_Sidcup.png",
  "solihullcranmore": "DLC_-_Solihull_Cranmore.png",
  "solihull": "DLC_-_Solihull_Cranmore.png",
  "southampton": "DLC_-_Southampton.png",
  "southamptonwestend": "DLC_-_Southampton_West_End.png",
  "southend": "DLC_-_Southend.png",
  "speke": "DLC_-_Speke.png",
  "stevenage": "DLC_-_Stevenage.png",
  "sudburyhill": "DLC_-_Sudbury_Hill.png",
  "sunderland": "DLC_-_Sunderland.png",
  "swansea": "DLC_-_Swansea.png",
  "swindon": "DLC_-_Swindon.png",
  "teeside": "DLC_-_Teeside.png",
  "teesside": "DLC_-_Teeside.png",
  "warrington": "DLC_-_Warrington.png",
  "westbridgeford": "DLC_-_West_Bridgeford.png",
  "westbridgford": "DLC_-_West_Bridgeford.png",
  "woking": "DLC_-_Woking.png",
  "worcester": "DLC_-_Worcester.png",
  "worthing": "DLC_-_Worthing.png",
  "york": "DLC_-_York.png",
  "yorktopology": "York_Topology.png",
  "zaragoza": "DLC_-_Zaragoza.png",
  "enfield": "DLL-Enfield.png"
};

/**
 * Returns the exact PNG diagram image path if available for a given site code or name
 */
export function getDiagramPngPathForSite(siteCodeOrName: string): string | null {
  if (!siteCodeOrName) return null;
  
  const raw = String(siteCodeOrName).trim();
  const clean = raw.toLowerCase().replace(/^(dlc|dll|dl)[-_ ]*/i, "").replace(/[^a-z0-9]/g, "");
  
  if (SITE_DIAGRAM_FILES[clean]) {
    return `/diagrams/${SITE_DIAGRAM_FILES[clean]}`;
  }

  // Check direct key in mapping
  const rawKey = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (SITE_DIAGRAM_FILES[rawKey]) {
    return `/diagrams/${SITE_DIAGRAM_FILES[rawKey]}`;
  }

  // Check substring matches
  for (const [key, filename] of Object.entries(SITE_DIAGRAM_FILES)) {
    if (clean.length >= 3 && (clean.includes(key) || key.includes(clean))) {
      return `/diagrams/${filename}`;
    }
  }

  // Check if filename contains the clean string directly
  for (const filename of Object.values(SITE_DIAGRAM_FILES)) {
    const fileClean = filename.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.length >= 4 && fileClean.includes(clean)) {
      return `/diagrams/${filename}`;
    }
  }

  return null;
}

export function findDiagramForSiteOrSwitch(searchTerm: string): SiteDiagram | undefined {
  if (!searchTerm) return undefined;
  const term = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Exact or fuzzy match
  return KNOWN_SITE_DIAGRAMS.find(d => {
    const siteClean = d.siteName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const tabClean = d.tabName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const idClean = d.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    if (term.includes(siteClean) || siteClean.includes(term)) return true;
    if (term.includes(idClean) || idClean.includes(term)) return true;
    if (term.includes(tabClean) || tabClean.includes(term)) return true;

    if (d.associatedHostnames?.some(h => {
      const hClean = h.toLowerCase().replace(/[^a-z0-9]/g, "");
      return term.includes(hClean) || hClean.includes(term);
    })) return true;

    if (d.switchIps?.some(ip => searchTerm.includes(ip))) return true;

    return false;
  });
}
