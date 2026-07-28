// utils/generatePoster.js
//
// Generates a stylized placeholder poster as an SVG data URI — entirely
// offline, no external API, no API key, no network request, and it can
// never 404 or "corrupt" because nothing is being fetched.
//
// If you later want real movie poster artwork, that has to come from a
// licensed source (e.g. TMDB) since poster art is copyrighted — but for
// a working, good-looking placeholder that ships with your own API,
// this is the reliable option.

// Genre → gradient colors (feel free to restyle these)
const GENRE_THEMES = {
  "Sci-Fi":    ["#1e1b4b", "#4338ca"],
  "Action":    ["#450a0a", "#dc2626"],
  "Drama":     ["#0f172a", "#0ea5e9"],
  "Comedy":    ["#451a03", "#f59e0b"],
  "Thriller":  ["#18181b", "#7c3aed"],
  "Default":   ["#111827", "#374151"],
};

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Wrap long titles onto multiple lines so they don't overflow the card
function wrapText(text, maxCharsPerLine = 16) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Build an SVG poster and return it as a data URI string —
 * ready to drop straight into a `poster` field.
 */
function generatePoster({ title, genre, rating, language }) {
  const [colorTop, colorBottom] = GENRE_THEMES[genre] ?? GENRE_THEMES.Default;
  const lines = wrapText(title, 16);
  const lineHeight = 34;
  const startY = 340 - ((lines.length - 1) * lineHeight) / 2;

  const titleTspans = lines
    .map(
      (line, i) =>
        `<tspan x="250" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("");

  const svg = `
<svg width="500" height="750" viewBox="0 0 500 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colorTop}" />
      <stop offset="100%" stop-color="${colorBottom}" />
    </linearGradient>
  </defs>

  <rect width="500" height="750" fill="url(#bg)" />

  <!-- Decorative frame -->
  <rect x="24" y="24" width="452" height="702" fill="none"
        stroke="rgba(255,255,255,0.15)" stroke-width="2" />

  <!-- Genre tag -->
  <text x="250" y="120" text-anchor="middle" font-family="Georgia, serif"
        font-size="14" letter-spacing="6" fill="rgba(255,255,255,0.55)"
        text-transform="uppercase">${escapeXml((genre ?? "FILM").toUpperCase())}</text>

  <!-- Title -->
  <text x="250" y="${startY}" text-anchor="middle" font-family="Georgia, serif"
        font-weight="bold" font-size="30" fill="#ffffff">${titleTspans}</text>

  <!-- Divider -->
  <line x1="180" y1="${startY + 40}" x2="320" y2="${startY + 40}"
        stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />

  <!-- Rating badge -->
  ${
    rating
      ? `<text x="250" y="${startY + 80}" text-anchor="middle"
          font-family="Georgia, serif" font-size="18" fill="rgba(255,215,110,0.9)">★ ${escapeXml(rating)}</text>`
      : ""
  }

  <!-- Language footer -->
  ${
    language
      ? `<text x="250" y="700" text-anchor="middle" font-family="Georgia, serif"
          font-size="12" letter-spacing="3" fill="rgba(255,255,255,0.35)">${escapeXml(language.toUpperCase())}</text>`
      : ""
  }
</svg>`.trim();

  const base64 = Buffer.from(svg, "utf-8").toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

module.exports = { generatePoster };