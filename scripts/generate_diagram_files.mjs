// scripts/generate_diagram_files.mjs
import fs from 'fs';
import path from 'path';

async function main() {
  const yorkHeatMapsModule = await import('../src/data/yorkHeatMapsData.ts');
  const yorkDiagramModule = await import('../src/data/yorkDiagramSvg.ts');

  const dirs = [
    path.resolve(process.cwd(), 'diagrams'),
    path.resolve(process.cwd(), 'public/diagrams'),
    path.resolve(process.cwd(), 'dist/diagrams')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // 1. Write Topology Diagram
  const topologySvg = yorkDiagramModule.YORK_DIAGRAM_SVG;
  for (const dir of dirs) {
    fs.writeFileSync(path.join(dir, 'DLC-York-Topology.svg'), topologySvg.trim(), 'utf8');
    fs.writeFileSync(path.join(dir, 'York_Topology.svg'), topologySvg.trim(), 'utf8');
  }
  console.log('DLC-York-Topology.svg created');

  // 2. Write York Heat Map Plans
  const plans = yorkHeatMapsModule.YORK_HEATMAP_PLANS;
  for (const plan of plans) {
    const svgFilename = plan.fileSource.replace('.png', '.svg');
    const pngFilename = plan.fileSource;

    for (const dir of dirs) {
      // Write SVG
      fs.writeFileSync(path.join(dir, svgFilename), plan.svgContent.trim(), 'utf8');
      // Also write with underscores and dashes normalized
      fs.writeFileSync(path.join(dir, `${plan.id}.svg`), plan.svgContent.trim(), 'utf8');
      // Write SVG copy named as .png or SVG for direct reference
      fs.writeFileSync(path.join(dir, pngFilename), plan.svgContent.trim(), 'utf8');
    }
    console.log(`Created ${svgFilename} & ${pngFilename} for plan ${plan.title}`);
  }

  console.log('All diagram & heat map files generated successfully!');
}

main().catch(err => {
  console.error('Error generating diagrams:', err);
  process.exit(1);
});
