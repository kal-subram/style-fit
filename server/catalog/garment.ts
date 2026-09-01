// Generates a garment illustration (data-URI SVG) per category, tinted to the
// product's color. Keeps the demo catalog self-contained — no external images.

const COLOR_HEX: Record<string, string> = {
  navy: "#26314f", charcoal: "#3a434d", grey: "#8a9099", gray: "#8a9099",
  black: "#20232a", white: "#eef0f4", cream: "#efe6d3", sand: "#dccca8",
  stone: "#d3c8b4", "light blue": "#bcd6f2", sky: "#9cc2e8", blue: "#3f6fd1",
  olive: "#6b7043", sage: "#9caf88", green: "#3f8b5a", indigo: "#33407a",
  brown: "#6b4a34", camel: "#c39a63", red: "#c8443b",
};

function hexFor(color: string): string {
  return COLOR_HEX[color.toLowerCase()] ?? "#7c9cff";
}

// Perceived luminance → pick a garment fill that contrasts the tinted panel.
function isLight(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

// Silhouettes on a 300x400 (3:4) canvas.
const SILHOUETTES: Record<string, string> = {
  tops:
    "M110 96 L88 84 L58 116 L82 148 L104 134 L104 322 L196 322 L196 134 L218 148 L242 116 L212 84 L190 96 C168 118 132 118 110 96 Z",
  bottoms:
    "M112 82 H188 L182 324 H150 L150 178 L146 324 H116 Z",
  outerwear:
    "M104 92 L70 112 L86 154 L104 142 L104 322 L150 322 L150 100 L150 322 L196 322 L196 142 L214 154 L230 112 L196 92 L170 102 L150 98 L130 102 Z",
  shoes:
    "M58 252 L58 224 Q58 200 92 196 L150 186 Q182 182 206 212 L236 238 Q248 250 236 258 L70 258 Q58 258 58 252 Z",
};

/** A data-URI SVG showing the garment for this category, tinted to `color`. */
export function garmentImage(category: string, color: string): string {
  const hex = hexFor(color);
  const path = SILHOUETTES[category] ?? SILHOUETTES.tops;
  const garment = isLight(hex) ? "#2b2f3a" : "#f4f6fb";
  const detail = isLight(hex) ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.4)";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="${hex}"/><stop offset="100%" stop-color="${hex}cc"/>
</linearGradient></defs>
<rect width="300" height="400" fill="url(#bg)"/>
<path d="${path}" fill="${garment}"/>
<path d="${path}" fill="none" stroke="${detail}" stroke-width="2"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
