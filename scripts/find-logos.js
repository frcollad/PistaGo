const fs = require("fs");
const path = require("path");

const CLUBS = [
  { id: "lapoblaindoor", base: "https://padellapoblaindoor.matchpoint.com.es" },
  { id: "bonpadel",      base: "https://bonpadel.matchpoint.com.es" },
  { id: "interclubmeliana", base: "https://padelinterclubmeliana.matchpoint.com.es" },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

async function findLogo(club) {
  const r = await fetch(`${club.base}/Booking/Grid.aspx`, { headers: { "User-Agent": UA } });
  const html = await r.text();

  // Find all img srcs
  const imgs = [...html.matchAll(/<img[^>]+src=['"](.*?)['"]/gi)].map(m => m[1]);
  console.log(`\n${club.id} — images found:`);
  imgs.forEach(i => console.log("  ", i));

  // Also look for logo in CSS background-image or in the link favicon
  const favicon = html.match(/rel=["']shortcut icon["'][^>]+href=['"](.*?)['"]/i)?.[1]
    || html.match(/href=['"](.*?)["'][^>]+rel=["']shortcut icon["']/i)?.[1];
  console.log("  favicon:", favicon);

  // Try to resolve a logo URL from the page context
  // Matchpoint structure: ../ClubName/img/logo.xxx
  const logoCandidate = imgs.find(i =>
    i.toLowerCase().includes("logo") ||
    i.toLowerCase().includes("brand") ||
    i.toLowerCase().includes("header")
  );
  return { club: club.id, base: club.base, logoCandidate, favicon, imgs };
}

(async () => {
  const results = await Promise.all(CLUBS.map(findLogo));

  for (const r of results) {
    if (r.logoCandidate) {
      // Resolve relative URL: "../ClubFolder/img/logo.png" from /Booking/ => /ClubFolder/img/logo.png
      const resolved = new URL(r.logoCandidate, r.base + "/Booking/Grid.aspx").href;
      console.log(`\n✓ ${r.club} logo URL: ${resolved}`);

      // Download it
      const ext = resolved.split(".").pop().split("?")[0];
      const outPath = path.join(__dirname, `../frontend/public/logos/${r.club}.${ext}`);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      const imgRes = await fetch(resolved, { headers: { "User-Agent": UA } });
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(outPath, buf);
      console.log(`  Saved to logos/${r.club}.${ext} (${buf.length} bytes)`);
    }
  }
})().catch(console.error);
