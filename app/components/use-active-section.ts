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

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
