"use client";

import { ThemeProvider } from "next-themes";

/**
 * Theme state for the whole app.
 *
 * `attribute="data-theme"` matches what globals.css keys the light palette
 * off, and next-themes injects its own blocking script, so there is no flash
 * and nothing here to hand-roll.
 *
 * System preference is off on purpose: dark is the site's default look, and
 * the toggle is an explicit choice rather than a correction to the OS.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      // The view transition in the toggle does its own crossfade. Letting
      // next-themes also suppress transitions fights it.
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
