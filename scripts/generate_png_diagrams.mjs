import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public', 'diagrams');
const rootDir = path.join(process.cwd(), 'diagrams');
const distDir = path.join(process.cwd(), 'dist', 'diagrams');

[publicDir, rootDir, distDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function convertSvgToPng(svgPath, targetPngName) {
  if (!fs.existsSync(svgPath)) {
    console.error(`SVG not found: ${svgPath}`);
    return;
  }
  const svgBuffer = fs.readFileSync(svgPath);

  try {
    const pngBuffer = await sharp(svgBuffer, { density: 300 })
      .png({ quality: 100, compressionLevel: 6 })
      .toBuffer();

    [publicDir, rootDir, distDir].forEach(d => {
      fs.writeFileSync(path.join(d, targetPngName), pngBuffer);
    });

    console.log(`Generated high-res binary PNG: ${targetPngName} (${pngBuffer.length} bytes)`);
  } catch (err) {
    console.error(`Failed to rasterize ${svgPath}:`, err.message);
  }
}

async function run() {
  const items = [
    { svg: 'York_-_Ground_Floor_Signal_Strength.svg', png: 'York_-_Ground_Floor_Signal_Strength.png' },
    { svg: 'York_-_First_Floor_Signal_Strength.svg', png: 'York_-_First_Floor_Signal_Strength.png' },
    { svg: 'York_-_Site_Signal_Strength.svg', png: 'York_-_Site_Signal_Strength.png' },
    { svg: 'ground_floor.svg', png: 'ground_floor.png' },
    { svg: 'first_floor.svg', png: 'first_floor.png' },
    { svg: 'site_plan.svg', png: 'site_plan.png' },
    { svg: 'DLC-York-Topology.svg', png: 'DLC-York-Topology.png' },
    { svg: 'York_Topology.svg', png: 'York_Topology.png' }
  ];

  for (const item of items) {
    const svgPath = path.join(publicDir, item.svg);
    await convertSvgToPng(svgPath, item.png);
  }

  console.log('Finished generating all diagram PNGs successfully.');
}

run();
