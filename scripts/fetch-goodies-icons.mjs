// Pulls a favicon for every entry in app/goodies.ts into public/goodies, and
// writes a manifest of the ones it managed to get.
//
// The icons are committed rather than hotlinked. Hotlinking an icon service
// means every visitor requests somebody else's server once per row, and the
// page quietly breaks the day that service changes its URLs.
//
// Icons come from the site itself, read out of its own <link rel="icon">,
// falling back to /favicon.ico. A shared icon service was the first attempt
// and it silently returned the same generic placeholder for a third of these,
// which is worse than no icon because it looks deliberate.
//
// Run with: npm run goodies:icons

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "app", "goodies.ts");
const OUT_DIR = path.join(ROOT, "public", "goodies");

const UA =
  "Mozilla/5.0 (compatible; design.ryancuff.com icon fetcher; +https://design.ryancuff.com)";

const ACCEPTED = new Set([
  "image/png",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/svg+xml",
  "image/jpeg",
  "image/webp",
]);

/**
 * Rendered size is 16px, so anything larger than this is bytes nobody sees.
 * Two times for a retina screen.
 */
const RENDER_PX = 32;

/** Entries whose mark the page draws itself. See `inlineIcon` in goodies.ts. */
const INLINE = new Set(["easeui"]);

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

/**
 * Pulls the largest PNG out of an .ico.
 *
 * sharp cannot read the ico container, but most modern ones are just a
 * directory of embedded PNGs, and those sharp reads fine. The header is six
 * bytes, then one sixteen byte entry per image, each carrying the size and
 * offset of its data. Returns null for the older BMP-encoded kind.
 */
function pngFromIco(bytes) {
  if (bytes.length < 6 || bytes.readUInt16LE(2) !== 1) return null;

  const count = bytes.readUInt16LE(4);
  let best = null;

  for (let i = 0; i < count; i += 1) {
    const entry = 6 + i * 16;
    if (entry + 16 > bytes.length) break;

    const size = bytes.readUInt32LE(entry + 8);
    const offset = bytes.readUInt32LE(entry + 12);
    if (offset + size > bytes.length) continue;

    const data = bytes.subarray(offset, offset + size);
    if (!data.subarray(0, 4).equals(PNG_MAGIC)) continue;
    if (!best || data.length > best.length) best = data;
  }

  return best;
}

/**
 * Reads the ids and urls straight out of the data file.
 *
 * Requiring `name` immediately after `id` is what keeps the group headings
 * out of the results. They carry `title` instead, and without this the first
 * entry of each group gets written under its group's id.
 */
async function readEntries() {
  const source = await readFile(SOURCE, "utf8");
  const pattern =
    /id:\s*"([^"]+)",\s*\n\s*name:\s*"[^"]*",[\s\S]*?href:\s*"([^"]+)"/g;

  return [...source.matchAll(pattern)].map(([, id, href]) => ({ id, href }));
}

function get(url) {
  return fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
}

/** Icon urls the page declares, best first, then the conventional fallback. */
async function candidates(href) {
  const origin = new URL(href).origin;
  const found = [];

  try {
    const response = await get(href);
    if (response.ok) {
      const html = await response.text();

      for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
        const tag = match[0];
        if (!/rel\s*=\s*["'][^"']*icon/i.test(tag)) continue;

        const iconHref = tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
        if (!iconHref || iconHref.startsWith("data:")) continue;

        /*
         * Apple touch icons are the largest and cleanest, so they sort
         * first. An .ico sorts last: sharp cannot decode one, so it ships at
         * whatever size it arrived, and some of these are over 100kB.
         */
        const isIco = /\.ico(\?|$)/i.test(iconHref);
        const weight = /apple-touch/i.test(tag) ? 0 : isIco ? 2 : 1;
        found.push({ weight, url: new URL(iconHref, response.url).href });
      }
    }
  } catch {
    // The page itself failed. The fallback below may still work.
  }

  found.sort((a, b) => a.weight - b.weight);
  return [...found.map((entry) => entry.url), `${origin}/favicon.ico`];
}

async function fetchIcon(href) {
  for (const url of await candidates(href)) {
    try {
      const response = await get(url);
      if (!response.ok) continue;

      const type = (response.headers.get("content-type") ?? "")
        .split(";")[0]
        .trim()
        .toLowerCase();
      if (!ACCEPTED.has(type)) continue;

      const bytes = Buffer.from(await response.arrayBuffer());
      // A handful of bytes is an error page or a placeholder, not an icon.
      if (bytes.length < 100) continue;

      // An svg is already small and scales, so it goes through untouched.
      if (type === "image/svg+xml") {
        return { bytes, extension: "svg", url, original: bytes.length };
      }

      /*
       * Everything else is flattened to a small png. These arrive as
       * multi-resolution icons and 180px apple touch icons, several of them
       * over 100kB, to be drawn in a 16px box. Downscaling here is the
       * difference between 400kB of favicons and about 20.
       */
      // An ico has to be unpacked before sharp will look at it.
      const decodable = pngFromIco(bytes) ?? bytes;

      try {
        const resized = await sharp(decodable, { pages: 1 })
          .resize(RENDER_PX, RENDER_PX, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png({ compressionLevel: 9 })
          .toBuffer();

        return {
          bytes: resized,
          extension: "png",
          url,
          original: bytes.length,
        };
      } catch {
        // Almost always an .ico, which sharp does not read. Ship it as it
        // came rather than dropping the icon.
        return { bytes, extension: "ico", url, original: bytes.length };
      }
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const entries = await readEntries();
  const manifest = {};

  for (const { id, href } of entries) {
    // Drawn in the page so it can take the theme's color. Fetching the real
    // favicon would put a fixed black or white octagon back.
    if (INLINE.has(id)) {
      console.log(`skip  ${id}  drawn in the page`);
      continue;
    }

    const icon = await fetchIcon(href);

    if (!icon) {
      console.log(`miss  ${id}`);
      continue;
    }

    const file = `${id}.${icon.extension}`;
    await writeFile(path.join(OUT_DIR, file), icon.bytes);
    manifest[id] = `/goodies/${file}`;
    console.log(
      `ok    ${id}  ${icon.original}b -> ${icon.bytes.length}b  ${icon.url}`,
    );
  }

  await writeFile(
    path.join(ROOT, "app", "goodies-icons.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  console.log(`\n${Object.keys(manifest).length}/${entries.length} icons`);
}

await main();
