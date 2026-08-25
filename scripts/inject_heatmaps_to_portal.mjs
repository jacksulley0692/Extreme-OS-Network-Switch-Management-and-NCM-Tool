// scripts/inject_heatmaps_to_portal.mjs
import fs from 'fs';
import path from 'path';

async function main() {
  const yorkHeatMapsModule = await import('../src/data/yorkHeatMapsData.ts');
  const plans = yorkHeatMapsModule.YORK_HEATMAP_PLANS;

  const plansJson = JSON.stringify(plans.map(p => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    drawingNumber: p.drawingNumber,
    fileSource: p.fileSource,
    coverageStats: p.coverageStats,
    zones: p.zones,
    aps: p.aps,
    svgContent: p.svgContent
  })));

  const heatmapJsCode = `
    // York Heat Maps Data and Interactive Engine
    const YORK_HEATMAP_PLANS = ${plansJson};
    let currentHeatmapPlanId = 'ground_floor';
    let currentHeatmapZoom = 100;
    let currentHeatmapRenderer = 'vector';
    let currentHeatmapCustomUrls = {};

    function switchHeatmapPlan(planId) {
      currentHeatmapPlanId = planId;
      renderYorkHeatMaps();
    }

    function changeHeatmapZoom(delta) {
      currentHeatmapZoom = Math.max(60, Math.min(220, currentHeatmapZoom + delta));
      const el = document.getElementById('heatmap-zoom-level');
      if (el) el.innerText = currentHeatmapZoom + '%';
      const canvas = document.getElementById('heatmap-render-target');
      if (canvas) canvas.style.transform = 'scale(' + (currentHeatmapZoom / 100) + ')';
    }

    function resetHeatmapZoom() {
      currentHeatmapZoom = 100;
      const el = document.getElementById('heatmap-zoom-level');
      if (el) el.innerText = '100%';
      const canvas = document.getElementById('heatmap-render-target');
      if (canvas) canvas.style.transform = 'scale(1)';
    }

    function toggleHeatmapRenderer(mode) {
      currentHeatmapRenderer = mode;
      renderYorkHeatMaps();
    }

    function handleHeatmapFileUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        currentHeatmapCustomUrls[currentHeatmapPlanId] = url;
        currentHeatmapRenderer = 'custom';
        renderYorkHeatMaps();
      }
    }

    function exportHeatmapCsv() {
      const headers = "Floor Plan,AP ID,AP Hostname,Model,Bands,Channels,TX Power,Signal (dBm),Location,Switch Uplink Port,Active Clients\\n";
      const rows = YORK_HEATMAP_PLANS.flatMap(plan => 
        plan.aps.map(ap => 
          '"' + plan.title + '","' + ap.id + '","' + ap.name + '","' + ap.model + '","' + ap.band + '","' + ap.channel + '","' + ap.txPower + '",' + ap.signalDbm + ',"' + ap.location + '","' + (ap.switchPort || 'N/A') + '",' + (ap.connectedClients || 0)
        )
      ).join("\\n");

      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'David_Lloyd_York_Wireless_AP_Heatmap_Audit.csv';
      link.click();
    }

    function downloadHeatmapSvg() {
      const plan = YORK_HEATMAP_PLANS.find(p => p.id === currentHeatmapPlanId) || YORK_HEATMAP_PLANS[0];
      const blob = new Blob([plan.svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = plan.fileSource.replace('.png', '') + '_Vector.svg';
      link.click();
    }

    function renderYorkHeatMaps() {
      const target = document.getElementById('york-heatmaps-container');
      if (!target) return;

      const plan = YORK_HEATMAP_PLANS.find(p => p.id === currentHeatmapPlanId) || YORK_HEATMAP_PLANS[0];

      let tabsHtml = '';
      YORK_HEATMAP_PLANS.forEach(p => {
        const isSel = p.id === currentHeatmapPlanId;
        tabsHtml += \`
          <button
            onclick="switchHeatmapPlan('\${p.id}')"
            class="px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer \${
              isSel
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }"
          >
            <span>📡</span>
            <span>\${p.title}</span>
            <span class="text-[10px] font-mono px-1.5 py-0.2 rounded \${isSel ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'}">
              \${p.aps.length} APs
            </span>
          </button>
        \`;
      });

      let apsHtml = '';
      plan.aps.forEach(ap => {
        apsHtml += \`
          <div class="p-3 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 text-xs font-mono">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span class="font-bold text-slate-100">\${ap.id}</span>
                <span class="text-slate-400 text-[10px]">(\${ap.model})</span>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-bold">
                \${ap.signalDbm} dBm
              </span>
            </div>
            <div class="text-[11px] text-slate-300 mt-1 font-sans font-medium">
              \${ap.location}
            </div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Ch: <strong class="text-slate-300">\${ap.channel}</strong></span>
              <span>Clients: <strong class="text-indigo-300">\${ap.connectedClients || 0}</strong></span>
            </div>
            \${ap.switchPort ? \`
              <div class="mt-1 text-[10px] text-purple-300 flex items-center gap-1 truncate">
                <span>🔌</span>
                <span class="truncate">\${ap.switchPort}</span>
              </div>
            \` : ''}
          </div>
        \`;
      });

      let zonesHtml = '';
      plan.zones.forEach(z => {
        zonesHtml += \`
          <div class="p-2 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <div class="font-medium text-slate-200">\${z.name}</div>
              <div class="text-[10px] text-slate-400 font-mono">AP: \${z.apAssigned}</div>
            </div>
            <div class="font-mono text-[11px] font-bold \${z.signalColor}">
              \${z.signal}
            </div>
          </div>
        \`;
      });

      const hasCustom = !!currentHeatmapCustomUrls[currentHeatmapPlanId];
      const customImgUrl = currentHeatmapCustomUrls[currentHeatmapPlanId] || ('/diagrams/' + plan.fileSource);

      target.innerHTML = \`
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-4">
          <!-- Main Heatmaps Header -->
          <div class="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-start sm:items-center gap-3">
              <div class="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 text-lg">
                📶
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-base sm:text-lg font-bold text-white tracking-wide">
                    Site Heat Maps
                  </h2>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Wi-Fi 6E RF Coverage</span>
                  </span>
                  <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    David Lloyd York (3 Plans)
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-1">
                  Architectural RF signal strength heat maps, Extreme Networks AP density, and voice/data SLA contours for York.
                </p>
              </div>
            </div>

            <!-- Action Controls & Exporters -->
            <div class="flex items-center gap-2 flex-wrap">
              <a
                href="/diagrams/\${plan.fileSource}"
                download="\${plan.fileSource}"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 transition"
                title="Download original file"
              >
                <span>💾</span>
                <span>Download \${plan.fileSource}</span>
              </a>
              <button
                onclick="exportHeatmapCsv()"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 transition cursor-pointer"
                title="Export full AP allocation and signal strength audit to CSV"
              >
                <span>📊</span>
                <span>Export AP Audit CSV</span>
              </button>
              <button
                onclick="downloadHeatmapSvg()"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 transition cursor-pointer"
                title="Download vector SVG of current floor plan"
              >
                <span>📐</span>
                <span>Download SVG</span>
              </button>
            </div>
          </div>

          <!-- Floor Plan Selector Tabs & View Toggles -->
          <div class="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              \${tabsHtml}
            </div>

            <div class="flex items-center gap-2 flex-wrap text-xs">
              <div class="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onclick="toggleHeatmapRenderer('vector')"
                  class="px-2.5 py-1 rounded transition \${currentHeatmapRenderer === 'vector' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}"
                >
                  Vector Blueprint
                </button>
                <button
                  onclick="toggleHeatmapRenderer('custom')"
                  class="px-2.5 py-1 rounded transition \${currentHeatmapRenderer === 'custom' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}"
                >
                  \${hasCustom ? 'Loaded PNG' : 'PNG Mode'}
                </button>
              </div>

              <input type="file" id="heatmap-file-input" onchange="handleHeatmapFileUpload(event)" accept="image/png,image/jpeg,image/svg+xml" class="hidden" />
              <button
                onclick="document.getElementById('heatmap-file-input').click()"
                class="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 font-mono text-[11px] transition cursor-pointer"
              >
                <span>📤</span>
                <span>\${hasCustom ? 'Replace PNG' : 'Upload PNG'}</span>
              </button>

              <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 font-mono text-[11px]">
                <button onclick="changeHeatmapZoom(-20)" class="px-1 text-slate-400 hover:text-white">-</button>
                <span id="heatmap-zoom-level" class="text-slate-200 px-1">\${currentHeatmapZoom}%</span>
                <button onclick="changeHeatmapZoom(20)" class="px-1 text-slate-400 hover:text-white">+</button>
                <button onclick="resetHeatmapZoom()" class="px-1 text-slate-400 hover:text-white border-l border-slate-800 pl-1.5">100%</button>
              </div>
            </div>
          </div>

          <!-- Plan Info Strip -->
          <div class="mx-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-white text-sm">\${plan.title}</span>
                <span class="text-slate-500 font-mono">|</span>
                <span class="text-slate-300 font-mono">Source File: \${plan.fileSource}</span>
                <span class="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono">
                  DWG #\${plan.drawingNumber}
                </span>
              </div>
              <p class="text-slate-400 text-[11px] mt-0.5">\${plan.subtitle}</p>
            </div>

            <div class="flex items-center gap-3 font-mono text-[11px] flex-wrap">
              <div class="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                <span class="text-slate-400 mr-1">Avg RF:</span>
                <span class="text-emerald-400 font-bold">\${plan.coverageStats.avgSignalDbm} dBm</span>
              </div>
              <div class="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                <span class="text-slate-400 mr-1">Excellent Area:</span>
                <span class="text-emerald-400 font-bold">\${plan.coverageStats.excellentAreaPercent}%</span>
              </div>
              <div class="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                <span class="text-slate-400 mr-1">Clients:</span>
                <span class="text-indigo-300 font-bold">\${plan.coverageStats.primaryClients}</span>
              </div>
            </div>
          </div>

          <!-- Heatmap Canvas -->
          <div class="mx-4 bg-slate-950 rounded-xl p-3 sm:p-4 border border-slate-800 overflow-x-auto flex justify-center items-center relative min-h-[480px]">
            \${currentHeatmapRenderer === 'custom' ? \`
              <div class="w-full flex justify-center">
                <img
                  src="\${customImgUrl}"
                  alt="\${plan.title}"
                  style="transform: scale(\${currentHeatmapZoom / 100}); transform-origin: top center; transition: transform 0.15s ease-out; max-width: 100%; height: auto;"
                  class="rounded-lg shadow-md"
                  onerror="this.style.display='none'; document.getElementById('heatmap-fallback-msg').style.display='block';"
                />
                <div id="heatmap-fallback-msg" style="display:none;" class="p-6 text-center text-slate-400 font-mono text-xs">
                  <div>PNG image not yet placed in /diagrams/ folder. Switching to Vector blueprint.</div>
                  <button onclick="toggleHeatmapRenderer('vector')" class="mt-2 px-3 py-1.5 bg-emerald-600 text-white rounded">View Vector Heat Map</button>
                </div>
              </div>
            \` : \`
              <div
                id="heatmap-render-target"
                style="width: 100%; max-width: 1280px; transform: scale(\${currentHeatmapZoom / 100}); transform-origin: top center; transition: transform 0.15s ease-out;"
              >
                \${plan.svgContent}
              </div>
            \`}
          </div>

          <!-- AP Inventory and Zones Matrix -->
          <div class="mx-4 mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
            <div class="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
              <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">📡</span>
                  <h4 class="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Deployed Access Points for \${plan.title} (\${plan.aps.length})
                  </h4>
                </div>
                <span class="text-[11px] font-mono text-slate-400">Extreme Networks AP Series</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                \${apsHtml}
              </div>
            </div>

            <div class="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
              <div class="flex items-center gap-2 border-b border-slate-800/80 pb-2.5">
                <span class="text-indigo-400">📈</span>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Room Zone RF Breakdown
                </h4>
              </div>
              <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                \${zonesHtml}
              </div>
              <div class="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-xs space-y-1">
                <div class="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <span>✅</span>
                  <span>David Lloyd RF Standard Met</span>
                </div>
                <p class="text-[11px] text-slate-300">
                  Signal &gt; -65 dBm across 92%+ of occupied training and hospitality areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      \`;
    }
  `;

  // Update portal_server.py
  const portalFiles = ['portal_server.py', 'portal_server_ubuntu.py'];
  for (const portalFile of portalFiles) {
    const fullPath = path.resolve(process.cwd(), portalFile);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. Ensure the York Heatmaps container is added to renderSitePage
    if (!content.includes('id="york-heatmaps-container"')) {
      const targetAnchor = '` : \'\'}\n          </div>\n        </div>\n      `;';
      const replacement = `\` : ''}
          </div>

          \${isYork ? \`
            <!-- Wireless Site Heat Maps Section (Ground Floor, First Floor, Site Plan) -->
            <div id="york-heatmaps-container" class="pt-2"></div>
          \` : ''}
        </div>
      \`;
      
      if (isYork) {
        setTimeout(renderYorkHeatMaps, 50);
      }`;

      content = content.replace(targetAnchor, replacement);
    }

    // 2. Ensure the script engine and data is present before </body>
    if (!content.includes('const YORK_HEATMAP_PLANS =')) {
      content = content.replace('    renderSwitches();', `    renderSwitches();\n${heatmapJsCode}\n`);
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${portalFile} with complete York Heat Maps!`);
  }
}

main().catch(err => {
  console.error('Error updating portals:', err);
  process.exit(1);
});
