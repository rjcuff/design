/**
 * Server-only environment access.
 *
 * Read through this rather than touching `process.env` at a call site, so a
 * missing variable fails immediately with a message naming it, instead of
 * failing later as an unexplained 401 from whichever api was reached with
 * `undefined` in a header.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    // The name only. Never interpolate the value, since these are secrets and
    // errors reach logs.
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
