"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./thanks.module.css";

/** Sweep length, matched to the css transition on `.filling`. */
const SWEEP_MS = 900;
/** How long "saved" sits before the page goes home. */
const SETTLE_MS = 1600;

type Phase = "idle" | "saving" | "saved";

/**
 * Starts the download, reports that it started, then returns home.
 *
 * A plain anchor underneath, so the file still downloads if this never
 * hydrates. The sweep and the redirect are the enhancement, not the mechanism.
 */
export function DownloadButton({ href }: { href: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer);
    },
    [],
  );

  const start = () => {
    // Clicking again mid-sweep should not restack the timers or restart the
    // fill that is already reporting a download in flight.
    if (phase !== "idle") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setPhase("saving");

    timers.current.push(
      setTimeout(() => setPhase("saved"), reduced ? 0 : SWEEP_MS),
      setTimeout(() => router.push("/"), (reduced ? 0 : SWEEP_MS) + SETTLE_MS),
    );
  };

  return (
    <div>
      <a
        href={href}
        onClick={start}
        className={styles.button}
        // The response carries Content-Disposition, so the browser saves the
        // file and stays put. This is belt and braces for the odd client that
        // would otherwise navigate.
        download
      >
        <span
          aria-hidden="true"
          className={`${styles.fill} ${
            phase === "saving"
              ? styles.filling
              : phase === "saved"
                ? styles.done
                : ""
          }`}
        />
        <span className={styles.label}>
          {phase === "idle" ? "download the pack" : "saved to your downloads"}
        </span>
      </a>

      {/* Announced rather than only shown, since the button label changing is
          the only signal that anything happened. */}
      <p aria-live="polite" className="text-text-muted mt-3 text-sm leading-6">
        {phase === "idle"
          ? "the link works for 24 hours. save the files somewhere you will find them again."
          : "taking you back home. if nothing downloaded, click again."}
      </p>
    </div>
  );
}
