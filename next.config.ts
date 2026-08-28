import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The product archive lives outside `public/` so it has no url of its own,
  // and is read from disk by the download route. Nothing imports it, so the
  // build tracer cannot see that the route needs it and would leave it out of
  // the deployed bundle. Then every download 500s in production and works
  // perfectly in dev.
  outputFileTracingIncludes: {
    "/api/download": ["./assets/**/*"],
  },
};

export default nextConfig;
