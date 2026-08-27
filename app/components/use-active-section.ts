"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently under the top of the viewport, so the
 * sidebar can highlight the matching nav item while the page scrolls.
 */
export function useActiveSection(ids: readonly string[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }

        // Keep the earliest visible section so scrolling up feels stable.
        const next = ids.find((id) => visible.has(id));

        if (next) {
          setActiveId(next);
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    // The band above sits near the top of the viewport, and the page runs out
    // of scroll before the last section can reach it. Without this, the final
    // nav item never lights up.
    let frame: number | null = null;

    const onScroll = () => {
      if (frame !== null) return;

      frame = requestAnimationFrame(() => {
        frame = null;

        const scrolled = window.innerHeight + window.scrollY;
        const atBottom = scrolled >= document.documentElement.scrollHeight - 2;

        if (atBottom) {
          setActiveId(ids[ids.length - 1]);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return activeId;
}
