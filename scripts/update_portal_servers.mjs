import fs from 'fs';
import path from 'path';

function updatePortalFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let code = fs.readFileSync(filePath, 'utf-8');

  // 1. Ensure get_all_switches_payload seeds DYNAMIC_HOSTNAME_CACHE from switches_inventory.json
  const inventoryLoadingSnippet = `
    # Load curated inventory if available
    inv_file = os.path.join(DIRECTORY, "switches_inventory.json")
    if os.path.exists(inv_file):
        try:
            with open(inv_file, "r", encoding="utf-8") as f_inv:
                inv_data = json.load(f_inv)
                if isinstance(inv_data, list):
                    for item in inv_data:
                        if isinstance(item, dict) and "ip" in item and "hostname" in item:
                            DYNAMIC_HOSTNAME_CACHE[item["ip"]] = item["hostname"]
        except Exception:
            pass
`;

  if (!code.includes('inv_file = os.path.join(DIRECTORY, "switches_inventory.json")')) {
    code = code.replace(
      'def get_all_switches_payload():',
      'def get_all_switches_payload():' + inventoryLoadingSnippet
    );
  }

  // 2. Enhance extractSiteCode in JS
  const enhancedExtractSiteCode = `    function extractSiteCode(hostnameOrIp) {
      if (!hostnameOrIp) return "UNASSIGNED";
      const clean = String(hostnameOrIp).trim();
      
      // Known IP subnet mappings
      if (clean.startsWith('10.32.221.') || clean.startsWith('10.32.81.')) return 'YORK';
      if (clean.startsWith('10.32.214.')) return 'LICHFIELD';
      if (clean.startsWith('10.32.54.')) return 'LEEDS';
      if (clean.startsWith('10.32.61.')) return 'LEICESTER';
      if (clean.startsWith('10.32.208.')) return 'BRISTOL';
      if (clean.startsWith('10.32.227.')) return 'BEACONSFIELD';
      if (clean.startsWith('10.32.52.')) return 'LINCOLN';
      if (clean.startsWith('10.32.48.')) return 'LUTON';

      if (/^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/.test(clean)) return "UNASSIGNED";
      
      const lower = clean.toLowerCase();
      if (lower.includes('york')) return 'YORK';
      if (lower.includes('lichfield')) return 'LICHFIELD';
      if (lower.includes('leeds')) return 'LEEDS';
      if (lower.includes('leicester')) return 'LEICESTER';
      if (lower.includes('bristol')) return 'BRISTOL';
      if (lower.includes('beaconsfield')) return 'BEACONSFIELD';
      if (lower.includes('lincoln')) return 'LINCOLN';
      if (lower.includes('luton')) return 'LUTON';

      const parts = clean.split(/[-_]/);
      if (parts.length >= 2 && parts[1].trim().length > 0) {
        return parts[1].trim().toUpperCase();
      }
      return parts[0].trim().toUpperCase() || "GENERAL";
    }`;

  code = code.replace(/function extractSiteCode\(hostnameOrIp\) \{[\s\S]*?\n    \}/m, enhancedExtractSiteCode);

  // 3. Ensure createSwitchCardHtml is present
  const createCardFunction = `
    function createSwitchCardHtml(sw) {
      const reachability = getSwitchReachabilityInfo(sw);
      const reachabilityBadge = reachability.isReachable
        ? \`<span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 font-mono shadow-sm" title="Live ICMP Reachable">
             <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
             <b>\${reachability.latencyMs ?? 2} ms</b>
           </span>\`
        : \`<span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-rose-950/90 text-rose-300 border border-rose-800/80 font-mono shadow-sm" title="Unreachable / Offline">
             <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
             <b>Offline</b>
           </span>\`;

      return \`
        <div class="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between space-y-3.5 shadow-md transition-all">
          <div>
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                    .\${(sw.format || 'xsf').toUpperCase()}
                  </span>
                  <h3 class="font-mono font-bold text-white text-sm tracking-tight truncate max-w-[170px]" title="\${sw.hostname}">
                    \${sw.hostname}
                  </h3>
                </div>
                <div class="flex items-center gap-2 mt-1.5">
                  <button 
                    onclick="copyToClipboard('\${sw.ip}', 'Copied IP: \${sw.ip}')"
                    class="font-mono text-sm font-bold text-emerald-400 hover:text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 hover:border-emerald-700/60 flex items-center gap-1 transition"
                    title="Click to copy IP"
                  >
                    <span>\${sw.ip}</span>
                    <span class="text-[10px] text-slate-500">📋</span>
                  </button>
                </div>
              </div>
              
              <div class="flex flex-col items-end gap-1 shrink-0">
                \${reachabilityBadge}
                <span class="text-[10px] font-mono \${sw.hasBackup ? 'text-emerald-400' : 'text-slate-500'}">
                  \${sw.hasBackup ? '✔ Backed Up' : 'No Backup'}
                </span>
                <div class="text-[10px] text-slate-500 font-mono">
                  \${(sw.latestBackupTime || 'Recent').split(' ')[0]}
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-800/80">
            <div class="grid grid-cols-5 gap-1.5">
              <button 
                onclick="showSwitchMonitorLive('\${sw.ip}', '\${sw.hostname}', '\${sw.format}')"
                class="flex items-center justify-center gap-1 px-1 py-1.5 rounded-lg text-xs font-bold bg-indigo-950/90 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 hover:border-indigo-500 transition shadow-sm truncate group"
                title="Monitor live CPU utilization %, Temperature, and Memory %"
              >
                <span>📊 Monitor</span>
              </button>

              <button 
                onclick="showPortDescriptionsLive('\${sw.ip}', '\${sw.hostname}')"
                class="flex items-center justify-center gap-1 px-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 hover:border-emerald-600/60 transition shadow-sm truncate"
                title="Query live port information (show ports) via Telnet"
              >
                <span>⚡ Ports</span>
              </button>

              <button 
                onclick="showLldpNeighborsLive('\${sw.ip}', '\${sw.hostname}')"
                class="flex items-center justify-center gap-1 px-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-800 hover:border-purple-600/60 transition shadow-sm truncate"
                title="Query all live LLDP neighbors detailed via Telnet"
              >
                <span>📡 LLDP</span>
              </button>

              <button 
                onclick="showFdbTableLive('\${sw.ip}', '\${sw.hostname}')"
                class="flex items-center justify-center gap-1 px-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-600/60 transition shadow-sm truncate"
                title="Query live MAC table (FDB) with port selector and MAC search"
              >
                <span>🏷️ FDB</span>
              </button>

              <button 
                onclick="showSwitchPingLive('\${sw.ip}', '\${sw.hostname}')"
                class="flex items-center justify-center gap-1 px-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-600/60 transition shadow-sm truncate"
                title="Ping and test live reachability"
              >
                <span>🌐 Ping</span>
              </button>
            </div>

            <div class="flex items-center gap-1.5">
              <button 
                onclick="copySwitchBackup('\${sw.ip}', '\${sw.hostname}')"
                class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition"
                title="Copy latest configuration backup to clipboard"
              >
                <span>📋 Copy Backup</span>
              </button>

              <button 
                onclick="showPreviousBackups('\${sw.ip}', '\${sw.hostname}')"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
                title="Access previous backup archives"
              >
                <span>🕒 Backups</span>
              </button>

              <button 
                onclick="showBouncePortModal('\${sw.ip}', '\${sw.hostname}', '13')"
                class="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/60 transition shadow-sm"
                title="Bounce port with live MAC confirmation on this switch"
              >
                <span>🔄 Bounce</span>
              </button>

              <button 
                onclick="runBackup('\${sw.ip}')"
                class="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow"
                title="Run BackupSave.py for this switch"
              >
                <span>⚡ Backup</span>
              </button>
            </div>
          </div>
        </div>
      \`;
    }`;

  // 4. Enhanced renderSitePage()
  const enhancedRenderSitePage = `    function renderSitePage() {
      const container = document.getElementById('site-page-container');
      const fleetToolbar = document.getElementById('fleet-toolbar');
      const switchesGrid = document.getElementById('switches-grid');
      if (!container) return;

      if (!selectedSite) {
        container.classList.add('hidden');
        container.innerHTML = '';
        if (fleetToolbar) fleetToolbar.classList.remove('hidden');
        if (switchesGrid) switchesGrid.classList.remove('hidden');
        return;
      }

      // Hide fleet toolbar & global fleet grid when on a specific site page
      if (fleetToolbar) fleetToolbar.classList.add('hidden');
      if (switchesGrid) switchesGrid.classList.add('hidden');

      const siteSwitches = allSwitches.filter(sw => extractSiteCode(sw.hostname || sw.ip) === selectedSite);
      const isYork = selectedSite.toUpperCase() === 'YORK' || selectedSite.toLowerCase().includes('york');
      const backedUpCount = siteSwitches.filter(s => s.hasBackup).length;
      const coveragePct = siteSwitches.length > 0 ? Math.round((backedUpCount / siteSwitches.length) * 100) : 100;

      container.classList.remove('hidden');
      container.innerHTML = \`
        <div id="site-page-banner" class="space-y-6">
          <!-- Site Top Header Banner -->
          <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <button 
                onclick="selectSite(null)" 
                class="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 cursor-pointer flex items-center justify-center shrink-0"
                title="Back to All Sites Fleet"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <div class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                    🏢
                  </div>
                  <h2 class="text-lg font-bold text-white tracking-wide">\${selectedSite} Site Network Hub</h2>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    SITE CODE: \${selectedSite}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    \${siteSwitches.length} Switches
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                  <span>Showing switches for <strong class="text-indigo-300">\${selectedSite}</strong></span>
                  <span>&bull;</span>
                  <span class="text-emerald-400">Coverage: <b>\${coveragePct}%</b> (\${backedUpCount}/\${siteSwitches.length} Backed Up)</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2.5">
              <button
                onclick="triggerBackup('BackupSave.py', '\${siteSwitches[0] ? siteSwitches[0].ip : 'ALL'}')"
                class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                title="Run BackupSave.py on all switches in \${selectedSite}"
              >
                <span>⚡ Backup \${selectedSite} Switches</span>
              </button>
              <button
                onclick="selectSite(null)"
                class="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
                title="Return to fleet overview"
              >
                <span>← Back to Fleet</span>
              </button>
            </div>
          </div>

          <!-- Interactive Topology Diagram Section for York & Site Blueprints -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div class="p-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <span class="text-indigo-400 font-mono text-sm">🗺️</span>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      \${selectedSite} Physical & Logical Topology Diagram
                    </h3>
                    \${isYork ? \`
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                        Visio Verified: DLC 3.vsdx (DLC - York)
                      </span>
                    \` : \`
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Network Blueprint
                      </span>
                    \`}
                  </div>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    Core VSP/EXOS switch uplinks, firewall interconnects, and IDF distribution layouts.
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono">
                  <button onclick="changeDiagramZoom(-20)" class="px-1.5 text-slate-400 hover:text-white" title="Zoom Out">-</button>
                  <span id="diagram-zoom-level" class="text-slate-200 text-[11px] px-1">\${siteDiagramZoom}%</span>
                  <button onclick="changeDiagramZoom(20)" class="px-1.5 text-slate-400 hover:text-white" title="Zoom In">+</button>
                  <button onclick="resetDiagramZoom()" class="px-1.5 text-slate-400 hover:text-white border-l border-slate-800 pl-1.5" title="Reset Zoom">100%</button>
                </div>
              </div>
            </div>

            <!-- Diagram Canvas -->
            <div id="site-diagram-canvas" class="p-4 bg-white/95 rounded-b-xl overflow-x-auto flex justify-center items-center" style="min-height: 420px;">
              \${isYork ? \`
                <div style="width: 100%; max-width: 1100px; transform: scale(\${siteDiagramZoom / 100}); transform-origin: top center; transition: transform 0.15s ease-out;">
                  \${YORK_DIAGRAM_SVG_STR}
                </div>
              \` : \`
                <div class="p-12 text-center text-slate-700 font-mono">
                  <div class="text-3xl mb-2">🏢</div>
                  <div class="text-sm font-bold">\${selectedSite} Network Schematic</div>
                  <div class="text-xs text-slate-500 mt-1">Showing \${siteSwitches.length} connected switches for site \${selectedSite}.</div>
                </div>
              \`}
            </div>

            \${isYork ? \`
              <!-- Uplink Legend -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950 border-t border-slate-800 text-xs font-mono">
                <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div class="text-purple-400 font-bold">DLC-York-Spa-SW1</div>
                  <div class="text-slate-400 text-[11px] mt-0.5">Core Port 9 ➔ Port 1</div>
                </div>
                <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div class="text-purple-400 font-bold">DLC-York-Gym</div>
                  <div class="text-slate-400 text-[11px] mt-0.5">Core Port 37 ➔ Port 1</div>
                </div>
                <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div class="text-purple-400 font-bold">DLL-York</div>
                  <div class="text-slate-400 text-[11px] mt-0.5">Core Port 42 ➔ Port 17</div>
                </div>
                <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div class="text-purple-400 font-bold">DLC-York-MainComms-2</div>
                  <div class="text-slate-400 text-[11px] mt-0.5">Core Port 41 ➔ Port 48</div>
                </div>
              </div>
            \` : ''}
          </div>

          \${isYork ? \`
            <!-- Wireless Site Heat Maps Section (Ground Floor, First Floor, Site Plan) -->
            <div id="york-heatmaps-container" class="pt-2"></div>
          \` : ''}

          <!-- Site Switch Inventory Cards (Exclusively for this site) -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <span>🏢</span>
                <span>Switches Assigned to \${selectedSite} (\${siteSwitches.length})</span>
              </h3>
              <div class="text-xs text-slate-400 font-mono">
                Showing \${siteSwitches.length} site-specific switch card\${siteSwitches.length > 1 ? 's' : ''}
              </div>
            </div>

            \${siteSwitches.length === 0 ? \`
              <div class="py-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs font-mono">
                No active switches found for \${selectedSite}.
              </div>
            \` : \`
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                \${siteSwitches.map(sw => createSwitchCardHtml(sw)).join('')}
              </div>
            \`}
          </div>
        </div>
      \`;
      
      if (isYork) {
        renderYorkHeatMaps();
      }
    }`;

  code = code.replace(/function renderSitePage\(\) \{[\s\S]*?\n    \}/m, enhancedRenderSitePage);

  // 5. Update selectSite & openSitePage
  const enhancedSelectSite = `    function selectSite(siteKey) {
      selectedSite = siteKey;
      const tag = document.getElementById('active-site-tag');
      const name = document.getElementById('active-site-name');
      if (siteKey) {
        tag.classList.remove('hidden');
        name.innerText = siteKey;
        expandedSites[siteKey] = true;
      } else {
        tag.classList.add('hidden');
      }
      renderSiteTree();
      renderSitePage();
      if (!siteKey) {
        renderSwitches();
      }
    }

    function openSitePage(siteKey, e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      selectSite(siteKey);
      const siteContainer = document.getElementById('site-page-container');
      if (siteContainer) {
        siteContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }`;

  code = code.replace(/function selectSite\(siteKey\) \{[\s\S]*?function openSitePage\(siteKey, e\) \{[\s\S]*?\n    \}/m, enhancedSelectSite);

  // 6. Ensure renderSwitches uses createSwitchCardHtml
  const enhancedRenderSwitches = `    function renderSwitches() {
      const container = document.getElementById('switches-grid');
      if (!container) return;
      container.innerHTML = '';

      if (allSwitches.length === 0) {
        container.innerHTML = \`
          <div class="col-span-full py-12 text-center bg-slate-950 rounded-xl border border-slate-800">
            <div class="text-2xl mb-2">📋</div>
            <div class="text-sm font-semibold text-slate-300">No switch IPs found in Switches.txt</div>
            <div class="text-xs text-slate-500 mt-1">Add your switch IP addresses (one per line) to Switches.txt and refresh.</div>
          </div>
        \`;
        document.getElementById('visible-switch-count').innerText = 0;
        return;
      }

      updateReachabilityCounters();

      const filtered = allSwitches.filter(sw => {
        if (selectedSite) {
          const swSite = extractSiteCode(sw.hostname || sw.ip);
          if (swSite !== selectedSite) return false;
        }

        const reachability = getSwitchReachabilityInfo(sw);
        if (reachabilityFilter === 'REACHABLE' && !reachability.isReachable) return false;
        if (reachabilityFilter === 'UNREACHABLE' && reachability.isReachable) return false;

        if (!currentFilter) return true;
        return sw.ip.toLowerCase().includes(currentFilter) ||
               sw.hostname.toLowerCase().includes(currentFilter) ||
               (sw.latestFilename || '').toLowerCase().includes(currentFilter);
      });

      document.getElementById('visible-switch-count').innerText = filtered.length;

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="col-span-full py-12 text-center bg-slate-950 rounded-xl border border-slate-800">
            <div class="text-2xl mb-2">🔍</div>
            <div class="text-sm font-semibold text-slate-300">No switches matching your search or reachability filter</div>
            <div class="text-xs text-slate-500 mt-1">Try switching to the "All" tab or clearing the search query</div>
          </div>
        \`;
        return;
      }

      filtered.forEach(sw => {
        const cardWrapper = document.createElement('div');
        cardWrapper.innerHTML = createSwitchCardHtml(sw);
        if (cardWrapper.firstElementChild) {
          container.appendChild(cardWrapper.firstElementChild);
        }
      });
    }`;

  code = code.replace(/function renderSwitches\(\) \{[\s\S]*?container\.appendChild\(card\);\s*\}\);\s*\}/m, enhancedRenderSwitches);

  // 7. Inject createSwitchCardHtml before renderSitePage if not present
  if (!code.includes('function createSwitchCardHtml(sw)')) {
    code = code.replace('function renderSitePage() {', createCardFunction + '\n\n    function renderSitePage() {');
  }

  // 8. Wrap toolbar in #fleet-toolbar id in the HTML template
  if (!code.includes('id="fleet-toolbar"')) {
    code = code.replace(
      '<!-- Filter Tabs & Quick Reachability Sweep Bar -->\n          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">',
      '<!-- Fleet Toolbar (Search, Filter Tabs, Reachability Stats) -->\n        <div id="fleet-toolbar" class="space-y-4">\n          <!-- Filter Tabs & Quick Reachability Sweep Bar -->\n          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">'
    );
    code = code.replace(
      '<!-- Switches Grid -->\n          <div id="switches-grid"',
      '</div>\n\n          <!-- Switches Grid -->\n          <div id="switches-grid"'
    );
  }

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Successfully updated: ${filePath}`);
}

updatePortalFile('portal_server.py');
updatePortalFile('portal_server_ubuntu.py');
