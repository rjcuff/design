#!/usr/bin/env node
/**
 * Rebuilds the archive that buyers download, from whatever is in `skills/`.
 *
 * Run it after any edit to a skill. The archive lives in `assets/` and is
 * committed, so a stale one ships silently: the site keeps working and the
 * buyer gets the previous version with no error anywhere.
 *
 *   npm run build:pack
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "skills");
const out = join(root, "assets");
const archive = join(out, "ease-out-skills-v1.0.0.zip");

mkdirSync(out, { recursive: true });
rmSync(archive, { force: true });

// Compress-Archive keeps this dependency free on Windows. The glob puts the
// skill directories at the root of the zip rather than inside a `skills/`
// folder, which is what a buyer wants to drop straight into their project.
execFileSync(
  "powershell.exe",
  [
    "-NoProfile",
    "-Command",
    `Compress-Archive -Path '${join(source, "*")}' -DestinationPath '${archive}' -CompressionLevel Optimal`,
  ],
  { stdio: "inherit" },
);

const size = (statSync(archive).size / 1024).toFixed(1);
console.log(`\nbuilt assets/ease-out-skills-v1.0.0.zip (${size} KB)`);
console.log("commit it, or the deployed site keeps serving the old one.\n");
