import { createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";

import { requireEnv } from "./env";

/**
 * Signed download links.
 *
 * The product file lives outside `public/`, so it has no url of its own. The
 * only way to it is a token this module signs, and the signature is what makes
 * the token unforgeable. The payload is readable, but changing so much as the
 * expiry invalidates it.
 *
 * Deliberately stateless. There is no database, so a link cannot be revoked or
 * counted, only outlived. The short window is the whole defense, since a link posted
 * somewhere public stops working within a day.
 */

/** How long a minted link stays valid. */
export const LINK_TTL_SECONDS = 24 * 60 * 60;

/** Lives in `assets/`, never `public/`, or it would be served directly. */
export const ARCHIVE_PATH = path.join(
  process.cwd(),
  "assets",
  "ease-out-skills-v1.0.0.zip",
);

/** What the buyer's browser saves it as. */
export const ARCHIVE_FILENAME = "ease-out-skills-v1.0.0.zip";

interface Payload {
  /** Expiry, unix seconds. */
  exp: number;
  /** Stripe checkout session, so a leaked link is attributable to a sale. */
  sid: string;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(body: string): string {
  return base64url(
    createHmac("sha256", requireEnv("DOWNLOAD_SIGNING_SECRET"))
      .update(body)
      .digest(),
  );
}

/** Mints a token valid for `LINK_TTL_SECONDS` from now. */
export function createDownloadToken(sessionId: string): string {
  const payload: Payload = {
    exp: Math.floor(Date.now() / 1000) + LINK_TTL_SECONDS,
    sid: sessionId,
  };

  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export type TokenResult =
  | { valid: true; sessionId: string }
  | { valid: false; reason: "malformed" | "bad-signature" | "expired" };

export function verifyDownloadToken(token: string): TokenResult {
  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return { valid: false, reason: "malformed" };
  }

  const expected = sign(body);

  // Compare in constant time. A plain `===` leaks where two signatures first
  // differ through how long it takes to fail, which is enough to forge one a
  // byte at a time.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "bad-signature" };
  }

  let payload: Payload;

  try {
    payload = JSON.parse(
      Buffer.from(
        body.replace(/-/g, "+").replace(/_/g, "/"),
        "base64",
      ).toString(),
    );
  } catch {
    return { valid: false, reason: "malformed" };
  }

  if (typeof payload.exp !== "number" || typeof payload.sid !== "string") {
    return { valid: false, reason: "malformed" };
  }

  // Checked only after the signature, so an attacker cannot learn anything by
  // submitting a token with an edited expiry.
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true, sessionId: payload.sid };
}
