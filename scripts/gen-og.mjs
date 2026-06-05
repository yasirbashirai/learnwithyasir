// One-off: render the branded Open Graph share image (1200x630) to public/og-image.png.
// Run with: node scripts/gen-og.mjs   (requires devDependency `sharp`)
import sharp from "sharp";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f2e27"/><stop offset="0.55" stop-color="#11463a"/><stop offset="1" stop-color="#06201b"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#288672"/><stop offset="0.6" stop-color="#36c8a9"/><stop offset="1" stop-color="#e2a93c"/>
    </linearGradient>
    <radialGradient id="glow" cx="18%" cy="8%" r="70%">
      <stop offset="0" stop-color="#36c8a9" stop-opacity="0.35"/><stop offset="1" stop-color="#36c8a9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(80,80)">
    <rect width="92" height="92" rx="24" fill="url(#brand)"/>
    <text x="46" y="63" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="#fff" text-anchor="middle" letter-spacing="-2">YB</text>
    <text x="116" y="40" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#ffffff">learn<tspan fill="#36c8a9">withyasir</tspan></text>
    <text x="116" y="74" font-family="Arial, sans-serif" font-size="20" fill="#9fdccb">by Yasir Bashir</text>
  </g>
  <text x="80" y="300" font-family="Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff" letter-spacing="-2">Master AI, Automation</text>
  <text x="80" y="386" font-family="Arial, sans-serif" font-size="76" font-weight="800" letter-spacing="-2"><tspan fill="#ffffff">&amp; Web — </tspan><tspan fill="#36c8a9">build &amp; earn.</tspan></text>
  <text x="80" y="452" font-family="Arial, sans-serif" font-size="30" fill="#cfe9e1">24 project-first courses · one month per skill · learn to land clients</text>
  <g transform="translate(80,506)">
    <rect width="232" height="64" rx="32" fill="url(#brand)"/>
    <text x="116" y="41" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#0f2e27" text-anchor="middle">Start learning free</text>
    <text x="270" y="41" font-family="Arial, sans-serif" font-size="22" fill="#9fdccb">learnwith.yasirbashir.com</text>
  </g>
  <g opacity="0.9">
    <text x="980" y="250" font-size="120" text-anchor="middle">🤖</text>
    <text x="1080" y="380" font-size="90" text-anchor="middle">⚡</text>
    <text x="930" y="430" font-size="80" text-anchor="middle">🚀</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og-image.png");
console.log("✅ public/og-image.png (1200x630) written");
