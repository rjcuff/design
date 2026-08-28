import { readFile } from "node:fs/promises";

import {
  ARCHIVE_FILENAME,
  ARCHIVE_PATH,
  verifyDownloadToken,
} from "@/app/lib/download";

/**
 * Serves the product file to anyone holding a valid signed token.
 *
 * The file is not in `public/`, so this handler is the only route to it.
 */

export const runtime = "nodejs";
// Never cached. A cached response would outlive the token that authorized it.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  const result = verifyDownloadToken(token);

  if (!result.valid) {
    // Expired is worth distinguishing, because it is the one failure a real
    // buyer hits and they need to be told to ask for a fresh link. Forgery
    // attempts get nothing back beyond a 403.
    if (result.reason === "expired") {
      return new Response(
        "This download link has expired. Reply to your receipt and I will send a new one.",
        { status: 410 },
      );
    }

    console.warn(`[download] rejected token: ${result.reason}`);
    return new Response("Invalid token", { status: 403 });
  }

  let file: Buffer;

  try {
    file = await readFile(ARCHIVE_PATH);
  } catch (error) {
    // A paying customer with a valid token and no file. Loud: this is a
    // deployment problem, usually the archive missing from the bundle.
    console.error("[download] ARCHIVE MISSING", error);
    return new Response("The file is temporarily unavailable.", {
      status: 500,
    });
  }

  console.info(`[download] served for session ${result.sessionId}`);

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(file.byteLength),
      "Content-Disposition": `attachment; filename="${ARCHIVE_FILENAME}"`,
      // Belt and braces with `force-dynamic`: keep it out of every cache
      // between here and the browser.
      "Cache-Control": "private, no-store",
    },
  });
}
