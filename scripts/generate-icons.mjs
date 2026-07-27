import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "public", "icons");
mkdirSync(iconsDir, { recursive: true });

const { Resvg, initWasm } = await import("@resvg/resvg-wasm");
const wasmPath = join(__dirname, "..", "node_modules/@resvg/resvg-wasm/index_bg.wasm");
await initWasm(readFileSync(wasmPath));

const svgNormal = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="url(#grad1)"/>
  <circle cx="440" cy="72" r="96" fill="white" opacity="0.05"/>
  <circle cx="72" cy="440" r="128" fill="white" opacity="0.05"/>
  <circle cx="192" cy="160" r="40" fill="white"/>
  <rect x="152" y="224" width="80" height="192" rx="40" fill="white"/>
  <circle cx="352" cy="208" r="28.8" fill="white" opacity="0.95"/>
  <rect x="323.2" y="272" width="57.6" height="144" rx="28.8" fill="white" opacity="0.95"/>
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#334155;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#475569;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>`;

// Maskable icon: add safe zone padding (80% of original content area)
const svgMaskable = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="url(#grad1)"/>
  <circle cx="440" cy="72" r="96" fill="white" opacity="0.05"/>
  <circle cx="72" cy="440" r="128" fill="white" opacity="0.05"/>
  <circle cx="192" cy="160" r="40" fill="white"/>
  <rect x="152" y="224" width="80" height="192" rx="40" fill="white"/>
  <circle cx="352" cy="208" r="28.8" fill="white" opacity="0.95"/>
  <rect x="323.2" y="272" width="57.6" height="144" rx="28.8" fill="white" opacity="0.95"/>
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#334155;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#475569;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>`;

function renderIcon(svg, size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

const icons = [
  { svg: svgNormal, name: "icon-192.png", size: 192 },
  { svg: svgNormal, name: "icon-512.png", size: 512 },
  { svg: svgMaskable, name: "icon-192-maskable.png", size: 192 },
  { svg: svgMaskable, name: "icon-512-maskable.png", size: 512 },
];

for (const icon of icons) {
  const png = renderIcon(icon.svg, icon.size);
  writeFileSync(join(iconsDir, icon.name), png);
  console.log(`Created ${icon.name} (${icon.size}x${icon.size})`);
}

console.log("All icons generated.");
