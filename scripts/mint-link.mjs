#!/usr/bin/env node
/**
 * Mints a fresh download link by hand.
 *
 * For the case that will actually happen: someone emails saying their link
 * expired, or a payment came through and the automated page did not work for
 * them. Run this, paste the result into a reply.
 *
 *   node scripts/mint-link.mjs                 uses the local site
 *   node scripts/mint-link.mjs cs_live_abc123  notes which sale it was for
 *   SITE=https://design.ryancuff.com node scripts/mint-link.mjs
 *
 * Reads DOWNLOAD_SIGNING_SECRET from .env.local, so it produces links the
 * deployed site will accept only if the same secret is set there.
 */
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

const TTL_SECONDS = 24 * 60 * 60;

function readSecret() {
  if (process.env.DOWNLOAD_SIGNING_SECRET) {
    return process.env.DOWNLOAD_SIGNING_SECRET;
  }

  let file;
  try {
    file = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    throw new Error(
      "No .env.local found and DOWNLOAD_SIGNING_SECRET is unset.",
    );
  }

  const line = file
    .split("\n")
    .find((entry) => entry.startsWith("DOWNLOAD_SIGNING_SECRET="));

  const value = line?.slice("DOWNLOAD_SIGNING_SECRET=".length).trim();

  if (!value) {
    throw new Error("DOWNLOAD_SIGNING_SECRET is missing from .env.local.");
  }

  return value;
}

const base64url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const secret = readSecret();
const sessionId = process.argv[2] ?? "manual";
const site = process.env.SITE ?? "http://localhost:3000";

const body = base64url(
  JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
    sid: sessionId,
  }),
);
const signature = base64url(createHmac("sha256", secret).update(body).digest());

const expires = new Date(Date.now() + TTL_SECONDS * 1000);

console.log(`\n${site}/api/download?token=${body}.${signature}\n`);
console.log(`for:     ${sessionId}`);
console.log(`expires: ${expires.toISOString()} (24 hours)\n`);
